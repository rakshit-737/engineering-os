---
title: Input Validation at Boundaries
description: Parse and validate all untrusted input once, at the system edge, into strict typed objects.
domain: patterns
category: security
type: pattern
difficulty: beginner
status: evergreen
tags: [security, validation, api]
prerequisites: []
related: [Pattern-Secure-Defaults, Pattern-Defense-in-Depth, Secure-Coding-Examples]
order: 160
---
# Input Validation at Boundaries

## Problem

Validation scattered through the codebase is inconsistent: one handler checks length, another forgets, a queue consumer trusts everything. Untrusted strings reach SQL, file paths, shell commands, and templates, producing injection, path traversal, and crashes.

## Solution

Treat every entry point (HTTP, queue message, file upload, CLI arg, webhook, LLM output) as a trust boundary. Parse input into strict typed objects with allowlists, length limits, and formats, rejecting anything else ("parse, don't validate"). Inner code accepts only the typed objects. Output encoding and parameterized queries remain as additional layers, since validation alone does not prevent injection into every sink.

## Example

```python
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, StringConstraints

Username = Annotated[str, StringConstraints(pattern=r"^[a-z0-9_]{3,32}$")]

class CreateReport(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)  # unknown fields rejected
    owner: Username
    format: Literal["pdf", "csv"]                       # allowlist, not blocklist
    title: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    webhook: HttpUrl | None = None                      # still needs SSRF checks before fetching
    rows: Annotated[int, Field(ge=1, le=10_000)]

# FastAPI rejects invalid bodies with 422 before the handler runs:
# @app.post("/reports")
# def create(req: CreateReport): generate(req)   # generate() receives only valid data

# Queue consumer: same model, same rules
def handle_message(raw: bytes) -> None:
    req = CreateReport.model_validate_json(raw)          # raises ValidationError on bad input
    generate(req)
```

## Tradeoffs

- Clear, testable contract and early rejection, at the cost of schema maintenance.
- Overly strict schemas reject legitimate edge cases (international names); validate structure, not culture.

## Failure modes

- Blocklists ("strip <script>") that miss encodings and variants.
- Validating, then using the raw input instead of the parsed object.
- Validating at the HTTP layer but not in queue consumers or batch imports.
- Treating URL format validation as SSRF protection (see Secure-Coding-Examples `url_validation_ssrf.py`).

## Security implications

- Validation reduces attack surface but does not replace context-specific output encoding, parameterized queries, or path canonicalization.
- Error messages should say what is wrong without echoing raw input into HTML or logs unescaped.
- Runnable examples: [[Secure-Coding-Examples]].

## When to use

- Every trust boundary, always.

## When not to use

- Not applicable as a whole; only the strictness level varies. Internal function arguments between trusted modules need type checks, not re-validation.

Back to [[Patterns-Index]].
