import type { INodeProperties } from 'n8n-workflow';

export const configurationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['configuration'],
			},
		},
		options: [
			{
				name: 'Create Device Config',
				value: 'createDeviceConfig',
				description: 'Add a new device-level configuration',
				action: 'Create a device configuration',
			},
			{
				name: 'Create Group Config',
				value: 'createGroupConfig',
				description: 'Add a new group-level configuration',
				action: 'Create a group configuration',
			},
			{
				name: 'Create Site Config',
				value: 'createSiteConfig',
				description: 'Add a new sub-site configuration',
				action: 'Create a site configuration',
			},
			{
				name: 'Delete Device Configs',
				value: 'deleteDeviceConfigs',
				description: 'Delete one or more device-level configurations',
				action: 'Delete device configurations',
			},
			{
				name: 'Delete Group Configs',
				value: 'deleteGroupConfigs',
				description: 'Delete one or more group-level configurations',
				action: 'Delete group configurations',
			},
			{
				name: 'Delete Site Configs',
				value: 'deleteSiteConfigs',
				description: 'Delete one or more sub-site configurations',
				action: 'Delete site configurations',
			},
			{
				name: 'Get Device Config',
				value: 'getDeviceConfig',
				description: 'Retrieve a device-level configuration',
				action: 'Get a device configuration',
			},
			{
				name: 'Get Group Config',
				value: 'getGroupConfig',
				description: 'Retrieve a group-level configuration',
				action: 'Get a group configuration',
			},
			{
				name: 'Get Many Device Configs',
				value: 'getAllDeviceConfigs',
				description: 'Retrieve a list of device-level configurations',
				action: 'Get many device configurations',
			},
			{
				name: 'Get Many Group Configs',
				value: 'getAllGroupConfigs',
				description: 'Retrieve a list of group-level configurations',
				action: 'Get many group configurations',
			},
			{
				name: 'Get Many Site Configs',
				value: 'getAllSiteConfigs',
				description: 'Retrieve a list of sub-site configurations',
				action: 'Get many site configurations',
			},
			{
				name: 'Get Site Config',
				value: 'getSiteConfig',
				description: 'Retrieve a sub-site configuration',
				action: 'Get a site configuration',
			},
			{
				name: 'Push Device Config',
				value: 'pushDeviceConfig',
				description: 'Push a device-level configuration to devices',
				action: 'Push a device configuration',
			},
			{
				name: 'Push Group Config',
				value: 'pushGroupConfig',
				description: 'Push a group-level configuration to devices',
				action: 'Push a group configuration',
			},
			{
				name: 'Push Site Config',
				value: 'pushSiteConfig',
				description: 'Push a sub-site configuration to devices',
				action: 'Push a site configuration',
			},
			{
				name: 'Update Device Config',
				value: 'updateDeviceConfig',
				description: 'Update a device-level configuration',
				action: 'Update a device configuration',
			},
			{
				name: 'Update Group Config',
				value: 'updateGroupConfig',
				description: 'Update a group-level configuration',
				action: 'Update a group configuration',
			},
			{
				name: 'Update Site Config',
				value: 'updateSiteConfig',
				description: 'Update a sub-site configuration',
				action: 'Update a site configuration',
			},
		],
		default: 'getDeviceConfig',
	},
];

export const configurationFields: INodeProperties[] = [
	// ==========================================
	//       Device Configuration (4.1)
	// ==========================================

	// ----------------------------------
	//   configuration: createDeviceConfig
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. my config',
		description: 'Configuration name, maximum length 64 characters',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createDeviceConfig'],
			},
		},
	},
	{
		displayName: 'Model ID',
		name: 'modelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device model ID. Leave blank to indicate all models.',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createDeviceConfig'],
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
				resource: ['configuration'],
				operation: ['createDeviceConfig'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				placeholder: 'e.g. #!version:1.0.0.1\\naccount.1.codec.g722.enable=1',
				description: 'Configuration file content',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description of the configuration, maximum length 256 characters',
			},
		],
	},

	// ----------------------------------
	//   configuration: updateDeviceConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device configuration ID to update',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateDeviceConfig'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Configuration name, maximum length 64 characters',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateDeviceConfig'],
			},
		},
	},
	{
		displayName: 'Model ID',
		name: 'modelId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device model ID. Leave blank to indicate all models.',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateDeviceConfig'],
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
				resource: ['configuration'],
				operation: ['updateDeviceConfig'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Configuration file content',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description of the configuration, maximum length 256 characters',
			},
		],
	},

	// ----------------------------------
	//   configuration: deleteDeviceConfigs
	// ----------------------------------
	{
		displayName: 'Config IDs',
		name: 'configIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. id1,id2,id3',
		description:
			'Comma-separated list of device configuration IDs to delete, maximum 200 entries',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['deleteDeviceConfigs'],
			},
		},
	},

	// ----------------------------------
	//   configuration: getDeviceConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device configuration ID to retrieve',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getDeviceConfig'],
			},
		},
	},

	// ----------------------------------
	//   configuration: getAllDeviceConfigs
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getAllDeviceConfigs'],
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
				resource: ['configuration'],
				operation: ['getAllDeviceConfigs'],
				returnAll: [false],
			},
		},
	},

	// ----------------------------------
	//   configuration: pushDeviceConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device configuration ID to push',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['pushDeviceConfig'],
			},
		},
	},

	// ==========================================
	//       Site (Sub-site) Configuration (4.2)
	// ==========================================

	// ----------------------------------
	//   configuration: createSiteConfig
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. site1 config',
		description: 'Sub-site configuration name, maximum length 64 characters',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createSiteConfig'],
			},
		},
	},
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		default: '',
		description: 'The site ID for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createSiteConfig'],
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
		],
		description: 'The type of device for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createSiteConfig'],
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
				resource: ['configuration'],
				operation: ['createSiteConfig'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Configuration file content',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 256 characters',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Model ID. Leaving it blank indicates all models.',
			},
		],
	},

	// ----------------------------------
	//   configuration: updateSiteConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The sub-site configuration ID to update',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateSiteConfig'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Sub-site configuration name, maximum length 64 characters',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateSiteConfig'],
			},
		},
	},
	{
		displayName: 'Site ID',
		name: 'siteId',
		type: 'string',
		required: true,
		default: '',
		description: 'The site ID for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateSiteConfig'],
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
		],
		description: 'The type of device for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateSiteConfig'],
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
				resource: ['configuration'],
				operation: ['updateSiteConfig'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Configuration file content',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 256 characters',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Model ID. Leaving it blank indicates all models.',
			},
		],
	},

	// ----------------------------------
	//   configuration: deleteSiteConfigs
	// ----------------------------------
	{
		displayName: 'Config IDs',
		name: 'configIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. id1,id2,id3',
		description:
			'Comma-separated list of sub-site configuration IDs to delete, maximum 200 entries',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['deleteSiteConfigs'],
			},
		},
	},

	// ----------------------------------
	//   configuration: getSiteConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The sub-site configuration ID to retrieve',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getSiteConfig'],
			},
		},
	},

	// ----------------------------------
	//   configuration: getAllSiteConfigs
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getAllSiteConfigs'],
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
				resource: ['configuration'],
				operation: ['getAllSiteConfigs'],
				returnAll: [false],
			},
		},
	},

	// ----------------------------------
	//   configuration: pushSiteConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The sub-site configuration ID to push',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['pushSiteConfig'],
			},
		},
	},

	// ==========================================
	//       Group Configuration (4.3)
	// ==========================================

	// ----------------------------------
	//   configuration: createGroupConfig
	// ----------------------------------
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. group config',
		description: 'Group configuration name, maximum length 64 characters',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createGroupConfig'],
			},
		},
	},
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device group ID for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createGroupConfig'],
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
		],
		description: 'The type of device for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['createGroupConfig'],
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
				resource: ['configuration'],
				operation: ['createGroupConfig'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Configuration file content',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 256 characters',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Model ID. Leaving it blank indicates all models.',
			},
		],
	},

	// ----------------------------------
	//   configuration: updateGroupConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The group configuration ID to update',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateGroupConfig'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Group configuration name, maximum length 64 characters',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateGroupConfig'],
			},
		},
	},
	{
		displayName: 'Device Group ID',
		name: 'deviceGroupId',
		type: 'string',
		required: true,
		default: '',
		description: 'The device group ID for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateGroupConfig'],
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
		],
		description: 'The type of device for this configuration',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['updateGroupConfig'],
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
				resource: ['configuration'],
				operation: ['updateGroupConfig'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				default: '',
				description: 'Configuration file content',
			},
			{
				displayName: 'Description',
				name: 'Description',
				type: 'string',
				default: '',
				description: 'Description, maximum length 256 characters',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Model ID. Leaving it blank indicates all models.',
			},
		],
	},

	// ----------------------------------
	//   configuration: deleteGroupConfigs
	// ----------------------------------
	{
		displayName: 'Config IDs',
		name: 'configIds',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. id1,id2,id3',
		description:
			'Comma-separated list of group configuration IDs to delete, maximum 200 entries',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['deleteGroupConfigs'],
			},
		},
	},

	// ----------------------------------
	//   configuration: getGroupConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The group configuration ID to retrieve',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getGroupConfig'],
			},
		},
	},

	// ----------------------------------
	//   configuration: getAllGroupConfigs
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['getAllGroupConfigs'],
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
				resource: ['configuration'],
				operation: ['getAllGroupConfigs'],
				returnAll: [false],
			},
		},
	},

	// ----------------------------------
	//   configuration: pushGroupConfig
	// ----------------------------------
	{
		displayName: 'Config ID',
		name: 'configId',
		type: 'string',
		required: true,
		default: '',
		description: 'The group configuration ID to push',
		displayOptions: {
			show: {
				resource: ['configuration'],
				operation: ['pushGroupConfig'],
			},
		},
	},
];
