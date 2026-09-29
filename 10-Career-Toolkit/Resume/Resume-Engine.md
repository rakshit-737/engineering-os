---
title: Resume Engine
description: Master inventory of skills, projects, achievements, internships and certifications plus the bullet formula used to generate every resume variant.
domain: career
category: resume
type: template
difficulty: beginner
status: evergreen
tags: [resume, inventory]
related: [Resume-Tailoring-Template, Project-Description-Bank-Template, Resume-Review-Checklist]
order: 10
---

# Resume Engine

A resume is an **output**. The engine is the master inventory below: keep everything here (it can be long), then generate a 1-page resume per role with [[Resume-Tailoring-Template]].

## Bullet formula

**Action verb + what you built/changed + how (tech, method) + measurable result**

- Good: "Built a log-ingestion service in Go that parses Nginx and auth logs into Elasticsearch, cutting manual triage time for our club's CTF infra from {{measured before}} to {{measured after}}."
- Weak: "Worked on logging." (no action, no how, no result)

### Bad -> good rewrites

Numbers below are illustrative placeholders showing the *shape* of a measured result; replace them with your own measurements.

| Bad | Why it fails | Good |
|---|---|---|
| "Responsible for backend of college fest website." | Duty, not action; no tech; no outcome | "Built the registration API (Flask, PostgreSQL) for a college fest; handled {{N}} sign-ups with zero lost records, verified by reconciling DB rows against payment logs." |
| "Used machine learning to predict diseases with 99% accuracy." | Unnamed data, likely leakage, accuracy on imbalanced data means little | "Trained a gradient-boosted classifier on {{dataset name, N rows}}; F1 {{x}} on a held-out, patient-level split (baseline logistic regression: {{y}})." |
| "Knowledge of Docker, Kubernetes, AWS, GCP, Azure, Terraform." | Keyword list with no evidence; invites hard questions you cannot answer | "Containerised a 3-service app with Docker Compose and deployed it to one cloud VM with GitHub Actions CI; build time {{before}} -> {{after}} after layer caching." |
| "Did a pentest of a web application." | No scope, method, or finding | "Audited a deliberately vulnerable web app (OWASP Juice Shop) locally; found and patched {{N}} issues incl. SQL injection and IDOR; wrote a severity-rated report." |
| "Improved performance of the system significantly." | "Significantly" is unverifiable | "Cut p95 latency of the search endpoint from {{a}} ms to {{b}} ms (measured with k6, 50 VUs) by adding a composite index and removing an N+1 query." |

Interview test for every bullet: can you answer "how did you measure that?" and "what would you do differently?" in under a minute? If not, rewrite or cut it.

**Never fabricate metrics.** Every number must come from something you measured, a log, a benchmark you can re-run, or a figure you can source. If you have no number, use a verifiable scope fact (dataset size, users, endpoints, test count) or a qualitative before/after. An interviewer who asks "how did you measure that?" must get a real answer.

Results you can usually measure honestly: latency/throughput from a benchmark, test coverage, build time, users/stars/downloads, dataset size, accuracy/F1 on a named test set, bugs found, reports accepted, grade/rank.

## Inventory

### Skills

| Skill | Level (used in project / can teach) | Evidence (link) |
|---|---|---|
| {{language}} | | |
| {{framework}} | | |
| {{tool}} | | |

Only list a skill if at least one inventory item below uses it.

### Projects

| Project | Role | Stack | Problem | Measured result | Link | Defense notes |
|---|---|---|---|---|---|---|
| *Example:* URL shortener | Solo | Go, Redis, PostgreSQL | Needed short links with click analytics | {{req/s at p95 < X ms from load test}} | {{repo}} | Why base62 over hashing; collision handling; cache invalidation |
| | | | | | | see [[Project-Defense-Guide]] |

Full write-ups: [[Project-Description-Bank-Template]].

### Achievements

| Achievement | Date | Issuer / event | Verifiable link |
|---|---|---|---|
| {{hackathon / CTF placing / scholarship / paper}} | | | |

### Internships / work

| Org | Title (exact) | Dates | Team | 3-5 bullets (formula) |
|---|---|---|---|---|
| | | | | |

### Certifications (optional)

| Name (exact official name) | Issuer | Date | Credential ID / link |
|---|---|---|---|
| | | | |

Certifications supplement projects; they rarely replace them.

## Maintenance

- Add to the inventory within a week of finishing anything (numbers fade).
- Re-run benchmarks before quoting them again.
- Before each application: tailor, then run [[Resume-Review-Checklist]].
