---
title: API Versioning
description: Evolve a public API without breaking existing clients by making breaking changes explicit and versioned.
domain: patterns
category: api
type: pattern
difficulty: intermediate
status: evergreen
tags: [api, compatibility]
prerequisites: []
related: [Pattern-Backend-for-Frontend, Pattern-Contract-Testing, Checklist-API-Design]
order: 20
---
# API Versioning

## Problem

Clients you do not control (mobile apps, partners) upgrade slowly. Renaming a field, changing a type, or tightening validation silently breaks them. Without a versioning policy, every change is either frozen forever or a production incident.

## Solution

Prefer additive, backward-compatible change (new optional fields, new endpoints). Reserve a new major version for breaking changes, expose it explicitly (URL prefix `/v2`, or a header such as `Accept: application/vnd.example.v2+json`), run versions side by side behind shared domain logic, and retire old versions with announced deprecation dates (`Deprecation` and `Sunset` response headers).

## Example

```python
from fastapi import FastAPI, APIRouter, Response
from pydantic import BaseModel

app = FastAPI()
v1, v2 = APIRouter(prefix="/v1"), APIRouter(prefix="/v2")

class UserV1(BaseModel):
    id: int
    name: str                 # full name as one string

class UserV2(BaseModel):
    id: int
    given_name: str
    family_name: str          # breaking split -> new major version

def load_user(uid: int) -> dict:            # shared domain logic
    return {"id": uid, "given": "Ada", "family": "Lovelace"}

@v1.get("/users/{uid}", response_model=UserV1)
def get_user_v1(uid: int, response: Response):
    u = load_user(uid)
    response.headers["Deprecation"] = "true"
    response.headers["Sunset"] = "Wed, 31 Mar 2027 00:00:00 GMT"
    return UserV1(id=u["id"], name=f'{u["given"]} {u["family"]}')

@v2.get("/users/{uid}", response_model=UserV2)
def get_user_v2(uid: int):
    u = load_user(uid)
    return UserV2(id=u["id"], given_name=u["given"], family_name=u["family"])

app.include_router(v1); app.include_router(v2)
```

## Tradeoffs

- URL versions are visible and cache-friendly but coarse; header versions are finer-grained but easy to forget in clients.
- Every live version multiplies test and support surface.
- Additive-only evolution avoids versions but accumulates dead fields.

## Failure modes

- Shipping a breaking change inside an existing version because it looked additive (e.g. a new required field, changed enum values).
- Old versions never retired because usage is not measured.
- Versions forked at the domain layer, so bug fixes land in one version only.

## Security implications

- Old versions keep old vulnerabilities alive; security fixes must be backported or the version shut down.
- Deprecated endpoints are often less monitored, so log and rate-limit them like current ones.
- Do not let a version header select weaker auth or validation paths.

## When to use

- Public or partner APIs, mobile backends with long-lived app versions.

## When not to use

- Internal APIs where you deploy client and server together; use contract tests and coordinated changes instead.

Back to [[Patterns-Index]].
