---
title: ADR Template
description: Copy-paste template for an Architecture Decision Record, with guidance comments and a filled example.
domain: adr
category: templates
type: template
difficulty: beginner
status: evergreen
tags: [adr, architecture, documentation]
prerequisites: []
related: [ADR-Index, ADR-001-Markdown-As-Source-of-Truth]
order: 2
adr_status: accepted
date: 2026-09-29
---
# ADR Template

Copy everything below the line into `15-Decision-Records/ADR-NNN-Short-Decision-Name.md`. Numbers are sequential and never reused. The title names the decision ("Use PostgreSQL for primary storage"), not the problem ("Database issues").

---

```markdown
---
title: "ADR-NNN: {{Decision in a few words}}"
description: {{One line: what was decided}}
domain: adr
category: {{area, e.g. storage, auth, infra}}
type: adr
difficulty: intermediate
status: evergreen
tags: [{{tags}}]
prerequisites: []
related: [ADR-Index]
adr_status: proposed        # proposed | accepted | superseded
date: {{YYYY-MM-DD}}
---
# ADR-NNN: {{Decision}}

## Context

<!-- The forces at play: constraints, deadlines, team skills, cost limits, existing systems.
     Facts over opinions: "API p95 latency is 800ms" beats "the API is slow". 2-3 paragraphs. -->

## Problem

<!-- One or two sentences: the question this ADR answers. -->

## Options

<!-- At least 2 options, usually including "do nothing". Give rejected options real strengths,
     or the analysis was not real. -->

| Option | Pros | Cons |
|---|---|---|
| {{Option A}} | | |
| {{Option B}} | | |
| Do nothing | No migration cost | |

## Decision

<!-- Active voice, one or two sentences: "We will use X." -->

## Rationale

<!-- Why this option beats the others under the stated context. -->

## Tradeoffs

<!-- What we knowingly give up. An ADR with no downsides is marketing. -->

## Consequences

<!-- What becomes easier, harder, or newly required. Include:
     - Validation: metric + threshold + review date ("p95 < 200ms by 2026-12-01")
     - Rollback: concrete escape hatch, or "one-way door" stated explicitly -->

## Status

<!-- proposed | accepted (date) | superseded by ADR-XXX. Never delete a superseded ADR. -->
```

## Filled example (abridged)

**ADR-004 (example project): Use Redis for session storage**

- **Context:** Sessions live in PostgreSQL. In a 500-concurrent-user load test, session reads added noticeable latency to every authenticated request and dominated DB writes. Single VPS, small managed-service budget.
- **Problem:** Where should session state live so auth reads are fast and the primary DB is relieved?
- **Options:** Redis with TTL (fast, free expiry, one more service); stateless JWT (no storage, but cannot revoke before expiry, which is a hard requirement); do nothing (write load keeps growing).
- **Decision:** Move sessions to Redis with a 24h TTL; PostgreSQL stays the system of record for users.
- **Tradeoffs:** A Redis restart logs everyone out (accepted: sessions are cheap to recreate).
- **Consequences:** Session access goes through a `SessionStore` interface so rollback is a config flag. Validation: rerun the load test and compare auth p95 and DB writes/sec against the baseline.
- **Status:** Accepted.

See [[ADR-Index]] for when to write an ADR and the list of this repository's records.
