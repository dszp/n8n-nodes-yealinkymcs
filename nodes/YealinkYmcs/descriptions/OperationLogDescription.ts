import type { INodeProperties } from 'n8n-workflow';

export const operationLogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['operationLog'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of operation logs',
				action: 'Get many operation logs',
			},
		],
		default: 'getAll',
	},
];

export const operationLogFields: INodeProperties[] = [
	// ----------------------------------
	//         operationLog: getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['operationLog'],
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
				resource: ['operationLog'],
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
				resource: ['operationLog'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'number',
				default: 0,
				description: 'End time as a Unix timestamp in milliseconds',
				placeholder: 'e.g. 1738205662000',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'number',
				default: 0,
				description: 'Start time as a Unix timestamp in milliseconds',
				placeholder: 'e.g. 1737099689158',
			},
		],
	},
];
