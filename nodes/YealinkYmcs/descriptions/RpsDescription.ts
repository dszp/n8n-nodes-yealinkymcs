import type { INodeProperties } from 'n8n-workflow';

export const rpsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rps'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a single RPS device',
				action: 'Create an RPS device',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Add multiple RPS devices in a batch',
				action: 'Create many RPS devices',
			},
			{
				name: 'Create Server',
				value: 'createServer',
				description: 'Add an RPS server',
				action: 'Create an RPS server',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete RPS devices',
				action: 'Delete RPS devices',
			},
			{
				name: 'Delete Server',
				value: 'deleteServer',
				description: 'Delete RPS servers',
				action: 'Delete RPS servers',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of RPS devices',
				action: 'Get many RPS devices',
			},
			{
				name: 'Get Servers',
				value: 'getServers',
				description: 'Retrieve a list of RPS servers',
				action: 'Get many RPS servers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an RPS device',
				action: 'Update an RPS device',
			},
			{
				name: 'Update Server',
				value: 'updateServer',
				description: 'Update an RPS server',
				action: 'Update an RPS server',
			},
		],
		default: 'getAll',
	},
];

export const rpsFields: INodeProperties[] = [
	// ----------------------------------
	//         rps: create
	// ----------------------------------
	{
		displayName: 'MAC Address',
		name: 'mac',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 001565bbb1a9',
		description: 'Device MAC address, minimum length 12, maximum length 17 characters',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Serial Number',
		name: 'sn',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1106312113402006',
		description: 'SN code, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Auth Name',
				name: 'authName',
				type: 'string',
				default: '',
				description: 'Authentication username, maximum length 128 characters',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Authentication password, maximum length 128 characters',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'Note, maximum length 256 characters',
			},
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				default: '',
				description: 'The server ID to associate with the device',
			},
			{
				displayName: 'Unique Server URL',
				name: 'uniqueServerUrl',
				type: 'string',
				default: '',
				description: 'Server address, maximum length 256 characters',
			},
		],
	},

	// ----------------------------------
	//         rps: createMany
	// ----------------------------------
	{
		displayName: 'Devices (JSON)',
		name: 'devicesJson',
		type: 'json',
		required: true,
		default:
			'[\n  {\n    "mac": "001565bbb1a9",\n    "sn": "1106312113402006",\n    "serverId": "server-id-here"\n  }\n]',
		description:
			'JSON array of RPS devices to add (up to 100). Each device requires: mac, sn. Optional fields: serverId, uniqueServerUrl, authName, password, remark.',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['createMany'],
			},
		},
	},

	// ----------------------------------
	//         rps: delete
	// ----------------------------------
	{
		displayName: 'Device ID Type',
		name: 'deviceIdType',
		type: 'options',
		required: true,
		default: 'mac',
		options: [
			{
				name: 'MAC Address',
				value: 'mac',
			},
			{
				name: 'Device ID',
				value: 'id',
			},
		],
		description: 'The type of device identifier used',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['delete'],
			},
		},
	},
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 001565bbb1a9,001567',
		description:
			'Comma-separated list of device identifiers to delete, maximum length 200 characters',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['delete'],
			},
		},
	},

	// ----------------------------------
	//         rps: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'MAC Address',
				name: 'mac',
				type: 'string',
				default: '',
				placeholder: 'e.g. 00:15:65:bb:b1:a9',
				description:
					'Device MAC address filter, maximum length 17. Supports ":" or "-" separators.',
			},
		],
	},

	// ----------------------------------
	//         rps: update
	// ----------------------------------
	{
		displayName: 'RPS Device ID',
		name: 'rpsDeviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the RPS device to update',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Auth Name',
				name: 'authName',
				type: 'string',
				default: '',
				description: 'Username for authentication, maximum length 128 characters',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password for authentication, maximum length 128 characters',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'Note, maximum length 256 characters',
			},
			{
				displayName: 'Server ID',
				name: 'serverId',
				type: 'string',
				default: '',
				description: 'The server ID to associate with the device',
			},
			{
				displayName: 'Unique Server URL',
				name: 'uniqueServerUrl',
				type: 'string',
				default: '',
				description: 'Address of server, maximum length 256 characters',
			},
		],
	},

	// ----------------------------------
	//         rps: createServer
	// ----------------------------------
	{
		displayName: 'Server Name',
		name: 'serverName',
		type: 'string',
		required: true,
		default: '',
		description: 'The server name, with no more than 20 characters',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['createServer'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. https://www.yealink.com',
		description: 'The address of the server, with no more than 512 characters',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['createServer'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['createServer'],
			},
		},
		options: [
			{
				displayName: 'Auth Name',
				name: 'authName',
				type: 'string',
				default: '',
				description: 'The username for authentication, with no more than 32 characters',
			},
			{
				displayName: 'Certificate URL',
				name: 'certificateUrl',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'The password for authentication, with no more than 32 characters',
			},
			{
				displayName: 'Server Certificate Enable',
				name: 'serverCertificateEnable',
				type: 'boolean',
				default: false,
				description: 'Whether to enable the custom certificate',
			},
			{
				displayName: 'Server Certificate Enable With SHA256',
				name: 'serverCertificateEnableWithSHA256',
				type: 'boolean',
				default: false,
				description: 'Whether to enable when the certificate type is non-SHA256',
			},
			{
				displayName: 'Server Certificate URL',
				name: 'serverCertificateUrl',
				type: 'string',
				default: '',
				description: 'The URL of the server certificate',
			},
		],
	},

	// ----------------------------------
	//         rps: deleteServer
	// ----------------------------------
	{
		displayName: 'Server IDs',
		name: 'serverIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. b38dea23a4e6458188799833b72d950f,1234',
		description:
			'Comma-separated list of server IDs to delete, maximum length 200 characters',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['deleteServer'],
			},
		},
	},

	// ----------------------------------
	//         rps: getServers
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['getServers'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['getServers'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['getServers'],
			},
		},
		options: [
			{
				displayName: 'Search Keyword',
				name: 'searchKey',
				type: 'string',
				default: '',
				description: 'Search keywords, supports server name and URL search',
			},
			{
				displayName: 'Server Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by server name',
			},
		],
	},

	// ----------------------------------
	//         rps: updateServer
	// ----------------------------------
	{
		displayName: 'RPS Server ID',
		name: 'rpsServerId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the RPS server to update',
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['updateServer'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['rps'],
				operation: ['updateServer'],
			},
		},
		options: [
			{
				displayName: 'Auth Name',
				name: 'authName',
				type: 'string',
				default: '',
				description: 'The username for authentication, with no more than 32 characters',
			},
			{
				displayName: 'Certificate URL',
				name: 'certificateUrl',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'The password for authentication, with no more than 32 characters',
			},
			{
				displayName: 'Server Certificate Enable',
				name: 'serverCertificateEnable',
				type: 'boolean',
				default: false,
				description: 'Whether to enable the custom certificate',
			},
			{
				displayName: 'Server Certificate Enable With SHA256',
				name: 'serverCertificateEnableWithSHA256',
				type: 'boolean',
				default: false,
				description: 'Whether to enable when the certificate type is non-SHA256',
			},
			{
				displayName: 'Server Certificate URL',
				name: 'serverCertificateUrl',
				type: 'string',
				default: '',
				description: 'The URL of the server certificate',
			},
			{
				displayName: 'Server Name',
				name: 'serverName',
				type: 'string',
				default: '',
				description: 'The server name, with no more than 20 characters',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'The address of the server, with no more than 512 characters',
			},
		],
	},
];
