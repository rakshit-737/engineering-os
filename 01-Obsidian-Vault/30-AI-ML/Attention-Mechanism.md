---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# Attention Mechanism

Hub: [[AI-ML-Index]]

## Core Idea

Each token computes a relevance score against every other token, turns those scores into a probability distribution with softmax, and takes a weighted average of the other tokens' value vectors. The output for each position is a context-aware blend of the whole sequence. This is content-based lookup, not position-based: what gets mixed in depends on what the tokens *mean*, and the weights are recomputed for every input.

## Details

Scaled dot-product attention:

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) V
```

Shape walkthrough for a sequence of `n` tokens with model dim `d_model`:

| Step | Operation | Shape |
|---|---|---|
| Input embeddings | X | (n, d_model) |
| Project | Q = XW_Q, K = XW_K, V = XW_V | (n, d_k) each |
| Scores | QK^T | (n, n) |
| Scale + softmax | row-wise over n | (n, n), rows sum to 1 |
| Aggregate | scores @ V | (n, d_k) |

- **Why divide by sqrt(d_k)**: dot products of random d_k-dim vectors have variance ~d_k. Large magnitudes push softmax into saturation (near one-hot), making gradients vanish. Scaling keeps the score variance ~1.
- **Q/K/V intuition**: query = what this token is looking for; key = what this token advertises; value = what it contributes if selected. Three separate learned projections of the same input.
- **Multi-head**: run h attention ops in parallel with d_k = d_model/h each, concatenate, project back. Heads specialize (syntax, coreference, positional patterns); one head averaging everything would blur distinct relations.
- **Causal masking** (decoder-only LLMs): set scores for future positions to -inf before softmax so token i only attends to tokens ≤ i. This is what makes autoregressive generation valid.

Minimal NumPy version:

```python
def attention(Q, K, V, mask=None):
    scores = Q @ K.T / np.sqrt(K.shape[-1])   # (n, n)
    if mask is not None:
        scores = np.where(mask, scores, -1e9)
    w = softmax(scores, axis=-1)              # rows sum to 1
    return w @ V                              # (n, d_k)
```

Worked micro-example: for "The cat sat because it was tired", the query for "it" scores high against the key for "cat", so the output vector at "it" is mostly cat's value — the model resolves the pronoun in one matrix multiply.

Pitfalls:
- **O(n²) in sequence length** for both compute and memory — this is why context windows cost so much and why FlashAttention (tiling, no full n×n matrix in HBM) matters.
- Attention weights are not reliable "explanations"; high weight is not proof of causal importance.
- Attention alone is a linear mix of values — the FFN layers after it provide the per-token nonlinear processing.
- KV cache at inference: keys/values of past tokens are stored, so each new token costs O(n), but the cache dominates GPU memory for long contexts.

## Interview Angle

- Be able to write `softmax(QK^T/sqrt(d_k))V` cold and walk the shapes (n, d_model) → (n, n) → (n, d_k). Interviewers probe whether you know *why* each step exists, especially the sqrt(d_k) scaling — answer in terms of softmax saturation and gradients.
- "Why three projections instead of using X directly?" — decouples what you seek from what you offer; lets the same token match differently as searcher vs. target.
- "Self vs. cross attention?" — self: Q, K, V all from one sequence. Cross: Q from decoder, K/V from encoder (translation) or from retrieved context.
- "Complexity and how to fix it?" — O(n²·d); mention FlashAttention (exact, IO-aware), sliding-window/local attention, and grouped-query attention (fewer KV heads to shrink the cache).
- Common follow-up: explain the causal mask and why it enables training on all positions in parallel (teacher forcing) while still matching inference-time behavior.

## Related

- [[Transformer-Architecture]]
- [[Embeddings]]
- [[LLM-Prompt-Engineering]]
- [[Big-O-Notation]]
