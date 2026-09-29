---
title: "Checklist: Securing an Application"
description: Practical application security checklist covering auth, input, secrets, dependencies, infrastructure, and monitoring.
domain: checklists
category: security
type: checklist
difficulty: intermediate
status: evergreen
tags: [security, owasp, appsec]
prerequisites: []
related: [Pattern-Defense-in-Depth, Pattern-Secure-Defaults, Secure-Coding-Examples]
order: 50
---
# Checklist: Securing an Application

A baseline for web apps and APIs, organized by layer ([[Pattern-Defense-in-Depth]]). Runnable examples for several items live in [[Secure-Coding-Examples]].

## Design

- [ ] Threat model the app with STRIDE and record the top risks and mitigations.
- [ ] Draw trust boundaries and list every entry point (HTTP, queues, uploads, webhooks, admin tools).
- [ ] Classify stored data (public, internal, confidential, PII) and minimize what you collect.

## Authentication and sessions

- [ ] Hash passwords with Argon2id or bcrypt; never store or log plaintext passwords.
- [ ] Rate-limit and add lockout or backoff on login, signup, and password reset.
- [ ] Offer or require MFA for privileged accounts.
- [ ] Set session cookies `Secure; HttpOnly; SameSite=Lax` (or Strict) with an absolute expiry.
- [ ] Rotate session IDs on login and privilege change; invalidate on logout server-side.
- [ ] Validate JWTs fully: signature, algorithm allowlist, `exp`, `iss`, `aud`.

## Authorization

- [ ] Deny by default; require an explicit permission for each route.
- [ ] Check object ownership on every request that takes an ID (BOLA/IDOR).
- [ ] Keep authorization checks server-side; never rely on hidden UI elements.
- [ ] Write tests that assert user A cannot read or modify user B's resources.

## Input and output

- [ ] Validate all input with strict schemas at the boundary ([[Pattern-Input-Validation-at-Boundaries]]).
- [ ] Use parameterized queries everywhere; ban string-built SQL in code review.
- [ ] Encode output for its context (HTML, attribute, URL, JS) via the template engine's auto-escaping.
- [ ] Sanitize any user-supplied HTML with an allowlist sanitizer (DOMPurify, bleach).
- [ ] Canonicalize and confine file paths to a base directory before file access.
- [ ] Block SSRF: resolve hostnames and reject private, loopback, and link-local addresses for server-side fetches.
- [ ] Limit upload size and type; store uploads outside the web root with random names.

## Secrets and configuration

- [ ] Keep secrets in a secret manager or environment, never in git; add a pre-commit secret scanner (gitleaks).
- [ ] Use distinct credentials per environment and rotate them on a schedule and on staff changes.
- [ ] Disable debug mode and verbose errors in production ([[Pattern-Secure-Defaults]]).
- [ ] Set security headers: CSP, HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, frame-ancestors.
- [ ] Restrict CORS to an explicit origin allowlist.

## Dependencies and build

- [ ] Pin dependencies with a lockfile and enable automated update PRs.
- [ ] Run SCA (`npm audit`, `pip-audit`, Trivy) in CI and fail on high-severity issues with a fix available.
- [ ] Run SAST (Semgrep or CodeQL) in CI.
- [ ] Build containers from minimal base images, run as non-root, and scan images before push.

## Monitoring and response

- [ ] Log authentication events, authorization failures, and admin actions with user ID and request ID.
- [ ] Never log secrets, tokens, passwords, or full card numbers.
- [ ] Alert on spikes in 401/403, login failures, and 5xx.
- [ ] Publish a `SECURITY.md` with a vulnerability reporting contact.
- [ ] Write down who to call and what to rotate if a credential leaks.

Back to [[Checklists-Index]].
