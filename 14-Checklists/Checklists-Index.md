---
title: Checklists Index
description: All engineering checklists, grouped by activity, plus pointers to checklists owned by other toolkits.
domain: checklists
category: overview
type: index
difficulty: beginner
status: evergreen
tags: [checklists]
prerequisites: []
related: [Patterns-Index, Project-Maturity-Model]
order: 1
---
# Checklists Index

Every `- [ ]` item in these notes is a trackable checkbox in the app (progress is stored in your browser). Checklists catch omissions; they do not replace judgment. Skip items that do not apply, but skip them on purpose.

## Building

- [[Checklist-Starting-a-Project]]: decisions and setup for day one
- [[Checklist-API-Design]]: resources, errors, pagination, security, evolution
- [[Checklist-Database-Design]]: modeling, indexing, migrations, operations
- [[Checklist-Building-an-AI-Application]]: scoping, evals, safety, cost

## Securing

- [[Checklist-Securing-an-Application]]: layered application security baseline

## Shipping

- [[Checklist-Deployment]]: safe, reversible production deploys
- [[Checklist-Releasing-Software]]: versioning, artifacts, publishing
- [[Checklist-Preparing-a-GitHub-Repository]]: make a repo public-ready
- [[Checklist-Production-README]]: a README a stranger can trust

## Research

- [[Checklist-Publishing-Research]]: from experiments to submission

## Owned elsewhere

These checklists live with their subject-matter notes in other toolkits. Search for them by name:

- RAG-System-Checklist: retrieval-augmented generation systems (AI toolkit)
- Agent-Design-Checklist: LLM agents and tool use (AI toolkit)
- AI-Security-Checklist: prompt injection, data leakage, model abuse (AI toolkit)
- Security-Review-Checklist: code and design security review (cybersecurity toolkit)
- Incident-Response-Checklist: detection through postmortem (cybersecurity toolkit)
- Interview-Prep-Checklist: interview preparation (career toolkit)
- Reproducibility-Checklist: experiment reproducibility (research toolkit)

## Using checklists well

1. Pick the checklist at the start of the activity, not after.
2. Copy items that become recurring into your project's CI or templates so they are enforced automatically.
3. When an incident reveals a missed step, add it to the relevant checklist.
