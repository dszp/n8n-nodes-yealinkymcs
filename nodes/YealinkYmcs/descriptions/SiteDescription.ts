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
		displayName: 'Parent Site',
		name: 'parentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The parent site under which to create the new site',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['create'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a parent site...',
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
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description, maximum length 1024 characters',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['create'],
			},
		},
	},

	// ----------------------------------
	//         site: delete
	// ----------------------------------
	{
		displayName: 'Site',
		name: 'siteId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The site to delete',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['delete'],
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

	// ----------------------------------
	//         site: get
	// ----------------------------------
	{
		displayName: 'Site',
		name: 'siteId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The site to retrieve',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['get'],
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
		displayName: 'Site',
		name: 'siteId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The site to update',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['update'],
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
		displayName: 'Parent Site',
		name: 'parentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Move this site under a different parent site',
		displayOptions: {
			show: {
				resource: ['site'],
				operation: ['update'],
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
				hint: 'Enter the parent site ID directly, or drag a field from a previous node',
			},
		],
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
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 1024 characters',
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
