---
title: "Checklist: API Design"
description: Review checklist for HTTP APIs covering resources, errors, pagination, versioning, security, and documentation.
domain: checklists
category: engineering
type: checklist
difficulty: intermediate
status: evergreen
tags: [api, rest, design]
prerequisites: []
related: [Pattern-API-Versioning, Pattern-Pagination-Cursor, Pattern-Idempotency-Keys]
order: 20
---
# Checklist: API Design

Run this on a design doc or OpenAPI spec before implementation, and again on the pull request.

## Resources and naming

- [ ] Use plural nouns for collections (`/orders`) and IDs for items (`/orders/{id}`); no verbs in paths except for true actions (`/orders/{id}:cancel` or `POST /orders/{id}/cancel`).
- [ ] Use one casing convention for JSON fields across the API (e.g. `snake_case`) and enforce it in the schema.
- [ ] Represent timestamps as RFC 3339 strings in UTC.
- [ ] Represent money as integer minor units plus a currency code, never floats.
- [ ] Use opaque string IDs (UUID/ULID) in public APIs instead of sequential integers.

## Methods and semantics

- [ ] Make GET, PUT, and DELETE idempotent; verify no GET has side effects.
- [ ] Require an `Idempotency-Key` on POSTs that create charges or orders ([[Pattern-Idempotency-Keys]]).
- [ ] Return `201 Created` with a `Location` header for creations.
- [ ] Support optimistic concurrency with `ETag`/`If-Match` on updatable resources ([[Pattern-Optimistic-Locking]]).
- [ ] Use PATCH with a documented merge format (JSON Merge Patch) or avoid PATCH entirely.

## Errors

- [ ] Use one error format everywhere (RFC 9457 `application/problem+json`: type, title, status, detail).
- [ ] Distinguish 400 (malformed), 401 (unauthenticated), 403 (forbidden), 404, 409 (conflict), 422 (validation), 429 (rate limited).
- [ ] Return field-level validation errors in a machine-readable list.
- [ ] Ensure error bodies never include stack traces, SQL, or internal hostnames.

## Collections

- [ ] Paginate every list endpoint from day one, with a server-enforced maximum page size.
- [ ] Prefer cursor pagination for large or fast-changing collections ([[Pattern-Pagination-Cursor]]).
- [ ] Allowlist filterable and sortable fields; reject unknown ones with 400.
- [ ] Document default sort order and make it deterministic (tiebreak on ID).

## Security

- [ ] Require authentication on every endpoint unless explicitly marked public in the spec.
- [ ] Check object-level authorization on every ID in the path or body (prevents BOLA/IDOR).
- [ ] Reject unknown fields in request bodies to prevent mass assignment.
- [ ] Apply rate limits per API key or user and return `Retry-After` on 429.
- [ ] Set request body size limits and timeouts at the gateway and the app.
- [ ] Validate all input at the boundary ([[Pattern-Input-Validation-at-Boundaries]]).

## Evolution and docs

- [ ] Choose a versioning strategy before the first external client ([[Pattern-API-Versioning]]).
- [ ] Publish an OpenAPI spec generated from, or tested against, the code.
- [ ] Provide a copy-paste `curl` example for every endpoint.
- [ ] Add a CI check that fails on breaking changes to the OpenAPI spec (e.g. oasdiff).
- [ ] Document deprecations with `Deprecation` and `Sunset` headers and a changelog entry.

Back to [[Checklists-Index]].
