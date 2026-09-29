---
title: "ADR-004: localStorage for Personal State"
description: Checklist progress, bookmarks, and preferences are stored in the browser's localStorage.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [frontend, state, privacy]
prerequisites: []
related: [ADR-001-Markdown-As-Source-of-Truth, ADR-002-React-Vite-Static-SPA, ADR-Index]
order: 40
adr_status: accepted
date: 2026-09-29
---
# ADR-004: localStorage for Personal State

## Context

The app turns every `- [ ]` item into a trackable checkbox and supports personal state (progress, bookmarks, theme). There is no backend and no login.

## Problem

Where should per-user, mutable state live when the site is static?

## Options

| Option | Pros | Cons |
|---|---|---|
| localStorage (chosen) | Zero infra, synchronous, private to the device | Per-browser only; cleared with site data; small quota; no sync |
| IndexedDB | Larger quota, structured data | More complex async API for small key-value data |
| Hosted backend (Firebase, Supabase) | Cross-device sync | Accounts, auth, cost, and privacy obligations for a personal tool |
| Write state back into Markdown | Versioned in git | Needs a server or manual commits; mixes personal state into shared content |

## Decision

Store personal state in `localStorage` under namespaced, versioned keys (for example `eos:v1:checklist:<slug>`). Validate everything read back with a zod schema and fall back to defaults on parse failure. Offer JSON export/import for backup.

## Rationale

The data is small, personal, and non-critical. localStorage needs no infrastructure and keeps the data on the user's device.

## Tradeoffs

- No cross-device sync.
- Checkbox state is keyed by item identity within a note, so editing a checklist can orphan progress.
- Any XSS could read and modify stored state, which raises the stakes of [[ADR-006-Sanitized-Markdown-Rendering]].

## Consequences

- Reads and writes are wrapped in try/catch (private mode, blocked storage).
- A key-version bump plus a migration function is required whenever the stored shape changes.
- Never store secrets or tokens in localStorage.

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
