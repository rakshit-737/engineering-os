---
title: Feature Flags
description: Decouple deploy from release by gating code paths behind runtime flags.
domain: patterns
category: devops
type: pattern
difficulty: beginner
status: evergreen
tags: [devops, release, experimentation]
prerequisites: []
related: [Pattern-Canary-Release, Pattern-Strangler-Fig]
order: 190
---
# Feature Flags

## Problem

Merging a half-finished feature blocks trunk-based development; long-lived branches cause merge pain. Releasing a feature requires a deploy, and turning a broken feature off requires another deploy.

## Solution

Wrap new behavior in a flag evaluated at runtime from a config service. Flags can target users, tenants, or percentages. Classify flags (release, experiment, ops kill switch, permission) with owners and expiry dates, and delete release flags once the feature is fully on.

## Example

```python
import hashlib
from dataclasses import dataclass

@dataclass(frozen=True)
class Flag:
    name: str
    enabled: bool = False
    rollout_percent: int = 0            # 0..100
    allow_users: frozenset[str] = frozenset()
    owner: str = ""
    expires: str = ""                   # e.g. "2026-12-31": CI warns after this date

def is_enabled(flag: Flag, user_id: str) -> bool:
    if not flag.enabled:
        return False                    # kill switch wins
    if user_id in flag.allow_users:
        return True
    # stable bucketing: same user always gets the same answer
    bucket = int(hashlib.sha256(f"{flag.name}:{user_id}".encode()).hexdigest(), 16) % 100
    return bucket < flag.rollout_percent

NEW_CHECKOUT = Flag("new-checkout", enabled=True, rollout_percent=10,
                    allow_users=frozenset({"qa-1"}), owner="payments", expires="2026-12-31")

def checkout(user_id: str, cart):
    if is_enabled(NEW_CHECKOUT, user_id):
        return new_checkout_flow(cart)
    return legacy_checkout_flow(cart)
```

## Tradeoffs

- Fast, reversible releases versus combinatorial code paths and flag debt.
- Testing must cover both flag states for flags that matter.

## Failure modes

- Stale flags accumulate and nobody knows which are safe to remove.
- Flag service outage: define safe defaults (usually off) for evaluation failures.
- Reusing an old flag name reactivates dead code (the Knight Capital 2012 incident is the widely cited example).

## Security implications

- Never use client-side flags to hide unauthorized features; flags are not access control. Enforce permissions server-side.
- Restrict and audit who can change production flags; a flag flip is a production change.

## When to use

- Trunk-based development, gradual rollouts, kill switches for risky dependencies, A/B experiments.

## When not to use

- Permanent configuration or entitlements (use proper config or authorization), tiny apps with daily deploys and no users at risk.

Back to [[Patterns-Index]].
