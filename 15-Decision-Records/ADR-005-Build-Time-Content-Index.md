---
title: "ADR-005: Build-Time Content Index"
description: A build script parses all Markdown once and emits static JSON consumed by the app.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [build, content, performance]
prerequisites: []
related: [ADR-001-Markdown-As-Source-of-Truth, ADR-002-React-Vite-Static-SPA, ADR-Index]
order: 50
adr_status: accepted
date: 2026-09-29
---
# ADR-005: Build-Time Content Index

## Context

Per [[ADR-001-Markdown-As-Source-of-Truth]] the content is Markdown with frontmatter. The browser needs note lists, metadata, backlinks, a graph, and search documents.

## Problem

When and where is the Markdown parsed and validated?

## Options

| Option | Pros | Cons |
|---|---|---|
| Build-time script emitting JSON (chosen) | One parse per build; validation fails the build; light client | Must re-run on every content change |
| Fetch raw .md and parse in the browser | No build step for content | Every visitor parses everything; no global validation; backlinks need all files anyway |
| Bundle .md via Vite import.meta.glob | Integrated with the bundler | Couples content to the JS bundle; large bundles; harder to validate as a whole |

## Decision

`scripts/build-content.ts` (run by `npm run content`, automatically before `dev` and `build`) reads every numbered-folder `.md`, parses frontmatter with gray-matter, validates it with zod, resolves wikilinks by slug (honoring an explicit `slug` frontmatter field), computes backlinks, and writes `public/content/*.json`. `npm run check:links` runs the same pass in check-only mode.

## Rationale

Doing the work once at build time moves cost off every visitor and turns schema violations, duplicate slugs, and broken wikilinks into build failures instead of silent runtime bugs.

## Tradeoffs

- Content edits need a rebuild to appear on the site.
- The JSON output grows with content; per-note payloads may need to be split and lazy-loaded.

## Consequences

- CI must run the content build and link check on every pull request.
- `docs/CONTENT-SCHEMA.md` and the zod schema must be kept in sync.

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
