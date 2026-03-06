# n8n-nodes-yealinkymcs

This is an [n8n](https://n8n.io/) community node for the [Yealink Management Cloud Service (YMCS)](https://www.yealink.com/) Open API V4X. It lets you manage Yealink VoIP phones and room devices directly from your n8n workflows, including provisioning, configuration, diagnostics, and firmware management.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```
npm install @dszp/n8n-nodes-yealinkymcs
```

Or install from the n8n GUI: **Settings > Community Nodes > Install** and enter `@dszp/n8n-nodes-yealinkymcs`.

## Credentials

You need a Yealink YMCS enterprise account with API access enabled.

1. Log into the [Yealink YMCS portal](https://ymcs.yealink.com/)
2. Navigate to **Enterprise Settings > API Service**
3. Copy the **AccessKey ID** (Client ID) and **AccessKey Secret** (Client Secret)
4. In n8n, create a new **Yealink YMCS API** credential
5. Select your **Region** (US, EU, or AU) and enter the Client ID and Client Secret

> **Note:** Credential auto-validation is not available due to the Yealink API requiring legacy TLS renegotiation. After saving your credentials, test them by running a **Device > Get Many** operation.

## Resources

This node supports 15 resources covering the full YMCS API:

| Resource | Operations |
|----------|-----------|
| **Alarm** | Get Many |
| **Configuration** | Create, Delete, Get, Get Many, Push, Update (for Device, Site, and Group configs) |
| **Device** | Create, Create Many, Delete, Delete Many, Get, Get Configuration, Get Many, Update |
| **Device Accessory** | Get, Get Many, Restart, Factory Reset |
| **Device Account** | Bind, Get Many, Unbind |
| **Device Control** | Factory Reset, Restart |
| **Device Group** | Add Devices, Create, Delete, Get Devices, Get Many, Remove Devices, Update |
| **Device Identification** | Get ID |
| **Diagnosis** | Capture Screenshot, Export Config, Export Syslog, Get Network Interfaces, Get Status, Ping, Start Packet Capture, Stop Packet Capture, Traceroute |
| **Firmware** | Get Many Custom, Get Many Official, Push, Push Official |
| **Model** | Get Many |
| **Operation Log** | Get Many |
| **RPS** | Create, Create Many, Create Server, Delete, Delete Server, Get Many, Get Servers, Update, Update Server |
| **SIP Account** | Create, Delete, Get Many, Update |
| **Site** | Create, Delete, Get, Get Many, Update |

## Compatibility

- **Minimum n8n version**: 1.0.0+
- **Node.js**: 18+ (tested with Node 22 and 24)
- Tested against Yealink YMCS API V4X (version 1.0.0)

## Known Limitations

- The Yealink API servers require legacy TLS renegotiation (`SSL_OP_LEGACY_SERVER_CONNECT`), which is handled automatically by this node using a custom HTTPS agent. This means credential validation on save is not supported.
- Diagnosis operations (packet capture, ping, traceroute, etc.) return a `diagnosisId`. Poll the **Get Status** operation in your workflow to check for completion.
- The Yealink API misspells "official" as "offical" in firmware endpoints. The node matches the API spelling internally but uses the correct spelling in the UI.

## API Documentation

- [Yealink Support Portal](https://support.yealink.com/)
- API reference PDFs are included in the `api-reference/` directory of this repository

## License

[MIT](LICENSE.md)

## Author

**David Szpunar** - [GitHub](https://github.com/dszp)
