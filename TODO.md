# TODO

## Future Enhancements

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

- Credential auto-validation not possible due to Yealink API requiring legacy TLS renegotiation (SSL_OP_LEGACY_SERVER_CONNECT). Users must test credentials manually via Device > Get Many.
- CLAUDE.md still references NetSapiens content and needs to be rewritten for Yealink YMCS.
- version-management.md references NetSapiens paths/names.
