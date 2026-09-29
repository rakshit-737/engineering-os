---
title: Golden Tests
description: Compare complex outputs against reviewed, checked-in expected files and fail on any diff.
domain: patterns
category: testing
type: pattern
difficulty: beginner
status: evergreen
tags: [testing, snapshot, regression]
prerequisites: []
related: [Pattern-Test-Pyramid, Pattern-LLM-as-Judge]
order: 230
---
# Golden Tests

## Problem

Some outputs are too large or structured to assert field by field: compiler output, rendered HTML, reports, CLI help, serialized configs, prompt templates. Hand-written assertions cover only a few fields and miss regressions elsewhere.

## Solution

Render the output, normalize nondeterminism (timestamps, ordering, random IDs), and compare it to a golden file committed in the repo. On mismatch, show a diff and fail. An explicit update mode regenerates goldens, and the diff is reviewed in the pull request like any other code.

## Example

```python
import json, os, re
from pathlib import Path

GOLDEN_DIR = Path(__file__).parent / "golden"
UPDATE = os.environ.get("UPDATE_GOLDEN") == "1"

def normalize(text: str) -> str:
    text = re.sub(r"\d{4}-\d{2}-\d{2}T[\d:.]+Z?", "<TIMESTAMP>", text)
    text = re.sub(r"[0-9a-f]{8}-[0-9a-f-]{27}", "<UUID>", text)
    return text.replace("\r\n", "\n")

def assert_golden(name: str, actual: str) -> None:
    path = GOLDEN_DIR / name
    actual = normalize(actual)
    if UPDATE or not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(actual, encoding="utf-8")
        return
    expected = path.read_text(encoding="utf-8")
    assert actual == expected, f"golden mismatch for {name}; rerun with UPDATE_GOLDEN=1 and review the diff"

def test_invoice_render():
    html = render_invoice(order_fixture())            # function under test
    assert_golden("invoice.html", html)

def test_api_schema_stable():
    assert_golden("openapi.json", json.dumps(app.openapi(), indent=2, sort_keys=True))
```

## Tradeoffs

- Very cheap broad coverage versus brittleness to intentional changes.
- Value depends entirely on reviewers actually reading golden diffs.

## Failure modes

- Blind regeneration ("just update the snapshots") turns the test into a no-op.
- Unnormalized nondeterminism causes flaky failures.
- Huge goldens nobody can review.

## Security implications

- Goldens are committed files: never capture real secrets, tokens, or PII in them.
- Pinning an OpenAPI schema golden catches accidental exposure of new fields in responses.

## When to use

- Renderers, serializers, CLIs, code generators, API schemas, prompt templates.

## When not to use

- Outputs that are legitimately nondeterministic in meaning (free-form LLM text; use [[Pattern-LLM-as-Judge]] or property checks).

Back to [[Patterns-Index]].
