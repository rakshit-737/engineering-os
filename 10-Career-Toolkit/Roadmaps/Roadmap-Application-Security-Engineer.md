---
title: Roadmap -- Application Security Engineer
description: Path to AppSec roles -- secure code review, web/API vulnerabilities, threat modeling and security tooling in the SDLC.
domain: career
category: roadmaps
type: roadmap
role: "Application Security Engineer"
difficulty: intermediate
status: evergreen
tags: [appsec, web-security]
related: [OWASP-Top-10, Web-Security-Checklist-OWASP, Interview-Cybersecurity-Round]
order: 50
---

# Roadmap -- Application Security Engineer

**What the role does:** finds and prevents vulnerabilities in the company's software: design reviews, code reviews, pentests, security tooling (SAST/DAST/SCA), and developer education.

## Stage 1 -- Foundation
- [ ] Build a web app yourself in one stack (you cannot secure what you cannot build)
- [ ] HTTP deeply: cookies, CORS, headers, sessions
- [ ] Authn/authz ([[Authentication-vs-Authorization]])

## Stage 2 -- Core
- [ ] OWASP Top 10 exploitation and fixes ([[OWASP-Top-10]], [[SQL-Injection]], [[XSS]])
- [ ] Access control bugs (IDOR), CSRF, SSRF, deserialization
- [ ] Burp Suite proxying and manual testing
- [ ] Secure code review in one language ([[Web-Security-Checklist-OWASP]])
- [ ] Threat modeling ([[Threat-Modeling-STRIDE]], [[Threat-Model-Template]])

## Stage 3 -- Specialization
- [ ] API security (OWASP API Security Top 10)
- [ ] SAST/SCA tools in CI (e.g. Semgrep, dependency scanning) -- see [[Roadmap-DevSecOps-Engineer]]
- [ ] OAuth 2.0 / OIDC flaws
- [ ] Crypto misuse patterns ([[Applied-Cryptography]])

## Stage 4 -- Job-ready
- [ ] Web security labs completed (e.g. PortSwigger Web Security Academy)
- [ ] Code review exercise practice: find bugs in a 200-line snippet in 30 minutes
- [ ] Interview prep ([[Interview-Cybersecurity-Round]])

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Vulnerable-then-fixed app | Build an app with intentional bugs, write exploits, then fix with tests proving the fix | Offense + secure coding |
| Custom Semgrep rules pack | Rules for your framework's risky patterns, with true/false positive tests | Tooling, code analysis |
| Threat model + review of an open-source app | Published threat model and responsibly disclosed findings (if any) | Design review, communication |

## Proof-of-skill signals
Bug bounty reports (in scope only), CVEs, write-ups, merged security fixes upstream.

## Interview focus
Code review exercise, vulnerability deep-dive (exploit + fix + root cause), threat modeling, some coding.

## Common traps
Scanner-only knowledge; not knowing how to fix bugs at the code level; testing things without authorization.

## Optional certifications
Burp Suite Certified Practitioner (PortSwigger), GIAC GWAPT. Optional.
