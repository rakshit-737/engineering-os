---
title: Decision Log Template
description: Lightweight personal decision log capturing context, options, choice, expected outcome, and revisit date.
domain: command-center
category: journals
type: template
difficulty: beginner
status: evergreen
tags: [decisions, journal, review]
prerequisites: []
related: [Monthly-Review, Engineering-Journal-Template, Goals-Framework]
order: 70
---

# Decision Log Template

For personal and project decisions that take more than a day to reverse: choosing a stack, dropping a course project direction, accepting an offer, changing a goal. Write the entry **before** the outcome is known. Afterwards, compare what you expected with what happened.

For technical architecture decisions inside a codebase, use a proper ADR instead.

## Entry Template

### D-YYYY-MM-DD-nn: <short title>

- Date:
- Area: academic / career / project / research / personal
- Reversibility: easy / costly / one-way
- Context (2-3 lines, what's forcing a decision now):
- Options considered (min 2, include "do nothing"):
  1.
  2.
- Decision:
- Why (the one or two reasons that actually decided it):
- What I expect to happen (specific, checkable):
- What would make me reverse it:
- Revisit date:

**Revisit (fill on the revisit date):**

- What actually happened:
- Was the reasoning sound, or did I get lucky or unlucky?
- Lesson:

- [ ] Revisited

## Worked Example

### D-2026-01-12-01: Drop the Android app from the semester project

- Date: 2026-01-12
- Area: project
- Reversibility: costly (3 weeks of work lost if reversed late)
- Context: Team of 3, demo in 6 weeks. Backend API is 40% done; nobody has shipped an Android app before.
- Options considered:
  1. Build backend + Android app (original plan)
  2. Backend + responsive web frontend
  3. Do nothing: keep plan and cut testing time
- Decision: Option 2.
- Why: two of three members already know React; the grading rubric scores working features and tests, not platform.
- What I expect to happen: all 5 core features demoable by week 5 with integration tests passing.
- What would make me reverse it: the instructor states mobile is mandatory.
- Revisit date: 2026-02-23 (demo week)

**Revisit:**

- What actually happened: 5/5 features demoed; 2 integration tests flaky.
- Was the reasoning sound? Yes; flaky tests came from shared DB state, unrelated to the decision.
- Lesson: decide platform in week 1 by team skill, not by what looks impressive.

## Index

| ID | Date | Title | Revisit | Outcome matched expectation? |
|---|---|---|---|---|
| | | | | |

Revisit dates are checked in [[Monthly-Review]].
