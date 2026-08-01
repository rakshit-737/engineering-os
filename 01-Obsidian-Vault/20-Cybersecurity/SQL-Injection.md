---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# SQL Injection

Hub: [[Cybersecurity-Index]]

## Core Idea

SQL injection happens when untrusted input is concatenated into a query string, so attacker-supplied text is parsed as SQL *code* rather than treated as *data*. This lets an attacker change the query's structure — bypass auth, dump tables, or (with stacked queries) modify data. It is OWASP A03 (Injection). The fix is architectural: parameterized queries keep the code/data boundary intact.

## Details

**Why it works — the code/data confusion**

```python
# VULNERABLE: input becomes part of the SQL text
username = request.form["username"]
query = "SELECT * FROM users WHERE name = '" + username + "'"
```

With `username = ' OR 1=1 --`, the query the database parses becomes:

```sql
SELECT * FROM users WHERE name = '' OR 1=1 --'
```

`OR 1=1` is always true and `--` comments out the rest, so it returns every row — a canonical textbook auth bypass. The database has no way to know the attacker's text wasn't meant to be SQL, because it arrived as SQL.

**The fix — parameterization (prepared statements)**

```python
# SAFE: query structure is fixed; input is bound as a value
username = request.form["username"]
cur.execute("SELECT * FROM users WHERE name = %s", (username,))
```

The driver sends the query template and the parameter over separate channels. `' OR 1=1 --` is now compared as a literal string value for `name` — it matches no user. The boundary can never be crossed by data content, which is why this is a complete fix, not a filter that can be evaded.

**Variants**
- Classic/in-band: results returned directly (`UNION SELECT` to append attacker rows).
- Blind boolean: no output, but page differs on true/false (`AND 1=1` vs `AND 1=2`).
- Blind time-based: infer data via `pg_sleep(5)` / `SLEEP(5)` delays.
- Second-order: payload stored now, executed later when a different query reads it back.

**Defense in depth (parameterization is primary)**
1. Parameterized queries / prepared statements — the real fix. Use everywhere.
2. ORMs (SQLAlchemy, Django ORM) — parameterize by default, but raw-SQL escape hatches reintroduce risk.
3. Allowlist validation for things that can't be parameters (column/table names, `ORDER BY` direction) — bind a fixed set, never interpolate raw input.
4. Least privilege DB user — app user without `DROP`/`DELETE`/other-schema access caps the damage even if injection occurs (see [[Least-Privilege]]).
5. WAF as a speed bump, not a fix — regex filters get bypassed with encoding/comments.

**Common pitfalls**
- "Escaping quotes myself" — misses numeric contexts, encodings, and edge cases; parameterize instead.
- Blocklisting keywords like `OR`, `UNION` — trivially bypassed (`/*!UNION*/`, case tricks) and breaks legit input (`O'Brien`).
- String-building the query then binding — if the concatenation already happened, binding is too late.
- Trusting ORM blindly while using `.raw()` / `.extra()` with f-strings.

## Interview Angle

- Explain *why* parameterization works — separate channels for code vs data — not just "use prepared statements." That depth is the differentiator.
- Walk the `' OR 1=1 --` example on a whiteboard: show the concatenated string, point at where code/data merge, then show the parameterized version comparing it as a literal.
- Expect: "Is escaping enough?" No — brittle, context-dependent; parameterize.
- Expect: "How do you handle a dynamic ORDER BY column?" Can't be a bind parameter → allowlist the permitted column names and map input to them.
- Expect: "It's an internal tool, does it matter?" Yes — second-order and insider threats; also defense in depth with a least-privilege DB user.
- Reference the runnable proof: `11-Project-Templates/Secure-Coding-Examples/sql_injection_prevention.py`.

## Related

- [[OWASP-Top-10]]
- [[Authentication-vs-Authorization]]
- [[Least-Privilege]]
- [[XSS]]
- [[Cybersecurity-Index]]
