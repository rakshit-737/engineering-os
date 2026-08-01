---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# Overfitting and Regularization

Hub: [[AI-ML-Index]]

## Core Idea

Overfitting is memorizing training noise instead of learning the underlying pattern: training loss keeps falling while validation loss rises. It is the high-variance end of the bias–variance tradeoff — a model too flexible for the amount of data it saw. Regularization is any technique that constrains that flexibility (penalties, dropout, early stopping, more data) to buy generalization at the price of a little training fit.

## Details

Bias–variance intuition:
- **High bias (underfit)**: model too simple — both training and validation error high. Fix: more capacity, better features, train longer.
- **High variance (overfit)**: model fits the sampled noise — training error low, validation error high, and predictions swing wildly across resampled training sets. Fix: regularize, simplify, get more data.
- Diagnose from **learning curves**: plot train vs validation loss per epoch. Diverging curves (train ↓, val ↑) = overfitting; the gap is the variance you're paying.

Regularization toolbox:

| Technique | Mechanism | Notes |
|---|---|---|
| **L2 (weight decay)** | add λ·Σw² to loss → shrinks all weights toward 0 | default choice; smooth, keeps all features |
| **L1 (lasso)** | add λ·Σ\|w\| → drives some weights to exactly 0 | built-in feature selection; sparse models |
| **Dropout** | randomly zero p of activations each training step | prevents co-adaptation; acts like an ensemble; off at inference (activations rescaled) |
| **Early stopping** | halt when validation loss stops improving | free; equivalent to limiting effective capacity |
| **Data augmentation / more data** | enlarge effective training set | attacks variance at the source; usually best ROI |
| **Simpler model / fewer params** | reduce capacity directly | try before exotic tricks |

Why L1 gives zeros and L2 doesn't: the L1 penalty's gradient is a constant ±λ regardless of weight size, so it can push small weights all the way to 0; L2's pull (2λw) fades as w shrinks. Geometric view: the L1 constraint region is a diamond whose corners sit on the axes.

```python
# PyTorch: weight decay = L2; dropout as a layer
opt = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
self.drop = nn.Dropout(p=0.3)   # active only in model.train() mode

# Early stopping sketch
if val_loss < best - min_delta: best, patience_ct = val_loss, 0
else: patience_ct += 1
if patience_ct >= patience: break   # stop training
```

Worked example: fit a degree-15 polynomial to 20 noisy points from a quadratic — train error ≈ 0, but the curve oscillates wildly between points and test error explodes. Add L2 (ridge) and the oscillations flatten toward the true quadratic. Same story in deep nets, just higher-dimensional.

Pitfalls:
- **Data leakage looks like generalization**: test rows (or near-duplicates, or future information) in training data give great validation scores that vanish in production. Split *before* any preprocessing; fit scalers on train only.
- Tuning hyperparameters against the test set — that overfits the test set; use a validation split or k-fold cross-validation and touch test once.
- Forgetting `model.eval()` in PyTorch → dropout active at inference, degraded and noisy predictions.
- LLM-era note: benchmark contamination (test data in pretraining corpora) is overfitting at corpus scale — why private eval harnesses exist.

## Interview Angle

- The near-guaranteed question: "how do you detect and fix overfitting?" Answer as a pipeline: detect via train/val curve divergence → fix in order of cheapness: more/augmented data, early stopping, weight decay, dropout, smaller model. Naming an *order* shows judgment, not just recall.
- "L1 vs L2?" — be ready with both the sparsity answer and the *why* (gradient behavior or diamond-corner geometry). The why is the differentiator.
- "Why does dropout work?" — prevents units co-adapting; trains an implicit ensemble of subnetworks; mention inference-time rescaling.
- Expect the bias–variance tradeoff drawn as a U-shaped validation curve vs model capacity; be able to sketch and label it.
- Strong follow-ups to preempt: cross-validation for small datasets, leakage stories, and "regularization is a prior" (L2 = Gaussian prior, L1 = Laplace) if the interviewer is theory-minded.

## Related

- [[Evaluation-Metrics-ML]]
- [[Fine-Tuning-vs-Prompting]]
- [[Transformer-Architecture]]
