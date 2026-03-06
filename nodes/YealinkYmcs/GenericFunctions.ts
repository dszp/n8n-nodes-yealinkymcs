import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

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
	context: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions | { helpers: { httpRequest: (options: IHttpRequestOptions) => Promise<unknown> } },
	credentials: IDataObject,
): Promise<string> {
	const clientId = credentials.clientId as string;
	const cached = tokenCache.get(clientId);

	// Return cached token if still valid (5-minute safety margin)
	if (cached && cached.expiresAt > Date.now()) {
		return cached.token;
	}

	const clientSecret = credentials.clientSecret as string;
	const region = credentials.region as string;
	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

	const response = (await context.helpers.httpRequest({
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
	const token = await getAccessToken(this, credentials);
	const baseUrl = getBaseUrl(credentials.region as string);

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			timestamp: String(Date.now()),
			nonce: generateNonce(),
		},
		qs: Object.keys(qs).length ? qs : undefined,
	};

	if (method !== 'GET' && method !== 'DELETE' && Object.keys(body).length) {
		options.body = body;
	}

	try {
		return (await this.helpers.httpRequest(options)) as IDataObject;
	} catch (error) {
		// On 401, clear token cache and retry once
		const statusCode = (error as { httpCode?: number }).httpCode;
		if (statusCode === 401) {
			clearTokenCache(credentials.clientId as string);
			const newToken = await getAccessToken(this, credentials);
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${newToken}`,
				timestamp: String(Date.now()),
				nonce: generateNonce(),
			};
			try {
				return (await this.helpers.httpRequest(options)) as IDataObject;
			} catch (retryError) {
				throw new NodeApiError(this.getNode(), retryError as JsonObject, {
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
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: (errorBody.message as string) || 'YMCS API request failed',
				description: detailText || `Error code: ${errorBody.code as string}`,
			});
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
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
