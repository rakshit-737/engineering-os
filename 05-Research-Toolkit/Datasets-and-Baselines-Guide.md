---
title: Datasets and Baselines Guide
description: How to choose datasets and splits, avoid leakage, and select and run baselines fairly.
domain: research
category: experiments
type: guide
difficulty: intermediate
status: evergreen
tags: [datasets, baselines, evaluation, leakage]
prerequisites: [Hypothesis-Template]
related: [Novelty-Checklist, Experiment-Tracking-Guide, Ablation-Study-Guide]
order: 48
---

# Datasets and Baselines Guide

Most weak papers fail here, not in the method: the dataset doesn't test the claim, the split leaks, or the baseline is weak or under-tuned.

## Choosing Datasets

| Question | Why |
|---|---|
| Is it the dataset the closest prior work uses? | Makes your numbers comparable to theirs |
| Does it actually test the claim? | A robustness claim needs a distribution shift, not just an IID test set |
| Is it large enough for the gap you expect? | Small test sets make small gaps unmeasurable |
| Is the licence compatible with your use and release? | Some datasets forbid redistribution or commercial use |
| Are there known label-noise or duplicate problems? | Check papers and issue trackers about the dataset |

Use at least one standard benchmark (comparability) and, where the claim needs it, one dataset that stresses your specific claim.

## Splits and Leakage

- Use official splits when they exist. If you create your own, commit the split files (IDs), not just the seed used to create them.
- Validation set for tuning and early stopping; test set touched **only** for final numbers.
- Check leakage paths:
  - [ ] Duplicates or near-duplicates across train/test
  - [ ] Same user / patient / document / session in both train and test (split by group)
  - [ ] Temporal leakage (training on data from after the test period)
  - [ ] Preprocessing fitted on the full dataset (normalization, vocabulary, feature selection)
  - [ ] Pretrained models that may have seen the test set
- Document preprocessing as a script, and record the processed data's checksum.

## Choosing Baselines

Include:

1. **Trivial baseline**: majority class, random, or a simple heuristic. Shows the task isn't trivial.
2. **Classic baseline**: the well-known standard method.
3. **Strongest recent baseline**: the best published method for this exact setting from roughly the last two years.
4. **Your method minus its key component**: overlaps with ablations; shows the component matters.

## Fair Comparison

- [ ] Same data, splits, preprocessing and evaluation script for all methods
- [ ] Same tuning budget (trials, search space breadth) for all methods, recorded
- [ ] Same number of seeds; mean ± std for all
- [ ] Compute and parameter count reported when they differ
- [ ] Re-run numbers and quoted numbers kept visibly separate in tables
- [ ] If your re-run of a baseline is below its reported number, say so and compare against the higher one

## Reporting

| Method | Params | Tuning trials | Seeds | Metric (mean ± std) | Source |
|---|---|---|---|---|---|
| Trivial | | | | | re-run |
| Classic | | | | | re-run |
| Strongest recent | | | | | re-run / quoted |
| Ours | | | | | re-run |

See Check 3 in [[Novelty-Checklist]] before claiming your method "outperforms" anything.
