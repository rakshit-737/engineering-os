---
title: Case Studies Index
description: All HLD case studies with what each one teaches and its difficulty.
domain: system-design
category: case-studies
type: index
difficulty: intermediate
status: evergreen
tags: [system-design, case-studies, index]
related: [System-Design-Index]
order: 0
---

# Case Studies Index

Every case study follows the same 15 sections: Requirements, Functional, Non-functional, Capacity estimation, API design, Data model, Architecture, Component responsibilities, Data flow, Scaling strategy, Failure modes, Security, Observability, Tradeoffs, Interview follow-ups. Back to [[System-Design-Index]].

## Product systems

| Case study | What this teaches | Difficulty |
|---|---|---|
| [[Case-Study-URL-Shortener]] | ID generation, read-heavy caching, and key-value data modeling | beginner |
| [[Case-Study-WhatsApp]] | Real-time messaging over persistent connections, delivery receipts, and offline delivery | advanced |
| [[Case-Study-Instagram]] | Feed generation with fan-out on write vs read, plus media storage and CDN | intermediate |
| [[Case-Study-YouTube]] | Video upload, transcoding pipelines, and adaptive streaming at scale | advanced |
| [[Case-Study-Netflix]] | Global content delivery, edge caching, and resilience through microservices | advanced |
| [[Case-Study-Uber]] | Geospatial indexing, real-time location updates, and driver-rider matching | advanced |
| [[Case-Study-Food-Delivery]] | Order lifecycle state machines, three-sided marketplace coordination, and ETAs | intermediate |

## Platform and infrastructure systems

| Case study | What this teaches | Difficulty |
|---|---|---|
| [[Case-Study-Payment-System]] | Idempotency keys, double-entry ledger, PSP integration, reconciliation, and PCI scope reduction | advanced |
| [[Case-Study-Notification-System]] | Multi-channel fan-out with preferences, dedup, priority queues, and provider failover | intermediate |
| [[Case-Study-File-Storage]] | Chunking, content-addressed dedup, sync with conflict resolution, and presigned URLs | advanced |
| [[Case-Study-Distributed-Job-Scheduler]] | Cron at scale with time buckets, leases, fencing tokens, and at-least-once execution | advanced |
| [[Case-Study-Authentication-Platform]] | OAuth2/OIDC with PKCE, token rotation, JWKS key rotation, and MFA/WebAuthn | advanced |
| [[Case-Study-Log-Aggregation]] | Agent-to-Kafka pipelines, parsing, hot/warm/cold tiers, and the indexing vs cost tradeoff | intermediate |
| [[Case-Study-SIEM]] | Security telemetry normalization, detection-as-code with Sigma, correlation, and ATT&CK mapping | advanced |

## Suggested order

- [ ] [[Case-Study-URL-Shortener]]
- [ ] [[Case-Study-Notification-System]]
- [ ] [[Case-Study-Instagram]]
- [ ] [[Case-Study-Food-Delivery]]
- [ ] [[Case-Study-Log-Aggregation]]
- [ ] [[Case-Study-Payment-System]]
- [ ] [[Case-Study-File-Storage]]
- [ ] [[Case-Study-Distributed-Job-Scheduler]]
- [ ] [[Case-Study-Authentication-Platform]]
- [ ] [[Case-Study-WhatsApp]]
- [ ] [[Case-Study-Uber]]
- [ ] [[Case-Study-YouTube]]
- [ ] [[Case-Study-Netflix]]
- [ ] [[Case-Study-SIEM]]
