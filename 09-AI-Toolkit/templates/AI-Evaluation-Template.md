---
title: AI Evaluation Template
description: Fill-in evaluation plan and report for an LLM system change - datasets, metrics, scorers, baseline comparison, and decision.
domain: ai
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [template, evaluation, llm]
prerequisites: [LLM-Evaluation-Framework]
related: [LLM-Evaluation-Pipelines, AI-Project-Template, Model-Comparison-Template]
order: 20
---

# AI Evaluation Template

Hub: [[AI-Engineering-Index]]

What to measure: [[LLM-Evaluation-Framework]]. How to automate: [[LLM-Evaluation-Pipelines]].

## 1. Change under test

- **System / feature:** `<name>`
- **Baseline:** `<model + prompt version + retrieval config>`
- **Candidate:** `<what changed>`
- **Hypothesis:** `<expected effect>`
- **Date / author:** `<date>` / `<name>`

## 2. Datasets

| Dataset | Version | Size | Source | Purpose |
|---|---|---|---|---|
| Golden | `<v>` | `<n>` | `<source>` | representative quality |
| Regression | `<v>` | `<n>` | production bugs | must not regress |
| Adversarial | `<v>` | `<n>` | red team | safety/injection |
| Unanswerable | `<v>` | `<n>` | `<source>` | abstention |

Contamination check: `<confirm examples are not in prompts/few-shot>`

## 3. Metrics and scorers

| Metric | Scorer | Threshold / tolerance | Critical? |
|---|---|---|---|
| `<exact match / accuracy>` | deterministic | `<>` | `<y/n>` |
| `<schema validity>` | validator | `<100%>` | yes |
| `<faithfulness>` | `<LLM judge v?, calibrated on n human labels>` | `<>` | `<>` |
| `<latency p95>` | traces | `<>` | `<>` |
| `<cost per request>` | token logs | `<>` | `<>` |

Judge configuration: `<judge model, prompt version, temperature>`

## 4. Protocol

- Samples per case: `<n>`
- Temperature / params: `<>`
- Paired comparison on identical cases: `<yes>`
- Human review sample: `<n cases, reviewers, rubric>`

## 5. Results

| Metric | Baseline | Candidate | Delta | Pass? |
|---|---|---|---|---|
| `<metric>` | `<>` | `<>` | `<>` | `<>` |

Variance / noise estimate: `<>`

## 6. Error analysis

| Failure category | Count | Example IDs | Notes |
|---|---|---|---|
| `<retrieval miss>` | `<>` | `<>` | `<>` |
| `<unsupported claim>` | `<>` | `<>` | `<>` |
| `<format error>` | `<>` | `<>` | `<>` |

## 7. Decision

- **Decision:** `<ship | ship behind flag | iterate | reject>`
- **Rationale:** `<>`
- **New regression cases added:** `<ids>`
- **Follow-ups:** `<>`
