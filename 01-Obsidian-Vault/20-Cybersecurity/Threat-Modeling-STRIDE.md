---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# Threat Modeling STRIDE

Hub: [[Cybersecurity-Index]]

## Core Idea

Threat modeling is structured, design-time reasoning about what can go wrong before you build it. STRIDE (from Microsoft) is a mnemonic that prompts six threat categories per component and data flow: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Each category is the violation of a desirable security property, which makes STRIDE a systematic way to not miss whole classes of threats.

## Details

**The STRIDE table — threat maps to property maps to mitigation**

| Threat | Violates property | Example | Mitigation |
|---|---|---|---|
| Spoofing | Authentication | Logging in as another user; forged sender | Strong authn, MFA, signed tokens |
| Tampering | Integrity | Altering a price in transit or in the DB | HMAC/signatures, input validation, TLS, access control |
| Repudiation | Non-repudiation | User denies making a transaction | Secure audit logs, signed actions, timestamps |
| Information disclosure | Confidentiality | Leaking PII, verbose error messages | Encryption, access control, least privilege |
| Denial of service | Availability | Flooding an endpoint, resource exhaustion | Rate limiting, quotas, autoscaling, timeouts |
| Elevation of privilege | Authorization | Normal user gains admin (IDOR, path bug) | Authz checks, least privilege, deny by default |

The "property violated" column is exactly the [[CIA-Triad]] extended with authn/authz/non-repudiation — that mapping is a common interview follow-up.

**The process (design-time, four questions)**
1. What are we building? Draw a Data Flow Diagram: external entities, processes, data stores, data flows, and trust boundaries (where privilege/trust level changes — the interesting bits).
2. What can go wrong? Apply STRIDE to each element, focusing on flows crossing trust boundaries.
3. What are we going to do about it? Choose per threat: mitigate, eliminate, transfer, or accept.
4. Did we do a good job? Review, and revisit when the design changes.

**Worked example — login API (user → API → user database)**
- Trust boundary: the internet-to-API edge, and the API-to-DB edge.
- Spoofing: attacker guesses/steals credentials → MFA, rate limiting, argon2 password hashing ([[Hashing-vs-Encryption]]).
- Tampering: MITM alters the request → TLS ([[TLS-Handshake]]).
- Repudiation: user denies a password change → append-only audit log with timestamp + source IP.
- Information disclosure: error reveals "user exists" → generic error messages; encrypt the DB.
- DoS: credential-stuffing floods login → per-IP and per-account rate limits, lockout with care (lockout itself is a DoS lever).
- Elevation: role field trusted from the client → server-side authz, deny by default ([[Authentication-vs-Authorization]]).

**Where it fits and common pitfalls**
- Proactive counterpart to reactive [[Incident-Response-Lifecycle]]: model at design time so you have fewer incidents.
- Element-level, not just diagram-level: apply STRIDE per element, not once for the whole system.
- Pitfall: modeling only the happy path; the value is in the trust boundaries and abuse cases.
- Pitfall: a threat model that's a one-time document — it must be revisited as the design evolves.
- Other frameworks to name-drop: DREAD (risk scoring, subjective), PASTA (attacker-centric), attack trees.

## Interview Angle

- Expect a live design threat model: "Here's a system, what could go wrong?" Draw the DFD, mark trust boundaries, then march through STRIDE per element. The structure impresses more than any single finding.
- Memorize the six letters and, for each, the property violated and one mitigation — the table above. "Tampering violates integrity, mitigate with HMAC/signatures" is the expected crispness.
- Expect: "How does STRIDE relate to CIA?" Tampering→I, Info disclosure→C, DoS→A, plus Spoofing→authn, Elevation→authz, Repudiation→non-repudiation.
- Say "trust boundary" out loud and focus analysis there — it signals you know where real threats concentrate.
- Tie-in: this vault's Threat-Model-Template in 06-Cybersecurity-Toolkit operationalizes exactly this process.

## Related

- [[CIA-Triad]]
- [[OWASP-Top-10]]
- [[Incident-Response-Lifecycle]]
- [[Authentication-vs-Authorization]]
- [[Cybersecurity-Index]]
