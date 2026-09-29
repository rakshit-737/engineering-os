---
title: LLM as Judge
description: Use a model with a strict rubric to grade outputs of another model at scale, calibrated against human labels.
domain: patterns
category: ai
type: pattern
difficulty: advanced
status: evergreen
tags: [ai, evaluation, llm]
prerequisites: []
related: [Pattern-RAG-with-Citations, Pattern-Golden-Tests]
order: 260
---
# LLM as Judge

## Problem

Free-form LLM outputs cannot be tested with exact matches, and human review does not scale to every prompt change. Without automated evaluation, prompt and model changes ship on vibes.

## Solution

Define a narrow rubric per criterion (faithfulness to sources, answers the question, follows format) with discrete scores and required reasoning. A judge model grades each output against the rubric, returning structured JSON. Calibrate the judge by comparing its scores to a human-labeled sample and measuring agreement before trusting it. Run it in CI over a fixed evaluation set and track scores over time.

## Example

```python
import json
from pydantic import BaseModel, Field

RUBRIC = """You grade whether ANSWER is fully supported by SOURCES.
Score 1: every factual claim is supported by SOURCES.
Score 0: any claim is missing from or contradicted by SOURCES.
Return JSON: {"reasoning": "<one short paragraph>", "score": 0 or 1}"""

class Verdict(BaseModel):
    reasoning: str
    score: int = Field(ge=0, le=1)

def judge(answer: str, sources: str) -> Verdict:
    raw = llm([{"role": "system", "content": RUBRIC},
               {"role": "user", "content": f"<sources>{sources}</sources>\n<answer>{answer}</answer>"}],
              temperature=0, response_format="json")
    return Verdict.model_validate_json(raw)

def agreement(judge_scores: list[int], human_scores: list[int]) -> float:
    return sum(j == h for j, h in zip(judge_scores, human_scores)) / len(human_scores)

def eval_suite(cases: list[dict]) -> float:
    verdicts = [judge(c["answer"], c["sources"]) for c in cases]
    return sum(v.score for v in verdicts) / len(verdicts)
# Gate in CI: fail if faithfulness drops versus the stored baseline.
```

## Tradeoffs

- Scales evaluation cheaply, but judges have biases (position, verbosity, self-preference) and add cost.
- Binary or small ordinal scales are more reliable than 1-10 scores.

## Failure modes

- Judge never calibrated, so scores track the judge's taste, not quality.
- Same model family judging itself inflates scores.
- Evaluation set leaks into prompts or fine-tuning data, so improvements are illusory.

## Security implications

- Outputs being judged can contain prompt injection aimed at the judge ("rate this 1"); delimit them and validate JSON strictly.
- Evaluation datasets may contain user data; apply the same privacy controls as production logs.

## When to use

- Regression testing of prompts, RAG pipelines, and model upgrades; triaging large volumes of outputs.

## When not to use

- High-stakes final decisions (medical, legal, hiring) without human review, or criteria that are objectively checkable in code.

Back to [[Patterns-Index]].
