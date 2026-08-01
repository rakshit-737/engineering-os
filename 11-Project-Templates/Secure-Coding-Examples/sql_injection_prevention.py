"""SQL injection prevention: parameterized queries only.

Threat: attacker-controlled strings altering query structure.
Principle: SQL structure is code; user input is data. Never mix via f-strings.
"""

from __future__ import annotations

import sqlite3


def setup_demo_db() -> sqlite3.Connection:
    conn = sqlite3.connect(":memory:")
    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, secret TEXT)")
    conn.executemany(
        "INSERT INTO users (name, secret) VALUES (?, ?)",
        [("alice", "alice-secret"), ("bob", "bob-secret")],
    )
    return conn


def find_user_vulnerable(conn: sqlite3.Connection, name: str) -> list[tuple]:
    """DO NOT USE — demonstration of the anti-pattern.

    f-string builds the query, so input like ' OR '1'='1 changes the
    query's structure and dumps every row.
    """
    query = f"SELECT id, name FROM users WHERE name = '{name}'"
    return conn.execute(query).fetchall()


def find_user_safe(conn: sqlite3.Connection, name: str) -> list[tuple]:
    """Placeholder keeps input as data; injection text just fails to match."""
    return conn.execute("SELECT id, name FROM users WHERE name = ?", (name,)).fetchall()


if __name__ == "__main__":
    conn = setup_demo_db()
    injection = "' OR '1'='1"

    leaked = find_user_vulnerable(conn, injection)
    assert len(leaked) == 2, "vulnerable version leaks all rows (that's the lesson)"

    safe = find_user_safe(conn, injection)
    assert safe == [], "safe version returns nothing for injection input"
    assert find_user_safe(conn, "alice") == [(1, "alice")]

    print("sql_injection_prevention: parameterized query blocked the injection")
