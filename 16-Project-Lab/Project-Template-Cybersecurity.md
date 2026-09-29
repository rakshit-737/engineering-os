---
title: "Project Template: Cybersecurity"
description: Project template additions and three scoped ideas for security tooling and labs.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [security, project]
prerequisites: [Project-Template]
related: [Secure-Coding-Examples, Checklist-Securing-an-Application]
order: 30
---
# Project Template: Cybersecurity

For defensive tools, detection engineering, and lab environments. Offensive techniques are practiced only in environments you own or are authorized to test.

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **Threat model:** assets, attackers, entry points, STRIDE table
- **Scope and authorization:** exactly which systems the tool may touch and written authorization for any testing
- **Detection logic:** rules, data sources, and how false positives are measured
- **Safe handling:** how samples, credentials, and findings are stored and redacted

## Extra requirements

- [ ] Tool refuses targets outside a configured allowlist.
- [ ] Test corpus includes benign cases to measure false positives.
- [ ] Findings map to a standard (CWE, OWASP, MITRE ATT&CK) where applicable.
- [ ] No real secrets or live malware in the repository.
- [ ] Responsible disclosure note in the README for any vulnerability discovered.

## Project ideas

### 1. Secrets scanner with verification-free triage

- **Target level:** Level 3
- **Scope:** CLI that scans git history for secrets using entropy plus regex rules, with an allowlist and SARIF output.
- **Stack:** Go or Python, SARIF, GitHub Actions
- **Milestones:**
  1. Regex + entropy detectors with test corpus
  2. Git history traversal
  3. Allowlist and baseline file
  4. SARIF output and CI integration
- **What makes it stand out:** Measured precision/recall on a labeled corpus and real CI integration.

### 2. Detection lab with ATT&CK-mapped rules

- **Target level:** Level 3
- **Scope:** Local lab (VMs or containers) generating attack telemetry and Sigma rules that detect it.
- **Stack:** Docker/VirtualBox, Sysmon or auditd, Elastic or Wazuh, Sigma
- **Milestones:**
  1. Build lab with logging pipeline
  2. Emulate 5 techniques with Atomic Red Team
  3. Write and test Sigma rules
  4. Document false-positive rate on benign activity
- **What makes it stand out:** Shows detection engineering end to end, with each rule tied to a technique and test.

### 3. Vulnerable-by-design API and fixed twin

- **Target level:** Level 2
- **Scope:** Small API with deliberate OWASP API Top 10 flaws, plus a fixed version and tests proving each fix.
- **Stack:** Python/FastAPI, pytest, Docker
- **Milestones:**
  1. Implement 5 vulnerable endpoints
  2. Write exploit tests that pass on vulnerable build
  3. Fix each and make exploit tests fail
  4. Write-up per vulnerability
- **What makes it stand out:** Demonstrates both attack understanding and secure fixes, test-verified (see [[Secure-Coding-Examples]]).

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
