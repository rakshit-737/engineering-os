---
title: Roadmap -- AI Engineer
description: Path to AI engineering roles that build LLM-powered products -- prompting, RAG, evaluation, tools/agents and production concerns.
domain: career
category: roadmaps
type: roadmap
role: "AI Engineer"
difficulty: intermediate
status: evergreen
tags: [llm, rag, ai-engineering]
related: [AI-ML-Index, RAG-Playbook, LLM-Evaluation-Framework]
order: 80
---

# Roadmap -- AI Engineer

**What the role does:** builds applications on top of foundation models: prompt design, retrieval, tool use, evaluation, cost/latency optimization and safe deployment. Strong software engineering is assumed.

## Stage 1 -- Foundation
- [ ] Python fluency, async, typing, testing ([[Python-Stdlib-Cheat-Sheet]])
- [ ] APIs and backend basics ([[Roadmap-Software-Engineer]] stages 1-2)
- [ ] ML basics: train/test split, overfitting, metrics ([[Overfitting-and-Regularization]], [[Evaluation-Metrics-ML]])

## Stage 2 -- Core
- [ ] Transformers and attention at a conceptual level ([[Transformer-Architecture]], [[Attention-Mechanism]])
- [ ] Prompt engineering and structured outputs ([[LLM-Prompt-Engineering]], [[Prompt-Engineering-Guide]])
- [ ] Embeddings and vector search ([[Embeddings]])
- [ ] RAG: chunking, retrieval, reranking, citations ([[RAG-Retrieval-Augmented-Generation]], [[RAG-Playbook]])
- [ ] Tool/function calling

## Stage 3 -- Specialization
- [ ] Evaluation: golden sets, LLM-as-judge with calibration, regression tests ([[LLM-Evaluation-Framework]])
- [ ] Fine-tuning vs prompting decisions ([[Fine-Tuning-vs-Prompting]])
- [ ] Agents: planning loops, guardrails, failure handling
- [ ] Production: caching, streaming, rate limits, cost tracking, observability
- [ ] LLM security: prompt injection, data leakage ([[Roadmap-AI-Security-Engineer]])

## Stage 4 -- Job-ready
- [ ] One deployed LLM app with an eval suite and documented results
- [ ] Model comparison write-up ([[Model-Comparison-Template]])
- [ ] Coding interview readiness ([[Interview-DSA-Strategy]])

## How this differs from neighbouring roles
- vs [[Roadmap-ML-Engineer]]: you mostly consume foundation models through APIs; you rarely train. Your hard problems are retrieval quality, evaluation, latency and cost.
- vs [[Roadmap-Research-Engineer]]: you optimise a product metric, not a paper result.
- The deciding skill: proving with an eval set that a prompt/retrieval change made the system better, not just different.

## Readiness test (do these cold before applying)
- [ ] Build a RAG pipeline and report retrieval recall@k and answer accuracy on 50+ labelled questions, before and after one change.
- [ ] Estimate cost and p95 latency per request for your app and cut one of them by 30% with a measured change (caching, smaller model, shorter context).
- [ ] Demonstrate one prompt-injection attack on your own app and the mitigation that stopped it.

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Domain RAG assistant | Ingest a real document set, hybrid retrieval, citations, eval set of 50+ questions with measured retrieval and answer quality | RAG done properly, evaluation discipline |
| Tool-using agent | Agent that calls 3+ tools (search, DB, code) with guardrails, retries, logging and tests for failure paths | Agent design, reliability |
| Eval harness | Reusable harness comparing prompts/models on cost, latency and quality | Engineering rigor |

## Proof-of-skill signals
Published eval results (honest, including failures), deployed demos, clean repos.

## Interview focus
Coding, LLM app system design (RAG design, latency/cost tradeoffs), evaluation questions, project defense.

## Common traps
Demos without evals; claiming accuracy without a test set; ignoring prompt injection.

## Optional certifications
Not needed; projects and evals carry the weight.
