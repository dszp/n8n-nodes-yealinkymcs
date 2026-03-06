import type { INodeProperties } from 'n8n-workflow';

export const deviceControlOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deviceControl'],
			},
		},
		options: [
			{
				name: 'Factory Reset',
				value: 'factoryReset',
				action: 'Factory reset a device control',
				description: 'Factory reset one or more devices',
			},
			{
				name: 'Restart',
				value: 'restart',
				action: 'Restart a device control',
				description: 'Reboot one or more devices',
			},
		],
		default: 'restart',
	},
];

export const deviceControlFields: INodeProperties[] = [
	// ----------------------------------
	//       deviceControl: restart
	// ----------------------------------
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		description:
			'Comma-separated list of device IDs to reboot (max 200). e.g. 0006572538f74e8683716cf961caa95b,00099642675e4d4bb5e91fd9ae5ce585.',
		displayOptions: {
			show: {
				resource: ['deviceControl'],
				operation: ['restart'],
			},
		},
	},
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		required: true,
		default: 1,
		description: 'The type of device to reboot',
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
				resource: ['deviceControl'],
				operation: ['restart'],
			},
		},
	},

	// ----------------------------------
	//       deviceControl: factoryReset
	// ----------------------------------
	{
		displayName: 'Device IDs',
		name: 'deviceIds',
		type: 'string',
		required: true,
		default: '',
		description:
			'Comma-separated list of device IDs to factory reset (max 200). e.g. 0006572538f74e8683716cf961caa95b,00099642675e4d4bb5e91fd9ae5ce585.',
		displayOptions: {
			show: {
				resource: ['deviceControl'],
				operation: ['factoryReset'],
			},
		},
	},
	{
		displayName: 'Device Type',
		name: 'deviceType',
		type: 'options',
		required: true,
		default: 1,
		description: 'The type of device to factory reset',
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
				resource: ['deviceControl'],
				operation: ['factoryReset'],
			},
		},
	},
];
