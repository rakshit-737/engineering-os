---
title: "ADR-001: Markdown as Source of Truth"
description: All knowledge lives in plain Markdown files in numbered folders; the web app is a derived view.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [markdown, content]
prerequisites: []
related: [ADR-002-React-Vite-Static-SPA, ADR-003-HashRouter-for-GitHub-Pages, ADR-Index]
order: 10
adr_status: accepted
date: 2026-09-29
---
# ADR-001: Markdown as Source of Truth

## Context

Engineering OS started as an Obsidian vault: notes across CS core, system design, security, AI, and career. The content is written in Obsidian and on GitHub, and now also needs a searchable web interface.

## Problem

Where does the canonical copy of each note live, so that editing in Obsidian, reviewing on GitHub, and browsing on the website never diverge?

## Options

| Option | Pros | Cons |
|---|---|---|
| Markdown files in the repo (chosen) | Works in Obsidian, GitHub, any editor; diffable; no lock-in | Structure must be enforced by convention plus a build check |
| Headless CMS / database | Rich editing, structured fields | Breaks the Obsidian workflow; hosting cost; content leaves git history |
| MDX with embedded components | Interactive notes | Obsidian and GitHub cannot render it; couples content to React |

## Decision

Markdown files under numbered folders (`00-*` .. `99-*`) are the single source of truth. Metadata lives in YAML frontmatter defined in `docs/CONTENT-SCHEMA.md`. Everything else (JSON index, search index, graph) is generated and never edited by hand.

## Rationale

Plain text survives tool changes, is reviewable in pull requests, and keeps the Obsidian authoring loop intact. The web app becomes replaceable: if the UI is rewritten, no content migrates.

## Tradeoffs

- No structured editing UI; authors must follow frontmatter conventions by hand.
- Cross-note links use Obsidian wikilinks, which GitHub does not render as links.
- Folder `README.md` files collide on slug and need an explicit `slug` frontmatter field.

## Consequences

- A build step is required to derive JSON (see [[ADR-005-Build-Time-Content-Index]]).
- The build must validate frontmatter and fail on broken wikilinks.
- Slugs are file names, so file names must be unique repo-wide.

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
