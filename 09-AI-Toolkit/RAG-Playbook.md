# RAG Playbook

End-to-end guide for building retrieval-augmented generation systems that answer from *your* documents instead of the model's memory. RAG quality is decided mostly at retrieval time — a perfect generator cannot fix bad context.

---

## Pipeline Overview

```
Ingest → Chunk → Embed → Index → Retrieve (hybrid + rerank) → Generate with citations → Evaluate
```

Each stage below: what it does, the key decisions, and the default that works until you have eval data saying otherwise.

---

## 1. Ingest

Convert source material (PDF, HTML, Markdown, wikis, tickets) into clean text plus metadata.

- **Extract structure, don't flatten it.** Keep headings, section paths, tables, and code blocks distinguishable — you'll need them for chunking and citations. PDF extraction is the most common silent quality killer; spot-check extracted text against the original.
- **Attach metadata at ingest**: `source`, `title`, `section_path`, `date`, `doc_type`, and any access-control tags. Retrieval filters and citations depend on this being present per-chunk later.
- **Deduplicate and version.** Near-duplicate docs (old copies, mirrored pages) poison retrieval — the top-k fills with copies of one document. Keep only the canonical/latest version, or tag versions so retrieval can filter.
- **Plan for refresh.** Decide upfront how updates flow in (re-ingest changed docs, delete stale ones). Stale indexed content produces confidently outdated answers.

## 2. Chunk

Split documents into retrievable units. The central tradeoff:

| Chunk size | Retrieval precision | Context completeness | Notes |
|---|---|---|---|
| Small (100–200 tokens) | High — embeddings stay focused on one idea | Low — answers spanning paragraphs get fragmented | Good for FAQ/definition lookup |
| Medium (300–600 tokens) | Good balance | Good for most Q&A | **Default starting point** |
| Large (800–1500 tokens) | Low — embeddings average multiple topics, matching blurs | High — full arguments intact | Good when downstream needs whole procedures |

- **Overlap**: 10–20% between adjacent chunks so sentences at boundaries aren't orphaned from their context. More overlap = more index size and more near-duplicate retrievals; beyond ~25% it hurts more than helps.
- **Split on structure first, size second.** Break at headings/paragraphs, then enforce the size cap — never mid-sentence, never splitting a table or code block from the sentence that introduces it.
- **Prepend context to each chunk**: title + section path (e.g., `"Payments API > Refunds > Partial refunds: <chunk text>"`). This single trick fixes a large share of "chunk is meaningless without its heading" retrieval misses.
- Chunk size is an eval-tunable parameter, not a constant. Re-run retrieval evals when you change it.

## 3. Embed

- Use one embedding model for the whole corpus *and* for queries — mixing models makes vectors incomparable. Re-embedding everything is the price of switching models; budget for it.
- Check the model's max input length; chunks that get silently truncated embed only their first half.
- If queries and documents look very different (short questions vs. long technical prose), prefer a model trained for asymmetric retrieval, or use the model's query/document prefixes if it defines them.
- Store the raw chunk text and metadata alongside the vector — you need the text for the prompt and the metadata for filters/citations.

## 4. Index

- Any vector store works at small scale (< ~1M chunks); choose on operational fit (managed vs. self-hosted, metadata filtering support) rather than benchmark numbers.
- **Metadata filtering must be applied at query time inside the store** (pre-filter), not by post-filtering top-k — post-filtering can leave you with 0 usable results.
- Keep a parallel keyword (BM25) index over the same chunks for hybrid retrieval; most vector DBs and search engines now support both in one system.
- Index the chunk *with* its prepended context (title/section) — that is what gets matched.

## 5. Retrieve — Hybrid + Rerank

The stage where most quality is won or lost.

1. **Hybrid retrieval**: run vector similarity and BM25 keyword search in parallel, merge (e.g., reciprocal rank fusion). Vectors catch paraphrases ("how do I get my money back" → refunds doc); BM25 catches exact identifiers, error codes, and product names that embeddings blur. Either alone has predictable blind spots.
2. **Overfetch, then rerank**: retrieve top 20–50 candidates, score each (query, chunk) pair with a cross-encoder reranker, keep the top 3–8. Rerankers read query and chunk *together* and are far more accurate than embedding distance; they're too slow to run over the whole corpus, which is why they sit after first-stage retrieval.
3. **Query transformation** (add when evals show misses): rewrite conversational queries into standalone ones (resolve "it", "that error"), and/or generate 2–3 query variants and merge results.
4. **Set a relevance floor.** If the best reranked score is below threshold, don't stuff weak context in — tell the generator (and user) that nothing relevant was found. Answering from bad context is worse than admitting a miss.

## 6. Generate with Citations

Assemble the prompt: instructions + retrieved chunks (each tagged with an ID) + the user question.

```
Answer the question using ONLY the sources below. Rules:
- Cite the source ID after each claim, like [S2].
- If the sources do not contain the answer, say so explicitly — do not answer from general knowledge.
- If sources conflict, present both and cite each.

[S1] (Payments API > Refunds, updated 2026-03) <chunk text>
[S2] (Billing FAQ, updated 2025-11) <chunk text>

Question: {{question}}
```

- Chunk IDs must map back to real source locations so citations are verifiable links, not decoration.
- Order chunks by rerank score; put the strongest first.
- Validate cited IDs programmatically after generation: every `[Sn]` in the answer must exist in the provided set. Reject/retry on violation — this catches hallucinated citations mechanically.

---

## Failure Modes and Fixes

| Failure | Symptom | Root causes | Fixes |
|---|---|---|---|
| **Retrieval miss** | "I don't have information on that" (but the doc exists), or answer from wrong doc | Vocabulary mismatch between query and doc; chunk lost its heading context; answer split across chunks; doc never ingested; metadata filter too strict | Hybrid retrieval (BM25 catches exact terms); prepend section context to chunks; increase overlap or chunk size; query rewriting; audit ingest coverage |
| **Context stuffing** | Answers get vaguer as k grows; model latches onto an irrelevant chunk; cost/latency climb | Too-high k with no reranker; no relevance floor; near-duplicate chunks crowding out diverse ones | Rerank and keep only top 3–8; set a score threshold; deduplicate at ingest; smaller k beats bigger k once a reranker is in place |
| **Hallucinated citation** | Answer cites [S4] but the claim isn't in S4, or cites a source ID that wasn't provided | Model blends parametric knowledge with sources; weak grounding instructions; context so long the model loses track of which source said what | Programmatic citation-ID validation; "answer ONLY from sources" instruction with explicit refusal path; per-claim citation requirement; faithfulness eval (below) to measure it |
| **Confidently stale answer** | Correct-sounding answer from an outdated doc | Old versions still indexed; no date metadata | Version-aware ingest, delete/supersede stale chunks, surface doc dates in citations |
| **Lost in conversation** | First question works, follow-ups retrieve garbage | Follow-up queries ("what about the second one?") are meaningless standalone | Query rewriting step that resolves references using chat history before retrieval |

---

## Evaluation

Evaluate retrieval and generation **separately** — an end-to-end score can't tell you which stage to fix.

### Retrieval: hit rate (and friends)

Build a set of 30–100 questions with labeled relevant chunks/docs (annotate manually, or generate questions *from* known chunks so the source is the label).

- **Hit rate @ k**: fraction of questions where at least one relevant chunk appears in the top k. The single most useful retrieval number — if the answer isn't in the context, nothing downstream matters. Target > 0.9 at your production k.
- **Precision @ k / MRR**: how much of the context is relevant, and how high the first relevant chunk ranks. Watch these when tuning k and the reranker.
- Tune one variable at a time against this set: chunk size, overlap, hybrid weights, k, reranker on/off.

### Generation: faithfulness

Measures whether the answer is actually supported by the retrieved context (the anti-hallucination metric).

- Method: decompose the answer into individual claims; for each, check whether the retrieved context supports it. Score = supported claims / total claims. Automate with an LLM judge (see `LLM-Evaluation-Framework.md` for judge caveats); spot-check the judge against human labels before trusting it.
- Also track **answer relevance** (does it address the question) and **correct refusal rate** (does it say "not in my sources" when the eval question is deliberately unanswerable — include such questions in the set).

### Regression discipline

Freeze the eval set. Re-run it on every change to chunking, embedding model, retrieval parameters, reranker, or prompt. Log per-question results, not just averages — a change that fixes 5 questions and breaks 5 others looks like "no change" in the mean but is two findings.

---

## Quick Diagnosis Cheat Sheet

Work backwards from the answer to find the failing stage:

1. **Read the retrieved context for the failing question first.** Was the answer in it?
   - Not in context → retrieval problem. Check: was the doc ingested at all? Does BM25 find it when vector search doesn't (vocabulary mismatch)? Does the chunk make sense standalone (missing heading context)?
   - In context, but answer wrong → generation problem. Check grounding instructions, context ordering, whether an irrelevant chunk distracted the model (stuffing).
2. **Log retrieval scores with every request.** A miss with high similarity scores means the *wrong* content matches well (duplicates, boilerplate); a miss with low scores means the content isn't findable (chunking/embedding issue).
3. **Replay the exact query against the retriever in isolation.** Most "RAG bugs" reproduce without the generator involved, which makes them fast to iterate on.

## When RAG Is the Wrong Tool

- **The corpus fits in the context window** (small handbook, single manual): pass the whole thing in the prompt with caching; skip the pipeline entirely. Retrieval adds failure modes — only pay for it when the corpus forces you to.
- **Questions need whole-corpus aggregation** ("how many tickets mention X", "summarize all decisions this quarter"): top-k retrieval structurally can't see everything; use a database query, map-reduce summarization, or an agentic loop instead.
- **Knowledge changes per-request** (live prices, inventory): use tool calls to the system of record, not an index that is stale by construction.

---

## Default Starting Configuration

For a first working system, before any tuning:

- Chunks: ~400 tokens, 15% overlap, split on headings, section path prepended
- Retrieval: hybrid (vector + BM25, RRF merge), overfetch 25, rerank to top 5
- Generation: citation-required prompt with explicit refusal path; programmatic citation validation
- Eval: 50-question set, hit rate @5 and faithfulness, re-run on every pipeline change
- Logging: store query, retrieved chunk IDs + scores, and final answer for every request — this log is where your next 50 eval questions come from

Tune in this order once evals exist: retrieval parameters (biggest lever) → chunking → generation prompt → embedding model (most expensive to change).
