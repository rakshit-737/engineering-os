---
title: "Incident Response Lifecycle"
description: "Concept note: the NIST/PICERL IR phases, why their order matters, and IR metrics."
domain: cybersecurity
category: defensive
type: concept
difficulty: beginner
status: evergreen
tags: [cybersecurity, incident-response]
prerequisites: []
related: [Incident-Response-Playbook]
order: 180
---

# Incident Response Lifecycle

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

> **Concept vs playbook:** this note explains *why* the IR phases exist and why their order matters. For the step-by-step operational runbook (severity matrix, roles, commands), use [[Incident-Response-Playbook]]; for a printable tick-list use Incident Response Checklist; scenario-specific runbooks: Phishing Response Playbook, Ransomware Response Playbook, Compromised Credentials Playbook, Cloud Account Compromise Playbook.

## Core Idea

NIST SP 800-61 defines four phases: Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity (lessons learned). Often taught as six steps (PICERL: Preparation, Identification, Containment, Eradication, Recovery, Lessons learned). The lifecycle is a loop, not a line — lessons learned feed back into preparation.

## Details

**Phase by phase**

1. **Preparation** — everything before the alarm: IR plan and runbooks, contact tree, logging/EDR deployed, backups tested, tabletop exercises, pre-authorized powers (who may pull a server offline). Most IR failures are preparation failures.
2. **Detection & Analysis** — triage alerts (SIEM, EDR, user reports), confirm it's a real incident, scope it: what's compromised, since when, what's the attacker doing. Establish a timeline from logs. Assign severity — this drives who gets woken up.
3. **Containment** — stop the bleeding without destroying evidence. Short-term: isolate the host from the network (do NOT power off — RAM holds keys, malware, connections), block C2 IPs, disable compromised accounts, revoke tokens. Long-term: patched/rebuilt systems ready to swap in.
4. **Eradication** — remove the attacker's presence: delete malware and persistence (cron jobs, startup items, rogue accounts, web shells), patch the exploited vulnerability, rotate all credentials that could have been exposed.
5. **Recovery** — restore from known-good backups or rebuilt images, return to production gradually, monitor closely for re-compromise (attackers often left a second door).
6. **Lessons learned** — blameless postmortem within ~2 weeks: timeline, root cause, what worked, what didn't, concrete action items with owners. Update runbooks and detections.

**Worked example — web server ransomware note**
- Detect: EDR flags mass file renames on `web-01`; on-call confirms encryption in progress.
- Contain: isolate `web-01` at the switch/EDR (keep it running for forensics), snapshot memory and disk, check lateral movement to `web-02`, `db-01`.
- Analyze: logs show initial access via an unpatched CMS plugin 9 days ago; credentials from the box were reused elsewhere → scope widens.
- Eradicate: rebuild from clean image, patch the plugin, rotate every credential the box held (DB passwords, API keys).
- Recover: restore content from offline backup, monitor egress for a week.
- Lessons: plugin patching was manual → automate; backups worked but restore took 11 hours → set an RTO and rehearse.

**Key ordering rules (interview traps)**
- Containment before eradication: wiping the box first destroys the evidence that tells you *how* they got in — you'll be re-compromised the same way.
- Preserve volatile evidence before pulling power; follow order of volatility (RAM → disk → logs).
- Don't tip off the attacker mid-analysis (e.g., mass password reset before you've scoped access) unless active damage forces your hand.

**Common pitfalls**
- No pre-agreed severity levels → hours lost debating instead of containing.
- Restoring from backups taken *after* initial compromise → restoring the backdoor.
- Skipping the postmortem once things work again; the loop never closes.
- Blameful postmortems → next time, people hide evidence.

**Metrics and non-technical tracks**
- MTTD (mean time to detect) and MTTR (mean time to respond/recover) are the numbers leadership tracks; shrinking them is the point of preparation and good logging.
- IR is not only technical: legal/compliance (breach-notification clocks like GDPR's 72 hours), comms (customers, regulators), and management run in parallel with the technical response. Name these tracks and you sound like someone who has run a real incident.

## Interview Angle

- Be able to recite the phases in order and give one action per phase — this is a direct question in security interviews and SOC roles.
- Expect the scenario: "You get an alert that a production server is compromised. Walk me through your response." Answer in lifecycle order, and say "isolate, don't power off" explicitly — it's the classic checkpoint.
- Expect: "Why containment before eradication?" Evidence preservation + scoping; you can't eradicate what you haven't scoped.
- Mention concrete artifacts: IR runbook, on-call rotation, tabletop exercises, blameless postmortem — shows you think operationally, not just theoretically.
- Tie-in: [[Threat-Modeling-STRIDE]] is proactive (design time), IR is reactive (run time); [[Least-Privilege]] limits blast radius, shrinking the containment scope.

## Related

- [[Threat-Modeling-STRIDE]]
- [[Least-Privilege]]
- [[CIA-Triad]]
- [[Cybersecurity-Index]]
