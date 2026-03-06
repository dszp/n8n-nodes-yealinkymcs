import type { INodeProperties } from 'n8n-workflow';

export const siteOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['site'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new site',
				action: 'Create a site',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a site',
				action: 'Delete a site',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a site',
				action: 'Get a site',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of sites',
				action: 'Get many sites',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a site',
				action: 'Update a site',
			},
		],
		default: 'getAll',
	},
];

export const siteFields: INodeProperties[] = [
	// ----------------------------------
	//         site: create
	// ----------------------------------
	{
		displayName: 'Site Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Site name, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Parent Site ID',
		name: 'parentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['site'],
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
				resource: ['site'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 1024 characters',
			},
		],
	},

	// ----------------------------------
	//         site: delete
	// ----------------------------------
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the site to delete',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['delete'],
			},
		},
	},

	// ----------------------------------
	//         site: get
	// ----------------------------------
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the site to retrieve',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['get'],
			},
		},
	},

	// ----------------------------------
	//         site: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['site'],
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
				resource: ['site'],
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
				resource: ['site'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Site Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by site name',
			},
		],
	},

	// ----------------------------------
	//         site: update
	// ----------------------------------
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the site to update',
		displayOptions: {
			show: {
				resource: ['site'],
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
				resource: ['site'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 1024 characters',
			},
			{
				displayName: 'Parent Site ID',
				name: 'parentId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Site Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Site name, maximum length 128 characters',
			},
		],
	},
];
