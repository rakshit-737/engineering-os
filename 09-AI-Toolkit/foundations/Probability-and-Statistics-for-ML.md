---
title: Probability and Statistics for ML
description: Distributions, Bayes, MLE/MAP, bias-variance, hypothesis testing and confidence intervals as used in ML work.
domain: ai
category: foundations
type: concept
difficulty: intermediate
status: evergreen
tags: [probability, statistics, bayes, mle, hypothesis-testing]
prerequisites: [Python-for-ML]
related: [Linear-and-Logistic-Regression, Classification-Algorithms, Evaluation-Metrics-ML, Overfitting-and-Regularization]
order: 2
---

# Probability and Statistics for ML

Hub: [[AI-Engineering-Index]]

## Core Idea

A model is a probability distribution over outputs given inputs. Training is estimating its parameters (MLE/MAP), losses are negative log-likelihoods, and evaluation is statistical inference on a finite sample. Statistics tells you whether an observed improvement is real.

## Core concepts

### Random variables and expectation

- $E[X] = \sum_x x\,p(x)$; linearity: $E[aX+bY] = aE[X] + bE[Y]$ always (independence not required).
- $\mathrm{Var}(X) = E[X^2] - E[X]^2$; $\mathrm{Var}(X+Y) = \mathrm{Var}X + \mathrm{Var}Y + 2\,\mathrm{Cov}(X,Y)$.
- Covariance measures linear co-movement; zero covariance does not imply independence.

### Distributions you must know

| Distribution | Use in ML |
|---|---|
| Bernoulli / Binomial | binary labels, click counts; logistic regression likelihood |
| Categorical / Multinomial | multiclass labels; softmax + cross-entropy |
| Gaussian | noise model behind MSE; weight init; GMMs |
| Poisson | count data (events per time) |
| Uniform | random init, sampling hyperparameters |
| Beta / Dirichlet | priors over probabilities (Bayesian A/B, topic models) |

### Bayes' rule

$$P(\theta \mid D) = \frac{P(D \mid \theta)\,P(\theta)}{P(D)}$$

Base-rate example: a test with high sensitivity for a rare condition still yields mostly false positives when prevalence is very low. The same effect shows up in fraud/anomaly detection: precision collapses on rare positives.

### MLE and MAP

- **MLE:** $\hat\theta = \arg\max_\theta \sum_i \log p(y_i \mid x_i, \theta)$.
- Gaussian noise $\Rightarrow$ MLE = minimize MSE. Bernoulli $\Rightarrow$ minimize binary cross-entropy.
- **MAP:** add $\log p(\theta)$. Gaussian prior $\Rightarrow$ L2 (ridge); Laplace prior $\Rightarrow$ L1 (lasso). See [[Overfitting-and-Regularization]].

### Bias-variance decomposition (squared loss)

$$E[(y - \hat f(x))^2] = \mathrm{Bias}[\hat f(x)]^2 + \mathrm{Var}[\hat f(x)] + \sigma^2$$

Simple models: high bias. Flexible models: high variance. $\sigma^2$ is irreducible noise.

### Sampling and estimation

- Law of large numbers: sample mean converges to $E[X]$.
- CLT: the sample mean is approximately normal with standard error $\sigma/\sqrt{n}$ for large $n$.
- Standard error of accuracy on $n$ test examples $\approx \sqrt{p(1-p)/n}$ -- small test sets give wide intervals.

### Hypothesis testing

- $p$-value: probability of data at least this extreme if $H_0$ is true. Not the probability $H_0$ is true.
- Type I error (false positive) rate $\alpha$; Type II ($\beta$); power $= 1-\beta$.
- Multiple comparisons: testing many models/metrics inflates false discoveries; use Bonferroni or Benjamini-Hochberg, or a held-out confirmation set.
- For comparing two classifiers on the same test set, use paired tests (McNemar, paired bootstrap), not independent-sample tests.

## Python code

```python
import numpy as np
from scipy import stats

rng = np.random.default_rng(0)

# MLE for a Gaussian = sample mean and (biased) std
x = rng.normal(loc=3.0, scale=2.0, size=500)
mu_hat, sigma_hat = x.mean(), x.std(ddof=0)

# Bootstrap confidence interval for a metric
def bootstrap_ci(y_true, y_pred, metric, n_boot=2000, alpha=0.05, seed=0):
    r = np.random.default_rng(seed)
    n = len(y_true)
    scores = []
    for _ in range(n_boot):
        idx = r.integers(0, n, n)
        scores.append(metric(y_true[idx], y_pred[idx]))
    lo, hi = np.quantile(scores, [alpha / 2, 1 - alpha / 2])
    return lo, hi

acc = lambda a, b: (a == b).mean()
y = rng.integers(0, 2, 400)
p = np.where(rng.random(400) < 0.8, y, 1 - y)  # ~80% accurate predictor
print(bootstrap_ci(y, p, acc))

# Paired bootstrap: is model B better than model A on the same examples?
def paired_bootstrap(y, pa, pb, n_boot=2000, seed=0):
    r = np.random.default_rng(seed)
    n = len(y); wins = 0
    for _ in range(n_boot):
        idx = r.integers(0, n, n)
        wins += (pb[idx] == y[idx]).mean() > (pa[idx] == y[idx]).mean()
    return wins / n_boot   # fraction of resamples where B beats A

# McNemar test on disagreement counts
from statsmodels.stats.contingency_tables import mcnemar  # requires statsmodels
# table = [[both_right, a_right_b_wrong], [a_wrong_b_right, both_wrong]]
# print(mcnemar(table, exact=True).pvalue)

# Two-sample t-test (independent samples)
a = rng.normal(0, 1, 100); b = rng.normal(0.3, 1, 100)
print(stats.ttest_ind(a, b, equal_var=False).pvalue)
```

## Tradeoffs

- Frequentist tests are simple but answer an indirect question; Bayesian posteriors are interpretable but need priors.
- Bootstrap is assumption-light but assumes i.i.d. samples; for grouped or temporal data resample groups/blocks.

## Failure modes

- Reporting a single test score without an interval on a small test set.
- Selecting the best of many runs/seeds and reporting it as the expected performance.
- Ignoring class imbalance base rates when interpreting precision.
- Treating correlated examples (same user, same document) as independent -- intervals too narrow.

## Production notes

- A/B tests for models: fix sample size and metric before launch; avoid peeking or use sequential methods.
- Track calibration (reliability diagrams) when probabilities feed decisions.
- Monitor distribution shift with simple statistics (PSI, KS test) on key features.

## Interview questions

1. **Why does minimizing MSE correspond to MLE?** Under Gaussian noise with fixed variance, the log-likelihood is a negative scaled sum of squared residuals.
2. **MLE vs MAP?** MAP adds a log-prior term; with Gaussian prior it equals L2-regularized MLE.
3. **What does a p-value of 0.03 mean?** If $H_0$ were true, data this extreme would occur about 3% of the time. It is not P($H_0$).
4. **Explain bias-variance.** Expected error splits into squared bias, variance, and noise; model complexity trades the first two.
5. **How to tell if model B beats A?** Paired test on the same test set (McNemar or paired bootstrap), with a CI on the difference.
6. **Why is zero covariance not independence?** $Y = X^2$ with symmetric $X$ has zero covariance but is fully dependent.
7. **What is the CLT's practical use?** Justifies normal-approximation CIs for means and metrics like accuracy.

## Related

- [[Linear-and-Logistic-Regression]]
- [[Evaluation-Metrics-ML]]
- [[Overfitting-and-Regularization]]
- [[Cross-Validation-and-Model-Selection]]
