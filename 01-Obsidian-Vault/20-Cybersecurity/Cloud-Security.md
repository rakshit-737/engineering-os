---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# Cloud Security

Hub: [[Cybersecurity-Index]]

## Core Idea

In the cloud, most breaches are not the provider being hacked — they are customers misconfiguring what they control. The shared responsibility model draws the line: the provider secures the infrastructure ("security *of* the cloud"), the customer secures their identities, data, and configuration ("security *in* the cloud"). Cloud defense is therefore mostly three disciplines: identity done right (IAM, least privilege), configuration kept closed (buckets, security groups), and everything audited (CloudTrail-style logs).

## Details

**Shared responsibility model**
- Provider: physical datacenters, hypervisor, hardware, the managed service's underlying software.
- Customer: IAM policies, data classification and encryption choices, network rules, OS patching on IaaS VMs, application code.
- The line moves with the service model: IaaS leaves you the OS upward; PaaS/serverless shrinks your share to code, identity, and data — but identity and data are *never* the provider's job.
- Exam-worthy consequence: "the cloud is secure" and "my deployment is secure" are independent claims.

**IAM — identity is the new perimeter**
- Roles over keys: long-lived access keys leak (committed to git, baked into images) and rarely get rotated. Roles issue short-lived, automatically rotated credentials to compute — nothing durable to steal.
- Least-privilege policies: grant specific actions on specific resources, not `*:*`. Start from what the workload actually calls, use the provider's access-analysis tooling to shrink unused permissions over time. This is [[Least-Privilege]] as JSON.
- Humans: SSO + MFA, no shared accounts; separate roles for read-only daily work vs privileged change. See [[Authentication-vs-Authorization]] — cloud IAM makes the authn/authz split concrete in one policy engine.

**Metadata endpoint risk (the classic cloud-specific bug)**
- Cloud VMs expose an instance metadata service at a link-local address (169.254.169.254) that hands out the instance's role credentials.
- Textbook attack chain, known from real incidents: an app with an SSRF flaw is tricked into fetching that internal URL server-side → response contains live cloud credentials → attacker uses them with the role's full permissions. SSRF plus over-broad role = cloud-wide breach.
- Defenses, in layers: IMDSv2 (session-oriented — requires a PUT to get a token plus a special header, and a hop limit of 1, which plain SSRF and forwarded requests cannot satisfy); minimal permissions on instance roles so stolen credentials are worth little; egress controls; and fixing the SSRF itself (allowlist outbound fetch targets).
- Detection: cloud audit logs flag instance credentials used from outside the instance's network — a high-fidelity alert.

**Misconfiguration — the top causes**
- Public storage buckets: object storage flipped to public (or "authenticated users" meaning *any* account) exposes data to simple enumeration. Defense: account-level "block public access," bucket policies denying public ACLs, periodic automated scans.
- Open security groups: `0.0.0.0/0` inbound on SSH/RDP/database ports invites internet-wide scanning and brute force. Defense: admin access via VPN/bastion or identity-based session tools, default-deny groups, infrastructure-as-code review so a wide-open rule is caught in the PR.
- Honorable mentions: secrets in code/user-data, disabled logging, orphaned resources nobody patches. Config-scanning (CSPM-style) tools exist to continuously diff reality against these rules.

**Data protection**
- Encrypt at rest using the provider's KMS: managed keys make encryption a checkbox, customer-managed keys add control over rotation and revocation. Encryption at rest does not fix a public bucket — the service decrypts for anyone the policy allows, so IAM remains the real gate.
- TLS for every service-to-service hop; providers make this default, so a finding here is usually a legacy internal endpoint.

**Logging and audit**
- CloudTrail-style audit logs record every control-plane API call: who, what, when, from where. This is the ground truth for "what did the attacker do with the stolen key" — see [[Incident-Response-Lifecycle]].
- Send logs to a separate, restricted account/bucket so an attacker with admin in the workload account cannot erase their tracks.
- Alert on high-signal events: root/break-glass account use, IAM policy changes, logging disabled, security group opened to the world, unusual regions. Feed into [[Security-Logging-and-Detection]].

## Interview Angle

- "Who patches the OS?" Depends on service model: you on IaaS, provider on PaaS/managed services. Answering "it depends, here's the line" *is* the correct answer.
- "How do you avoid leaking cloud credentials?" Roles with short-lived credentials instead of static keys, secret scanning in CI, IMDSv2 enforced, alert on credential use from unexpected networks.
- Expect the SSRF → metadata → credential theft chain as a scenario question; walk it attack-step by defense-step and name IMDSv2. It shows you know cloud-specific, not just ported on-prem, security.
- "Biggest real-world cloud risk?" Misconfiguration and over-privileged identities, not hypervisor escapes. Concrete examples: public bucket, open security group, `*:*` role.
- Strong closer: "logs in a separate account, because the first thing a competent attacker does with admin is delete the logs."

## Related

- [[Least-Privilege]]
- [[Authentication-vs-Authorization]]
- [[OWASP-Top-10]]
- [[Security-Logging-and-Detection]]
- [[Incident-Response-Lifecycle]]
- [[Cybersecurity-Index]]
