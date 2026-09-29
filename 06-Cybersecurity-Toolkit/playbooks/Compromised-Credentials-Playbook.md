---
title: "Compromised Credentials Playbook"
description: "Response when a user or service credential is suspected compromised: revoke, investigate activity, and harden."
domain: cybersecurity
category: playbooks
type: playbook
difficulty: intermediate
status: evergreen
tags: [identity, incident-response, credentials]
prerequisites: [Identity-Security]
related: [Incident-Response-Playbook, Incident-Response-Checklist, Phishing-Response-Playbook, Cloud-Account-Compromise-Playbook]
order: 30
---

# Compromised Credentials Playbook

Hub: [[Security-Engineering-OS]]

## Triggers

User entered credentials on a phishing page, impossible-travel alert, MFA fatigue report, credential found in a public leak or code repository, secret-scanning alert.

## 1. Contain

**Human account**
- Reset password; revoke all sessions and refresh tokens at the IdP.
- Re-register MFA if the factor may be compromised; remove unknown MFA devices.
- Review and revoke OAuth app consents.

**Secret / API key / service credential**
- Rotate or revoke the key immediately; deploy the new secret.
- If it was committed to git, rotation is mandatory; history rewriting alone does not help once pushed.

## 2. Investigate (lookback from earliest possible exposure)

- IdP sign-in logs: IPs, user agents, locations, MFA results.
- Email: new inbox rules, forwarding, sent items (internal phishing).
- SaaS / cloud audit logs for actions taken with the credential.
- Data access: downloads, shares, exports.
- For cloud keys, follow [[Cloud-Account-Compromise-Playbook]].

## 3. Eradicate

Remove attacker persistence: rules, app registrations, added MFA methods, new API keys, delegated permissions.

## 4. Recover and harden

- Move user to phishing-resistant MFA.
- Check for password reuse across other systems.
- Add detection for the observed pattern.

## 5. Document

Timeline, scope, data impact assessment (feeds legal notification decisions), lessons learned.
