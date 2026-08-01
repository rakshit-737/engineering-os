# Web Security Checklist (OWASP Top 10 — 2021)

> Defensive checklist for auditing **your own application**. Each item: what it is, how to test for it in your own code and config (code review + configuration checks, plus safe dynamic checks against your own staging environment), and the fix. Only test systems you own or are explicitly authorized to assess.

---

## A01:2021 — Broken Access Control

**What it is:** Users can act outside their intended permissions — reading or modifying other users' data, or reaching admin functions.

**Test your own app:**

- [ ] Code review: every endpoint that takes an object ID (`/notes/42`, `/api/orders/17`) verifies the object belongs to the current user *server-side* — grep handlers for DB queries missing an owner/tenant filter
- [ ] Code review: authorization checks live in one central place (middleware/decorator), not copy-pasted per route — list routes and confirm each is covered
- [ ] Code review: no authorization decisions based on client-supplied data (hidden form fields, JWT claims you don't verify, `isAdmin` in a request body)
- [ ] Config check: directory listing disabled on the web server; no direct access to internal paths (`/admin`, `/actuator`, `.git/`) from the internet
- [ ] Dynamic check (own staging): log in as user A, replay user B's object URLs/IDs — expect 403/404, not data. Repeat with the free/low-privilege role against admin routes
- [ ] Check CORS config: no `Access-Control-Allow-Origin: *` combined with credentials

**Fix:** Deny by default; enforce ownership checks on every object access at the server; centralize authorization logic; use unguessable IDs (UUIDs) as defense-in-depth only, never as the control; log and alert on repeated 403s.

---

## A02:2021 — Cryptographic Failures

**What it is:** Sensitive data exposed because it's transmitted or stored without proper encryption, or with weak/misused crypto.

**Test your own app:**

- [ ] Code review: passwords hashed with Argon2id, bcrypt, or scrypt — grep for `md5`, `sha1`, `sha256(password)`, homegrown hashing
- [ ] Code review: no custom crypto; standard libraries only; no hardcoded keys/IVs; no ECB mode; grep for `Random` where `SecureRandom`/`secrets` is needed
- [ ] Code review: classify data your app stores — is anything sensitive (PII, tokens) stored in plaintext that shouldn't be stored at all?
- [ ] Config check: TLS everywhere including internal service-to-service; test your own domain with `testssl.sh` or SSL Labs — no TLS 1.0/1.1, no weak ciphers
- [ ] Config check: HTTP redirects to HTTPS; HSTS set (see headers table); cookies have `Secure`
- [ ] Config check: database and backup encryption at rest enabled; keys not stored beside the data they encrypt

**Fix:** Encrypt in transit (TLS 1.2+) and at rest; hash passwords with Argon2id/bcrypt with per-password salt; don't store sensitive data you don't need; use a secrets manager/KMS for keys; disable caching of responses containing sensitive data.

---

## A03:2021 — Injection

**What it is:** Untrusted input interpreted as code/commands — SQL, NoSQL, OS command, LDAP injection, and XSS.

**Test your own app:**

- [ ] Code review: all SQL uses parameterized queries / prepared statements or an ORM — grep for string concatenation or f-strings/template literals building queries (`f"SELECT`, `"SELECT " +`, `${}` inside query strings)
- [ ] Code review: no user input reaches `exec`, `eval`, `os.system`, `subprocess(..., shell=True)`, backticks — grep for these and trace their inputs
- [ ] Code review: output encoding on render — templating engine auto-escape is ON (check it isn't disabled with `| safe`, `dangerouslySetInnerHTML`, `v-html`, `raw`); each use of those is individually justified
- [ ] Code review: file upload paths sanitized (no user-controlled filenames into filesystem paths)
- [ ] Config check: DB account the app uses has least privilege (no DDL, no access to other schemas) so injection blast radius is limited
- [ ] Dynamic check (own staging): submit `'`, `"><script>alert(1)</script>`, `; ls` into your own forms/params and confirm errors are handled and nothing executes/reflects unescaped; run sqlmap/ZAP against your own staging only

**Fix:** Parameterized queries everywhere; allow-list input validation server-side; contextual output encoding (rely on the framework's auto-escaping); avoid shell calls — use language APIs; least-privilege DB accounts; CSP as XSS defense-in-depth.

---

## A04:2021 — Insecure Design

**What it is:** The design itself lacks security controls — no amount of correct implementation fixes a missing control.

**Test your own app:**

- [ ] Do you have a threat model for this app? (Use `Threat-Model-Template.md` — if no, that's the finding)
- [ ] Design review: business-logic abuse cases considered — can flows be replayed, skipped, or done out of order (e.g., apply a discount twice, confirm email step bypassed)?
- [ ] Design review: limits exist on costly operations — account creation, password reset emails, file uploads, expensive queries
- [ ] Design review: tenant/user data separation is a stated design property, testable, not incidental
- [ ] Code review: security-relevant flows (registration, password reset, payment) match the documented design — diff intent vs implementation
- [ ] Check: failure modes fail closed (auth service down → deny, not allow)

**Fix:** Threat model before building (STRIDE per element); write abuse cases alongside user stories; add rate/resource limits by design; require design review for security-sensitive features; encode invariants as automated tests.

---

## A05:2021 — Security Misconfiguration

**What it is:** Insecure default configs, open cloud storage, verbose errors, unnecessary features enabled, missing hardening.

**Test your own app:**

- [ ] Config check: no default credentials anywhere (admin/admin on frameworks, DBs, dashboards) — enumerate every service you deploy and verify
- [ ] Config check: debug mode OFF in production (`DEBUG=False`, no stack traces to users, no source maps of secrets) — trigger an error on staging configured like prod and inspect the response
- [ ] Config check: cloud storage buckets/blobs not public unless explicitly intended — list them and check policies
- [ ] Config check: unnecessary features disabled — sample apps, unused HTTP methods (TRACE), directory listing, admin consoles on public interfaces
- [ ] Config check: security headers present (see table below) — `curl -I https://your-app` and compare
- [ ] Code/config review: error handlers return generic messages; detailed errors go to logs only
- [ ] Process check: configs are code-reviewed and identical across environments (infra-as-code), not hand-edited on servers

**Fix:** Hardened, repeatable build (IaC + minimal images); one config source with per-env overrides reviewed like code; disable everything not needed; automated config scanning in CI; patch cadence for platform components.

---

## A06:2021 — Vulnerable and Outdated Components

**What it is:** Running libraries, frameworks, or platforms with known vulnerabilities.

**Test your own app:**

- [ ] Run dependency audit for your stack: `npm audit` / `pip-audit` / `mvn dependency-check:check` / `bundle audit` / `cargo audit` — zero unaddressed criticals
- [ ] Check: you can produce a full inventory (SBOM) of direct AND transitive dependencies — if you can't list them, you can't patch them
- [ ] Config check: base Docker images pinned and recent; `docker scout`/`trivy image` scan of your own images
- [ ] Check: platform components (OS, web server, DB, runtime) within vendor support windows
- [ ] Code review: no dead dependencies (installed but unused — still attack surface); no components pulled from unofficial sources
- [ ] Process check: automated alerts wired up (Dependabot/Renovate/OSV) so new CVEs in your stack notify you

**Fix:** Automate dependency scanning in CI with a fail threshold; subscribe to security advisories for your stack; patch on a schedule with an emergency lane for criticals; remove unused dependencies; prefer maintained libraries.

---

## A07:2021 — Identification and Authentication Failures

**What it is:** Weak authentication — credential stuffing works, sessions are guessable or immortal, recovery flows are bypassable.

**Test your own app:**

- [ ] Code review: login/registration/reset endpoints have rate limiting and progressive lockout — read the middleware, then verify on staging (attempt 6+ rapid logins → throttled)
- [ ] Code review: password policy allows long passphrases, checks against breached-password lists, no forced composition-rule silliness; MFA available for sensitive actions
- [ ] Code review: session IDs generated by the framework (not homemade), rotated on login (session fixation), invalidated server-side on logout and password change
- [ ] Config check: session cookies `Secure; HttpOnly; SameSite=Lax` (or `Strict`); reasonable idle + absolute timeouts
- [ ] Code review: password reset tokens single-use, short-lived, random; reset flow doesn't reveal whether an email is registered (same response either way)
- [ ] Code review: JWTs (if used) verified with allow-listed algorithm (reject `alg: none`), short expiry, revocation strategy exists
- [ ] Check: no credentials in URLs, logs, or error messages

**Fix:** Use the framework/identity provider's auth rather than rolling your own; MFA; breached-password checks; server-side session management with rotation and invalidation; uniform responses on auth failures; rate limiting + lockout with backoff.

---

## A08:2021 — Software and Data Integrity Failures

**What it is:** Trusting code/data updates without verifying integrity — malicious CI/CD, unsigned updates, insecure deserialization.

**Test your own app:**

- [ ] Code review: no deserialization of untrusted input with dangerous formats — grep for `pickle.loads`, Java `ObjectInputStream`, PHP `unserialize`, YAML `load` (vs `safe_load`) fed by user data
- [ ] Config check: dependency lockfiles committed (`package-lock.json`, `poetry.lock`) and CI installs from lockfile (`npm ci`) so builds are reproducible
- [ ] Config check: CI/CD pipeline — who can modify workflows? Are secrets scoped per-job? Do third-party actions/plugins get pinned to a hash, not a floating tag?
- [ ] Check: artifacts/updates your app fetches at runtime are verified (checksums/signatures) — list every remote fetch and confirm
- [ ] Config check: Subresource Integrity (`integrity=` attribute) on any third-party `<script>`/CSS you must load from a CDN
- [ ] Code review: auto-update mechanisms (if any) verify signatures before applying

**Fix:** Verify signatures/checksums on everything you consume; pin dependencies and CI actions; lock down pipeline permissions (least privilege, protected branches, required review); use `safe_load`-style APIs; sign your own releases; avoid deserializing untrusted data — use JSON with schema validation.

---

## A09:2021 — Security Logging and Monitoring Failures

**What it is:** Breaches go undetected because security events aren't logged, logs aren't monitored, or alerting doesn't exist.

**Test your own app:**

- [ ] Code review: these events are logged with user, timestamp (UTC), source IP, outcome — login success/failure, lockouts, password changes, privilege changes, access-control failures (403s), input-validation failures, admin actions
- [ ] Code review: logs do NOT contain secrets — grep logging calls for password/token/card fields; verify a scrubbing filter exists
- [ ] Config check: logs shipped off the host to a central store the app servers can't erase (attacker on the box shouldn't rewrite history)
- [ ] Config check: retention meets your needs (≥ 90 days hot recommended); clocks synced (NTP) so timelines correlate
- [ ] Check: at least these alerts exist and route to a human — brute-force pattern, spike in 403s/500s, logins from new geography for admin accounts, log flow stopping (silence is itself an alert)
- [ ] Drill: pick yesterday's staging traffic and answer "who accessed record X?" within 10 minutes — if you can't, logging is insufficient
- [ ] Check: an incident response plan exists and references these logs (see `Incident-Response-Playbook.md`)

**Fix:** Structured (JSON) logs for all security events; central log store with restricted deletion; tested alerts with an on-call owner; log-injection prevention (encode user input in logs); regular log-review cadence.

---

## A10:2021 — Server-Side Request Forgery (SSRF)

**What it is:** The server fetches a URL influenced by user input, letting attackers reach internal services/cloud metadata through your server.

**Test your own app:**

- [ ] Code review: find every place the server fetches a user-influenced URL — webhooks, URL previews, PDF/image fetchers, importers, "check my site" features — and list them
- [ ] Code review: each fetch validates against an **allow-list** of schemes (https only) and destinations; deny-lists alone are bypassable (redirects, DNS rebinding, `169.254.169.254`, decimal IPs)
- [ ] Code review: redirects are not followed blindly (re-validate after each redirect); DNS resolution result checked against private ranges before connecting
- [ ] Config check: egress firewall rules — app servers can't reach internal admin interfaces, cloud metadata endpoint (`169.254.169.254`), or arbitrary internal IPs; on cloud, IMDSv2 (session-token metadata) enforced
- [ ] Config check: URL-fetching workloads isolated in a segmented network with only the egress they need
- [ ] Dynamic check (own staging): point your own webhook/preview feature at a listener you control and at your own internal-only test service — confirm internal target is blocked and responses aren't returned raw to the user

**Fix:** Allow-list validation of scheme/host/port; resolve-then-verify IPs (block private/link-local ranges); don't return raw fetch responses to users; network-level egress deny-by-default for fetching services; enforce IMDSv2 / block metadata endpoint.

---

## Secure Headers Table

Verify on your own app with `curl -I https://your-app.example` (or browser dev tools / securityheaders.com against your own domain).

| Header | Recommended Value | What It Defends Against |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'` (tighten/loosen per app; start with `Content-Security-Policy-Report-Only` to tune) | XSS payload execution, unwanted embeds; `frame-ancestors` covers clickjacking |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (add `preload` only when committed) | Protocol-downgrade and SSL-stripping attacks |
| `X-Content-Type-Options` | `nosniff` | MIME-sniffing uploaded files into executable content |
| `X-Frame-Options` | `DENY` (legacy fallback — CSP `frame-ancestors` is the modern control) | Clickjacking in older browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Leaking full URLs (with tokens/paths) to third parties |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` (allow only what you use) | Abuse of powerful browser APIs by injected/framed content |
| `Cache-Control` (sensitive responses) | `no-store` | Sensitive data persisted in shared/browser caches |
| `Cross-Origin-Opener-Policy` | `same-origin` | Cross-window attacks (e.g., tab-nabbing style references) |
| `Cross-Origin-Resource-Policy` | `same-origin` (or `same-site`) | Other origins embedding/reading your resources |
| `Set-Cookie` attributes | `Secure; HttpOnly; SameSite=Lax` (Strict for high-value sessions) | Cookie theft via JS (XSS), transmission over HTTP, CSRF |
| Remove: `Server`, `X-Powered-By` | (suppress/blank them) | Free version fingerprinting for attackers |

---

## Quick Audit Routine (monthly, on your own app)

- [ ] `curl -I` prod domain → diff headers against the table above
- [ ] Dependency audit (`npm audit` / `pip-audit` / `trivy`) → zero unaddressed criticals
- [ ] Grep sweep: raw SQL string building, `eval`/`exec`, disabled auto-escaping, `pickle.loads`, secrets in code
- [ ] Login as low-priv user, replay 5 high-priv/other-user URLs → all denied
- [ ] Trigger an error → generic message to user, detailed entry in central log
- [ ] Confirm alerts fired during the month's tests; if silent, fix monitoring first
