---
title: Project Ideas Backlog
description: Tracker of scoped project ideas across domains with target maturity level and status.
domain: projects
category: ideas
type: tracker
difficulty: beginner
status: evergreen
tags: [project, ideas, backlog]
prerequisites: []
related: [Project-Lab-Index, Project-Maturity-Model]
order: 5
---
# Project Ideas Backlog

Status values: `idea`, `scoped`, `active`, `shipped`, `dropped`. Move an idea to `scoped` only after writing its objective and success criteria in [[Project-Template]]. Keep at most one or two `active`.

## From the domain templates

| Idea | Domain | Target level | Status | Source |
|---|---|---|---|---|
| Cited Q&A over your own notes | AI | 3 | idea | [[Project-Template-AI]] |
| LLM gateway with budgets | AI | 3 | idea | [[Project-Template-AI]] |
| Log anomaly triage assistant | AI | 2 | idea | [[Project-Template-AI]] |
| Secrets scanner with SARIF output | Cybersecurity | 3 | idea | [[Project-Template-Cybersecurity]] |
| Detection lab with ATT&CK-mapped rules | Cybersecurity | 3 | idea | [[Project-Template-Cybersecurity]] |
| Vulnerable-by-design API and fixed twin | Cybersecurity | 2 | idea | [[Project-Template-Cybersecurity]] |
| Raft-based key-value store | Distributed systems | 4 | idea | [[Project-Template-Distributed-Systems]] |
| Order saga with outbox | Distributed systems | 3 | idea | [[Project-Template-Distributed-Systems]] |
| Distributed rate limiter | Distributed systems | 3 | idea | [[Project-Template-Distributed-Systems]] |
| URL shortener with analytics | Backend | 3 | idea | [[Project-Template-Backend]] |
| Job queue service | Backend | 3 | idea | [[Project-Template-Backend]] |
| Multi-tenant notes API | Backend | 2 | idea | [[Project-Template-Backend]] |
| Static site platform with OIDC CI/CD | Cloud | 2 | idea | [[Project-Template-Cloud]] |
| Kubernetes platform starter | Cloud | 4 | idea | [[Project-Template-Cloud]] |
| Serverless event pipeline | Cloud | 3 | idea | [[Project-Template-Cloud]] |
| Secure CI pipeline for a sample app | DevSecOps | 3 | idea | [[Project-Template-DevSecOps]] |
| Policy-as-code admission control | DevSecOps | 3 | idea | [[Project-Template-DevSecOps]] |
| Dependency risk dashboard | DevSecOps | 2 | idea | [[Project-Template-DevSecOps]] |
| News feed service | System design | 4 | idea | [[Project-Template-System-Design]] |
| Distributed cache with consistent hashing | System design | 3 | idea | [[Project-Template-System-Design]] |
| Notification system | System design | 3 | idea | [[Project-Template-System-Design]] |
| Retrieval strategy benchmark | Research | 5 | idea | [[Project-Template-Research]] |
| LLM judge reliability study | Research | 5 | idea | [[Project-Template-Research]] |
| SAST false-positive study | Research | 4 | idea | [[Project-Template-Research]] |

## Additional ideas

| Idea | Domain | Target level | Status | Notes |
|---|---|---|---|---|
| Personal knowledge graph over this vault | AI / tooling | 2 | idea | Wikilink graph with centrality metrics |
| Feature flag service | Backend | 3 | idea | Stable bucketing, audit log, kill switches |
| Webhook delivery service | Backend | 3 | idea | Signed payloads, retries, DLQ, replay |
| Container image hardening report | DevSecOps | 2 | idea | Compare base images by CVEs and size |
| Chaos experiment runner | Distributed systems | 3 | idea | Scripted faults with steady-state checks |

## Selection rubric

Pick the next project by scoring 1-3 on each: learning value for target role, demonstrable outcome, fits available time, reuses existing templates. Prefer finishing a Level 3 project over starting a Level 4 one.

Back to [[Project-Lab-Index]].
