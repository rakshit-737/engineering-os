---
title: Roadmap -- Cybersecurity Engineer
description: Generalist security path that builds breadth across networks, systems, web and detection before picking a specialization.
domain: career
category: roadmaps
type: roadmap
role: "Cybersecurity Engineer"
difficulty: intermediate
status: evergreen
tags: [security, generalist]
related: [Cybersecurity-Career-Roadmap, Interview-Cybersecurity-Round, Cybersecurity-Index]
order: 20
---

# Roadmap -- Cybersecurity Engineer

**What the role does:** a broad title used for engineers who build and operate security controls: hardening, monitoring, vulnerability management and incident support. Use this roadmap to build breadth, then move to a specialized one ([[Roadmap-SOC-Analyst]], [[Roadmap-Application-Security-Engineer]], [[Roadmap-Cloud-Security-Engineer]]). Wider context: [[Cybersecurity-Career-Roadmap]].

## Stage 1 -- Foundation
- [ ] Networking: TCP/IP, DNS, HTTP, TLS ([[Computer-Networks]], [[TLS-Handshake]], [[Common-Ports-and-Protocols-Cheat-Sheet]])
- [ ] Linux and Windows administration basics ([[Linux-Security-Cheat-Sheet]], [[Windows-Security-Cheat-Sheet]])
- [ ] Scripting in Python and Bash
- [ ] Security principles: CIA, least privilege, authn vs authz ([[CIA-Triad]], [[Least-Privilege]], [[Authentication-vs-Authorization]])

## Stage 2 -- Core
- [ ] Cryptography usage ([[Applied-Cryptography]], [[Hashing-vs-Encryption]])
- [ ] Web vulnerabilities ([[OWASP-Top-10]], [[SQL-Injection]], [[XSS]])
- [ ] Packet analysis with Wireshark ([[Network-Traffic-Analysis-Cheat-Sheet]], [[Network-Security]])
- [ ] Logging and detection ([[Security-Logging-and-Detection]])
- [ ] Threat modeling ([[Threat-Modeling-STRIDE]])

## Stage 3 -- Specialization
- [ ] Pick one track and follow its roadmap
- [ ] Incident response process ([[Incident-Response-Lifecycle]], [[Incident-Response-Playbook]])
- [ ] Vulnerability scanning and remediation prioritization
- [ ] CTF practice in your track ([[CTF-Getting-Started-Guide]])

## Stage 4 -- Job-ready
- [ ] Documented home lab ([[Home-Lab-Setup-Guide]])
- [ ] 2-3 write-ups (CTF, lab, or detection engineering)
- [ ] Security interview practice ([[Interview-Cybersecurity-Round]], [[Security-Interview-Questions]])

## How this differs from neighbouring roles
- vs [[Roadmap-Security-Engineer]]: less production coding, more operating tools (firewalls, EDR, SIEM, scanners) across a fleet.
- vs [[Roadmap-SOC-Analyst]]: you build and harden the controls; the SOC analyst watches their output on shift.
- This is a **breadth** roadmap: finish it, then commit to one specialized roadmap within 6 months or your profile reads as unfocused.

## Readiness test (do these cold before applying)
- [ ] Given a fresh Linux VM, harden it (SSH keys only, firewall default-deny, auditd, unattended upgrades) and prove each control with a command.
- [ ] Read a pcap of a brute-force + successful login and write a one-page incident summary with timeline and IOCs.
- [ ] Prioritise 20 scanner findings by exploitability and exposure, not CVSS alone, and defend the order.

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Hardened home lab with central logging | VMs (Linux + Windows), firewall, log shipping to a SIEM (e.g. Wazuh or Elastic), attack simulation, detection write-ups | Systems, networking, detection |
| Vulnerable web app audit | Deploy an intentionally vulnerable app locally, find and fix 5+ issues, write a report with severity | Web security, reporting |
| Security automation script/tool | e.g. log parser that flags brute-force attempts, with tests | Scripting, engineering quality |

## Proof-of-skill signals
Lab write-ups, CTF results, a public repo of detection rules or tools, responsible-disclosure reports.

## Interview focus
Fundamentals breadth, scenario questions, one technical deep-dive, project defense.

## Common traps
- Collecting certs with no hands-on evidence
- Only offensive CTFs when applying for defensive roles
- Weak networking fundamentals

## Optional certifications
CompTIA Security+ (entry-level breadth). Not a substitute for labs.
