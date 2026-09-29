---
title: "Ransomware Response Playbook"
description: "Response to suspected ransomware: rapid containment, scoping, preserving evidence, recovery from backups, and stakeholder coordination."
domain: cybersecurity
category: playbooks
type: playbook
difficulty: advanced
status: evergreen
tags: [ransomware, incident-response, dfir]
prerequisites: [Incident-Response-Lifecycle, Malware-Analysis-Basics]
related: [Incident-Response-Playbook, Incident-Response-Checklist]
order: 20
---

# Ransomware Response Playbook

Hub: [[Security-Engineering-OS]]

## Trigger

Mass file renames/encryption, ransom notes, EDR ransomware detection, sudden backup deletion, or shadow copy deletion.

## 0. Declare

Declare a high-severity incident, open a war room, start a timeline, involve leadership, legal, and communications early. Follow [[Incident-Response-Playbook]] roles.

## 1. Contain (minutes matter)

- Isolate affected hosts via EDR network containment rather than powering off (memory may hold keys/evidence) unless your plan says otherwise.
- Disable compromised accounts; reset privileged credentials (plan for domain-wide Kerberos `krbtgt` double reset if AD is compromised).
- Block known C2 at firewall/DNS.
- Protect backups: take them offline, confirm immutability, restrict backup admin accounts.
- Consider segmenting networks or shutting down shared file services to stop spread.

## 2. Scope and preserve evidence

- Identify patient zero and initial access (phishing, exposed RDP/VPN, vulnerable edge device).
- Collect memory and disk images of key systems, logs (EDR, AD, VPN, firewall).
- Look for data exfiltration (double extortion): large outbound transfers, archiving tools.
- Identify the strain via ransom note / file extension (e.g., using public resources like No More Ransom for possible decryptors).

## 3. Eradicate

- Remove persistence (scheduled tasks, services, GPOs, new accounts).
- Patch the initial access vector.
- Rebuild domain controllers or critical systems from known-good if integrity is in doubt.

## 4. Recover

- Restore from clean, tested backups in priority order (identity -> core infra -> business apps).
- Scan restored data; monitor heavily for re-infection.

## 5. Legal, regulatory, communications

- Legal counsel decides on notifications (regulators, customers, law enforcement) and any ransom-related questions; payment may carry sanctions and legal risk.
- Single source of truth for internal and external comms.

## 6. Post-incident

Root cause, detection gaps mapped to [[MITRE-ATTACK]], backup and segmentation improvements, tabletop exercise.

> TODO: add your organization's contact list and backup restore runbook links.
