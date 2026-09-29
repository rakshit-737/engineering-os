---
title: "ADR-002: React + Vite Static SPA"
description: The web interface is a statically built React single-page app bundled with Vite.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [frontend, react, vite]
prerequisites: []
related: [ADR-001-Markdown-As-Source-of-Truth, ADR-003-HashRouter-for-GitHub-Pages, ADR-Index]
order: 20
adr_status: accepted
date: 2026-09-29
---
# ADR-002: React + Vite Static SPA

## Context

The site must run on free static hosting (GitHub Pages), need no server, and offer interactive features: search, filtering, a knowledge graph, and trackable checklists.

## Problem

Which frontend architecture delivers this interactivity with zero backend and a fast build?

## Options

| Option | Pros | Cons |
|---|---|---|
| React + Vite SPA (chosen) | Fast dev server, simple static output, large ecosystem (router, Testing Library) | Client-side rendering: first paint depends on JS; weaker SEO |
| Static site generator (Astro, Docusaurus, MkDocs) | Great SEO, content-first | Custom interactions (graph, localStorage progress) fight the framework; wikilinks need plugins |
| Next.js static export | SSG plus React | Heavier toolchain; many features unavailable in static export |

## Decision

Build a React 19 SPA with Vite 6 and TypeScript, output static assets to `dist/`, and deploy them to GitHub Pages.

## Rationale

The app is closer to a personal tool than a public docs site, so interactivity matters more than SEO. Vite gives fast rebuilds and a trivial static output; React has mature testing (Vitest + Testing Library) and accessibility linting (`eslint-plugin-jsx-a11y`).

## Tradeoffs

- Search engines see a mostly empty shell before JS runs.
- All content JSON is fetched by the browser, so bundle and payload size must be watched.

## Consequences

- Routing must work without server rewrites (see [[ADR-003-HashRouter-for-GitHub-Pages]]).
- No server means no accounts; personal state lives in the browser (see [[ADR-004-LocalStorage-for-Personal-State]]).

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
