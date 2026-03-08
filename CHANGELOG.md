# Changelog

## [0.1.3] - 2026-03-07

### Fixed

- Fix Site → Create sending wrong API body field: `siteName` key renamed to `name` to match Yealink API.
- Fix Site → Create never reading or sending `parentId` to the API despite it being a required field.
- Fix Site → Create/Update `description` field sent as `Description` (wrong casing) to the API.

### Added

- Site → Create: Parent Site field is now a searchable resource locator dropdown showing the full site hierarchy, sorted alphabetically at each level. Falls back to direct ID entry. Site list is cached for 15 minutes per credential to avoid repeated API calls.

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
