---
title: "ADR-003: HashRouter for GitHub Pages"
description: Use hash-based routing so deep links work on GitHub Pages without server rewrites.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [frontend, routing, deployment]
prerequisites: []
related: [ADR-001-Markdown-As-Source-of-Truth, ADR-002-React-Vite-Static-SPA, ADR-Index]
order: 30
adr_status: accepted
date: 2026-09-29
---
# ADR-003: HashRouter for GitHub Pages

## Context

GitHub Pages serves static files and cannot rewrite unknown paths to `index.html`. With history-based routing, reloading a deep link such as `/notes/rate-limiting` returns a 404.

## Problem

How do deep links and page reloads work on a host with no rewrite rules?

## Options

| Option | Pros | Cons |
|---|---|---|
| HashRouter (chosen) | Works on any static host with zero config | URLs contain `#/`; heading anchors need custom handling |
| BrowserRouter + 404.html redirect trick | Clean URLs | Fragile script workaround; first response is still HTTP 404; crawlers see errors |
| Move to a host with rewrites (Netlify, Cloudflare Pages) | Clean URLs, correct status codes | Adds an external account and dependency the project does not otherwise need |

## Decision

Use `react-router-dom`'s `HashRouter`. All in-app links are generated through the router.

## Rationale

It is the only option that is correct by construction on GitHub Pages. The cosmetic cost of `#/` is acceptable for a personal knowledge tool.

## Tradeoffs

- Heading anchors cannot use the native URL fragment; in-page heading navigation must scroll programmatically.
- Migrating to clean URLs later changes every shared link.

## Consequences

- If hosting moves to a platform with rewrites, supersede this ADR and add a redirect from hash URLs.

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
