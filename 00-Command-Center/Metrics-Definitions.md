---
title: Metrics Definitions
description: What each Command Center metric means, how to count it, why it matters, and which vanity metrics are excluded.
domain: command-center
category: metrics
type: guide
difficulty: beginner
status: evergreen
tags: [metrics, review, measurement]
prerequisites: [Command-Center-Index]
related: [Daily-Dashboard, Weekly-Review, Monthly-Review]
order: 50
---

# Metrics Definitions

A metric belongs here only if (1) you control it, (2) it changes a decision when it moves, and (3) it is counted the same way every week. Everything else is a vanity metric.

## Core Metrics

| Metric | Definition | How to count | Why it matters | Decision it drives |
|---|---|---|---|---|
| Artifacts shipped | Files that did not exist before and will be reused: code that runs, a filled note, a template, a submitted application | Count from the artifact log or `git log`; drafts don't count | Output is the only thing that compounds | < 3 per week for 2 weeks: cut scope or protect focus blocks |
| Weekly outcomes hit | Of the 3 weekly objectives, how many were fully done | 0-3, no partial credit | Measures planning accuracy as much as effort | Consistently 3/3: objectives too easy. 0-1/3: too many or too vague |
| Deep work hours | Time in an uninterrupted focus block on a planned task | Sum of completed blocks; a block with phone checks counts as 0 | Proxy for capacity; tells you what's realistic to plan | Plan next week at about 80% of the recent average |
| Problems solved under time | DSA or design problems solved within a timer without looking at a solution | Count; separate "solved" from "solved after hint" | Interviews are timed; untimed solving overstates readiness | Low solve rate on a pattern: add a pattern note and drill it |
| Notes filled | Notes whose explanation and examples are written in your own words | Count only notes that moved from empty/draft to filled | Filled notes are retrievable knowledge; created notes are not | Many created, few filled: stop creating, start filling |
| Applications sent | Tailored applications submitted | Count per week; track responses separately | Pipeline volume is controllable, outcomes are not | Response rate low after 20+: fix résumé before sending more |
| Review completed | Did the daily shutdown / weekly review happen | Yes/no | The loop only works if reviews happen | Missed 2 weekly reviews: shorten the template, don't skip it |

## Daily Scorecard (0-2 each)

Used in [[Daily-Dashboard]].

| Score | 0 | 1 | 2 |
|---|---|---|---|
| Focus | No complete block | Blocks done with switching | Blocks ran without switching |
| Output | Nothing shipped | Partial artifact | Artifact shipped and works |
| Reusability | One-off | Maybe reused | Clearly reused later |
| Consistency | Review skipped | Partial review | Review done, tomorrow planned |

The scorecard is a self-report. Use it for trends, not for comparing yourself to anyone.

## Excluded (Vanity) Metrics

| Metric | Why it's excluded |
|---|---|
| Total hours "studied" | Rewards sitting, not output |
| Videos watched / pages read | Consumption without retrieval or output |
| Streak length on its own | Encourages trivial tasks to keep the streak alive |
| Notes created | Empty notes feel like progress |
| GitHub contribution squares | Easy to game with trivial commits |
| Problems solved (lifetime total) | Hides whether you can solve them now, under time |

## Rules for Adding a Metric

- [ ] Written definition and counting rule added to this page first
- [ ] The decision it drives is stated
- [ ] Tracked for at least 4 weeks before judging it
- [ ] Removed if it hasn't changed a decision in 2 months
