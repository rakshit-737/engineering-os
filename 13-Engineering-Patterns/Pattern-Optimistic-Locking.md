---
title: Optimistic Locking
description: Detect concurrent updates with a version column and reject stale writes instead of holding locks.
domain: patterns
category: database
type: pattern
difficulty: intermediate
status: evergreen
tags: [database, concurrency]
prerequisites: []
related: [Pattern-Soft-Delete, Pattern-Idempotency-Keys]
order: 80
---
# Optimistic Locking

## Problem

Two users open the same record, both edit, both save. The second save silently overwrites the first (lost update). Pessimistic row locks held across user think-time do not scale and cause deadlocks and timeouts.

## Solution

Add an integer `version` column. Reads return the version; updates include `WHERE id = :id AND version = :v` and set `version = version + 1`. If zero rows were updated, someone else changed the record first: return `409 Conflict` (or HTTP `412` with `If-Match`/ETag) so the client can reload and merge.

## Example

```python
from fastapi import FastAPI, Header, HTTPException, Response
from pydantic import BaseModel

app = FastAPI()

class DocUpdate(BaseModel):
    title: str
    body: str

@app.get("/docs/{doc_id}")
def get_doc(doc_id: int, response: Response):
    row = db.execute("SELECT id, title, body, version FROM docs WHERE id=:id", {"id": doc_id}).one()
    response.headers["ETag"] = f'"{row.version}"'
    return {"id": row.id, "title": row.title, "body": row.body}

@app.put("/docs/{doc_id}")
def update_doc(doc_id: int, upd: DocUpdate, if_match: str = Header(...)):
    expected = int(if_match.strip('"'))
    result = db.execute(
        "UPDATE docs SET title=:t, body=:b, version=version+1 "
        "WHERE id=:id AND version=:v",
        {"t": upd.title, "b": upd.body, "id": doc_id, "v": expected})
    if result.rowcount == 0:
        raise HTTPException(412, "Document changed since you loaded it; reload and retry")
    db.commit()
    return {"version": expected + 1}
```

## Tradeoffs

- No locks held, high concurrency when conflicts are rare.
- Under high contention, most writes fail and retry, wasting work (use pessimistic locks or queues there).
- Clients must handle conflicts in UX.

## Failure modes

- Forgetting the version predicate in one code path reintroduces lost updates.
- Bulk update scripts bypass versioning.
- Using timestamps as versions with coarse clock resolution misses conflicts.

## Security implications

- Conflict responses must not reveal fields the caller is not authorized to see.
- The version check does not replace authorization; still verify the caller may edit the row.

## When to use

- User-edited records, admin panels, configuration objects, low-contention updates.

## When not to use

- Hot counters or inventory with heavy contention; use atomic updates (`SET stock = stock - 1 WHERE stock > 0`) or serialization instead.

Back to [[Patterns-Index]].
