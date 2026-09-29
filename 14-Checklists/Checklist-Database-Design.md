---
title: "Checklist: Database Design"
description: Schema, indexing, migration, and operations checklist for relational databases.
domain: checklists
category: engineering
type: checklist
difficulty: intermediate
status: evergreen
tags: [database, sql, postgres]
prerequisites: []
related: [Pattern-Optimistic-Locking, Pattern-Soft-Delete, Pattern-Transactional-Outbox]
order: 30
---
# Checklist: Database Design

Written with PostgreSQL in mind; most items apply to any relational database.

## Modeling

- [ ] List the top 5 queries by expected frequency before designing tables.
- [ ] Normalize to 3NF by default; denormalize only for a measured read problem and document it.
- [ ] Give every table a primary key; prefer `bigint` identity or UUIDv7 over natural keys.
- [ ] Declare foreign keys with explicit `ON DELETE` behavior.
- [ ] Use `NOT NULL` by default; allow NULL only where absence has meaning.
- [ ] Use `CHECK` constraints for domain rules (e.g. `quantity > 0`).
- [ ] Use `timestamptz` for timestamps and store UTC.
- [ ] Use `numeric` or integer minor units for money, never `float`.
- [ ] Add `created_at` and `updated_at` to mutable tables.
- [ ] Decide deletion semantics per table: hard delete, or [[Pattern-Soft-Delete]] with a retention job.

## Indexing

- [ ] Index every foreign key column used in joins or cascaded deletes.
- [ ] Create composite indexes in the column order your WHERE and ORDER BY use.
- [ ] Add partial unique indexes where uniqueness applies to a subset (e.g. live rows).
- [ ] Run `EXPLAIN (ANALYZE, BUFFERS)` on each top query against realistic data volume.
- [ ] Remove indexes that `pg_stat_user_indexes` shows as unused after a representative period.

## Concurrency and integrity

- [ ] Identify read-modify-write flows and protect them ([[Pattern-Optimistic-Locking]] or `SELECT ... FOR UPDATE`).
- [ ] Use atomic updates for counters (`SET n = n + 1`) instead of read-then-write.
- [ ] Keep transactions short; never hold one open across a network call to another service.
- [ ] Use the outbox for events that must match committed state ([[Pattern-Transactional-Outbox]]).

## Migrations

- [ ] Version every schema change in a migration tool (Alembic, Flyway, Prisma migrate).
- [ ] Make migrations backward compatible with the currently deployed code (expand, migrate, contract).
- [ ] Create indexes on large tables with `CREATE INDEX CONCURRENTLY`.
- [ ] Backfill large tables in batches, not one giant UPDATE.
- [ ] Test each migration against a copy of production-sized data before release.
- [ ] Write down the rollback step for each migration, or mark it as one-way.

## Security and operations

- [ ] Connect the app with a least-privilege role (no superuser, no DDL at runtime).
- [ ] Use a separate read-only role for analytics and replicas.
- [ ] Enforce TLS for all client connections.
- [ ] Set `statement_timeout` and `idle_in_transaction_session_timeout` on the app role.
- [ ] Use a connection pooler (PgBouncer or the driver pool) sized below `max_connections`.
- [ ] Enable automated backups and perform a restore test on a schedule.
- [ ] Encrypt at rest and classify columns holding PII.
- [ ] Alert on replication lag, disk usage, connection saturation, and long-running queries.

Back to [[Checklists-Index]].
