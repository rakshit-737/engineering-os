---
title: "Checklist: Starting a Project"
description: Everything to decide and set up in the first days of a new project so it does not need rescuing later.
domain: checklists
category: engineering
type: checklist
difficulty: beginner
status: evergreen
tags: [project, planning]
prerequisites: []
related: [Project-Maturity-Model, Checklist-Preparing-a-GitHub-Repository]
order: 10
---
# Checklist: Starting a Project

Use this before writing feature code. It front-loads the decisions that are expensive to change later. Pick a target level from [[Project-Maturity-Model]] first; not every item applies to a Level 1 prototype.

## Define

- [ ] Write the problem in one sentence that names a user and a pain, not a technology.
- [ ] Write 3 to 5 measurable success criteria (e.g. "p95 search < 300 ms on 10k notes").
- [ ] List explicit non-goals so scope creep has something to push against.
- [ ] Choose the target maturity level and a deadline for reaching it.
- [ ] Identify the riskiest assumption and plan a spike to test it in the first week.

## Design

- [ ] Sketch the architecture as a mermaid diagram with every external dependency shown.
- [ ] Write down the data model: entities, relationships, and which store owns each.
- [ ] Do a 30-minute threat model: assets, entry points, trust boundaries, top 3 threats.
- [ ] Record the first irreversible decisions as ADRs using [[ADR-Template]].
- [ ] Pick the stack and justify any choice you have not shipped before.

## Set up

- [ ] Create the repository following [[Checklist-Preparing-a-GitHub-Repository]].
- [ ] Add a `.gitignore` for the stack and a `.env.example` with every required variable (no real values).
- [ ] Add a formatter and linter with a single command (`make lint` / `npm run lint`).
- [ ] Add a test runner with one passing test and a single command to run it.
- [ ] Add CI that runs lint and tests on every pull request.
- [ ] Enable secret scanning and dependency alerts (Dependabot or Renovate).
- [ ] Write a README with setup steps that work on a clean machine, using [[README-Template]].
- [ ] Add a health endpoint or smoke command that proves the app starts.

## First milestone

- [ ] Ship a thin vertical slice end to end (UI or CLI -> logic -> storage) before widening.
- [ ] Deploy the slice somewhere reachable, even if only a preview environment.
- [ ] Break the remaining work into issues using [[Issue-Template]], each small enough for one PR.
- [ ] Schedule a review date to check progress against the success criteria.

Back to [[Checklists-Index]].
