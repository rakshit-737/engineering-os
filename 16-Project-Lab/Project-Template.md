---
title: Project Template
description: Base template for planning and documenting any engineering project from objective to postmortem.
domain: projects
category: templates
type: template
difficulty: beginner
status: evergreen
tags: [project, template, planning]
prerequisites: []
related: [Project-Maturity-Model, Project-Postmortem-Template, Checklist-Starting-a-Project]
order: 3
---
# Project Template

Copy into the project repo as `docs/PROJECT.md` (or keep it in the vault). Replace every `{{placeholder}}`. Delete sections that do not apply, deliberately. Domain additions: see [[Project-Lab-Index]].

## Objective

<!-- One sentence: who benefits and what changes for them. -->
{{Objective}}

- **Target maturity level:** {{1-5}} ([[Project-Maturity-Model]])
- **Deadline:** {{YYYY-MM-DD}}
- **Success criteria:** {{3-5 measurable criteria}}
- **Non-goals:** {{what this project will not do}}

## Problem

<!-- The pain today, with evidence. Why existing solutions are not enough. -->
{{Problem statement}}

## Architecture

```mermaid
flowchart LR
  User --> App[{{Component}}]
  App --> Store[({{Data store}})]
  App --> Ext[{{External service}}]
```

{{Key components and their responsibilities. Link ADRs for major decisions ([[ADR-Template]]).}}

## Stack

| Layer | Choice | Why |
|---|---|---|
| Language | {{...}} | {{...}} |
| Framework | {{...}} | {{...}} |
| Storage | {{...}} | {{...}} |
| Hosting | {{...}} | {{...}} |

## Requirements

### Functional

- [ ] {{FR-1}}
- [ ] {{FR-2}}

### Non-functional

- [ ] {{Performance target, e.g. p95 < 300 ms at N rps}}
- [ ] {{Availability / durability target}}
- [ ] {{Security requirement}}

## Milestones

| # | Milestone | Deliverable | Target date | Done |
|---|---|---|---|---|
| M1 | Thin vertical slice | {{...}} | {{...}} | |
| M2 | Core features | {{...}} | {{...}} | |
| M3 | Hardening | {{tests, security, observability}} | {{...}} | |
| M4 | Launch | {{deployed + README}} | {{...}} | |

## Repo

- **URL:** {{...}}
- **Layout:** {{src/, tests/, docs/, infra/}}
- **Setup:** follow [[Checklist-Preparing-a-GitHub-Repository]].

## Docs

- [ ] README meeting [[Checklist-Production-README]]
- [ ] ADRs for irreversible decisions
- [ ] API reference (if applicable)
- [ ] Runbook (Level 4+)

## Testing

- **Unit:** {{scope}}
- **Integration:** {{real dependencies used}}
- **E2E:** {{critical journeys}}
- **Evaluation / load:** {{tools and targets}}

## Security

- **Threat model:** {{top 3 threats + mitigations}}
- **Auth:** {{method}}
- **Secrets:** {{where they live}}
- Run [[Checklist-Securing-an-Application]] before launch.

## Observability

- **Logs:** {{format, where}}
- **Metrics:** {{rate, errors, latency, domain metrics}}
- **Alerts:** {{conditions}}
- **Tracing:** {{if multi-service}}

## Deployment

- **Environment:** {{...}}
- **Pipeline:** {{CI steps}}
- **Rollback:** {{exact procedure}}
- Run [[Checklist-Deployment]] per release.

## Postmortem

After launch (or abandonment), fill in [[Project-Postmortem-Template]] and link it here: {{link}}.
