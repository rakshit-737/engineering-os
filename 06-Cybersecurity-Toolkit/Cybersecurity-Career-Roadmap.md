# Cybersecurity Career Roadmap

> Defensive-security career plan for a CS undergrad in India. All hands-on work happens on systems you own or authorized lab platforms (TryHackMe, HackTheBox, picoCTF). Any commands referenced in this toolkit are for hardening, detection, and analysis of your own or authorized systems — nothing here targets third parties.

Companion files in this folder: `Incident-Response-Playbook.md`, `Linux-Security-Cheat-Sheet.md`, `Windows-Security-Cheat-Sheet.md`, `Web-Security-Checklist-OWASP.md`, `Threat-Model-Template.md`, `Security-Interview-Questions.md`, `SOC-Analyst-Playbook.md`, `Common-Ports-and-Protocols-Cheat-Sheet.md`, `Network-Traffic-Analysis-Cheat-Sheet.md`. Daily execution runs through `00-Command-Center/Daily-Dashboard.md` (Build / Learn / Career blocks).

---

## 1) Role Map — what the jobs actually are

| Role | Day-to-day reality | Entry difficulty | Typical entry path |
|---|---|---|---|
| **SOC Analyst (L1/L2)** | Triage SIEM alerts, decide true/false positive, escalate per playbook, write shift-handover notes. Repetitive at L1; the fastest way to see real attack telemetry. Often 24×7 shifts. | **Low** — highest-volume entry role in India | Degree + Security+/equivalent + home-lab evidence → MSSP or Big-4 SOC |
| **Penetration Tester** | Scoped, authorized assessments: recon, exploit within rules of engagement, then the part that pays — writing the report clients act on. More report-writing than movie hacking. | **Medium-High** — few true entry roles; most testers pivot from SOC/AppSec or enter via strong CTF record | CTFs + eJPT → VAPT firm junior role → OSCP within 1-2 years |
| **AppSec Engineer** | Code review, threat modeling with dev teams, SAST/DAST pipeline tuning, fixing classes of bugs (not instances), secure-by-default libraries. Closest to software engineering. | **Medium** — needs real dev skill; great fit for CS grads who can code | Dev internship + OWASP depth + secure-code portfolio → product company AppSec/internship |
| **DFIR (Forensics & IR)** | Incidents: disk/memory/log analysis, timeline reconstruction, containment decisions, post-incident reports. Feast-or-famine intensity; strong writing required (reports may face lawyers). | **High** — almost never a first job | SOC L2 → IR team, or Big-4 forensics practice as analyst |
| **GRC (Governance, Risk, Compliance)** | Audits, risk registers, ISO 27001 / SOC 2 / RBI-SEBI compliance mapping, vendor assessments, policy writing. Meetings and documents, not terminals. | **Low-Medium** — least technical entry bar | Big-4 risk advisory hires freshers at scale; ISO 27001 LA cert helps later |
| **Cloud Security** | IAM policy review, misconfiguration hunting, guardrails-as-code (SCPs, Azure Policy), cloud-native detection (CloudTrail/Sentinel). Mostly a specialization layered on another role. | **Medium** — rarely a fresher title | SOC or DevOps entry + AZ-500/SC-200 → cloud security engineer |
| **Security Engineer** | Build and run controls: SSO/MFA, EDR rollout, hardening baselines, detection pipelines, internal tooling. Infrastructure + code + judgment. | **Medium-High** — usually 2+ years in | SOC/SysAdmin/DevOps → security engineer; automation skill is the differentiator |

Practical read for a student: **SOC, GRC, and AppSec are the realistic doors.** Pentest, DFIR, cloud, and security engineering are mostly second jobs. Pick the door, not the dream title — you can pivot within 2 years.

---

## 2) Skills Matrix

### Tier 1 — Foundational (non-negotiable for every track)

| Skill | You can... | Resources (external + this repo) |
|---|---|---|
| **Networking** | Explain TCP handshake, DNS resolution, TLS, NAT; read a pcap in Wireshark; name common ports on sight | [[Computer-Networks]], [[Network-Security]], [[TLS-Handshake]] · TryHackMe "Pre Security" path · Wireshark on your own traffic |
| **Linux** | Navigate, manage permissions/users/services, read auth logs, harden a fresh VM | [[Operating-Systems]], `Linux-Security-Cheat-Sheet.md` · OverTheWire Bandit · a Debian VM you actually break and fix |
| **One scripting language (Python)** | Parse a log file, hit an API, automate a repetitive check | `03-Coding-Library/python/` — `src/algos/security_utils.py` + `tests/test_security_utils.py` already exist (hashing/HMAC/password/token utilities); extend them with a log parser and port-state reporter, tests alongside, same pattern as the other algos modules |
| **Security principles** | Frame any answer with CIA, least privilege, authn vs authz | [[CIA-Triad]], [[Least-Privilege]], [[Authentication-vs-Authorization]] |

### Tier 2 — Intermediate (choose all three, in this order)

| Skill | You can... | Resources |
|---|---|---|
| **SIEM & detection** | Write a detection query, tune a noisy rule, explain what to log and why | [[Security-Logging-and-Detection]], [[Incident-Response-Lifecycle]], `Incident-Response-Playbook.md` · TryHackMe SOC Level 1 path · free Splunk/Elastic on your home lab · Sigma rule format |
| **Web security** | Find and fix OWASP Top 10 issues in code you wrote; explain each to a developer | [[OWASP-Top-10]], [[SQL-Injection]], [[XSS]], `Web-Security-Checklist-OWASP.md` · `11-Project-Templates/Secure-Coding-Examples/` (5 self-verifying scripts — run `run_all.py`, then extend them) · PortSwigger Web Security Academy (free, best single web-sec resource) |
| **Cloud fundamentals** | Explain shared responsibility, IAM, why metadata endpoints matter (SSRF → credentials) | [[Cloud-Security]] · one free-tier account (Azure or AWS) with billing alerts · Microsoft SC-900 learning path (free) |

### Tier 3 — Per-track specialization

| Track | Specialize in | Resources |
|---|---|---|
| **Blue team / SOC** | Windows event IDs, malware triage, threat intel basics, one SIEM deeply | [[Malware-Analysis-Basics]], [[Security-Logging-and-Detection]] · Blue Team Labs Online · DFIR-adjacent THM rooms · MITRE ATT&CK navigator |
| **Offense (authorized)** | Enumeration methodology, privilege-escalation patterns, report writing | [[Memory-Safety]] (why exploits exist) · HTB starting-point boxes · picoCTF archives · every box = a writeup |
| **AppSec** | Threat modeling, code review, dependency/SAST tooling in CI | [[Threat-Modeling-STRIDE]], `Threat-Model-Template.md` · run threat model on your own `11-Project-Templates/FastAPI-Service-Template` · Semgrep/Bandit on your own repos |
| **Cloud security** | IAM deep-dive, logging (CloudTrail/Activity Log), policy-as-code | [[Cloud-Security]], [[Least-Privilege]] · flaws.cloud, flaws2.cloud (free, authorized) · Azure security benchmarks |
| **GRC** | ISO 27001 control families, risk assessment method, audit evidence | [[CIA-Triad]] as the vocabulary · ISO 27001 free summaries · map `Threat-Model-Template.md` output to controls |

House rule from [[Cybersecurity-Index]] applies to every row: concept → authorized-lab reproduction → written defense → detection idea → vault note.

---

## 3) Certification Path

Order matters more than count. Free/cheap proof first, one HR-gate cert, then track-specific.

| Stage | Cert / credential | Rough cost (2026) | Worth it? — honest note |
|---|---|---|---|
| **0. Free proof** | picoCTF, TryHackMe path completions, OverTheWire | Free (THM premium ~₹1,200/mo optional) | Not certs, but green-flag evidence on a fresher CV; profile links go on the resume |
| **0. Free cert** | ISC2 CC (Certified in Cybersecurity) | Free exam via ISC2 1M-certified program (verify current offer) | Real proctored cert at zero cost; weak alone but fine as a first line |
| **1. Structured intro** | Google Cybersecurity Certificate (Coursera) | ~₹4,000/mo × 3-6 mo; financial aid available | Good curriculum for absolute basics; low HR weight in India — do it fast or skip if THM is working |
| **2. The HR gate** | **CompTIA Security+ (SY0-701)** | ~US$404 (~₹33k); academic-store vouchers cheaper — use your student email | The single most-filtered-for entry cert. Breadth, not depth. Take it once foundations are real, not before |
| **3a. Blue team** | CySA+ **or** BTL1 | CySA+ ~US$424; BTL1 ~£399 (includes retake) | BTL1 is hands-on and better signal to practitioners; CySA+ scans better with HR. Pick one, not both |
| **3b. Offense** | eJPT → (later) OSCP | eJPT ~US$249 · OSCP ~US$1,749+ (~₹1.5L) | eJPT is a fair, cheap first offensive exam. OSCP is the industry bar but do NOT self-fund as a student unless finances allow — many Indian employers sponsor it after hiring |
| **3c. Cloud** | AZ-500 or SC-200 (Azure) / AWS Security Specialty | Microsoft exams ~₹4,800 in India (cheapest good certs available to you); AWS ~US$300 | Excellent value in India due to local exam pricing and GCC/MSSP Azure demand. SC-200 pairs naturally with SOC work |
| **Avoid early** | **CEH** | ~US$950-1,200+ | HR-recognized in India (some govt/PSU tenders name it) but technically shallow for the price. Only do it if a specific employer requires it — never self-fund it before Security+ |
| **Avoid early** | CISSP, CISM, vendor mega-bootcamps | ₹1L+ | CISSP requires 5 yrs experience anyway; bootcamps rarely beat the free resources above |

Budget reality: you can reach interview-ready on **≤ ₹50k total** (THM months + Security+ + one Microsoft exam). Anything beyond that should be paid for by an employer.

---

## 4) 12-Month Plan

Each week plugs into the Daily-Dashboard loop: **Learn** = vault note filled, **Build** = artifact committed, **Career** = visible/portfolio/application action. `00-Command-Center/Weekly-Review.md` closes each week. Slipping a week is fine; skipping the review is not.

### Months 1-3 — Foundations

| Week | Learn (vault note filled) | Build (artifact) | Career |
|---|---|---|---|
| 1 | [[CIA-Triad]], [[Least-Privilege]] | Debian VM installed, snapshot taken | Create/clean GitHub + LinkedIn; pin this repo |
| 2 | [[Computer-Networks]] — OSI/TCP-IP layers | Wireshark capture of your own browsing, annotated | Join a null chapter / college CTF group |
| 3 | TCP/UDP, common ports | Python: port-state reporter for your own VM → extend `03-Coding-Library/python/src/algos/security_utils.py` | THM streak started |
| 4 | DNS resolution + failure modes | Script: DNS lookup + logging in `security_utils` | OverTheWire Bandit 0-10 |
| 5 | [[TLS-Handshake]] | Inspect a real handshake in Wireshark; note the steps | Bandit 11-20 |
| 6 | [[Operating-Systems]] — processes, memory | Harden the VM using `Linux-Security-Cheat-Sheet.md`; document each change | THM Pre Security path done |
| 7 | Linux permissions, sudo | `security_utils`: auth-log parser (failed-login counter) with tests | First LinkedIn post: home-lab writeup |
| 8 | [[Authentication-vs-Authorization]] | SSH key-only auth on the VM; write the before/after | picoCTF practice set begun |
| 9 | [[Hashing-vs-Encryption]] | Run + extend `Secure-Coding-Examples/password_hashing.py` | ISC2 CC free exam booked |
| 10 | [[Network-Security]] — firewall/IDS/IPS | Host firewall rules on VM + a test proving they work | ISC2 CC taken |
| 11 | HTTP deep-dive: methods, headers, cookies | Deploy `FastAPI-Service-Template` locally; capture its traffic | Writeup #2 published |
| 12 | Review month: re-read all 12 notes, fix gaps | `security_utils` README + tests green | Phase review in Weekly-Review.md |

### Months 4-6 — Security+ and Labs

| Week | Learn | Build | Career |
|---|---|---|---|
| 13 | Security+ domain 1 (general concepts) | Anki/notes deck started | Book exam date ~week 24 (deadline forces pace) |
| 14 | Security+ domain 2 (threats) | Map each threat type to a vault note | THM SOC Level 1 path started |
| 15 | [[OWASP-Top-10]] | Run `Web-Security-Checklist-OWASP.md` against your FastAPI app | PortSwigger Academy: SQLi labs |
| 16 | [[SQL-Injection]] | Extend `Secure-Coding-Examples/sql_injection_prevention.py` | PortSwigger: auth labs |
| 17 | [[XSS]] | Add output-encoding tests to your FastAPI app | PortSwigger: XSS labs |
| 18 | Security+ domain 3 (architecture) | Home-lab diagram (draw.io) committed | Writeup #3: securing my own API |
| 19 | Security+ domain 4 (operations) | First practice exam; log weak areas | Update resume with lab section |
| 20 | [[Security-Logging-and-Detection]] | Install free SIEM (Elastic/Splunk free) in lab | THM SOC path 50% |
| 21 | [[Incident-Response-Lifecycle]] | Fill `Incident-Response-Playbook.md` for your own lab | Mock scenario: run the playbook on a simulated brute-force |
| 22 | Security+ domain 5 (program mgmt) | Practice exam #2 | Internship tracker (`10-Career-Toolkit/Internship-Application-Tracker.csv`) populated with 20 targets |
| 23 | Weak-domain review only | Practice exam #3 (pass ≥ 85% before sitting) | Exam logistics confirmed |
| 24 | **Security+ exam** | — | Post result; add cert to LinkedIn/resume |

### Months 7-9 — Specialization + CTFs (pick ONE track; blue-team shown, substitute Tier-3 row for others)

| Week | Learn | Build | Career |
|---|---|---|---|
| 25 | Choose track using the Role Map; write a one-page decision note | Track plan committed to this folder | Tell your network what you're specializing in |
| 26 | Windows auth events (4624/4625/4688) | Windows VM added to lab, logs shipped to SIEM | THM SOC path continued |
| 27 | [[Threat-Modeling-STRIDE]] | `Threat-Model-Template.md` run on your FastAPI app | Writeup #4: threat model published |
| 28 | Brute-force detection logic | **Detection rule #1** (Sigma): failed-login spike → success | picoCTF weekly cadence begins |
| 29 | [[Malware-Analysis-Basics]] | Static triage of an EICAR/known-sample in an isolated VM, per note's lab-only rule | Blue Team Labs Online free challenges |
| 30 | Phishing analysis: headers, auth results | Detection rule #2: suspicious inbox-rule creation | Writeup #5: phishing header analysis |
| 31 | [[Cloud-Security]] — IAM | Free-tier account, budget alert, MFA everywhere | SC-900 learning path (free) |
| 32 | Cloud logging (CloudTrail/Activity Log) | Detection rule #3: console login without MFA | flaws.cloud completed + writeup #6 |
| 33 | Beaconing & C2 patterns (defender view) | Detection rule #4: periodic outbound to rare domain | CTF #1 as a team (any live event) |
| 34 | MITRE ATT&CK mapping | Map your 4 rules to ATT&CK techniques in a table | Publish "detections" repo on GitHub |
| 35 | [[Memory-Safety]] | Annotated notes: why patches matter, one CVE case study | CTF #2; writeup regardless of rank |
| 36 | Phase review; fill gaps flagged in Weekly-Reviews | Detection rule #5 + repo README with ATT&CK matrix | BTL1 or CySA+ decision + booking |

### Months 10-12 — Portfolio + Applications

| Week | Learn | Build | Career |
|---|---|---|---|
| 37 | `Security-Interview-Questions.md` — networking + OS sections | Portfolio index page (GitHub profile README) | Resume v2: reviewed against `10-Career-Toolkit/Technical-Interview-Roadmap.md` |
| 38 | Interview questions — web + crypto sections | Best 3 writeups polished (these get read, the rest get skimmed) | 5 applications from tracker |
| 39 | Interview questions — IR + SOC scenarios | Record yourself answering the 3 classic scenarios; fix the weak spots | 5 applications + 2 cold emails (`10-Career-Toolkit/Cold-Email-Templates.md`) |
| 40 | Track cert study (BTL1/CySA+) | Lab writeup #7 | 5 applications; first responses expected |
| 41 | Track cert study | Detection repo: add test/validation harness | Mock interview with a peer or null-chapter senior |
| 42 | **Track cert exam window** | — | 5 applications |
| 43 | STAR stories from your own lab incidents (`10-Career-Toolkit/STAR-Story-Template.md`) | Blog post: "12 months of security self-study — artifacts, not vibes" | 5 applications + follow-ups |
| 44 | Company-specific prep per interview | Patch portfolio gaps interviewers exposed | Interviews |
| 45 | Salary/level research for realistic asks | — | Interviews + applications continue |
| 46 | Weakest interview domain — targeted redo | One more polished writeup | Interviews |
| 47 | — | Lab teardown/rebuild doc (proves you can do it from scratch) | Negotiation or next-cycle plan |
| 48 | Full-year retrospective in Weekly-Review format | Roadmap v2 for year 2 | Offer, or a precise gap list feeding roadmap v2 |

---

## 5) Portfolio — what actually gets entry-level interviews

Interviewers at the entry level are screening for evidence you *do* the work unprompted. Ranked by signal strength:

1. **Home-lab writeups** — "I built X, broke it myself, detected it, fixed it." The build-detect-fix loop in one artifact beats any cert bullet. Your lab already exists in this repo's templates; write up what you did to it.
2. **Detection rules repo** — Sigma rules with ATT&CK mapping and a note on false-positive tuning. Almost no freshers have this; it reads as SOC-ready. (Weeks 28-36 produce it.)
3. **CTF writeups** — picoCTF/THM/HTB, methodology over flags. A writeup of a *failed* attempt with lessons is also strong signal. Respect platform rules on publishing active-box solutions.
4. **Secure code you wrote** — `Secure-Coding-Examples/` extended plus your `security_utils` module with tests. For AppSec roles this is the whole interview.
5. **Blog / LinkedIn posts** — 6-10 posts over the year. Consistency matters more than polish; it also feeds cold-email credibility.

What does **not** move the needle at entry level: cert-collecting past Security+, "completed course" certificates without artifacts, retweeting threat-intel news, tool lists on a resume with nothing built.

---

## 6) India-Specific Entry Points

| Channel | Reality | How to approach |
|---|---|---|
| **MSSP / IT-services SOCs** (TCS, Wipro, Infosys, HCL, Tech Mahindra, LTIMindtree) | Highest fresher volume; campus placements + off-campus drives; expect 24×7 shifts and process-heavy work. 1-2 years here is a legitimate springboard | Campus placement cell + national hiring tests (TCS NQT, Wipro NLTH) and off-campus portals; Security+ or equivalent clears the filter |
| **Big-4 cyber practices** (Deloitte, EY, KPMG, PwC) | Hire freshers into both GRC and technical (VAPT/SOC) streams; brand name compounds later | Campus drives + referrals; GRC stream has the lowest technical bar, technical stream wants lab evidence |
| **CERT-In empanelled audit firms** | ~150+ empanelled firms do VAPT/audits for Indian orgs; small firms mean broad exposure fast. Official list is on cert-in.org.in — treat it as a jobs directory | Cold-email with a specific writeup attached (`10-Career-Toolkit/Cold-Email-Templates.md`); small firms answer email, not portals |
| **Product-company security teams** (Zoho, Freshworks, Postman, Razorpay, PhonePe, CRED, Flipkart) | Fewer seats, better work and pay; usually want AppSec-flavored skill. Security internships exist but are quietly posted | Watch careers pages + employee referrals; the secure-code portfolio is the differentiator |
| **Global security vendors with India R&D** (Qualys, Zscaler, Sophos, Gen, CrowdStrike, Palo Alto, Fortinet, Cisco Talos-adjacent) | Real security engineering internships in Pune/Bangalore/Chennai/Mohali; competitive but student-accessible | Apply at internship windows (Aug-Oct for summer); DSA rounds still exist — keep `03-Coding-Library` practice alive |
| **Community pipeline** (null chapters, OWASP chapters, BSides, Seasides, c0c0n, Nullcon student passes) | Where referrals actually happen; volunteering at a conference ≈ free access to hiring managers | Attend monthly null meets from month 1; volunteer at one conference during months 7-12 |
| **Govt / research** (CERT-In, NCIIPC internships, DSCI programs, DRDO cyber roles) | Slow processes, real mandate; internships are CV-credible | Watch official portals; apply early, expect long timelines |
| **Campus leverage** | College CTF team (or start one), Smart India Hackathon security problem statements, NPTEL security courses for transcript weight | A CTF team captaincy is a leadership STAR story with technical proof built in |

Timeline fit: months 1-6 → join community + build; months 7-9 → internship applications (vendor internship windows); months 10-12 → full-time/placement season with the portfolio done. Placement-season note: services-company offers often arrive before product/security offers — an MSSP SOC offer in hand is a floor, not a ceiling.

---

*Update cadence: revisit Section 4 in every `00-Command-Center/Weekly-Review.md`; revise Sections 3 and 6 quarterly (prices and empanelment lists drift).*
