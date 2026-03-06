import type { INodeProperties } from 'n8n-workflow';

export const deviceAccessoryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
			},
		},
		options: [
			{
				name: 'Factory Reset',
				value: 'factoryReset',
				description: 'Restore accessories to factory settings',
				action: 'Factory reset a device accessory',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Retrieve accessory details',
				action: 'Get a device accessory',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of accessories for a device',
				action: 'Get many device accessories',
			},
			{
				name: 'Restart',
				value: 'restart',
				description: 'Reboot accessories on a device',
				action: 'Restart a device accessory',
			},
		],
		default: 'getAll',
	},
];

export const deviceAccessoryFields: INodeProperties[] = [
	// ----------------------------------
	//     deviceAccessory: get
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Part ID',
		name: 'partId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the accessory',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
				operation: ['get'],
			},
		},
	},

	// ----------------------------------
	//     deviceAccessory: getAll
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
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
				resource: ['deviceAccessory'],
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
				resource: ['deviceAccessory'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
	},

	// ----------------------------------
	//     deviceAccessory: restart
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
				operation: ['restart'],
			},
		},
	},
	{
		displayName: 'Part IDs',
		name: 'partIds',
		type: 'string',
		default: '',
		placeholder: 'e.g. partId1,partId2',
		description:
			'Comma-separated list of accessory IDs to restart, maximum 200. Leave empty to restart all accessories on this device.',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
				operation: ['restart'],
			},
		},
	},

	// ----------------------------------
	//     deviceAccessory: factoryReset
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
				operation: ['factoryReset'],
			},
		},
	},
	{
		displayName: 'Part IDs',
		name: 'partIds',
		type: 'string',
		default: '',
		placeholder: 'e.g. partId1,partId2',
		description:
			'Comma-separated list of accessory IDs to factory reset, maximum 200. Leave empty to reset all accessories on this device.',
		displayOptions: {
			show: {
				resource: ['deviceAccessory'],
				operation: ['factoryReset'],
			},
		},
	},
];
