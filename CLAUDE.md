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
  YealinkYmcsApi.credentials.ts  # Region, Client ID, Client Secret + all auth logic
  yealinkYmcs.svg                # Icon for credential dialog
nodes/YealinkYmcs/
  YealinkYmcs.node.ts            # Main node entry (resource/operation routing)
  YealinkYmcs.node.json          # Codex metadata (category: Communication)
  yealinkYmcs.svg                # Node icon
  GenericFunctions.ts             # HTTP helpers, pagination, list caches
  descriptions/                   # One file per resource (16 total)
    AlarmDescription.ts
    ConfigurationDescription.ts
    CustomApiCallDescription.ts
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

### Authentication (OAuth2 Client Credentials) — lives in the credential
All auth is defined in `credentials/YealinkYmcsApi.credentials.ts`, **not** in the node. That
single definition serves both this node and any HTTP Request node using the credential.

Three n8n mechanics here are load-bearing and non-obvious. All were established empirically
against n8n 2.30.8; re-verify before changing any of them.

- **`authenticate` must be the object form (`IAuthenticateGeneric`), never a function.** n8n
  serializes credential types to the frontend by spreading them (it appends `iconUrl`), which
  drops both the non-enumerable `toJSON` that would convert a function to `{}` and the
  prototype method itself. `n8n-nodes-base` gets away with function-form `authenticate` only
  because it ships a **pre-generated** `dist/types/credentials.json`. From a community package
  the key vanishes, and the HTTP Request node's Credential Type list filters on
  `has:authenticate` — so the credential silently disappears from that dropdown.
  Check with: `require('/home/node/.cache/n8n/public/types/credentials.json')` inside the
  container and confirm `authenticate !== undefined`.
- **`preAuthentication` only runs if a hidden `expirable` property exists.**
  `CredentialsHelper.preAuthentication` looks for a property with
  `type: 'hidden'` and `typeOptions: { expirable: true }` and returns early when there is
  none — no error, no warning. That property is `_accessToken`. Remove it and every request
  goes out with no token and 401s. n8n stores the token there, reuses it across requests, and
  re-runs `preAuthentication` on a 401, which is why the node has no token cache of its own.
- `authenticate` supplies `timestamp` and `nonce` per request via expressions
  (`Date.now()`, `Math.random()`). YMCS enforces nonce replay protection: reusing one returns
  `403 {"code":"500403","message":"Request reply"}`.
- `test` — declarative POST `/v2/dm/listSites`. Because `preAuthentication` now runs for tests,
  a green result proves the whole chain, not just that the ID and secret parse.
- The credential imports `getBaseUrl` and `generateNonce` from `nodes/YealinkYmcs/GenericFunctions`; `dist/` preserves the directory layout, so the relative require resolves.
- Region expressions need a `|| "us"` fallback: a credential saved without touching the Region
  dropdown stores no `region` at all, and `undefined-api.ymcs.yealink.com` fails DNS — which
  n8n reports as the generic "Authorization failed - please check your credentials".

### Regional Base URLs
- US: `https://us-api.ymcs.yealink.com`
- EU: `https://eu-api.ymcs.yealink.com`
- AU: `https://au-api.ymcs.yealink.com`
- Selected in credential dialog via Region dropdown

### Transport
Plain `this.helpers.httpRequestWithAuthentication()`. The custom `https.Agent` with
`SSL_OP_LEGACY_SERVER_CONNECT` was removed in 0.3.0: it existed because OpenSSL 3.x refuses
unsafe renegotiation, but all three regional hosts now negotiate TLS 1.3, which has no
renegotiation at all. Do not reintroduce it without re-testing the handshake first.

### GenericFunctions.ts
- `getBaseUrl(region)` — maps region code to HTTPS base URL (also used by the credential)
- `generateNonce()` — 32-char random hex string (also used by the credential)
- `ymcsApiRequest(method, endpoint, body, qs)` — authenticated request; normalizes empty 204 bodies to `{}` and unwraps the YMCS error envelope. `body` is **optional on purpose**: omitting it and passing `{}` mean different things. YMCS answers a bodyless POST with `412` (code `900444`) but accepts `{}`. n8n's HTTP layer silently drops an empty object body, so the empty case is sent pre-serialized as the string `'{}'`; non-empty bodies pass through as objects.
- `ymcsApiRequestAllItems(endpoint, body, dataKey, limit?, maxPageSize?)` — POST-based pagination (skip/limit/autoCount)

### API Patterns
- **All list endpoints use POST** with JSON body (not GET with query params)
- **Pagination**: `skip`/`limit` with `autoCount` boolean, max 500 per page (some endpoints cap at 100)
- **Rate limit**: 50 requests/second per enterprise
- **Error format**: `{ code, requestId, message, details: [{ field, message }] }`

### Resources (16 total)
Alarm, Configuration, Custom API Call, Device, Device Accessory, Device Account, Device Control, Device Group, Device Identification, Diagnosis, Firmware, Model, Operation Log, RPS, SIP Account, Site

### Node Features
- `usableAsTool: true` for AI agent compatibility
- `continueOnFail()` error handling on every item
- `constructExecutionMetaData` for proper item linking
- Delete operations return `{ deleted: true }`
- Update operations return `{ updated: true }` via the `updateResult()` helper — YMCS answers every update with 204 and no body, so returning the response verbatim emits an empty item that reads as a failure
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
- Two pre-existing warnings (not errors): `icon-prefer-themed-variants` wants light/dark icon variants

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
