import type { INodeProperties } from 'n8n-workflow';

export const diagnosisOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['diagnosis'],
			},
		},
		options: [
			{
				name: 'Capture Screenshot',
				value: 'captureScreenshot',
				description: 'Capture a screenshot from a device',
				action: 'Capture screenshot of a device',
			},
			{
				name: 'Export Config',
				value: 'exportConfig',
				description: 'Export the configuration file from a device',
				action: 'Export config from a device',
			},
			{
				name: 'Export Syslog',
				value: 'exportSyslog',
				description: 'Export the system log from a device',
				action: 'Export syslog from a device',
			},
			{
				name: 'Get Network Interfaces',
				value: 'getNetworkInterfaces',
				description: 'Retrieve the list of network interface types for a device',
				action: 'Get network interfaces of a device',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Query the status of a diagnosis task',
				action: 'Get status of a diagnosis task',
			},
			{
				name: 'Ping',
				value: 'ping',
				description: 'Run a ping diagnostic from a device',
				action: 'Ping from a device',
			},
			{
				name: 'Start Packet Capture',
				value: 'startPacketCapture',
				description: 'Start a packet capture on a device',
				action: 'Start packet capture on a device',
			},
			{
				name: 'Stop Packet Capture',
				value: 'stopPacketCapture',
				description: 'Stop an active packet capture on a device',
				action: 'Stop packet capture on a device',
			},
			{
				name: 'Traceroute',
				value: 'traceroute',
				description: 'Run a traceroute diagnostic from a device',
				action: 'Traceroute from a device',
			},
		],
		default: 'getNetworkInterfaces',
	},
];

export const diagnosisFields: INodeProperties[] = [
	// ----------------------------------
	//         diagnosis: getNetworkInterfaces
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to retrieve network interfaces for',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['getNetworkInterfaces'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: startPacketCapture
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to start packet capture on',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['startPacketCapture'],
			},
		},
	},
	{
		displayName: 'Network Interface',
		name: 'networkInterface',
		type: 'string',
		required: true,
		default: 'wan',
		description:
			'The network port to capture on. Common values: wan (Wide Area Network port), ext0 (external telephone line port), wlan0 (Wireless Local Area Network port). Defaults to wan.',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['startPacketCapture'],
			},
		},
	},
	{
		displayName: 'Duration',
		name: 'duration',
		type: 'number',
		required: true,
		default: 180,
		typeOptions: {
			minValue: 180,
			maxValue: 3600,
		},
		description: 'Capture maximum duration in seconds, range 180-3600',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['startPacketCapture'],
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
				resource: ['diagnosis'],
				operation: ['startPacketCapture'],
			},
		},
		options: [
			{
				displayName: 'Capture Type',
				name: 'type',
				type: 'options',
				default: 0,
				options: [
					{
						name: 'Custom',
						value: 0,
					},
					{
						name: 'SIP or H245 or H225',
						value: 1,
					},
					{
						name: 'RTP',
						value: 2,
					},
					{
						name: 'Not RTP',
						value: 3,
					},
				],
				description: 'The type of packet capture',
			},
			{
				displayName: 'Filter Expression',
				name: 'filter',
				type: 'string',
				default: '',
				description:
					'Capture filtering expression. This value is only used when the capture type is Custom.',
			},
		],
	},

	// ----------------------------------
	//         diagnosis: stopPacketCapture
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to stop packet capture on',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['stopPacketCapture'],
			},
		},
	},
	{
		displayName: 'Diagnosis ID',
		name: 'diagnosisId',
		type: 'string',
		required: true,
		default: '',
		description:
			'The diagnosis session ID returned by the start packet capture operation',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['stopPacketCapture'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: captureScreenshot
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to capture a screenshot from',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['captureScreenshot'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: exportSyslog
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to export the system log from',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['exportSyslog'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: exportConfig
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to export the configuration from',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['exportConfig'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: ping
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to run the ping diagnostic from',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['ping'],
			},
		},
	},
	{
		displayName: 'Target Host',
		name: 'host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. www.google.com',
		description: 'The IP address or domain name to ping',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['ping'],
			},
		},
	},
	{
		displayName: 'Times',
		name: 'times',
		type: 'number',
		required: true,
		default: 1,
		typeOptions: {
			minValue: 1,
			maxValue: 30,
		},
		description: 'Number of ping attempts, minimum 1, maximum 30',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['ping'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: traceroute
	// ----------------------------------
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the device to run the traceroute diagnostic from',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['traceroute'],
			},
		},
	},
	{
		displayName: 'Target Host',
		name: 'host',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. www.google.com',
		description: 'The IP address or domain name to traceroute',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['traceroute'],
			},
		},
	},
	{
		displayName: 'Times',
		name: 'times',
		type: 'number',
		required: true,
		default: 1,
		typeOptions: {
			minValue: 1,
			maxValue: 30,
		},
		description: 'Number of traceroute attempts, minimum 1, maximum 30',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['traceroute'],
			},
		},
	},

	// ----------------------------------
	//         diagnosis: getStatus
	// ----------------------------------
	{
		displayName: 'Diagnosis ID',
		name: 'diagnosisId',
		type: 'string',
		required: true,
		default: '',
		description:
			'The diagnosis ID returned by a diagnostic operation. Poll this endpoint to check task status.',
		displayOptions: {
			show: {
				resource: ['diagnosis'],
				operation: ['getStatus'],
			},
		},
	},
];
