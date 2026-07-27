import type { INodeProperties } from 'n8n-workflow';

export const customApiCallOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customApiCall'],
			},
		},
		options: [
			{
				name: 'Make API Request',
				value: 'makeRequest',
				description: 'Call any YMCS API endpoint with your own method, path and body',
				action: 'Make custom API request',
			},
		],
		default: 'makeRequest',
	},
];

export const customApiCallFields: INodeProperties[] = [
	{
		displayName: 'Method',
		name: 'customMethod',
		type: 'options',
		default: 'POST',
		options: [
			{
				name: 'DELETE',
				value: 'DELETE',
			},
			{
				name: 'GET',
				value: 'GET',
			},
			{
				name: 'PATCH',
				value: 'PATCH',
			},
			{
				name: 'POST',
				value: 'POST',
			},
			{
				name: 'PUT',
				value: 'PUT',
			},
		],
		description:
			'HTTP method for the request. Most YMCS endpoints, including every list endpoint, use POST.',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['makeRequest'],
			},
		},
	},
	{
		displayName: 'Endpoint',
		name: 'customEndpoint',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. /v2/dm/listDevices',
		description:
			'Path to call, relative to the regional host. The host comes from the Region set on the credential.',
		hint: 'A leading slash is added if you leave it off',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['makeRequest'],
			},
		},
	},
	{
		displayName: 'Query Parameters',
		name: 'customQuery',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Parameter',
		typeOptions: {
			multipleValues: true,
		},
		description: 'Query string parameters to append to the URL',
		options: [
			{
				name: 'parameters',
				displayName: 'Parameters',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g. deviceType',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'e.g. 1',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['makeRequest'],
			},
		},
	},
	{
		displayName: 'Body',
		name: 'customBody',
		type: 'json',
		default: '{}',
		description:
			'JSON request body, sent as-is. An empty object is still sent, since most YMCS endpoints reject a request with no body at all and apply their own defaults to an empty one. Ignored for GET and DELETE requests.',
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['makeRequest'],
				customMethod: ['POST', 'PUT', 'PATCH'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'customOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customApiCall'],
				operation: ['makeRequest'],
			},
		},
		options: [
			{
				displayName: 'Max Page Size',
				name: 'maxPageSize',
				type: 'number',
				default: 500,
				typeOptions: {
					minValue: 1,
					maxValue: 500,
				},
				description:
					'Items to request per page while paginating. Most endpoints allow 500, but listDevices caps at 100. Defaults to 500.',
			},
			{
				displayName: 'Paginate All Pages',
				name: 'paginate',
				type: 'boolean',
				default: false,
				description:
					'Whether to walk every page of a POST list endpoint using skip/limit/autoCount. This changes the output shape: on, you get one item per record; off, you get the raw response verbatim, including the skip/limit/total envelope. Defaults to false.',
			},
			{
				displayName: 'Response Data Key',
				name: 'dataKey',
				type: 'string',
				default: 'data',
				description:
					'Response property holding the array of items when paginating. Defaults to "data".',
			},
		],
	},
];
