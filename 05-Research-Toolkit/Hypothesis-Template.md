---
title: Hypothesis Template
description: Template for writing a falsifiable research hypothesis with mechanism, metric, threshold, and kill criterion before running experiments.
domain: research
category: experiments
type: template
difficulty: intermediate
status: evergreen
tags: [hypothesis, experiments, methodology]
prerequisites: [Research-Workflow]
related: [Experiment-Tracker, Ablation-Study-Guide, Novelty-Checklist]
order: 40
---

# Hypothesis Template

Write this **before** running the experiment that tests it, and commit it to git so the timestamp proves it. A hypothesis that can't fail is a demo.

## H1: <short name>

- Date written:
- Gap it addresses (from [[Literature-Review-Template]]):

**Statement:** If `<intervention/change>`, then `<metric>` on `<dataset/setting>` will `<direction and minimum amount>` compared to `<baseline>`, because `<mechanism>`.

| Field | Value |
|---|---|
| Independent variable (what I change) | |
| Dependent variable (metric) | |
| Controlled variables (held fixed) | |
| Baseline | |
| Minimum meaningful effect | |
| Number of seeds | |
| Expected noise (std from baseline seeds) | |

**Mechanism:** Why should this work? What would I see in the failure cases if the mechanism is right?

**Kill criterion:** The result at which I stop pursuing this direction. Decide now, not after sunk cost.

**Alternative explanations:** What else could produce the same improvement (more parameters, more compute, data leakage, tuning budget)? How will I rule each out?

1.
2.

## Pre-Run Checklist

- [ ] Metric and threshold fixed before seeing results
- [ ] Baseline reproduced under the same setup
- [ ] Seeds chosen; noise level estimated from baseline runs
- [ ] Alternative explanations each have a control or ablation planned
- [ ] Logged in [[Experiment-Tracker]] with this hypothesis ID

## Outcome (fill after)

- Result:
- Verdict: supported / refuted / inconclusive
- Did the mechanism check out (failure-case analysis)?
- Next hypothesis:

## Good vs Bad

| Bad | Why | Better |
|---|---|---|
| "Our model will perform better" | No metric, no amount, no baseline | "Adding contrastive pretraining raises macro-F1 on X-test by at least 2 points over the fine-tuned baseline (3 seeds)" |
| "Attention helps" | Can't fail | "Attention pooling beats mean pooling by at least 1 F1; removing it drops F1 by more than one std" |
| "Explore whether X works" | Exploration, not a hypothesis | Run a small pilot, then write a hypothesis from what it shows |
