---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# Embeddings

Hub: [[AI-ML-Index]]

## Core Idea

An embedding maps a discrete object (word, sentence, image, user) to a dense float vector — typically 256 to 3072 dims — such that semantic similarity becomes geometric closeness. They are learned, not hand-designed: a model trained on co-occurrence or contrastive objectives places related things near each other. Embeddings are the interface between raw content and math: once everything is a vector, search, clustering, and classification become geometry.

## Details

- **Token embeddings**: a lookup table of shape (vocab_size, d_model), row per token id; the first layer of every transformer. Trained end-to-end with the rest of the network.
- **Sentence/document embeddings**: a dedicated model (e.g. contrastively trained bi-encoder) pools token states into one vector per text. This is what RAG and semantic search use — do not average raw LLM token embeddings and expect good retrieval.
- **Training signal**: contrastive learning — pull (query, relevant doc) pairs together, push random negatives apart. Quality depends heavily on the pair data, which is why domain mismatch (e.g. legal or code text on a web-trained model) degrades retrieval.

Similarity math:

```python
import numpy as np

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

# If vectors are L2-normalized, cosine == dot product,
# and ranking by dot product == ranking by Euclidean distance:
# ||a-b||^2 = 2 - 2*(a@b)  when ||a||=||b||=1
```

Cosine measures angle only, ignoring magnitude — right for text, where vector length often tracks frequency/length rather than meaning. Most embedding APIs return pre-normalized vectors so a plain dot product suffices; know which your model does before picking a vector-DB metric.

Worked example — semantic search over notes:
1. Embed every note chunk once, store (vector, text) pairs.
2. Embed the query "how do I stop my model memorizing training data".
3. Rank by cosine; the overfitting note surfaces even though it never contains the word "memorizing" — keyword search would miss it, embedding search matches meaning.

Scaling and pitfalls:
- Exact top-k over N vectors is O(N·d) per query. Beyond ~1M vectors use ANN indexes (HNSW, IVF) trading a little recall for large speedups.
- **Anisotropy**: raw model vectors can bunch into a narrow cone, so *everything* has cosine ~0.8. Compare similarities relatively, never against an absolute threshold from another model.
- Embeddings from different models (or versions) live in incompatible spaces — never mix them in one index; re-embed the corpus on model upgrade.
- Long inputs get truncated at the embedding model's own token limit and pooling dilutes meaning — chunk first (see [[RAG-Retrieval-Augmented-Generation]]).
- Embeddings inherit training-data bias, and vectors can partially reconstruct the original text — treat a vector store with the same access control as the documents themselves.

## Interview Angle

- Standard probe: "why cosine over Euclidean for text?" — magnitude carries little semantic signal; and state the normalized-vector equivalence (cosine = dot = monotone in Euclidean) to show you know when the choice stops mattering.
- "How does semantic search work end to end?" — embed corpus offline, embed query online, ANN top-k, optionally rerank with a cross-encoder. Name the bi-encoder (fast, separate encodings) vs cross-encoder (accurate, joint encoding, O(N) per query) tradeoff — that split is a favorite follow-up.
- "Word2Vec vs contextual embeddings?" — static: one vector per word ("bank" is one point); contextual: vector depends on the sentence. Transformers made embeddings contextual.
- The king − man + woman ≈ queen analogy shows linear structure in the space; use it as intuition, and note it is a property of the training objective, not magic.
- Practical question for AI-eng roles: "your retrieval quality is bad — what do you check?" — chunking, domain mismatch of the embedding model, metric mismatch with the index, missing reranker, stale index after re-embedding.

## Related

- [[Attention-Mechanism]]
- [[RAG-Retrieval-Augmented-Generation]]
- [[Transformer-Architecture]]
- [[Hash-Tables]]
