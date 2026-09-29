---
title: Prompt Library
slug: prompt-library
description: "Entry point to the prompt library: fast picker, usage rules, and when not to use a prompt."
domain: prompts
category: overview
type: index
difficulty: beginner
status: evergreen
tags: [prompts]
prerequisites: []
related: [Prompt-Pack, Prompt-Variables-Guide]
order: 1
---
# Prompt Library

Reusable operating procedures for AI work, not one-time requests. The pack ([[Prompt-Pack]]) holds 20 prompts; this file is how to run them well.

## Fast Picker

| Situation | Prompt # |
|-----------|----------|
| PR/code needs review | 1 Senior Code Reviewer |
| Stuck on a bug > 30 min | 2 Debug Partner |
| Designing anything multi-component | 3 System Design Mentor |
| New feature touching auth/data/input | 4 Threat Modeling Assistant |
| Paper to digest | 5 Paper Reading Accelerator |
| Interview in < 2 weeks | 8 DSA Drill + 20 Learning Path |
| New repo to understand | 19 Codebase Explainer |
| Shipping a project | 10 README Architect + 15 Secure Coding |

## Usage Rules

1. **Fill every `{variable}` with specifics** — vague input, vague output. "FastAPI service, 3 endpoints, SQLite, deployed on one VM" beats "my project".
2. **Paste real artifacts** (code, logs, specs) instead of describing them.
3. **Demand verifiable output**: tests, checklists, runnable commands — reject prose-only answers by re-asking.
4. **Route the output**: solution → project repo; insight → vault note; reusable pattern → this library.

## When NOT to Use a Prompt

- Question answerable by one search or a man page — faster manually
- Learning phase where the struggle IS the point (first DSA attempts — drill mode only after solving)
- Anything you'd need to verify line-by-line anyway and can't (crypto implementations, legal)

## Improving the Pack

Versioning, failure notes, and the fix table live in [[Prompt-Variables-Guide]] (single source; not repeated here).

Deep theory: `09-AI-Toolkit/Prompt-Engineering-Guide.md`.
