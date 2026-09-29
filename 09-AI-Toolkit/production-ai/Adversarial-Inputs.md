---
title: Adversarial Inputs
description: Inputs crafted to make ML and LLM systems misbehave - evasion examples, jailbreaks, obfuscation, resource exhaustion, and data poisoning - with defenses.
domain: ai
category: production-ai
type: concept
difficulty: advanced
status: evergreen
tags: [ml, llm, security, adversarial, robustness, jailbreak]
prerequisites: [Neural-Networks-and-Backprop, Prompt-Injection]
related: [Guardrails, AI-Security-Checklist, Overfitting-and-Regularization, LLM-Evaluation-Pipelines]
order: 60
---

# Adversarial Inputs

Hub: [[AI-Engineering-Index]]

## Core Idea

Models learn statistical shortcuts, not rules, so an attacker can search for inputs that land in the model's blind spots. Adversarial inputs span classic ML (tiny perturbations that flip a classifier) and LLM systems (jailbreaks, obfuscated instructions, inputs that exhaust resources). [[Prompt-Injection]] is the LLM-specific case where the goal is hijacking application behavior; this note covers the broader family.

## Taxonomy

| Attack | Stage | Goal | Example |
|---|---|---|---|
| Evasion (adversarial example) | Inference | Misclassification | Perturbed image or text that flips a spam/malware classifier |
| Jailbreak | Inference | Bypass safety policy | Role-play framing, many-shot examples, persona tricks |
| Obfuscation | Inference | Evade filters | Base64, homoglyphs, zero-width chars, other languages, split tokens |
| Multimodal | Inference | Hidden instructions | Text in images, adversarial audio |
| Resource exhaustion | Inference | Cost/availability | Inputs that trigger maximum-length outputs or agent loops |
| Data poisoning | Training / RAG index | Implant behavior | Malicious docs in the corpus, backdoor trigger phrases |
| Model extraction | Inference | Steal model behavior | Many queries to train a copy |
| Membership inference | Inference | Privacy | Determine if a record was in training data |

## How evasion works (classic ML)

For a differentiable model with loss $L(\theta, x, y)$, the Fast Gradient Sign Method perturbs the input in the direction that increases loss:
$x_{adv} = x + \epsilon\cdot \text{sign}(\nabla_x L(\theta, x, y))$

Small $\epsilon$ can change predictions while being imperceptible to humans. Defenses: adversarial training (train on such examples), input preprocessing, ensembles, certified robustness methods for small perturbation radii. None is complete.

## Python code: FGSM on logistic regression (NumPy)

```python
import numpy as np

def sigmoid(z): return 1 / (1 + np.exp(-z))

def fgsm_logreg(w, b, x, y, eps):
    """Binary logistic regression; y in {0,1}. dL/dx = (sigmoid(w.x+b) - y) * w"""
    grad_x = (sigmoid(w @ x + b) - y) * w
    return x + eps * np.sign(grad_x)

rng = np.random.default_rng(1)
w, b = rng.normal(size=20), 0.0
x = rng.normal(size=20)
y = int(sigmoid(w @ x + b) > 0.5)          # use the model's own label
for eps in (0.0, 0.1, 0.3):
    p = sigmoid(w @ fgsm_logreg(w, b, x, y, eps) + b)
    print(eps, round(float(p), 3), "flipped" if int(p > 0.5) != y else "same")
```

## Normalizing obfuscated text before filters

```python
import unicodedata, re

ZERO_WIDTH = re.compile(r"[​-‏⁠﻿]")

def normalize(text: str) -> str:
    text = unicodedata.normalize("NFKC", text)   # folds many compatibility/fullwidth forms
    text = ZERO_WIDTH.sub("", text)
    return text.casefold()
```

NFKC does not map all homoglyphs (e.g. Cyrillic letters resembling Latin ones); use a confusables mapping if that matters.

## Defenses for LLM systems

- Normalize input before any filter; filter in multiple languages; decode obvious encodings.
- Cap input length, output tokens, agent steps and per-user spend.
- Layer [[Guardrails]]: input classifier, output classifier, deterministic action policy.
- Red-team continuously; turn successful attacks into regression tests ([[LLM-Evaluation-Pipelines]]).
- For RAG, control who can write to indexed sources; track document provenance; review high-impact documents.
- Rate-limit and monitor query patterns to slow extraction attempts.

## Tradeoffs

- Adversarial training can reduce clean accuracy and is costly.
- Stricter filters raise false positives on legitimate users (security researchers, non-English speakers).
- No defense is complete; the goal is raising cost for attackers and limiting impact.

## Failure modes

- Filtering raw text while the model reads normalized/decoded text.
- Evaluating robustness only against known public jailbreaks.
- Trusting internal wikis/docs as clean sources for RAG.
- Ignoring cost-based attacks because "nothing unsafe was output".

## Security implications

Include adversarial ML in threat models ([[Threat-Modeling-STRIDE]]): tampering (poisoning), information disclosure (extraction, membership inference), denial of service (resource exhaustion). Frameworks such as MITRE ATLAS catalog adversarial ML techniques.

## Interview questions

1. **What is an adversarial example?** An input with small, targeted changes that cause a model to err while looking normal to humans.
2. **Explain FGSM.** Step the input by epsilon in the sign of the loss gradient w.r.t. the input.
3. **Jailbreak vs prompt injection?** Jailbreak bypasses the model's safety policy; injection hijacks the application's intended behavior via untrusted input.
4. **What is data poisoning in RAG?** Planting malicious or false documents in the retrieval corpus to steer answers.
5. **Why normalize Unicode before filtering?** Obfuscation via homoglyphs, fullwidth characters and zero-width characters evades naive string matching.
6. **Does adversarial training solve robustness?** It helps against the attacks trained on, at a cost; it does not generalize to all attacks.

## Related

[[Prompt-Injection]] · [[Guardrails]] · [[AI-Security-Checklist]] · [[Neural-Networks-and-Backprop]]
