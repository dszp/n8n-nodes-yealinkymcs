# Changelog

## [0.3.0] - 2026-07-27

### Changed

- **Removed the legacy TLS renegotiation workaround.** The node no longer uses a custom `https.Agent` with `SSL_OP_LEGACY_SERVER_CONNECT` and raw `https.request`; all traffic now goes through n8n's own HTTP stack (`httpRequestWithAuthentication`). The workaround existed because OpenSSL 3.x refuses unsafe renegotiation, but all three regional hosts (`us-`, `eu-`, `au-api.ymcs.yealink.com`) now negotiate TLS 1.3, which removes renegotiation from the protocol entirely. Benefits: n8n's proxy, timeout and credential-redaction handling now apply. Risk: an environment that forces the connection below TLS 1.3 (for example a TLS-intercepting proxy) no longer has an escape hatch.
- **Authentication moved into the credential.** Token acquisition, caching and 401 refresh are now handled by `preAuthentication` + `authenticate` on `YealinkYmcsApi` instead of a module-level token cache in the node. Auth is defined in exactly one place and behaves identically whether the call comes from this node or an HTTP Request node.
- Credentials are now auto-validated. The "credentials cannot be auto-validated" notice is gone, and the node-side `testedBy` credential test is replaced by a declarative `test` request.

### Added

- **Credential is now usable from the HTTP Request node.** `YealinkYmcsApi` declares an `authenticate` block, so it appears under Authentication → Predefined Credential Type → "Yealink YMCS API". Any YMCS endpoint can be called from a plain HTTP Request node with the Bearer token, `timestamp` and `nonce` headers applied automatically.
- **New Custom API Call resource.** Call any YMCS endpoint with your own method, path, query parameters and JSON body, using the node's existing authentication. Options include `Paginate All Pages`, which walks a POST list endpoint with the standard skip/limit/autoCount pattern, plus `Response Data Key` and `Max Page Size`.
- The Region dropdown now shows the API host for each region (for example "US - us-api.ymcs.yealink.com"), so the base URL is visible when writing it out by hand in an HTTP Request node.
- Credentials are now auto-validated on save. The test performs a real authenticated call, so a green result proves token acquisition and header signing, not just that the fields are filled in.

### Fixed

- Device → Update returning an empty item on success. The endpoint answers 204 with no body, which the node emitted as `""` — indistinguishable from a failed update. It now returns `{ updated: true }`. Same fix applied to SIP Account → Update, RPS → Update Device, RPS → Update Server, Device Group → Update, and all three Configuration updates; Site → Update already had it in 0.2.0.
- Device → Create Many silently dropping serial numbers. The Add Method dropdown emits `withSn`, but the handler compared against `macAndSn`, so the "With MAC and Serial Number" branch was unreachable and every batch posted to `/v2/dm/addDevicesByMac`.
- Device Group → Create sending the group name as `groupName`; the API body field is `name`, so creation failed. Same fix for Device Group → Update, which also now sends the `deviceType` the API requires.
- Device → Update, SIP Account → Update, RPS → Update Device and RPS → Update Server sending a bodyless PATCH when no fields were set. They now raise "No fields provided to update", matching Site → Update.

### Changed (UI)

- Device → Update: the Site field is relabeled "Move to Site" with a description clarifying that leaving it empty keeps the device in its current site. Previously it read as a scope selector, since that is what the identically-labeled field does on Device → Get Many. The internal field name is unchanged, so existing workflows keep their value.
- Device Group → Update: Device Type promoted from Additional Fields to a required top-level field, because the API rejects updates without it.

## [0.2.1] - 2026-07-01

### Changed

- Refresh dependencies to the latest `@n8n/node-cli` toolchain: `@n8n/node-cli` 0.22.0 → 0.37.2 and `n8n-workflow` 2.11.0 → 2.28.2 (regenerated `package-lock.json`). No change to declared dependency ranges.
- Upgrade GitHub Actions to v5 for `checkout` and `setup-node`.

### Fixed

- Wrap re-thrown execution errors in `NodeApiError` (from a raw `throw`) to satisfy the new `require-node-api-error` lint rule in `@n8n/eslint-plugin-community-nodes`. Existing `NodeApiError`s pass through unchanged and inner `NodeOperationError` messages are preserved.
- Correct author email in `package.json` for accurate attribution.

### Added

- Add MIT `LICENSE` file to the repository.

## [0.2.0] - 2026-03-08

### Fixed

- Fix Firmware → Get Many Official returning 400 error: handler now wraps `modelId` in required `filter` object.
- Fix RPS → Update Server not reading server ID from resource locator (added `extractValue`).
- Fix Site → Get, Delete, Update not reading site ID from resource locator (added `extractValue`).
- Fix Site → Update sending empty body to API: now validates at least one field is provided.
- Fix Site → Update returning empty string as `[""]`: now returns `{ updated: true }` on success.
- Fix Site → Create handler still reading removed `additionalFields`; now reads `description` directly.
- Fix Device Identification → Get ID sending user-provided `deviceIdType` which API rejects: hardcoded to `'mac'`.
- Fix RPS server dropdown showing blank entries: map `serverName` field (not `name`) and include URL.

### Added

- Device → Get Many: Device Type, Site, and Model promoted to top-level searchable dropdowns (resource locators). Site dropdown renamed to "Site Including Child(ren)" with clarifying description.
- Firmware → Get Many Official: Model ID is now a searchable resource locator dropdown.
- Firmware → Get Many Custom: Model ID and Device Type promoted to top-level fields (removed from Filters). Device Type selection limits the Model dropdown to matching models.
- Device → Update: Site ID promoted to top-level searchable resource locator dropdown (removed from Update Fields).
- SIP Account → Create: Display Name, Label, and Site promoted to top-level visible fields with Site as a searchable resource locator.
- Site → Get, Delete, Update: Site ID fields are now searchable resource locator dropdowns showing the site hierarchy.
- Site → Update: Parent Site promoted to top-level resource locator dropdown (removed from Update Fields).
- Site → Create: Description promoted to top-level visible field; removed empty Additional Fields section.
- RPS → Update Server: Server ID is now a searchable resource locator dropdown.
- Model list cache and `getModelList` listSearch method for device model dropdowns.

### Changed

- RPS operation names clarified: Create → Create Device, Create Many → Create Many Devices, Delete → Delete Devices, Update → Update Device. Get Many description updated to note "(not servers)".
- RPS → Delete Devices: renamed "Device ID Type" to "Use MAC Address or Device ID Type".
- RPS → Delete Devices: renamed "Device IDs" to "Identifiers of Selected Type".
- Device → Delete Many: renamed and reordered fields to match RPS Delete style — "Use MAC Address or Device ID Type" selector (defaulting to MAC) now appears before "Identifiers of Selected Type".
- Device Identification → Get ID: removed unnecessary Additional Fields section (deviceIdType hardcoded to 'mac').
- Diagnosis → Start Packet Capture: description now notes to retain the Diagnosis ID for stop/lookup.

## [0.1.3] - 2026-03-07

### Fixed

- Fix Site → Create sending wrong API body field: `siteName` key renamed to `name` to match Yealink API.
- Fix Site → Create never reading or sending `parentId` to the API despite it being a required field.
- Fix Site → Create/Update `description` field sent as `Description` (wrong casing) to the API.
- Fix RPS → Create handler reading non-existent params; `sn` and `serverId` were never sent to the API.
- Fix RPS → Create Server handler reading non-existent `serverUrl` param; now reads `serverName` and `url` correctly.
- Fix RPS → Delete handler reading non-existent `rpsDeviceId`; now reads `deviceIdType` + `deviceIds` and POSTs to batch delete endpoint.

### Added

- Site → Create: Parent Site field is now a searchable resource locator dropdown showing the full site hierarchy, sorted alphabetically at each level. Falls back to direct ID entry. Site list is cached for 15 minutes per credential to avoid repeated API calls.
- RPS → Create: Serial Number description now notes it is also known as "Machine ID". Added `Allow Blank Serial Number` toggle for accounts configured by Yealink support to not require a serial number. Added searchable Server dropdown (resource locator).
- RPS → Update: Added searchable Server dropdown (resource locator) and promoted Auth Name and Password to top-level visible fields.
- RPS → Create Server: Promoted Auth Name and Password to top-level visible fields.

## [0.1.2] - 2026-03-06

### Fixed

- Fix empty notice in credential dialog — move notice text to `displayName` field where n8n renders it, so users see the TLS renegotiation warning instead of a blank yellow box.

## [0.1.1] - 2026-03-06

### Fixed

- Add credential test method (`testedBy`) using custom TLS agent to satisfy n8n linter requirement for credential validation. Credential testing now works via the node's `methods.credentialTest` with the custom HTTPS agent, bypassing n8n's built-in HTTP client which doesn't support legacy TLS renegotiation.
- Add `--ignore-scripts` to release-publish GitHub Action to prevent `prepublishOnly` script from blocking automated npm publish.

## [0.1.0] - 2026-03-06

### Added

- Initial release with 15 resources covering the full Yealink YMCS Open API V4X.
- Resources: Alarm, Configuration, Device, Device Accessory, Device Account, Device Control, Device Group, Device Identification, Diagnosis, Firmware, Model, Operation Log, RPS, SIP Account, Site.
- Custom OAuth2 client_credentials authentication with timestamp/nonce headers.
- Custom HTTPS transport with legacy TLS renegotiation support (`SSL_OP_LEGACY_SERVER_CONNECT`).
- POST-based pagination with skip/limit/autoCount pattern.
- Regional endpoint support (US, EU, AU).
- AI agent tool compatibility (`usableAsTool: true`).
- GitHub Actions CI (lint + build) and release-publish workflows.
