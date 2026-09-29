---
title: Prompt Variables Guide
description: Variable conventions, fill quality, failure-to-fix table, and versioning workflow for the prompt pack.
domain: prompts
category: prompt-pack
type: guide
difficulty: beginner
status: evergreen
tags: [prompts, llm]
prerequisites: []
related: [Prompt-Pack]
order: 20
---
# Prompt Variables Guide

Use this variable system to keep the prompts in [[Prompt-Pack]] reusable. This is the canonical home for variable conventions and prompt versioning.

## Core Variables

- `{goal}` - The primary objective
- `{context}` - Project, domain, or constraints
- `{input}` - Data, code, or text to process
- `{output_format}` - Markdown table, checklist, patch, JSON, etc.
- `{quality_bar}` - Accuracy, depth, production quality

## Reliability Add-ons

- Ask for assumptions first
- Ask for edge cases and failure modes
- Ask for test plan and validation
- Ask for reusable artifacts (templates/scripts/docs)

## Worked Example — bad vs good fill

Prompt 2 (Debug Partner), variable `{bug_description}`:

- Bad: `my API is slow`
- Good: `FastAPI /items endpoint p95 went 80ms -> 2.1s after adding the search filter; SQLite backend, 50k rows, EXPLAIN shows full table scan; only filtered queries are slow`

The good fill contains: symptom, magnitude, trigger change, environment, evidence already gathered. Every variable fill should carry those five when debugging.

## Output Failure → Fix Table

| Output problem | Fix in prompt |
|----------------|---------------|
| Generic advice | Add real artifact (code/log/spec) + "reference specific lines" |
| Too long, no structure | Specify exact output format + max length per section |
| Confidently wrong | Add "state assumptions first; mark uncertain claims" |
| Ignores constraints | Move constraints to the END of the prompt + number them |
| Solves the wrong problem | Add one example of desired output shape |

## Prompt Evolution Workflow

1. Track where prompt failed (inline `> vN note:` under the prompt)
2. Add explicit constraints
3. Add better examples
4. Version prompts as `v1`, `v2`, `v3`
5. Delete prompts that fail twice unedited