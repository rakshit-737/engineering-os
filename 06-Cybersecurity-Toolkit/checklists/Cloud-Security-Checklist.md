---
title: "Cloud Security Checklist"
description: "Baseline checklist for an AWS environment covering identity, logging, network, data, compute, and containers."
domain: cybersecurity
category: checklists
type: checklist
difficulty: intermediate
status: evergreen
tags: [checklist, aws, cloud]
prerequisites: [AWS-Security-Fundamentals]
related: [IAM-Deep-Dive, Cloud-Logging, Kubernetes-Security]
order: 30
---

# Cloud Security Checklist

Hub: [[Security-Engineering-OS]]

## Identity

- [ ] Root user has MFA, no access keys
- [ ] Humans use IAM Identity Center / federation, not IAM users
- [ ] No unused or long-lived access keys; CI uses OIDC federation
- [ ] SCPs: deny disabling security services, deny unapproved regions
- [ ] IAM Access Analyzer enabled; external access findings reviewed
- [ ] Permission boundaries for delegated administrators

## Logging and detection

- [ ] Organization CloudTrail, all regions, log file validation
- [ ] Logs in a separate log-archive account with delete protection
- [ ] GuardDuty and Security Hub enabled org-wide
- [ ] AWS Config recording enabled
- [ ] VPC Flow Logs on critical VPCs
- [ ] Alerts for root use, trail changes, IAM changes

## Network

- [ ] No security groups open to 0.0.0.0/0 on admin or database ports
- [ ] Private subnets for data stores
- [ ] WAF in front of public web apps
- [ ] VPC endpoints for AWS services where appropriate

## Data

- [ ] S3 Block Public Access at account level
- [ ] Default encryption for S3, EBS, RDS
- [ ] Customer managed KMS keys for sensitive data with scoped key policies
- [ ] Backups enabled, cross-account, restore tested

## Compute and containers

- [ ] IMDSv2 required on EC2
- [ ] Patch management in place
- [ ] Images scanned and signed
- [ ] Kubernetes: Pod Security Standards enforced, network policies, secrets encryption, private API endpoint
