# Security Interview Questions — Entry Level

> Prep bank for SOC / AppSec / security-adjacent fresher interviews. Each question has a strong-answer outline (skeleton, not script — say it in your own words) and the vault note that covers it deeper. Scenario answers assume you are the defender of systems you are authorized to protect. Drill order: read the note, close it, answer aloud, compare against the outline.

Interview meta-rule: structure beats trivia. Frame answers with [[CIA-Triad]] / [[Least-Privilege]] where natural, and always end scenario answers with **detection or prevention**, not just diagnosis.

---

## A) Networking

**1. Walk me through what happens when you type a URL and press Enter.**
- DNS resolution (cache → resolver → authoritative) → TCP handshake → TLS handshake → HTTP request/response → render
- Name one security control per stage: DNSSEC/DoH, SYN-flood protection, cert validation, security headers
- Depth: [[Computer-Networks]], [[TLS-Handshake]]

**2. TCP vs UDP — and why does an attacker care?**
- TCP: connection-oriented, ordered, handshake; UDP: fire-and-forget, low overhead
- Security angle: UDP enables spoofed-source amplification (DNS/NTP DDoS); TCP handshake enables SYN floods and port scanning semantics
- Depth: [[Computer-Networks]], [[Network-Security]]

**3. Explain the TLS handshake.**
- ClientHello (versions, ciphers, SNI) → ServerHello + certificate → key exchange (ECDHE for forward secrecy) → symmetric session keys
- Asymmetric crypto authenticates and exchanges keys; symmetric crypto carries the data — know *why* (performance)
- Cert validation: chain to trusted CA, hostname match, validity dates, revocation
- Depth: [[TLS-Handshake]], [[Hashing-vs-Encryption]]

**4. How does DNS work, and how is it attacked/defended?**
- Hierarchy: root → TLD → authoritative; caching with TTLs
- Attacks (textbook level): cache poisoning, domain hijack, DNS tunneling for exfiltration
- Defense: DNSSEC, monitoring for anomalous query volume/entropy — DNS logs are a top SOC data source
- Depth: [[Computer-Networks]], [[Security-Logging-and-Detection]]

**5. Firewall vs IDS vs IPS.**
- Firewall: policy enforcement (allow/deny by rule); IDS: detects and alerts, out-of-band; IPS: detects and blocks, inline
- Trade-off worth saying: IPS false positive = outage, IDS false negative = missed breach
- Where each sits in a segmented network diagram
- Depth: [[Network-Security]]

**6. What ports/services should you know on sight?**
- Core set: 22 SSH, 53 DNS, 80/443 HTTP(S), 25/587 SMTP, 3389 RDP, 445 SMB, 3306/5432 DBs
- The point isn't memorization — it's spotting *wrong* ones: why is a workstation serving 445 externally?
- Depth: [[Computer-Networks]], `Common-Ports-and-Protocols-Cheat-Sheet.md`

**7. What is ARP spoofing and how would you detect it?**
- ARP has no authentication → attacker answers "I am the gateway" → on-path position on the LAN
- Detection: duplicate-IP/MAC alerts, dynamic ARP inspection on switches, gratuitous-ARP monitoring
- Mitigation context: this is why "internal network = trusted" died → segmentation, mutual TLS
- Depth: [[Network-Security]]

---

## B) OS / Linux

**8. Explain Linux file permissions.**
- rwx for owner/group/other; octal notation; directory execute = traverse
- Special bits worth one line each: setuid (and why it's a privilege-escalation review target), sticky bit on /tmp
- Tie to [[Least-Privilege]]: default-deny, grant minimally
- Depth: `Linux-Security-Cheat-Sheet.md`, [[Least-Privilege]]

**9. Where do you look on a Linux box you suspect is compromised?**
- Logs: `/var/log/auth.log` (or journald) for auth events; `last`/`lastb` for logins
- Live state: unexpected processes, listening sockets (`ss -tulpn`), new users, cron entries, modified binaries
- Order matters: capture volatile evidence before rebooting — say this, it signals IR maturity
- Depth: `Linux-Security-Cheat-Sheet.md`, [[Incident-Response-Lifecycle]]

**10. Process vs thread — and what makes a process "suspicious"?**
- Process: own memory space; thread: shared memory within a process
- Suspicious signals: odd parent-child (word processor spawning a shell), execution from /tmp or user-writable paths, name masquerading, unexpected network connections
- Depth: [[Operating-Systems]], [[Malware-Analysis-Basics]]

**11. How would you harden a fresh Linux server?**
- Accounts: no root SSH, key-only auth, sudo with logging
- Surface: remove unused services, host firewall default-deny, unattended security updates
- Visibility: central log shipping, file-integrity monitoring
- Bonus: mention you've actually done this in your lab and documented it
- Depth: `Linux-Security-Cheat-Sheet.md`, [[Security-Logging-and-Detection]]

**12. Windows: which event IDs matter for authentication monitoring?**
- 4624 successful logon (know logon types: 2 interactive, 3 network, 10 RDP), 4625 failed, 4688 process creation, 4720 user created, 4672 special privileges
- Pattern beats ID recall: many 4625s then one 4624 from same source = brute-force success candidate
- Depth: [[Security-Logging-and-Detection]], `Windows-Security-Cheat-Sheet.md`

**13. What is sudo and why not just use root?**
- Per-command delegation, individual accountability in logs, revocable, granular
- Root everywhere = no attribution + total blast radius on credential theft
- Depth: [[Least-Privilege]], [[Authentication-vs-Authorization]]

---

## C) Web Security

**14. Explain the OWASP Top 10 — pick three and go deep.**
- Know the current list's themes: access control, crypto failures, injection are perennial top-tier
- Pick the three you can defend in code (injection, broken access control, security misconfiguration) — depth on three beats a memorized ten
- Depth: [[OWASP-Top-10]], `Web-Security-Checklist-OWASP.md`

**15. What is SQL injection and how do you prevent it?**
- Mechanism: user input concatenated into a query changes query *structure*, not just data
- Prevention hierarchy: parameterized queries (the answer), least-privilege DB accounts, input validation as defense-in-depth, WAF as compensating control only
- Detection: DB errors in logs, anomalous query patterns
- Depth: [[SQL-Injection]], `11-Project-Templates/Secure-Coding-Examples/sql_injection_prevention.py`

**16. Explain XSS — types and defenses.**
- Stored / reflected / DOM-based; key framing: XSS attacks the *user's browser*, SQLi attacks the *datastore*
- Defense: contextual output encoding (primary), CSP as backstop, HttpOnly cookies to limit session theft
- Depth: [[XSS]], [[OWASP-Top-10]]

**17. CSRF vs XSS — what's the difference?**
- CSRF: browser auto-sends credentials, attacker forges a *request* (no script execution needed); XSS: attacker executes *script* in the victim origin
- CSRF defense: SameSite cookies, anti-CSRF tokens; note XSS can defeat CSRF tokens — one line, big signal
- Depth: [[XSS]], `Web-Security-Checklist-OWASP.md`

**18. Authentication vs authorization — with a concrete failure of each.**
- AuthN: who you are (failure: credential stuffing); AuthZ: what you may do (failure: IDOR — change `/user/123` to `/user/124`)
- IDOR fix: server-side object-level checks, indirect references — never trust the client's ID
- Depth: [[Authentication-vs-Authorization]], [[OWASP-Top-10]]

**19. What security headers and cookie flags would you set on a web app?**
- Cookies: `HttpOnly`, `Secure`, `SameSite`
- Headers: CSP (its `frame-ancestors` directive is the modern anti-clickjacking control, replacing X-Frame-Options), HSTS, X-Content-Type-Options
- Say *what each mitigates* — a list without threats attached scores zero
- Depth: `Web-Security-Checklist-OWASP.md`, [[XSS]]

**20. How would you secure a REST API?**
- AuthN (tokens, short-lived) → AuthZ per-object per-request → input validation → rate limiting → TLS everywhere → audit logging
- Mention SSRF if the API fetches URLs (cloud metadata endpoint risk)
- Bonus: you've run this list against your own FastAPI template
- Depth: [[Cloud-Security]], `Secure-Coding-Examples/url_validation_ssrf.py`, `Secure-Coding-Examples/input_validation.py`

---

## D) Cryptography

**21. Hashing vs encryption vs encoding.**
- Hashing: one-way, fixed-length, integrity/passwords; Encryption: reversible with key, confidentiality; Encoding: reversible without key (base64), NOT security
- The trap: candidates who call base64 "encryption" fail here — say the distinction explicitly
- Depth: [[Hashing-vs-Encryption]]

**22. Symmetric vs asymmetric encryption — when is each used?**
- Symmetric: one shared key, fast, bulk data (AES); Asymmetric: key pair, slow, key exchange + signatures (RSA/ECC)
- Real systems hybridize: TLS uses asymmetric to establish a symmetric session key
- Depth: [[Hashing-vs-Encryption]], [[TLS-Handshake]]

**23. How should passwords be stored?**
- Never encrypted, never plain: salted, slow, adaptive hash (bcrypt/argon2)
- Salt defeats rainbow tables; work factor defeats brute-force at scale; per-user salt defeats batch cracking
- Depth: [[Hashing-vs-Encryption]], `Secure-Coding-Examples/password_hashing.py`

**24. How does a browser decide to trust a certificate?**
- Chain of trust to a pre-installed root CA, signature verification at each link
- Checks: hostname match, validity window, revocation (OCSP/CRL)
- Failure modes: self-signed warnings, expired certs, why users clicking through is a phishing vector
- Depth: [[TLS-Handshake]]

**25. What is an HMAC and where is it used?**
- Hash + secret key = integrity *and* authenticity (plain hash gives only integrity)
- Uses: API request signing, JWT (HS256), cookie tampering protection
- Depth: [[Hashing-vs-Encryption]]

---

## E) Incident Response

**26. Walk me through the incident response lifecycle.**
- PICERL: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned (SANS model; NIST 800-61 covers the same ground in four phases, merging containment/eradication/recovery)
- One concrete action per phase — reciting names without actions is a fail
- Emphasize Preparation and Lessons Learned; juniors always skip both
- Depth: [[Incident-Response-Lifecycle]], `Incident-Response-Playbook.md`

**27. Containment vs eradication — and short-term vs long-term containment?**
- Containment: stop the spread (isolate host, disable account) while preserving evidence; Eradication: remove the cause (malware, persistence, vulnerable service)
- Short-term: network isolation now; long-term: rebuild/patch before full return
- Trap in the question: don't wipe the box first — evidence dies
- Depth: [[Incident-Response-Lifecycle]]

**28. Ransomware alert on a file server — first three actions?**
- Isolate the host from the network (contain), do NOT power off (memory evidence), check backup integrity *immediately* (backups are the recovery path and a target)
- Then: scope — which accounts/hosts touched it, severity classification, escalate per matrix
- Depth: `Incident-Response-Playbook.md` (severity matrix), [[Incident-Response-Lifecycle]]

**29. What is chain of custody and why does a SOC analyst care?**
- Documented who-touched-what-when for evidence; broken chain = unusable in legal/HR proceedings
- Practical version: hash images, log every access, write-blockers for disks, contemporaneous notes
- Depth: [[Incident-Response-Lifecycle]], [[Malware-Analysis-Basics]]

**30. What makes a good detection/alert? How do you handle a noisy rule?**
- Good alert: high-confidence signal, enough context to act, mapped to a technique, documented response step
- Noisy rule: measure FP rate → find the benign pattern → tune with exclusions or thresholds → document why — never silently disable
- Depth: [[Security-Logging-and-Detection]]

---

## F) SOC Scenarios (the classics)

**31. You see 100 failed logins on one account, then a success. Walk me through it.**
- Don't panic-declare an incident — investigate: source IP(s) of failures vs the success (same source = likely compromise; success from user's normal IP/device = maybe unrelated)
- Check: timing (spray speed vs human), account type (admin?), what the session did *after* success (new device, privilege use, lateral movement)
- Act: if compromise likely — disable/force reset, kill sessions, scope other accounts from same source, severity-classify and escalate per playbook
- Close the loop: detection improvement (lockout policy? MFA? geo-anomaly rule?)
- Depth: [[Security-Logging-and-Detection]], `Incident-Response-Playbook.md`

**32. A user reports a phishing email. What do you do?**
- Thank/never blame the reporter (reporting culture is a control)
- Analyze: headers (SPF/DKIM/DMARC results, true sender), URLs/attachments in a sandbox — never on your workstation
- Scope: search mail logs — who else received it, who clicked, who entered credentials
- Act: quarantine org-wide, block sender/URL, reset credentials for anyone who entered them, check those accounts for post-click activity
- Close: report metrics, tune mail filtering
- Depth: [[Incident-Response-Lifecycle]], [[Security-Logging-and-Detection]]

**33. Explain SQL injection to a non-technical manager.**
- Analogy, not jargon: a form field is a question we ask the database; injection is a customer writing an *instruction* in the answer blank and our system obeying it
- Impact in business terms: customer data theft, regulatory exposure, downtime
- Reassurance with a plan: fixable with a standard coding practice (parameterized queries) + code review — bounded cost, known solution
- This question tests communication; if you say "sanitize inputs" to the manager, you've missed the point
- Depth: [[SQL-Injection]]

**34. EDR flags malware on an executive's laptop. Next steps?**
- Verify first (hash lookup, detection name, quarantine status) — was it blocked or did it execute?
- If executed: isolate via EDR, capture triage data, check for persistence and credential access; executives = high-value target, raise severity
- Scope: same hash/indicator across the fleet
- Communicate carefully — exec devices mean politics; follow the escalation matrix, not instinct
- Depth: [[Malware-Analysis-Basics]], `Incident-Response-Playbook.md`

**35. A server is making regular outbound connections to an unknown domain every 60 seconds. Thoughts?**
- Hypothesis: beaconing (C2 heartbeat) — regular interval, small payloads, rare domain
- Verify: domain age/reputation, which process owns the connection, is it actually a legitimate updater/telemetry (many are)
- If malicious: contain, find the initial access, scope the fleet for the same indicator
- Detection lesson: rare-domain + fixed-interval analytics catch what signatures miss
- Depth: [[Network-Security]], [[Security-Logging-and-Detection]]

**36. A user logs in from India, then from another country 20 minutes later.**
- "Impossible travel" alert — but check benign causes first: VPN, mobile carrier routing, cloud-app IP geolocation noise
- Investigate: device fingerprint match, MFA result, actions after login (inbox rules, mass download, OAuth grants)
- If suspicious: kill sessions, reset, check for mailbox-rule persistence
- Depth: [[Authentication-vs-Authorization]], [[Security-Logging-and-Detection]]

---

## G) Behavioral (security flavor)

Use `10-Career-Toolkit/STAR-Story-Template.md` — every answer below should be a prepared STAR story from your actual lab/CTF/project work, not hypotheticals.

**37. Why cybersecurity?**
- Specific origin (a CTF, a lab build, a class) + evidence you act on it (this repo, writeups, streaks) — passion claims without artifacts read as empty
- Know which track you want and why (Role Map in `Cybersecurity-Career-Roadmap.md` gives you the vocabulary)

**38. Tell me about a security project you've done.**
- Pick the one with a build-detect-fix loop: built the lab → attacked it yourself (authorized) → wrote the detection → hardened it
- Quantify anything quantifiable: rules written, FP rate reduced, boxes completed
- Have the GitHub link ready; offer to walk through it

**39. How do you stay current?**
- Name real sources you actually read (pick and be honest — a feed, a podcast, advisories, community meets like null chapters)
- Better: describe your pipeline — new technique → vault note → lab reproduction → detection idea (the [[Cybersecurity-Index]] practice loop, in your own words)

**40. You find a serious vulnerability in a website you have no authorization to test. What do you do?**
- Stop immediately — no further probing; unauthorized testing is illegal regardless of intent (in India: IT Act Sections 43 and 66 cover unauthorized access)
- Report responsibly: security.txt / responsible-disclosure program / CERT-In as the national coordinator
- Document only what you observed incidentally; never demand reward
- This is an integrity gate question — there is no clever answer, only the ethical one

**41. Tell me about a mistake you made and what changed after it.**
- Real mistake, real countermeasure — ideally one from your Daily-Dashboard Blockers log (that's what it's for)
- Structure: mistake → impact → root cause → the checklist/script/note that now prevents it
- Security teams run on blameless postmortems; showing you already think that way is the point

**42. Explain a technical concept you learned recently to me like I'm not technical.**
- Pre-pick one (TLS, hashing, phishing) and rehearse the no-jargon version — question 33's skill, generalized
- Structure: analogy → why it matters to them → one-sentence takeaway

---

## H) Questions to Ask the Interviewer

Ask 2-3. These signal you understand the job better than "what's the culture like":

**For SOC roles**
- "What's the alert volume per analyst per shift, and what's the current false-positive rate?" (reveals burnout risk and maturity)
- "Do L1 analysts get to write or tune detections, or is that a separate team?" (growth path)
- "What does the L1 → L2 progression actually require here, and how long does it typically take?"

**For any security role**
- "What was the last incident or near-miss that changed how the team works?" (blameless culture check — evasiveness is data)
- "How does the security team's work get prioritized against product/business pressure?" (reveals whether security has teeth)
- "What would a strong first 90 days look like in this role?"

**For internships/fresher roles**
- "Who would mentor me, and how much of their time is actually allocated to it?"
- "Is there budget/support for certifications like OSCP or SC-200 after joining?" (also politely confirms you know which certs matter)

---

*Drill cadence: one domain per day during months 10-12 (see `Cybersecurity-Career-Roadmap.md` weeks 37-39). Answer aloud, time-boxed to 2 minutes per question; scenario questions get 4.*
