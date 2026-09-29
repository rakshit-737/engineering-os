---
title: "Security Labs Tracker"
description: "Tracker of legal, hands-on security exercises for a home lab and authorized practice platforms."
domain: cybersecurity
category: labs
type: guide
difficulty: beginner
status: evergreen
tags: [labs, hands-on, practice]
prerequisites: [Home-Lab-Setup-Guide]
related: [CTF-Getting-Started-Guide, Web-App-Pentest-Methodology, Cloud-Security-Checklist]
order: 10
---

# Security Labs Tracker

Hub: [[Security-Engineering-OS]]

> Practice only on systems you own or on platforms that explicitly authorize it. Set up your environment with [[Home-Lab-Setup-Guide]].

## Foundations

- [ ] Build an isolated lab network (host-only / internal network in a hypervisor)
- [ ] Capture and analyze your own traffic with Wireshark
- [ ] Harden a Linux VM (SSH keys only, firewall, auto updates) and audit it with Lynis
- [ ] Complete beginner rooms on TryHackMe or OverTheWire Bandit

## Web security

- [ ] Run OWASP Juice Shop locally and solve 10 challenges
- [ ] Solve DVWA SQLi and XSS at low and medium levels, then read the source fix
- [ ] Work through PortSwigger Web Security Academy access-control labs
- [ ] Write a mini pentest report using [[Web-App-Pentest-Methodology]]

## Blue team / detection

- [ ] Deploy a SIEM (e.g., Wazuh or Elastic) in the lab and ingest Sysmon logs
- [ ] Run a few Atomic Red Team tests in the lab and write detections mapped to [[MITRE-ATTACK]]
- [ ] Complete a Blue Team Labs Online or CyberDefenders investigation
- [ ] Analyze a phishing email sample following [[Phishing-Response-Playbook]]

## Cloud

- [ ] Create a personal AWS account with billing alerts and root MFA
- [ ] Enable CloudTrail and GuardDuty; generate sample findings
- [ ] Write an SCP and a permission boundary; test with the policy simulator
- [ ] Complete flAWS / flAWS2 (intentionally vulnerable AWS CTF)
- [ ] Encrypt an S3 object with a customer managed KMS key and review the CloudTrail events

## Containers and Kubernetes

- [ ] Scan an image with Trivy and fix findings
- [ ] Run a kind / minikube cluster with a restricted Pod Security namespace
- [ ] Apply a default-deny NetworkPolicy and verify with test pods
- [ ] Sign and verify an image with cosign

## CTFs

- [ ] Play one jeopardy CTF (see [[CTF-Getting-Started-Guide]]) and write up two challenges
