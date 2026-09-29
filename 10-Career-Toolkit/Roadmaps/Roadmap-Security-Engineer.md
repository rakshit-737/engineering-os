---
title: Roadmap -- Security Engineer
description: Path to product/infrastructure security engineering roles that expect strong software engineering plus security depth.
domain: career
category: roadmaps
type: roadmap
role: "Security Engineer"
difficulty: advanced
status: evergreen
tags: [security, engineering]
related: [Roadmap-Cybersecurity-Engineer, Roadmap-Application-Security-Engineer, Interview-Cybersecurity-Round]
order: 30
---

# Roadmap -- Security Engineer

**What the role does:** at many tech companies this is a software engineer who builds security systems (auth, secrets, detection pipelines, hardening tooling) and reviews designs. Expect coding interviews in addition to security rounds.

## Stage 1 -- Foundation
- [ ] SWE fundamentals ([[Roadmap-Software-Engineer]] stages 1-2)
- [ ] Networking and OS internals ([[Computer-Networks]], [[Operating-Systems]])
- [ ] Security principles ([[CIA-Triad]], [[Least-Privilege]])

## Stage 2 -- Core
- [ ] Applied crypto: when to use which primitive, key management ([[Applied-Cryptography]], [[TLS-Handshake]])
- [ ] Authn/authz design: sessions, tokens, OAuth 2.0 / OIDC flows ([[Authentication-vs-Authorization]])
- [ ] Web and API vulnerabilities ([[OWASP-Top-10]])
- [ ] Memory safety bugs ([[Memory-Safety]])
- [ ] Threat modeling designs ([[Threat-Modeling-STRIDE]], [[Threat-Model-Template]])

## Stage 3 -- Specialization (pick one)
- [ ] Infra: cloud IAM, network segmentation ([[Cloud-Security]])
- [ ] Detection: log pipelines and rules ([[Security-Logging-and-Detection]])
- [ ] Product/AppSec: secure code review ([[Web-Security-Checklist-OWASP]])
- [ ] Low-level: reverse engineering / malware ([[Reverse-Engineering-Basics]], [[Malware-Analysis-Basics]])

## Stage 4 -- Job-ready
- [ ] DSA to medium level ([[Interview-DSA-Strategy]])
- [ ] Security system design practice (design a secrets manager, an auth service)
- [ ] Project defense ready ([[Project-Defense-Guide]])

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Auth service | Password hashing with a slow KDF, sessions or JWT with rotation, MFA (TOTP), rate limiting, audit logs, threat model doc | Secure design + implementation |
| Secret scanner / policy tool | CLI that scans repos for secrets or misconfig, with tests and CI integration | Engineering + security automation |
| Detection pipeline | Ingest logs, normalize, run rules, alert; documented false-positive tuning | Detection engineering |

## Proof-of-skill signals
Clean, tested security code; design docs with threat models; responsible disclosures; talks/blog posts.

## Interview focus
Coding, security fundamentals depth, security-flavored system design, threat modeling exercise.

## Common traps
Rolling your own crypto; ignoring coding prep; knowing attacks but not defensive design.

## Optional certifications
Rarely required. OSCP (OffSec) is sometimes valued for offensive-leaning teams.

Plain-text topics to study once notes exist: System Design: Rate-Limiting, System Design: API-Gateway.
