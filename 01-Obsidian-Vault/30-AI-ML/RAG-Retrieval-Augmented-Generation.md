---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# RAG Retrieval Augmented Generation

Hub: [[AI-ML-Index]]

## Core Idea

RAG bolts a search engine onto an LLM: at query time, retrieve the most relevant chunks from a knowledge store, inject them into the prompt, and instruct the model to answer *from that context*. It grounds generation in sources the model never trained on — private docs, fresh data — cutting hallucination and enabling citations, all without touching model weights. It solves a knowledge problem, not a behavior problem (that's [[Fine-Tuning-vs-Prompting]]).

## Details

Pipeline (two phases):

```text
Ingest (offline):  docs → clean → chunk → embed → vector index (+ metadata)
Query  (online):   question → embed → top-k similarity search
                   → (rerank) → stuff chunks into prompt → generate with citations
```

```python
# Query-time skeleton
q_vec = embed(question)
chunks = index.search(q_vec, k=20)                 # fast bi-encoder recall
chunks = rerank(question, chunks)[:5]              # cross-encoder precision
prompt = f"Answer ONLY from the sources below; cite [n]. " \
         f"If the answer is not present, say so.\n" + format(chunks) + question
```

Chunking strategies (the highest-leverage design choice):
- **Fixed-size with overlap** (e.g. 300–800 tokens, 10–20% overlap): dumb, robust baseline; overlap stops facts being split across boundaries.
- **Structure-aware**: split on headings/paragraphs/functions so chunks are self-contained thoughts — usually the best quality-per-effort for docs and code.
- **Small-to-large / parent-document**: retrieve on small chunks (precise matching) but feed the surrounding larger section to the LLM (full context).
- Attach metadata (title, section, date, source path) for filtering and citations; prepend the doc title to each chunk so it's interpretable standalone.
- Too small → fragments without context; too large → diluted embeddings and wasted window.

Retrieval quality upgrades, in rough order of value:
1. **Hybrid search**: dense vectors + BM25 keyword, fused (RRF) — vectors miss exact IDs, error codes, and names that keyword search nails.
2. **Reranking**: over-retrieve k=20–50 cheaply, rerank with a cross-encoder to top 3–5.
3. **Query transformation**: rewrite conversational queries standalone; HyDE (embed a hypothetical answer) for short vague queries.
4. Metadata filtering (tenant, date, doctype) *before* similarity search — also the access-control enforcement point.

Evaluation — measure the two stages separately:
- **Retrieval**: recall@k / MRR against a labeled set of (question → gold chunk) pairs. If the right chunk never arrives, generation cannot save you.
- **Generation**: faithfulness (claims supported by context?) and answer relevance — scored by LLM-as-judge with human spot-checks (frameworks: RAGAS or a custom harness). See [[Evaluation-Metrics-ML]].

Pitfalls:
- Garbage in, garbage retrieved: bad PDF extraction/OCR poisons everything downstream.
- Stale index — re-embed on doc changes; embeddings from different model versions can't share an index (see [[Embeddings]]).
- "Lost in the middle": don't stuff 30 chunks because the window allows it; more context ≠ better answers.
- No refusal path: without "say you don't know if it's not in the context", the model answers from priors and hallucinates confidently.
- **Indirect prompt injection**: retrieved documents can contain adversarial instructions; treat retrieved text as data, never as instructions.

Full local pipeline detail: `09-AI-Toolkit/RAG-Playbook.md`.

## Interview Angle

- The standard design question: "build Q&A over company docs." Walk the pipeline end to end, but *lead with the decision*: RAG over fine-tuning because docs change, you need citations, and per-user access control must be enforced at retrieval time.
- Expect "your RAG gives wrong answers — debug it." Answer stage by stage: check retrieval first (is the gold chunk in top-k?) → chunking → hybrid search/reranker → then prompt/faithfulness. Debugging by stages is the signal interviewers want.
- Know your chunking answer cold: what size, why overlap, when structure-aware — this is the most common deep-dive.
- Name the bi-encoder recall / cross-encoder precision split for retrieve-then-rerank; it shows systems thinking.
- For security roles: retrieval-time ACL filtering (never let the index leak across tenants) and injection via poisoned documents are strong differentiating points.

## Related

- [[Embeddings]]
- [[LLM-Prompt-Engineering]]
- [[Fine-Tuning-vs-Prompting]]
- [[Evaluation-Metrics-ML]]
- [[Least-Privilege]]
