import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IDataObject,
	IHttpRequestHelper,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

import { generateNonce, getBaseUrl } from '../nodes/YealinkYmcs/GenericFunctions';

export class YealinkYmcsApi implements ICredentialType {
	name = 'yealinkYmcsApi';

	displayName = 'Yealink YMCS API';

	documentationUrl = 'https://support.yealink.com/';

	icon: Icon = 'file:yealinkYmcs.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'US - us-api.ymcs.yealink.com',
					value: 'us',
				},
				{
					name: 'EU - eu-api.ymcs.yealink.com',
					value: 'eu',
				},
				{
					name: 'AU - au-api.ymcs.yealink.com',
					value: 'au',
				},
			],
			default: 'us',
			description:
				'The region where your Yealink YMCS enterprise is located. This sets the API host used by the node; an HTTP Request node using this credential needs the host written out in full.',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The AccessKey ID from the YMCS API Service section',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The AccessKey Secret from the YMCS API Service section',
		},
		// Not user-facing. n8n only runs preAuthentication for credentials that declare a
		// hidden `expirable` property — see CredentialsHelper.preAuthentication, which
		// returns early when no such property exists. n8n stores the fetched token here,
		// reuses it across requests, and re-runs preAuthentication on a 401.
		{
			displayName: 'Access Token',
			name: '_accessToken',
			type: 'hidden',
			typeOptions: { expirable: true, password: true },
			default: '',
		},
	];

	// Exchange the client credentials for an access token before each authenticated
	// request. n8n caches the result and re-runs this on a 401, which replaces the
	// token cache and refresh-retry the node used to carry itself.
	async preAuthentication(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
	): Promise<IDataObject> {
		const clientId = ((credentials.clientId as string) ?? '').trim();
		const clientSecret = ((credentials.clientSecret as string) ?? '').trim();

		if (!clientId || !clientSecret) {
			return {};
		}

		const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

		const response = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${getBaseUrl(credentials.region as string)}/v2/token`,
			headers: {
				Authorization: `Basic ${basicAuth}`,
				'Content-Type': 'application/json',
				timestamp: String(Date.now()),
				nonce: generateNonce(),
			},
			body: { grant_type: 'client_credentials' },
			json: true,
		})) as IDataObject;

		return { _accessToken: (response.access_token as string) ?? '' };
	}

	// MUST be the object form, not a function. n8n serializes credential types to the
	// frontend by spreading them, which drops both the non-enumerable `toJSON` that
	// converts a function-form `authenticate` to `{}` and the prototype method itself.
	// n8n-nodes-base gets away with functions only because it ships a pre-generated
	// types/credentials.json. For a community package the key would be missing entirely,
	// and the HTTP Request node's Credential Type list filters on `has:authenticate`.
	//
	// The token comes from preAuthentication via the hidden `_accessToken` property.
	// `timestamp` and `nonce` are re-evaluated per request; YMCS rejects a replayed
	// nonce with 403 {"code":"500403","message":"Request reply"}.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{ $credentials._accessToken }}',
				timestamp: '={{ Date.now() }}',
				nonce: '={{ (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 32) }}',
			},
		},
	};

	// Hits a real authenticated endpoint, so a green result proves the whole chain:
	// preAuthentication fetched a token and authenticate applied it.
	//
	// `|| "us"` mirrors getBaseUrl(): a credential saved without ever touching the
	// Region dropdown stores no `region` at all, and "undefined-api.ymcs.yealink.com"
	// fails DNS, which n8n also reports as the generic "Authorization failed".
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{"https://" + ($credentials.region || "us") + "-api.ymcs.yealink.com"}}',
			url: '/v2/dm/listSites',
			method: 'POST',
			body: {
				skip: 0,
				limit: 1,
				autoCount: false,
			},
		},
	};
}
