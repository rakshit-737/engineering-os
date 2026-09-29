---
title: "Checklist: Production README"
description: What a README needs so a stranger can understand, run, and trust the project.
domain: checklists
category: engineering
type: checklist
difficulty: beginner
status: evergreen
tags: [documentation, readme, github]
prerequisites: []
related: [Checklist-Preparing-a-GitHub-Repository, README-Template]
order: 80
---
# Checklist: Production README

Pair with [[README-Template]]. Order matters: the first screen decides whether anyone keeps reading.

## Top of the page

- [ ] Project name and a one-line description of what it does and for whom.
- [ ] Status badges that are real (CI, license, version), not decorative.
- [ ] A screenshot, GIF, or terminal recording showing it working.
- [ ] A link to a live demo if one exists.

## Understanding

- [ ] A short "Why" paragraph: the problem and what is different about this approach.
- [ ] A feature list of what works today (not the roadmap).
- [ ] An architecture diagram (mermaid) with the main components and data flow.
- [ ] The tech stack with a one-line reason for each non-obvious choice or a link to ADRs.

## Running it

- [ ] Prerequisites with exact versions (e.g. Python 3.11+, Docker 24+).
- [ ] Copy-paste install and run commands that work on a clean machine.
- [ ] Configuration: every environment variable, its purpose, and whether it is required (link `.env.example`).
- [ ] How to run tests and linters.
- [ ] How to deploy, or a link to the deployment doc.

## Using it

- [ ] One realistic usage example (API call, CLI invocation, or UI flow) with expected output.
- [ ] Link to full API docs or reference if they exist.

## Trust

- [ ] Known limitations and what is intentionally out of scope.
- [ ] Security notes: how secrets are handled, how to report a vulnerability.
- [ ] Test coverage or evaluation results, stated with how they were measured.
- [ ] License and contribution guidelines.
- [ ] No claims you cannot back up ("blazing fast", "production-ready") without evidence.

Back to [[Checklists-Index]].
