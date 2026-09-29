---
title: "Project Template: AI"
description: Project template additions and three scoped project ideas for LLM and ML applications.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [ai, llm, project]
prerequisites: [Project-Template]
related: [Pattern-LLM-Gateway, Pattern-RAG-with-Citations, Checklist-Building-an-AI-Application]
order: 20
---
# Project Template: AI

For projects where a model (LLM or classic ML) is a core component. Follow [[Checklist-Building-an-AI-Application]].

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **Task definition:** input -> output contract with 5 real examples and the cost of a wrong answer
- **Evaluation:** eval set, metrics, baseline (including a non-LLM baseline), and how results are regenerated
- **Model and prompt versions:** pinned model IDs and versioned prompts
- **Data handling:** what data reaches which provider, retention, and redaction
- **Cost and latency budget:** per-request token cap, total deadline, daily spend cap

## Extra requirements

- [ ] Eval set checked in and run in CI on every prompt/model change.
- [ ] Structured outputs validated with a schema.
- [ ] Prompt-injection test cases in the eval set.
- [ ] Per-request logging of model, prompt version, tokens, latency.
- [ ] Documented failure modes in the README.

## Project ideas

### 1. Cited Q&A over your own notes

- **Target level:** Level 3
- **Scope:** Question answering over this Markdown vault with source citations and refusal when unsupported.
- **Stack:** Python, FastAPI, SQLite FTS5 + a vector index, one LLM API
- **Milestones:**
  1. Chunk and index the vault; keyword search baseline
  2. Add vectors + reranking; build 50-question eval set
  3. Citation validation per [[Pattern-RAG-with-Citations]]
  4. CI eval gate + deploy
- **What makes it stand out:** Measured retrieval and faithfulness scores against a keyword baseline, not a demo video.

### 2. LLM gateway with budgets

- **Target level:** Level 3
- **Scope:** Self-hosted gateway that proxies chat requests with per-app keys, budgets, redaction, and fallback.
- **Stack:** Python/FastAPI or Go, Redis for counters, Prometheus metrics
- **Milestones:**
  1. Proxy one provider with per-app auth
  2. Token budgets and rate limits
  3. Fallback chain and circuit breaker
  4. Dashboards and load test
- **What makes it stand out:** Platform-engineering framing of AI ([[Pattern-LLM-Gateway]]); shows reliability and security thinking.

### 3. Log anomaly triage assistant

- **Target level:** Level 2
- **Scope:** Cluster application logs and have an LLM summarize each new cluster with suggested next steps.
- **Stack:** Python, scikit-learn or Drain3 log parsing, one LLM API, Streamlit UI
- **Milestones:**
  1. Parse and template logs
  2. Cluster and detect new templates
  3. LLM summaries with structured output
  4. Human-labeled evaluation of summaries
- **What makes it stand out:** Combines classic ML and LLMs, with a clear evaluation of usefulness.

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
