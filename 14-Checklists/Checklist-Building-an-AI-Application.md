---
title: "Checklist: Building an AI Application"
description: "Checklist for shipping LLM-powered features: scoping, data, prompts, evaluation, safety, cost, and operations."
domain: checklists
category: ai
type: checklist
difficulty: intermediate
status: evergreen
tags: [ai, llm, evaluation]
prerequisites: []
related: [Pattern-LLM-Gateway, Pattern-RAG-with-Citations, Pattern-LLM-as-Judge]
order: 60
---
# Checklist: Building an AI Application

For features where an LLM is in the loop. Dedicated checklists for RAG systems, agent design, and AI security are owned by the AI toolkit notes (see [[Checklists-Index]]).

## Scope

- [ ] Write the task as input -> output with 5 real examples, including 2 hard ones.
- [ ] Confirm a non-LLM solution (rules, search, classic ML) is not good enough; write down why.
- [ ] Define what a wrong answer costs and whether a human reviews outputs before they take effect.
- [ ] Pick the success metric (e.g. task accuracy on an eval set, not "looks good").

## Data

- [ ] Build an evaluation set of at least a few dozen labeled cases before prompt tuning, and keep it out of prompts.
- [ ] Classify data sent to the model and confirm the provider's terms allow it.
- [ ] Redact or pseudonymize PII that the task does not need.
- [ ] For retrieval, enforce document-level permissions at query time ([[Pattern-RAG-with-Citations]]).

## Build

- [ ] Route all model calls through one client or gateway with timeouts and logging ([[Pattern-LLM-Gateway]]).
- [ ] Version prompts in git alongside code.
- [ ] Request structured output (JSON schema) and validate it with a parser; retry or fail on invalid output.
- [ ] Set `max_tokens` and a total request deadline on every call.
- [ ] Add a fallback for provider failure (another model, cached answer, or graceful error).
- [ ] Ground factual answers in sources and show citations to users.

## Evaluate

- [ ] Run the eval set in CI on every prompt or model change and compare to the stored baseline.
- [ ] Use an LLM judge only after measuring its agreement with human labels ([[Pattern-LLM-as-Judge]]).
- [ ] Test adversarial inputs: prompt injection in user input and in retrieved documents.
- [ ] Test empty, very long, multilingual, and off-topic inputs.
- [ ] Track cost per request and latency p50/p95 on the eval run.

## Safety and security

- [ ] Treat model output as untrusted: escape before rendering, never execute it directly.
- [ ] Give tools least privilege and require confirmation for irreversible actions.
- [ ] Separate system instructions from user and retrieved content with clear delimiters.
- [ ] Rate-limit per user and cap spend per user and per day.
- [ ] Keep provider API keys server-side only.

## Operate

- [ ] Log model, prompt version, token counts, latency, and outcome per request (with a content retention policy).
- [ ] Collect user feedback (thumbs up/down with reason) and review it weekly.
- [ ] Alert on error rate, latency, and daily spend thresholds.
- [ ] Pin model versions and re-run evals before upgrading.
- [ ] Document known failure modes in the README or user-facing help.

Back to [[Checklists-Index]].
