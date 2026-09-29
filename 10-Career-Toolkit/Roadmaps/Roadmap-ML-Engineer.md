---
title: Roadmap -- ML Engineer
description: Path to ML engineering roles -- modeling fundamentals, data pipelines, training, serving and monitoring models in production.
domain: career
category: roadmaps
type: roadmap
role: "ML Engineer"
difficulty: advanced
status: evergreen
tags: [ml, mlops]
related: [AI-ML-Index, Evaluation-Metrics-ML, Roadmap-AI-Engineer]
order: 90
---

# Roadmap -- ML Engineer

**What the role does:** trains, deploys and maintains ML models: data pipelines, feature engineering, training infrastructure, serving, monitoring for drift. Sits between data science and backend engineering.

## Stage 1 -- Foundation
- [ ] Python, NumPy, pandas; SQL ([[SQL-Cheat-Sheet]])
- [ ] Linear algebra, probability, basic calculus for gradients
- [ ] DSA and SWE fundamentals ([[Interview-DSA-Strategy]])

## Stage 2 -- Core
- [ ] Classical ML: linear/logistic regression, trees, ensembles, clustering (scikit-learn)
- [ ] Bias/variance, regularization, cross-validation ([[Overfitting-and-Regularization]])
- [ ] Metrics and choosing them ([[Evaluation-Metrics-ML]])
- [ ] Deep learning in PyTorch: training loops, CNNs, transformers ([[Transformer-Architecture]])

## Stage 3 -- Specialization
- [ ] Experiment tracking and reproducibility ([[Experiment-Tracker]])
- [ ] Model serving (REST/batch), containerization
- [ ] Data validation, feature stores (concept level)
- [ ] Monitoring: data drift, performance decay, retraining triggers
- [ ] Pick a domain: recsys, NLP, vision, or tabular

## Stage 4 -- Job-ready
- [ ] End-to-end project deployed with monitoring
- [ ] ML system design practice (e.g. design a recommendation or fraud-detection system)

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| End-to-end ML service | Data pipeline -> training with tracked experiments -> model API -> monitoring dashboard; baseline vs model comparison | MLOps lifecycle |
| Kaggle-style problem done rigorously | Proper validation, leakage checks, error analysis, honest write-up | Modeling judgment |
| Model optimization | Quantize/distill a model and measure latency/accuracy tradeoff on a fixed benchmark | Performance engineering |

## Proof-of-skill signals
Reproducible repos (seeded, pinned deps), clear baselines, honest error analysis.

## Interview focus
Coding, ML fundamentals Q&A, ML system design, project defense (data leakage, metric choice).

## Common traps
No baseline; test set leakage; accuracy on imbalanced data; notebooks with no deployable code.

## Optional certifications
Google Cloud Professional Machine Learning Engineer, AWS Certified Machine Learning Engineer - Associate. Optional.
