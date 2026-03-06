import type {
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class YealinkYmcsApi implements ICredentialType {
	name = 'yealinkYmcsApi';

	displayName = 'Yealink YMCS API';

	documentationUrl = 'https://support.yealink.com/';

	icon: Icon = 'file:yealinkYmcs.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Region',
			name: 'region',
			type: 'options',
			options: [
				{
					name: 'US',
					value: 'us',
				},
				{
					name: 'EU',
					value: 'eu',
				},
				{
					name: 'AU',
					value: 'au',
				},
			],
			default: 'us',
			description: 'The region where your Yealink YMCS enterprise is located',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The Client ID from the YMCS platform',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The Client Secret from the YMCS platform',
		},
	];
}
