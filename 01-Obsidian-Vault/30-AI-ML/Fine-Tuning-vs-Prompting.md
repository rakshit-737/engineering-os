---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# Fine Tuning vs Prompting

Hub: [[AI-ML-Index]]

## Core Idea

Three ways to adapt an LLM, in order of cost: prompting steers behavior at inference time with zero training; RAG injects fresh or private *knowledge* into the context; fine-tuning updates weights to bake in *behavior* — style, format, domain conventions. The core distinction: fine-tuning teaches form, RAG supplies facts, prompting does both weakly but instantly.

## Details

| | Prompting | RAG | Fine-tuning |
|---|---|---|---|
| Changes | context only | context (retrieved) | weights |
| Cost to start | minutes | days (pipeline) | days–weeks (+data) |
| New/private knowledge | paste-what-fits only | yes, updatable instantly | poor — lossy, stale on ingest |
| Style/format control | moderate | none | strong |
| Latency/token cost | high (long prompts) | high (context stuffing) | low (short prompts) |
| Attribution/citations | manual | natural (cite chunks) | none |
| Iteration speed | instant | re-index | retrain |

Decision order (use this in interviews and in practice):
1. **Prompt first.** Clear instructions + few-shot examples solve most tasks. Cheapest experiment, instant feedback. See [[LLM-Prompt-Engineering]].
2. **Add RAG** when the failure is *missing or stale knowledge*: internal docs, post-cutoff events, per-tenant data. Never fine-tune to "teach facts" — models trained on small fact sets hallucinate confidently and can't be updated without retraining.
3. **Fine-tune last**, when the failure is *form*: output must always match a strict schema, a brand voice, a domain dialect (medical coding, legalese), or you need few-shot-level quality without paying for long prompts on millions of calls. Also for distilling a big model's behavior into a small cheap one.

Fine-tuning mechanics (current era):
- **SFT** (supervised fine-tuning) on prompt→response pairs; typically **LoRA/QLoRA** — freeze base weights, train small low-rank adapter matrices (<1% of params), so a single GPU suffices and adapters can be swapped per customer.
- Preference tuning (DPO/RLHF) shapes tone/helpfulness/safety beyond what pair data expresses.
- Needs hundreds→thousands of *high-quality* examples; garbage pairs get faithfully learned.

```python
# LoRA in one idea: W' = W + (alpha/r) * B @ A, train only A (r x d) and B (d x r)
peft_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])
```

Pitfalls:
- Fine-tuning for knowledge → hallucination + instant staleness (the classic mistake).
- **Catastrophic forgetting**: narrow-task tuning degrades general ability; mix general data in or keep LoRA rank small.
- Skipping the eval set: without a held-out benchmark you cannot tell if tuning helped (see [[Evaluation-Metrics-ML]]).
- Ignoring hybrids: production systems commonly do all three — a fine-tuned model, fed RAG context, driven by a carefully engineered prompt.
- Fine-tuning can erode safety/refusal behavior — relevant for security reviews of ML systems.

## Interview Angle

- The standard scenario question: "company wants an LLM to answer questions over internal docs — fine-tune?" Correct answer: no — RAG, because it's a knowledge problem: docs change daily, you need citations, and fine-tuning can't reliably store or update facts. Then note you'd still prompt-engineer the generation step.
- Give the decision order (prompt → RAG → fine-tune) and justify it by cost of iteration: each step up is slower to try and harder to undo.
- Know one concrete fine-tuning win to cite: enforcing a strict JSON schema at scale, or distilling GPT-4-class outputs into a small model to cut per-call cost 10x.
- Be able to say what LoRA is in two sentences (low-rank adapters on frozen weights; tiny trainable footprint, swappable per tenant) — it signals current, practical knowledge.
- Follow-up they like: "when does prompting lose?" — when few-shot examples eat your context/token budget on every call, or the behavior is too subtle to specify in words.

## Related

- [[RAG-Retrieval-Augmented-Generation]]
- [[LLM-Prompt-Engineering]]
- [[Overfitting-and-Regularization]]
- [[Evaluation-Metrics-ML]]
