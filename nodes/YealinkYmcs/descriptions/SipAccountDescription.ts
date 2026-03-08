import type { INodeProperties } from 'n8n-workflow';

export const sipAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sipAccount'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new SIP account',
				action: 'Create a SIP account',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete one or more SIP accounts',
				action: 'Delete SIP accounts',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of SIP accounts',
				action: 'Get many SIP accounts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a SIP account',
				action: 'Update a SIP account',
			},
		],
		default: 'getAll',
	},
];

export const sipAccountFields: INodeProperties[] = [
	// ----------------------------------
	//         sipAccount: create
	// ----------------------------------
	{
		displayName: 'Register Name',
		name: 'registerName',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 2552',
		description: 'The registered name, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 2552',
		description: 'SIP username, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		description: 'SIP password, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'SIP Server 1 Host',
		name: 'sipServer1Host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. ume.yealink.com',
		description: 'Primary SIP server address, maximum length 256 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'SIP Server 1 Port',
		name: 'sipServer1Port',
		type: 'number',
		required: true,
		default: 5060,
		typeOptions: {
			minValue: 0,
			maxValue: 65535,
		},
		description: 'Primary SIP server port (0-65535)',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Display Name',
		name: 'displayName',
		type: 'string',
		default: '',
		description: 'Display name, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		default: '',
		description: 'Label, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Site',
		name: 'siteId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'The site to assign the account to',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a site...',
				typeOptions: {
					searchListMethod: 'getSiteList',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 34c6f6b5037d4708a77d14ae4b661379',
				hint: 'Enter the site ID directly, or drag a field from a previous node',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'Note, maximum length 512 characters',
			},
			{
				displayName: 'SIP Server 2 Host',
				name: 'sipServer2Host',
				type: 'string',
				default: '',
				description: 'Secondary SIP server address, maximum length 256 characters',
			},
			{
				displayName: 'SIP Server 2 Port',
				name: 'sipServer2Port',
				type: 'number',
				default: 5060,
				typeOptions: {
					minValue: 0,
					maxValue: 65535,
				},
				description: 'Secondary SIP server port (0-65535)',
			},
		],
	},

	// ----------------------------------
	//         sipAccount: delete
	// ----------------------------------
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. id1,id2,id3',
		description:
			'Comma-separated list of account IDs to delete, maximum 200 entries',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['delete'],
			},
		},
	},

	// ----------------------------------
	//         sipAccount: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
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
				resource: ['sipAccount'],
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
				resource: ['sipAccount'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				default: '',
				placeholder: 'e.g. 2552',
				description: 'Username fuzzy search keyword',
			},
		],
	},

	// ----------------------------------
	//         sipAccount: update
	// ----------------------------------
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the SIP account to update',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Register Name',
		name: 'registerName',
		type: 'string',
		required: true,
		default: '',
		description: 'The registered name, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		description: 'SIP username, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		description: 'SIP password, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'SIP Server 1 Host',
		name: 'sipServer1Host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. ume.yealink.com',
		description: 'Primary SIP server address, maximum length 256 characters',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'SIP Server 1 Port',
		name: 'sipServer1Port',
		type: 'number',
		required: true,
		default: 5060,
		typeOptions: {
			minValue: 0,
			maxValue: 65535,
		},
		description: 'Primary SIP server port (0-65535)',
		displayOptions: {
			show: {
				resource: ['sipAccount'],
				operation: ['update'],
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
				resource: ['sipAccount'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				description: 'Display name, maximum length 128 characters',
			},
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				description: 'Label, maximum length 128 characters',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'Note, maximum length 512 characters',
			},
			{
				displayName: 'SIP Server 2 Host',
				name: 'sipServer2Host',
				type: 'string',
				default: '',
				description: 'Secondary SIP server address, maximum length 256 characters',
			},
			{
				displayName: 'SIP Server 2 Port',
				name: 'sipServer2Port',
				type: 'number',
				default: 5060,
				typeOptions: {
					minValue: 0,
					maxValue: 65535,
				},
				description: 'Secondary SIP server port (0-65535)',
			},
			{
				displayName: 'Site ID',
				name: 'siteId',
				type: 'string',
				default: '',
				description: 'The site ID to assign the account to',
			},
		],
	},
];
