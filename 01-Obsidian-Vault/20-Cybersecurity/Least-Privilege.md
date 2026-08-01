---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# Least Privilege

Hub: [[Cybersecurity-Index]]

## Core Idea

Every identity — human, service, process, container — gets the minimum permissions needed to do its job, for the minimum time needed. The goal is blast-radius control: least privilege rarely prevents the initial compromise, but it decides whether a phished intern means one leaked mailbox or a full domain takeover.

## Details

**Where it applies (with concrete forms)**
- OS: run services as dedicated non-root users; no `sudo` in service accounts; file permissions scoped per service.
- Containers: non-root user in the image, read-only filesystem, drop Linux capabilities, no `--privileged`.
- Databases: one DB user per service; the web app's user gets `SELECT/INSERT/UPDATE` on its own tables — no `DROP`, no access to other schemas. This directly caps [[SQL-Injection]] damage.
- Cloud/IAM: scoped roles per workload (this Lambda can read this one S3 bucket), not account-wide admin keys in env vars.
- APIs/tokens: scoped, short-lived tokens (a CI token that can only push images, not read secrets).
- Humans: role-based access, joiner/mover/leaver process, access reviews; admin rights granted just-in-time and expiring (JIT elevation), not held permanently.

**Related principles**
- Deny by default: start from zero, add explicit allows — the enforcement style least privilege requires.
- Separation of duties: no single identity can both request and approve (e.g., deploy and approve deploy).
- Need-to-know: the data-access flavor of the same idea.
- Zero trust: least privilege applied per-request, with authn/authz on every call instead of trusting the network.

**Worked example — web app talks to Postgres**

```sql
-- One narrowly-scoped user for the app, instead of connecting as postgres
CREATE ROLE webapp LOGIN PASSWORD '...';
GRANT SELECT, INSERT, UPDATE ON orders, customers TO webapp;
-- No DELETE, no DDL, no other tables. SQLi through the app now cannot
-- DROP TABLE or read the admin schema, whatever the payload says.
```

The vulnerability may still exist; the *impact* is capped. That is the whole point.

**Tradeoffs and failure modes**
- Friction: overly tight permissions generate tickets and workarounds ("just give me admin so it works") — the workaround becomes permanent. Budget for a fast grant process or people will bypass you.
- Privilege creep: permissions accumulate as people change roles and never get revoked. Countermeasure: periodic access reviews + automatic expiry.
- Break-glass: emergencies need a pre-defined, heavily-logged path to elevated access — otherwise the incident response itself stalls (see [[Incident-Response-Lifecycle]]).
- Wildcard IAM (`"Action": "*"`) and long-lived static keys are the most common real-world violations.

**How attackers exploit its absence**
Initial access (phish, vuln) → land on an over-privileged identity → lateral movement / privilege escalation → domain admin. Every step is easier when service accounts are domain admins and every dev has prod access. Least privilege breaks the chain in the middle.

## Interview Angle

- Lead with the blast-radius framing: "It doesn't stop the breach, it caps what the breach is worth." That sentence separates you from candidates who just recite the definition.
- Have 3 concrete examples ready: non-root containers, per-service DB users, scoped short-lived cloud tokens. Interviewers ask "give me an example" immediately.
- Expect: "How would you apply least privilege to X?" for X = CI/CD pipeline, microservice, new hire. Answer pattern: identify the identity → enumerate what it actually needs → deny everything else → add expiry/review.
- Expect the tradeoff question: "What's the cost?" Operational friction and creep; answer with mitigations (JIT elevation, access reviews, automation).
- Map to frameworks: it mitigates Elevation of Privilege in [[Threat-Modeling-STRIDE]] and mainly defends confidentiality and integrity in the [[CIA-Triad]].

## Related

- [[Authentication-vs-Authorization]]
- [[CIA-Triad]]
- [[Threat-Modeling-STRIDE]]
- [[SQL-Injection]]
- [[Cybersecurity-Index]]
