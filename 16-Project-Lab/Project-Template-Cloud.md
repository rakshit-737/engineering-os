---
title: "Project Template: Cloud"
description: Project template additions and three scoped ideas for cloud infrastructure projects.
domain: projects
category: templates
type: template
difficulty: intermediate
status: evergreen
tags: [cloud, infrastructure, project]
prerequisites: [Project-Template]
related: [Pattern-Infrastructure-as-Code, Checklist-Deployment]
order: 60
---
# Project Template: Cloud

For projects whose main deliverable is infrastructure. Everything is defined with [[Pattern-Infrastructure-as-Code]].

Start from [[Project-Template]] and add the sections below. Target levels refer to [[Project-Maturity-Model]].

## Domain-specific sections

- **Cost model:** expected monthly cost and budget alerts
- **Network design:** VPCs, subnets, ingress/egress rules diagram
- **Identity:** roles, least-privilege policies, CI federation (OIDC)
- **Teardown:** one command to destroy everything

## Extra requirements

- [ ] All infrastructure in code; no console-created resources.
- [ ] Budget alert configured before first apply.
- [ ] Policy scanning (Checkov/tfsec) in CI.
- [ ] Remote, encrypted, locked state.
- [ ] Documented teardown tested at least once.

## Project ideas

### 1. Static site platform with CI/CD

- **Target level:** Level 2
- **Scope:** S3/CloudFront (or equivalent) hosting with OIDC-based GitHub Actions deploys and preview environments.
- **Stack:** Terraform, AWS or GCP, GitHub Actions
- **Milestones:**
  1. Bucket + CDN + TLS
  2. OIDC deploy role
  3. Preview environments per PR
  4. Budget alerts and teardown
- **What makes it stand out:** No long-lived cloud keys anywhere.

### 2. Kubernetes platform starter

- **Target level:** Level 4
- **Scope:** Managed Kubernetes cluster with GitOps, ingress, cert management, metrics, and a sample app.
- **Stack:** Terraform, EKS/GKE or k3s, Argo CD, Prometheus/Grafana
- **Milestones:**
  1. Cluster via IaC
  2. GitOps with Argo CD
  3. Observability stack
  4. Canary rollout of sample app ([[Pattern-Canary-Release]])
- **What makes it stand out:** Reproducible platform someone else can stand up from the README.

### 3. Serverless event pipeline

- **Target level:** Level 3
- **Scope:** Upload -> queue -> function -> database pipeline with retries and DLQ.
- **Stack:** Terraform, AWS Lambda/SQS/DynamoDB or GCP equivalents
- **Milestones:**
  1. Pipeline skeleton
  2. Retries and DLQ
  3. Idempotent processing
  4. Load test and cost report
- **What makes it stand out:** Cost and failure behavior measured, not assumed.

All ideas are tracked in [[Project-Ideas-Backlog]]. Back to [[Project-Lab-Index]].
