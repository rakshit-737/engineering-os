---
title: DBMS
description: "Subject hub: relational model, SQL, indexing, transactions, isolation, normalization."
domain: cs-core
category: dbms
type: index
difficulty: intermediate
status: evergreen
tags: [cs-core, dbms]
prerequisites: []
related: [Database-Indexing, Transactions-and-Isolation-Levels, Normalization, SQL-Joins-and-Query-Plans]
---

# DBMS

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

A database gives you two guarantees applications can't easily build themselves: fast lookups over data far bigger than RAM (indexes), and correctness under concurrent access and crashes (transactions). Most DBMS interview questions are about the cost of those guarantees — write overhead for indexes, anomalies traded away by isolation levels.

## Details

### Indexing

- A **B+ tree** is a short, wide search tree: internal nodes hold only keys for routing, all values live in leaves, and leaves are linked left-to-right. A billion rows is ~3-4 levels deep, so a point lookup costs 3-4 page reads, and the leaf chain makes range scans (`BETWEEN`, `ORDER BY`) cheap. That combination is why it's the default index almost everywhere.
- **Index helps**: selective `WHERE` on the indexed column, joins on the key, range queries, sorts the leaf order already satisfies.
- **Index hurts**: every INSERT/UPDATE/DELETE must also update each index (write amplification); low-selectivity columns (e.g. a boolean) where a full scan is cheaper anyway; leading-wildcard `LIKE '%x'`; functions applied to the column (`WHERE lower(name) = ...` skips a plain index).
- Composite index `(a, b)` serves queries filtering on `a` or on `a, b` — not on `b` alone (leftmost-prefix rule).

### Transactions and ACID

A transaction is a group of statements that commits or rolls back as one unit.

- **Atomicity** — all or nothing (undo log / rollback).
- **Consistency** — constraints hold before and after.
- **Isolation** — concurrent transactions don't see each other's intermediate states (locks or MVCC).
- **Durability** — once committed, survives a crash (write-ahead log flushed before acknowledging).

### Isolation Levels and Anomalies

| Level | Dirty read | Non-repeatable read | Phantom |
|---|---|---|---|
| Read uncommitted | possible | possible | possible |
| Read committed | — | possible | possible |
| Repeatable read | — | — | possible* |
| Serializable | — | — | — |

- **Dirty read**: seeing another transaction's uncommitted write.
- **Non-repeatable read**: re-reading a row gives a different value (someone committed in between).
- **Phantom**: re-running a range query returns new rows.
- *Postgres's repeatable read (snapshot isolation) actually blocks phantoms too; MySQL/InnoDB mostly does via gap locks. Say "per the SQL standard" and mention this if pushed.

### Normalization 1NF → 3NF

Start: `Order(order_id, customer_name, customer_city, item_list)`

- **1NF** — atomic values, no repeating groups: split `item_list` into one row per item → `OrderItem(order_id, item, qty)`.
- **2NF** — no partial dependency on part of a composite key: in `OrderItem(order_id, item, qty, item_price)`, `item_price` depends only on `item` → move to `Item(item, price)`.
- **3NF** — no transitive dependency on non-key columns: `customer_city` depends on `customer_name`, not on `order_id` → move to `Customer(customer_name, city)`.

Each step removes a class of update/insert/delete anomaly at the cost of more joins. Denormalize deliberately for read-heavy paths, never by accident.

### SQL vs NoSQL

- **SQL (Postgres, MySQL)**: strong schema, joins, ACID transactions, ad-hoc queries. Default choice until proven otherwise.
- **NoSQL**: document (MongoDB — flexible nested data), key-value (Redis, DynamoDB — predictable O(1) access at huge scale), wide-column (Cassandra — write-heavy, partition-friendly), graph (Neo4j — relationship traversal).
- Real tradeoff: NoSQL typically gives up joins and cross-record transactions to make horizontal partitioning easy; you pre-shape data for known queries instead of normalizing for flexibility. See [[Distributed-Systems]] for the consistency side.

## Interview Angle

- "Why is an index a B+ tree and not a hash table?" — hash gives point lookups only; B+ tree gives point + range + ordered scans, and stays balanced on disk pages.
- "Why not index everything?" — write amplification and storage; each index slows every write.
- "Explain isolation levels" — reproduce the anomaly table and give one concrete story per anomaly (e.g. phantom: two reads of "accounts with balance > 100" disagree).
- "SQL or NoSQL for X?" — reason from access patterns, consistency needs, and scale; saying "Postgres until it hurts" with justification lands well.
- Be able to write the SQL for a join plus a `GROUP BY` cold; it gets asked alongside theory.

## Roadmap

1. Relational model: relations, keys, constraints, relational algebra
2. SQL fluency and [[SQL-Joins-and-Query-Plans]] — join algorithms, `EXPLAIN`
3. [[Database-Indexing]] — B+ tree vs LSM tree, composite and covering indexes
4. [[Transactions-and-Isolation-Levels]] — ACID, MVCC, locking, anomalies
5. [[Normalization]] — functional dependencies, 1NF → BCNF, when to denormalize
6. Storage and recovery: pages, buffer pool, write-ahead logging
7. Capstone: design an e-commerce order schema, write its 5 hottest queries, index them, and justify the isolation level

## Key Concepts

Primary / foreign / candidate key · functional dependency · selectivity · cardinality estimation · B+ tree fan-out · write amplification · MVCC · two-phase locking · WAL · checkpoint · write skew

## More Interview Questions (with answers)

- **Clustered vs non-clustered index?** — A clustered index determines the physical order of rows (InnoDB stores rows inside the primary-key B+ tree); a secondary index stores keys plus a pointer (in InnoDB, the primary key) and may need a second lookup.
- **What is MVCC?** — Writers create new row versions instead of overwriting; readers see a snapshot as of their start, so reads don't block writes.
- **WHERE vs HAVING?** — `WHERE` filters rows before grouping; `HAVING` filters groups after aggregation.
- **Why avoid `SELECT *` in hot paths?** — It prevents index-only (covering) scans, moves more bytes, and silently changes when columns change.

## Coding Exercises

- [ ] Nth-highest salary, running totals with window functions, top-N per group
- [ ] Reproduce a lost update with two `psql` sessions, then fix it with `SELECT ... FOR UPDATE` or an atomic `UPDATE ... SET x = x + 1`
- [ ] Run `EXPLAIN ANALYZE` before/after adding a composite index and explain the change
- [ ] Tiny key-value store: append-only log + in-memory hash index, then add compaction

## Connections

- **System design** — shard keys, read replicas, and caching strategies depend on index and transaction semantics; see [[Distributed-Systems]].
- **Cybersecurity** — [[SQL-Injection]] (parameterize queries), least-privilege DB roles, encryption at rest, audit logging of privileged queries.
- **AI** — feature stores and vector search sit beside (or inside) relational engines; RAG pipelines often combine SQL filters with embedding similarity; see [[RAG-Retrieval-Augmented-Generation]].

## Related

- [[Trees-and-BSTs]]
- [[Hash-Tables]]
- [[Big-O-Notation]]
- [[Distributed-Systems]]
- [[Operating-Systems]]
