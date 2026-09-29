---
title: RAG System Checklist
description: Phase-by-phase checklist for designing, building, evaluating and operating a retrieval-augmented generation system.
domain: ai
category: checklists
type: checklist
difficulty: intermediate
status: evergreen
tags: [rag, checklist, retrieval, production]
prerequisites: [RAG-Playbook]
related: [Chunking-Strategies, Vector-Databases, Hybrid-Search-and-Reranking, Hallucination-Mitigation, AI-Security-Checklist]
order: 10
---

# RAG System Checklist

Hub: [[AI-Engineering-Index]]

Deep guide: [[RAG-Playbook]].

## Scope and requirements

- [ ] Target questions written down with 20+ real examples, including unanswerable ones
- [ ] Decided RAG is needed (vs long context, fine-tuning, or a database query) - see [[Fine-Tuning-vs-Prompting]]
- [ ] Freshness requirement defined (how stale can indexed data be?)
- [ ] Latency and cost budget per query defined
- [ ] Access-control model for source documents identified

## Ingestion

- [ ] Source connectors handle updates and deletions, not only inserts
- [ ] Parsing verified for tables, PDFs, code, and headings
- [ ] Boilerplate, navigation, and duplicates removed
- [ ] Each chunk carries metadata: source, section, timestamp, ACL, version
- [ ] Hidden text and markup stripped or flagged (injection surface)

## Chunking and embedding

- [ ] Chunking strategy chosen and compared on eval set ([[Chunking-Strategies]])
- [ ] Embedding model chosen for domain and language ([[Embeddings]])
- [ ] Same embedding model/version for indexing and querying
- [ ] Re-embedding plan exists for model upgrades

## Retrieval

- [ ] Hybrid search (BM25 + dense) evaluated vs dense only ([[Hybrid-Search-and-Reranking]])
- [ ] Reranker evaluated for precision@k vs added latency
- [ ] ACL / tenant filters applied inside the retrieval query
- [ ] Metadata filters (date, product, language) supported
- [ ] Query rewriting/expansion tested where queries are short or conversational
- [ ] Recall@k of first stage measured separately from final precision

## Generation

- [ ] Prompt instructs answering only from context and allows abstention
- [ ] Citations required and validated against retrieved chunk IDs
- [ ] Context ordering and token budget tuned ([[Context-Windows]])
- [ ] Retrieved content delimited and treated as untrusted ([[Prompt-Injection]])
- [ ] Output format enforced where downstream code consumes it ([[Structured-Output]])

## Evaluation

- [ ] Golden set with expected sources and answers ([[LLM-Evaluation-Framework]])
- [ ] Retrieval metrics: recall@k, MRR or nDCG
- [ ] Generation metrics: faithfulness, answer relevance, abstention correctness
- [ ] Regression gate in CI ([[LLM-Evaluation-Pipelines]])
- [ ] Human review of a sample before launch

## Operations

- [ ] Traces log query, retrieved IDs, scores, prompt version ([[LLM-Observability]])
- [ ] Index freshness and ingestion failures monitored
- [ ] User feedback captured and routed to eval set
- [ ] Deletion requests propagate to index, caches, and logs ([[AI-Data-Leakage-and-Privacy]])
- [ ] Fallback behavior defined when vector DB is unavailable
