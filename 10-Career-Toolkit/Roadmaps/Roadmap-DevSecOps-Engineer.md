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

## How this differs from neighbouring roles
- vs [[Roadmap-Cloud-Security-Engineer]]: your unit is the CI/CD pipeline and artifacts (images, IaC, dependencies), not the cloud org.
- vs a plain DevOps/SRE role: every pipeline stage you build must also enforce a security gate without killing developer velocity.
- The deciding skill: adding a security check that blocks real problems and has a false-positive rate developers tolerate.

## Readiness test (do these cold before applying)
- [ ] Add SCA, secret scanning, and image scanning to a CI pipeline with a documented fail threshold and an exception process.
- [ ] Sign a container image and enforce signature verification at deploy (e.g. cosign + admission policy).
- [ ] Explain a real supply-chain attack pattern (dependency confusion, typosquatting, compromised CI token) and the control that stops it.

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
