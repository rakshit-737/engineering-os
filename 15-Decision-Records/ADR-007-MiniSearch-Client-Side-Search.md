---
title: "ADR-007: MiniSearch Client-Side Search"
description: Full-text search runs in the browser with MiniSearch over documents produced at build time.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [search, frontend, performance]
prerequisites: []
related: [ADR-001-Markdown-As-Source-of-Truth, ADR-002-React-Vite-Static-SPA, ADR-Index]
order: 70
adr_status: accepted
date: 2026-09-29
---
# ADR-007: MiniSearch Client-Side Search

## Context

Users need fast full-text search with typo tolerance and field boosting (title over body) across all notes. There is no server ([[ADR-002-React-Vite-Static-SPA]]).

## Problem

Which search engine works fully client-side with good relevance and acceptable payload size?

## Options

| Option | Pros | Cons |
|---|---|---|
| MiniSearch (chosen) | Small, no dependencies, fuzzy + prefix search, field boosting, serializable index | Whole index held in memory; heavy for very large corpora |
| Lunr.js | Mature, supports prebuilt indexes | Less active maintenance; weaker fuzzy/prefix ergonomics |
| Fuse.js | Simple fuzzy matching | Linear scan over documents; slow and noisy on long bodies |
| Hosted search (Algolia) | Strong relevance and UI | External account, API keys, and content leaves the repo |

## Decision

Use MiniSearch. The build ([[ADR-005-Build-Time-Content-Index]]) emits search documents (title, description, tags, headings, plain-text body). The client builds the index lazily on first search, boosting title over tags over headings over body, with fuzzy and prefix matching enabled.

## Rationale

MiniSearch fits the zero-backend constraint, tolerates typos, and its index can be serialized at build time if client-side indexing becomes slow.

## Tradeoffs

- Index size grows with content; body text may need truncation.
- No server-side query analytics (acceptable, and better for privacy).

## Consequences

- Track index build time and payload size as the corpus grows; switch to a prebuilt serialized index when needed.
- Results link by slug, so slug uniqueness stays a hard rule.

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
