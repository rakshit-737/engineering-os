---
title: Academic Research Project Template
description: Semester or final-year project plan with verifiable objectives, risk-first phases, evaluation, and risk register.
domain: academic
category: projects
type: template
difficulty: intermediate
status: evergreen
tags: [projects, research, final-year]
prerequisites: []
related: [Research-OS-Index, Experiment-Tracker, Publication-Checklist, Paper-Note-Template]
order: 90
---

# Academic / Research Project Template

For semester projects, final-year projects, and faculty research work. Fill Overview + Scope in week 1 and get the guide to sign off on Scope — undefined scope is how projects eat semesters.

## Project Overview

- Title:
- Domain:
- Problem (one sentence, no jargon):
- Why it matters (who benefits, what improves):
- Faculty guide / meeting cadence:
- Repo link:

## Objectives — max 3, each verifiable

<!-- Bad: "explore ML for X". Good: "achieve >= baseline+5% F1 on dataset Y
     with method Z, reproducible via one script". -->

1.
2.
3.

## Scope

- In scope:
- **Out of scope** (longer than in-scope, or the project will sprawl):
- Success threshold (minimum result that still counts as done):

## Literature Snapshot

<!-- 5-8 papers max at start. Use [[Paper-Note-Template]] per paper;
     link summaries here. One line each: what they did + the gap left. -->

| Paper | Approach | Gap this project addresses |
|-------|----------|---------------------------|
| | | |

## Architecture / Design

<!-- Diagram (mermaid/ASCII) + data flow + where the novel part sits.
     Mark the riskiest component — build that FIRST (see plan). -->

## Implementation Plan — risk-first, not easy-first

| Phase | Weeks | Deliverable | Risk it retires |
|-------|-------|-------------|-----------------|
| 1 — Spike riskiest assumption | | Working proof-of-concept of the hard part | "is this even feasible" |
| 2 — Baseline + eval harness | | Reproducible baseline number | "can we measure progress" |
| 3 — The contribution | | Method beating/matching baseline | the thesis itself |
| 4 — Write-up + polish | | Report, demo, clean repo | "can others use/verify it" |

## Evaluation

- Metric(s) + why appropriate:
- Baseline(s):
- Dataset / testbed:
- Reproduce command: `python run_experiments.py` (make this true from week 2 — see [[Experiment-Tracker]] and [[Reproducibility-Checklist]])

## Risk Register

| Risk | Likelihood | Impact | Mitigation | Trigger to activate |
|------|-----------|--------|------------|---------------------|
| Dataset unavailable/too small | | | Backup dataset named now: | |
| Method underperforms baseline | | | Negative result + analysis is still a report | |
| Guide unavailable near deadline | | | Buffer week + email trail of decisions | |

## Deliverables Checklist

- [ ] Working code, `README` with setup + run instructions
- [ ] Reproducible results (script + fixed seeds + data pointer)
- [ ] Report (use department format; draft sections as you go, not at the end)
- [ ] Demo script — rehearsed, offline-safe, with backup recording
- [ ] Test cases for core logic
- [ ] Future work section (feeds next semester / paper attempt — see [[Publication-Checklist]])

## Milestone Checklist

- [ ] Week 1: problem, objectives, scope signed off by guide
- [ ] Week 2: literature snapshot (5-8 papers) done; gap written in one sentence
- [ ] Week 3: hypothesis written with [[Hypothesis-Template]]
- [ ] Week 4: riskiest component spiked; go / pivot decision recorded
- [ ] Mid-term: baseline number reproduced with a single command
- [ ] Mid-term review slides / demo ready
- [ ] Main results over 3+ seeds; one ablation per component ([[Ablation-Study-Guide]])
- [ ] Report draft complete two weeks before the deadline
- [ ] Final demo rehearsed twice

## Meeting Log

| Date | Decisions | Actions before next meeting |
|------|-----------|------------------------------|
| | | |

Workflow reference: [[Research-Workflow]]. Course-side tracking: [[Semester-Dashboard-Template]].
