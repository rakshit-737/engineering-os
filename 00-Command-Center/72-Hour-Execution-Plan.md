# 72-Hour Sprint Playbook

Status: **Sprint 1 completed** (2026-08-01) — produced this Engineering OS: 126 assets, tested coding library, project templates, vault note pack. This file is now the reusable playbook for future sprints.

A 72-hour sprint is for standing up a SYSTEM (new skill area, project, exam push), not for routine work. Run one at most every few weeks — the daily loop is the default engine.

## When to Trigger a Sprint

- New domain to enter fast (e.g. "learn enough Rust to build X")
- Deadline wall (exam, hackathon, application deadline cluster)
- Infrastructure debt (docs/tests/notes rotted; system needs a rebuild)

## Sprint Contract (fill before starting — 15 min)

- Sprint name:
- Dates (72h window):
- **Definition of Done** (3-5 verifiable statements — "X runs", "Y pages exist", "Z submitted"):
- What is explicitly OUT of scope:
- Calendar cleared? Meals planned? Sleep protected? (sprints fail on logistics, not willpower)

## Rules of Execution

1. Every 90-minute block ends with a file, commit, or submission — no exceptions
2. No passive consumption: reading/watching must convert to a note or it didn't happen
3. Blocks are pre-planned the night before; mornings never start with "what should I do"
4. One 20-minute review per day: cut scope, never extend hours
5. Sleep is in-scope; all-nighters are a scope failure, not dedication

## Structure That Worked (Sprint 1 actuals)

| Day | Theme | Pattern |
|-----|-------|---------|
| 1 | Foundation | Skeletons + indexes first, so every later output has a home |
| 2 | Depth | Fill the 2-3 highest-leverage areas with real content |
| 3 | Integration | Wire systems together, validate everything runs, write the manifest |

Key lesson from Sprint 1: **generation without validation is fake progress** — everything claimed "done" must be executed/tested on Day 3.

## Daily Minimums

- 1 artifact shipped (code/script/template)
- 1 vault note with Details filled
- 1 commit pushed
- 1 line in the sprint log below

## Sprint Log Template

```
### Day N — YYYY-MM-DD
Blocks completed: /4
Shipped:
Cut from scope:
Tomorrow's first block:
```

## Post-Sprint (mandatory, 30 min)

1. Run the Definition of Done checklist — score honestly
2. Promote anything reusable into the right toolkit folder + Asset-Manifest
3. Write 5 lines in Weekly-Review: what the sprint proved/disproved
4. Tag it: `git tag sprint-<name> && git push --tags`

## Sprint History

| Sprint | Dates | DoD met? | Key output |
|--------|-------|----------|------------|
| engineering-os-v1 | 2026-08 | Yes | This repository, 126 assets, all validated |
