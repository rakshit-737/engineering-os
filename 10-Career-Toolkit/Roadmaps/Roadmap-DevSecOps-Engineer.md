---
title: Roadmap -- DevSecOps Engineer
description: Path to DevSecOps roles -- CI/CD, containers, infrastructure as code, and automated security gates in the delivery pipeline.
domain: career
category: roadmaps
type: roadmap
role: "DevSecOps Engineer"
difficulty: intermediate
status: evergreen
tags: [devsecops, ci-cd, containers]
related: [Roadmap-Cloud-Security-Engineer, Roadmap-Application-Security-Engineer]
order: 70
---

# Roadmap -- DevSecOps Engineer

**What the role does:** builds and secures the delivery pipeline: CI/CD, container and IaC security, secrets management, dependency and supply-chain security, making security checks fast and developer-friendly.

## Stage 1 -- Foundation
- [ ] Linux, networking, scripting (Bash/Python) ([[Linux-Security-Cheat-Sheet]])
- [ ] Git workflows ([[Git-Cheat-Sheet]])
- [ ] Docker: images, layers, networking

## Stage 2 -- Core
- [ ] CI/CD (GitHub Actions or GitLab CI): pipelines, runners, artifacts
- [ ] Infrastructure as code (Terraform)
- [ ] Kubernetes basics
- [ ] Secrets management (vault or cloud secret manager); no secrets in repos
- [ ] Web vulnerability basics ([[OWASP-Top-10]])

## Stage 3 -- Specialization
- [ ] Pipeline security gates: SAST, SCA/dependency scanning, secret scanning, container image scanning, IaC scanning
- [ ] Supply chain: signing artifacts, SBOMs, pinned dependencies, least-privilege CI tokens ([[Least-Privilege]])
- [ ] Runtime/cloud posture ([[Cloud-Security]])
- [ ] Observability and logging ([[Security-Logging-and-Detection]])

## Stage 4 -- Job-ready
- [ ] End-to-end secure pipeline project documented
- [ ] Explain tradeoffs: blocking vs warning gates, false positive handling, pipeline speed

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Secure CI/CD pipeline | App repo with pipeline: tests, SAST, dependency scan, secret scan, image scan, signed image, deploy to a cluster; policy for failing builds | Pipeline engineering + security |
| Hardened container platform | K8s manifests with RBAC, network policies, non-root images, admission policy | Container security |
| IaC security module | Terraform modules with secure defaults + policy checks in CI | Guardrails as code |

## Proof-of-skill signals
Public pipeline configs, reusable actions/modules, documented tuning of noisy scanners.

## Interview focus
CI/CD design, container/K8s security, secrets handling, supply-chain attacks, scripting.

## Common traps
Adding every scanner as a blocking gate; ignoring developer experience; long-lived CI credentials.

## Optional certifications
Certified Kubernetes Administrator (CKA), Certified Kubernetes Security Specialist (CKS), HashiCorp Certified: Terraform Associate. Optional.
