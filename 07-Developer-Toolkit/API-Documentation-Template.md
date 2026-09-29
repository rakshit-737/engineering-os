---
title: API Documentation Template
description: Copy-paste-testable API documentation template for a service.
domain: developer
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [api, docs]
prerequisites: []
related: [README-Template]
order: 10
---
# {{Service Name}} API Documentation

<!-- Golden rule: every endpoint documented here must be copy-paste testable. If a reader
     can't curl it successfully from this page alone, the doc is incomplete. -->

## Service Overview

<!-- 2-3 sentences: what the service does, who calls it, and what it depends on.
     Link the ADRs or design docs that explain the "why". -->

{{What this API is for, primary consumers, upstream/downstream dependencies}}

## Base URL

| Environment | URL |
|---|---|
| Production | `{{https://api.example.com/v1}}` |
| Staging | `{{https://staging-api.example.com/v1}}` |
| Local | `{{http://localhost:8000/v1}}` |

## Authentication

<!-- State the scheme (Bearer JWT, API key header, OAuth2 flow), where to obtain credentials,
     token lifetime, and what a 401 vs 403 means in THIS service. Show the exact header. -->

- Scheme: {{e.g. `Authorization: Bearer <JWT>`}}
- Obtain credentials: {{endpoint or portal}}
- Token lifetime: {{e.g. 1h access / 30d refresh}}
- `401` = missing/expired token, `403` = valid token, insufficient scope

## Endpoints

<!-- Repeat this block per endpoint. Keep the order: purpose -> request -> response -> errors.
     Always show a realistic response body, not just a schema — examples catch more bugs. -->

### {{GET}} /{{resource}}

- **Purpose:** {{one sentence}}
- **Auth required:** {{yes/no + scope}}
- **Query params:**

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| {{limit}} | int | no | 20 | max 100 |

- **Response `200`:**

```json
{{ realistic example body }}
```

- **Errors:**

| Code | Meaning | When |
|---|---|---|
| {{400}} | {{validation failed}} | {{e.g. limit > 100}} |

### {{POST}} /{{resource}}

- **Purpose:** {{one sentence}}
- **Request body:** <!-- mark required fields; note server-side validation rules -->

```json
{{ example request }}
```

- **Response `201`:** {{example or "created resource, same shape as GET"}}
- **Errors:** {{table as above; always document 409/422 semantics for writes}}

## Rate Limits

<!-- Per-key or per-IP? What headers signal remaining quota? What does the 429 body look like
     and does it include Retry-After? -->

{{e.g. 100 req/min per API key; `X-RateLimit-Remaining` header; 429 includes `Retry-After`}}

## Security Controls

<!-- Input validation strategy, CORS policy, TLS requirements, PII fields and how they are
     protected, audit logging. This section is what a security review reads first. -->

{{...}}

## Versioning Policy

<!-- How breaking changes ship: URL version? Header? Deprecation window? -->

{{e.g. breaking changes bump /v1 -> /v2; old version supported 6 months; deprecations announced in changelog}}

## Example cURL

<!-- One complete, working call including auth. Reader should be able to paste and run. -->

```bash
curl -s {{BASE_URL}}/{{resource}} \
  -H "Authorization: Bearer $TOKEN"
```

## Changelog

| Date | Version | Change |
|---|---|---|
| {{YYYY-MM-DD}} | {{1.1.0}} | {{added X endpoint}} |

---

## EXAMPLE (filled, one endpoint)

### GET /notes

- **Purpose:** List the authenticated user's notes, newest first.
- **Auth required:** yes (`notes:read`)
- **Query params:**

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| limit | int | no | 20 | max 100 |
| tag | string | no | — | exact match, case-insensitive |

- **Response `200`:**

```json
{
  "items": [
    {"id": "n_8f2k", "title": "Redis session notes", "tag": "infra", "updated_at": "2026-03-14T09:12:00Z"}
  ],
  "next_cursor": null
}
```

- **Errors:**

| Code | Meaning | When |
|---|---|---|
| 400 | validation failed | `limit` > 100 or not an int |
| 401 | unauthenticated | missing/expired bearer token |

- **cURL:**

```bash
curl -s "https://api.example.com/v1/notes?tag=infra&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```
