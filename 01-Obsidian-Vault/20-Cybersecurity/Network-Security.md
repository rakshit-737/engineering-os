---
title: "Network Security"
description: "Network defense concepts: segmentation, firewalls, IDS/IPS, VPNs."
domain: cybersecurity
category: foundations
type: concept
difficulty: beginner
status: evergreen
tags: [cybersecurity, networking]
prerequisites: []
related: [Networking-for-Security]
order: 20
---

# Network Security

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

> **Defense-architecture overview.** Protocol-level attacker/defender detail lives in [[Networking-for-Security]]; architecture evolution in Zero Trust.

## Core Idea

Network security is layered containment: assume any single host can be compromised, and design the network so compromise spreads slowly, loudly, and through choke points you control. The three levers are segmentation (limit where traffic can go), filtering (firewalls decide what passes each boundary), and monitoring (IDS/IPS and flow logs tell you what actually happened). Encryption in transit (TLS, VPN) removes the network itself as a place to read or tamper with data.

## Details

**Segmentation**
- Split the network into zones by trust and function: user LAN, servers, management, guest Wi-Fi. VLANs implement this at layer 2 — one physical switch, multiple isolated broadcast domains; routing between VLANs goes through a firewall where policy is enforced.
- Why defenders care: segmentation converts "one phished laptop owns the datacenter" into "one phished laptop can reach a printer and a proxy." Lateral movement must cross a monitored boundary.
- Zero trust in one line: stop treating "inside the network" as trusted — authenticate and authorize every request per identity and device, regardless of source IP.

**Firewalls**
- Stateless (packet filter): decides per packet on IPs/ports/protocol; cheap and fast but blind to whether a packet belongs to a real conversation.
- Stateful: tracks connections in a state table; return traffic for an established outbound connection is allowed automatically, unsolicited inbound is not. The default for perimeter and inter-VLAN filtering.
- Default-deny is the house rule: block everything, then allow the specific flows the business needs. An allowlist fails safe; a blocklist fails open when someone forgets a case. Egress filtering matters too — malware calling home on an odd port is caught by "only 443 out via the proxy."

**IDS vs IPS**
| | IDS | IPS |
|---|---|---|
| Position | Out of band (mirror/tap) | Inline, in the traffic path |
| Action | Detect and alert | Detect and block |
| Failure cost | Missed alert | False positive drops legitimate traffic |

- Signature-based detection matches known-bad patterns (e.g. Snort/Suricata rules): precise, but only catches what has a signature.
- Anomaly-based detection baselines normal behavior and flags deviations (a database server suddenly beaconing out at 3 a.m.): catches novel activity, at the cost of more false positives and tuning effort.

**Encryption in transit**
- TLS everywhere: any credential or personal data crossing a network rides TLS — see [[TLS-Handshake]] for how the channel is established. Plaintext protocols (telnet, FTP, HTTP) are findings, not options.
- VPN: an encrypted, authenticated tunnel that extends a trusted network across an untrusted one — remote access for staff, or site-to-site links. A VPN authenticates the user/device; it does not make their laptop clean, so pair it with device checks and least-privilege access on the far side.

**Common architecture — the DMZ**
- Public-facing services (web server, mail gateway) live in a DMZ: a segment between the internet and the internal network, firewalled on both sides.
- Internet → DMZ: only the published ports (80/443). DMZ → internal: only the specific backend flows (e.g. web tier to one database port). Internet → internal directly: never.
- Effect: a compromised web server is one hop into a contained zone, not a foothold on the internal LAN.

**Detection basics**
- Flow data (NetFlow-style records: who talked to whom, when, how much) is the cheapest high-value telemetry — exfiltration shows up as an unusual volume to an unusual destination.
- Defender heuristics: new outbound destinations from servers, periodic same-interval connections (beaconing), DNS to fresh domains, internal port scanning.
- Network detections feed the pipeline in [[Security-Logging-and-Detection]]; when one fires for real, [[Incident-Response-Lifecycle]] takes over.

## Interview Angle

- "Stateless vs stateful firewall?" Lead with the state table and the return-traffic consequence — that's the discriminator they want.
- "IDS vs IPS?" Give both axes: placement (out-of-band vs inline) and action (alert vs block), then the trade-off — an IPS false positive is an outage, an IDS false negative is a silent miss.
- "Design the network for a small web app company." Sketch: internet → firewall → DMZ (web) → firewall → internal (DB, staff VLANs), default-deny both ways, TLS everywhere, VPN + MFA for admin access, flow logging on every boundary. Mentioning egress filtering earns points.
- "What is zero trust?" One line: no implicit trust by network location — verify identity and device on every request. Do not ramble; it's a philosophy, not a product.
- Tie to fundamentals: segmentation is [[Least-Privilege]] applied to network reachability.

## Related

- [[TLS-Handshake]]
- [[Least-Privilege]]
- [[Security-Logging-and-Detection]]
- [[Incident-Response-Lifecycle]]
- [[Threat-Modeling-STRIDE]]
- [[Cybersecurity-Index]]
