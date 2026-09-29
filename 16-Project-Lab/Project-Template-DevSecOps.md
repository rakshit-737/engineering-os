---
title: "Project Template: DevSecOps"
description: Project template additions and three scoped ideas for secure delivery pipelines.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [devsecops, ci, security, project]
prerequisites: [Project-Template]
related: [Checklist-Securing-an-Application, Checklist-Releasing-Software]
order: 70
---
# Project Template: DevSecOps

For projects that harden how software is built and shipped.

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **Pipeline diagram:** every stage from commit to production with its security gate
- **Gate policy:** which findings block, which warn, and who can override
- **Supply chain:** SBOM, signing, provenance
- **Metrics:** time added to pipeline, findings over time, false-positive rate

## Extra requirements

- [ ] Every gate has a documented override process.
- [ ] Pipeline changes require review.
- [ ] Signed artifacts verified at deploy.
- [ ] Secrets never printed in CI logs.
- [ ] Scanner false positives tracked and suppressed with justification.

## Project ideas

### 1. Secure CI pipeline for a sample app

- **Target level:** Level 3
- **Scope:** GitHub Actions pipeline with SAST, SCA, secret scanning, container scan, SBOM, and signing.
- **Stack:** GitHub Actions, Semgrep, Trivy, Syft, cosign
- **Milestones:**
  1. Baseline CI
  2. Add scanners with gate policy
  3. SBOM + signing
  4. Deploy-time signature verification
- **What makes it stand out:** End-to-end supply-chain story with verification, not just scanning.

### 2. Policy-as-code admission control

- **Target level:** Level 3
- **Scope:** Kubernetes admission policies that reject non-compliant workloads.
- **Stack:** Kyverno or OPA Gatekeeper, kind, GitHub Actions
- **Milestones:**
  1. Policies: non-root, no latest tag, resource limits
  2. Policy tests
  3. Audit mode then enforce
  4. Report of violations
- **What makes it stand out:** Shows guardrails that prevent insecure deploys automatically.

### 3. Dependency risk dashboard

- **Target level:** Level 2
- **Scope:** Aggregate SCA results across repositories into a prioritized dashboard.
- **Stack:** Python, GitHub API, OSV API, SQLite, simple web UI
- **Milestones:**
  1. Collect lockfiles
  2. Query OSV
  3. Prioritize by severity and reachability hints
  4. Dashboard
- **What makes it stand out:** Turns raw scanner output into decisions.

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
