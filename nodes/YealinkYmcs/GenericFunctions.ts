import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
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
// RPS server list cache (used by the Server resource locator on RPS Create/Update)
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
// Model list cache (used by the Model resource locator on Device/Firmware)
// ---------------------------------------------------------------------------

const modelListCache = new Map<string, CachedSiteList>();

export async function getCachedModelList(
	context: ILoadOptionsFunctions,
	deviceType: 1 | 3,
): Promise<IDataObject[]> {
	const credentials = await context.getCredentials('yealinkYmcsApi');
	const cacheKey = `${credentials.clientId as string}:${deviceType}`;

	const cached = modelListCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return cached.sites;

	const response = await ymcsApiRequest.call(context, 'GET', '/v2/dm/models', {}, { deviceType });
	const models =
		(response.data as IDataObject[]) ??
		(Array.isArray(response) ? (response as IDataObject[]) : []);

	modelListCache.set(cacheKey, { sites: models, expiresAt: Date.now() + SITE_LIST_CACHE_TTL });
	return models;
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
// Error extraction
//
// Token acquisition, caching and 401 refresh all live in the credential
// (preAuthentication / authenticate); n8n owns that lifecycle now. What is left
// here is unwrapping the YMCS error envelope, which n8n nests differently
// depending on how the failure surfaced.
// ---------------------------------------------------------------------------

/** Pull the YMCS error envelope `{ code, requestId, message, details }` out of a thrown error. */
function extractErrorBody(error: unknown): IDataObject | undefined {
	const e = error as Record<string, unknown>;

	const candidates: unknown[] = [
		(e.response as Record<string, unknown>)?.body,
		(e.response as Record<string, unknown>)?.data,
		(e.cause as Record<string, unknown>)?.response &&
			((e.cause as Record<string, unknown>).response as Record<string, unknown>).body,
		(e.cause as Record<string, unknown>)?.response &&
			((e.cause as Record<string, unknown>).response as Record<string, unknown>).data,
		e.error,
		e.cause,
	];

	for (const candidate of candidates) {
		if (candidate && typeof candidate === 'object' && 'message' in candidate) {
			return candidate as IDataObject;
		}
	}

	return undefined;
}

/** Flatten an error into a plain object; raw errors can carry circular socket refs. */
function safeErrorJson(error: unknown): JsonObject {
	const e = error as Record<string, unknown>;
	const response = e.response as Record<string, unknown> | undefined;

	return {
		message: (e.message as string) ?? 'Unknown error',
		code: (e.code as string) ?? undefined,
		// n8n rethrows the raw AxiosError, which carries the status on response.status.
		httpCode: ((e.httpCode ?? e.statusCode ?? response?.status) as number) ?? undefined,
		response: { body: extractErrorBody(error) },
	} as unknown as JsonObject;
}

// ---------------------------------------------------------------------------
// Authenticated API request
// ---------------------------------------------------------------------------

/**
 * `body` is optional on purpose: omitting it and passing `{}` mean different things.
 * YMCS answers a bodyless POST with 412 (code 900444), but accepts `{}` and applies
 * its own defaults — so an explicit empty object must be sent as-is.
 */
export async function ymcsApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('yealinkYmcsApi');
	const baseUrl = getBaseUrl(credentials.region as string);

	const requestOptions: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
		},
		json: true,
	};

	if (Object.keys(qs).length) {
		requestOptions.qs = qs;
	}

	if (method !== 'GET' && method !== 'DELETE' && body !== undefined) {
		// n8n's HTTP layer silently drops an empty object body, so the request would go
		// out with no body at all and YMCS answers 412 (code 900444). Sending the
		// already-serialized form puts `{}` on the wire; non-empty bodies are unaffected.
		requestOptions.body = Object.keys(body).length === 0 ? '{}' : body;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'yealinkYmcsApi',
			requestOptions,
		);

		// Updates and deletes answer 204 with no body; normalize so callers never
		// see an empty string where they expect an object.
		if (response === undefined || response === null || response === '') {
			return {};
		}

		return response as IDataObject;
	} catch (error) {
		// YMCS error format: { code, requestId, message, details: [{ field, message }] }
		const errorBody = extractErrorBody(error);
		if (errorBody) {
			const details = errorBody.details as Array<{ field: string; message: string }> | undefined;
			const detailText = details?.map((d) => `${d.field}: ${d.message}`).join('; ');
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
