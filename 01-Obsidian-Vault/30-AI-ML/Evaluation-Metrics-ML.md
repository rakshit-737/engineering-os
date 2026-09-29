---
title: Evaluation Metrics for ML
description: Confusion matrix, precision/recall, F1, ROC/PR curves, regression and ranking metrics - and how to choose from error costs.
domain: ai
category: machine-learning
type: concept
difficulty: beginner
status: evergreen
tags: [metrics, classification, evaluation, machine-learning, interview]
prerequisites: [Probability-and-Statistics-for-ML, Classification-Algorithms]
related: [Cross-Validation-and-Model-Selection, Overfitting-and-Regularization, LLM-Evaluation-Framework, Hybrid-Search-and-Reranking]
order: 70
---

# Evaluation Metrics for ML

Hub: [[AI-Engineering-Index]]

## Core Idea

A metric encodes which mistakes you care about. Accuracy collapses on imbalanced data (99% accuracy by always predicting "no fraud"); precision and recall split errors into false positives vs false negatives so you can optimize for the one that actually costs you. F1 and AUC compress the tradeoff into one number - convenient, but always know what they hide.

## How it works

Everything derives from the confusion matrix. Example: screening test on 1000 patients, 50 actually positive.

| | Predicted + | Predicted - |
|---|---|---|
| **Actual +** (50) | TP = 40 | FN = 10 |
| **Actual -** (950) | FP = 30 | TN = 920 |

- **Accuracy** $= \frac{TP+TN}{N} = 960/1000 = 0.96$ - looks great, yet 10 positives were missed.
- **Precision** $= \frac{TP}{TP+FP} = 40/70 \approx 0.57$ - of flagged cases, how many were real.
- **Recall / sensitivity / TPR** $= \frac{TP}{TP+FN} = 40/50 = 0.80$ - of real cases, how many we caught.
- **F1** $= \frac{2PR}{P+R} \approx 0.67$ - harmonic mean, dragged toward the worse of the two. $F_\beta$ weights recall $\beta$ times as much as precision.
- **Specificity / TNR** $= \frac{TN}{TN+FP} = 920/950 \approx 0.97$; FPR $= 1 -$ specificity.

**Thresholds and curves**

- A classifier outputs a score; the threshold converts it to a label. Lowering the threshold raises recall and lowers precision. You choose the operating point from error costs.
- **ROC curve**: TPR vs FPR across thresholds. **ROC-AUC** = probability that a random positive scores above a random negative. 0.5 = random, 1.0 = perfect ranking.
- **PR curve / average precision**: preferred under heavy imbalance, because FPR's denominator (all negatives) is huge and hides false positives that would swamp precision. The PR baseline is the positive rate, not 0.5.
- **Calibration**: does a score of 0.8 mean 80% are positive? Check with reliability diagrams / Brier score; needed when scores feed decisions or costs.

**Multiclass averaging**: macro = mean over classes (rare classes count equally); micro = pooled counts (dominated by frequent classes); weighted = macro weighted by support.

**Regression**: MSE/RMSE (penalize large errors), MAE (robust to outliers, median-optimal), $R^2$ (variance explained; can be negative on test data), MAPE (breaks near zero).

**Ranking / retrieval** (search, RAG): recall@k, precision@k, MRR $= \frac{1}{|Q|}\sum 1/\text{rank}_i$, nDCG (graded relevance with log position discount).

**LLMs**: exact match, pass@k for code, and rubric or judge-based scoring - see [[LLM-Evaluation-Framework]].

## Python code

```python
import numpy as np
from sklearn.metrics import (confusion_matrix, precision_recall_fscore_support,
                             roc_auc_score, average_precision_score, precision_recall_curve)

rng = np.random.default_rng(0)
y_true = (rng.random(1000) < 0.05).astype(int)                 # 5% positives
y_score = np.clip(y_true * 0.4 + rng.random(1000) * 0.7, 0, 1)  # noisy scores

y_pred = (y_score >= 0.5).astype(int)
print(confusion_matrix(y_true, y_pred))
p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="binary", zero_division=0)
print(f"P={p:.2f} R={r:.2f} F1={f1:.2f}")
print("ROC-AUC", round(roc_auc_score(y_true, y_score), 3))       # needs scores, not labels
print("PR-AUC ", round(average_precision_score(y_true, y_score), 3))

# pick the threshold on VALIDATION data that reaches a recall target
prec, rec, thr = precision_recall_curve(y_true, y_score)
ok = np.where(rec[:-1] >= 0.9)[0]
best = ok[np.argmax(prec[ok])]
print("threshold for recall>=0.9:", round(thr[best], 3), "precision:", round(prec[best], 2))
```

## Tradeoffs

| Metric | Use when | Hides |
|---|---|---|
| Accuracy | Balanced classes, symmetric costs | Minority-class failure |
| Precision | False positives are expensive (spam filter, auto-actions) | Misses |
| Recall | Misses are expensive (screening, fraud, security alerts) | False alarm volume |
| F1 | Need one number, both errors matter | Actual cost asymmetry, threshold choice |
| ROC-AUC | Comparing rankers, moderate imbalance | Operating point; optimistic under extreme imbalance |
| PR-AUC | Rare positives | Harder to compare across datasets with different base rates |
| Cost-weighted metric | Error costs are known | Needs honest cost estimates |

## Failure modes

- Reporting accuracy without the base rate.
- Computing AUC from hard predictions instead of scores.
- Tuning the threshold on the test set (leakage) - tune on validation ([[Cross-Validation-and-Model-Selection]]).
- Micro averaging hiding a model that fails on rare classes.
- Test distribution differs from production (time drift, different population) - offline metrics do not transfer.
- Small test sets: a two-point difference may be noise; report confidence intervals (bootstrap).
- Optimizing a proxy (clicks) that diverges from the goal (satisfaction).

## Production notes

- Pick one primary metric tied to business cost plus guardrail metrics (latency, fairness slices, calibration).
- Monitor the metric on live labeled samples; labels often arrive late - track prediction distribution drift meanwhile.
- Slice metrics by segment (region, device, class); aggregate numbers hide regressions.

## Interview questions

1. **"Model is 99% accurate - is it good?"** Ask the class balance; if positives are 1%, a constant predictor gets 99%. Move to precision/recall and the confusion matrix.
2. **Spam filter vs cancer screening - which metric?** Spam: precision (losing a real email hurts). Screening: recall (a miss is severe). The threshold trades between them.
3. **Define ROC-AUC in one sentence.** Probability a random positive is ranked above a random negative.
4. **Why PR-AUC under heavy imbalance?** FPR stays tiny even with many false positives because negatives dominate; precision exposes them.
5. **Why is F1 a harmonic mean?** It punishes imbalance between P and R; P=1, R=0.01 gives F1 about 0.02 rather than 0.5.
6. **MAE vs RMSE?** RMSE penalizes large errors quadratically; MAE is robust to outliers.
7. **Macro vs micro F1?** Macro weights classes equally; micro weights samples - macro reveals rare-class failures.
8. **How do you evaluate retrieval?** Recall@k / hit rate for "is it in the context", MRR/nDCG for ordering.

## Related

- [[Overfitting-and-Regularization]]
- [[Cross-Validation-and-Model-Selection]]
- [[Classification-Algorithms]]
- [[LLM-Evaluation-Framework]]
- [[RAG-Playbook]]
