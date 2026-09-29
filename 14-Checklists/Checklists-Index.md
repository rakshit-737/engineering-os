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

These checklists live with their subject-matter notes in other toolkits:

**AI** (`09-AI-Toolkit/checklists/`)
- [[RAG-System-Checklist]]: design, build, evaluate and operate a RAG system
- [[Agent-Design-Checklist]]: scope, build, secure and operate LLM agents
- [[AI-Security-Checklist]]: threat modeling, prompt injection, data protection for LLM apps
- [[AI-App-Launch-Checklist]]: go-live for an LLM-powered feature

**Security** (`06-Cybersecurity-Toolkit/checklists/`)
- [[Security-Review-Checklist]]: design or code security review before shipping
- [[Incident-Response-Checklist]]: run during an incident, preparation through lessons learned
- [[Cloud-Security-Checklist]]: AWS baseline for identity, logging, network, data, compute
- [[Web-Security-Checklist-OWASP]]: OWASP Top 10 checks for your own app

**Career, research, academic**
- [[Interview-Prep-Checklist]]: week before, day before, day of, follow-up
- [[Resume-Review-Checklist]]: honesty, content, formatting, ATS readability
- [[Reproducibility-Checklist]]: code, data, environment, seeds, results
- [[Revision-Checklist]]: pre-exam coverage, active recall, past papers

## Using checklists well

1. Pick the checklist at the start of the activity, not after.
2. Copy items that become recurring into your project's CI or templates so they are enforced automatically.
3. When an incident reveals a missed step, add it to the relevant checklist.
