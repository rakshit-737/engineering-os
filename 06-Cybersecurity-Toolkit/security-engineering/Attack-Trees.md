---
title: "Attack Trees"
description: "Modeling attacker goals as AND/OR trees to reason about threats and prioritize defenses."
domain: cybersecurity
category: security-engineering
type: concept
difficulty: intermediate
status: evergreen
tags: [threat-modeling, security-engineering]
prerequisites: [Threat-Model-Template]
related: [MITRE-ATTACK, Security-Architecture]
order: 10
---

# Attack Trees

Hub: [[Security-Engineering-OS]]

## Idea

Popularized by Bruce Schneier: the root node is the attacker's goal; children are ways to achieve it. **OR** nodes: any child suffices. **AND** nodes: all children needed. Leaves are concrete attack steps you can assign attributes to (cost, skill, detectability, existing mitigations).

## Example: read another user's private documents

```mermaid
flowchart TD
  G[Read victim's private docs] --> O1[OR: Take over account]
  G --> O2[OR: Bypass authorization]
  G --> O3[OR: Access storage directly]
  O1 --> P[Phish credentials AND bypass MFA]
  O1 --> R[Abuse password reset flow]
  O2 --> I[IDOR on document ID]
  O3 --> S[Misconfigured public bucket]
  O3 --> K[Stolen cloud keys]
```

## How to use one

1. Define a concrete goal from the attacker's point of view.
2. Decompose until leaves are testable.
3. Annotate leaves (feasibility, impact, mitigations present).
4. Find the cheapest paths; fix controls that cut many paths (chokepoints like strong authz checks).
5. Turn leaves into test cases and detections.

## Tradeoffs

- Pros: forces attacker thinking, explains prioritization to non-security folks.
- Cons: can explode in size; quality depends on the author's knowledge. Pair with STRIDE (see [[Threat-Model-Template]]) and [[MITRE-ATTACK]] for coverage.
