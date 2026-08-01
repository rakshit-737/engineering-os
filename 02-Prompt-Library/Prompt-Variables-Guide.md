# Prompt Variables Guide

Use this variable system to keep prompts reusable.

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

## Prompt Evolution Workflow

1. Track where prompt failed
2. Add explicit constraints
3. Add better examples
4. Version prompts as `v1`, `v2`, `v3`
5. Keep changelog of improvements