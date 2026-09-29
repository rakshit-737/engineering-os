---
title: AI ML Index
description: "Hub for machine learning and LLM concept notes."
domain: ai
category: indexes
type: index
difficulty: beginner
status: evergreen
tags: [index, ai]
prerequisites: []
related: [Home]
---

# AI ML Index

Hub for machine learning and LLM knowledge. House rule: every note answers *when would I actually use this* — theory without a decision it informs gets archived.

## Seed Notes (exist — keep Details current as the field moves)

**Foundations**
- [[Overfitting-and-Regularization]] — the central tension of all ML
- [[Evaluation-Metrics-ML]] — precision/recall/F1/AUC and when accuracy lies
- [[Embeddings]] — meaning as geometry; powers search, RAG, clustering

**Transformers & LLMs**
- [[Transformer-Architecture]] — the stack behind every modern LLM
- [[Attention-Mechanism]] — softmax(QKᵀ/√d)V, explained until it's obvious
- [[LLM-Prompt-Engineering]] — the cheapest capability lever

**Applied Decisions**
- [[Fine-Tuning-vs-Prompting]] — the build-vs-buy decision of LLM work
- [[RAG-Retrieval-Augmented-Generation]] — grounding LLMs in your data

## Planned Notes (not yet written; link once created)

- Gradient-Descent-and-Backprop — how models actually learn
- Tokenization — why LLMs can't spell and other artifacts
- LoRA-and-PEFT — fine-tuning without the GPU bill
- LLM-Agents-and-Tool-Use — loops, tools, and where they fail
- Vector-Databases — ANN indexes (HNSW), filtering, hybrid search

## Toolkit Companions

Concepts live here; working process lives in `09-AI-Toolkit/`:
- Prompting technique catalog: `Prompt-Engineering-Guide.md`
- RAG pipeline + failure modes: `RAG-Playbook.md`
- Eval before you ship: `LLM-Evaluation-Framework.md`
- Model selection: `Model-Comparison-Template.md`

## Practice Loop (per concept)

1. Learn → fill the note's Details section same day
2. Reproduce the core idea in a notebook or 20-line script
3. Connect it to one applied decision (which project would use this, and why)
4. Add one failure mode: how does this break in practice?
5. Compress to one line in Core Idea — can't compress, don't own it yet

Back to [[Home]]
