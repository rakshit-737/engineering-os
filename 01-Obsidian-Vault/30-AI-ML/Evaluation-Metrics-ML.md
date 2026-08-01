---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# Evaluation Metrics ML

Hub: [[AI-ML-Index]]

## Core Idea

A metric encodes which mistakes you care about. Accuracy collapses on imbalanced data (99% accuracy by always predicting "no fraud"); precision and recall split errors into false positives vs false negatives so you can optimize for the one that actually costs you. F1 and AUC compress the tradeoff into a single number — convenient, but always know what they hide.

## Details

Everything derives from the confusion matrix. Example: cancer screen on 1000 patients, 50 actually positive.

| | Predicted + | Predicted − |
|---|---|---|
| **Actual +** (50) | TP = 40 | FN = 10 |
| **Actual −** (950) | FP = 30 | TN = 920 |

- **Accuracy** = (TP+TN)/all = 960/1000 = **0.96** — looks great, yet 10 cancers were missed.
- **Precision** = TP/(TP+FP) = 40/70 ≈ **0.57** — of flagged patients, how many were real. Penalizes false alarms.
- **Recall (sensitivity, TPR)** = TP/(TP+FN) = 40/50 = **0.80** — of real cases, how many we caught. Penalizes misses.
- **F1** = 2·P·R/(P+R) ≈ **0.67** — harmonic mean, drags toward the worse of the two; only high when both are.
- **Specificity (TNR)** = TN/(TN+FP) = 920/950 ≈ 0.97; FPR = 1 − specificity.

Threshold and curves:
- Classifiers output a score; the threshold converts it to a label. Lowering the threshold raises recall and lowers precision — you *choose* the operating point from error costs.
- **ROC curve**: TPR vs FPR across all thresholds. **AUC** = probability a random positive scores above a random negative; 0.5 = coin flip, 1.0 = perfect. Threshold-independent, good for comparing models.
- **PR curve / PR-AUC**: better than ROC under heavy class imbalance, because ROC's FPR denominator (all negatives) is huge and hides false positives that would swamp precision.

```python
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score
p, r, f1, _ = precision_recall_fscore_support(y_true, y_pred, average="binary")
auc = roc_auc_score(y_true, y_scores)   # needs scores, not hard labels
```

Beyond binary classification:
- Regression: MSE/RMSE (punish large errors), MAE (robust to outliers), R².
- Ranking/retrieval (RAG): recall@k, MRR, nDCG.
- LLMs: exact-match/pass@k on benchmarks, plus **eval harnesses** (lm-eval-harness, custom task suites) and LLM-as-judge with human spot-checks — modern AI roles expect you to treat evals as the test suite for model behavior.

Pitfalls:
- Reporting accuracy on imbalanced data; always state the base rate.
- Computing AUC from hard predictions instead of scores.
- Tuning the threshold on the test set — that's leakage; pick it on validation.
- Macro vs micro averaging in multiclass: macro treats classes equally, micro weights by frequency — a model bad on rare classes can hide behind micro.

## Interview Angle

- The classic: "your model is 99% accurate — is it good?" Expected answer: ask the class balance, then pivot to precision/recall and the confusion matrix.
- Be ready to pick metrics from error costs and argue it: spam filter → precision (a lost real email hurts more than a spam getting through); cancer screening or fraud → recall (a miss is catastrophic, a false alarm is a follow-up test); then note the threshold is the knob that trades between them.
- Define AUC in one sentence (probabilistic ranking definition above) — it separates people who memorized "area under curve" from people who understand it.
- Know why PR-AUC beats ROC-AUC at 1:1000 imbalance; this is a frequent senior-level follow-up.
- For security-flavored roles, map the same math onto IDS/alert triage: false-positive floods cause alert fatigue; recall misses become breaches.

## Related

- [[Overfitting-and-Regularization]]
- [[RAG-Retrieval-Augmented-Generation]]
- [[Fine-Tuning-vs-Prompting]]
- [[Incident-Response-Lifecycle]]
