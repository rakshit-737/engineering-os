# RAG Playbook

## Architecture

1. Data ingestion
2. Chunking and metadata
3. Embedding generation
4. Vector store indexing
5. Retriever strategy
6. Prompt assembly
7. Response generation
8. Evaluation loop

## Implementation Checklist

- [ ] Corpus quality verified
- [ ] Chunk size tuned by task
- [ ] Metadata added (source/date/topic)
- [ ] Hybrid retrieval tested (BM25 + vector)
- [ ] Citation grounding enabled
- [ ] Hallucination guardrails added

## Evaluation Dimensions

- Retrieval precision@k
- Context relevance
- Answer faithfulness
- Answer completeness
- Latency and cost