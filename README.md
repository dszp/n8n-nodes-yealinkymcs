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

Click **Test** in the credential dialog to verify the connection before saving.

### Using the credential from an HTTP Request node

The credential also works outside this node. In an **HTTP Request** node, set
**Authentication** to *Predefined Credential Type*, then choose **Yealink YMCS API** as the
Credential Type. Every request then carries the Bearer token plus the `timestamp` and `nonce`
headers the API requires, so you can call any endpoint directly:

```
POST https://us-api.ymcs.yealink.com/v2/dm/listSites
{ "skip": 0, "limit": 10, "autoCount": true }
```

Note that the base URL is region-specific and must be written out in full — the HTTP Request
node does not read the Region from the credential.

## Resources

This node supports 16 resources covering the full YMCS API:

| Resource | Operations |
|----------|-----------|
| **Alarm** | Get Many |
| **Configuration** | Create, Delete, Get, Get Many, Push, Update (for Device, Site, and Group configs) |
| **Custom API Call** | Make API Request |
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

### Custom API Call

Not every endpoint has a dedicated operation, and the API gains new ones over time. The
**Custom API Call** resource calls any YMCS path using the credential's authentication:

- **Method** — defaults to POST, which is what every YMCS list endpoint uses
- **Endpoint** — a path such as `/v2/dm/listDevices`; the host comes from the credential's Region
- **Query Parameters** / **Body** — sent as-is
- **Options → Paginate All Pages** — walks a POST list endpoint using the standard
  skip/limit/autoCount pattern and returns the combined items, so you do not have to build the
  paging loop yourself. Pair with **Response Data Key** (default `data`) and **Max Page Size**
  (500 for most endpoints, but `listDevices` caps at 100).

The output shape depends on that toggle. With **Paginate All Pages** on you get one n8n item
per record. With it off you get the API response verbatim — for a list endpoint that means a
single item holding the `{ skip, limit, total, data }` envelope. Leaving raw responses
untouched is intentional: this operation is a passthrough, and non-list endpoints return
shapes that no generic unwrapping would handle correctly.

An empty body (`{}`) is sent as-is rather than omitted. Most YMCS endpoints reject a request
with no body at all (HTTP 412, code `900444`) but accept `{}` and apply their own defaults.

## Compatibility

- **Minimum n8n version**: 1.0.0+
- **Node.js**: 18+ (tested with Node 22 and 24)
- Tested against Yealink YMCS API V4X (version 1.0.0)

## Known Limitations

- Earlier versions shipped a custom HTTPS agent for legacy TLS renegotiation. It was removed in 0.3.0 because all three regional hosts now negotiate TLS 1.3. If your n8n instance sits behind a TLS-intercepting proxy that forces a lower version, connections may fail.
- Diagnosis operations (packet capture, ping, traceroute, etc.) return a `diagnosisId`. Poll the **Get Status** operation in your workflow to check for completion.
- The Yealink API misspells "official" as "offical" in firmware endpoints. The node matches the API spelling internally but uses the correct spelling in the UI.

## API Documentation

- [Yealink Support Portal](https://support.yealink.com/)
- API reference PDFs are included in the `api-reference/` directory of this repository

## License

[MIT](LICENSE.md)

## Author

**David Szpunar** - [GitHub](https://github.com/dszp)
