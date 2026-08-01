---
tags: [concept, ai-ml]
created: 2026-08-01
status: evergreen
---

# LLM Prompt Engineering

Hub: [[AI-ML-Index]]

## Core Idea

Prompt engineering is programming a model through its context window: you specify role, task, constraints, examples, and output format, and the model conditions its next-token predictions on all of it. Structure beats cleverness — a plainly organized prompt with two good examples outperforms a "clever" one-liner. Few-shot examples are the strongest single lever because the model imitates demonstrated patterns more reliably than it follows described ones.

## Details

Anatomy of a solid prompt (order matters — instructions early, data late):

```text
[Role]        You are a senior code reviewer for Python services.
[Task]        Review the diff below for security issues only.
[Constraints] Ignore style. Max 5 findings. If none, say "No findings."
[Examples]    <2-3 input→output pairs showing tone and format>
[Format]      Respond as JSON: [{"line": int, "issue": str, "fix": str}]
[Input]       <the diff, clearly delimited, e.g. in triple backticks>
```

Core techniques and *why* they work (decoder-only LLMs predict tokens left-to-right over the whole context):
- **Few-shot examples**: demonstrations constrain the output distribution far more tightly than descriptions. 2–5 well-chosen examples covering edge cases beat 10 redundant ones.
- **Chain-of-thought** ("think step by step", or structured reasoning fields): quality on math/logic rises because intermediate tokens give the model compute and working memory before committing to an answer. Modern reasoning models do this internally, but explicit CoT still helps non-reasoning calls.
- **Delimiters** (XML tags, backticks) separate instructions from data — this is also the first defense against prompt injection, where untrusted input tries to be read as instructions.
- **Output contracts**: demand JSON/schema, or use the API's structured-output/tool-calling mode; then validate with code. Never trust format compliance without parsing.
- **Decomposition**: chain small single-purpose prompts (extract → classify → summarize) instead of one mega-prompt; each step is testable, like functions.

Context-window reality:
- Everything competes for a finite window (128k–1M+ tokens, model-dependent). Long-context models still show position effects — burying one key fact mid-context degrades recall ("lost in the middle") — so put critical instructions at the start and repeat hard constraints near the end.
- Longer prompts cost linearly in tokens and latency; prompt caching makes a long *static* prefix (system prompt + examples) cheap when it never changes across calls.

Pitfalls:
- Vague asks ("make it good") — the model fills ambiguity with the most generic completion.
- Contradictory or stale instructions accumulating in a growing system prompt.
- Testing on one example and shipping: prompts are code; keep a small eval set of input→expected pairs and re-run it on every prompt change and every model upgrade (see [[Evaluation-Metrics-ML]]).
- Trusting the model to follow negative instructions ("never mention X") — enforce hard rules in code after generation.
- Concatenating untrusted user text directly into instructions — injection risk (an LLM-era cousin of [[SQL-Injection]]).

Deep local references: `02-Prompt-Library/` and `09-AI-Toolkit/Prompt-Engineering-Guide.md`.

## Interview Angle

- Expect "how would you get reliable structured output from an LLM?" — answer: schema in prompt + few-shot example of the exact format + structured-output/tool-call API mode + code-side validation and retry on parse failure. The validation step is what interviewers listen for.
- "Why does chain-of-thought help?" — give the compute/working-memory answer (more tokens = more sequential computation before the final answer), not "the model thinks".
- Be ready to treat prompts as engineering artifacts: version-controlled, eval-suite-tested, monitored after model upgrades. Saying "prompts are code with a test suite" lands well.
- Know the escalation path when prompting plateaus: better examples → decomposition → RAG for knowledge gaps → fine-tuning for form (see [[Fine-Tuning-vs-Prompting]]).
- For security roles: explain prompt injection and mitigations — delimit untrusted input, privilege-separate tools, never let retrieved text override system instructions.

## Related

- [[Fine-Tuning-vs-Prompting]]
- [[RAG-Retrieval-Augmented-Generation]]
- [[Attention-Mechanism]]
- [[SQL-Injection]]
