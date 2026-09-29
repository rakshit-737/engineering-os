---
title: Roadmap -- SOC Analyst
description: Hands-on path to a SOC analyst role -- log analysis, triage, detection and incident handling, proven with a lab and write-ups.
domain: career
category: roadmaps
type: roadmap
role: "SOC Analyst"
difficulty: beginner
status: evergreen
tags: [soc, blue-team, detection]
related: [SOC-Analyst-Playbook, Interview-Cybersecurity-Round, Cybersecurity-Career-Roadmap]
order: 40
---

# Roadmap -- SOC Analyst

**What the role does:** monitors alerts, triages and investigates suspicious activity, escalates incidents and improves detections. Often shift-based at entry level.

## Stage 1 -- Foundation
- [ ] Networking, ports and protocols ([[Computer-Networks]], [[Common-Ports-and-Protocols-Cheat-Sheet]])
- [ ] Windows internals for defenders: event logs, processes, services, AD basics ([[Windows-Security-Cheat-Sheet]])
- [ ] Linux logs and commands ([[Linux-Security-Cheat-Sheet]])
- [ ] Security basics ([[CIA-Triad]], [[Authentication-vs-Authorization]])

## Stage 2 -- Core
- [ ] SIEM querying (Splunk SPL or Elastic KQL, pick one)
- [ ] Alert triage workflow ([[SOC-Analyst-Playbook]])
- [ ] Packet analysis ([[Network-Traffic-Analysis-Cheat-Sheet]])
- [ ] Phishing email analysis: headers, links, attachments
- [ ] MITRE ATT&CK technique mapping
- [ ] Incident lifecycle ([[Incident-Response-Lifecycle]], [[Incident-Response-Playbook]])

## Stage 3 -- Specialization
- [ ] Writing detection rules (e.g. Sigma) and tuning false positives ([[Security-Logging-and-Detection]])
- [ ] Endpoint telemetry (Sysmon)
- [ ] Basic malware triage ([[Malware-Analysis-Basics]])

## Stage 4 -- Job-ready
- [ ] 3 investigation write-ups from labs or blue-team challenges
- [ ] Scenario question practice ([[Interview-Cybersecurity-Round]])

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Home SOC lab | Windows + Linux VMs with Sysmon, forwarding to a SIEM; simulate attacks (e.g. Atomic Red Team) and detect them ([[Home-Lab-Setup-Guide]]) | End-to-end detection |
| Detection rule pack | 10+ documented rules mapped to ATT&CK with test cases and known false positives | Detection engineering |
| Investigation reports | Blue-team challenge write-ups: timeline, IOCs, root cause, recommendations | Analysis and communication |

## Proof-of-skill signals
Clear written investigation reports; rule repo; blue-team challenge progress.

## Interview focus
Scenario triage, log reading, ports/protocols, common attacks, communication under pressure.

## Common traps
Only doing offensive CTFs; no written reports; memorizing tool UIs instead of the underlying events.

## Optional certifications
CompTIA Security+, CompTIA CySA+, Blue Team Level 1 (Security Blue Team). Helpful for HR filters in some regions, not a substitute for a lab.
