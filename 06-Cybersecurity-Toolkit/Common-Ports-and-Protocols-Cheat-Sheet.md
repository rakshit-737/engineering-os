# Common Ports & Protocols Cheat Sheet

> The memorize-this sheet. Every security interview, every SOC shift, every nmap output assumes you know these cold. Security significance column = defender's view: what an attacker does with it, what exposure means, whether it should ever face the internet.

Related: Network-Traffic-Analysis-Cheat-Sheet.md (this folder) · [[Computer-Networks]] · Linux-Security-Cheat-Sheet.md (this folder)

---

## The Table

| Port | Proto | Service | Security significance |
|---|---|---|---|
| 20 | TCP | FTP (data) | Data channel of active-mode FTP. Cleartext. Presence means FTP is alive somewhere — find and kill it. |
| 21 | TCP | FTP (control) | Cleartext credentials, anonymous-login misconfigs, ancient server CVEs. Should never face the internet; replace with SFTP. |
| 22 | TCP | SSH | Primary admin channel — brute-force magnet. Internet exposure is common but must be hardened: keys only, no root login, fail2ban. Attackers use it for lateral movement and tunneling. |
| 23 | TCP | Telnet | Cleartext everything, including passwords. Any live Telnet = audit finding. Still ships on routers, switches, IoT, and lab gear. |
| 25 | TCP | SMTP (relay) | Server-to-server mail. Open relay = spam launchpad. Recon via `VRFY`/`EXPN` user enumeration. Blocked outbound by most ISPs. |
| 53 | **TCP+UDP** | DNS | Queries ride UDP; **TCP for zone transfers (AXFR) and responses > 512 bytes**. Open AXFR leaks your whole network map. Universally allowed outbound, so it's a top exfil/tunneling/C2 channel. Interview favorite: "why does DNS use both?" |
| 67 / 68 | UDP | DHCP (server / client) | Rogue DHCP server = attacker hands out itself as gateway/DNS → man-in-the-middle. DHCP starvation exhausts the pool. LAN-only, always. |
| 80 | TCP | HTTP | Cleartext web. Should redirect to 443 in production. Attackers watch it for credentials and session cookies; malware fetches payloads over it. |
| 88 | TCP+UDP | Kerberos | AD authentication. Kerberoasting (crackable service-ticket hashes), AS-REP roasting, Golden/Silver Ticket forgery all live here. Internet-exposed Kerberos = misconfigured domain. |
| 110 | TCP | POP3 | Cleartext mail retrieval. Legacy; credentials sniffable. |
| 123 | UDP | NTP | Time sync. Skewed time breaks Kerberos (>5 min) and log correlation. Historic DDoS amplification vector (`monlist`). |
| 135 | TCP | MS RPC endpoint mapper | Start of the **Windows block**. Remote management plumbing — WMI/DCOM lateral movement starts with a query here. Never internet-facing. |
| 137–139 | UDP/UDP/TCP | NetBIOS (137 name / 138 datagram / 139 session) | Legacy Windows name resolution + SMB-over-NetBIOS. NBT-NS poisoning on 137 (Responder — which also poisons LLMNR on UDP 5355) harvests NTLM hashes. Disable where possible. |
| 143 | TCP | IMAP | Cleartext mail access. Same story as POP3 — should be its TLS variant. |
| 161 / 162 | UDP | SNMP (agent / trap) | Device monitoring. v1/v2c use cleartext community strings — default `public`/`private` reads device configs, sometimes writes them. Classic audit finding on printers, switches, UPSes. |
| 389 | TCP+UDP | LDAP | Directory queries (AD). Unauthenticated/anonymous binds leak users, groups, computers — the attacker's AD map. Cleartext binds expose credentials. Never internet-facing. |
| 443 | TCP | HTTPS | TLS web. The default internet-facing port — and therefore the default C2 disguise. Traffic on 443 that isn't TLS is a finding (see Network-Traffic-Analysis-Cheat-Sheet.md). |
| 445 | TCP | SMB (direct) | **The incident port.** File shares, EternalBlue/WannaCry, NTLM relay, PsExec-style lateral movement, ransomware propagation. Internet-exposed 445 = assume compromise clock is running. See notes below. |
| 465 | TCP | SMTPS (implicit TLS) | Mail submission over TLS from connection start. The encrypted-submission legacy port, still widely used. |
| 587 | TCP | SMTP submission (STARTTLS) | The modern client-submission port. Watch for STARTTLS-stripping downgrade to cleartext. |
| 636 | TCP | LDAPS | LDAP over TLS — what 389 binds should be. Cleartext 389 binds where 636 exists = finding. |
| 993 | TCP | IMAPS | IMAP over TLS — the correct way to do 143. |
| 995 | TCP | POP3S | POP3 over TLS — the correct way to do 110. |
| 1433 | TCP | MS SQL Server | Database. Brute-forceable `sa` account; `xp_cmdshell` turns DB access into OS command execution. Never internet-facing. |
| 1521 | TCP | Oracle DB (TNS listener) | Database. TNS poisoning history, default account sprawl. Never internet-facing. |
| 3306 | TCP | MySQL / MariaDB | Database. Weak/reused root passwords, UDF-based privilege escalation. Bind to localhost unless replication demands otherwise. |
| 3389 | TCP | RDP | Remote desktop. Brute force, credential stuffing, BlueKeep-class CVEs; the classic ransomware initial-access vector. Internet-exposed RDP without MFA/VPN = finding, full stop. |
| 5432 | TCP | PostgreSQL | Database. Same rules: strong auth, TLS, localhost/VPN only. |
| 5985 / 5986 | TCP | WinRM (HTTP / HTTPS) | PowerShell Remoting. Legitimate admin tool = legitimate-looking lateral movement (`Enter-PSSession`, `Invoke-Command`). Watch *who* uses it, from *where*. |
| 6379 | TCP | Redis | In-memory store, **no auth by default** on older versions. Exposed Redis → attacker writes SSH keys or cron jobs via `CONFIG SET` → shell. Repeatedly mass-exploited in the wild. Localhost only. |
| 8080 | TCP | HTTP alternate | Proxies, Tomcat, dev servers, admin consoles. Scanners always check it; "temporary" dev services on 8080 get forgotten and breached. |
| 8443 | TCP | HTTPS alternate | Management UIs (VMware, firewalls, appliances). Admin panels here should be VPN-only. |
| 9200 | TCP | Elasticsearch | REST API, historically no auth by default. Exposed 9200 = queryable, dumpable, deletable data — the engine behind years of "misconfigured database leaks millions of records" headlines. |

---

## Protocol Notes

### TCP vs UDP (recap — full treatment in [[Computer-Networks]])

- **TCP**: connection-oriented (three-way handshake), ordered, reliable. Anything where loss is unacceptable: web, mail, SSH, databases, file transfer.
- **UDP**: connectionless, no delivery guarantee, low overhead. Speed over reliability: DNS queries, DHCP, NTP, SNMP, streaming/VoIP.
- Defender relevance: TCP's handshake is why SYN scans work and why `tcp.flags.syn == 1 && tcp.flags.ack == 0` finds them; UDP's statelessness is why it's the spoofing and DDoS-amplification workhorse (NTP, DNS, SNMP all have amplification history).

### Why exposed 445 = incident, not finding

- SMB is designed for trusted LANs: authentication, file access, remote admin in one protocol. On the internet it offers all three to everyone.
- Worm history proves it: WannaCry and NotPetya (EternalBlue, 2017) spread through 445 with zero user interaction. Mass scanners sweep the entire IPv4 space for 445 continuously — exposure time before first probe is minutes, not days.
- Even patched, it leaks: NTLM authentication over SMB enables relay and hash-capture attacks, and null-session misconfigs enumerate users and shares.
- So the response to internet-facing 445 is incident-shaped: block first, then investigate what already reached it — not "raise a ticket."

### Why cleartext protocols (Telnet, FTP, SNMPv1/v2c, HTTP, POP3/IMAP) still matter in audits

- They're not gone — they're **embedded**: switches, printers, IP cameras, medical/industrial gear, and decade-old "don't touch it" servers still speak them.
- One cleartext login on a flat network hands an internal attacker working credentials via passive sniffing — no exploit required. Credential reuse then turns one printer password into domain access.
- SNMP v1/v2c community strings are credentials sent in cleartext, and defaults (`public`/`private`) survive in real networks for years.
- Audit standards treat them accordingly: cleartext management protocols are automatic findings under most baselines (CIS, PCI DSS). Verify empirically — a five-minute capture during a maintenance window (see Network-Traffic-Analysis-Cheat-Sheet.md) beats asking "do we still use Telnet anywhere?"

---

## Interview Drill

Cover the right column, name the port. Then reverse: cover the left, name the service from the port. Target: instant recall, no counting on fingers.

| Prompt | Answer |
|---|---|
| SSH | 22 |
| RDP | 3389 |
| SMB (direct) | 445 |
| DNS | 53 (UDP queries, TCP zone transfers / large responses) |
| Kerberos | 88 |
| LDAP / LDAPS | 389 / 636 |
| DHCP | 67 (server) / 68 (client), UDP |
| SMTP relay / submission / implicit TLS | 25 / 587 / 465 |
| POP3 / POP3S | 110 / 995 |
| IMAP / IMAPS | 143 / 993 |
| SNMP agent / trap | 161 / 162, UDP |
| NTP | 123, UDP |
| The Windows block | 135, 137–139, 445 |
| MSSQL / Oracle / MySQL / Postgres | 1433 / 1521 / 3306 / 5432 |
| WinRM HTTP / HTTPS | 5985 / 5986 |
| Redis / Elasticsearch | 6379 / 9200 |
| Alt web ports | 8080 / 8443 |
| The two you should never see live | 23 (Telnet), 21 (FTP) |

Follow-up questions interviewers actually ask: why does DNS need TCP? What's the difference between 465 and 587? Why is exposed 445 worse than exposed 22? What can an attacker do with SNMP `public`? Every answer is in the table above.
