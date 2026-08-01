# SQL Cheat Sheet — Joins, Windows, and Interview Classics

Standard SQL; notes flag PostgreSQL/MySQL differences where they bite.

## Joins — What Each One Keeps

```
  A = left table, B = right table

  INNER JOIN        LEFT JOIN         RIGHT JOIN        FULL OUTER JOIN
    A ∩ B             A (all) + ∩       ∩ + B (all)       A + B (all)
   ┌───┐             ┌───┐             ┌───┐             ┌───┐
  A│ ▒▒│B          A│███▒│B          A│ ▒██│B          A│██▒██│B
   └───┘             └───┘             └───┘             └───┘
  only matches      unmatched A rows  unmatched B rows  unmatched either side
                    get NULL B cols   get NULL A cols   gets NULLs
```

| Join | Keeps | Typical question |
|---|---|---|
| `INNER JOIN` | only rows with a match on both sides | "orders with their customers" |
| `LEFT JOIN` | all left rows; right side NULL if no match | "all customers, orders if any" |
| `RIGHT JOIN` | mirror of LEFT (rare — rewrite as LEFT) | — |
| `FULL OUTER JOIN` | everything, NULL-padded | reconciliation/diff of two tables |
| `CROSS JOIN` | every A × every B (no ON clause) | generating combinations |
| `SELF JOIN` | table joined to itself with aliases | employee → manager |

```sql
-- Anti-join: customers with NO orders (the #1 LEFT JOIN use)
SELECT c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

Gotcha: a `WHERE` on the right table's columns turns a LEFT JOIN back into an INNER JOIN —
put right-table filters in the `ON` clause instead.

## GROUP BY / HAVING

```sql
SELECT dept, COUNT(*) AS n, AVG(salary) AS avg_sal
FROM employees
WHERE active = true          -- WHERE filters ROWS, before grouping
GROUP BY dept
HAVING COUNT(*) >= 3         -- HAVING filters GROUPS, after aggregation
ORDER BY avg_sal DESC;
```

- Every non-aggregated SELECT column must appear in `GROUP BY` (MySQL's loose mode hides bugs).
- `COUNT(*)` counts rows; `COUNT(col)` skips NULLs; `COUNT(DISTINCT col)` counts unique.
- Pipeline order: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`.

## Window Functions

Aggregate-like power **without collapsing rows**. Example table `sales`:

| id | dept | seller | amount |
|---|---|---|---|
| 1 | east | ana | 500 |
| 2 | east | bob | 300 |
| 3 | east | cai | 300 |
| 4 | west | dee | 400 |

```sql
SELECT dept, seller, amount,
  ROW_NUMBER() OVER (PARTITION BY dept ORDER BY amount DESC) AS rn,
  RANK()       OVER (PARTITION BY dept ORDER BY amount DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY dept ORDER BY amount DESC) AS drnk
FROM sales;
```

| dept | seller | amount | rn | rnk | drnk |
|---|---|---|---|---|---|
| east | ana | 500 | 1 | 1 | 1 |
| east | bob | 300 | 2 | 2 | 2 |
| east | cai | 300 | 3 | 2 | 2 |
| west | dee | 400 | 1 | 1 | 1 |

- `ROW_NUMBER` — unique, ties broken arbitrarily. `RANK` — ties share, then gaps (1,2,2,4).
  `DENSE_RANK` — ties share, no gaps (1,2,2,3).

```sql
-- LAG/LEAD: previous/next row's value — day-over-day change
SELECT day, revenue,
  revenue - LAG(revenue) OVER (ORDER BY day) AS change_vs_prev
FROM daily_revenue;

-- Running total and share-of-partition
SELECT dept, seller, amount,
  SUM(amount) OVER (PARTITION BY dept ORDER BY amount DESC) AS running_total,
  amount * 1.0 / SUM(amount) OVER (PARTITION BY dept)       AS pct_of_dept
FROM sales;
```

| dept | seller | amount | running_total | pct_of_dept |
|---|---|---|---|---|
| east | ana | 500 | 500 | 0.45 |
| east | bob | 300 | 1100* | 0.27 |
| east | cai | 300 | 1100* | 0.27 |
| west | dee | 400 | 400 | 1.00 |

\* ties enter the running sum together; add a tiebreaker (`ORDER BY amount DESC, id`) for strict steps.

## CTEs (WITH)

```sql
WITH dept_avg AS (
  SELECT dept, AVG(salary) AS avg_sal FROM employees GROUP BY dept
)
SELECT e.name, e.salary, d.avg_sal
FROM employees e
JOIN dept_avg d USING (dept)
WHERE e.salary > d.avg_sal;          -- above their department's average
```

```sql
-- Recursive CTE: walk an org chart
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS depth FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.depth + 1
  FROM employees e JOIN chain c ON e.manager_id = c.id
)
SELECT * FROM chain ORDER BY depth;
```

CTEs beat nested subqueries for readability and can be referenced multiple times.
Windows can't appear in `WHERE`/`HAVING` — compute in a CTE, filter outside (see dedup below).

## Indexes & EXPLAIN

```sql
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_cust_date ON orders (customer_id, created_at);  -- composite
EXPLAIN ANALYZE SELECT ... ;   -- Postgres: real timings. MySQL: EXPLAIN / EXPLAIN ANALYZE 8.0+
```

| Rule | Why |
|---|---|
| Index columns used in WHERE / JOIN ON / ORDER BY | that's what the planner can use |
| Composite `(a, b)` serves `a` and `a,b` — not `b` alone | leftmost-prefix rule |
| `WHERE lower(email) = ...` skips a plain index | index the expression, or compare raw |
| Leading-wildcard `LIKE '%x'` can't use a btree | full scan; consider full-text search |
| Every index slows writes and eats space | index deliberately, not defensively |
| In EXPLAIN, worry about Seq Scan on big tables and row-estimate ≫ actual | stale stats → `ANALYZE` |

## Interview Classics

```sql
-- 1. Second-highest salary (NULL-safe if fewer than 2 distinct values)
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- 1b. Nth-highest, the window way (n=2)
SELECT DISTINCT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r FROM employees
) t WHERE r = 2;

-- 2. Find duplicates
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;

-- 3. Delete duplicates, keep lowest id (dedup)
DELETE FROM users
WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email);
-- MySQL errors (1093) on deleting from a table its subquery reads — wrap it:
--   ... NOT IN (SELECT keep_id FROM (SELECT MIN(id) AS keep_id FROM users GROUP BY email) t);
-- window version: rank duplicates in a CTE, delete WHERE rn > 1

-- 4. Top-N per group (top 2 earners per dept)
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
  FROM employees
) t WHERE rn <= 2;

-- 5. Employees earning more than their manager (self join)
SELECT e.name
FROM employees e JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;

-- 6. Consecutive-days streak core trick: date minus row_number is constant per streak
SELECT user_id, login_date,
  login_date - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) * INTERVAL '1 day' AS grp
FROM logins;   -- then GROUP BY user_id, grp and COUNT(*) for streak lengths
```
