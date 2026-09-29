---
title: AI App Launch Checklist
description: Go-live checklist for an LLM-powered feature - quality, safety, reliability, cost, observability, and rollout.
domain: ai
category: checklists
type: checklist
difficulty: intermediate
status: evergreen
tags: [llm, launch, checklist, production, mlops]
prerequisites: [LLM-Evaluation-Pipelines]
related: [AI-Security-Checklist, LLM-Observability, LLM-Cost-Optimization, RAG-System-Checklist, Agent-Design-Checklist]
order: 40
---

# AI App Launch Checklist

Hub: [[AI-Engineering-Index]]

## Product readiness

- [ ] Use case, users, and success metric defined
- [ ] Known limitations documented and shown in UI where relevant
- [ ] Users can see sources/citations for factual answers
- [ ] Feedback mechanism (thumbs, report) in place
- [ ] Clear disclosure that responses are AI-generated

## Quality

- [ ] Golden and regression sets pass release thresholds ([[LLM-Evaluation-Framework]])
- [ ] CI eval gate active on prompt/model/retrieval changes ([[LLM-Evaluation-Pipelines]])
- [ ] Hallucination and abstention behavior evaluated ([[Hallucination-Mitigation]])
- [ ] Human review of sampled outputs signed off
- [ ] Prompt, model, and index versions pinned and recorded

## Safety and security

- [ ] [[AI-Security-Checklist]] completed
- [ ] Guardrails configured and tested for false positives ([[Guardrails]])
- [ ] Privacy review done; data retention settled ([[AI-Data-Leakage-and-Privacy]])
- [ ] Red-team pass completed; findings triaged

## Reliability

- [ ] Timeouts per call and total request deadline
- [ ] Retries with exponential backoff and jitter
- [ ] Fallback model/provider tested ([[Pattern-Model-Fallback-Chain]])
- [ ] Graceful degradation message when AI path unavailable
- [ ] Load test at expected peak incl. provider rate limits
- [ ] Provider quota increases requested in advance

## Cost

- [ ] Cost per request estimated from measured token counts
- [ ] Per-user and per-tenant quotas
- [ ] Prompt caching layout applied; cache hit rate measured
- [ ] Budget alerts configured

## Observability

- [ ] Traces with prompt version, tokens, latency, cost ([[LLM-Observability]])
- [ ] Dashboards: latency p95/p99, error rate, fallback rate, cost, feedback
- [ ] Online eval sampling running
- [ ] On-call runbook covers provider outage, quality regression, injection incident

## Rollout

- [ ] Feature flag and kill switch
- [ ] Staged rollout (internal -> small % -> full)
- [ ] Rollback plan for prompt/model changes
- [ ] Post-launch review scheduled
