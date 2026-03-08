import type { INodeProperties } from 'n8n-workflow';

export const deviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['device'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a single device by MAC and serial number',
				action: 'Create a device',
			},
			{
				name: 'Create Many',
				value: 'createMany',
				description: 'Add multiple devices in a batch',
				action: 'Create many devices',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a device',
				action: 'Delete a device',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				description: 'Delete multiple devices in a batch',
				action: 'Delete many devices',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve a device',
				action: 'Get a device',
			},
			{
				name: 'Get Configuration',
				value: 'getConfiguration',
				description: 'Retrieve the combination configuration for a device',
				action: 'Get configuration of a device',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of devices',
				action: 'Get many devices',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a device',
				action: 'Update a device',
			},
		],
		default: 'getAll',
	},
];

export const deviceFields: INodeProperties[] = [
	// ----------------------------------
	//         device: create
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
				resource: ['device'],
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
		description: 'Device serial number, maximum length 128 characters',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		required: true,
		default: 1,
		options: [
			{
				name: 'Phone Device',
				value: 1,
			},
			{
				name: 'Room Device',
				value: 3,
			},
		],
		description: 'The type of device to add',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Model ID',
		name: 'modelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The model ID of the device',
		displayOptions: {
			show: {
				resource: ['device'],
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
				resource: ['device'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Device Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Device name, maximum length 128 characters',
			},
			{
				displayName: 'Site ID',
				name: 'siteId',
				type: 'string',
				default: '',
				description: 'The site ID to assign the device to',
			},
		],
	},

	// ----------------------------------
	//         device: createMany
	// ----------------------------------
	{
		displayName: 'Add Method',
		name: 'addMethod',
		type: 'options',
		required: true,
		default: 'withSn',
		options: [
			{
				name: 'With MAC and Serial Number',
				value: 'withSn',
			},
			{
				name: 'With MAC Only',
				value: 'macOnly',
			},
		],
		description: 'Whether to add devices with MAC and serial number, or by MAC only',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['createMany'],
			},
		},
	},
	{
		displayName: 'Devices (JSON)',
		name: 'devicesJson',
		type: 'json',
		required: true,
		default: '[\n  {\n    "mac": "001565bbb1a9",\n    "sn": "1106312113402006",\n    "deviceType": 1,\n    "modelId": "model-id-here"\n  }\n]',
		description:
			'JSON array of devices to add (up to 100). Each device requires: mac, deviceType, modelId. When using "With MAC and Serial Number", sn is also required. Optional fields: name, siteId.',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['createMany'],
			},
		},
	},

	// ----------------------------------
	//         device: delete
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to delete',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['delete'],
			},
		},
	},

	// ----------------------------------
	//         device: deleteMany
	// ----------------------------------
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		required: true,
		default: 1,
		options: [
			{
				name: 'Phone Device',
				value: 1,
			},
			{
				name: 'Room Device',
				value: 3,
			},
		],
		description: 'The type of devices to delete',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['deleteMany'],
			},
		},
	},
	{
		displayName: 'Use MAC Address or Device ID Type',
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
				resource: ['device'],
				operation: ['deleteMany'],
			},
		},
	},
	{
		displayName: 'Identifiers of Selected Type',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 001565bbb1a9,001567',
		description:
			'Comma-separated list of device identifiers to delete, maximum length 200 characters',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['deleteMany'],
			},
		},
	},

	// ----------------------------------
	//         device: get
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to retrieve',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['get'],
			},
		},
	},

	// ----------------------------------
	//         device: getConfiguration
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to retrieve configuration for',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getConfiguration'],
			},
		},
	},

	// ----------------------------------
	//         device: getAll
	// ----------------------------------
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		default: 0,
		options: [
			{
				name: 'All',
				value: 0,
			},
			{
				name: 'Phone Device',
				value: 1,
			},
			{
				name: 'Room Device',
				value: 3,
			},
		],
		description: 'Filter by device type. Defaults to returning all device types.',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['device'],
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
				resource: ['device'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Site Including Child(ren)',
		name: 'siteId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description:
			'Filter by site. Returns devices in the selected site and any of its child sites.',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getAll'],
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
		displayName: 'Model',
		name: 'modelId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Filter by device model. The list shown depends on the selected Device Type.',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getAll'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a model...',
				typeOptions: {
					searchListMethod: 'getModelList',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. model-id-here',
				hint: 'Enter the model ID directly, or drag a field from a previous node',
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Account Status',
				name: 'accountStatus',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Registered',
						value: 1,
					},
					{
						name: 'DND',
						value: 2,
					},
					{
						name: 'Unregistered',
						value: 3,
					},
				],
				description: 'Filter by account registration status',
			},
			{
				displayName: 'Device Status',
				name: 'deviceStatus',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Not Reported',
						value: -1,
					},
					{
						name: 'Offline',
						value: 0,
					},
					{
						name: 'Online',
						value: 1,
					},
				],
				description: 'Filter by device online status',
			},
			{
				displayName: 'MAC Address',
				name: 'mac',
				type: 'string',
				default: '',
				placeholder: 'e.g. 00:15:65:bb:b1:a9',
				description:
					'Device MAC fuzzy search keyword, maximum length 17. Supports ":" or "-" separators.',
			},
		],
	},

	// ----------------------------------
	//         device: update
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to update',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Site',
		name: 'siteId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Assign the device to a site',
		displayOptions: {
			show: {
				resource: ['device'],
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
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Device Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Device name, maximum length 128 characters',
			},
		],
	},
];
