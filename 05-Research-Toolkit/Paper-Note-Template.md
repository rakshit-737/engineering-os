---
title: Paper Note Template
description: Structured per-paper note with the standard research sections, from problem and gap to novelty and future work.
domain: research
category: literature
type: template
difficulty: intermediate
status: evergreen
tags: [papers, reading, notes]
prerequisites: [How-to-Read-a-Paper]
related: [Literature-Review-Template, Novelty-Checklist, Datasets-and-Baselines-Guide]
order: 25
---

# Paper Note Template

One note per paper you read at pass 2 or 3 (see [[How-to-Read-a-Paper]]). Name it `Paper-YYYY-FirstAuthor-ShortTitle.md`. Write in your own words. If you can't fill a section, that's a sign you haven't understood that part of the paper yet.

## Citation

- Title:
- Authors:
- Venue / year:
- Link (DOI / arXiv / PDF):
- Code / data link:
- Read on: · Pass reached: 1 / 2 / 3
- One-sentence summary:

## Problem

What task or question does the paper address? Who has this problem, and in what setting?

## Research Gap

What did prior work fail to do that this paper targets? Which prior papers do the authors position against?

## Hypothesis

The claim the paper tests, stated as falsifiable: "If X, then Y, because Z." If the paper doesn't state one, infer it and mark it as inferred.

## Method

The core idea in 3-5 bullets. What is actually new versus borrowed? Sketch the pipeline if it helps.

## Dataset

| Dataset | Size | Split | Domain | Public? |
|---|---|---|---|---|
| | | | | |

Any preprocessing or filtering that could affect comparability:

## Baseline

| Baseline | Re-run by authors or quoted? | Tuned fairly? |
|---|---|---|
| | | |

Is the strongest recent method included?

## Experiment

Setup: hardware, budget, number of seeds, hyperparameter search, what was held fixed.

## Metrics

Which metrics, and are they appropriate for the claim? Anything important not measured?

## Results

| Setting | Baseline | Proposed | Gap | Variance reported? |
|---|---|---|---|---|
| | | | | |

Does the evidence support the headline claim? Are the ablations sufficient?

## Limitations

Stated by the authors:

Found by me (assumptions, missing baselines, cherry-picking risk, scale, generalization):

## Novelty

"Unlike [closest work], this paper [delta], which matters because [consequence]." How strong is that delta?

## Future Work

Stated by the authors, and the open directions I see. Mark any that could become my project and copy them to [[Research-Ideas-Backlog-Template|the ideas backlog]].

## My Take

- Trust level in results: high / medium / low, because:
- Reusable for my work (method, dataset, code, evaluation trick):
- Related notes:

- [ ] Added to the synthesis matrix in [[Literature-Review-Template]]
