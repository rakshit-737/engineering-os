---
title: Roadmap -- Research Engineer
description: Path to research engineer roles -- implementing and scaling experiments, reproducing papers, and rigorous evaluation.
domain: career
category: roadmaps
type: roadmap
role: "Research Engineer"
difficulty: advanced
status: evergreen
tags: [research, ml, experiments]
related: [Research-Index, Roadmap-ML-Engineer, Experiment-Tracker]
order: 110
---

# Roadmap -- Research Engineer

**What the role does:** turns research ideas into working, scalable, reproducible code: implements papers, builds training/eval infrastructure, runs experiments and analyzes results alongside research scientists.

## Stage 1 -- Foundation
- [ ] Strong Python and SWE practices (tests, profiling, clean abstractions)
- [ ] Math for ML: linear algebra, probability, optimization
- [ ] ML fundamentals ([[Overfitting-and-Regularization]], [[Evaluation-Metrics-ML]])

## Stage 2 -- Core
- [ ] PyTorch internals: autograd, custom modules, data loaders, mixed precision
- [ ] Transformers from scratch ([[Transformer-Architecture]], [[Attention-Mechanism]])
- [ ] Reading papers efficiently ([[Paper-Summary-Template]], [[Literature-Review-Template]])
- [ ] Experiment hygiene: seeds, configs, tracking ([[Experiment-Tracker]])

## Stage 3 -- Specialization
- [ ] Distributed training basics (data parallel, gradient accumulation), GPU profiling
- [ ] Statistical rigor: multiple seeds, confidence intervals, ablations
- [ ] Pick a research area and follow its recent literature
- [ ] Novelty and publication process ([[Novelty-Checklist]], [[Publication-Checklist]])

## Stage 4 -- Job-ready
- [ ] One paper reproduction with an honest report of what matched and what did not
- [ ] Research experience (lab internship, workshop paper, or strong open-source research code)

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Paper reproduction | Reimplement a paper's core result from scratch, compare with reported numbers, document discrepancies | Implementation skill, rigor |
| Ablation study | Take an existing method, run controlled ablations across seeds, publish analysis | Experimental design |
| Research tooling | Reusable training/eval framework or a well-tested library contribution | Engineering for research |

## Proof-of-skill signals
Reproductions, workshop papers, open-source research code others use, clear technical blog posts.

## Interview focus
Coding (often practical ML coding, e.g. implement attention), ML depth, paper discussion, experiment design, project defense.

## Common traps
Reporting single-seed results; no baselines; unreadable research code; overclaiming novelty.

## Study in Engineering OS
[[Research-Index]], [[AI-ML-Index]], [[Reviewer-Response-Template]].

## Optional certifications
Not relevant; publications and code matter.
