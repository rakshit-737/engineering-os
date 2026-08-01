---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# Transformer Architecture

Hub: [[AI-ML-Index]]

## Core Idea

A transformer is a stack of identical blocks — multi-head self-attention followed by a position-wise feed-forward network, each wrapped in residual connections and layer normalization. Attention mixes information *across* positions; the FFN transforms each position independently. Because no step depends on processing tokens one-at-a-time, training parallelizes over the whole sequence, which is why transformers displaced RNNs and scaled into LLMs.

## Details

Data flow for one decoder-only block (the GPT/Llama/Claude family — the current default):

```text
tokens → embedding lookup (+ positional info)
  x = x + MHA(norm(x))     # causal self-attention (pre-norm)
  x = x + FFN(norm(x))     # per-token MLP, hidden dim ~4x d_model
  ... repeat N times (N = 12 for GPT-2 small ... 80+ for large models)
→ final norm → linear to vocab logits → softmax → next-token distribution
```

Role of each part:
- **Embeddings + positions**: attention is permutation-invariant, so position must be injected — sinusoidal or learned absolute positions originally; **RoPE** (rotary embeddings, encoding *relative* position by rotating Q/K) in most modern LLMs because it extrapolates better to longer contexts.
- **Multi-head causal attention**: the only place tokens exchange information; the causal mask keeps position i blind to positions > i (see [[Attention-Mechanism]]).
- **FFN**: two linear layers with a nonlinearity (GELU/SwiGLU), ~2/3 of parameters; where per-token computation and most factual "knowledge" lives.
- **Residual connections**: gradient highway — each block learns a *refinement* of its input, making 80+ layer stacks trainable.
- **LayerNorm (pre-norm)**: normalizing *before* each sublayer (not after, as in the 2017 paper) keeps training stable at depth without warmup tricks.

Training vs inference:
- **Training**: teacher forcing — predict token t+1 at every position simultaneously; cross-entropy over the vocab; one pass computes n predictions. This parallelism is the whole ballgame.
- **Inference**: autoregressive, one token at a time; the **KV cache** stores past keys/values so each step is O(n) attention instead of recomputing O(n²). Cache memory, not compute, often bounds context length in serving.

Variants:
| Family | Attention | Use |
|---|---|---|
| Encoder-only (BERT) | bidirectional | classification, embeddings |
| Encoder–decoder (T5) | bi + cross | translation, seq-to-seq |
| **Decoder-only (GPT/Llama)** | causal | generation — won because one simple next-token objective scales over all text |

Why transformers beat RNNs — the two-part answer:
1. **Parallelism**: RNNs are sequential in the time dimension (O(n) serial steps); transformers do the whole sequence in one matrix-multiply-heavy pass that GPUs love.
2. **Long-range dependencies**: any two tokens are one attention hop apart (path length O(1)) vs O(n) steps through an RNN's bottlenecked hidden state — gradients survive.
Cost: attention is O(n²·d) in sequence length vs an RNN's O(n·d²); the game since 2017 has been managing that quadratic (FlashAttention, grouped-query attention, sliding windows) while context windows grew from 512 to 1M+ tokens.

Pitfalls:
- Saying "transformers have no position awareness" — they have none *built into attention*, which is exactly why positional encodings exist.
- Forgetting the FFN: attention gets the fame, but the MLP holds most parameters and knowledge.
- Confusing training parallelism (all positions at once) with inference, which remains sequential per token.

## Interview Angle

- The canonical question is "walk me through a transformer" — narrate the block flow above and *name the purpose of every component*; listing parts without their "why" is the common fail.
- "Why did attention replace RNNs?" — give both halves: training parallelism and O(1) path length for long-range dependencies. One-half answers read as incomplete.
- "Why residuals and layer norm?" — trainability at depth; each block refines rather than replaces. Distinguishes memorization from understanding.
- Know decoder-only specifics cold, since that's what every modern LLM is: causal mask, next-token objective, KV cache, and why the KV cache makes long-context serving memory-bound.
- Parameter-count sanity check impresses: for GPT-2 small, d_model=768, 12 layers, 12 heads — be able to estimate where parameters live (mostly FFN and embeddings).

## Related

- [[Attention-Mechanism]]
- [[Embeddings]]
- [[Fine-Tuning-vs-Prompting]]
- [[Big-O-Notation]]
