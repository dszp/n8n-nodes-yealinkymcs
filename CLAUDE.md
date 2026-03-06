# CLAUDE.md - n8n-nodes-yealinkymcs

## Project Overview

n8n community node for the Yealink Management Cloud Service (YMCS) Open API V4X. Published to npm as `@dszp/n8n-nodes-yealinkymcs`. Licensed MIT. Author: David Szpunar.

- **Type**: Programmatic n8n node (not declarative) — chosen for custom OAuth2 client_credentials with timestamp/nonce headers, POST-based list endpoints, and complex pagination
- **Node API Version**: 1 (stable)
- **Package manager**: npm
- **TypeScript target**: ES2019, strict mode enabled
- **Current version**: Check `package.json` for latest

## Repository Structure

```
credentials/
  YealinkYmcsApi.credentials.ts  # Region, Client ID, Client Secret
  yealinkYmcs.svg                # Icon for credential dialog
nodes/YealinkYmcs/
  YealinkYmcs.node.ts            # Main node entry (resource/operation routing)
  YealinkYmcs.node.json          # Codex metadata (category: Communication)
  yealinkYmcs.svg                # Node icon
  GenericFunctions.ts             # Token mgmt, HTTP helpers, pagination
  descriptions/                   # One file per resource (15 total)
    AlarmDescription.ts
    ConfigurationDescription.ts
    DeviceAccessoryDescription.ts
    DeviceAccountDescription.ts
    DeviceControlDescription.ts
    DeviceDescription.ts
    DeviceGroupDescription.ts
    DeviceIdentificationDescription.ts
    DiagnosisDescription.ts
    FirmwareDescription.ts
    ModelDescription.ts
    OperationLogDescription.ts
    RpsDescription.ts
    SipAccountDescription.ts
    SiteDescription.ts
```

## Key Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript (n8n-node build)
npm run dev          # Launch n8n locally with this node loaded
npm run lint         # Run n8n node linter
npm run lint:fix     # Auto-fix lint issues
npm run release      # Publish release via release-it
```

## Architecture & Key Patterns

### Authentication (OAuth2 Client Credentials)
- POST `/v2/token` with `Authorization: Basic base64(clientId:clientSecret)`
- Requires `timestamp` (epoch ms) and `nonce` (32-char hex) headers on every request
- Returns `access_token` (JWT) with `expires_in` (86400s = 24h)
- Token cached in module-level `Map<clientId, {token, expiresAt}>` with 5-min safety margin
- Auto-refresh on 401 response (clear cache, re-authenticate once)

### Regional Base URLs
- US: `https://us-api.ymcs.yealink.com`
- EU: `https://eu-api.ymcs.yealink.com`
- AU: `https://au-api.ymcs.yealink.com`
- Selected in credential dialog via Region dropdown

### Custom HTTPS Transport (SSL/TLS)
- Yealink API servers require legacy TLS renegotiation which OpenSSL 3.x disables by default
- Cannot use n8n's built-in `this.helpers.httpRequest()` (axios-based, no custom agent support)
- Uses Node.js native `https.request()` with custom `https.Agent({ secureOptions: SSL_OP_LEGACY_SERVER_CONNECT })`
- Credential auto-validation disabled (n8n's test mechanism uses its own HTTP client without the custom agent)

### GenericFunctions.ts
- `getBaseUrl(region)` — maps region code to HTTPS base URL
- `generateNonce()` — 32-char random hex string
- `getAccessToken(context, credentials)` — token acquisition with caching
- `ymcsApiRequest(method, endpoint, body, qs)` — authenticated request with Bearer token + timestamp + nonce
- `ymcsApiRequestAllItems(endpoint, body, dataKey, limit?, maxPageSize?)` — POST-based pagination (skip/limit/autoCount)

### API Patterns
- **All list endpoints use POST** with JSON body (not GET with query params)
- **Pagination**: `skip`/`limit` with `autoCount` boolean, max 500 per page (some endpoints cap at 100)
- **Rate limit**: 50 requests/second per enterprise
- **Error format**: `{ code, requestId, message, details: [{ field, message }] }`

### Resources (15 total)
Alarm, Configuration, Device, Device Accessory, Device Account, Device Control, Device Group, Device Identification, Diagnosis, Firmware, Model, Operation Log, RPS, SIP Account, Site

### Node Features
- `usableAsTool: true` for AI agent compatibility
- `continueOnFail()` error handling on every item
- `constructExecutionMetaData` for proper item linking
- Delete operations return `{ deleted: true }`
- `returnAll`/`limit` pattern on all list operations

## Code Style & Conventions

### Formatting (`.prettierrc.js`)
- Tabs (width 2), semicolons, single quotes, trailing commas (all)
- Print width: 100, LF line endings
- Arrow parens: always

### Linting
- ESLint flat config (`eslint.config.mjs`) with n8n node linter rules
- Must pass lint before publishing: `npm run lint`
- One suppression: `node-param-resource-with-plural-option` for "RPS" (acronym, not plural)
- Two suppressions: `no-restricted-imports` for `https` and `querystring` (required for custom TLS agent)

### TypeScript
- Strict mode with all checks enabled
- `useUnknownInCatchVariables: false` (exception)
- Incremental compilation, declaration files, source maps

## n8n Node Development Rules

Detailed n8n development standards are in `.claude/rules/` (auto-loaded when editing relevant files):

- @.claude/rules/n8n-ui-standards.md — UI text case, terminology, field layout, progressive disclosure
- @.claude/rules/n8n-code-standards.md — data handling, file structure, verification guidelines
- @.claude/rules/n8n-operations-naming.md — CRUD vocabulary, operation naming, error messages
- @.claude/rules/n8n-credentials.md — credential file structure, auth types
- @.claude/rules/n8n-http-helpers.md — HTTP request helpers, request options, body types

## CI/CD

- **CI** (`.github/workflows/ci.yml`): Runs lint + build on PRs and pushes to main (Node 24)
- **No automated tests** — testing is manual via `npm run dev` against Yealink YMCS instances

## Key Documentation Links

- n8n Node Development: https://docs.n8n.io/integrations/creating-nodes/overview/
- Yealink YMCS Support: https://support.yealink.com/
- YMCS API Reference: `api-reference/Open API for Yealink Management Cloud Service V4X.pdf`
- RPS JSON API Reference: `api-reference/Yealink_Json_API_for_RPS_Management_Platform.pdf`

## Development Notes

- API version: V4X (1.0.0)
- The Yealink API misspells "official" as "offical" in firmware endpoints — code matches API spelling
- Diagnosis operations return a `diagnosisId` — users poll with "Get Status" via n8n workflow loop
- Configuration supports three levels: Device, Site, and Group configs
- See `CHANGELOG.md` for version history
