---
title: "Identity Security"
description: "Securing the identity layer: authentication strength, federation, session and token security, privileged access, and identity threat detection."
domain: cybersecurity
category: security-engineering
type: concept
difficulty: intermediate
status: evergreen
tags: [identity, iam, authentication, mfa]
prerequisites: [Authentication-vs-Authorization]
related: [Zero-Trust, IAM-Deep-Dive, Compromised-Credentials-Playbook]
order: 50
---

# Identity Security

Hub: [[Security-Engineering-OS]]

## Why identity is the perimeter

Many intrusions start with valid credentials (phishing, password reuse, stolen tokens). Protecting identities often has more leverage than network controls.

## Authentication

- Passwords: length over complexity, check against breached lists, no forced periodic rotation without cause (NIST SP 800-63B guidance).
- MFA strength (weakest to strongest): SMS/voice -> TOTP -> push (enable number matching) -> FIDO2/WebAuthn passkeys / hardware keys (phishing-resistant).
- Protect the recovery flow as strongly as login.

## Federation

- **SAML 2.0**: XML assertions, enterprise SSO.
- **OIDC** on top of **OAuth 2.0**: ID tokens (JWT) for authentication; OAuth access tokens for delegated authorization.
- Validate: signature, issuer, audience, expiry, nonce; use PKCE for public clients.

## Session and token security

- Short-lived access tokens, rotated refresh tokens, revocation on logout / risk.
- Cookies: `HttpOnly`, `Secure`, `SameSite`.
- Token theft (e.g., adversary-in-the-middle phishing) bypasses MFA; mitigate with phishing-resistant MFA, token binding where available, and anomaly detection.

## Privileged access

- Separate admin accounts; just-in-time elevation; approval and session recording for critical systems.
- Break-glass accounts: monitored, vaulted, tested.
- Non-human identities (service accounts, API keys, CI tokens): inventory, scope, rotate, prefer workload identity federation over static keys.

## Lifecycle

Joiner-mover-leaver automation (SCIM), periodic access reviews, remove dormant accounts.

## Detection signals

Impossible travel, new device + MFA reset, MFA fatigue (many push prompts), mass OAuth consent grants, new inbox rules, password spray patterns (many users, few attempts each).

See also: [[Compromised-Credentials-Playbook]], [[IAM-Deep-Dive]].

## Interview questions

**Q: Why is MFA not enough on its own?**
A: Push-fatigue, SIM swap and adversary-in-the-middle phishing still bypass OTP/push; FIDO2/WebAuthn is origin-bound and resists phishing.

**Q: What identity events would you alert on?**
A: Impossible travel, MFA method changes, new OAuth consent grants with broad scopes, privileged role assignment, and legacy-auth sign-ins.
