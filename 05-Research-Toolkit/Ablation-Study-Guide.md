---
title: Ablation Study Guide
description: How to design ablation studies that show each component of a method causes the improvement.
domain: research
category: experiments
type: guide
difficulty: intermediate
status: evergreen
tags: [ablation, experiments, analysis]
prerequisites: [Experiment-Tracking-Guide]
related: [Novelty-Checklist, Hypothesis-Template, Datasets-and-Baselines-Guide]
order: 55
---

# Ablation Study Guide

An ablation removes or replaces one part of your method and measures the change. It answers the question every reviewer asks: **which part of this actually matters?**

## Types

| Type | What you do | Answers |
|---|---|---|
| Remove-one | Full method minus component X | Does X contribute? |
| Add-one | Baseline plus component X only | Is X sufficient on its own? |
| Replace | Swap X for a simpler alternative (e.g. attention to mean pooling) | Is it X specifically, or any component in that slot? |
| Sensitivity | Vary a hyperparameter of X over a range | Is the result robust or tuned to one value? |
| Data / scale | Vary training data size or model size | Does the gain hold as things scale? |

## Design Rules

1. Change **one thing per row**. Two changes in one row give you an effect you can't attribute.
2. Same seeds, data, budget and evaluation script as the main results table.
3. Report mean ± std. A gap smaller than seed noise is not evidence.
4. Include the ablation for your **novelty claim** first. If removing it doesn't hurt, your claimed contribution isn't what's driving the result.
5. Control for capacity. If a component adds parameters, include a variant with the same parameter count but without the idea.
6. Decide the ablation list before seeing final results, so you don't only report the flattering ones.

## Ablation Table Template

| Variant | Change from full method | Metric (mean ± std) | Δ vs full | Interpretation |
|---|---|---|---|---|
| Full method | — | | — | |
| − Component A | removed A | | | |
| − Component B | removed B | | | |
| A → simple alternative | replaced A | | | |
| Baseline + A only | | | | |

## Checklist

- [ ] Every claimed component has a remove-one row
- [ ] Novelty-claim ablation included and shows a gap larger than noise
- [ ] Capacity-matched control when components add parameters
- [ ] Same seeds and budget as the main table
- [ ] Sensitivity plot for the most important hyperparameter
- [ ] Interpretation column filled with a mechanism, not just "helps"

## Interpreting Results

- **Removing X barely changes the metric**: X is redundant here, or another component compensates. Say so honestly.
- **Removing X helps**: X is harmful in this setting. Investigate before hiding it.
- **Components only work together**: report the interaction explicitly (2x2 table: with/without A × with/without B).

Log every ablation run in [[Experiment-Tracker]]; they go through the same versioning as main runs ([[Experiment-Tracking-Guide]]).
