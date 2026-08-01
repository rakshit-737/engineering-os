# Network Traffic Analysis Cheat Sheet

> Defender's reference for **Wireshark + tcpdump**. All capture and analysis commands are for traffic on **your own systems, networks you administer, or authorized lab targets** (TryHackMe / HTB / picoCTF / practice pcaps). Capturing traffic on networks you don't own or administer is illegal in most jurisdictions, including under the IT Act in India.

Related: Common-Ports-and-Protocols-Cheat-Sheet.md (this folder) · [[Computer-Networks]] · Incident-Response-Playbook.md (this folder)

---

## 1) Capture Setup

### Interface choice

| Situation | Interface |
|---|---|
| Traffic to/from this machine | The active NIC (`eth0`, `wlan0`, `Ethernet`) |
| Everything this host can see, all interfaces | `any` (tcpdump) — loses VLAN tags, per-interface detail |
| Local processes talking to each other | `lo` / Loopback — invisible on the NIC |
| Traffic of *other* hosts on the network | You need a **SPAN/mirror port** on the switch or a network TAP. On a switched network your NIC only sees its own traffic + broadcast/multicast — promiscuous mode alone does not fix this. |

List interfaces first: `tcpdump -D` or `ip link` (Linux), or the Wireshark start screen (sparkline next to an interface = live traffic).

### Promiscuous mode

- **Off**: NIC drops frames not addressed to it.
- **On** (Wireshark default, tcpdump default): NIC passes up every frame it physically receives.
- It does **not** make a switch send you other hosts' traffic — it only stops your NIC from filtering what already arrives. Useful on a mirror port, hubs, and some Wi-Fi setups (Wi-Fi monitor mode is a separate, stronger thing).

### Capture filters vs display filters — the distinction that confuses everyone

| | Capture filter | Display filter |
|---|---|---|
| Syntax | BPF (`host 10.0.0.5 and port 443`) | Wireshark fields (`ip.addr == 10.0.0.5 && tcp.port == 443`) |
| Applied | **Before** packets are written — discarded traffic is gone forever | After capture — hides packets, never deletes them |
| Where | tcpdump expression, Wireshark "Capture filter" box (green) | Wireshark filter bar (green = valid, red = invalid) |
| Use when | High-volume link, disk/CPU limits, privacy scoping | Analysis — always prefer this when you can afford to capture broadly |

**Rule of thumb: capture wide, filter narrow.** You can't display-filter your way back to packets a capture filter threw away. The two syntaxes are *not* interchangeable — `ip.addr == x` in a capture filter box is an error, `host x` in the display bar is an error.

---

## 2) tcpdump Recipes

Run with `sudo`. `-nn` = don't resolve hostnames or port names (faster, no DNS leaks from your analysis box, no misleading service names).

| Goal | Command |
|---|---|
| Capture everything on an interface to file | `tcpdump -i eth0 -nn -w capture.pcap` |
| Capture with full packets, stop after 10k | `tcpdump -i eth0 -nn -s 0 -c 10000 -w capture.pcap` |
| Rotate files: new file every hour, keep going | `tcpdump -i eth0 -nn -G 3600 -w 'cap_%Y%m%d_%H%M.pcap'` |
| Rotate by size: 100 MB files, keep last 10 | `tcpdump -i eth0 -nn -C 100 -W 10 -w cap.pcap` |
| Only one host | `tcpdump -i eth0 -nn host 10.0.0.5` |
| Only traffic *from* / *to* a host | `tcpdump -i eth0 -nn src host 10.0.0.5` / `dst host 10.0.0.5` |
| Only one port | `tcpdump -i eth0 -nn port 53` |
| Port range | `tcpdump -i eth0 -nn portrange 135-139` |
| A whole subnet | `tcpdump -i eth0 -nn net 10.0.0.0/24` |
| Combine: DNS from one host, not your SSH session | `tcpdump -i eth0 -nn host 10.0.0.5 and port 53 and not port 22` |
| SYN packets only (scan hunting) | `tcpdump -i eth0 -nn 'tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0'` |
| Read a pcap back | `tcpdump -nn -r capture.pcap` |
| Read pcap, apply filter after the fact | `tcpdump -nn -r capture.pcap port 443` |
| Verbose + hex/ASCII payload dump | `tcpdump -nn -vv -X -r capture.pcap host 10.0.0.5` |
| ASCII payload only (readable HTTP) | `tcpdump -nn -A -r capture.pcap port 80` |

**Flag combos worth memorizing:**

| Combo | Meaning |
|---|---|
| `-nn` | No name/port resolution — always use it |
| `-nn -vv` | Verbose: TTL, IP ID, flags, checksums |
| `-nn -vv -X` | Above + hex and ASCII payload — for eyeballing content |
| `-s 0 -w file` | Full snaplen to file — capture now, analyze in Wireshark later |
| `-c N` | Stop after N packets — don't fill the disk |

Typical workflow: **capture with tcpdump on the server (headless), analyze in Wireshark on your workstation.** `scp` the pcap over, don't analyze on the compromised box.

---

## 3) Wireshark Display Filters — Grouped by Hunt

### HTTP / TLS basics

| Filter | What it shows |
|---|---|
| `http.request` | All HTTP requests (method, URI, host) |
| `http.request.method == "POST"` | POSTs — exfil and credential submission live here |
| `http.user_agent` | Add as column; odd/rare user agents = script or malware |
| `http.host contains "example"` | Requests to a domain of interest |
| `tls.handshake.type == 1` | TLS Client Hello — start of every TLS session |
| `tls.handshake.extensions_server_name` | **SNI** — the domain being requested, in cleartext even though the session is encrypted. Add as a column: right-click the field → Apply as Column. Your main visibility into HTTPS destinations. |
| `tls.handshake.type == 11` | Certificates — self-signed / weird issuer / mismatched CN are C2 tells |
| `tcp.port == 443 && !tls` | Traffic on 443 that is not TLS — see section 7 |

### DNS anomalies

| Filter | What it shows |
|---|---|
| `dns.qry.name.len > 50` | Abnormally long query names — DNS tunneling / DGA candidates |
| `dns.flags.rcode == 3` | NXDOMAIN responses. A host generating **many** NXDOMAINs is a DGA-malware tell (it iterates generated domains until one resolves) |
| `dns.qry.type == 16` | TXT queries — legitimate (SPF/verification) but also a tunneling channel |
| `dns.count.answers > 10` | Bloated answers — tunneling responses |
| `dns && !(dns.qry.name contains "yourdomain")` | Cut known-good internal noise, see what's left |
| `udp.dstport == 53 && ip.dst != <your DNS server>` | Hosts *sending queries* to somewhere other than the corporate resolver — policy bypass or C2. (`dstport`, not `port` — otherwise every legitimate response *from* your resolver matches too.) |

### Auth traffic (Kerberos / SMB / NTLM)

| Filter | What it shows |
|---|---|
| `kerberos` | All Kerberos (port 88) |
| `kerberos.msg_type == 10` / `== 12` | AS-REQ (initial auth) / TGS-REQ (service ticket request) |
| `kerberos.error_code == 24` | KDC_ERR_PREAUTH_FAILED — wrong password. Many in a burst from one host = password spraying/brute force |
| `kerberos.CNameString` | Account name in the request — add as column to see who is authenticating |
| `smb \|\| smb2` | All SMB. SMBv1 (`smb`) appearing at all on a modern network is a finding |
| `smb2.cmd == 5` | SMB2 Create — file opens; watch for admin shares (`C$`, `ADMIN$`, `IPC$`) |
| `smb2.filename contains ".exe"` | Executables moving over SMB — lateral movement staple |
| `ntlmssp` | NTLM negotiation — where relay attacks and hash capture happen |

### Suspicious patterns

| Filter | What it shows |
|---|---|
| `tcp.flags.syn == 1 && tcp.flags.ack == 0` | Bare SYNs. One source hitting many ports/hosts = **port scan**. Sort by source, count destinations. |
| `tcp.flags.reset == 1` | RST floods — scan responses from closed ports |
| `tcp.analysis.retransmission` | Retransmissions — network trouble or a half-open scan pattern |
| `icmp && data.len > 64` | Oversized ICMP payloads — ping tunneling |
| `tcp.payload && !(tcp.port == 80) && !(tcp.port == 443)` | Payload-bearing traffic on unusual ports — inventory it. (Use `!(tcp.port == 80)`, never `tcp.port != 80` — `tcp.port` matches *either* of a packet's two ports, so `!=` is almost always true.) |

**Beaconing** (C2 check-in at regular intervals) has no single filter — it's a *timing* pattern:

1. Filter to one suspect pair: `ip.addr == <host> && ip.addr == <dst>`.
2. Look at the **Time** column deltas between connection starts (`tcp.flags.syn == 1 && tcp.flags.ack == 0` narrows to session starts).
3. Connections every N seconds ± small jitter, with similar small payload sizes, for hours = beacon. Humans are bursty; malware is punctual.
4. **Statistics → I/O Graph** with the filter applied makes the regular spikes visually obvious.

---

## 4) Follow Stream & Export Objects

**Follow stream** — reassemble one conversation into readable text:

1. Right-click any packet of interest → **Follow → TCP Stream** (or HTTP/TLS/UDP Stream).
2. Red = client→server, blue = server→client. Cleartext credentials, commands, and downloaded content appear here directly.
3. The filter bar now shows `tcp.stream eq N` — note the stream number in your case notes; it's how you cite the conversation.
4. Use the stream arrows (bottom of dialog) to step through every conversation one by one.

**Export objects** — pull transferred files out of the capture:

1. **File → Export Objects → HTTP** (also SMB, DICOM, TFTP, FTP-DATA).
2. Sort by size/type, save suspect files **into an isolated analysis folder — never double-click them**.
3. Hash what you saved: `sha256sum file.bin`, then check the hash on VirusTotal *(submit the hash, not the file, if the capture may contain sensitive data)*.
4. HTTPS content won't appear here — it's encrypted. You get metadata (SNI, cert, sizes, timing) unless you have TLS keys (lab: `SSLKEYLOGFILE` + Preferences → Protocols → TLS → keylog file).

---

## 5) The Analysis Method

Don't scroll packets from the top. Every capture, same order:

1. **Statistics → Capture File Properties** — time span, packet count, drops. Know what you're holding.
2. **Statistics → Protocol Hierarchy** — what protocols are present and in what proportion. Anomalies pop here: SMBv1, IRC, TFTP, "Data" under a web port.
3. **Statistics → Conversations** — sort by bytes (who talked most) and by packets. Note top talkers and any host with conversations to hundreds of destinations (scan) or one destination with hundreds of tiny conversations (beacon).
4. **Statistics → DNS** — quick read on query volume and rcodes before hand-filtering.
5. **Narrow**: pick one suspect host/conversation from steps 2–3, apply filters from section 3, follow streams.
6. **Extract IOCs** as you go — running list, not from memory afterward:
   - IPs and ports (from Conversations)
   - Domains (from DNS queries + TLS SNI)
   - URLs and user agents (from `http.request`)
   - File names + SHA256 hashes (from Export Objects)
   - Timestamps of first/last activity (for the incident timeline)
7. Write the narrative: *who* talked to *whom*, *when*, over *what protocol*, and *what moved*. If you can't fill those four, keep digging.

Time display: **View → Time Display Format → Time of Day / UTC** — raw seconds-since-capture-start is useless in an incident timeline.

---

## 6) Practice Pcap Sources

| Source | What it is |
|---|---|
| [malware-traffic-analysis.net](https://www.malware-traffic-analysis.net/training-exercises.html) | The gold standard. Real malware traffic with exercise questions + answers. Work these in order — this is the closest thing to SOC pcap triage practice. **Handle in a VM; archives are password-protected for a reason.** |
| [Wireshark sample captures](https://wiki.wireshark.org/SampleCaptures) | Per-protocol reference captures — see what clean Kerberos/SMB/DNS looks like before hunting dirty versions |
| TryHackMe | Wireshark room series + SOC-path traffic analysis rooms |
| CyberDefenders / Blue Team Labs | Scored pcap-based DFIR challenges |
| picoCTF | Forensics category regularly includes pcap challenges |
| Your own lab | Capture your own machine for an hour, explain every conversation. Baseline-building is the skill. |

---

## 7) What NOT to Trust

- **Ports don't prove protocols.** Port 443 carrying non-TLS, SSH on 8080, C2 speaking its own protocol on 53 — all routine. Wireshark's dissector guesses by port; verify with Protocol Hierarchy, payload inspection, and **right-click → Decode As** when the guess is wrong. `tcp.port == 443 && !tls` is your friend.
- **DNS names in the packet list.** Resolution can be attacker-influenced; IOC on the IP *and* the queried name, note both.
- **Absence of evidence.** A quiet pcap only proves nothing crossed *that interface* during *that window*. Check capture drops (Capture File Properties) before declaring anything clean.
- **Timestamps** are the capture box's clock. Note its timezone and NTP state before merging with other log sources.
- **HTTP headers, user agents, hostnames** are attacker-controlled strings, not facts. Corroborate with IPs, timing, and behavior.
