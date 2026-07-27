import type { INodeProperties } from 'n8n-workflow';

export const deviceGroupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
			},
		},
		options: [
			{
				name: 'Add Devices',
				value: 'addDevices',
				action: 'Add devices to a device group',
				description: 'Add one or more devices to a device group',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a device group',
				description: 'Create a new device group',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a device group',
				description: 'Delete a device group',
			},
			{
				name: 'Get Devices',
				value: 'getDevices',
				action: 'Get devices in a device group',
				description: 'Retrieve a list of devices in a device group',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many device groups',
				description: 'Retrieve a list of device groups',
			},
			{
				name: 'Remove Devices',
				value: 'removeDevices',
				action: 'Remove devices from a device group',
				description: 'Remove one or more devices from a device group',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a device group',
				description: 'Update a device group',
			},
		],
		default: 'getAll',
	},
];

export const deviceGroupFields: INodeProperties[] = [
	// ----------------------------------
	//       deviceGroup: create
	// ----------------------------------
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the device group (max 64 characters)',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
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
		description: 'The type of devices in this group',
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
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
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
				resource: ['deviceGroup'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Group description information (max 256 characters)',
			},
		],
	},

	// ----------------------------------
	//       deviceGroup: delete
	// ----------------------------------
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device group to delete',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['delete'],
			},
		},
	},

	// ----------------------------------
	//       deviceGroup: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['getAll'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
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
				resource: ['deviceGroup'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Device Type',
				name: 'deviceType',
				type: 'options',
				default: 0,
				description: 'Filter by device type. If not specified, all types are returned.',
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
			},
			{
				displayName: 'Group Name',
				name: 'groupName',
				type: 'string',
				default: '',
				description: 'Fuzzy search by group name',
			},
		],
	},

	// ----------------------------------
	//       deviceGroup: update
	// ----------------------------------
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device group to update',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		default: '',
		description: 'The new name for the device group (max 64 characters)',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		required: true,
		default: 1,
		description: 'The type of devices in this group. The API requires this on every update.',
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
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
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
				resource: ['deviceGroup'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Group description information (max 256 characters)',
			},
		],
	},

	// ----------------------------------
	//       deviceGroup: addDevices
	// ----------------------------------
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device group to add devices to',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['addDevices'],
			},
		},
	},
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		description:
			'Comma-separated list of device IDs to add to the group (max 200). e.g. 0006572538f74e8683716cf961caa95b,00099642675e4d4bb5e91fd9ae5ce585.',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['addDevices'],
			},
		},
	},

	// ----------------------------------
	//       deviceGroup: removeDevices
	// ----------------------------------
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device group to remove devices from',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['removeDevices'],
			},
		},
	},
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		description:
			'Comma-separated list of device IDs to remove from the group (max 200). e.g. 0006572538f74e8683716cf961caa95b,00099642675e4d4bb5e91fd9ae5ce585.',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['removeDevices'],
			},
		},
	},

	// ----------------------------------
	//       deviceGroup: getDevices
	// ----------------------------------
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device group to list devices from',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['getDevices'],
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
				resource: ['deviceGroup'],
				operation: ['getDevices'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['deviceGroup'],
				operation: ['getDevices'],
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
				resource: ['deviceGroup'],
				operation: ['getDevices'],
			},
		},
		options: [
			{
				displayName: 'Device Status',
				name: 'deviceStatus',
				type: 'options',
				default: -1,
				description: 'Filter by device status',
				options: [
					{
						name: 'All',
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
			},
			{
				displayName: 'MAC Address',
				name: 'mac',
				type: 'string',
				default: '',
				description:
					'Fuzzy search by MAC address (max 17 characters). Supports : or - separators, e.g. 00:15:65:bb:b1:a9.',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Filter by model ID',
			},
		],
	},
];
