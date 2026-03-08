# Changelog

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
