# SOC Analyst Playbook

> The working manual for the most common entry role in security: SOC analyst. Everything here is defensive — triaging alerts, investigating on systems your organization owns or is authorized to defend. Pairs with [[Incident-Response-Lifecycle]], [[Security-Logging-and-Detection]], and Incident-Response-Playbook.md (this folder): when an alert becomes a confirmed incident, that playbook takes over.

---

## 1) What a SOC Does

A Security Operations Center monitors an organization's telemetry (endpoints, network, identity, cloud), detects suspicious activity, and responds. The pipeline: **logs → SIEM/EDR detections → alerts → triage → investigation → incident response**.

| Tier | Role | What the work actually is |
|---|---|---|
| **Tier 1** | Alert triage | Work a queue of alerts on shift. Read the alert, pull the raw logs, decide: false positive, benign, or real. Close with a documented reason or escalate with evidence. Follows runbooks like this one. |
| **Tier 2** | Investigation / incident handling | Take escalations from Tier 1. Deep-dive: scope across hosts and accounts, timeline the activity, drive containment, do light forensics. Tunes detections based on what Tier 1 keeps seeing. |
| **Tier 3** | Hunting / detection engineering / IR lead | Proactive threat hunting (assume the alert never fired), building new detections, malware analysis, leading major incidents. |

**Honest description of Tier 1:** it is shift work (SOCs run 24/7), the queue is 50–150 alerts per shift, and the large majority are false positives or benign activity — vulnerability scanners, admins doing admin things, misconfigured rules. The skill is closing those *fast without closing wrong*, because the one real alert looks almost identical to the fifty benign ones. Tier 1 is repetitive, and it is also where you learn to read logs fluently — which is the prerequisite for every role above it. Plan to be good at it, not to skip it. (Smaller orgs and MSSPs often collapse the tiers; the workflow below applies either way.)

---

## 2) Alert Triage Workflow

Five steps for every alert, in order. Do not skip to disposition.

1. **Receive.** Read the entire alert: which rule fired, on what raw event(s), on which host/account, when. Note the detection logic — you are about to test whether it fired correctly.
2. **Validate.** Go to the raw logs, not the alert summary. Does the underlying activity actually match what the rule claims? Rule out the routine benign causes first: authorized vuln scanner, admin/service-account activity, scheduled job, known pentest window, software deployment.
3. **Scope.** One host or many? One account or many? First occurrence or has this fired before (check alert history)? What happened on that host/account in the surrounding ±1 hour?
4. **Severity.** Asset criticality × confidence it's malicious × potential impact. Use the severity matrix in Incident-Response-Playbook.md — same scale, same escalation targets.
5. **Disposition.** Escalate with a complete ticket (Section 5) or close with a written, evidence-backed reason. "Looks fine" is not a reason.

### Disposition Decision Table

| What validation showed | Disposition | Also do |
|---|---|---|
| Confirmed malicious, activity ongoing | Escalate immediately (SEV-1/2), start IR playbook | Preserve volatile evidence; do not tip off the attacker |
| Confirmed malicious, blocked by control (AV/EDR/firewall) | Ticket + escalate per severity | Verify the block actually held; search for repeat attempts and follow-on activity |
| Suspicious, cannot confirm either way | Escalate to Tier 2 with everything collected | State explicitly what you checked and what remains unknown |
| True positive but benign (admin, scanner, sanctioned tool) | Close as benign | Flag as tuning candidate — recurring benign alerts are how queues drown |
| False positive (rule logic fired on wrong thing) | Close as FP | File a detection-tuning request with the evidence |
| Duplicate of an open alert/incident | Link/merge, close as duplicate | Add any new IOCs to the parent |

**Two rules that keep you out of trouble:** every close gets a written reason and the evidence that supports it; and if you are still unsure after ~15–20 minutes of looking, escalate. Escalating a benign alert costs minutes. Closing a real one costs weeks.

---

## 3) The Big 5 Alert Types

The five alerts that fill most Tier 1 queues, with concrete investigation steps. Event IDs referenced are defined in Section 4.

### 3a. Brute Force / Password Spray

Two distinct patterns: **brute force** = many passwords against one account (high failure count, one target). **Password spray** = one or two common passwords against many accounts (low failures per account, many targets — designed to dodge lockout). Identify which you have; spray is usually the more deliberate attacker.

1. Pull the failed logons: Windows `4625`, Linux `auth.log` "Failed password". Count failures by **source IP**, **target account**, and **time window**.
2. Classify the pattern: one account hammered → brute force; many accounts with 1–3 failures each from one source → spray. Note the logon type on Windows (`3` = network/SMB, `10` = RDP — tells you the protocol being attacked).
3. Check for lockouts (`4740`). Lockouts confirm real password attempts and tell you the policy is working (or that a spray is staying under the threshold).
4. **The step that matters:** search for a *successful* logon (`4624` / auth.log "Accepted") from the same source IP, or for any of the targeted accounts, during and after the failure window. A success after failures converts this from "attempted" to "account compromise".
5. Source context: external IP → check reputation, is it a known scanner/botnet? Internal IP → potentially a compromised host doing lateral movement; pivot to what else that host is doing.
6. **If a success was found:** escalate as account compromise — kill sessions, disable/reset the account, then run the checks in 3d (MFA, session tokens, what the session did).
7. **If no success:** block the source at the boundary where feasible, verify lockout/MFA policy held, close or ticket per volume, and note the IP for recurrence.

### 3b. Phishing Report

A user reported a suspicious email. First: this is your best detection source — respond in a way that keeps users reporting.

1. Obtain the **original email as an attachment** (.eml/.msg), not forwarded inline — forwarding strips the headers you need.
2. **Header analysis:** compare `From` vs `Return-Path` vs `Reply-To` (mismatches are the classic tell); read `Authentication-Results` for SPF/DKIM/DMARC pass/fail; walk the `Received` chain bottom-up to find the true originating IP; check the sending domain's age and registrar if unfamiliar.
3. **URL triage:** extract every URL, defang for the ticket (`hxxps://…`, `example[.]com`). Check reputation (VirusTotal, urlscan.io). If detonation is needed, do it in a **sandbox or throwaway VM only** — never your analyst workstation, never while signed in to anything.
4. **Attachment triage:** hash it first (`Get-FileHash`) and look the hash up before ever opening it. Detonate in a sandbox (Any.Run, Joe Sandbox, or internal) and record dropped files, network callouts, and hashes.
5. **Scope — who else:** search the mail gateway for the same sender, subject, URL, or attachment hash. Then the harder questions: who *clicked* (proxy/DNS logs for the URL) and who *entered credentials* (POSTs to the phishing domain, or ask the users directly).
6. **Respond:** purge the message from all mailboxes, block sender/domain/URL at gateway and proxy, and for anyone who entered credentials — password reset **plus session/token revocation** (a reset alone leaves active sessions alive). Thank the reporter.

### 3c. Malware / EDR Alert

1. Read the detection carefully: what was detected (signature name, behavior), and **what action the EDR took**. "Quarantined/blocked" and "detected only" are different alerts — detected-only means the code ran; treat with urgency.
2. **Process tree:** walk parent → child. Office app or browser spawning `powershell.exe`, `cmd.exe`, `wscript.exe`, `mshta.exe` is the classic maldoc chain. Read full command lines; flag encoded PowerShell (`-enc`, `-w hidden`, download cradles).
3. **Hash lookup:** check the file hash against VirusTotal/EDR intel. Detections confirm malice; a *clean* lookup proves nothing — new and targeted samples start at zero detections.
4. **Network connections** from the process (Sysmon `3`, EDR telemetry): destinations, ports, timing. Beacon-like regular intervals to a low-reputation IP/domain suggests C2. Check whether **other hosts** talk to the same destinations — that is your lateral scope in one query.
5. **Persistence check:** did the process create run keys, scheduled tasks (`4698`), or services (`7045`)? See Windows-Security-Cheat-Sheet.md Section 3 for the full list of places to look.
6. **Isolate decision:**

| Situation | Isolate host? |
|---|---|
| Active C2 traffic, or credential-theft tooling (Mimikatz-class), or ransomware precursors (vssadmin delete shadows, mass renames) | Yes, immediately — EDR network isolation preserves memory while cutting the attacker off |
| Detected-only (payload executed, not blocked) and scope unclear | Yes — assume follow-on activity until disproven |
| Commodity malware fully blocked on delivery, no execution, no follow-on activity in surrounding logs | Isolation optional — still ticket, verify the block, and watch the host |

7. Escalate with: process tree, command lines, hashes, network IOCs, timeline. That package is what lets Tier 2 move fast.

### 3d. Impossible Travel / Suspicious Login

Login from a location/device inconsistent with the user's pattern, or two logins geographically impossible within the time gap.

1. Pull **both** logins: timestamps, source IPs, geolocation, device/user-agent, application, protocol.
2. **VPN check first** — it is the most common benign cause. Corporate VPN egress points and users' personal VPNs both produce "impossible" geos. Check the IP's owner: residential ISP, corporate range, or **datacenter/cloud ASN**? A datacenter IP for an interactive user login is itself suspicious even if the geo is plausible.
3. **MFA status:** did both logins satisfy MFA, and by what method? Look for MFA-fatigue patterns (a burst of denied pushes followed by an approval) and for **legacy protocol authentication** (IMAP/POP/SMTP basic auth) which bypasses MFA entirely.
4. **Contact the user out-of-band** — phone or in person, not the possibly-compromised mailbox. "Are you traveling / using a VPN / did you approve an MFA prompt at 03:12 UTC?"
5. **Check what the session did** — this is where account compromise proves itself: new inbox rules (forward/delete rules are the BEC signature), mail forwarding changes, OAuth app consents, password or MFA-method changes, unusual file access.
6. **If not explained benign:** revoke all sessions and refresh tokens, reset the password, remove attacker-added MFA methods and re-register, delete malicious inbox rules, then escalate to scope what the session touched. Order matters — revoke sessions *with* the reset, or the attacker rides the old token through your reset.

### 3e. Data Exfiltration Suspicion

Alert on unusual egress volume, a DLP hit, or traffic to a suspicious destination.

1. **Quantify:** bytes out, over what window, from which host/account — compared against **that host's own baseline** (e.g., 30 days). 4 GB out means nothing from a backup server and everything from a receptionist's laptop; deviation beats absolute volume.
2. **Destination:** reputation and category — personal cloud storage, file-sharing sites, paste sites, an unknown VPS, a newly registered domain? Check the ASN and whether anyone else in the org has ever talked to it.
3. **Channel:** HTTPS upload (proxy logs show bytes-out per domain), DNS tunneling (Sysmon `22` / DNS logs — very high query volume, long random subdomains), SSH/SFTP to external hosts, or oversized email attachments.
4. **DLP hits:** what classification triggered (PII, source code, financials), and do multiple DLP events correlate to the same user/host in the window?
5. **Context:** which process generated the traffic; which user — a departing employee, a service account that should never touch the internet, an account from 3d that just had a suspicious login?
6. **Rule out benign:** sanctioned backup jobs, cloud sync clients (OneDrive/Drive), OS and software update CDNs, video conferencing.
7. **If unexplained, escalate fast** — exfiltration is usually the *last* stage of an intrusion, meaning everything before it was missed. Preserve netflow/pcap and proxy logs now (retention is finite), and raise egress blocking of the destination with the incident owner.

---

## 4) Key Log Sources

What to pull, from where, to answer which question. Deeper background in [[Security-Logging-and-Detection]].

### Windows Security Event IDs that matter

| Event ID | Meaning | Why you care |
|---|---|---|
| **4624** | Successful logon | The core of every auth investigation. Read the **logon type**: `2` interactive (console), `3` network (SMB/shares — lateral movement lives here), `10` RemoteInteractive (RDP). Also captures source IP and account. |
| **4625** | Failed logon | Brute force / spray raw material. Failure sub-status distinguishes bad password from unknown account from disabled account. |
| **4688** | Process creation | What ran, launched by whom and by what parent. Enable command-line capture (see Windows cheat sheet §5) or it is half-blind. |
| **4720** | User account created | Attacker-created accounts are cheap persistence. Every 4720 should map to a ticket/HR event. |
| **4672** | Special privileges assigned at logon | Admin-equivalent logon. A 4624 + 4672 pair from an odd source = privileged access from an odd source. |
| **1102** | Security log cleared | Almost never legitimate. Treat as a red flag on its own; the clearing action itself is logged even though history is gone. |
| 4740 | Account locked out | Confirms sustained password attempts (see 3a). |
| 4698 | Scheduled task created | Common persistence artifact (see 3c). |

### Sysmon (richer endpoint telemetry, free)

| Sysmon ID | Event | Answers |
|---|---|---|
| **1** | Process creation | Full command line, hashes, parent process — 4688 with the blanks filled in |
| **3** | Network connection | Which *process* made which connection — the C2 question |
| **11** | File created | Payload drops, staging directories |
| **22** | DNS query | Which process resolved which domain — beaconing and DNS tunneling |

(Also useful once comfortable: `12/13` registry modification for run-key persistence, `8` CreateRemoteThread for injection.)

### Linux and network sources

| Source | Location / tool | Answers |
|---|---|---|
| Auth logs | `/var/log/auth.log` (Debian) / `/var/log/secure` (RHEL) | SSH logins, failures, sudo usage — Linux 4624/4625 equivalent |
| auditd | `ausearch`, `aureport` | Syscall-level: file access, exec, privilege use — Linux 4688 equivalent (only if audit rules are configured; not on by default) |
| Proxy | SIEM / proxy console | Who visited which URL, bytes in/out — phishing clicks and HTTPS exfil |
| DNS | Resolver logs / Sysmon 22 | Domains resolved before any connection — earliest C2 indicator, tunneling |
| Firewall / netflow | Boundary devices | Connection metadata for hosts without an agent; egress volume; blocked-attempt patterns |
| EDR | Vendor console | Process trees, cross-host IOC search, isolation — Tier 1's primary tool where deployed |

---

## 5) Writing a Good Ticket

The ticket is the product of your triage. Tier 2 should be able to continue the investigation from it without asking you anything.

| Field | Content |
|---|---|
| Title | `[Severity] [Alert type] — [account/host] — [one-line finding]` |
| Severity + disposition | From the decision table; escalated vs closed-with-reason |
| Source | Rule/detection name, alert ID, what telemetry it fired on |
| Affected assets | Hostname(s), IP(s), account(s) — full names, no "the user" |
| Timeline | First and last observed activity, in **UTC**, stated as UTC |
| Summary of findings | Facts first, in time order. Interpretation labeled as such ("consistent with password spray") |
| Evidence | The actual queries you ran and key raw log lines pasted in — so anyone can re-run and verify |
| IOCs | IPs, domains, hashes, filenames — **defanged** (`hxxp://`, `203.0.113[.]45`) |
| Actions taken | What you already did (blocked, reset, isolated) with timestamps |
| Recommended next steps | Specific: "revoke sessions for jdoe", "check hosts X,Y for hash Z" |

### Example

```
Title:     [SEV-1] Password spray with successful logon — svc-backup / DC01
Status:    Escalated — IR lead paged (2026-08-02 09:41 UTC)
Source:    SIEM rule "AUTH-014: >20 accounts with 4625 from single source, 1h"

Assets:    DC01 (10.10.1.5); 37 targeted accounts; source 203.0.113[.]45 (external, hosting ASN)

Timeline (UTC):
  08:02–08:19  4625 x74 from 203.0.113[.]45, logon type 3; 37 accounts, 1–3 failures each
  08:21        4624 logon type 3, account svc-backup, source 203.0.113[.]45
  08:21        4672 special privileges — svc-backup, same logon session

Findings:  Pattern is a password spray (many accounts, low failure count each).
           One SUCCESS: svc-backup at 08:21 from the spray source, followed by a
           privileged-logon event. Treating as confirmed account compromise.

Evidence:  Query: index=wineventlog EventCode=4625 src_ip=203.0.113.45 | stats count by user
           Raw 4624/4672 events for svc-backup attached to ticket.

IOCs:      203.0.113[.]45

Actions:   09:35 svc-backup disabled, active sessions killed. Source IP blocked at edge FW.
Next:      Scope svc-backup activity 08:21–09:35 (4688/Sysmon 1 on DC01, network conns);
           check other DCs for logons from the IOC; determine why svc-backup lacked lockout.
```

---

## 6) Metrics Reality

| Metric | Definition | Reality check |
|---|---|---|
| MTTD | Mean time to detect — compromise start → detection | Industry dwell times are days-to-weeks; SIEM alerts only measure what you have detections *for* |
| MTTA | Mean time to acknowledge — alert fired → analyst picks it up | The queue-depth metric; the one shift leads watch |
| MTTR | Mean time to respond/resolve — detection → contained/closed | Easy to game by closing fast; gamed MTTR is how real incidents get closed as FPs |
| FP rate | % alerts closed as false positive | High FP rate on a rule is a tuning request, not a personal burden to absorb silently |

**Alert fatigue is the actual threat.** After the 200th benign alert of the same type, humans stop looking at the raw logs and start pattern-matching the summary — and that is the exact moment the real one slips through (normalization of deviance). What a Tier 1 analyst can do about it:

- Feed the tuning loop: every benign-close of a recurring pattern should reference a tuning request. Killing one noisy rule buys more security than triaging it 50 more times.
- Document benign explanations in a shared runbook (scanner IPs, admin jobs, service accounts) so validation takes one lookup instead of ten minutes.
- Never close on volume pressure without the raw-log check. If the queue is unworkable, that is a staffing/tuning problem to raise — quietly absorbing it produces silent misses, which are worse than a backlog.

---

## Related

- [[Incident-Response-Lifecycle]] — the PICERL model behind escalations
- [[Security-Logging-and-Detection]] — how the telemetry in Section 4 gets collected and turned into detections
- Incident-Response-Playbook.md — what Tier 2+ runs when your escalation is confirmed; severity matrix and evidence-handling rules live there
- Windows-Security-Cheat-Sheet.md / Linux-Security-Cheat-Sheet.md — the hands-on commands behind every investigation step above
