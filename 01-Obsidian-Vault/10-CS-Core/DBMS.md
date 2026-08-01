---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# DBMS

Hub: [[CS-Core-Index]]

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

## Related

- [[Trees-and-BSTs]]
- [[Hash-Tables]]
- [[Big-O-Notation]]
- [[Distributed-Systems]]
- [[Operating-Systems]]
