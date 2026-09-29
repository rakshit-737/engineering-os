---
title: Experiment Tracking Guide
description: How to track seeds, configs, code, data and environment versions so every reported number can be regenerated.
domain: research
category: experiments
type: guide
difficulty: intermediate
status: evergreen
tags: [experiments, reproducibility, seeds, configs, mlops]
prerequisites: [Hypothesis-Template]
related: [Experiment-Tracker, Reproducibility-Checklist, Ablation-Study-Guide]
order: 45
---

# Experiment Tracking Guide

A number in your paper is only real if you can say exactly which code, data, config, environment and seed produced it. This guide covers how to capture those five things cheaply. Log runs in [[Experiment-Tracker]].

## The Five Things to Pin

| Thing | Minimum | Better |
|---|---|---|
| Code | Commit hash logged; clean `git status` | Tag per campaign; refuse to run with uncommitted changes |
| Config | Config file copied into the run folder | Hierarchical configs (Hydra, YAML) with the full resolved config saved |
| Data | Dataset name + version + checksum | DVC / git-lfs / dataset registry; split files committed |
| Environment | `pip freeze > env.txt`, Python and CUDA versions | Lockfile (uv, poetry, conda-lock) or container image digest |
| Seed | One seed per run, logged | 3-5 seeds per configuration; mean ± std reported |

## Seeds

Set every RNG, not just one:

```python
import os, random
import numpy as np
import torch

def set_seed(seed: int) -> None:
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    os.environ["PYTHONHASHSEED"] = str(seed)
    # Optional, slower: deterministic kernels
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
```

- Dataloader workers need a `worker_init_fn` and a seeded `generator`, or shuffling differs between runs.
- Some GPU operations are non-deterministic even with seeds fixed. Expect small run-to-run differences; this is why you report multiple seeds.
- Use the **same seed list** for your method and every baseline.
- Never pick "the best seed". Report all of them.

## Configs

- One base config per campaign, committed. Each run records only its delta from the base.
- Save the **fully resolved** config (after command-line overrides) into `results/<run-id>/config.yaml`.
- Don't edit the base config mid-campaign. Create a new file and a new campaign.
- Hyperparameter searches: log the search space, the number of trials, and the selection metric (validation, never test).

## Versions

```bash
git rev-parse --short HEAD > results/$RUN/commit.txt
git diff --quiet || echo "DIRTY TREE: do not report this run"
pip freeze > results/$RUN/env.txt
python -c "import torch; print(torch.__version__, torch.version.cuda)" >> results/$RUN/env.txt
sha256sum data/processed/* > results/$RUN/data.sha256
```

## Run Folder Layout

```
results/
  20260929-01/
    config.yaml      # resolved config
    commit.txt
    env.txt
    data.sha256
    command.txt      # exact command line
    metrics.json     # final metrics
    log.txt          # stdout/stderr
```

## Tools

A spreadsheet or the Markdown [[Experiment-Tracker]] is enough for a small project. For many runs, tools such as MLflow, Weights & Biases, Aim or TensorBoard log metrics and configs automatically. Whatever you use, the five pinned items must be recorded.

## Workflow per Run

- [ ] Hypothesis ID assigned ([[Hypothesis-Template]])
- [ ] Tree clean, commit logged
- [ ] Config delta is a single change from the base
- [ ] Seed(s) set and logged
- [ ] Row added to the tracker immediately after the run finishes
- [ ] Conclusion written before starting the next run

## Common Mistakes

- Comparing runs across different code versions without re-running the baseline.
- Selecting hyperparameters or checkpoints on the test set.
- Overwriting a results folder when re-running.
- Reporting a single seed with a small gap as an improvement.
- Losing the preprocessing script that produced the dataset version.

Before submission, run the [[Reproducibility-Checklist]].
