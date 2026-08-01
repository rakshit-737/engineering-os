# Experiment Tracker

One file per experimental campaign (not per run — runs are rows). The discipline that makes results publishable: **change one thing per run, log before looking at results, never delete failed runs.**

## Metadata

- Project:
- Campaign question (one sentence this campaign answers):
- Date started:
- Code version at start (`git rev-parse --short HEAD`):

## Hypothesis — falsifiable, written BEFORE running

<!-- Format: "If <change>, then <metric> will <direction by amount>,
     because <mechanism>." A hypothesis you can't fail is a demo.
     Number them H1, H2… — the Experiment Log references these IDs. -->

- H1:
- H2 (optional):

Kill criterion: <!-- result that makes you abandon this direction, decided now, not after sunk cost -->

## Fixed Configuration (identical across all runs)

- Dataset + version/split + preprocessing:
- Model/method base:
- Seeds (fix 3+, report mean±std — single-seed results are noise):
- Hardware:
- Command to reproduce: `python train.py --config configs/base.yaml --seed {s}`

## Reproducibility Checklist — tick per run, not per campaign

A run is reproducible when someone else can regenerate the metric to within seed noise. Verify all six before logging a result as real:

- [ ] **Seed** fixed and logged (framework RNG + numpy + Python `random` + dataloader workers)
- [ ] **Environment** captured: `pip freeze > results/<run-id>/env.txt` (or lockfile hash) + CUDA/driver version
- [ ] **Data version** pinned: dataset checksum or DVC/git-lfs tag — "the CSV on my laptop" is not a version
- [ ] **Code commit** clean: `git status` empty, hash logged; uncommitted-diff runs are throwaways
- [ ] **Config file** archived verbatim to `results/<run-id>/config.yaml` (not reconstructed from memory)
- [ ] **Exact command** logged, including all flags — copy-paste from shell history, don't retype

## Experiment Log

Run ID convention: `YYYYMMDD-nn`. Config delta = ONLY what differs from Fixed Configuration. Hypothesis column = which numbered hypothesis this run tests. Fill Conclusion the moment the run ends, before starting the next.

| ID | Hypothesis | Config delta | Seed | Metric (name) | Result | Commit | Conclusion |
|----|------------|--------------|-----:|---------------|-------:|--------|------------|
| 20260801-01 | H1: attention pooling beats mean pooling by ≥1 F1 | `pool=attn` (else base.yaml) | 42 | F1 (test) | 0.847 | `a3f9c21` | +1.3 over 20260731-03 baseline (0.834); supports H1, repeat seeds 43,44 before claiming |
| | | baseline | | | | | |
| | | | | | | | |

## Observations

<!-- Patterns across runs, not per-run trivia. Plots > numbers when > 5 runs.
     Surprises get their own line — surprises are where papers come from. -->

## Failure Cases

<!-- Concrete inputs/conditions where the method loses. Mandatory:
     reviewers ask, and error analysis sections are built from this. -->

| Failure input/condition | Baseline behavior | Our behavior | Suspected cause |
|--------------------------|-------------------|--------------|-----------------|
| | | | |

## Campaign Verdict

- Hypothesis: supported / refuted / inconclusive — evidence:
- Kill criterion hit? :
- Next campaign (one sentence):

## Hygiene Rules

1. Never compare runs across code versions — re-run the baseline after refactors
2. A result without its command + seed + commit hash doesn't exist
3. Log to this table the moment the run finishes, before interpreting
4. Archive raw outputs: `results/<run-id>/` — disk is cheaper than re-running
5. One config delta per run; if you changed two things, you learned nothing attributable
