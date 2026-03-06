import type { INodeProperties } from 'n8n-workflow';

export const deviceIdentificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deviceIdentification'],
			},
		},
		options: [
			{
				name: 'Get ID',
				value: 'getId',
				description: 'Obtain the device ID from a MAC address',
				action: 'Get ID of a device identification',
			},
		],
		default: 'getId',
	},
];

export const deviceIdentificationFields: INodeProperties[] = [
	// ----------------------------------
	//     deviceIdentification: getId
	// ----------------------------------
	{
		displayName: 'MAC Address',
		name: 'mac',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 001565bbb1a9',
		description: 'The MAC address of the device to look up',
		displayOptions: {
			show: {
				resource: ['deviceIdentification'],
				operation: ['getId'],
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
		description: 'The type of device',
		displayOptions: {
			show: {
				resource: ['deviceIdentification'],
				operation: ['getId'],
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
				resource: ['deviceIdentification'],
				operation: ['getId'],
			},
		},
		options: [
			{
				displayName: 'Device ID Type',
				name: 'deviceIdType',
				type: 'string',
				default: 'mac',
				description:
					'The type of device identifier. Defaults to "mac".',
			},
		],
	},
];
