---
title: Model Comparison Template
description: Fill-in template for choosing an LLM for a specific task on your own eval set - quality floor, failure types, cost, latency, rollout.
domain: ai
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [template, model-selection, evaluation, cost, llm]
prerequisites: [LLM-Evaluation-Framework]
related: [AI-Evaluation-Template, LLM-Cost-Optimization, LLM-Latency-Optimization, AI-Project-Template, AI-App-Launch-Checklist]
order: 30
---

# Model Comparison Template

Hub: [[AI-Engineering-Index]]

Structured template for choosing a model for a specific task. Rule one: compare on *your* task with *your* prompts — leaderboard rank does not transfer. Run every candidate through the same eval set (see [[LLM-Evaluation-Framework]]) before filling the table.

## Use Case

- **Task**: <one sentence — e.g., "summarize support tickets into 3-bullet handoff notes">
- **Volume**: <requests/day, avg input + output tokens>
- **Constraints**: budget ceiling ($/month), latency target (p95), context length needed, deployment (API / self-hosted / on-device), data-privacy requirements
- **Eval set**: <link/path — N cases, scoring method>

## Comparison Table

One row per (model, task) pair. Quality score = pass rate on your eval set, not a public benchmark.

| Task | Model | Latency p95 | Cost /1M in | Cost /1M out | Quality (eval pass) | Failure notes |
|---|---|---:|---:|---:|---:|---|
| | | | | | | |

### Filled example

Task: ticket summarization, 48-case eval, rubric-scored. (Prices/latencies illustrative — always use current pricing pages and your own measurements.)

| Task | Model | Latency p95 | Cost /1M in | Cost /1M out | Quality (eval pass) | Failure notes |
|---|---|---:|---:|---:|---:|---|
| Ticket summary | Large frontier model | 4.8s | $3.00 | $15.00 | 46/48 | 2 fails: over-long on multi-issue tickets |
| Ticket summary | Mid-tier model | 1.9s | $0.80 | $4.00 | 44/48 | Drops customer sentiment on angry tickets (3 cases); 1 format fail |
| Ticket summary | Small/fast model | 0.7s | $0.15 | $0.60 | 36/48 | Merges distinct issues into one bullet; hallucinated an order ID (case 31) |

Per-task rows matter: the same three models often rank differently on a second task (e.g., the small model may win outright on classification).

## Decision Criteria

Apply in order:

1. **Quality floor first.** Eliminate any model below the minimum acceptable eval score. A model that fails the task is not "cheaper" — it is broken at any price.
2. **Failure *type* over failure count.** 44/48 with format fails (catchable, retryable) beats 46/48 with hallucinated facts (silent, ships to users). Read the failure notes before comparing scores.
3. **Then cheapest/fastest that clears the bar.** Compute real monthly cost from token volumes: `(input_tokens/1M × price_per_1M_in + output_tokens/1M × price_per_1M_out) × requests` (prices are quoted per 1M tokens — don't forget the division). Output tokens usually dominate for generative tasks.
4. **Consider routing.** If the small model passes on 75% of traffic, route easy cases to it and hard cases (detected by input features or a classifier) to the large one — often the best cost/quality point isn't a single model.
5. **Margin for change.** Prefer a model with headroom above the quality floor; a model exactly at the bar regresses below it on the next prompt or traffic shift.

Example decision from the table above: mid-tier model, with an added rubric criterion for sentiment retention and one prompt iteration to fix the 3 sentiment cases; falls back to the frontier model for tickets over 2k tokens. Reevaluate quarterly or on any provider model update.

## Non-Score Factors

Worth a line each in the decision record even though they don't fit the table:

- **Context window**: does it fit your largest real input with headroom, not just the average?
- **Structured output / tool-call support**: native JSON or tool-schema modes remove a whole class of format failures
- **Rate limits and availability SLA** at your peak traffic
- **Data handling**: retention policy, training-on-your-data opt-out, region requirements
- **Deprecation cadence**: how often the provider retires model versions, and whether you can pin one

## Cost Calculator

```python
def monthly_cost(req_per_day, in_tok, out_tok, price_in_per_1m, price_out_per_1m, days=30):
    per_req = in_tok / 1e6 * price_in_per_1m + out_tok / 1e6 * price_out_per_1m
    return per_req * req_per_day * days

# fill with YOUR measured token counts and CURRENT provider prices
print(round(monthly_cost(req_per_day=10_000, in_tok=1_200, out_tok=150,
                         price_in_per_1m=0.80, price_out_per_1m=4.00), 2))
```

## Common Pitfalls

- **Comparing on different prompts.** Each model gets the *same* prompt, or each gets its own best-tuned prompt — but be consistent and say which. A tuned prompt on model A vs. a default prompt on model B measures your tuning effort, not the models.
- **Single-run latency numbers.** Latency varies with load and output length; measure p95 over the full eval set at realistic output lengths, not one warm request.
- **Ignoring output-length differences in cost.** A "cheaper per token" model that writes 2x longer answers can cost more per request. Compare cost per *request* from measured token counts.
- **Testing at temperature 0 only, deploying above it.** Evaluate with production sampling settings, multiple runs per case if temperature > 0.
- **One aggregate score across tasks.** Keep per-task rows; averaging a coding score with a summarization score produces a number that predicts nothing.

## Decision Record

- **Date**: <YYYY-MM-DD>
- **Owner**: <name>

- **Chosen**: <model + prompt version>
- **Why**: <2–3 sentences tied to the criteria above>
- **Rejected because**: <one line per rejected candidate>
- **Cost projection**: <$/month at expected volume>

## Rollout Plan

- Shadow mode or small % traffic first; compare live outputs against incumbent on sampled cases
- Keep the previous model configured as instant fallback
- Full cutover only after live metrics match eval predictions

## Monitoring Plan

- Track eval pass rate on a weekly sampled-traffic slice (models and traffic both drift)
- Alert on: format-failure rate, refusal rate, latency p95, cost/day vs. projection
- Provider model updates = rerun the full comparison eval before accepting the new version

## Related

- [[LLM-Evaluation-Framework]]
- [[AI-Evaluation-Template]]
- [[LLM-Cost-Optimization]]
- [[LLM-Latency-Optimization]]
- [[LLM-Inference-and-Serving]]
- [[AI-App-Launch-Checklist]]
