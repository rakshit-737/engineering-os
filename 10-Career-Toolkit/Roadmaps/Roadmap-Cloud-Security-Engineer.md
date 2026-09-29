---
title: Roadmap -- Cloud Security Engineer
description: Path to cloud security roles -- IAM, network controls, logging, infrastructure as code and misconfiguration detection on one major cloud.
domain: career
category: roadmaps
type: roadmap
role: "Cloud Security Engineer"
difficulty: intermediate
status: evergreen
tags: [cloud, iam, security]
related: [Cloud-Security, Least-Privilege, Roadmap-DevSecOps-Engineer]
order: 60
---

# Roadmap -- Cloud Security Engineer

**What the role does:** secures cloud accounts and workloads: identity, network boundaries, logging/monitoring, guardrails in infrastructure as code, incident response in cloud.

## Stage 1 -- Foundation
- [ ] Linux, networking and scripting ([[Computer-Networks]], [[Linux-Security-Cheat-Sheet]])
- [ ] One cloud (AWS, Azure or GCP) core services: compute, storage, networking, IAM
- [ ] Shared responsibility model ([[Cloud-Security]])

## Stage 2 -- Core
- [ ] IAM policy design and evaluation logic ([[Least-Privilege]])
- [ ] VPC design, security groups, private endpoints
- [ ] Audit logging (e.g. CloudTrail) and alerting ([[Security-Logging-and-Detection]])
- [ ] Encryption at rest/in transit, KMS basics ([[Applied-Cryptography]])
- [ ] Terraform (or equivalent IaC)

## Stage 3 -- Specialization
- [ ] Containers and Kubernetes security (RBAC, pod security, image scanning)
- [ ] Policy as code (e.g. OPA or cloud-native policy services)
- [ ] Cloud incident response ([[Incident-Response-Lifecycle]])

## Stage 4 -- Job-ready
- [ ] Documented secure landing-zone project
- [ ] Explain common cloud breach patterns (public buckets, leaked keys, over-privileged roles)
- [ ] Interview prep ([[Interview-Cybersecurity-Round]])

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| Secure baseline in Terraform | Account/project with least-privilege roles, logging to a locked bucket, alerting on risky events, all as code | IaC + IAM + logging |
| Misconfiguration scanner | Script/tool that checks for public storage, wildcard IAM, open security groups; outputs a report | Automation, cloud APIs |
| Attack-and-detect lab | Deliberately vulnerable cloud lab in a sandbox account; exploit, detect, remediate, write up | Offense-informed defense |

Keep labs in a sandbox account with budget alerts; tear down resources.

## Proof-of-skill signals
IaC repos with policy checks in CI, write-ups, clear architecture diagrams.

## Interview focus
IAM scenarios, network design, "a key leaked -- what now?", Terraform/K8s questions, basic coding/scripting.

## Common traps
Learning three clouds shallowly; console-only work with no IaC; ignoring cost and blast radius.

## Optional certifications
AWS Certified Security - Specialty, CCSK (Cloud Security Alliance), Certified Kubernetes Security Specialist (CKS). Optional.
