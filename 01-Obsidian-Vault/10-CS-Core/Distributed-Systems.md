---
title: Distributed Systems
description: "Subject hub: failure models, replication, consistency, consensus, clocks."
domain: cs-core
category: distributed-systems
type: index
difficulty: advanced
status: evergreen
tags: [cs-core, distributed-systems]
prerequisites: [Computer-Networks]
related: [Clocks-and-Ordering, DBMS, System-Design-Basics]
---

# Distributed Systems

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

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

## Roadmap

1. Failure models: crash-stop, crash-recovery, omission, Byzantine; partial failure
2. [[Clocks-and-Ordering]] — physical clocks, Lamport and vector clocks, happens-before
3. Replication: leader/follower, multi-leader, leaderless quorums
4. Consistency models: linearizable, sequential, causal, eventual
5. Consensus: Raft/Paxos, leader election, log replication
6. Partitioning: hash vs range, consistent hashing, rebalancing
7. Distributed transactions: 2PC and its blocking problem, sagas
8. Capstone: design a replicated key-value store; state its consistency guarantee and its behavior during a partition

## Key Concepts

Partial failure · timeout ≠ failure · FLP impossibility · quorum intersection · split brain · fencing token · idempotency · at-least-once delivery · consistent hashing · 2PC coordinator blocking

## More Interview Questions (with answers)

- **Why is 2PC called blocking?** — If the coordinator crashes after participants voted "yes", they must hold locks until it recovers; none can safely decide alone.
- **What is a fencing token?** — A monotonically increasing number issued with a lock or lease; storage rejects writes carrying an older token, so a paused former holder cannot corrupt data.
- **Raft in three sentences?** — Nodes elect a leader using randomized timeouts and term numbers. The leader appends client commands to its log and replicates them. An entry commits once a majority stores it, and only candidates with an up-to-date log can win elections.
- **Why consistent hashing?** — Adding or removing a node moves roughly 1/N of keys instead of remapping almost all of them.

## Coding Exercises

- [ ] Lamport and vector clocks for three simulated processes; detect concurrent events
- [ ] Consistent-hash ring with virtual nodes; measure key movement when a node joins
- [ ] N/R/W quorum store simulation with injected node failures
- [ ] Idempotent payment endpoint backed by an idempotency-key table

## Connections

- **System design** — every HLD answer about replication, sharding, caching, or queues is applied distributed systems; see [[System-Design-Basics]].
- **Cybersecurity** — Byzantine faults model malicious nodes; mTLS between services, replay protection with nonces, and secret distribution are distributed problems.
- **AI** — data/model/pipeline-parallel training, all-reduce, and serving many replicas pinned to a consistent model version.

## Related

- [[Computer-Networks]]
- [[Operating-Systems]]
- [[DBMS]]
- [[Concurrency-Basics]]
- [[Hash-Tables]]
