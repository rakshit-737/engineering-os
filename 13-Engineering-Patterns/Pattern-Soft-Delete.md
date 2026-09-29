---
title: Soft Delete
description: Mark rows as deleted instead of removing them so deletions are reversible and auditable.
domain: patterns
category: database
type: pattern
difficulty: beginner
status: evergreen
tags: [database, data-lifecycle]
prerequisites: []
related: [Pattern-Optimistic-Locking, Checklist-Database-Design]
order: 70
---
# Soft Delete

## Problem

Hard `DELETE` is irreversible: an accidental deletion or a buggy script destroys data and breaks foreign-key history (invoices pointing at a deleted customer). Support teams need to restore records, and auditors ask who removed what.

## Solution

Add a nullable `deleted_at` timestamp (and optionally `deleted_by`). "Delete" sets it; normal queries filter `deleted_at IS NULL`, ideally through a view or ORM default scope so no query forgets. Unique constraints become partial (`WHERE deleted_at IS NULL`). A retention job hard-deletes or anonymizes rows after the retention window, which is also how you honor erasure requests.

## Example

```sql
ALTER TABLE customers ADD COLUMN deleted_at timestamptz, ADD COLUMN deleted_by bigint;

-- email must be unique among live rows only
DROP INDEX IF EXISTS customers_email_key;
CREATE UNIQUE INDEX customers_email_live ON customers (lower(email)) WHERE deleted_at IS NULL;

-- application reads go through this view
CREATE VIEW live_customers AS
  SELECT * FROM customers WHERE deleted_at IS NULL;

-- "delete"
UPDATE customers SET deleted_at = now(), deleted_by = :actor
 WHERE id = :id AND deleted_at IS NULL;

-- restore
UPDATE customers SET deleted_at = NULL, deleted_by = NULL WHERE id = :id;

-- retention job: purge PII after 30 days (adjust to your policy)
UPDATE customers
   SET email = 'deleted+' || id || '@invalid', name = NULL, phone = NULL
 WHERE deleted_at < now() - interval '30 days' AND email NOT LIKE 'deleted+%';
```

## Tradeoffs

- Recoverability and audit history versus every query needing a filter.
- Tables and indexes keep growing unless purged.
- Unique constraints and foreign keys need rethinking.

## Failure modes

- One query forgets the filter and shows deleted data (use views or default scopes, and test for it).
- Soft-deleted parent with live children leaves orphans visible in some screens.
- Treating soft delete as erasure violates privacy law when users request deletion.

## Security implications

- Soft-deleted data is still personal data: it must be covered by retention policy and erasure requests (purge or anonymize).
- Access checks must treat soft-deleted records as absent, or deleted accounts can still authenticate or be referenced.

## When to use

- User-facing records where undo, support restores, or audit trails matter.

## When not to use

- High-churn ephemeral data (sessions, carts), or data you are legally required to erase promptly.

Back to [[Patterns-Index]].
