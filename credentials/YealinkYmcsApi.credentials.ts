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
			displayName: 'Notice',
			name: 'notice',
			type: 'notice',
			default: '',
			description:
				'Credentials cannot be auto-validated due to the Yealink API requiring legacy TLS renegotiation. To verify your credentials work, use the Device → Get Many operation after saving.',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			description: 'The AccessKey ID from the YMCS API Service section',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The AccessKey Secret from the YMCS API Service section',
		},
	];
}
