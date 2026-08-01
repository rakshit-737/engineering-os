# {{PR title: imperative, <70 chars, e.g. "Move session storage to Redis"}}

<!-- A reviewer should understand WHAT changed and WHY from the Summary + Problem alone,
     before opening a single file. Optimize for reviewer time, not author convenience. -->

## Summary

<!-- 1-3 sentences: what this PR does and the one-line why. Link the issue it closes. -->

{{What changed, in plain language.}} Closes #{{issue}}.

## Problem

<!-- The state of the world before this PR and why it was unacceptable. If there's an ADR
     or issue with the full context, link it and keep this to two sentences. -->

{{...}}

## Solution

<!-- The approach, and — crucially — any alternative you rejected and why. Call out the
     non-obvious parts of the diff so the reviewer doesn't have to reverse-engineer intent. -->

{{...}}

## Changes

<!-- Bullet the meaningful changes, grouped by area. Skip mechanical noise ("ran formatter")
     unless it dominates the diff — then say so, so the reviewer can filter it out. -->

- {{area}}: {{change}}
- {{area}}: {{change}}

## Risk Assessment

<!-- Be honest; "low" with no justification is worthless. Name the worst realistic failure. -->

- **Functional risk:** {{what breaks if this is wrong, and blast radius}}
- **Security risk:** {{new inputs, authz changes, secrets touched? "none — no surface change" is fine}}
- **Performance risk:** {{hot paths touched? expected impact}}

## Testing

<!-- Check only what you actually ran, and say HOW ("pytest tests/auth -x, 42 passed").
     For manual tests, list the exact scenario so a reviewer can repeat it. -->

- [ ] Unit tests: {{command + result}}
- [ ] Integration tests: {{command + result}}
- [ ] Manual tests: {{scenario walked through}}

## Rollback Plan

<!-- How to undo in production: plain revert? config flag? Does it involve a migration that
     can't be reverted? If rollback needs more than `git revert`, spell out the steps. -->

{{...}}

## Screenshots / Logs

<!-- UI changes: before/after side by side. Behavior changes: log excerpt proving the new path. -->

{{...}}

## Checklist

- [ ] Docs updated (README/API docs/runbook)
- [ ] Breaking changes documented + migration steps included
- [ ] No secrets, debug prints, or commented-out code in the diff
- [ ] Self-reviewed the diff line by line before requesting review

---

## EXAMPLE (filled)

# Move session storage to Redis

### Summary

Sessions now live in Redis with a 24h TTL instead of the `sessions` table. Implements ADR-004.
Closes #87.

### Problem

Session reads add ~40ms to every authenticated request and generate 60% of DB writes
(details in ADR-004). This blocks the 1k-concurrent-user target.

### Solution

Introduced a `SessionStore` interface with two impls: `RedisSessionStore` (default) and the
old `PgSessionStore` (kept for rollback, selected via `SESSION_BACKEND` env var). Rejected
stateless JWTs because token revocation is a hard requirement.

### Changes

- auth: `SessionStore` interface + Redis/PG implementations; login/logout wired through it
- infra: `redis` service added to docker-compose; `SESSION_BACKEND` + `REDIS_URL` env vars
- tests: store contract test run against both backends

### Risk Assessment

- **Functional risk:** medium — a Redis outage logs everyone out; app degrades to 401s, no data loss
- **Security risk:** low — same token format; Redis bound to localhost, no new external surface
- **Performance risk:** positive — auth read <1ms in local bench (was ~40ms)

### Testing

- [x] Unit tests: `pytest tests/auth -x` — 42 passed
- [x] Integration tests: contract suite vs real Redis in CI — passed
- [x] Manual: login, refresh, logout, login-after-redis-restart (forces clean re-auth)

### Rollback Plan

Set `SESSION_BACKEND=postgres` and restart — no migration involved, old table still present.
Users re-login. Delete the Redis service at leisure.

### Checklist

- [x] Docs updated (runbook: new Redis section)
- [x] No breaking API changes
- [x] No secrets in diff
- [x] Self-reviewed
