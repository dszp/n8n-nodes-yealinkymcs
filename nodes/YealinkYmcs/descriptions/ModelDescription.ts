import type { INodeProperties } from 'n8n-workflow';

export const modelOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['model'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of device models',
				action: 'Get many models',
			},
		],
		default: 'getAll',
	},
];

export const modelFields: INodeProperties[] = [
	// ----------------------------------
	//         model: getAll
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
		description: 'The type of device to list models for',
		displayOptions: {
			show: {
				resource: ['model'],
				operation: ['getAll'],
			},
		},
	},
];
