---
title: Research Index
description: "Hub for paper summaries, experiment discipline, and reading heuristics."
domain: research
category: indexes
type: index
difficulty: beginner
status: evergreen
tags: [index, research]
prerequisites: []
related: [Home]
---

# Research Index

Hub for paper summaries and experiment notes. House rule: a paper isn't "read" until its summary can answer *what's the delta over prior work, and would it survive my use case*.

## Workflow

1. **Capture** — summarize every serious read with `99-Templates/Paper-Summary-Template.md`; file it under Papers below
2. **Track** — log every experiment in `05-Research-Toolkit/Experiment-Tracker.md` (hypothesis before config, conclusion after)
3. **Check novelty** — before investing in an idea: `05-Research-Toolkit/Novelty-Checklist.md` (closest 3 papers + explicit delta)
4. **Write** — structure the review with `05-Research-Toolkit/Literature-Review-Template.md`
5. **Ship** — `05-Research-Toolkit/Publication-Checklist.md`, then `Reviewer-Response-Template.md` when reviews land

## Papers

Add summaries as `Paper-YYYY-FirstAuthor-ShortTitle` notes, grouped by theme:

**Theme: (name it)**
- (first paper summary goes here)

Promote recurring themes into concept notes in [[AI-ML-Index]] or [[CS-Core-Index]].

## Reading Heuristics

- Three-pass method: abstract + figures (5 min) → full read skipping proofs (30 min) → deep read with notes (only if it survives pass 2)
- Read the related-work section of one good recent paper to map a field faster than any survey
- Track *questions the paper doesn't answer* — that list is where research ideas come from

## Experiment Discipline

- One variable per experiment; hypothesis written BEFORE running
- Reproducibility minimum per tracker row: seed, environment, data version, code commit hash
- Negative results get logged too; they prune the search space

## Related Hubs

- Concepts feeding research: [[AI-ML-Index]], [[Cybersecurity-Index]]
- Templates: `99-Templates/Paper-Summary-Template.md`, `04-Academic-Toolkit/Research-Project-Template.md`

Back to [[Home]]
