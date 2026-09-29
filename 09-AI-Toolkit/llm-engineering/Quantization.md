---
title: Quantization
description: Representing model weights (and sometimes activations/KV cache) in fewer bits to cut memory and bandwidth, and the accuracy tradeoffs involved.
domain: ai
category: llm-engineering
type: concept
difficulty: advanced
status: evergreen
tags: [llm, inference, quantization, int8, int4]
prerequisites: [LLM-Inference-and-Serving, Linear-Algebra-for-ML]
related: [LLM-Latency-Optimization, LLM-Cost-Optimization, Fine-Tuning-vs-Prompting]
order: 90
---

# Quantization

Hub: [[AI-Engineering-Index]]

## Core Idea

Quantization maps high-precision values (fp32/fp16/bf16) to a low-precision format (int8, int4, fp8). Since decode is memory-bandwidth-bound ([[LLM-Inference-and-Serving]]), moving fewer bytes per weight usually speeds generation and lets a bigger model or larger batch fit on the same hardware. The cost is approximation error, which may or may not matter for your task - measure it.

## How it works

**Affine (asymmetric) quantization** for $b$ bits:
$q = \text{clamp}(\text{round}(x/s) + z,\ q_{min},\ q_{max})$, dequantize $\hat{x} = s\,(q - z)$
with scale $s = (x_{max}-x_{min})/(q_{max}-q_{min})$ and zero-point $z$.

**Symmetric** quantization sets $z=0$ and $s = \max|x| / q_{max}$.

**Granularity:** per-tensor (one scale), per-channel (one per output row), per-group (one per block of e.g. 64-128 weights). Finer granularity -> lower error, slightly more metadata.

**Outliers:** a few large-magnitude values stretch the range and crush precision for the rest. Many LLM methods exist mainly to handle outliers.

| Approach | Idea |
|---|---|
| Weight-only PTQ (e.g. int4/int8 weights, fp16 activations) | Most common for LLM serving; dequantize on the fly in kernel |
| GPTQ-style | Quantize layer by layer, using calibration data to compensate error in remaining weights |
| AWQ-style | Protect weights tied to salient activations by rescaling before quantizing |
| SmoothQuant-style | Shift activation outliers into weights so both W and A can be int8 |
| QAT | Simulate quantization during training so the model adapts; costly but most accurate |
| KV cache quantization | Store K/V in lower precision to fit longer contexts/more requests |
| QLoRA | Fine-tune LoRA adapters on top of a frozen 4-bit base model |

## Python code: symmetric per-channel int8

```python
import numpy as np

def quantize_per_channel(w: np.ndarray, bits: int = 8):
    qmax = 2 ** (bits - 1) - 1                         # 127 for int8
    scale = np.abs(w).max(axis=1, keepdims=True) / qmax
    scale[scale == 0] = 1.0
    q = np.clip(np.round(w / scale), -qmax - 1, qmax).astype(np.int8)
    return q, scale.astype(np.float32)

def dequantize(q, scale):
    return q.astype(np.float32) * scale

rng = np.random.default_rng(0)
w = rng.normal(size=(4, 256)).astype(np.float32)
q, s = quantize_per_channel(w)
err = np.abs(w - dequantize(q, s)).mean()
print(f"bytes fp32={w.nbytes} int8={q.nbytes + s.nbytes} mean_abs_err={err:.5f}")
```

Memory rule of thumb for weights: $\text{params} \times \text{bits}/8$ bytes, plus scales/zero-points, plus KV cache and activations.

## Tradeoffs

- Lower bits -> less memory, usually faster decode, more quality risk. Degradation tends to be larger for small models and for tasks like math, code, and long reasoning.
- Speedup depends on kernels and hardware support; a format without optimized kernels may be slower than fp16.
- Weight-only helps decode (bandwidth); prefill (compute-bound) benefits more from W+A quantization with hardware int8/fp8 support.

## Failure modes

- Evaluating only perplexity; downstream task quality drops unnoticed.
- Calibration data unrepresentative of production (different language/domain).
- Mixing formats between training/export/serving toolchains.
- Silent fallback to unoptimized kernels.

## Security implications

Quantized community checkpoints are third-party artifacts: verify provenance and checksums, prefer safe serialization formats over pickle-based files, and re-run safety evals since behavior (including refusals) can shift after quantization.

## Interview questions

1. **Why does quantization speed up LLM decode?** Decode is memory-bandwidth-bound; fewer bytes per weight means less data moved per token.
2. **Symmetric vs asymmetric?** Symmetric has zero-point 0 (simpler, good for centered weights); asymmetric adds a zero-point for skewed ranges.
3. **Why per-group scales?** Limits the damage of outliers to a small group, reducing error.
4. **PTQ vs QAT?** PTQ quantizes a trained model with little/no data; QAT trains with simulated quantization for better accuracy at higher cost.
5. **What is QLoRA?** Training LoRA adapters over a frozen 4-bit quantized base model to cut fine-tuning memory.
6. **How do you validate?** Run the task eval suite, not just perplexity, on both fp16 and quantized versions.

## Related

[[LLM-Inference-and-Serving]] · [[LLM-Latency-Optimization]] · [[LLM-Cost-Optimization]] · [[Fine-Tuning-vs-Prompting]]
