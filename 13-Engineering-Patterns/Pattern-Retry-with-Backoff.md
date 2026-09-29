---
title: Retry with Backoff
description: Retry transient failures with exponential backoff, jitter, and a cap, only for idempotent operations.
domain: patterns
category: distributed
type: pattern
difficulty: beginner
status: evergreen
tags: [distributed-systems, resilience]
prerequisites: []
related: [Pattern-Circuit-Breaker, Pattern-Idempotency-Keys]
order: 290
---
# Retry with Backoff

## Problem

Transient failures (timeouts, 503, connection resets, 429) are common in distributed systems. No retries turns blips into user-visible errors; naive immediate retries from many clients synchronize into a thundering herd that keeps the dependency down.

## Solution

Retry only retryable errors, only for idempotent operations (or those protected by idempotency keys). Wait `min(cap, base * 2^attempt)` with random jitter ("full jitter": uniform between 0 and that value) between attempts, honor `Retry-After`, bound attempts and total time, and retry at one layer only to avoid multiplicative retries.

## Example

```python
import random, time
import httpx

RETRYABLE = {408, 429, 500, 502, 503, 504}

def get_with_retry(url: str, attempts: int = 5, base: float = 0.2, cap: float = 5.0,
                   deadline_s: float = 15.0) -> httpx.Response:
    start = time.monotonic()
    for attempt in range(attempts):
        try:
            resp = httpx.get(url, timeout=3.0)
            if resp.status_code not in RETRYABLE:
                return resp                           # success or non-retryable error
            retry_after = resp.headers.get("Retry-After")
        except (httpx.ConnectError, httpx.ReadTimeout):
            retry_after = None
        if attempt == attempts - 1:
            break
        delay = float(retry_after) if retry_after and retry_after.isdigit() \
            else random.uniform(0, min(cap, base * 2 ** attempt))   # full jitter
        if time.monotonic() - start + delay > deadline_s:
            break
        time.sleep(delay)
    raise RuntimeError(f"gave up on {url} after {attempt + 1} attempts")
```

## Tradeoffs

- Masks transient failures versus added latency and load during real outages.
- Retry budgets (e.g. limit retries to a fraction of requests) keep retries from amplifying incidents.

## Failure modes

- Retrying non-idempotent POSTs creates duplicates.
- Retries at every layer (client, gateway, service) multiply: 3 x 3 x 3 = 27 attempts.
- No jitter: synchronized retry waves.
- Retrying 400/401/403, which will never succeed.

## Security implications

- Retrying authentication failures can trigger account lockouts or look like credential stuffing.
- Unbounded retries turn your service into a DoS amplifier against a dependency.

## When to use

- Network calls to services, databases, and queues with transient failures.

## When not to use

- Non-idempotent operations without idempotency keys; validation or authorization errors; user-interactive paths where fast failure plus a clear message is better.

Back to [[Patterns-Index]].
