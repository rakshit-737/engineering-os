---
title: "Cross-Site Scripting (XSS)"
description: "Reflected, stored, and DOM XSS: mechanism, impact, and defenses."
domain: cybersecurity
category: appsec
type: concept
difficulty: beginner
status: evergreen
tags: [cybersecurity, web, xss]
prerequisites: []
related: [OWASP-Top-10]
order: 90
---

# XSS

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

## Core Idea

Cross-Site Scripting (XSS) is injecting attacker-controlled script that executes in a victim's browser in the context of a trusted site's origin. Because it runs with the site's privileges, it can read the DOM, steal session cookies/tokens, make authenticated requests, and rewrite the page. Root cause is the same as SQLi — untrusted data interpreted as code — but the interpreter is the browser and the victim is the *user*, not the database. It sits under OWASP A03 (Injection).

## Details

**Three types**
- **Stored (persistent):** payload saved server-side (comment, profile bio) and served to every viewer. Highest impact — e.g. a malicious comment that runs for everyone who opens the thread.
- **Reflected:** payload in the request (URL query, form) echoed straight back in the response. Needs the victim to click a crafted link.
- **DOM-based:** the vulnerability is entirely client-side — JS reads attacker-controlled input (`location.hash`) and writes it to a sink (`innerHTML`) without the server ever seeing the payload.

**Mechanics — how injection happens**

```python
# VULNERABLE (server-side template with no escaping)
html = "<div>Hello " + request.args["name"] + "</div>"
```

With `name = <script>alert(1)</script>`, the browser parses the injected tag as markup and runs it. `<script>alert(1)</script>` is the canonical harmless proof; a real payload would exfiltrate `document.cookie` or ride the user's session. The DOM-based version needs no server bug:

```javascript
// VULNERABLE: attacker controls location.hash, innerHTML executes it
document.getElementById("out").innerHTML = location.hash.slice(1);
```

**Defenses (layered — encoding is primary)**
1. **Context-aware output encoding** — the real fix. Encode untrusted data for the exact context it lands in: HTML body (`<` → `&lt;`), HTML attribute, JS string, URL, CSS. Right encoding, wrong context still fails, so let the framework do it.
2. **Use a framework that auto-escapes** — React (`{value}` escapes by default), Angular, Jinja2 autoescape. The danger is the escape hatch: `dangerouslySetInnerHTML`, `innerHTML`, `v-html`.
3. **Safe DOM APIs** — `textContent` / `setAttribute` instead of `innerHTML`; if you must render HTML, sanitize with a vetted library (DOMPurify), never a homegrown regex.
4. **Content Security Policy (CSP)** — defense in depth: `script-src 'self'` (no inline scripts, no arbitrary origins) so injected `<script>` won't run even if encoding is missed. A strong CSP turns many XSS bugs into non-events but doesn't replace encoding.
5. **HttpOnly + Secure + SameSite cookies** — HttpOnly hides the session cookie from `document.cookie`, blunting the classic cookie-theft payload (though XSS can still act as the user).

**Common pitfalls**
- Blocklisting `<script>` — bypassed via `<img src=x onerror=alert(1)>`, event handlers, `javascript:` URIs. Encode/sanitize, don't blocklist.
- Encoding once, globally, ignoring context (HTML-encoding data placed inside a JS string still breaks out).
- Trusting client-side validation; the attacker controls the client.
- `innerHTML +=` with any untrusted fragment.
- Assuming CSP alone is enough — it's a safety net, not the fix.

## Interview Angle

- State the SQLi contrast crisply: **XSS attacks the user in their browser; SQLi attacks the datastore** — same root cause (data treated as code), different interpreter and victim. Interviewers love this comparison; see [[SQL-Injection]].
- Name the three types and, for each, who triggers it and where the payload lives.
- Expect: "How do you prevent it?" Lead with context-aware output encoding, then auto-escaping frameworks, then CSP and HttpOnly cookies as defense in depth — in that priority order.
- Expect: "What can an attacker do with XSS?" Session hijacking, keylogging, CSRF-token theft, phishing overlays, worming (stored) — full control within the origin.
- Expect DOM-based follow-up: explain source (`location.hash`) → sink (`innerHTML`) and why the server never sees it, so server-side filtering can't catch it.

## Related

- [[OWASP-Top-10]]
- [[SQL-Injection]]
- [[Authentication-vs-Authorization]]
- [[Cybersecurity-Index]]
