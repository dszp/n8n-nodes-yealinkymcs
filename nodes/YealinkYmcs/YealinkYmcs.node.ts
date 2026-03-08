import type {
	ICredentialTestFunctions,
	ICredentialsDecrypted,
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import {
	getAccessToken,
	getCachedRpsServerList,
	getCachedSiteList,
	ymcsApiRequest,
	ymcsApiRequestAllItems,
} from './GenericFunctions';

import { alarmOperations, alarmFields } from './descriptions/AlarmDescription';
import {
	configurationOperations,
	configurationFields,
} from './descriptions/ConfigurationDescription';
import { deviceOperations, deviceFields } from './descriptions/DeviceDescription';
import {
	deviceAccessoryOperations,
	deviceAccessoryFields,
} from './descriptions/DeviceAccessoryDescription';
import {
	deviceAccountOperations,
	deviceAccountFields,
} from './descriptions/DeviceAccountDescription';
import {
	deviceControlOperations,
	deviceControlFields,
} from './descriptions/DeviceControlDescription';
import {
	deviceGroupOperations,
	deviceGroupFields,
} from './descriptions/DeviceGroupDescription';
import {
	deviceIdentificationOperations,
	deviceIdentificationFields,
} from './descriptions/DeviceIdentificationDescription';
import { diagnosisOperations, diagnosisFields } from './descriptions/DiagnosisDescription';
import { firmwareOperations, firmwareFields } from './descriptions/FirmwareDescription';
import { modelOperations, modelFields } from './descriptions/ModelDescription';
import {
	operationLogOperations,
	operationLogFields,
} from './descriptions/OperationLogDescription';
import { rpsOperations, rpsFields } from './descriptions/RpsDescription';
import { sipAccountOperations, sipAccountFields } from './descriptions/SipAccountDescription';
import { siteOperations, siteFields } from './descriptions/SiteDescription';

export class YealinkYmcs implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Yealink YMCS',
		name: 'yealinkYmcs',
		icon: 'file:yealinkYmcs.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Connect to and control the Yealink YMCS and RPS platforms.',
		defaults: {
			name: 'Yealink YMCS',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'yealinkYmcsApi',
				required: true,
				testedBy: 'yealinkYmcsApiTest',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Alarm', value: 'alarm' },
					{ name: 'Configuration', value: 'configuration' },
					{ name: 'Device', value: 'device' },
					{ name: 'Device Accessory', value: 'deviceAccessory' },
					{ name: 'Device Account', value: 'deviceAccount' },
					{ name: 'Device Control', value: 'deviceControl' },
					{ name: 'Device Group', value: 'deviceGroup' },
					{ name: 'Device Identification', value: 'deviceIdentification' },
					{ name: 'Diagnosis', value: 'diagnosis' },
					{ name: 'Firmware', value: 'firmware' },
					{ name: 'Model', value: 'model' },
					{ name: 'Operation Log', value: 'operationLog' },
					// eslint-disable-next-line n8n-nodes-base/node-param-resource-with-plural-option
				{ name: 'RPS', value: 'rps' },
					{ name: 'SIP Account', value: 'sipAccount' },
					{ name: 'Site', value: 'site' },
				],
				default: 'device',
			},
			// Spread all operations and fields
			...alarmOperations,
			...alarmFields,
			...configurationOperations,
			...configurationFields,
			...deviceOperations,
			...deviceFields,
			...deviceAccessoryOperations,
			...deviceAccessoryFields,
			...deviceAccountOperations,
			...deviceAccountFields,
			...deviceControlOperations,
			...deviceControlFields,
			...deviceGroupOperations,
			...deviceGroupFields,
			...deviceIdentificationOperations,
			...deviceIdentificationFields,
			...diagnosisOperations,
			...diagnosisFields,
			...firmwareOperations,
			...firmwareFields,
			...modelOperations,
			...modelFields,
			...operationLogOperations,
			...operationLogFields,
			...rpsOperations,
			...rpsFields,
			...sipAccountOperations,
			...sipAccountFields,
			...siteOperations,
			...siteFields,
		],
	};

	methods = {
		credentialTest: {
			async yealinkYmcsApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data as IDataObject;
				try {
					await getAccessToken(this, credentials);
					return {
						status: 'OK',
						message: 'Connection successful',
					};
				} catch (error) {
					return {
						status: 'Error',
						message: `Connection failed: ${(error as Error).message}`,
					};
				}
			},
		},
		listSearch: {
			async getRpsServerList(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const servers = await getCachedRpsServerList(this);
				const lowerFilter = filter?.toLowerCase();
				const results = servers
					.filter((s) => !lowerFilter || (s.name as string).toLowerCase().includes(lowerFilter))
					.sort((a, b) => (a.name as string).localeCompare(b.name as string))
					.map((s) => ({ name: s.name as string, value: s.id as string }));
				return { results };
			},
			async getSiteList(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const sites = await getCachedSiteList(this);

				// Group children by parentId, sort each group alphabetically
				const byParent = new Map<string | null, IDataObject[]>();
				for (const site of sites) {
					const pid = (site.parentId as string | null) ?? null;
					if (!byParent.has(pid)) byParent.set(pid, []);
					byParent.get(pid)!.push(site);
				}
				for (const children of byParent.values()) {
					children.sort((a, b) =>
						(a.name as string).localeCompare(b.name as string),
					);
				}

				const results: Array<{ name: string; value: string }> = [];
				const lowerFilter = filter?.toLowerCase();

				const traverse = (parentId: string | null, depth: number) => {
					for (const site of byParent.get(parentId) ?? []) {
						const siteName = site.name as string;
						if (!lowerFilter || siteName.toLowerCase().includes(lowerFilter)) {
							results.push({
								name: '\u00a0\u00a0'.repeat(depth) + siteName,
								value: site.id as string,
							});
						}
						traverse(site.id as string, depth + 1);
					}
				};

				traverse(null, 0);
				return { results };
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ---------------------------------------------------------------
				// ALARM
				// ---------------------------------------------------------------
				if (resource === 'alarm') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const body: IDataObject = { filter: filters };
						if (returnAll) {
							responseData = await ymcsApiRequestAllItems.call(
								this,
								'/v2/dm/listAlarms',
								body,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await ymcsApiRequestAllItems.call(
								this,
								'/v2/dm/listAlarms',
								body,
								'data',
								limit,
							);
						}
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
							itemIndex: i,
						});
					}
				}

				// ---------------------------------------------------------------
				// CONFIGURATION
				// ---------------------------------------------------------------
				else if (resource === 'configuration') {
					responseData = await handleConfigurationOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// DEVICE
				// ---------------------------------------------------------------
				else if (resource === 'device') {
					responseData = await handleDeviceOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// DEVICE ACCESSORY
				// ---------------------------------------------------------------
				else if (resource === 'deviceAccessory') {
					responseData = await handleDeviceAccessoryOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// DEVICE ACCOUNT
				// ---------------------------------------------------------------
				else if (resource === 'deviceAccount') {
					responseData = await handleDeviceAccountOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// DEVICE CONTROL
				// ---------------------------------------------------------------
				else if (resource === 'deviceControl') {
					const deviceIds = (this.getNodeParameter('deviceIds', i) as string)
						.split(',')
						.map((id) => id.trim());
					const deviceType = this.getNodeParameter('deviceType', i) as number;
					const endpoint =
						operation === 'restart' ? '/v2/dm/device/reboot' : '/v2/dm/device/reset';
					responseData = await ymcsApiRequest.call(this, 'POST', endpoint, {
						deviceIds,
						deviceType,
					});
				}

				// ---------------------------------------------------------------
				// DEVICE GROUP
				// ---------------------------------------------------------------
				else if (resource === 'deviceGroup') {
					responseData = await handleDeviceGroupOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// DEVICE IDENTIFICATION
				// ---------------------------------------------------------------
				else if (resource === 'deviceIdentification') {
					if (operation === 'getId') {
						const mac = this.getNodeParameter('mac', i) as string;
						const deviceType = this.getNodeParameter('deviceType', i) as number;
						const additionalFields = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as IDataObject;
						const body: IDataObject = {
							deviceType,
							deviceIds: [mac],
							deviceIdType: (additionalFields.deviceIdType as string) || 'mac',
						};
						responseData = await ymcsApiRequest.call(this, 'POST', '/v2/dm/deviceId', body);
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex: i },
						);
					}
				}

				// ---------------------------------------------------------------
				// DIAGNOSIS
				// ---------------------------------------------------------------
				else if (resource === 'diagnosis') {
					responseData = await handleDiagnosisOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// FIRMWARE
				// ---------------------------------------------------------------
				else if (resource === 'firmware') {
					responseData = await handleFirmwareOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// MODEL
				// ---------------------------------------------------------------
				else if (resource === 'model') {
					if (operation === 'getAll') {
						const deviceType = this.getNodeParameter('deviceType', i) as number;
						responseData = await ymcsApiRequest.call(this, 'GET', '/v2/dm/models', {}, { deviceType });
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex: i },
						);
					}
				}

				// ---------------------------------------------------------------
				// OPERATION LOG
				// ---------------------------------------------------------------
				else if (resource === 'operationLog') {
					if (operation === 'getAll') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
						const body: IDataObject = { filter: filters };
						if (returnAll) {
							responseData = await ymcsApiRequestAllItems.call(
								this,
								'/v2/dm/listOpLogs',
								body,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							responseData = await ymcsApiRequestAllItems.call(
								this,
								'/v2/dm/listOpLogs',
								body,
								'data',
								limit,
							);
						}
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex: i },
						);
					}
				}

				// ---------------------------------------------------------------
				// RPS
				// ---------------------------------------------------------------
				else if (resource === 'rps') {
					responseData = await handleRpsOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// SIP ACCOUNT
				// ---------------------------------------------------------------
				else if (resource === 'sipAccount') {
					responseData = await handleSipAccountOperation.call(this, operation, i);
				}

				// ---------------------------------------------------------------
				// SITE
				// ---------------------------------------------------------------
				else if (resource === 'site') {
					responseData = await handleSiteOperation.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});
				}

				// Build output items with item linking
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push(
						...this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray({ error: (error as Error).message }),
							{ itemData: { item: i } },
						),
					);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// ==========================================================================
// Resource handler helpers
// ==========================================================================

async function handleDeviceOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const mac = this.getNodeParameter('mac', i) as string;
		const sn = this.getNodeParameter('sn', i) as string;
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const modelId = this.getNodeParameter('modelId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = { mac, sn, deviceType, modelId, ...additionalFields };
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/devices', body);
	}

	if (operation === 'createMany') {
		const addMethod = this.getNodeParameter('addMethod', i) as string;
		const devicesJson = this.getNodeParameter('devicesJson', i) as string;
		const devices = JSON.parse(devicesJson);
		const endpoint =
			addMethod === 'macAndSn' ? '/v2/dm/addDevices' : '/v2/dm/addDevicesByMac';
		return await ymcsApiRequest.call(this, 'POST', endpoint, { devices });
	}

	if (operation === 'delete') {
		const deviceId = this.getNodeParameter('deviceId', i) as string;
		await ymcsApiRequest.call(this, 'DELETE', `/v2/dm/devices/${deviceId}`);
		return { deleted: true };
	}

	if (operation === 'deleteMany') {
		const deviceIds = (this.getNodeParameter('deviceIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/delDevices', {
			deviceIds,
			deviceType,
			...additionalFields,
		});
	}

	if (operation === 'get') {
		const deviceId = this.getNodeParameter('deviceId', i) as string;
		return await ymcsApiRequest.call(this, 'GET', `/v2/dm/devices/${deviceId}`);
	}

	if (operation === 'getConfiguration') {
		const deviceId = this.getNodeParameter('deviceId', i) as string;
		return await ymcsApiRequest.call(this, 'GET', `/v2/dm/devices/${deviceId}/configs`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listDevices', body, 'data', undefined, 100);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listDevices',
			body,
			'data',
			limit,
			100,
		);
	}

	if (operation === 'update') {
		const deviceId = this.getNodeParameter('deviceId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(
			this,
			'PATCH',
			`/v2/dm/devices/${deviceId}`,
			updateFields,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleDeviceGroupOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const groupName = this.getNodeParameter('groupName', i) as string;
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/deviceGroups', {
			groupName,
			deviceType,
			...additionalFields,
		});
	}

	if (operation === 'delete') {
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		await ymcsApiRequest.call(this, 'DELETE', `/v2/dm/deviceGroups/${deviceGroupId}`);
		return { deleted: true };
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listDeviceGroups', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listDeviceGroups',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'update') {
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		const groupName = this.getNodeParameter('groupName', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(
			this,
			'PATCH',
			`/v2/dm/deviceGroups/${deviceGroupId}`,
			{ groupName, ...additionalFields },
		);
	}

	if (operation === 'addDevices') {
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		const deviceIds = (this.getNodeParameter('deviceIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/deviceGroups/${deviceGroupId}/addDevices`,
			{ deviceIds },
		);
	}

	if (operation === 'removeDevices') {
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		const deviceIds = (this.getNodeParameter('deviceIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/deviceGroups/${deviceGroupId}/delDevices`,
			{ deviceIds },
		);
	}

	if (operation === 'getDevices') {
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(
				this,
				`/v2/dm/deviceGroups/${deviceGroupId}/listDevices`,
				body,
			);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			`/v2/dm/deviceGroups/${deviceGroupId}/listDevices`,
			body,
			'data',
			limit,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleDeviceAccessoryOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const deviceId = this.getNodeParameter('deviceId', i) as string;

	if (operation === 'get') {
		const partId = this.getNodeParameter('partId', i) as string;
		return await ymcsApiRequest.call(
			this,
			'GET',
			`/v2/dm/devices/${deviceId}/parts/${partId}`,
		);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const body: IDataObject = {};
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(
				this,
				`/v2/dm/devices/${deviceId}/listParts`,
				body,
			);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			`/v2/dm/devices/${deviceId}/listParts`,
			body,
			'data',
			limit,
		);
	}

	if (operation === 'restart') {
		const partIds = (this.getNodeParameter('partIds', i, '') as string)
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/devices/${deviceId}/parts/reboot`,
			partIds.length ? { partIds } : {},
		);
	}

	if (operation === 'factoryReset') {
		const partIds = (this.getNodeParameter('partIds', i, '') as string)
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/devices/${deviceId}/parts/reset`,
			partIds.length ? { partIds } : {},
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleDeviceAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	const deviceId = this.getNodeParameter('deviceId', i) as string;

	if (operation === 'bind') {
		const accountsJson = this.getNodeParameter('accountsJson', i) as string;
		const accounts = JSON.parse(accountsJson);
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/devices/${deviceId}/bindAccounts`,
			{ accounts },
		);
	}

	if (operation === 'unbind') {
		const accountIds = (this.getNodeParameter('accountIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/devices/${deviceId}/unbindAccounts`,
			{ accountIds },
		);
	}

	if (operation === 'getAll') {
		return await ymcsApiRequest.call(
			this,
			'GET',
			`/v2/dm/devices/${deviceId}/boundAccounts`,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleDiagnosisOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getStatus') {
		const diagnosisId = this.getNodeParameter('diagnosisId', i) as string;
		return await ymcsApiRequest.call(
			this,
			'GET',
			`/v2/dm/diagnosis/${diagnosisId}/status`,
		);
	}

	const deviceId = this.getNodeParameter('deviceId', i) as string;

	if (operation === 'getNetworkInterfaces') {
		return await ymcsApiRequest.call(
			this,
			'GET',
			`/v2/dm/devices/${deviceId}/networkInterfaces`,
		);
	}

	if (operation === 'startPacketCapture') {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(
			this,
			'PUT',
			`/v2/dm/devices/${deviceId}/startPacketCapture`,
			additionalFields,
		);
	}

	if (operation === 'stopPacketCapture') {
		const diagnosisId = this.getNodeParameter('diagnosisId', i) as string;
		return await ymcsApiRequest.call(
			this,
			'PUT',
			`/v2/dm/devices/${deviceId}/stopPacketCapture`,
			{ diagnosisId },
		);
	}

	if (operation === 'captureScreenshot') {
		return await ymcsApiRequest.call(
			this,
			'PUT',
			`/v2/dm/devices/${deviceId}/captureScreen`,
		);
	}

	if (operation === 'exportSyslog') {
		return await ymcsApiRequest.call(
			this,
			'PUT',
			`/v2/dm/devices/${deviceId}/exportSyslog`,
		);
	}

	if (operation === 'exportConfig') {
		return await ymcsApiRequest.call(
			this,
			'PUT',
			`/v2/dm/devices/${deviceId}/exportConfig`,
		);
	}

	if (operation === 'ping') {
		const host = this.getNodeParameter('host', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'PUT', `/v2/dm/devices/${deviceId}/ping`, {
			host,
			...additionalFields,
		});
	}

	if (operation === 'traceroute') {
		const host = this.getNodeParameter('host', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(
			this,
			'PUT',
			`/v2/dm/devices/${deviceId}/traceroute`,
			{ host, ...additionalFields },
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleFirmwareOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAllOfficial') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const modelId = this.getNodeParameter('modelId', i) as string;
		const body: IDataObject = { modelId };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(
				this,
				'/v2/dm/listOfficalFirmwares',
				body,
			);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listOfficalFirmwares',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'getAllCustom') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listFirmwares', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listFirmwares',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'push') {
		const firmwareId = this.getNodeParameter('firmwareId', i) as string;
		const deviceIds = (this.getNodeParameter('deviceIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/firmwares/${firmwareId}/push`,
			{ deviceIds, deviceType },
		);
	}

	if (operation === 'pushOfficial') {
		const officalFirmwareId = this.getNodeParameter('officalFirmwareId', i) as string;
		const deviceIds = (this.getNodeParameter('deviceIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/officalFirmwares/${officalFirmwareId}/push`,
			{ deviceIds, deviceType },
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleRpsOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const mac = this.getNodeParameter('mac', i) as string;
		const sn = this.getNodeParameter('sn', i, '') as string;
		const snOverride = this.getNodeParameter('snOverride', i, false) as boolean;
		if (!snOverride && !sn) {
			throw new NodeOperationError(this.getNode(), 'Serial Number is required', {
				itemIndex: i,
				description:
					"Enter the device Serial Number (Machine ID), or enable 'Allow Blank Serial Number' if your account has been configured by Yealink support to allow it.",
			});
		}
		const serverId = this.getNodeParameter('serverId', i, '', { extractValue: true }) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = { mac };
		if (sn) body.sn = sn;
		if (serverId) body.serverId = serverId;
		return await ymcsApiRequest.call(this, 'POST', '/v2/rps/devices', { ...body, ...additionalFields });
	}

	if (operation === 'createMany') {
		const devicesJson = this.getNodeParameter('devicesJson', i) as string;
		const devices = JSON.parse(devicesJson);
		return await ymcsApiRequest.call(this, 'POST', '/v2/rps/addDevices', { devices });
	}

	if (operation === 'delete') {
		const deviceIdType = this.getNodeParameter('deviceIdType', i) as string;
		const deviceIds = this.getNodeParameter('deviceIds', i) as string;
		const ids = deviceIds.split(',').map((s: string) => s.trim()).filter(Boolean);
		await ymcsApiRequest.call(this, 'POST', '/v2/rps/deleteDevices', {
			ids,
			idType: deviceIdType,
		});
		return { deleted: true };
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/rps/listDevices', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/rps/listDevices',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'update') {
		const rpsDeviceId = this.getNodeParameter('rpsDeviceId', i) as string;
		const serverId = this.getNodeParameter('serverId', i, '', { extractValue: true }) as string;
		const authName = this.getNodeParameter('authName', i, '') as string;
		const password = this.getNodeParameter('password', i, '') as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		const body: IDataObject = { ...updateFields };
		if (serverId) body.serverId = serverId;
		if (authName) body.authName = authName;
		if (password) body.password = password;
		return await ymcsApiRequest.call(this, 'PATCH', `/v2/rps/devices/${rpsDeviceId}`, body);
	}

	if (operation === 'getServers') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const body: IDataObject = {};
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/rps/listServers', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/rps/listServers',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'createServer') {
		const serverName = this.getNodeParameter('serverName', i) as string;
		const url = this.getNodeParameter('url', i) as string;
		const authName = this.getNodeParameter('authName', i, '') as string;
		const password = this.getNodeParameter('password', i, '') as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const body: IDataObject = { serverName, url };
		if (authName) body.authName = authName;
		if (password) body.password = password;
		return await ymcsApiRequest.call(this, 'POST', '/v2/rps/servers', { ...body, ...additionalFields });
	}

	if (operation === 'deleteServer') {
		const rpsServerId = this.getNodeParameter('rpsServerId', i) as string;
		await ymcsApiRequest.call(this, 'DELETE', `/v2/rps/servers/${rpsServerId}`);
		return { deleted: true };
	}

	if (operation === 'updateServer') {
		const rpsServerId = this.getNodeParameter('rpsServerId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(
			this,
			'PATCH',
			`/v2/rps/servers/${rpsServerId}`,
			updateFields,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleSipAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const registerName = this.getNodeParameter('registerName', i) as string;
		const username = this.getNodeParameter('username', i) as string;
		const password = this.getNodeParameter('password', i) as string;
		const sipServer1Host = this.getNodeParameter('sipServer1Host', i) as string;
		const sipServer1Port = this.getNodeParameter('sipServer1Port', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/sipAccounts', {
			registerName,
			username,
			password,
			sipServer1Host,
			sipServer1Port,
			...additionalFields,
		});
	}

	if (operation === 'delete') {
		const accountIds = (this.getNodeParameter('accountIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/delAccounts', { accountIds });
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listAccounts', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listAccounts',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'update') {
		const accountId = this.getNodeParameter('accountId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(
			this,
			'PATCH',
			`/v2/dm/sipAccounts/${accountId}`,
			updateFields,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleSiteOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'create') {
		const siteName = this.getNodeParameter('name', i) as string;
		const parentId = this.getNodeParameter('parentId', i, '', { extractValue: true }) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/sites', {
			name: siteName,
			parentId,
			...additionalFields,
		});
	}

	if (operation === 'delete') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		await ymcsApiRequest.call(this, 'DELETE', `/v2/dm/sites/${siteId}`);
		return { deleted: true };
	}

	if (operation === 'get') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		return await ymcsApiRequest.call(this, 'GET', `/v2/dm/sites/${siteId}`);
	}

	if (operation === 'getAll') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const body: IDataObject = { filter: filters };
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listSites', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listSites',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'update') {
		const siteId = this.getNodeParameter('siteId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'PATCH', `/v2/dm/sites/${siteId}`, updateFields);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}

async function handleConfigurationOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	// Device config operations
	if (operation === 'getDeviceConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		return await ymcsApiRequest.call(this, 'GET', `/v2/dm/deviceConfigs/${configId}`);
	}

	if (operation === 'getAllDeviceConfigs') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const body: IDataObject = {};
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listDeviceConfigs', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listDeviceConfigs',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'createDeviceConfig') {
		const name = this.getNodeParameter('name', i) as string;
		const modelId = this.getNodeParameter('modelId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/deviceConfigs', {
			name,
			modelId,
			...additionalFields,
		});
	}

	if (operation === 'updateDeviceConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const modelId = this.getNodeParameter('modelId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'PATCH', `/v2/dm/deviceConfigs/${configId}`, {
			name,
			modelId,
			...additionalFields,
		});
	}

	if (operation === 'deleteDeviceConfigs') {
		const configIds = (this.getNodeParameter('configIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/delDeviceConfigs', { configIds });
	}

	if (operation === 'pushDeviceConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/deviceConfigs/${configId}/push`,
		);
	}

	// Site config operations
	if (operation === 'getSiteConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		return await ymcsApiRequest.call(this, 'GET', `/v2/dm/siteConfigs/${configId}`);
	}

	if (operation === 'getAllSiteConfigs') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const body: IDataObject = {};
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listSiteConfigs', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listSiteConfigs',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'createSiteConfig') {
		const name = this.getNodeParameter('name', i) as string;
		const siteId = this.getNodeParameter('siteId', i) as string;
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/siteConfigs', {
			name,
			siteId,
			deviceType,
			...additionalFields,
		});
	}

	if (operation === 'updateSiteConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const siteId = this.getNodeParameter('siteId', i) as string;
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'PATCH', `/v2/dm/siteConfigs/${configId}`, {
			name,
			siteId,
			deviceType,
			...additionalFields,
		});
	}

	if (operation === 'deleteSiteConfigs') {
		const configIds = (this.getNodeParameter('configIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/delSiteConfigs', { configIds });
	}

	if (operation === 'pushSiteConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/siteConfigs/${configId}/push`,
		);
	}

	// Group config operations
	if (operation === 'getGroupConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		return await ymcsApiRequest.call(this, 'GET', `/v2/dm/groupConfigs/${configId}`);
	}

	if (operation === 'getAllGroupConfigs') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const body: IDataObject = {};
		if (returnAll) {
			return await ymcsApiRequestAllItems.call(this, '/v2/dm/listGroupConfigs', body);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return await ymcsApiRequestAllItems.call(
			this,
			'/v2/dm/listGroupConfigs',
			body,
			'data',
			limit,
		);
	}

	if (operation === 'createGroupConfig') {
		const name = this.getNodeParameter('name', i) as string;
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/groupConfigs', {
			name,
			deviceGroupId,
			deviceType,
			...additionalFields,
		});
	}

	if (operation === 'updateGroupConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const deviceGroupId = this.getNodeParameter('deviceGroupId', i) as string;
		const deviceType = this.getNodeParameter('deviceType', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		return await ymcsApiRequest.call(this, 'PATCH', `/v2/dm/groupConfigs/${configId}`, {
			name,
			deviceGroupId,
			deviceType,
			...additionalFields,
		});
	}

	if (operation === 'deleteGroupConfigs') {
		const configIds = (this.getNodeParameter('configIds', i) as string)
			.split(',')
			.map((id) => id.trim());
		return await ymcsApiRequest.call(this, 'POST', '/v2/dm/delGroupConfigs', { configIds });
	}

	if (operation === 'pushGroupConfig') {
		const configId = this.getNodeParameter('configId', i) as string;
		return await ymcsApiRequest.call(
			this,
			'POST',
			`/v2/dm/groupConfigs/${configId}/push`,
		);
	}

	throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
		itemIndex: i,
	});
}
