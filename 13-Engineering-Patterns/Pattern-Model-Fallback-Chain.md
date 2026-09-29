---
title: Model Fallback Chain
description: Try an ordered list of models or providers with timeouts, falling back on errors, rate limits, or invalid output.
domain: patterns
category: ai
type: pattern
difficulty: intermediate
status: evergreen
tags: [ai, llm, reliability]
prerequisites: []
related: [Pattern-LLM-Gateway, Pattern-Circuit-Breaker, Pattern-Retry-with-Backoff]
order: 270
---
# Model Fallback Chain

## Problem

A single model provider has outages, rate limits, and latency spikes. When it fails, every AI feature fails, even though a cheaper or alternative model could have produced an acceptable answer.

## Solution

Define an ordered chain (for example primary model, same-provider smaller model, second provider, then a non-LLM fallback such as a cached or templated response). Each hop has its own timeout. Fall back on retryable errors (timeouts, 429, 5xx) and on output that fails validation, but not on errors that will fail everywhere (400 bad request, content policy). Record which hop served each request.

## Example

```python
import time
from dataclasses import dataclass
from typing import Callable

class NonRetryable(Exception): ...          # e.g. 400, policy refusal

@dataclass
class Hop:
    name: str
    call: Callable[..., str]
    timeout_s: float

def run_chain(messages, chain: list[Hop], validate: Callable[..., bool], static_fallback: str):
    errors = []
    for hop in chain:
        if breaker_open(hop.name):          # skip hops known to be down
            continue
        start = time.monotonic()
        try:
            out = call_with_timeout(hop.call, messages, hop.timeout_s)
            if validate(out):
                metrics.incr("llm.served_by", tags={"hop": hop.name})
                return out
            errors.append((hop.name, "invalid output"))
        except NonRetryable:
            raise                           # same request would fail on every hop
        except Exception as exc:            # timeout, 429, 5xx
            record_failure(hop.name)
            errors.append((hop.name, repr(exc)))
        finally:
            metrics.timing("llm.hop_latency", time.monotonic() - start, tags={"hop": hop.name})
    log.warning("all hops failed: %s", errors)
    return static_fallback
```

## Tradeoffs

- Higher availability versus inconsistent output quality and behavior across hops.
- Prompts may need per-model variants; one prompt rarely works identically everywhere.
- Worst-case latency is the sum of timeouts; keep a total deadline.

## Failure modes

- Fallback model silently degrades quality and nobody notices without per-hop metrics.
- Retrying non-retryable errors multiplies cost and latency.
- All hops share a dependency (same region, same gateway) and fail together.

## Security implications

- Every provider in the chain receives the data; all must be approved for that data classification.
- Safety filters differ between models; validate outputs the same way regardless of which hop served them.

## When to use

- User-facing AI features with availability targets.

## When not to use

- Offline batch jobs that can simply retry later, or tasks where only one model meets the quality bar.

Back to [[Patterns-Index]].
