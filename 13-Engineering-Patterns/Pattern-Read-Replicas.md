---
title: Read Replicas
description: Scale read-heavy workloads by routing reads to asynchronously replicated copies of the primary database.
domain: patterns
category: database
type: pattern
difficulty: intermediate
status: evergreen
tags: [database, scaling]
prerequisites: []
related: [Pattern-CQRS, Checklist-Database-Design]
order: 60
---
# Read Replicas

## Problem

A single primary database saturates on reads (dashboards, listings, reports) long before writes become the bottleneck. Scaling the primary vertically gets expensive and still leaves one box doing everything.

## Solution

Add one or more replicas fed by the primary's replication stream. Route writes and read-your-own-write queries to the primary; route tolerant reads (listings, analytics) to replicas. Replication is usually asynchronous, so replicas lag; the application must decide per query whether stale data is acceptable.

## Example

```python
import time
from sqlalchemy import create_engine, text

primary = create_engine("postgresql+psycopg://app@primary/app", pool_pre_ping=True)
replica = create_engine("postgresql+psycopg://app_ro@replica/app", pool_pre_ping=True)
STICKY_SECONDS = 5  # after a user writes, read their data from primary briefly

def engine_for(read_only: bool, last_write_ts: float | None) -> "Engine":
    if not read_only:
        return primary
    if last_write_ts and time.time() - last_write_ts < STICKY_SECONDS:
        return primary                      # read-your-writes
    return replica

def replica_lag_seconds() -> float:
    with replica.connect() as c:
        return c.execute(text(
            "SELECT COALESCE(EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp()), 0)"
        )).scalar_one()

def list_products(session_last_write: float | None):
    eng = engine_for(read_only=True, last_write_ts=session_last_write)
    if eng is replica and replica_lag_seconds() > 30:
        eng = primary                       # fail back if replica is far behind
    with eng.connect() as c:
        return c.execute(text("SELECT id, name FROM products ORDER BY id LIMIT 50")).all()
```

## Tradeoffs

- Cheap read scaling, but eventual consistency leaks into application code.
- Does nothing for write throughput (see sharding).
- More nodes to patch, monitor, and fail over.

## Failure modes

- User saves a profile and immediately sees the old value (no read-your-writes routing).
- Replica lag spikes under heavy writes or long-running replica queries; stale reads go unnoticed without lag monitoring.
- Failover promotes a lagging replica and loses the last writes.

## Security implications

- Use a read-only database role on replicas so a routing bug cannot write.
- Replicas hold the full dataset; apply the same encryption, network isolation, and access auditing as the primary.
- Analytics users on replicas still need least-privilege grants, not superuser.

## When to use

- Read-heavy workloads where most reads tolerate seconds of staleness.

## When not to use

- Strongly consistent reads everywhere (balances, inventory checks), or when a cache would solve the load more cheaply.

Back to [[Patterns-Index]].
