---
title: "OWASP Top 10"
description: "Concept note: what each OWASP Top 10 (2021) risk category means and why it happens."
domain: cybersecurity
category: appsec
type: concept
difficulty: beginner
status: evergreen
tags: [cybersecurity, owasp, web, appsec]
prerequisites: []
related: [Web-Security-Checklist-OWASP, XSS, SQL-Injection]
order: 30
---

# OWASP Top 10

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

> **Concept vs checklist:** this note explains each risk category (what it is, why it happens, how it is exploited in principle). The actionable audit items with `- [ ]` tasks live in [[Web-Security-Checklist-OWASP]]. Deep dives: [[XSS]], [[SQL-Injection]], CSRF, SSRF, Authentication Security, Secure Coding.

## Core Idea

The OWASP Top 10 is the consensus list of the most critical web application security risk *categories*, compiled from real-world vulnerability data and updated every few years (2021 edition is the standard reference). It is an awareness document and shared vocabulary, not a complete checklist — passing the Top 10 does not make an app secure.

## Details

> TODO: verify whether the OWASP Top 10 2025 edition has been finalized and update the table if so; this note uses the 2021 edition.

**The 2021 list, with one attack and one defense each**

| ID | Category | Canonical attack | Primary defense |
|---|---|---|---|
| A01 | Broken Access Control | IDOR: change `/invoice/7` → `/invoice/8` | Deny-by-default, object-level authz checks |
| A02 | Cryptographic Failures | Plaintext passwords / HTTP; weak crypto | TLS everywhere, argon2/bcrypt, vetted libraries |
| A03 | Injection (incl. XSS) | `' OR 1=1 --` in a login form | Parameterized queries, output encoding |
| A04 | Insecure Design | No rate limit on password reset → enumeration/brute force | Threat modeling, secure design patterns |
| A05 | Security Misconfiguration | Default creds, debug mode in prod, open S3 bucket | Hardened baselines, config scanning |
| A06 | Vulnerable & Outdated Components | Exploiting a known CVE in an old library (Log4Shell) | Dependency scanning (SCA), patch cadence, SBOM |
| A07 | Identification & Authentication Failures | Credential stuffing, weak session handling | MFA, rate limiting, secure session management |
| A08 | Software & Data Integrity Failures | Malicious package update, insecure deserialization | Signed artifacts, verified pipelines, integrity checks |
| A09 | Security Logging & Monitoring Failures | Breach undetected for months | Centralized logs, alerting, IR runbooks |
| A10 | Server-Side Request Forgery (SSRF) | App fetches `http://169.254.169.254/` (cloud metadata) | Allowlist outbound destinations, block internal ranges |

**Notable 2021 changes worth citing**
- Broken Access Control jumped to #1 — most frequently found flaw class in real data.
- XSS was folded into A03 Injection: both are the same root cause, untrusted data interpreted as code — see [[SQL-Injection]] and [[XSS]].
- A04 Insecure Design is new: flaws you cannot patch away because the *design* is wrong (missing rate limits, trust in client-side checks). Fix is threat modeling — see [[Threat-Modeling-STRIDE]].
- SSRF got its own entry (A10) because cloud metadata endpoints made it high-impact.

**How to actually use it**
- Shared vocabulary in reviews and reports: "this is A01" is precise and instantly understood.
- Skeleton for a security review: walk each category against the app.
- Root-cause lens: A01/A07 are broken authn/authz ([[Authentication-vs-Authorization]]), A02 is misuse of crypto ([[Hashing-vs-Encryption]]), A03 is untrusted data crossing an interpreter boundary.

**Common pitfalls**
- Treating it as a compliance checklist — it's risk categories, each containing many CWEs.
- Memorizing names without being able to give an attack + fix per category (the actual interview test).
- Ignoring A09: most real breaches are found late because nobody was looking at logs.

## Interview Angle

- You don't need all ten verbatim; you must know A01 (access control), A03 (injection), and be able to give attack + mitigation for any category the interviewer picks.
- Citing IDs naturally ("that's classic A01") signals fluency — but only if you can back it up with the mechanics.
- Expect: "Pick one and go deep." Choose SQLi or XSS — you have full notes and code for both.
- Expect: "What changed in the 2021 list?" A01 to the top, XSS merged into Injection, Insecure Design and SSRF added.
- Appsec-role framing: Top 10 drives secure-code-review checklists, SAST/DAST rule priorities, and developer training topics.

## Related

- [[SQL-Injection]]
- [[XSS]]
- [[Authentication-vs-Authorization]]
- [[Threat-Modeling-STRIDE]]
- [[Hashing-vs-Encryption]]
- [[Web-Security-Checklist-OWASP]]
- CSRF
- SSRF
- Secure Coding
- SAST DAST SCA
- [[Cybersecurity-Index]]
