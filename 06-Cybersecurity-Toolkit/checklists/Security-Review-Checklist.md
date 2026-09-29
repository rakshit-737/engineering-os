---
title: "Security Review Checklist"
description: "Checklist for a design or code security review before shipping a feature."
domain: cybersecurity
category: checklists
type: checklist
difficulty: intermediate
status: evergreen
tags: [checklist, secure-design, code-review]
prerequisites: [Security-Architecture]
related: [Web-Security-Checklist-OWASP, Supply-Chain-Security, Threat-Model-Template]
order: 10
---

# Security Review Checklist

Hub: [[Security-Engineering-OS]]

## Design

- [ ] Data classified; sensitive data flows identified
- [ ] Data-flow diagram with trust boundaries exists
- [ ] Threat model done ([[Threat-Model-Template]])
- [ ] Least privilege for services and users

## Authentication and authorization

- [ ] All endpoints require authentication unless intentionally public
- [ ] Authorization checked server side on every request (object-level too)
- [ ] Session/tokens: short-lived, secure cookie flags, revocable

## Input and output

- [ ] Parameterized queries / safe ORM usage
- [ ] Output encoding for the right context; CSP set
- [ ] File uploads validated (type, size, storage outside web root)
- [ ] Outbound requests from user input restricted (SSRF)

## Data protection

- [ ] TLS everywhere; encryption at rest for sensitive stores
- [ ] Secrets in a secrets manager, none in code or logs
- [ ] PII minimized; retention defined

## Dependencies and build

- [ ] Dependencies pinned and scanned; SBOM generated
- [ ] CI credentials short-lived and least privilege

## Logging and operations

- [ ] Security-relevant events logged (auth, authz failures, admin actions)
- [ ] No secrets or full PII in logs
- [ ] Alerts and runbook exist for abuse scenarios
- [ ] Rate limiting on sensitive endpoints
