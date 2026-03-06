import type { INodeProperties } from 'n8n-workflow';

export const firmwareOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['firmware'],
			},
		},
		options: [
			{
				name: 'Get Many Custom',
				value: 'getAllCustom',
				description: 'Retrieve a list of custom firmware versions',
				action: 'Get many custom firmware versions',
			},
			{
				name: 'Get Many Official',
				value: 'getAllOfficial',
				description: 'Retrieve a list of official firmware versions',
				action: 'Get many official firmware versions',
			},
			{
				name: 'Push',
				value: 'push',
				description: 'Push a custom firmware to devices',
				action: 'Push custom firmware to devices',
			},
			{
				name: 'Push Official',
				value: 'pushOfficial',
				description: 'Push an official firmware to devices',
				action: 'Push official firmware to devices',
			},
		],
		default: 'getAllCustom',
	},
];

export const firmwareFields: INodeProperties[] = [
	// ----------------------------------
	//         firmware: getAllCustom
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['getAllCustom'],
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
				resource: ['firmware'],
				operation: ['getAllCustom'],
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
				resource: ['firmware'],
				operation: ['getAllCustom'],
			},
		},
		options: [
			{
				displayName: 'Device Type',
				name: 'deviceType',
				type: 'options',
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
				description: 'Filter by device type',
			},
			{
				displayName: 'Firmware Type',
				name: 'firmwareType',
				type: 'options',
				default: 0,
				options: [
					{
						name: 'Master Device',
						value: 0,
					},
					{
						name: 'Accessory',
						value: 1,
					},
				],
				description: 'Filter by firmware type',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Filter by firmware model ID',
			},
		],
	},

	// ----------------------------------
	//         firmware: getAllOfficial
	// ----------------------------------
	{
		displayName: 'Model ID',
		name: 'modelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The firmware model ID to list official firmware versions for',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['getAllOfficial'],
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
				resource: ['firmware'],
				operation: ['getAllOfficial'],
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
				resource: ['firmware'],
				operation: ['getAllOfficial'],
				returnAll: [false],
			},
		},
	},

	// ----------------------------------
	//         firmware: push
	// ----------------------------------
	{
		displayName: 'Firmware ID',
		name: 'firmwareId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the custom firmware to push',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['push'],
			},
		},
	},
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. id1,id2,id3',
		description: 'Comma-separated list of device IDs to push firmware to, maximum 200 devices',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['push'],
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
		description: 'The type of devices to push firmware to',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['push'],
			},
		},
	},

	// ----------------------------------
	//         firmware: pushOfficial
	// ----------------------------------
	{
		displayName: 'Official Firmware ID',
		name: 'officalFirmwareId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the official firmware to push',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['pushOfficial'],
			},
		},
	},
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. id1,id2,id3',
		description: 'Comma-separated list of device IDs to push firmware to, maximum 200 devices',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['pushOfficial'],
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
		description: 'The type of devices to push firmware to',
		displayOptions: {
			show: {
				resource: ['firmware'],
				operation: ['pushOfficial'],
			},
		},
	},
];
