---
title: "ADR-006: Sanitized Markdown Rendering"
description: Markdown is rendered with marked and always sanitized with DOMPurify before insertion into the DOM.
domain: adr
category: repository
type: adr
difficulty: intermediate
status: evergreen
tags: [security, frontend, xss]
prerequisites: []
related: [ADR-001-Markdown-As-Source-of-Truth, ADR-002-React-Vite-Static-SPA, ADR-Index]
order: 60
adr_status: accepted
date: 2026-09-29
---
# ADR-006: Sanitized Markdown Rendering

## Context

Notes are rendered to HTML in the browser. Markdown allows raw HTML, and content can arrive through pull requests. Personal state sits in localStorage on the same origin ([[ADR-004-LocalStorage-for-Personal-State]]).

## Problem

How do we render rich Markdown (tables, code, mermaid) without opening an XSS hole?

## Options

| Option | Pros | Cons |
|---|---|---|
| marked + DOMPurify (chosen) | Fast; well-maintained sanitizer with safe defaults | Must be configured carefully around mermaid and code blocks |
| react-markdown (AST to React elements, no raw HTML) | No `dangerouslySetInnerHTML` sink | Slower on large notes; plugin chain for GFM, wikilinks, highlighting |
| Trust the content, no sanitizer | Simplest | One malicious PR or pasted snippet executes script on the origin |

## Decision

Render with `marked`, then pass the HTML through `DOMPurify.sanitize` with default settings, widening the allowlist only where a feature requires it. The only `dangerouslySetInnerHTML` sink receives sanitized output. Mermaid runs with `securityLevel: 'strict'`. External links get `rel="noopener noreferrer"`.

## Rationale

Defense in depth: content review catches most problems, the sanitizer catches the rest. DOMPurify handles browser parsing quirks that hand-written filters miss.

## Tradeoffs

- Some legitimate HTML (iframes, inline handlers, some `style` usage) is stripped.
- Sanitizing on every render costs CPU on very large notes (memoize per slug).

## Consequences

- A unit test asserts that `<script>`, `onerror=` attributes, and `javascript:` URLs are removed.
- A Content-Security-Policy meta tag is a follow-up hardening step.
- See [[Pattern-Defense-in-Depth]] and [[Pattern-Secure-Defaults]].

## Status

Accepted on 2026-09-29. Revisit if the constraint that drove it changes. Full log: [[ADR-Index]].
