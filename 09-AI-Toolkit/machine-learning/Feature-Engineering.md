---
title: Feature Engineering
description: Scaling, encoding categoricals, missing values, datetime/text features, interactions and feature selection - leak-free with sklearn.
domain: ai
category: machine-learning
type: guide
difficulty: intermediate
status: evergreen
tags: [feature-engineering, preprocessing, encoding, sklearn, tabular]
prerequisites: [Python-for-ML, Linear-and-Logistic-Regression]
related: [Cross-Validation-and-Model-Selection, Classification-Algorithms, Clustering, Embeddings]
order: 4
---

# Feature Engineering

Hub: [[AI-Engineering-Index]]

## Core Idea

Features are how the model sees the world. Good features encode domain knowledge in a form the model family can exploit (linear models need explicit nonlinearities; trees need less). Every transform with learned statistics (means, vocabularies, target encodings) must be fit on training data only.

## How it works

### Numeric features

| Transform | When |
|---|---|
| StandardScaler ($(x-\mu)/\sigma$) | linear models, SVM, kNN, NNs, PCA |
| MinMaxScaler | bounded inputs, NNs |
| RobustScaler (median/IQR) | heavy outliers |
| log1p / Box-Cox / Yeo-Johnson | skewed positive values (income, counts) |
| Binning (KBinsDiscretizer) | nonlinearity for linear models; coarse monotonic effects |
| Clipping / winsorizing | extreme outliers |

Trees are invariant to monotonic transforms -- scaling does not help them.

### Categorical features

| Encoding | Notes |
|---|---|
| One-hot | low cardinality; linear models; use `handle_unknown="ignore"` |
| Ordinal | true order (low < medium < high), or for trees |
| Target / mean encoding | high cardinality; must be cross-fitted to avoid leakage |
| Frequency / count | cheap, leak-free signal of rarity |
| Hashing | very high cardinality, streaming; collisions |
| Learned embeddings | NNs with many categories |

### Missing values

- Impute (mean/median/most-frequent/constant) and add a missing-indicator column -- missingness is often informative.
- Many GBDT libraries handle NaN natively.
- Never impute with statistics computed on the full dataset before splitting.

### Datetime features

- Components: hour, day-of-week, month, is_weekend, holiday flags.
- Cyclical encoding: $\sin(2\pi h/24), \cos(2\pi h/24)$ so 23:00 is near 00:00.
- Elapsed time: days since signup, since last event. Only use information available at prediction time.

### Aggregates and interactions

- Group aggregates (user's mean spend over last 30 days) -- compute with point-in-time windows to avoid using future data.
- Ratios and differences (price per square meter, balance/limit).
- Polynomial/interaction features for linear models.

### Text

- Bag-of-words / TF-IDF (fit vocabulary on train only) + linear model is a strong baseline.
- Sentence [[Embeddings]] for semantic features.

### Feature selection

- Filter: variance threshold, mutual information, correlation.
- Wrapper: recursive feature elimination (RFE), sequential selection.
- Embedded: L1 regularization, tree importances.
- Must happen inside cross-validation; selecting on the full dataset then cross-validating inflates scores.

## Python code

```python
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler, FunctionTransformer, TargetEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

rng = np.random.default_rng(0)
n = 1000
df = pd.DataFrame({
    "income": rng.lognormal(10, 1, n),
    "age": rng.integers(18, 80, n).astype(float),
    "city": rng.choice(["a", "b", "c", "d"], n),
    "merchant_id": rng.integers(0, 300, n).astype(str),
    "ts": pd.to_datetime("2024-01-01") + pd.to_timedelta(rng.integers(0, 365 * 24, n), unit="h"),
})
df.loc[rng.random(n) < 0.1, "age"] = np.nan
y = (rng.random(n) < 0.3).astype(int)

def time_feats(X):
    h = X["ts"].dt.hour
    return pd.DataFrame({
        "hour_sin": np.sin(2 * np.pi * h / 24),
        "hour_cos": np.cos(2 * np.pi * h / 24),
        "dow": X["ts"].dt.dayofweek,
    })

pre = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median", add_indicator=True)),
        ("log", FunctionTransformer(np.log1p)),
        ("scale", StandardScaler()),
    ]), ["income", "age"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
    # TargetEncoder (sklearn >= 1.3) cross-fits internally during fit_transform
    ("hi_card", TargetEncoder(), ["merchant_id"]),
    ("time", FunctionTransformer(time_feats), ["ts"]),
])

model = Pipeline([("pre", pre), ("clf", LogisticRegression(max_iter=1000))])
print(cross_val_score(model, df, y, cv=5, scoring="roc_auc").mean())
```

Everything learned (medians, scaler stats, categories, target means) is fit per fold because it lives inside the `Pipeline`.

## Tradeoffs

- Hand-crafted features give interpretability and data efficiency; learned representations (NNs, embeddings) scale better with data but cost compute and explainability.
- One-hot on high cardinality explodes dimensionality; target encoding is compact but leak-prone.
- More features increase variance and serving complexity -- every feature is a production dependency.

## Failure modes

- Fitting transforms on train+test (leakage) -- see [[Cross-Validation-and-Model-Selection]].
- Target encoding without cross-fitting: model memorizes labels via the encoding.
- Features using future information (e.g., "total purchases" computed over the whole dataset).
- Train/serve skew: feature computed differently in the batch pipeline vs the online service.
- Unseen categories at inference crashing the encoder.

## Production notes

- Serialize the whole pipeline (`joblib.dump(model)`) so preprocessing and model ship together.
- Use a feature store or shared feature code for training and serving to avoid skew; log served features for audits.
- Point-in-time correct joins for historical training data.
- Monitor per-feature distributions and null rates for drift.

## Interview questions

1. **Do trees need feature scaling?** No, splits are invariant to monotonic transforms.
2. **How do you encode a feature with 10,000 categories?** Target encoding (cross-fitted), frequency, hashing, or embeddings.
3. **What is target leakage in encoding?** Using a row's own label to compute its feature value; fix with out-of-fold encoding.
4. **How to encode hour of day?** Sine/cosine pair to preserve cyclicity.
5. **Why add a missing indicator?** Missingness can carry signal and imputation alone hides it.
6. **What is train/serve skew?** Features computed differently offline vs online, silently degrading production accuracy.
7. **Where should feature selection happen?** Inside the CV loop, as a pipeline step.

## Related

- [[Cross-Validation-and-Model-Selection]]
- [[Python-for-ML]]
- [[Classification-Algorithms]]
- [[Clustering]]
- [[Embeddings]]
