# Incident Response Playbook

> Defensive playbook based on the PICERL lifecycle (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned). Use this to respond to incidents on systems **you own or are authorized to defend**. Fill in the blanks per incident; keep a copy of the completed playbook as the incident record.

---

## Severity Matrix

Classify the incident first — severity drives who gets paged and how fast.

| Severity | Definition | Examples | Response Target | Escalation |
|---|---|---|---|---|
| **SEV-1 Critical** | Active compromise of production, data exfiltration confirmed, or safety impact | Ransomware executing, attacker with admin access, customer data leaving the network | Immediate, all-hands | IR lead + management + legal within 15 min |
| **SEV-2 High** | Confirmed compromise, contained scope, no confirmed exfiltration | Single host with malware, compromised non-admin account, defaced site | < 1 hour | IR lead + system owner |
| **SEV-3 Medium** | Suspicious activity, likely policy violation, no confirmed compromise | Repeated brute-force from one IP, malware blocked by AV, phishing clicked but no creds entered | < 4 hours (business hours) | On-call analyst |
| **SEV-4 Low** | Failed/blocked attempt, informational | Scan detected and dropped, single phishing email reported | Next business day | Ticket queue |

**Re-assess severity at every phase transition** — incidents grow and shrink.

---

## 1) Preparation (before any incident)

Things that must exist *before* the pager goes off.

### Checklist

- [ ] **Asset inventory** — hostnames, IPs, owners, criticality, data classification per system
- [ ] **Logging baseline** — auth logs, network flow logs, DNS logs, endpoint telemetry centralized and retained ≥ 90 days
- [ ] **Alerting** — alerts route to a monitored channel with an on-call rotation
- [ ] **Contact & escalation matrix** — filled in below, tested quarterly
- [ ] **Jump bag** — clean laptop, disk imaging tools, write blockers, spare drives, incident forms (printed), out-of-band comms (phone numbers, not just Slack)
- [ ] **Backups** — tested restores, at least one copy offline/immutable
- [ ] **Access** — IR team has break-glass credentials stored in a sealed/vaulted process
- [ ] **Tabletop exercises** — run at least one scenario per semester/quarter

### Contact & Escalation Matrix

| Role | Name | Primary Contact | Backup Contact | When to Engage |
|---|---|---|---|---|
| IR Lead | | | | All SEV-1/SEV-2 |
| System Owner | | | | Any incident on their system |
| Management | | | | SEV-1, or SEV-2 > 4h |
| Legal / Compliance | | | | Any personal-data or regulatory impact |
| Communications / PR | | | | Any external-facing impact |
| ISP / Cloud Provider | | | | DDoS, abuse reports, cloud account compromise |

---

## 2) Identification

Goal: confirm whether an incident is real, scope it, and classify severity. **Do not change anything on the suspect system yet.**

### Triage Checklist (first 15 minutes)

- [ ] Record current time (UTC) and start the evidence log below
- [ ] What triggered this? (alert / user report / third-party notification / hunt finding)
- [ ] Which systems are suspected affected? (hostnames, IPs)
- [ ] What data lives on those systems? (classification)
- [ ] Is the activity **ongoing right now**?
- [ ] Any obviously destructive behavior (encryption, deletion, defacement)?
- [ ] Assign severity from the matrix above
- [ ] Open a dedicated comms channel; name an incident commander
- [ ] Start a timeline document — every action gets a timestamp

### Identification Questions

- **Trigger source:**
- **First observed timestamp (UTC):**
- **Affected systems:**
- **Affected accounts:**
- **Suspected attack vector:**
- **Suspected impact (confidentiality / integrity / availability):**
- **Indicators of compromise (IPs, hashes, domains, filenames):**

### Useful Triage Commands (Linux, run as authorized defender)

```bash
w                          # who is logged in right now, from where
last -aiF | head -20       # recent login history with source IPs
ss -tupn                   # live network connections and owning processes
ps auxf                    # process tree — look for odd parents/children
sudo journalctl -u sshd --since "-24h"   # recent SSH activity
sudo lsof -nPi             # open network files per process
```

### Evidence Preservation — Order of Volatility

Capture in this order (most volatile first). If you must choose between capturing evidence and stopping active damage, **stopping damage wins** — note what you lost.

| Order | Evidence | Lifetime | How to Capture |
|---|---|---|---|
| 1 | CPU registers, cache | Nanoseconds | Practically not captured — skip |
| 2 | RAM (processes, keys, network state) | Until power-off | Memory image (LiME/AVML on Linux, WinPmem on Windows) **before** any reboot |
| 3 | Network state (connections, ARP, routing) | Seconds–minutes | `ss -tupn`, `ip neigh`, `ip route`, netflow/pcap start |
| 4 | Running process list, loaded modules | Until reboot | `ps auxf`, `lsmod`, `/proc/<pid>/` copies |
| 5 | Temporary files, swap | Hours–days | Copy `/tmp`, `/var/tmp`, note swap device |
| 6 | Disk contents | Until overwritten | Full disk image (dd/dc3dd to external drive, hash it) |
| 7 | Remote/centralized logs | Retention policy | Export from SIEM/log server — these survive host wipes |
| 8 | Physical config, network topology | Stable | Photos, diagrams, config exports |

**Evidence handling rules:**

- Hash every image/file collected (`sha256sum`) and record the hash in the evidence log.
- Work on **copies**, never originals.
- Maintain chain of custody: who collected, when, where stored, who accessed.
- Prefer pulling the network cable / isolating the VLAN over powering off — power-off destroys RAM evidence.

---

## 3) Containment

Goal: stop the bleeding without destroying evidence or tipping off the attacker prematurely.

### Containment Decisions Table

| Situation | Recommended Action | Avoid | Why |
|---|---|---|---|
| Active ransomware encrypting files | Isolate host from network immediately (pull cable / disable port / security group deny-all) | Powering off mid-capture if RAM image not yet taken — but if encryption is spreading, isolate first, image second | Every minute costs files; isolation stops spread while preserving RAM |
| Compromised user account, attacker active | Disable account, kill active sessions, rotate credentials | Just changing the password (existing sessions/tokens survive) | Tokens and sessions outlive password changes |
| Compromised server, attacker dormant | Network-isolate but keep powered on; capture memory | Rebooting or "cleaning" in place | Reboot destroys volatile evidence; cleaning misses persistence |
| Data exfiltration in progress | Block destination IPs/domains at egress firewall; isolate source host | Blocking only the one IP you saw (attackers rotate) | Egress control at the boundary catches rotation |
| Malicious insider suspected | Quietly restrict access; involve HR/legal **before** confronting | Alerting the individual | Legal/HR process protects the investigation and the org |
| Web app being actively exploited | Put app in maintenance mode or WAF-block the attack pattern | Taking the whole business offline if one endpoint can be blocked | Proportional response preserves availability |
| Widespread worm/lateral movement | Segment networks, disable affected VLANs, block SMB/WinRM/SSH between segments | Whack-a-mole on individual hosts | Contain the medium of spread, not just hosts |

### Short-term vs Long-term Containment

- **Short-term (minutes–hours):** network isolation, account disable, firewall block, session kill. Objective: stop spread/damage now.
- **Long-term (days):** rebuilt clean systems in parallel, temporary hardened configs, enhanced monitoring on adjacent systems while eradication proceeds.

### Communication Controls

- [ ] Move incident comms to an out-of-band channel if internal systems may be compromised (attacker may read email/chat)
- [ ] Single spokesperson; nobody else communicates externally
- [ ] "Need to know" list maintained by incident commander

### Internal Comms Template (status update)

```
INCIDENT UPDATE — [Incident ID] — [SEV-x] — [UTC timestamp]

Status:        [Investigating / Contained / Eradicating / Recovering / Closed]
Summary:       [2–3 sentences, plain language, no speculation]
Impact:        [Systems/services/users affected; data impact if known]
Actions taken: [Bulleted, factual]
Next steps:    [What happens next, by whom]
Next update:   [Time of next update — commit to a cadence, e.g. every 2h for SEV-1]
Contact:       [Incident commander name + channel]

Do not forward outside the need-to-know list. Direct all external
questions to [Communications contact].
```

---

## 4) Eradication

Goal: remove the attacker's access and artifacts completely. Partial eradication = re-compromise.

### Checklist

- [ ] Identify **root cause** (initial access vector) — eradication without this is guessing
- [ ] Remove malicious artifacts: binaries, webshells, scheduled tasks, cron jobs, systemd units, SSH keys added to `authorized_keys`, new accounts
- [ ] Check **all** persistence mechanisms (see Linux cheat sheet: cron, systemd, shell profiles, ld.so.preload)
- [ ] Patch the exploited vulnerability on affected **and similar** systems
- [ ] Rotate every credential the attacker could have touched: passwords, API keys, tokens, certificates, service accounts — assume anything on a compromised host is burned
- [ ] Invalidate active sessions/tokens org-wide if identity provider was touched
- [ ] Scan adjacent systems for the same IOCs (lateral movement check)
- [ ] **Prefer rebuild from known-good over cleaning in place** for any host with root-level compromise

### Eradication Verification

- [ ] Re-scan rebuilt/cleaned systems with updated signatures/IOCs
- [ ] Confirm no outbound connections to attacker infrastructure (monitor egress for 72h minimum)
- [ ] Confirm patched version numbers on all affected software

---

## 5) Recovery

Goal: return to normal operations with confidence, incrementally.

### Checklist

- [ ] Restore from **known-good** backups (verify backup predates compromise; verify backup integrity/hash)
- [ ] Rebuild hosts from trusted images, not from the compromised disk
- [ ] Re-enable services **incrementally**, most critical + least risky first
- [ ] Heightened monitoring on recovered systems (lowered alert thresholds, extra logging) for 2–4 weeks
- [ ] Define and watch **re-compromise indicators**: reappearance of IOCs, logins from attacker geos, recreation of removed accounts/files
- [ ] Business sign-off: system owner formally accepts the system back
- [ ] Communicate restoration status via the comms template

### Recovery Decision Log

| System | Restored From | Verified By | Monitoring Level | Back in Production (UTC) |
|---|---|---|---|---|
| | | | | |

---

## 6) Lessons Learned

Hold the review within **2 weeks** of closure, blameless, with everyone involved.

### Post-Incident Review

- **Root cause:**
- **Full timeline (detection gap = first compromise → first detection):**
- **Dwell time:**
- **What worked:**
- **What failed / was missed:**
- **Missed controls (what would have prevented or caught this earlier):**
- **Detection improvements (new alerts/log sources to add):**
- **Permanent preventive actions (with owners and due dates):**

| Action Item | Owner | Due Date | Status |
|---|---|---|---|
| | | | |

- [ ] Update this playbook with anything the incident taught you
- [ ] Add new IOCs/detections to monitoring
- [ ] Share sanitized summary with the wider team (security awareness)

---

## Evidence Log

Every action, every artifact — timestamped in UTC, in order.

| Timestamp (UTC) | Action / Artifact Collected | Owner | Evidence Path / Location | SHA-256 (if file) |
|---|---|---|---|---|
| | | | | |

## Incident Timeline

| Timestamp (UTC) | Event | Source of Evidence |
|---|---|---|
| | | |
