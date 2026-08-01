---
tags: [concept, cybersecurity]
created: 2026-08-01
status: evergreen
---

# Security Logging and Detection

Hub: [[Cybersecurity-Index]]

## Core Idea

You cannot respond to what you cannot see. Logging decides what evidence exists; detection decides which slivers of it wake a human. The craft is on both ends: log the events that reconstruct an intrusion (authentication, privilege changes, process creation, network egress), protect those logs from the attacker they describe, and write alerts that fire on attacker *behavior* — ideally chains of it — rather than drowning analysts in single-event noise. Detection engineering turns this into an iterative loop, not a one-time setup.

## Details

**What to log (the minimum that reconstructs an attack)**
- Authentication events: successes *and* failures, MFA prompts, source IP/device. Failures show brute force; a success from a new country after failures shows it worked. Pairs with [[Authentication-vs-Authorization]].
- Privilege changes: group membership changes, sudo/admin elevation, new IAM policies, new accounts. Privilege escalation and persistence live here; these events are rare, which makes them high-signal.
- Process creation: which binary, full command line, parent process. The single richest endpoint source — `winword.exe` spawning `powershell.exe -enc ...` is an intrusion story in one log line.
- Network egress: DNS queries, outbound connections (destination, port, bytes). C2 beaconing and data exfiltration are egress phenomena; most defenders over-log inbound and under-log outbound.
- Plus: cloud control-plane audit trails (see [[Cloud-Security]]) and application-level security events (password resets, permission grants).

**Log integrity — protect the evidence**
- Centralize: ship logs off the host in near-real-time to a collector the logged machine cannot write to arbitrarily. The first act of a competent intruder is clearing local logs; shipped copies survive.
- Append-only: write-once storage, restricted deletion rights, retention long enough to cover slow-burn intrusions (breach discovery is often months after entry).
- Integrity extras: synchronized clocks (correlation across sources dies without them) and alerting *on logging being disabled* — an attacker turning off the camera is itself a detection.

**Alerting — signal vs noise**
- Every alert must have a plausible response action; an alert nobody would act on is noise by definition. Alert fatigue is a real failure mode: analysts tune out, and the true positive scrolls past unread.
- Single events are weak evidence; chains are strong. "One failed login" is nothing; "50 failures, then a success, then a new-device MFA enrollment, then a mass mailbox export" is an incident. Alert on the behavior chain, or at least correlate before paging.
- Triage tiers: page a human only for high-confidence/high-impact; dashboard or ticket the rest. Track false-positive rate per rule and treat a noisy rule as a bug.

**SIEM in concept**
- A SIEM (Security Information and Event Management) is the platform that centralizes logs from all sources, normalizes them into a common schema, correlates events across sources, runs detection rules, and manages the alert/case workflow. Think "database plus rule engine plus pager for security telemetry." Whether it's Splunk-class, Elastic-based, or a cloud-native service, the concept is identical.

**Detection engineering loop**
1. Hypothesis: pick an attacker behavior worth catching, typically from a framework like MITRE ATT&CK or from [[Threat-Modeling-STRIDE]]-style analysis of your own systems — e.g. "credential dumping via LSASS access."
2. Rule: write the detection against your actual log schema (query, correlation rule, YARA-style signature — see [[Malware-Analysis-Basics]] for IOC-based inputs).
3. Test: emulate the behavior in an authorized lab environment (purple-team exercise, atomic test) and confirm the rule fires; also confirm it *doesn't* fire on normal admin activity.
4. Tune: run in audit mode, measure false positives against production baseline, add exclusions narrowly, then promote to paging. Revisit as the environment changes.
- Detections are code: version-control them, review them, and attach a runbook so the 3 a.m. responder knows what to do — the hand-off into [[Incident-Response-Lifecycle]].

**Common pitfalls**
- Logging everything with no detections ("we'll grep later") — storage bill, no security.
- Detections nobody tested: rules that have never fired are assumed working and usually broken.
- Keeping logs on the compromised host only; the attacker edits their own record.

## Interview Angle

- "What would you log on a new server?" Lead with the four: authn events, privilege changes, process creation (with command line), network egress — then say *why* each reconstructs a phase of an attack. Structure beats a long unordered list.
- "How do you handle alert fatigue?" Every alert needs an owner and an action; correlate chains instead of paging single events; measure and tune per-rule false-positive rates; demote noisy rules to dashboards.
- "What's a SIEM?" One line — centralize, normalize, correlate, alert — then immediately add that a SIEM is only as good as the log sources and rules you feed it. That caveat is the senior-sounding part.
- Expect "how would you detect X?" (e.g. brute force, exfiltration). Answer in loop form: which log source, what pattern/chain, how you'd test it, how you'd cut false positives.
- Strong detail to drop: alert when logging stops — absence of telemetry is a signal, not a gap.

## Related

- [[Incident-Response-Lifecycle]]
- [[Authentication-vs-Authorization]]
- [[Network-Security]]
- [[Cloud-Security]]
- [[Malware-Analysis-Basics]]
- [[Threat-Modeling-STRIDE]]
- [[Cybersecurity-Index]]
