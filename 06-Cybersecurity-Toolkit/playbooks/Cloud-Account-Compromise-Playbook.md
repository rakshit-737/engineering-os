---
title: "Cloud Account Compromise Playbook"
description: "AWS-focused response to leaked access keys or a compromised cloud principal: contain, investigate with CloudTrail, eradicate persistence."
domain: cybersecurity
category: playbooks
type: playbook
difficulty: advanced
status: evergreen
tags: [aws, cloud, incident-response]
prerequisites: [IAM-Deep-Dive, Cloud-Logging]
related: [Incident-Response-Playbook, Incident-Response-Checklist, Compromised-Credentials-Playbook, Cloud-Security-Checklist]
order: 40
---

# Cloud Account Compromise Playbook

Hub: [[Security-Engineering-OS]]

## Triggers

GuardDuty finding, leaked access key notification, unexpected billing spike (crypto mining), unknown resources, CloudTrail logging disabled.

## 1. Contain

- **Access key**: deactivate (then delete after investigation) the key with `aws iam update-access-key --status Inactive`.
- **Role sessions**: temporary credentials cannot be revoked individually; attach a deny policy conditioned on `aws:TokenIssueTime` (the console "Revoke active sessions" does this).
- Attach an explicit-deny quarantine policy to the principal if needed.
- If the account itself is broadly compromised, apply a restrictive SCP from the org management account.
- Secure the root user (password, MFA) and check for new IAM users.

## 2. Investigate with CloudTrail

- Filter by `accessKeyId` / principal ARN across **all regions**.
- Key questions: what identity, what source IPs, which API calls, what succeeded (`errorCode` empty)?
- Look for recon (`GetCallerIdentity`, `List*`, `Describe*`), persistence (`CreateUser`, `CreateAccessKey`, `CreateLoginProfile`, `UpdateAssumeRolePolicy`, new Lambda functions), evasion (`StopLogging`, `DeleteDetector`), and impact (`RunInstances` in unused regions, S3 `GetObject` volume via data events, KMS `ScheduleKeyDeletion`).
- Review GuardDuty findings, VPC Flow Logs, and Config history.

## 3. Eradicate

- Delete attacker-created IAM users, keys, roles, policies, trust relationships, Lambda functions, EC2 instances, and snapshots shared externally.
- Check every region.
- Restore modified resource policies (S3, KMS, SNS/SQS).

## 4. Recover

- Re-enable logging/detectors; restore data from backups if tampered.
- Contact AWS Support (especially for billing impact).

## 5. Harden

- Eliminate long-lived keys (use roles, Identity Center, OIDC federation for CI).
- Secret scanning in repos; SCPs denying disabling of CloudTrail/GuardDuty; region deny SCP.
- Alerts listed in [[Cloud-Logging]].
