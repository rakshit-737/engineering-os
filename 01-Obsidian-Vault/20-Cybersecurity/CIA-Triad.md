---
title: "CIA Triad"
description: "Confidentiality, integrity, availability: the base vocabulary of security."
domain: cybersecurity
category: fundamentals
type: concept
difficulty: beginner
status: evergreen
tags: [cybersecurity, fundamentals]
prerequisites: []
related: [Threat-Modeling-STRIDE, Least-Privilege]
order: 150
---

# CIA Triad

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

## Core Idea

Confidentiality, Integrity, Availability are the three properties every security control defends and every attack degrades. Confidentiality: only authorized parties can read data. Integrity: data and systems are not modified without authorization (and modification is detectable). Availability: authorized parties can access the system when they need it. Naming which leg is at stake turns a vague "this is insecure" into a precise claim.

## Details

**Mapping attacks and controls to the triad**

| Leg | Example attack | Example controls |
|---|---|---|
| Confidentiality | Data breach, sniffing plaintext traffic, IDOR | Encryption at rest/in transit (TLS), access control, data classification |
| Integrity | Tampering with a payment amount, malware modifying binaries, MITM altering traffic | Hashes/MACs, digital signatures, code signing, DB constraints, immutable logs |
| Availability | DDoS, ransomware, deleting backups, resource exhaustion | Redundancy, rate limiting, backups (tested restores), autoscaling, DDoS mitigation |

One attack often hits multiple legs: ransomware destroys availability (files locked) and increasingly confidentiality (data exfiltrated for double extortion).

**Worked example — an online exam platform**
- Confidentiality: question bank must not leak before the exam → encrypt at rest, strict authz on the question API.
- Integrity: submitted answers must not be alterable after submission → server-side timestamps, append-only storage, HMAC over the submission.
- Availability: platform must survive 10k students logging in at 9:00 → load testing, autoscaling, queueing.

**Tradeoffs — the legs pull against each other**
- Stronger confidentiality (mandatory MFA, aggressive lockout) can hurt availability (locked-out legitimate users; account-lockout is itself a DoS vector).
- High availability (many replicas, caches) widens the surface where confidential data lives.
- Integrity checks (signatures, verification steps) add latency.
Security engineering is choosing the balance the business needs, not maximizing one leg.

**Extensions you may be asked about**
- AAA: Authentication, Authorization, Accounting — operational counterpart to CIA.
- Non-repudiation: you cannot deny an action you performed (digital signatures + audit logs); often listed as a fourth property, and it is the "R" concern in [[Threat-Modeling-STRIDE]].
- Parkerian hexad adds possession, authenticity, utility — know it exists, rarely probed.

**Common pitfalls**
- Treating availability as "ops, not security." Ransomware and DDoS are security incidents whose entire impact is availability.
- Hashing does integrity, encryption does confidentiality — mixing these up is a red flag; see [[Hashing-vs-Encryption]].
- Backups protect availability only if restores are tested and backups are offline/immutable (else ransomware encrypts them too).

## Interview Angle

- Use it as an answer frame: "This is primarily a confidentiality issue because..., with a secondary integrity risk because...". Interviewers hear structure immediately.
- Expect: "Give an attack and control for each leg" — have the table above memorized with one concrete example each.
- Expect: "Which leg does ransomware attack?" Say availability first, then mention double extortion → confidentiality. Shows current knowledge.
- STRIDE maps onto CIA: Information disclosure → C, Tampering → I, DoS → A, Spoofing → authn, Elevation → authz, Repudiation → non-repudiation.
- If asked to prioritize: it depends on the asset — medical records (C), bank ledger (I), 911 dispatch (A). Never a universal answer.

## Related

- [[Threat-Modeling-STRIDE]]
- [[Least-Privilege]]
- [[Hashing-vs-Encryption]]
- [[Incident-Response-Lifecycle]]
- [[Cybersecurity-Index]]
