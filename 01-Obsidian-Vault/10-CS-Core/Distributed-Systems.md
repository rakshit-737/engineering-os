---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Distributed Systems

Hub: [[CS-Core-Index]]

## Core Idea

Once data lives on more than one machine, three facts dominate: the network partitions (so you must choose between consistency and availability during one), there is no shared clock (so "at the same time" is ill-defined), and messages get lost and retried (so operations must be safe to repeat). Every distributed design — replication, quorums, consensus — is a response to these three.

## Details

### CAP Theorem, Precisely

During a network **P**artition, a system must choose: refuse some requests to stay **C**onsistent (every read sees the latest write), or stay **A**vailable (answer everything) and risk stale/conflicting data. Partition tolerance is **not optional** — networks *will* partition, so "CA" is not a real category for a distributed system. CAP is only about behavior *during* a partition; in normal operation the practical tradeoff is latency vs consistency (see PACELC: else, Latency or Consistency).

### Consistency Models

- **Strong (linearizable)**: the system behaves as if there were one copy; once a write returns, every later read sees it. Costs coordination on every operation.
- **Eventual**: replicas may briefly disagree; with no new writes they converge. Cheap and available, but a read-after-write can miss your own write.
- Useful middle grounds: **read-your-writes**, **monotonic reads**, **causal** consistency — often what applications actually need.

### Replication

- **Leader/follower (primary/replica)**: all writes go to the leader, which streams them to followers; reads can go to followers (possibly stale). Simple, but leader failure requires failover — and a botched failover (two leaders, "split brain") loses data.
- **Quorums (N/R/W)**: N replicas; a write must be acknowledged by W of them, a read consults R. If **R + W > N**, every read overlaps at least one node with the newest write. N=3, W=2, R=2 is the classic balance; W=1 is fast but can lose acknowledged writes.
- When leaderless replicas conflict, something must resolve it: last-write-wins (simple, drops data on clock skew), version vectors surfacing conflicts to the app, or CRDTs that merge automatically.

### Consensus in One Paragraph

Consensus is getting a cluster to agree on one value (or one log of operations) even as nodes crash — needed for choosing a leader and for consistent replication. **Raft**'s intuition: time is divided into numbered terms; each node waits a randomized timeout, and on silence from a leader it becomes a candidate and requests votes. A candidate with a majority becomes leader; the majority requirement means two leaders can't coexist in one term, and randomized timeouts make split votes rare. The leader then owns the log: entries are committed once a majority stores them, and a new leader can only be elected if its log is at least as up-to-date, so committed entries survive failures.

### Idempotency and Retries

A timeout is ambiguous: the request may have failed *or* succeeded with the reply lost. Since retrying is the only cure, operations must be **idempotent** — doing them twice equals doing them once. `SET x = 5` is idempotent; `x += 5` is not. Standard fix: attach a client-generated **idempotency key**; the server stores processed keys and returns the saved response for duplicates (how payment APIs avoid double charges). Corollary: most "exactly-once delivery" is really at-least-once delivery plus idempotent processing.

### Clocks and Ordering

Every machine's clock drifts, and NTP sync leaves millisecond-level error — so wall-clock timestamps cannot reliably order events on different machines ("last write wins" can silently drop the *earlier* write). **Lamport's insight**: settle for causal order — track it with logical counters (increment on each event, carry the counter on messages, take max on receipt). If A caused B, A's counter is smaller; events with no causal path are *concurrent*, and no ordering of them is "correct". Vector clocks extend this to detect concurrency; Google's Spanner instead bounds clock error with TrueTime and waits it out. Why "simultaneous" is hard: without a shared clock, simultaneity is not even well-defined — only causality is.

## Interview Angle

- "Explain CAP" — the strong answer notes that P isn't a choice and that the C/A tradeoff applies only during partitions; bonus points for PACELC.
- "How do quorums work?" — state R + W > N and *why* (overlap guarantees a read touches fresh data); give N=3, R=W=2.
- "Design a retry-safe API" — idempotency keys, dedup table, at-least-once + idempotent = effectively exactly-once.
- "Strong vs eventual consistency?" — define both in one sentence each, then name the cost of strong (coordination latency, unavailability under partition).
- "Why not order events by timestamp?" — clock skew; explain Lamport clocks in two sentences.
- System design tie-in: say which consistency model each component actually needs — a cart can be eventual, a payment ledger cannot. That judgment is what's evaluated.

## Related

- [[Computer-Networks]]
- [[Operating-Systems]]
- [[DBMS]]
- [[Concurrency-Basics]]
- [[Hash-Tables]]
