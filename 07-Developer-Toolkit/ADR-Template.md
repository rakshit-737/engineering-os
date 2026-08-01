# ADR-{{Number}}: {{Title}}

<!-- Title should name the decision, not the problem: "Use PostgreSQL for primary storage",
     not "Database issues". Number ADRs sequentially (ADR-001, ADR-002...) and never reuse numbers. -->

- **Status:** {{Proposed | Accepted | Deprecated | Superseded by ADR-XXX}}
- **Date:** {{YYYY-MM-DD}}
- **Deciders:** {{who was in the room / on the thread}}
- **Tags:** {{e.g. storage, auth, infra}}

## Context

<!-- The forces at play: technical constraints, deadlines, team skills, cost limits, existing
     systems. Write it so a new teammate in 12 months understands WHY this came up. State facts,
     not opinions — "API p95 latency is 800ms" beats "the API is slow". 2-3 paragraphs max. -->

{{What situation forces a decision? What constraints bound the answer?}}

## Decision

<!-- One or two sentences, active voice, present tense: "We will use X because Y."
     If you can't write it in two sentences, the decision isn't clear yet. -->

We will {{decision}}.

## Options Considered

<!-- Minimum 2 options (one is usually "do nothing"). For each, give an honest pro/con —
     if the rejected options have no listed strengths, the analysis wasn't real. -->

| Option | Pros | Cons | Why not / why yes |
|---|---|---|---|
| {{Option A (chosen)}} | {{...}} | {{...}} | {{...}} |
| {{Option B}} | {{...}} | {{...}} | {{...}} |
| {{Do nothing}} | {{no migration cost}} | {{...}} | {{...}} |

## Consequences

<!-- What becomes easier, harder, or different AFTER the decision — including negatives you
     accept. An ADR with no negative consequences is marketing, not engineering. -->

- **Positive:** {{...}}
- **Negative:** {{costs and risks we knowingly accept}}
- **Neutral:** {{changes that are neither, e.g. "team must learn tool X"}}

## Validation Plan

<!-- How will you know the decision worked? Name a metric and a review date.
     "Revisit after 3 months: p95 < 200ms and zero data-loss incidents" -->

{{Metric + threshold + review date}}

## Rollback Plan

<!-- The concrete escape hatch if validation fails. "None — one-way door" is a legal answer,
     but say it explicitly so everyone knows the stakes. -->

{{Steps to reverse, or "one-way door" + mitigation}}

---

## EXAMPLE (filled)

# ADR-004: Use Redis for session storage

- **Status:** Accepted
- **Date:** 2026-03-14
- **Deciders:** Rakshit, backend team
- **Tags:** infra, auth, performance

### Context

Sessions are stored in PostgreSQL. Under load-test at 500 concurrent users, session reads add
~40ms to every authenticated request and the sessions table generates 60% of total DB writes.
We deploy on a single VPS; managed services must stay under $15/month.

### Decision

We will move session storage to Redis with a 24h TTL, keeping PostgreSQL as the system of
record for users only.

### Options Considered

| Option | Pros | Cons | Why not / why yes |
|---|---|---|---|
| Redis (chosen) | Sub-ms reads, TTL eviction is free | New service to operate | Fits budget; battle-tested |
| JWT stateless sessions | No storage at all | Can't revoke tokens before expiry | Revocation is a hard security requirement |
| Do nothing | Zero migration cost | DB write load keeps growing | Blocks the 1k-user target |

### Consequences

- **Positive:** Auth reads drop from ~40ms to <1ms; DB write volume falls ~60%.
- **Negative:** Redis restart logs out all users (accepted — sessions are cheap to recreate).
- **Neutral:** Ops runbook gains a Redis section; one more container in docker-compose.

### Validation Plan

Re-run the 500-user load test by 2026-04-01: p95 auth latency < 100ms, DB writes/sec halved.

### Rollback Plan

Session interface is abstracted behind `SessionStore`; swap `RedisSessionStore` back to
`PgSessionStore` via config flag. All users re-login. Estimated rollback time: 15 minutes.
