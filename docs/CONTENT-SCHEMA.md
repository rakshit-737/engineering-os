# Content Schema

Engineering OS keeps Markdown as the source of truth. The web app is an interface over it:

```
Markdown (numbered folders) -> frontmatter -> scripts/build-content.ts -> public/content/*.json -> React UI + search + graph
```

## Rules

1. Every `.md` file under a numbered folder (`00-*` ... `99-*`) is ingested, except `node_modules`, `.opencode`, `dist`.
2. **Slug = file name without `.md`, lowercased.** Slugs must be unique across the whole repo. Before creating a file, check no other file has the same name.
3. File names use `Title-Case-With-Hyphens.md` (e.g. `Rate-Limiting.md`, `Case-Study-URL-Shortener.md`).
4. Link between notes with Obsidian wikilinks: `[[File-Name]]` or `[[File-Name|label]]`. The app resolves them by slug; the link checker fails the build on unresolved wikilinks.
5. Diagrams use fenced ` ```mermaid ` blocks (render on GitHub and on the site).
6. Checklists use GitHub task syntax `- [ ] item`. The app turns every task item into a trackable checkbox (progress stored in localStorage).
7. No secrets, no fake statistics, no unverifiable claims. If something is unknown, write `> TODO:` instead of inventing it.
8. First heading is `# Title`. Use `##` for sections.

## Frontmatter

```yaml
---
title: Rate Limiting                 # required
description: One-line summary used in cards and search.   # required
domain: system-design                # required, see list below
category: hld-concepts               # required, sub-group inside the domain
type: concept                        # required, see list below
difficulty: intermediate             # beginner | intermediate | advanced
status: evergreen                    # evergreen | draft | todo
tags: [distributed-systems, api]
prerequisites: [Load-Balancing]      # file names (slugs) of notes to read first
related: [API-Gateway, Idempotency]  # file names (slugs)
order: 10                            # optional, sort order inside category
---
```

### `domain` values

| domain | meaning |
|---|---|
| `command-center` | dashboards, reviews, goals, journals |
| `cs-core` | CS fundamentals curriculum |
| `system-design` | HLD concepts + case studies |
| `lld` | low-level design, OOP principles, GoF patterns |
| `ai` | AI / ML / LLM engineering |
| `cybersecurity` | security knowledge, playbooks, labs |
| `dsa` | algorithm patterns and problems |
| `career` | roadmaps, resume, interviews, applications |
| `research` | research workflow and templates |
| `academic` | courses, exams, study systems |
| `developer` | tooling, cheat sheets, dev templates |
| `patterns` | engineering pattern library |
| `checklists` | engineering checklists |
| `adr` | architecture decision records |
| `projects` | project lab, templates, maturity model |
| `prompts` | prompt library |
| `automation` | scripts and CI templates |

### `type` values

`concept`, `pattern`, `case-study`, `problem`, `roadmap`, `checklist`, `template`, `playbook`, `adr`, `guide`, `cheatsheet`, `index`, `tracker`

### Type-specific optional fields

- `problem` (DSA): `pattern: sliding-window`, `source: "LeetCode 3"`, `languages: [python, java, cpp]`
- `case-study`: `scale: "100M DAU"` (only when stated as an assumption)
- `adr`: `adr_status: accepted | proposed | superseded`, `date: 2026-09-29`
- `roadmap`: `role: "Security Engineer"`

## Section templates

- **GoF pattern:** Problem, Motivation, Structure (mermaid classDiagram), Implementation (Java and/or C++), Tradeoffs, When to use, When NOT to use, Real-world example, Interview questions.
- **HLD case study:** Requirements, Functional, Non-functional, Capacity estimation, API design, Data model, Architecture (mermaid), Component responsibilities, Data flow, Scaling strategy, Failure modes, Security, Observability, Tradeoffs, Interview follow-ups.
- **DSA problem:** Problem, Intuition, Brute force, Optimized approach, Complexity, Implementation (Python / Java / C++), Edge cases, Common mistakes, Follow-ups.
- **Engineering pattern:** Problem, Solution, Example, Tradeoffs, Failure modes, Security implications, When to use, When not to use.
- **ADR:** Context, Problem, Options, Decision, Rationale, Tradeoffs, Consequences, Status.
- **Research paper note:** Problem, Research Gap, Hypothesis, Method, Dataset, Baseline, Experiment, Metrics, Results, Limitations, Novelty, Future Work.
