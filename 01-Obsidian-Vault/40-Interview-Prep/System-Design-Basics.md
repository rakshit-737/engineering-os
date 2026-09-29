---
title: System Design Basics
description: The 45-minute system design round in one page - framework, building blocks, estimation, pitfalls.
domain: system-design
category: hld-fundamentals
type: concept
difficulty: beginner
status: evergreen
tags: [concept, interview, system-design]
prerequisites: []
related: [System-Design-Index, Scalability, Caching, Load-Balancing, CAP-Theorem]
order: 1
created: 2026-08-01
---

# System Design Basics

Hub: [[Interview-Prep-Index]] · Full library: [[System-Design-Index]]

## Core Idea

A system design interview is a structured conversation, not a quiz: clarify requirements and scale, estimate the load, sketch a high-level design, then deep-dive where the interviewer steers. You are graded on driving the process, stating assumptions, and naming tradeoffs — not on producing "the" architecture.

## Details

**The 4-step framework (45-min round):**
1. **Requirements (~5 min).** Functional: which features exactly (e.g. URL shortener: create link, redirect, expiry?). Non-functional: scale (DAU, QPS), latency target, availability, consistency needs, read/write ratio. Ask; don't assume.
2. **Estimation (~5 min).** Back-of-envelope QPS, storage, bandwidth. Purpose: justify later choices ("500 writes/s means a single Postgres is fine / isn't fine").
3. **High-level design (~15 min).** Draw: client → LB → stateless app servers → cache → DB, plus queue/CDN where relevant. Define the API (3-4 endpoints) and the data model (key tables/entities) before boxes multiply.
4. **Deep dive (~15 min).** Pick 1-2 hard parts with the interviewer: hot keys, sharding scheme, cache invalidation, failure handling, the one component that breaks at 10x scale.

**Core building blocks — know what each buys and costs:**

| Block | Buys you | Cost / gotcha |
|---|---|---|
| Load balancer | Spread traffic, health checks, failover | Needs stateless servers (sessions → cache) |
| Cache (Redis) | Cuts read latency + DB load | Invalidation, staleness, cache stampede; cache-aside w/ TTL is the default answer |
| Message queue (Kafka/SQS) | Decouples producers/consumers, absorbs spikes, async work | Eventual consistency; at-least-once ⇒ consumers must be idempotent |
| DB replication | Read scaling + failover (leader-follower) | Replication lag → stale reads |
| DB sharding | Write + storage scaling | Pick shard key carefully; cross-shard joins/transactions hurt; hot partitions |
| CDN | Static/media content near users, offloads origin | Cache invalidation, cost |
| SQL vs NoSQL | SQL: joins, transactions. NoSQL: horizontal scale, flexible schema | Say *why* — "NoSQL because scale" alone is a red flag |

**Back-of-envelope numbers (memorize):**
- 1 day ≈ 86,400 s ≈ 10^5 s. So 10M requests/day ≈ 100 QPS avg; assume peak ≈ 2-3x avg.
- Latency ladder: memory ~100 ns, SSD read ~100 µs, disk seek ~10 ms, same-DC round trip ~0.5 ms, cross-continent RTT ~100-150 ms.
- A single modern SQL server: ~thousands of QPS; Redis: ~100k ops/s; one server holds ~100s of GB RAM, TBs of disk.
- Storage math: 100M items × 1 KB = 100 GB. Char = 1 byte, UUID = 16 bytes, image ≈ 100s of KB.

**Worked micro-example — URL shortener estimation:** 100M new URLs/month ≈ 40 writes/s; 10:1 read ratio → 400 reads/s. 500 bytes/URL × 100M × 5 years ≈ 3 TB. Conclusion you say aloud: "Write load is trivial; reads want a cache; storage fits a sharded key-value store easily."

**Common pitfalls:**
- Diving into boxes before requirements are pinned down.
- Over-engineering: "we'll shard from day one" for 40 writes/s — match the design to the numbers you just estimated.
- Silence while thinking — narrate the tradeoff you're weighing.
- Never mentioning failure modes: what happens when the cache dies, the DB leader dies, a whole AZ goes down?
- Treating CAP as a slogan instead of a concrete choice: "on partition I serve stale reads, because availability matters more for this feature."

## Interview Angle

- Drive: "Let me spend 5 minutes on requirements, then estimate, then draw the high-level design — sound good?" Interviewers reward candidates who manage the clock.
- State assumptions with numbers unprompted; wrong-but-explicit beats vague.
- Every component you draw, be ready for "why this?" and "what breaks first at 10x?" — never add a box you can't defend.
- Tradeoff language wins rounds: "consistency vs availability here", "precompute vs compute-on-read", "push vs pull".
- For new-grad roles, depth expectations are modest: nail the framework, the building blocks table, and clean estimation.

## Related

- [[System-Design-Index]] (learning path + estimation cheat sheet)
- [[Scalability]], [[Caching]], [[Load-Balancing]], [[Message-Queues]], [[Replication]], [[Sharding-and-Partitioning]], [[CDN]], [[Database-Selection]], [[CAP-Theorem]]
- [[Concurrency-Basics]]
- [[Hash-Tables]]
- [[TLS-Handshake]]
- [[Authentication-vs-Authorization]]
- [[Big-O-Notation]]
