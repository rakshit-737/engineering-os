---
title: "Home Lab Setup Guide"
description: "Build an isolated home security lab: hypervisor, VMs, networking, logging, SIEM."
domain: cybersecurity
category: labs
type: guide
difficulty: beginner
status: evergreen
tags: [cybersecurity, labs, home-lab]
prerequisites: []
related: [CTF-Getting-Started-Guide]
order: 40
---

# Home Lab Setup Guide

Hub: [[Security-Engineering-OS]]

> **Scope statement — read once, applies to every command in this file.** Everything here runs on virtual machines you built, on hardware you own, on a virtual network that cannot reach the internet or your campus/hostel LAN. Every scan, capture, and log query below is aimed at *your own lab VMs*. Never point any tool in this guide at a system you do not own or do not have **written** authorization to test. For practice against systems you don't own, use platforms that grant that authorization explicitly: TryHackMe, Hack The Box, picoCTF (see `CTF-Getting-Started-Guide.md`).

**Goal of this lab:** build the defender's loop — *generate an event on a system you control, then find that event in logs.* Attack tooling appears only as the event generator. The skill being trained is detection.

---

## 1) Rules of Engagement

Read this before you install anything. Every rule here has cost someone their internship.

| Rule | Why | What it looks like in practice |
|---|---|---|
| Lab traffic never leaves the lab | A scan that escapes onto a campus/ISP network is unauthorized access, regardless of intent | Target VMs use **Internal Network / LAN Segment** only — no bridged, no NAT, no port forwarding |
| Never scan, probe, or brute-force anything you don't own | Unauthorized access to a computer resource is an offence under India's **IT Act, 2000 (ss. 43, 66)**; this is not legal advice, but "I was learning" is not a defence | Targets are your VMs, or an in-scope box on THM/HTB/picoCTF |
| Your hostel/campus/ISP network is not your lab | Institutional AUPs treat port scanning as misconduct; ISP terms treat it as abuse. Consequences arrive before any legal question does | Never bridge a lab VM to Wi-Fi. Never run nmap against the campus subnet "to see what's there" |
| Deliberately vulnerable VMs are not patchable | Metasploitable 2 is Ubuntu 8.04 with intentional holes. Exposed to any real network it is compromised within minutes and becomes *your* liability | Metasploitable/DVWA get **zero** internet-facing interfaces, ever |
| Snapshot before you break, restore after | Anything you detonate has changed state you can't fully see | `pre-exercise` snapshot is mandatory, not optional |
| Written authorization or nothing | Verbal "yeah go ahead" from a friend whose server it is does not survive an incident review | Scope, dates, and signature in email at minimum |
| Don't run real malware yet | v1/v2 isolation is good enough for scans and log generation, not for live samples. VM escapes and network-aware samples are real | Malware detonation needs a dedicated air-gapped box; that's a later project |

**The one-line test before any command:** *Do I own this IP, or do I have written permission for it?* If the answer takes more than two seconds, stop.

---

## 2) Hardware Reality Check

Check these before choosing a lab tier.

| Requirement | Minimum | Comfortable | How to verify (Windows host) |
|---|---|---|---|
| RAM | 8 GB | 16 GB | Task Manager → Performance → Memory |
| Free disk | 120 GB | 250 GB+ SSD | VMs grow; snapshots grow faster |
| CPU | 4 physical cores | 6–8 cores | Task Manager → Performance → CPU → "Cores" |
| Hardware virtualization | Required | Required | Task Manager → Performance → CPU → "Virtualization: Enabled" |
| Disk type | SSD strongly preferred | NVMe SSD | An HDD makes 3 concurrent VMs unusable, not just slow |

If virtualization shows **Disabled**, enable **Intel VT-x** / **AMD-V (SVM Mode)** in BIOS/UEFI. On most laptops it is under Advanced or Security. Without it, 64-bit guests either refuse to boot or run at emulation speed.

### RAM budget — plan before you build

Never allocate more than roughly 75% of physical RAM across *simultaneously running* VMs. The host needs the rest; once the host swaps, everything crawls.

| VM | Allocate (min) | Allocate (comfortable) | Notes |
|---|---|---|---|
| Host OS + browser | 3–4 GB reserved | 5 GB reserved | Not negotiable — leave it free |
| Kali / ParrotOS analyst | 2 GB | 4 GB | XFCE/MATE; avoid GNOME builds on 8 GB |
| Metasploitable 2 | 512 MB | 1 GB | Ubuntu 8.04, extremely light |
| DVWA (Ubuntu Server + Docker) | 1 GB | 2 GB | Server, no desktop |
| Windows Server (Core, no GUI) | 2 GB | 2 GB | Best Windows-log source per GB |
| Windows Server / 11 (Desktop GUI) | 4 GB | 4–6 GB | Painful under 4 GB |
| pfSense | 1 GB | 2 GB | 2 GB if running Suricata |
| Wazuh all-in-one | 4 GB | 8 GB | OpenSearch is JVM-heavy; the hard cost of v2 |
| Security Onion (standalone) | 16 GB **dedicated to the VM** | 24 GB+ | Not viable on a single 16 GB laptop |

**8 GB rule:** two VMs at a time, maximum. Analyst + one target. Use Windows Server **Core** (no desktop) for Windows telemetry and shut down anything you're not actively using.

**16 GB rule:** three to four VMs. A realistic v2 set is Wazuh (4 GB) + Windows Server Core with Sysmon (2 GB) + Kali (3 GB) + host (5 GB), with pfSense swapped in only when you need network-layer exercises.

**CPU allocation:** assign at most half your physical cores to any one VM, and keep total assigned vCPUs at or below physical core count. Over-allocating vCPUs makes VMs slower, not faster.

**Disk:** use dynamically allocated / thin-provisioned disks. Give Windows guests 60 GB (it will use ~25 GB), Linux servers 20 GB, Metasploitable 8 GB. Snapshots store deltas — a heavily snapshotted Windows VM can double in size.

---

## 3) Virtualization Choice

### The options

| Option | Cost | Best for | Real caveats |
|---|---|---|---|
| **VirtualBox** | Free (open-source GPL base package) | Default choice; best cross-platform, huge tutorial coverage, prebuilt Kali/Metasploitable images | The **Extension Pack** is under Oracle's PUEL: free for personal/educational/evaluation use, paid for commercial. You don't need it for this lab. Snapshot performance is weaker than VMware's |
| **VMware Workstation Pro** | Free for personal use (Broadcom, since Nov 2024) | Better performance, better snapshot handling, LAN Segments are cleaner isolation than VBox internal networks | Commercial use still requires a paid licence. Account/download flow through Broadcom is clunky |
| **Hyper-V** | Included in Windows Pro/Enterprise | Windows-native, good for Windows-only labs | Not in Windows Home. Weaker guest networking ergonomics for lab isolation; fewer prebuilt security images |
| **WSL2** | Free | Linux **tooling**, not lab isolation | See below — this is the most misunderstood piece |

**Recommendation:** VMware Workstation Pro if you can complete the Broadcom download; otherwise VirtualBox. Both are correct choices — pick one and stop researching. The lab design below works identically on either.

### What WSL2 is and is not

WSL2 is a real Linux kernel in a lightweight Hyper-V VM. It is excellent for the analyst's *toolchain* and wrong for the lab's *targets*.

| Use WSL2 for | Do NOT use WSL2 for |
|---|---|
| Learning Linux CLI, bash, grep/awk, systemd-free tooling | Any vulnerable target VM |
| Running nmap, tcpdump, jq, python analysis against **lab** IPs | Anything you need network isolation for |
| Parsing pcaps and log files pulled off lab VMs | Malware, or anything you might detonate |
| Git, dev tooling, scripting your detections | Pretending it's a sandbox — it shares your host's network path and filesystem access to `/mnt/c` |

WSL2 has no meaningful isolation boundary from your host: it reaches the internet through the host by default and can read your entire C: drive. Treat it as "a Linux shell on my laptop", never as a lab segment.

### The Hyper-V coexistence trap

If WSL2, Docker Desktop, Windows Sandbox, Virtual Machine Platform, or Memory Integrity / Core Isolation (VBS) is enabled, Windows owns the hypervisor. VirtualBox and VMware then run *on top of* the Windows Hypervisor Platform instead of directly on the CPU, and guest performance drops noticeably.

| Symptom | Cause | Fix |
|---|---|---|
| VMs boot but run 2–5x slower; VirtualBox shows a turtle/slow icon | Hyper-V/VBS is active | Pick a side (below) |
| "VT-x is not available" / guest won't start 64-bit | Hyper-V holds VT-x, or VT-x off in BIOS | Enable VT-x in BIOS; disable Hyper-V stack |
| Blue screen or hang on VM start after a Windows update | VBS re-enabled by update | Re-check Core Isolation setting |

Pick a side per work session:

```powershell
# Check what is holding the hypervisor (run as Administrator)
systeminfo | Select-String "Hyper-V"
bcdedit /enum | Select-String "hypervisorlaunchtype"
Get-ComputerInfo -Property "HyperVRequirementVirtualizationFirmwareEnabled","DeviceGuardSecurityServicesRunning"

# Lab mode: give VT-x back to VirtualBox/VMware (reboot required)
bcdedit /set hypervisorlaunchtype off

# Dev mode: restore Hyper-V for WSL2 / Docker Desktop (reboot required)
bcdedit /set hypervisorlaunchtype auto
```

Also disable **Core Isolation → Memory Integrity** (Windows Security → Device Security) while in lab mode if performance is still poor. Turn it back on when you're done — it is a genuine host protection, and running your daily machine with it off permanently is a bad trade.

---

## 4) Lab v1 — Core Build (Red Events, Basic Detection)

Three VMs. This is a weekend build. Do not skip to v2 before v1 works end to end.

| VM | Image | Role | Default creds |
|---|---|---|---|
| **Analyst** | Kali Linux (prebuilt VM image) or Parrot OS Security | Where you run tools and analyse output | `kali/kali` — change it |
| **Target-Linux** | Metasploitable 2, plus DVWA (or DVWA in Docker on Ubuntu Server) | Authorized target that generates findings | `msfadmin/msfadmin`; DVWA `admin/password` |
| **Target-Windows** | Windows Server 2022/2025 Eval, or Windows 11 Enterprise Eval | Windows telemetry source (Security log + Sysmon) | You set them at install |

### Choosing the analyst VM

| | Kali Linux | Parrot OS Security |
|---|---|---|
| RAM appetite | Higher (~2 GB idle with XFCE) | Lower (~1.5 GB with MATE) |
| Tooling | Largest preinstalled set; every tutorial assumes it | Comparable, plus more privacy tooling |
| Docs / community answers | Most abundant | Good, smaller |
| Best when | You have 16 GB and want tutorials to match exactly | You're on 8 GB and need the headroom |

Either is fine. Download the **prebuilt VirtualBox/VMware image** rather than installing from ISO — it saves an hour and ships with guest additions/tools configured.

**First thing after boot, on the analyst VM:**

```bash
passwd                      # change the default kali/kali password immediately
sudo apt update && sudo apt full-upgrade -y    # do this with NAT on, then disconnect NAT
```

### Windows evaluation images — the honest version

Microsoft's Evaluation Center provides free, legitimate, time-limited images. Terms differ by product, so know which clock you're on:

| Image | Evaluation period | Use it for |
|---|---|---|
| Windows Server 2022 / 2025 (Eval ISO) | **180 days** | Best choice — longest clock, full Security log, Sysmon, AD if you go further |
| Windows 11 Enterprise (Eval ISO) | 90 days | Endpoint-style telemetry, Defender behaviour. Prefer 11 — Windows 10 is past end of support, so a Win10 lab teaches you a platform nobody is defending any more |

Choose **Server, Core installation (no GUI)** when RAM-constrained: it runs in 2 GB, produces the same Security/Sysmon events, and you'll manage it from PowerShell — which is the skill you want anyway. Take a snapshot named `clean-build` immediately after install and Sysmon deployment; when the eval expires you rebuild rather than repair.

### Networking — the part that keeps you out of trouble

Understand the modes before you click anything.

| Mode (VirtualBox / VMware) | VM reaches internet | VM reaches your host | VM reaches your real LAN | Use for |
|---|---|---|---|---|
| **Internal Network** / **LAN Segment** | No | **No** | No | **All target VMs.** Strongest isolation |
| **Host-only** | No | Yes | No | Analyst VM management, SIEM dashboard access from host |
| **NAT** | Yes | Via port-forward only | **Yes, outbound** — traffic exits through the host onto your real network | Updates and tool installs — **temporary, analyst VM only** |
| **NAT Network** | Yes | Via port-forward | **Yes, outbound** (same as NAT) | Multiple VMs sharing NAT — avoid; every target gets outbound reach to your real network |
| **Bridged** | Yes | Yes | **Yes, in both directions** (VM gets its own LAN IP) | **Never.** This is how labs leak onto campus Wi-Fi |

**Do not mistake NAT for isolation.** NAT hides the VM from *inbound* connections; it does nothing to stop the VM reaching *out*. An nmap run from a NAT'd VM lands on your hostel subnet exactly as if you had run it from the host. That is why the analyst VM's NAT adapter gets disconnected — not minimised, disconnected — before any exercise.

**The design: dual-homed analyst, isolated targets.**

```
  [ Internet ]
       |
   (NAT adapter, adapter 1 — DISABLED during exercises)
       |
  +----------------+          Internal Network "lab-net"        +------------------+
  |  Analyst VM    |-----------------------------------------+--|  Metasploitable2 |
  |  Kali/Parrot   |  (adapter 2, static 10.10.10.10/24)      |  |  10.10.10.20     |
  +----------------+                                          |  +------------------+
       |                                                      |
   (Host-only adapter 3, 192.168.56.x — for SIEM UI later)    |  +------------------+
       |                                                      +--|  Windows Target  |
  [ Your laptop host ]                                           |  10.10.10.30     |
                                                                 +------------------+
```

- Targets get **exactly one** adapter, on the Internal Network. They have no route out, ever.
- The analyst VM's NAT adapter exists only for `apt update`. **Uncheck "Cable Connected" / "Connect at power on" before every exercise.**
- Internal Network has no DHCP by default — assign static IPs. Metasploitable 2 defaults to DHCP, so set it statically or add a DHCP server on the analyst VM.

Static IP on the analyst VM (Kali/Debian, adapter `eth1`):

```bash
sudo ip addr add 10.10.10.10/24 dev eth1     # lab-net address
sudo ip link set eth1 up
ip -br a                                      # verify: eth1 UP with 10.10.10.10/24
ip route                                      # verify: NO default route via eth1
```

Metasploitable 2 (login `msfadmin/msfadmin`):

```bash
sudo ifconfig eth0 10.10.10.20 netmask 255.255.255.0 up
# Ubuntu 8.04 — no netplan, no NetworkManager. This is NOT persistent:
# edit /etc/network/interfaces to survive a reboot.
```

**Verify isolation before every session. This takes 15 seconds and is the whole safety model:**

```bash
# On each TARGET VM — all three must fail
ping -c 2 8.8.8.8          # must fail: no internet
ping -c 2 <your_host_LAN_IP>   # must fail: cannot reach your real network
curl -m 5 http://example.com   # must fail/timeout

# On the ANALYST VM during an exercise
ip route | grep default    # should return NOTHING when NAT adapter is disconnected
ping -c 2 10.10.10.20      # must succeed: lab reachability intact
```

If any "must fail" check succeeds, power off the VM and fix the adapter before continuing.

**Additional hygiene for target VMs:** disable shared folders, shared clipboard, and drag-and-drop. Those are host-guest bridges and defeat the isolation you just built.

### Snapshot discipline

Snapshots are the reason a lab stays usable for a year instead of two weeks.

| Snapshot name pattern | When to take it | Keep? |
|---|---|---|
| `2026-08-02-clean-build` | Immediately after install, updates, tools, network config — **before** any exercise | Permanently. This is your golden image |
| `2026-08-02-sysmon-configured` | After baseline agent/logging config is verified working | Permanently |
| `pre-EX03-powershell-detect` | Immediately before each exercise | Delete after the exercise write-up is done |
| `broken-investigating` | When something breaks and you want to study it | Delete within a week |

Rules that matter:

- **Take the snapshot before the exercise, not after.** The point is a known-good state to return to.
- **Restore after every detonation exercise.** Do not accumulate state you can't account for; your detection results become meaningless if the box is dirty.
- **Keep chains under ~5 deep.** Long snapshot chains slow disk I/O badly and inflate disk usage. Collapse/delete old ones monthly.
- **Never snapshot a running VM you'll then run for weeks.** Take snapshots with the VM powered off where possible — cleaner, smaller, no saved-memory state.
- **Snapshots are not backups.** They live in the same file tree as the VM. Export a clean `.ova` of your golden Kali/Windows build to an external drive once.
- **Before every host OS update or VirtualBox/VMware upgrade**, snapshot everything. Hypervisor upgrades break guest additions regularly.

### v1 build checklist

- [ ] BIOS virtualization enabled; Hyper-V/VBS decision made
- [ ] Hypervisor installed; Internal Network `lab-net` created
- [ ] Analyst VM imported, password changed, updated via NAT, NAT then disconnected
- [ ] Metasploitable 2 imported, **single Internal Network adapter only**
- [ ] DVWA reachable from analyst VM browser (`http://10.10.10.20/dvwa/`), security level set to Low for learning
- [ ] Windows eval VM installed, static IP on lab-net, Defender left enabled (you want to see it react)
- [ ] Isolation verification block above run on **every** VM — all "must fail" tests fail
- [ ] `clean-build` snapshot on all three VMs
- [ ] One `.ova` export of the analyst VM stored off-laptop

---

## 5) Lab v2 — Blue Team Upgrades

Add these once v1 works. Each one turns "I ran a scan" into "I detected a scan".

### 5.1 SIEM: Wazuh vs Splunk Free

| | **Wazuh** (recommended) | **Splunk Free** |
|---|---|---|
| Cost | Free, open source, no volume cap | Free tier, **500 MB/day** index cap |
| Auth / users | Full RBAC | **No authentication, no user accounts** in free tier |
| Alerting | Yes, rules + MITRE ATT&CK mapping | **No alerting** in free tier — search only |
| Agent | Wazuh agent (Windows/Linux/macOS) | Universal Forwarder |
| Extras | File integrity monitoring, CIS benchmark scans (SCA), vulnerability detection | Best-in-class search language (SPL) |
| RAM cost | 4 GB min, 8 GB comfortable | 4 GB+ |
| Learn it because | It's a complete free SOC stack, and FIM/SCA teach real controls | **SPL appears in job descriptions**, and THM's SOC path uses Splunk |

**Do Wazuh first** — alerting is the thing you're learning, and Splunk Free can't alert. Add Splunk Free later purely to learn SPL syntax, or get SPL practice free on TryHackMe rooms instead of spending 4 GB of your own RAM.

Deploy Wazuh as the **all-in-one OVA** (manager + indexer + dashboard in one VM). Give it two adapters: Internal `lab-net` (to receive agent traffic) and Host-only (so you can open the dashboard from your host browser at `https://192.168.56.x`).

Agent-to-manager ports to remember: **1514/TCP** (agent events), **1515/TCP** (agent enrollment), **443** (dashboard).

Verify agents are actually reporting before you trust any exercise result:

```bash
# On the Wazuh manager VM
sudo /var/ossec/bin/agent_control -l        # list agents; all should show "Active"
sudo tail -f /var/ossec/logs/alerts/alerts.json | jq '.rule.description, .agent.name'
```

### 5.2 Windows telemetry: Sysmon is the single highest-value addition

Windows' default Security log is thin. Sysmon (Sysinternals) adds the process/network/registry detail every detection rule depends on. Deploy it on the Windows target, then point the Wazuh agent at its channel.

```powershell
# On the Windows target VM, as Administrator.
# Use a curated config — the default (-i with no config) is far too noisy.
# SwiftOnSecurity/sysmon-config or olafhartong/sysmon-modular are the two standards.
.\Sysmon64.exe -accepteula -i .\sysmonconfig-export.xml

Get-Service Sysmon64                          # verify: Running
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 5   # verify: events flowing
```

Events worth memorising — these are the backbone of most starter detections:

| Source | Event ID | Meaning | Why a defender cares |
|---|---|---|---|
| Sysmon | 1 | Process creation (with full command line, hashes, parent) | The single most useful detection event on Windows |
| Sysmon | 3 | Network connection by a process | Ties outbound traffic to the binary that caused it |
| Sysmon | 11 | File created | Dropped payloads, staging directories |
| Sysmon | 13 | Registry value set | Persistence via Run keys |
| Sysmon | 22 | DNS query | C2 and beaconing patterns |
| Security | 4624 / 4625 | Successful / failed logon (note Logon Type: 3 = network, 10 = RDP) | Brute force, lateral movement |
| Security | 4672 | Special privileges assigned at logon | Admin-equivalent logon |
| Security | 4688 | Process creation (needs audit policy enabled + registry setting for command line) | Native alternative when Sysmon isn't available |
| Security | 4720 | User account created | Account-creation persistence |
| System | 7045 | Service installed | Classic persistence and lateral-movement artefact |
| Security | 1102 | **Audit log cleared** | Almost always worth an alert. Legitimate admins rarely clear logs |

To make the Wazuh agent forward Sysmon, add the channel to the agent's `ossec.conf`:

```xml
<localfile>
  <location>Microsoft-Windows-Sysmon/Operational</location>
  <log_format>eventchannel</log_format>
</localfile>
```

On the Linux target, the Wazuh agent picks up `/var/log/auth.log` (or `/var/log/secure`) by default — that's your SSH brute-force source.

### 5.3 pfSense — the network layer

A pfSense CE VM as the lab's router gives you three things you can't get otherwise: firewall logs, network segmentation you configured yourself, and an IDS.

- **NICs:** WAN → NAT adapter (for pfSense package downloads only), LAN → Internal `lab-net`. Targets point their gateway at pfSense's LAN address.
- **RAM:** 1 GB bare, **2 GB if running Suricata** (it will OOM otherwise).
- **Packages worth installing:** Suricata (IDS/IPS, gives you alert signatures on lab traffic), pfBlockerNG (DNS/IP blocklists), ntopng (traffic visibility).
- **Segment properly:** put targets on their own interface/VLAN and write explicit firewall rules. Writing a default-deny ruleset and then debugging why your own scan is blocked teaches more than any reading.
- OPNsense is an equally valid fork; pick one.

**Deliberate trade-off:** giving targets a gateway means they *can* route somewhere. Keep the pfSense WAN interface disconnected during exercises, and write an explicit LAN egress-deny rule. Verify with the isolation checks in section 4 after every ruleset change.

### 5.4 Security Onion — know what it is, defer building it

Security Onion is a full free network security monitoring platform: Zeek (protocol logs), Suricata (IDS alerts), full packet capture, and an Elastic-based hunting interface. It is the closest thing to a real SOC sensor you can run for free.

It also wants **16 GB of RAM dedicated to the VM alone** for a standalone install, plus 200 GB of disk. That does not fit on a 16 GB laptop alongside anything else.

**What to do instead, now:** learn the same concepts at lower cost — Suricata via pfSense for alerting, and Wireshark/tcpdump for packet analysis. Revisit Security Onion when you have a spare desktop, an old office PC, or a 32 GB machine. It's a semester-break project, not a week-one one.

### v2 RAM plans

| Session type (16 GB host) | VMs running | RAM |
|---|---|---|
| Windows detection work | Wazuh 4 + Win Server Core 2 + Kali 3 | 9 GB + 5 GB host |
| Network detection work | pfSense 2 + Metasploitable 0.5 + Kali 3 + Wazuh 4 | 9.5 GB + 5 GB host (tight — drop Wazuh or Kali if it swaps) |
| Web app work | DVWA VM 2 + Kali 3 | 5 GB + host, plenty of headroom |

| Session type (8 GB host) | VMs running | RAM |
|---|---|---|
| Scan and detect | Kali 2 + Metasploitable 0.5 | 2.5 GB + 4 GB host |
| Windows logs, no SIEM | Win Server Core 2 + Kali 2 | 4 GB + 4 GB host |
| SIEM practice | Use TryHackMe's browser-based Splunk/Wazuh rooms instead — don't fight your RAM | 0 GB |

---

## 6) Tool Table

Every "first exercise" below runs against **your own lab VMs only**.

| Tool | Runs on | Purpose (defender framing) | First exercise on your own lab |
|---|---|---|---|
| **nmap** | Analyst VM | Know what's listening before an attacker does. Asset inventory, exposure checks, and — from the other side — the noisiest thing on a network, so learn its signature | `sudo nmap -sV -Pn 10.10.10.20` against your Metasploitable. Write down every open port and what service/version claims it. Then re-run and simultaneously capture with tcpdump on the target: count how many packets one "quiet" scan produces |
| **Wireshark** | Analyst VM (or host, on the host-only adapter) | Ground truth for what actually crossed the wire. Protocol learning, and the tool that settles every "is it the firewall or the app?" argument | Capture on the lab-net interface while logging into DVWA over plain HTTP. Apply filter `http.request.method == "POST"`, Follow HTTP Stream, and read your own password in cleartext. That single screenshot is why TLS exists |
| **tcpdump** | Any Linux VM, including headless targets | Capture where there's no GUI — servers, sensors, during incidents. Lightweight enough to leave running | On Metasploitable: `sudo tcpdump -i eth0 -nn -w /tmp/scan.pcap 'not port 22'` while you scan it from Kali. Copy the pcap to the analyst VM and open it in Wireshark. You just built a two-sided view of one event |
| **Burp Community** | Analyst VM | See and modify every HTTP request your browser makes. Essential for understanding web auth, session handling, and validating that server-side controls exist | Proxy your browser through Burp (127.0.0.1:8080, install Burp's CA cert), browse DVWA, then use **Repeater** to resend a request with a modified hidden form field. Confirm whether the server re-validates it — that's the actual lesson: client-side controls aren't controls |
| **Sysinternals Suite** | Windows target VM | Live triage on Windows: what's running, what auto-starts, what it touches, what it connects to | Run **Autoruns** on a clean Windows VM and export the baseline. Add a benign startup entry, re-run, and diff. Then use **Process Explorer** (enable the VirusTotal hash lookup) and **TCPView** to map every listening port to its owning process |

Notes:

- **Sysinternals specifics:** Process Explorer (process tree + hashes), Autoruns (every persistence location Windows has — the single best tool in the suite), Procmon (file/registry/process events; use filters or drown), TCPView (port-to-process), Sigcheck (signature verification), Strings, and Sysmon itself. Process Explorer/Autoruns VirusTotal integration sends **file hashes** to VirusTotal — fine in a lab, think before doing it on data you care about. PsExec is legitimate but heavily abused, so expect AV to flag it; that's a useful lesson, not a bug.
- **Worth adding once the five above are comfortable:** Zeek (protocol logs from pcap — better than Wireshark for "what happened over 6 hours"), Suricata (signature alerting), Volatility 3 (memory forensics), CyberChef (data decoding; see the CTF guide).

---

## 7) Five Graded Starter Exercises

Each exercise is an **attack-then-detect pair**: you generate an event on a system you own, then find it in logs. The detection half is the point. An exercise is not complete when the "attack" works — it's complete when you can show the log evidence and say what rule would have caught it.

| # | Exercise | Difficulty | Time | Needs |
|---|---|---|---|---|
| EX-01 | Port scan → find it in packets and logs | G1 | 60 min | v1 |
| EX-02 | SSH brute force → detect on Linux | G2 | 60 min | v1 (+SIEM better) |
| EX-03 | Suspicious PowerShell chain → detect with Sysmon | G3 | 90 min | v1 + Sysmon |
| EX-04 | Web attack traffic → detect in web logs, then block it | G3 | 90 min | v1 (DVWA) |
| EX-05 | Persistence hunt across Windows + Linux | G4 | 2 hours | v1 (+Autoruns) |

**G1–G4 is a difficulty tier, not a score.** G1 needs only the v1 build and one sitting; G4 needs the full build, extra tooling, and patience across two sessions. Do them in order. The score you give *yourself* is the L-scale below, and the two are independent — an L4 result on EX-01 is worth more than an L1 on EX-05.

**Grading rubric — apply to every exercise:**

| Level | You have... | This is the level that... |
|---|---|---|
| **L1 — Ran it** | Generated the event, saw it succeed | Everyone reaches. Not worth writing down |
| **L2 — Detected it** | Found the specific log entries/packets proving it happened | Makes you useful |
| **L3 — Explained it** | Can name the fields that made it detectable, the ATT&CK technique, and the false-positive risk | Gets you through an interview |
| **L4 — Ruled it** | Wrote a working detection rule/query, tested it fires, tested it doesn't fire on normal activity | Gets you hired |

Target L3 on every exercise, L4 on at least two.

---

### EX-01 — Port scan, then find it (G1)

**Generate.** From the analyst VM, scan your Metasploitable:

```bash
sudo tcpdump -i eth0 -nn -w /tmp/ex01.pcap    # run this ON THE TARGET first
sudo nmap -sV -Pn 10.10.10.20                 # then this on the analyst VM
```

**Detect.** Answer these from evidence, not memory:

1. In the pcap: how many packets? Filter `tcp.flags.syn == 1 && tcp.flags.ack == 0` — how many SYNs from one source in how many seconds?
2. What does a *closed* port look like versus a *filtered* one on the wire? (RST vs no response.)
3. Wireshark → Statistics → Conversations: what makes this obviously not normal traffic?
4. If Wazuh is deployed: does anything fire? If pfSense+Suricata is deployed: which signature?

**Detection logic to write down:** "one source IP → more than N distinct destination ports in under M seconds". Now argue with yourself about N and M — a vulnerability scanner, a monitoring system, and a backup agent all look similar. That tension is the real content of the exercise.

**ATT&CK:** T1046 Network Service Discovery.
**Done when:** you can state the packet-level signature of a scan and the false positives your rule would generate.

---

### EX-02 — SSH brute force, then detect (G2)

**Generate.** Against **your own** Metasploitable/Linux VM, make ~15 failed SSH logins. Typing a wrong password by hand 15 times is entirely sufficient and teaches the same lesson; if you script it, keep it to your lab IP.

**Detect.** On the target:

```bash
sudo grep "Failed password" /var/log/auth.log | tail -20     # Debian/Ubuntu
sudo lastb | head -20                                        # failed login records
sudo grep "Failed password" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn
# ^ count failures per source IP — this IS the detection, in one line
```

In Wazuh, look for the authentication-failure rules and the correlation rule that fires on repeated failures from one source. Note the difference: individual failures are *events*, the brute force is a *correlation*.

**Then defend.** Do this half on a **modern Ubuntu/Debian Server VM**, not on Metasploitable — Ubuntu 8.04's repositories are long dead and the box has no route out by design, so `apt install` there simply fails. Install fail2ban with the NAT adapter temporarily connected, **disconnect NAT again**, then re-run the failed logins and confirm the ban:

```bash
sudo apt install -y fail2ban          # with NAT temporarily connected — then disconnect it
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd      # verify: banned IP list contains your analyst VM
sudo iptables -L -n | grep 10.10.10   # verify the ban is actually enforced
# On a host where fail2ban uses the nftables backend, check with: sudo nft list ruleset | grep -A5 f2b
```

Then remember the real fix is key-only authentication (see `Linux-Security-Cheat-Sheet.md`) — fail2ban is a speed bump, not a control.

**ATT&CK:** T1110 Brute Force.
**Done when:** you have the per-IP failure count query, a working ban, and can explain why key-only auth beats both.

---

### EX-03 — Suspicious PowerShell chain, then detect with Sysmon (G3)

**Generate.** On your Windows target, produce a process chain with the *shape* attackers use, using entirely benign content:

```powershell
# Benign payload: this only prints text. The point is the SHAPE of the event, not what it does.
$b = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes("Write-Output 'lab-test-ex03'"))
cmd.exe /c "powershell.exe -NoProfile -EncodedCommand $b"
```

That is `cmd.exe` spawning `powershell.exe` with an encoded command — a parent/child relationship and command-line pattern that shows up constantly in real intrusions, generated here with a payload that prints a string.

**Detect.** In Event Viewer or Wazuh, find Sysmon **Event ID 1** for that `powershell.exe`:

```powershell
Get-WinEvent -LogName "Microsoft-Windows-Sysmon/Operational" -MaxEvents 200 |
  Where-Object { $_.Id -eq 1 -and $_.Message -match "EncodedCommand" } |
  Select-Object TimeCreated, @{n='Msg';e={$_.Message -split "`n" | Select-String "CommandLine|ParentImage"}}
```

Answer:
1. What is `ParentImage`? Why is `cmd.exe → powershell.exe` more interesting than `explorer.exe → powershell.exe`?
2. Which fields would you key a rule on — `EncodedCommand`? `-NoProfile`? The parent/child pair? The hash?
3. Decode the base64 yourself (CyberChef, or `[Text.Encoding]::Unicode.GetString([Convert]::FromBase64String($b))`). A detection that alerts but can't decode is half a detection.
4. **The hard question:** your organisation's own deployment scripts use encoded commands. Now how do you write the rule? (Answer: parent process, user context, signing, and frequency — not the keyword alone.)

**ATT&CK:** T1059.001 PowerShell.
**Done when:** you have a query that finds it, and a written argument for why your rule won't page someone at 3 a.m. every day.

---

### EX-04 — Web attack traffic in your own logs, then block it (G3)

**Generate.** Against **your own DVWA** (security level Low), do the two most basic textbook probes:

- In a form field that takes an ID, submit a single apostrophe (`'`). Observe the database error the app returns — that error message is the vulnerability disclosing itself.
- In a field that reflects text back to the page, submit a short string with angle brackets and see whether it renders as markup instead of text.

No payload beyond that is needed; the mechanism is the lesson. Then set DVWA's security level to **High** and repeat both — observe what changes in the response.

**Detect.** On the DVWA host:

```bash
sudo tail -50 /var/log/apache2/access.log
sudo grep -iE "union|select|<script|%27|%3Cscript" /var/log/apache2/access.log   # find your own probes
sudo awk '{print $9}' /var/log/apache2/access.log | sort | uniq -c | sort -rn     # status code distribution
```

Answer:
1. Which of your probes appear in `access.log`, and which are invisible there? (GET parameters log; **POST bodies do not.** This is a major real-world blind spot.)
2. What did the 500-error rate look like during your testing? Why is "sudden spike in 500s" a better detector than any keyword list?
3. What would a WAF regex for this look like, and give one legitimate request it would break. (A user named O'Brien. A blog post *about* SQL injection.)

**Then defend.** Set DVWA to High, diff the responses, and connect it to the actual fix: parameterised queries and output encoding — see `Web-Security-Checklist-OWASP.md` and the runnable patterns in `11-Project-Templates/Secure-Coding-Examples/`.

**ATT&CK:** T1190 Exploit Public-Facing Application.
**Done when:** you can state why keyword-based web detection is weak, and name the two things that actually stop these classes.

---

### EX-05 — Persistence hunt (G4)

The most job-relevant exercise here. Persistence is what separates an incident from an inconvenience.

**Generate.** On your own VMs, create four benign persistence entries — a calculator, a script that writes a timestamp, anything harmless:

| OS | Mechanism | ATT&CK |
|---|---|---|
| Windows | Registry Run key (`HKCU\Software\Microsoft\Windows\CurrentVersion\Run`) | T1547.001 |
| Windows | Scheduled Task (`schtasks /create ...`) | T1053.005 |
| Linux | User crontab entry (`crontab -e`) | T1053.003 |
| Linux | systemd service + timer unit | T1543.002 |

**Then wait 48 hours** before hunting. Finding something you planted five minutes ago is not hunting; finding something you half-remember planting is.

**Hunt — Windows:**

```powershell
# $_.Date on a scheduled task is a STRING, not a DateTime — cast it, or the comparison
# is lexical and silently returns the wrong tasks. Some tasks have no Date at all.
Get-ScheduledTask | Where-Object { $_.Date -and [datetime]$_.Date -gt (Get-Date).AddDays(-7) } |
  Select-Object TaskName, TaskPath, Author, Date
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"
Get-WinEvent -LogName Security -FilterXPath "*[System[EventID=4698]]" -MaxEvents 20   # task created
Get-WinEvent -LogName System -FilterXPath "*[System[EventID=7045]]" -MaxEvents 20     # service installed
```

Two gaps to notice rather than trip over: **4698 only appears if "Audit Other Object Access Events" is enabled** (it is off by default), and the Task Scheduler operational log (Event ID 106, task registered) stays empty until you turn on "Enable All Tasks History" in Task Scheduler. 7045 in the System log is on by default. An empty result here is a finding about your *audit configuration*, not proof nothing was created — which is exactly the lesson.
Then run **Autoruns**, and diff against the clean baseline you exported in section 6. The diff is the deliverable.

**Hunt — Linux:**

```bash
sudo crontab -l -u root; crontab -l                  # root and current user crontabs
sudo ls -la /etc/cron.* /var/spool/cron/crontabs/    # system cron locations
systemctl list-timers --all                          # systemd timers
systemctl list-unit-files --state=enabled | head -40 # enabled units — justify each
sudo find /etc/systemd /lib/systemd -name "*.service" -mtime -7   # recently modified units
```

Answer:
1. Which mechanisms produced a **log event** at creation time, and which were silent on your setup? (This gap is why FIM exists.)
2. Which did Sysmon Event ID 13 catch?
3. Turn on Wazuh **File Integrity Monitoring** for `/etc/systemd/system` and `/etc/cron.d`, plant one more, and confirm the alert.

**Done when:** you have a written checklist of every persistence location you'd check on a suspect host, and you know which ones your current tooling would miss.

---

### Log every exercise

One entry per exercise, in a repo file. This becomes portfolio material — pair it with the write-up template in `CTF-Getting-Started-Guide.md` section 5, whose required "how would I detect or prevent this?" fields map straight onto the detection-artefact column below.

| Date | Exercise | Grade reached | Detection artefact (query / rule / filter) | What surprised me |
|---|---|---|---|---|
| | | L1–L4 | | |

---

## 8) Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "VT-x/AMD-V not available" | Virtualization off in BIOS, or Hyper-V owns it | Enable in BIOS; `bcdedit /set hypervisorlaunchtype off`; reboot |
| VMs run extremely slowly | VBS/Memory Integrity or WSL2 active; or RAM overcommitted | Disable Core Isolation for lab sessions; reduce VM count |
| VMs can't see each other | Adapters on different networks, or different Internal Network *names* | Both must be Internal Network with the **identical** name string |
| Target VM can reach the internet | Adapter is NAT or Bridged | Change to Internal Network. Re-run isolation checks. This is the one that matters |
| Wireshark only shows my own VM's traffic | Virtual switches don't flood by default | Set adapter Promiscuous Mode to "Allow All" (VirtualBox), or capture **on the target** with tcpdump instead — usually the better answer |
| Metasploitable has no IP | Internal Network has no DHCP server | Assign static IPs, or run a DHCP server on the analyst VM |
| Wazuh dashboard unreachable from host | No host-only adapter on the Wazuh VM | Add a second adapter (Host-only), browse to that IP |
| Wazuh agent shows "Never connected" | Manager IP wrong, or 1514/1515 blocked | Check `ossec.conf` server address; check the manager's firewall |
| Host disk full | Snapshot chains | Delete stale snapshots; use dynamic disks; move VM store to an external SSD |
| Windows eval expired | 180/90-day clock ran out | Rebuild from `clean-build` snapshot or fresh ISO. Expected, not a failure |
| Guest additions break after host update | Hypervisor version changed | Reinstall guest additions/VMware Tools; this is why you snapshot before host updates |

---

## 9) Maintenance and Next Steps

**Weekly (15 min):** boot the lab, run the isolation verification block, confirm agents are reporting, delete finished exercise snapshots.

**Monthly (45 min):** update the analyst VM (NAT on, then off), collapse snapshot chains, re-export the golden `.ova`, re-baseline Autoruns on the Windows VM.

**Where to go after EX-05:**

| Next build | What it teaches | Cost |
|---|---|---|
| Windows Server + Active Directory (2 VMs) | The environment 90% of enterprise defence happens in; Kerberos, GPO, AD event IDs | ~6 GB RAM |
| Zeek on the analyst VM, fed pcaps | Protocol-level log analysis at scale — the skill Wireshark doesn't teach | Low |
| Automated builds (Vagrant / Packer / Ansible) | Rebuild the whole lab from a text file; genuinely differentiating on a resume | Time, not RAM |
| Detection-as-code (Sigma rules in git) | Portable detections, versioned and reviewed — how real detection teams work | Low |
| Security Onion on a spare/old desktop | Full NSM stack, closest to a real sensor | Separate hardware |

**Cross-references:** `Linux-Security-Cheat-Sheet.md` (harden your Linux VMs) · `Web-Security-Checklist-OWASP.md` (the defences behind EX-04) · `Incident-Response-Playbook.md` (run EX-05 as a mock incident) · `Threat-Model-Template.md` (threat model the lab itself) · `CTF-Getting-Started-Guide.md` (authorized targets beyond your own VMs) · `Cybersecurity-Career-Roadmap.md` (where lab write-ups go in your portfolio).

---

## 10) Final Isolation Checklist

Run before every session. Non-negotiable.

- [ ] Every target VM has exactly one adapter, on Internal Network / LAN Segment
- [ ] No VM anywhere in the lab is set to Bridged
- [ ] Analyst VM's NAT adapter is **disconnected**
- [ ] `ping 8.8.8.8` fails from every target VM
- [ ] `ping <host LAN IP>` fails from every target VM
- [ ] Shared folders / clipboard / drag-and-drop disabled on target VMs
- [ ] `pre-exercise` snapshot taken
- [ ] Every IP I am about to type is one I own
