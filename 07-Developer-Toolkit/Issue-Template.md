---
title: Issue Template
description: Searchable, reproducible issue template for bugs, features, and refactors.
domain: developer
category: templates
type: template
difficulty: beginner
status: evergreen
tags: [github, workflow]
prerequisites: []
related: [Pull-Request-Template]
order: 20
---
# {{Concise, searchable title}}

<!-- Title test: could someone find this issue by searching the error message or feature name?
     Good: "Login returns 500 when email contains '+'". Bad: "Login broken". -->

## Type

- [ ] Bug
- [ ] Feature
- [ ] Refactor
- [ ] Documentation

**Severity/Priority:** {{blocker | high | normal | low}}
<!-- Blocker = users cannot complete a core flow. High = wrong results or no workaround.
     Normal = workaround exists. Low = cosmetic. -->

## Description

<!-- Bugs: what is broken, who it affects, and impact ("all users on signup", "only admins").
     Features: the user problem first, the proposed solution second — "As a X, I need Y so
     that Z". Never open with implementation details. -->

{{...}}

## Steps to Reproduce (for bugs)

<!-- Must start from a known state ("fresh install", "logged in as admin") and be numbered so
     someone else can replay them exactly. If you can't reproduce it, say so and attach what
     you have — flaky repros are still worth filing. -->

1. {{starting state}}
2. {{action}}
3. {{action that triggers the failure}}

**Reproducibility:** {{always | intermittent (~X out of Y tries) | once}}

## Expected Behavior

<!-- What SHOULD happen, per spec/docs/common sense. One or two sentences. -->

{{...}}

## Actual Behavior

<!-- What actually happens. Paste the exact error text — screenshots of text are not
     searchable. Include the wrong value, not just "it's wrong". -->

{{...}}

## Environment

<!-- Fill only what's relevant, but be exact — "latest" is not a version. -->

- OS: {{e.g. Windows 11 / Ubuntu 24.04}}
- Language/runtime: {{e.g. Python 3.12.4, Node 22.3}}
- App version / commit: {{e.g. v1.4.2 or `62ceb79`}}
- Browser (if web): {{...}}

## Logs / Screenshots

<!-- Trim logs to the relevant window; wrap in a code fence. Redact tokens and PII. -->

```
{{stack trace / log excerpt}}
```

## Proposed Fix (optional)

<!-- If you've already localized the bug, point at file:line and sketch the fix. Maintainers
     merge issues with a proposed fix far faster. Leave blank rather than guess wildly. -->

{{...}}

## Acceptance Criteria (for features)

<!-- Checkboxes a reviewer can verify. If a criterion isn't testable, rewrite it. -->

- [ ] {{observable outcome 1}}
- [ ] {{observable outcome 2}}

---

## EXAMPLE (filled bug)

# Login returns 500 when email contains "+"

**Type:** Bug — **Severity:** high (no workaround for affected users)

### Description

Users whose email contains a plus alias (e.g. `dev+test@gmail.com`) get a 500 on login.
Affects any user who registered with an aliased address — signup accepts these emails, so
the accounts exist but are unusable.

### Steps to Reproduce

1. Register a user with email `dev+test@gmail.com` (succeeds)
2. Log out, then POST `/v1/auth/login` with that email and the correct password
3. Server responds `500 Internal Server Error`

**Reproducibility:** always

### Expected Behavior

`200` with a session token — plus-aliased emails are valid per RFC 5321 and accepted at signup.

### Actual Behavior

`500`; the `+` is being URL-decoded into a space before the DB lookup, so the user is not found
and the missing-user branch throws instead of returning 401.

### Environment

- OS: Ubuntu 24.04 (prod)
- Runtime: Python 3.12.4 / FastAPI 0.111
- Commit: `62ceb79`

### Logs

```
KeyError: 'user' at auth/service.py:88 in login()
  email after parse: 'dev test@gmail.com'
```

### Proposed Fix

`auth/routes.py:41` — email is read from a form-encoded body without disabling URL decoding.
Read from JSON body instead, and make the missing-user branch return 401, not raise.
