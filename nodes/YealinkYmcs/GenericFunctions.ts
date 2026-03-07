import * as crypto from 'crypto';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import * as https from 'https';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import * as querystring from 'querystring';

import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

// ---------------------------------------------------------------------------
// Site list cache (used by the Parent Site resource locator)
// ---------------------------------------------------------------------------

const SITE_LIST_CACHE_TTL = 15 * 60 * 1000; // 15 minutes

interface CachedSiteList {
	sites: IDataObject[];
	expiresAt: number;
}

const siteListCache = new Map<string, CachedSiteList>();

export async function getCachedSiteList(context: ILoadOptionsFunctions): Promise<IDataObject[]> {
	const credentials = await context.getCredentials('yealinkYmcsApi');
	const cacheKey = credentials.clientId as string;

	const cached = siteListCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.sites;
	}

	// Paginate through all sites
	const sites: IDataObject[] = [];
	const pageSize = 500;
	let skip = 0;
	let total: number | null = null;

	do {
		const response: IDataObject = await ymcsApiRequest.call(context, 'POST', '/v2/dm/listSites', {
			skip,
			limit: pageSize,
			autoCount: total === null,
		});
		if (total === null) total = (response.total as number) ?? 0;
		const items = (response.data as IDataObject[]) ?? [];
		sites.push(...items);
		skip += items.length;
		if (items.length === 0) break;
	} while (skip < total!);

	siteListCache.set(cacheKey, { sites, expiresAt: Date.now() + SITE_LIST_CACHE_TTL });
	return sites;
}

// ---------------------------------------------------------------------------
// RPS server list cache (used by the Server resource locator on RPS Create)
// ---------------------------------------------------------------------------

const rpsServerListCache = new Map<string, CachedSiteList>();

export async function getCachedRpsServerList(context: ILoadOptionsFunctions): Promise<IDataObject[]> {
	const credentials = await context.getCredentials('yealinkYmcsApi');
	const cacheKey = credentials.clientId as string;

	const cached = rpsServerListCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached.sites;

	const servers: IDataObject[] = [];
	const pageSize = 500;
	let skip = 0;
	let total: number | null = null;

	do {
		const response: IDataObject = await ymcsApiRequest.call(context, 'POST', '/v2/rps/listServers', {
			skip,
			limit: pageSize,
			autoCount: total === null,
		});
		if (total === null) total = (response.total as number) ?? 0;
		const items = (response.data as IDataObject[]) ?? [];
		servers.push(...items);
		skip += items.length;
		if (items.length === 0) break;
	} while (skip < total!);

	rpsServerListCache.set(cacheKey, { sites: servers, expiresAt: Date.now() + SITE_LIST_CACHE_TTL });
	return servers;
}

// ---------------------------------------------------------------------------
// Custom HTTPS agent for Yealink YMCS API servers.
// The Yealink API servers require TLS renegotiation which OpenSSL 3.x
// disables by default. We use a dedicated agent with SSL_OP_LEGACY_SERVER_CONNECT
// so only connections through this agent are affected.
// ---------------------------------------------------------------------------

const ymcsAgent = new https.Agent({
	secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
	keepAlive: true,
});

// ---------------------------------------------------------------------------
// Low-level HTTPS request using the custom agent
// ---------------------------------------------------------------------------

interface YmcsRequestOptions {
	method: string;
	url: string;
	headers?: Record<string, string>;
	body?: unknown;
	qs?: Record<string, string | number | boolean>;
}

async function ymcsRawRequest(options: YmcsRequestOptions): Promise<unknown> {
	const parsedUrl = new URL(options.url);

	if (options.qs && Object.keys(options.qs).length) {
		const qsStr = querystring.stringify(options.qs as Record<string, string>);
		parsedUrl.search = parsedUrl.search ? `${parsedUrl.search}&${qsStr}` : `?${qsStr}`;
	}

	const bodyStr =
		options.body != null
			? typeof options.body === 'string'
				? options.body
				: JSON.stringify(options.body)
			: undefined;

	return new Promise((resolve, reject) => {
		const req = https.request(
			{
				hostname: parsedUrl.hostname,
				port: parsedUrl.port || 443,
				path: parsedUrl.pathname + parsedUrl.search,
				method: options.method,
				headers: {
					...options.headers,
					...(bodyStr != null ? { 'Content-Length': String(Buffer.byteLength(bodyStr)) } : {}),
				},
				agent: ymcsAgent,
			},
			(res) => {
				const chunks: Buffer[] = [];
				res.on('data', (chunk: Buffer) => chunks.push(chunk));
				res.on('end', () => {
					const raw = Buffer.concat(chunks).toString('utf8');
					const statusCode = res.statusCode ?? 0;

					let parsed: unknown;
					try {
						parsed = JSON.parse(raw);
					} catch {
						parsed = raw;
					}

					if (statusCode >= 400) {
						const err: Record<string, unknown> = {
							message: `Request failed with status ${statusCode}`,
							httpCode: statusCode,
							response: { body: parsed },
						};
						reject(err);
						return;
					}

					resolve(parsed);
				});
			},
		);

		req.on('error', (err) => {
			reject({
				message: err.message,
				code: (err as NodeJS.ErrnoException).code,
			});
		});

		if (bodyStr != null) {
			req.write(bodyStr);
		}
		req.end();
	});
}

// ---------------------------------------------------------------------------
// Region → Base URL mapping
// ---------------------------------------------------------------------------

const REGION_HOSTS: Record<string, string> = {
	us: 'https://us-api.ymcs.yealink.com',
	eu: 'https://eu-api.ymcs.yealink.com',
	au: 'https://au-api.ymcs.yealink.com',
};

export function getBaseUrl(region: string): string {
	return REGION_HOSTS[region] ?? REGION_HOSTS.us;
}

// ---------------------------------------------------------------------------
// Nonce generator
// ---------------------------------------------------------------------------

export function generateNonce(): string {
	const chars = '0123456789abcdef';
	let result = '';
	for (let i = 0; i < 32; i++) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

// ---------------------------------------------------------------------------
// Token cache
// ---------------------------------------------------------------------------

interface CachedToken {
	token: string;
	expiresAt: number;
}

const tokenCache = new Map<string, CachedToken>();

export async function getAccessToken(
	_context: unknown,
	credentials: IDataObject,
): Promise<string> {
	const clientId = credentials.clientId as string;
	const clientSecret = credentials.clientSecret as string;
	const cached = tokenCache.get(clientId);

	// Return cached token if still valid (5-minute safety margin)
	if (cached && cached.expiresAt > Date.now()) {
		return cached.token;
	}

	const region = credentials.region as string;
	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

	const response = (await ymcsRawRequest({
		method: 'POST',
		url: `${getBaseUrl(region)}/v2/token`,
		headers: {
			Authorization: `Basic ${basicAuth}`,
			'Content-Type': 'application/json',
			timestamp: String(Date.now()),
			nonce: generateNonce(),
		},
		body: { grant_type: 'client_credentials' },
	})) as { access_token: string; token_type: string; expires_in: number };

	const token = response.access_token;
	const expiresIn = response.expires_in ?? 86400;
	// Cache with 5-minute safety margin
	const expiresAt = Date.now() + (expiresIn - 300) * 1000;

	tokenCache.set(clientId, { token, expiresAt });
	return token;
}

/** Clear cached token for a given clientId (used on 401 retry). */
export function clearTokenCache(clientId: string): void {
	tokenCache.delete(clientId);
}

// ---------------------------------------------------------------------------
// Safe error extraction (errors may contain circular socket/agent refs)
// ---------------------------------------------------------------------------

function safeErrorJson(error: unknown): JsonObject {
	const e = error as Record<string, unknown>;
	return {
		message: (e.message as string) ?? 'Unknown error',
		code: (e.code as string) ?? undefined,
		httpCode: (e.httpCode as number) ?? undefined,
		response: e.response
			? { body: (e.response as Record<string, unknown>).body ?? undefined }
			: undefined,
	} as unknown as JsonObject;
}

// ---------------------------------------------------------------------------
// Authenticated API request
// ---------------------------------------------------------------------------

export async function ymcsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('yealinkYmcsApi');
	const baseUrl = getBaseUrl(credentials.region as string);

	const token = await getAccessToken(this, credentials);

	const requestOptions: YmcsRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			timestamp: String(Date.now()),
			nonce: generateNonce(),
		},
		qs: Object.keys(qs).length ? (qs as Record<string, string>) : undefined,
	};

	if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length) {
		requestOptions.body = body;
	}

	try {
		return (await ymcsRawRequest(requestOptions)) as IDataObject;
	} catch (error) {
		// On 401, clear token cache and retry once
		const statusCode = (error as { httpCode?: number }).httpCode;
		if (statusCode === 401) {
			clearTokenCache(credentials.clientId as string);
			const newToken = await getAccessToken(this, credentials);
			requestOptions.headers = {
				...requestOptions.headers,
				Authorization: `Bearer ${newToken}`,
				timestamp: String(Date.now()),
				nonce: generateNonce(),
			};
			try {
				return (await ymcsRawRequest(requestOptions)) as IDataObject;
			} catch (retryError) {
				throw new NodeApiError(this.getNode(), safeErrorJson(retryError), {
					message: 'Authentication failed after token refresh',
				});
			}
		}

		// Parse YMCS error format: { code, requestId, message, details }
		const errorBody = (error as { response?: { body?: IDataObject } }).response?.body;
		if (errorBody) {
			const details = errorBody.details as Array<{ field: string; message: string }> | undefined;
			const detailText = details
				?.map((d) => `${d.field}: ${d.message}`)
				.join('; ');
			throw new NodeApiError(this.getNode(), safeErrorJson(error), {
				message: (errorBody.message as string) || 'YMCS API request failed',
				description: detailText || `Error code: ${errorBody.code as string}`,
			});
		}
		throw new NodeApiError(this.getNode(), safeErrorJson(error));
	}
}

// ---------------------------------------------------------------------------
// Paginated list request (POST-based skip/limit pattern)
// ---------------------------------------------------------------------------

export async function ymcsApiRequestAllItems(
	this: IExecuteFunctions,
	endpoint: string,
	body: IDataObject = {},
	dataKey = 'data',
	limit?: number,
	maxPageSize = 500,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	const pageSize = limit && limit < maxPageSize ? limit : maxPageSize;

	// First request with autoCount to get total
	const firstBody: IDataObject = {
		...body,
		skip: 0,
		limit: pageSize,
		autoCount: true,
	};

	const firstResponse = await ymcsApiRequest.call(this, 'POST', endpoint, firstBody);
	const total = (firstResponse.total as number) ?? 0;
	const firstItems = (firstResponse[dataKey] as IDataObject[]) ?? [];
	returnData.push(...firstItems);

	if (limit && returnData.length >= limit) {
		return returnData.slice(0, limit);
	}

	// Subsequent pages without autoCount for efficiency
	while (returnData.length < total) {
		const pageBody: IDataObject = {
			...body,
			skip: returnData.length,
			limit: pageSize,
			autoCount: false,
		};

		const response = await ymcsApiRequest.call(this, 'POST', endpoint, pageBody);
		const items = (response[dataKey] as IDataObject[]) ?? [];
		if (items.length === 0) break;

		returnData.push(...items);

		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	}

	return returnData;
}
