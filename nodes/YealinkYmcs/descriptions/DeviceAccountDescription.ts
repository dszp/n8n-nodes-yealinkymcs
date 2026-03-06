import type { INodeProperties } from 'n8n-workflow';

export const deviceAccountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deviceAccount'],
			},
		},
		options: [
			{
				name: 'Bind',
				value: 'bind',
				description: 'Bind SIP accounts to a device',
				action: 'Bind a device account',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Retrieve a list of accounts bound to a device',
				action: 'Get many device accounts',
			},
			{
				name: 'Unbind',
				value: 'unbind',
				description: 'Unbind SIP accounts from a device',
				action: 'Unbind a device account',
			},
		],
		default: 'getAll',
	},
];

export const deviceAccountFields: INodeProperties[] = [
	// ----------------------------------
	//     deviceAccount: bind
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
				resource: ['deviceAccount'],
				operation: ['bind'],
			},
		},
	},
	{
		displayName: 'Accounts (JSON)',
		name: 'accountsJson',
		type: 'json',
		required: true,
		default:
			'[\n  {\n    "lineId": 1,\n    "accountType": 0,\n    "accountId": "account-id-here"\n  }\n]',
		description:
			'JSON array of account binding objects. Each object requires: lineId (integer, starting from 1), accountType (0: SIP, 1: H323, 2: SFB), and accountId (string).',
		displayOptions: {
			show: {
				resource: ['deviceAccount'],
				operation: ['bind'],
			},
		},
	},

	// ----------------------------------
	//     deviceAccount: unbind
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
				resource: ['deviceAccount'],
				operation: ['unbind'],
			},
		},
	},
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. accountId1,accountId2',
		description: 'Comma-separated list of account IDs to unbind from the device',
		displayOptions: {
			show: {
				resource: ['deviceAccount'],
				operation: ['unbind'],
			},
		},
	},

	// ----------------------------------
	//     deviceAccount: getAll
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
				resource: ['deviceAccount'],
				operation: ['getAll'],
			},
		},
	},
];
