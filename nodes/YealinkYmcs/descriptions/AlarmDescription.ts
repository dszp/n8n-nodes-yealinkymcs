import type { INodeProperties } from 'n8n-workflow';

export const alarmOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['alarm'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of alarms',
				action: 'Get many alarms',
			},
		],
		default: 'getAll',
	},
];

export const alarmFields: INodeProperties[] = [
	// ----------------------------------
	//         alarm: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['alarm'],
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
				resource: ['alarm'],
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
				resource: ['alarm'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Device Type',
				name: 'deviceType',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
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
				description:
					'Filter by device type. 1: Phone Device, 3: Room Device. Leave blank for all.',
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
];
