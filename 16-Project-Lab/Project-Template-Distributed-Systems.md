---
title: "Project Template: Distributed Systems"
description: Project template additions and three scoped ideas for distributed systems work.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [distributed-systems, project]
prerequisites: [Project-Template]
related: [Pattern-Circuit-Breaker, Pattern-Saga]
order: 40
---
# Project Template: Distributed Systems

For projects where multiple processes coordinate over a network and failure handling is the point.

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **Consistency model:** what guarantees you provide (linearizable, eventual) and to whom
- **Failure model:** crash, network partition, message loss/duplication, clock skew you tolerate
- **Fault injection plan:** how you will kill nodes, drop packets, and delay messages
- **Correctness checks:** invariants and how they are checked (property tests, history checkers)

## Extra requirements

- [ ] Deterministic or fault-injection tests for each failure mode claimed.
- [ ] Metrics per node: throughput, latency, leader changes, retries.
- [ ] Documented behavior under partition.
- [ ] Benchmarks with hardware and configuration stated.

## Project ideas

### 1. Raft-based key-value store

- **Target level:** Level 4
- **Scope:** Replicated KV store with leader election, log replication, and snapshots.
- **Stack:** Go or Rust, gRPC, Docker Compose, a network fault injector (toxiproxy)
- **Milestones:**
  1. Leader election and heartbeats
  2. Log replication and commit
  3. Snapshots and log compaction
  4. Partition tests and linearizability check (Porcupine)
- **What makes it stand out:** Correctness verified by a linearizability checker under injected faults.

### 2. Order saga with outbox

- **Target level:** Level 3
- **Scope:** Three services (orders, payments, inventory) coordinated by an orchestrated saga with transactional outbox.
- **Stack:** Python or Java, Postgres, Kafka or RabbitMQ
- **Milestones:**
  1. Services with local DBs
  2. Outbox relay and idempotent consumers
  3. Saga orchestrator with compensations ([[Pattern-Saga]])
  4. Chaos tests: kill services mid-saga
- **What makes it stand out:** Proves no lost or duplicated orders under crashes.

### 3. Distributed rate limiter

- **Target level:** Level 3
- **Scope:** Rate-limiting service shared by multiple API instances with token bucket in Redis and local fallback.
- **Stack:** Go or Python, Redis (Lua scripts), k6 for load
- **Milestones:**
  1. Single-node token bucket
  2. Redis-backed atomic bucket
  3. Fallback when Redis is down ([[Pattern-Circuit-Breaker]])
  4. Load test accuracy vs configured limits
- **What makes it stand out:** Quantified accuracy and latency under load and failure.

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
