---
title: "Authentication vs Authorization"
description: "Who you are versus what you may do, and how systems enforce each."
domain: cybersecurity
category: fundamentals
type: concept
difficulty: beginner
status: evergreen
tags: [cybersecurity, authn, authz, identity]
prerequisites: []
related: [Least-Privilege]
order: 140
---

# Authentication vs Authorization

> Scope: the conceptual distinction and where each fails. Implementation hardening (password storage, MFA, sessions, JWT, OAuth pitfalls) is in [[Authentication-Security]].

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

> **Concept overview.** Implementation pitfalls (sessions, JWT, OAuth) are in Authentication Security; enterprise identity in Identity Security and Active Directory Security.

## Core Idea

Authentication (authn) proves an identity claim: "you are user 42." Authorization (authz) is a policy decision made after authn: "user 42 may read invoice 7." They fail differently — broken authn lets strangers in; broken authz lets legitimate users do things they shouldn't. Broken Access Control is OWASP A01, the most common web app flaw category.

## Details

**Authentication mechanisms**
- Factors: something you know (password), have (TOTP app, hardware key), are (biometric). MFA = two or more distinct factors; two passwords is still one factor.
- Sessions: after login the server issues a session ID (opaque, stored server-side) or a signed token (JWT, stateless). Either way, every subsequent request re-authenticates via that credential.
- Passwords are verified against a slow salted hash (argon2/bcrypt), never stored or encrypted — see [[Hashing-vs-Encryption]].

**Authorization models**
- RBAC: permissions attach to roles (admin, editor), users get roles. Simple, coarse.
- ABAC: policy over attributes (owner == requester, time, resource sensitivity). Flexible, harder to audit.
- Object-level checks: even with RBAC, each request must verify the *specific* resource belongs to the caller.

**Classic failure: IDOR (Insecure Direct Object Reference)**

```python
# Vulnerable: authn present, authz missing
@app.get("/invoices/<int:invoice_id>")
def get_invoice(invoice_id):
    require_login()                      # authn: OK
    return db.get_invoice(invoice_id)    # any logged-in user can read ANY invoice

# Fixed: object-level authz
@app.get("/invoices/<int:invoice_id>")
def get_invoice(invoice_id):
    user = require_login()
    inv = db.get_invoice(invoice_id)
    if inv.owner_id != user.id:
        abort(404)                       # 404, not 403, to avoid confirming existence
    return inv
```

Attack is trivial: change `/invoices/7` to `/invoices/8` in the URL. No tooling needed.

**Common pitfalls**
- Enforcing authz in the frontend only (hiding buttons). The API is the security boundary; anything client-side is UX.
- Checking authz on the "list" endpoint but not the "detail/update/delete" endpoints.
- JWTs: forgetting to verify signature/expiry, or accepting `alg: none`. A JWT proves authn claims; it does not replace per-resource authz.
- Privilege changes not revoking existing sessions/tokens (demoted admin keeps admin token until expiry).

**Design rules**
- Deny by default; require an explicit allow per route and per object.
- Centralize authz in middleware/policy layer rather than sprinkling `if` checks.
- Log authz denials — they are cheap intrusion signals.

## Interview Angle

- Define both in one line each, then immediately say "authn without object-level authz gives you IDOR" — that pairing shows you understand where real bugs live.
- Expect: "Walk me through what happens when a user hits a protected endpoint." Answer in order: session/token validation (authn) → route-level permission (role) → object-level ownership check → action.
- Expect: "Why is client-side access control not enough?" Because the attacker talks to the API directly (curl/Burp); the UI is just one client.
- Know the JWT tradeoff: stateless and fast, but revocation is hard (short expiry + refresh tokens, or a denylist).
- Tie to [[Least-Privilege]]: authz policy should grant the minimum, deny by default.

## Related

- [[Least-Privilege]]
- [[OWASP-Top-10]]
- [[Hashing-vs-Encryption]]
- [[SQL-Injection]]
- [[Cybersecurity-Index]]
