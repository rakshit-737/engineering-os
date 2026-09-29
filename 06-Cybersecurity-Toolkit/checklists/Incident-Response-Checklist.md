---
title: "Incident Response Checklist"
description: "Quick checklist to run during an incident, mapped to preparation, detection, containment, eradication, recovery, and lessons learned."
domain: cybersecurity
category: checklists
type: checklist
difficulty: intermediate
status: evergreen
tags: [checklist, incident-response]
prerequisites: [Incident-Response-Lifecycle]
related: [Incident-Response-Playbook, Ransomware-Response-Playbook, Phishing-Response-Playbook]
order: 20
---

# Incident Response Checklist

Hub: [[Security-Engineering-OS]]

## Preparation (before incidents)

- [ ] Contact list (IR lead, legal, comms, execs, vendors) current
- [ ] Logging centralized with adequate retention
- [ ] EDR deployed; isolation tested
- [ ] Backups immutable and restore tested
- [ ] Playbooks exercised in a tabletop in the last year

## Detection and analysis

- [ ] Incident declared, severity set, incident lead named
- [ ] Timeline document started (UTC timestamps)
- [ ] Initial IOCs collected
- [ ] Scope: affected users, hosts, accounts, data
- [ ] Evidence preserved (memory, disk, logs) with chain of custody

## Containment

- [ ] Affected hosts isolated
- [ ] Compromised credentials revoked / rotated
- [ ] Malicious IPs, domains, hashes blocked
- [ ] Attacker access paths closed

## Eradication

- [ ] Persistence mechanisms removed
- [ ] Root cause identified and patched

## Recovery

- [ ] Systems restored from known-good state
- [ ] Heightened monitoring in place
- [ ] Business owners confirm service restored

## Post-incident

- [ ] Legal decided on notification obligations
- [ ] Blameless post-incident review held
- [ ] Action items assigned with owners and dates
- [ ] Detections and playbooks updated
