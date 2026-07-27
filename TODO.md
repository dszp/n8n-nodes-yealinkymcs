# TODO

## Future Enhancements

### AI-Friendly Tool Descriptions

Add detailed `action` descriptions to all operations optimized for AI agent tool use. When `usableAsTool: true` is set, n8n exposes each operation as a tool to AI agents. The current `action` descriptions are brief; they should be expanded with context about what data is returned, required inputs, and when to use each operation, so AI agents can select the right tool more reliably.

### Yealink RPS JSON API Node

Add a separate node (`YealinkRps`) within this project for the Yealink RPS Management Platform JSON API, which is a completely different API from YMCS:

- **Base URL**: `https://api-dm.yealink.com:8443`
- **Endpoints**: `/api/open/v1/server/...`, `/api/open/v1/device/...`
- **Authentication**: HMAC-SHA256 signature per request (not OAuth2)
  - Headers: `X-Ca-Key`, `X-Ca-Timestamp`, `X-Ca-Nonce`, `Content-MD5`, `X-Ca-Signature`
  - Signature: HMAC-SHA256(stringToSign, AccessKeySecret) then Base64 encode
  - `stringToSign` = HTTPMethod + "\n" + Headers + "\n" + API_URI + "\n" + FormattedQFStr
  - `Content-MD5` = Base64(MD5(body)) for POST requests
- **Credentials**: Separate `YealinkRpsApi` credential type with AccessKey ID and AccessKey Secret
- **Reference**: `api-reference/Yealink_Json_API_for_RPS_Management_Platform.pdf`

#### Resources / Operations

- **Server**: Add, List (paged), Get Details, Check Name Exists, Edit, Delete
- **Device**: Add Batch, List (paged), Get Details, Check Registered, Check Exists, View Server List, Edit, Migrate Batch, Delete Batch

Note: The YMCS API also has `/v2/rps/...` endpoints that overlap with some RPS JSON API functionality but use YMCS OAuth2 auth. The separate RPS JSON API provides additional operations and may be the preferred interface for RPS-heavy workflows.

## Current Known Issues

- Device Group → Update requires `deviceType` on every call (API constraint), so the field is a
  required top-level input even when only the name is changing. If Yealink ever makes it
  optional, demote it back into Additional Fields.

## Verify After Release

- Confirm the credential appears in the HTTP Request node on a real community-package install
  (verified in the dev container via `N8N_CUSTOM_EXTENSIONS`, which uses a different loader).
