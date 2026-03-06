# Changelog

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
