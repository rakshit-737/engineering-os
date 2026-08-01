# CTF Getting Started Guide

> **Scope statement — read once, applies to every command and technique in this file.** CTF platforms are the only place a student gets *explicit written authorization* to attack a system. Everything here is done on picoCTF / TryHackMe / Hack The Box targets, on official competition infrastructure, or on your own lab VMs (`Home-Lab-Setup-Guide.md`). Techniques do not transfer to systems you don't own — the same nmap command is training on an HTB box and an offence under India's IT Act, 2000 against your college's server. Every platform's target list *is* your scope document; nothing outside it is in scope, including the platform's own website.

**Why CTFs, in one line:** they are the fastest legal way to build hands-on skill, and the write-ups they produce are portfolio artefacts you can hand a recruiter — which is what actually converts practice into an interview.

---

## 1) What CTFs Do and Don't Teach

Be honest about this early; it stops you from over-investing.

| CTFs build | CTFs do **not** build |
|---|---|
| Tool fluency — you stop googling basic syntax | Working at scale (10,000 endpoints, not one box) |
| Methodical enumeration: check everything, assume nothing | Alert triage under real time pressure and real consequences |
| Reading unfamiliar formats — headers, hex, protocols, binaries | Stakeholder communication, tickets, change control |
| Comfort with being stuck for an hour without giving up | Detection engineering (the flag is the goal, not the log trail) |
| Fast, self-directed research on a topic you've never seen | Compliance, risk, and everything that pays senior salaries |
| Written communication, if you do write-ups | Long-horizon defensive engineering |

**The defender's adaptation:** every CTF challenge answers "how did this work?". You add the second question — **"how would I have detected or prevented it?"** — and write it down. That converts an offensive exercise into defensive knowledge, and it's the differentiator in a blue-team interview. It's a required field in the write-up template in section 5.

---

## 2) Category Map

| Category | What it actually is | What it teaches for real jobs | Blue-team tie-in | Defender priority |
|---|---|---|---|---|
| **Web** | Find and abuse flaws in a web app: broken auth, injection, access control, misconfiguration | The most directly transferable category. Every appsec, SOC, and pentest role touches HTTP. You learn to read requests/responses fluently | WAF rules, web access-log analysis, secure code review, OWASP Top 10 as lived experience | **High — start here** |
| **Forensics** | Reconstruct events from artefacts: disk images, memory dumps, pcaps, logs, file carving | Nearly identical to real DFIR and SOC L2 work. Highest job-overlap of any category for defenders | This *is* blue team. Same tools, same method, same output | **Highest for a defender** |
| **OSINT** | Find information from public sources: metadata, archives, public records, social footprints | Threat intel, attack-surface management, phishing/pretext assessment, and understanding what your own org leaks | Reduce your organisation's public footprint; know what an attacker sees first | **High — cheap to practise** |
| **Crypto** | Break weak or misused cryptography: bad implementations, tiny keys, reused nonces, classical ciphers | You stop treating crypto as a black box. Directly improves design review — spotting ECB, hardcoded IVs, homemade "encryption" | Reviewing your team's crypto choices; understanding TLS failures for real | Medium |
| **Reversing** | Work out what a compiled binary does without source: disassembly, decompilation, debugging | Malware analysis, detection engineering, understanding vendor binaries. Steep curve, high ceiling | Malware triage, IOC extraction, writing YARA rules | Medium — start after 3 months |
| **Pwn (binary exploitation)** | Memory-corruption exploitation: overflows, control-flow hijack, defeating mitigations | Deep systems understanding — why ASLR, DEP/NX, stack canaries, and memory-safe languages exist. Concept level is enough for most defenders | Exploit mitigation policy, patch prioritisation, arguing for memory-safe languages | **Lowest for a defender** — learn the concepts, skip the grind |
| **Misc / stego / networking** | Grab bag: hidden data in media, protocol puzzles, scripting problems | Scripting fluency and lateral thinking | Data-exfiltration channels you'd need to detect | Low, but fun when stuck |

**If you are aiming at a defensive/blue-team career, spend your time in this ratio:** forensics 35%, web 25%, OSINT/networking 20%, crypto 10%, reversing 10%, pwn ~0% beyond understanding what a buffer overflow is and why it matters. Do not spend your first six months grinding pwn because it feels like "real hacking" — it is the least relevant category to the job you want, and the most likely to burn you out.

---

## 3) Platform Ladder

Climb this in order. Each rung has a graduation test — move on when you pass it, not when you're bored.

| Rung | Platform | Cost | Format | Do this first | Graduate when |
|---|---|---|---|---|---|
| **1** | **picoCTF** (Carnegie Mellon) | Free | Jeopardy-style; **picoGym** holds hundreds of persistent challenges, plus an annual March competition | Work the General Skills and Forensics tracks in picoGym, easiest first | You've solved ~25 challenges and written up 5 |
| **2** | **TryHackMe** | Free tier (substantial) + subscription | Guided rooms with explanations and hand-holding | Free beginner paths first; then for defenders, the SOC-focused rooms (Splunk, Sysmon, Wireshark, Zeek, Autopsy) | You can complete a room without reading the answer section |
| **3** | **Hack The Box** | Free tier + VIP; **HTB Academy** is separate and modular | Unguided machines. No hints. Closest to real assessment work | **Starting Point** — the guided on-ramp, explicitly built for this transition | You've owned 3 easy machines with only occasional write-up checks |
| **4** | **CTFtime events** | Free | Timed team competitions, weekend format | Join or form a team; pick events tagged beginner-friendly; commit to one weekend | You've contributed at least one solve to a team event |
| **Parallel** | **Blue-team platforms** | Mostly free tiers | Defensive scenarios: pcap analysis, log triage, malware traffic, DFIR images | **CyberDefenders**, **Blue Team Labs Online**, **LetsDefend**, and **malware-traffic-analysis.net** (free, excellent pcap exercises) | Run these alongside rungs 2–4, not after |

### Notes on each rung

**picoCTF** — built for high-school and undergrad students; the difficulty ramp is the gentlest that exists and it's genuinely free with no upsell. picoGym stays available year-round, so you don't wait for a competition. Start here even if you feel it's beneath you; the point is building the *habit*, not the challenge rating.

**TryHackMe** — the best explanations of any platform, which is exactly what a beginner needs and exactly what makes it a trap: it is possible to complete dozens of rooms by following instructions and learn very little. Force yourself to attempt each task before reading the walkthrough. THM's defensive content is unusually good and maps directly to SOC analyst job descriptions — for your target career, prioritise the blue rooms over the red ones. Subscription pricing in INR is modest but real; exhaust the free rooms first and treat the subscription as a decision, not a default.

**Hack The Box** — the difficulty jump from THM is deliberate and steep. **Do not skip Starting Point.** Free accounts get access to a rotating set of active machines; retired machines (which have write-ups) generally require VIP — check current terms, they change. HTB Academy is a separate, more structured product; it's good but it is not the machines.

**CTFtime** — the calendar and rating hub for real competitions. Two things matter more than your score: (1) find a team, because solo events at 3 a.m. are how people quit, and (2) always read the published write-ups afterwards, including for challenges you solved. Look for events tagged beginner-friendly and prefer jeopardy format over attack-defense to start. Your own college security club is the easiest team to find or start.

**Blue-team platforms** — for your career direction these are as important as the offensive ladder, and they're under-used by students, which makes them a differentiator. A CyberDefenders pcap investigation or a malware-traffic-analysis.net exercise looks *more* relevant on a defender's resume than another HTB easy box.

### Platform rules you must not break

| Rule | Why |
|---|---|
| Attack only the target IPs/boxes the platform assigns you | The platform's own website, other users' VPN IPs, and shared infrastructure are all **out of scope**. People get banned for this every single week |
| Don't publish write-ups for **active** HTB machines or restricted content | HTB explicitly prohibits it; TryHackMe restricts some rooms. Retired/free content is fine. A ban for a write-up is a self-inflicted wound |
| Don't share flags | It's cheating on every platform, and it wastes the only thing you're there for |
| Don't attack CTF infrastructure during events | Scoreboards and challenge servers are out of scope unless the rules say otherwise. This is the classic disqualification |
| Read each event's rules before it starts | Rules differ. "I assumed" is not a defence |

---

## 4) Practising Without Burning Out

The failure mode is not laziness. It is a 14-hour weekend binge, followed by three weeks of nothing, followed by quitting. **Two challenges a week, every week, beats a monthly binge** — by the end of a year that's ~100 challenges, and consistency is what actually compounds.

### The weekly cadence

| Slot | Duration | Content |
|---|---|---|
| Weekday session ×2 | 45–60 min | One challenge, or one room section |
| Weekend session ×1 | 2 hours | One harder challenge, or a lab exercise from `Home-Lab-Setup-Guide.md` |
| Write-up | 20 min | For **one** of the week's solves. Non-negotiable — this is the deliverable |
| **Weekly total** | **~4 hours** | Sustainable alongside a full CS course load |

### The 45-minute rule

Being stuck is the learning. Being stuck *indefinitely* is quitting in slow motion.

1. Work the challenge for 45 minutes with no hints.
2. Still stuck → take one hint, or read *only enough* of a write-up to unblock the current step.
3. Finish it yourself from there.
4. **Then re-solve it from scratch a week later with no notes.** This step is where the learning actually happens, and almost nobody does it.

Reading a full write-up after a genuine attempt is studying, not cheating. Reading one after five minutes is entertainment.

### Anti-patterns

| Anti-pattern | Why it fails | Do instead |
|---|---|---|
| Weekend binges | Burnout, and poor retention from massed practice | Short spaced sessions |
| Chasing points/rank | Optimises for easy solves and streak anxiety | Track *categories learned*, not points |
| Skipping write-ups | You forget 80% within two weeks and have nothing to show | One write-up per week, minimum |
| Only doing categories you're good at | Your weakest category is where the growth is | Rotate: never the same category twice in a row |
| Grinding pwn as a beginner defender | Steepest curve, least job relevance for you | Forensics and web first |
| Tutorial-following without attempting | Feels productive, teaches nothing | Attempt first, always |
| Comparing yourself to people with 10 years of experience | Guaranteed demoralisation | Compare to yourself three months ago |

### Exam season and slumps

During exams, drop to **one challenge a week, 30 minutes**. Keeping the chain alive at minimum effort is strictly better than a clean break, because restarting from zero costs far more than maintaining. If you do break the chain, restart with a challenge you've already solved — an easy win rebuilds momentum better than a fresh hard one.

---

## 5) Write-Up Template

The write-up is the product. Solves are invisible to employers; write-ups are searchable, linkable, and reviewable evidence that you can think and communicate.

Copy this block per challenge. Keep them in `writeups/<platform>/<challenge-name>.md`.

```markdown
# <Challenge Name>

| Field | Value |
|---|---|
| Platform | picoCTF / TryHackMe / HTB / <event name> |
| Category | Web / Crypto / Forensics / OSINT / Reversing / Pwn / Misc |
| Difficulty | Easy / Medium / Hard (as rated) |
| Date solved | YYYY-MM-DD |
| Time spent | e.g. 75 min |
| Hints used | None / 1 hint / partial write-up at step 3 |

## The challenge
One or two sentences: what was given, what was asked for.

## What I tried (including what failed)
Chronological. Include dead ends and why they were dead ends — this section is the
most useful one for future-you and the most revealing one to an interviewer.
1. ...
2. ... (failed because ...)

## What worked
The path to the solution, with the commands/steps that mattered. Enough that you
could repeat it in six months. Redact the flag.

## Tool / technique learned
The one transferable thing. "CyberChef's Magic operation auto-detects layered
encodings" is a better entry than "I used CyberChef".

## Blue-team lesson: how would I detect or prevent this?
REQUIRED FIELD. Answer all three:
- **Detect:** what log entry, packet, or artefact would reveal this activity?
  Which log source, which field, which event ID?
- **Prevent:** what control (code pattern, config, architecture change) removes
  the vulnerability class rather than this one instance?
- **Miss:** what would my current detection NOT catch, and what's the false-positive
  cost of tightening it?

## References
Docs, write-ups, or notes I used.
```

### Filled example

```markdown
# Cookie Monster (example)

| Field | Value |
|---|---|
| Platform | picoCTF (picoGym) |
| Category | Web |
| Difficulty | Easy |
| Date solved | 2026-07-28 |
| Time spent | 40 min |
| Hints used | None |

## The challenge
A login page that accepts any username and sets a session cookie. Goal: reach an
admin-only page.

## What I tried (including what failed)
1. Tried common credentials — no. The app accepts any username, so auth wasn't the gate.
2. Looked for an IDOR on the user ID in the URL — no user ID in the URL. Dead end.
3. Opened DevTools → Application → Cookies and found a cookie holding a base64 value.

## What worked
Decoded the cookie in CyberChef: it contained the username and a role field in
plaintext. Edited the role value, re-encoded, replaced the cookie, refreshed.
The server trusted the cookie's contents without verification. Flag redacted.

## Tool / technique learned
Client-side state is attacker-controlled state. Any authorization decision made from
data the client can edit is not an authorization decision. CyberChef's "Magic"
operation identified the base64 layer without me specifying it.

## Blue-team lesson: how would I detect or prevent this?
- **Detect:** a user whose requests suddenly carry an elevated role with no
  corresponding privilege-grant event in the app's audit log. Alert on
  "authorization level in session != authorization level in the users table".
  Also: repeated 200s on admin routes from an account never provisioned as admin.
- **Prevent:** never store authorization state client-side. Use a random opaque
  session ID; keep role server-side, looked up per request. If state must live in
  a cookie, sign it (HMAC) and verify on every read. Set Secure, HttpOnly, SameSite.
- **Miss:** if the app logs only HTTP status codes, this is invisible — every
  request returns 200 and looks legitimate. Detection requires application-level
  audit logging of *which identity performed which privileged action*, which most
  student projects don't have. That gap is the real finding.

## References
OWASP Top 10 A01 Broken Access Control; `Web-Security-Checklist-OWASP.md` in this repo.
```

### Before publishing any write-up

- [ ] Target is retired / free / explicitly permitted for write-ups by that platform
- [ ] Flag redacted
- [ ] No platform credentials, VPN configs, or API keys in screenshots or command output
- [ ] No other users' IPs or handles
- [ ] Blue-team section is filled in — that's the section that differentiates yours
- [ ] It reads as an explanation, not a command dump

---

## 6) Feeding the Portfolio

Write-ups are raw material. The portfolio is the packaged version. This connects directly to section 5 of **`Cybersecurity-Career-Roadmap.md`** (same folder), which ranks five evidence types by hiring signal: home-lab write-ups, a detection-rules repo, CTF write-ups, secure code you wrote, and blog/LinkedIn posts. Note where CTF write-ups sit — **third**, below the lab and the detections. They are the entry point, not the destination.

**Repo layout:**

```
security-portfolio/
├── README.md                  <- the index; the only file most people will read
├── writeups/
│   ├── picoctf/
│   ├── tryhackme/
│   └── ctf-events/
├── lab/                       <- from Home-Lab-Setup-Guide.md: build notes, EX-01..05 results
└── detections/                <- Sigma rules, Wazuh rules, SPL/KQL queries you wrote
```

**The `detections/` folder is the one that gets you a defender interview.** Anyone can post CTF write-ups. A repo of detection rules you wrote, tested in your own lab, and documented with false-positive analysis is rare from an undergraduate.

**Index table for the README:**

| Challenge | Platform | Category | Technique learned | Detection I wrote |
|---|---|---|---|---|
| Cookie Monster | picoCTF | Web | Client-side authz is not authz | App-layer role-mismatch alert |
| | | | | |

**What actually gets read:** a recruiter or engineer skims the README for 30 seconds and opens at most one write-up. Optimise accordingly:

- **Three excellent write-ups beat thirty one-liners.** Prune ruthlessly; the weak ones drag down the average.
- Lead the README with your best three, linked by name.
- One line at the top stating what you're aiming at: "CS undergrad, defensive security — detection engineering and DFIR."
- Commit steadily rather than in one dump. A year of consistent history is itself evidence.
- Cross-link to the lab: "detection rule written for EX-03 in my home lab, tested against Sysmon Event ID 1."

**Resume line, once you have ~10 write-ups and 3 detections:**

> Maintain a public security portfolio: 10+ CTF write-ups (picoCTF, TryHackMe) each documenting the attack mechanism and a corresponding detection strategy; 3 custom Wazuh/Sigma detection rules developed and validated in a self-built virtualized lab (Wazuh SIEM, Sysmon, pfSense).

That sentence is specific, verifiable, and defence-framed. It works because the underlying artefacts exist.

---

## 7) Tooling Starter Kit by Category

Install on your analyst VM from `Home-Lab-Setup-Guide.md`. Kali/Parrot ships most of these.

| Category | Core tools | What each is for |
|---|---|---|
| **All-purpose** | **CyberChef** (browser, works offline — download the release and run it locally), `xxd`, `base64` | CyberChef is the single most useful tool in CTFs: chained encoding/decoding, hashing, ciphers, data conversion. Its **Magic** operation auto-detects encodings. Learn it in week one |
| **Forensics** | `file`, `strings`, `binwalk`, `exiftool`, `foremost`, Autopsy, Volatility 3, `xxd` | `file` identifies type by magic bytes, not extension; `strings` finds readable text in binaries; `binwalk` finds and extracts embedded files; `exiftool` reads metadata (huge in OSINT too); Volatility 3 analyses memory dumps |
| **Network / pcap** | Wireshark, `tcpdump`, Zeek, NetworkMiner | Wireshark for deep single-flow analysis; Zeek for "what happened across six hours" summaries; NetworkMiner for fast file/credential extraction from pcaps |
| **Web** | Burp Suite Community, browser DevTools, `curl`, `ffuf` or `gobuster`, `jwt.io` | Burp Community includes Proxy and Repeater (no automated scanner; Intruder is rate-limited). DevTools is underrated — most easy web challenges are solved in the Network and Application tabs. Directory enumeration tools run **against in-scope targets only**. `jwt.io` is a *hosted* decoder — fine for CTF tokens, never for a real session or API token; decode those in CyberChef offline |
| **Crypto** | CyberChef, Python + `pycryptodome`, `openssl`, `hashcat` or `john`, dcode.fr | CyberChef for classical ciphers and encodings; Python for anything involving modular arithmetic; hashcat/john **only on hashes from CTF challenges or your own systems** |
| **OSINT** | Search operators, Wayback Machine, `exiftool`, `whois`, `crt.sh`, reverse image search | `crt.sh` (certificate transparency) reveals subdomains; `exiftool` extracts GPS/device data from images; Wayback recovers deleted pages. **Ethics: OSINT on real people has real consequences — stay on CTF-provided targets, and treat "it's public" as insufficient justification** |
| **Reversing** | **Ghidra**, `objdump`, `strings`, `ltrace`/`strace`, dnSpy/ILSpy (.NET) | **Ghidra** (free, NSA-developed) has a decompiler that produces readable C-like pseudocode — it is the reason reversing is now approachable without a paid IDA licence. Start with `strings` and `file`, then Ghidra's decompiler view. `strace`/`ltrace` show syscalls/library calls at runtime |
| **Pwn (concept level)** | `checksec`, `gdb` + pwndbg/GEF, pwntools | Learn what `checksec` *reports* — NX, ASLR/PIE, stack canaries, RELRO — and why each mitigation exists. As a defender, understanding the mitigations matters far more than writing exploits |

Quick install on a Debian-based analyst VM:

```bash
sudo apt update
sudo apt install -y binwalk libimage-exiftool-perl foremost tcpdump wireshark curl jq \
  python3-pip ltrace strace binutils steghide
# Note: the Debian/Kali package is libimage-exiftool-perl — `apt install exiftool` does not
# exist and will fail. The binary it installs is still called `exiftool`.
# Ghidra: install via apt on Kali (`sudo apt install ghidra`) or download the release from
# ghidra-sre.org. Needs a JDK.
# CyberChef: download the release ZIP and open index.html locally — no internet needed,
# and nothing you paste leaves your machine. Prefer this to the hosted version for
# anything sensitive.
```

**One habit worth more than any tool:** on any unknown file, run `file`, then `strings | less`, then `exiftool`, then `binwalk` — in that order — before anything clever. A surprising share of forensics challenges end at step two, and the same reflex applies to real triage.

---

## 8) First 8 Weeks

Concrete plan at ~4 hours/week. Adjust, don't skip.

| Week | Platform | Focus | Deliverable |
|---|---|---|---|
| 1 | picoCTF (picoGym) | General Skills — get comfortable with the interface and the CLI | 2 solves, 1 write-up |
| 2 | picoCTF | Forensics — `file`, `strings`, `binwalk`, `exiftool` | 2 solves, 1 write-up |
| 3 | picoCTF | Web — DevTools, cookies, hidden fields | 2 solves, 1 write-up |
| 4 | TryHackMe (free) | Beginner path; set up the VPN/AttackBox workflow | 1 room, 1 write-up |
| 5 | TryHackMe | Wireshark / network analysis rooms | 1 room + replay **EX-01** in your home lab |
| 6 | TryHackMe + lab | Sysmon and Windows event log rooms | 1 room + **EX-03** in your home lab, with a detection query |
| 7 | HTB Starting Point | The guided on-ramp to unguided machines | 1 machine, 1 write-up |
| 8 | CyberDefenders or malware-traffic-analysis.net | A full defensive pcap/DFIR investigation | 1 investigation write-up |

**End of week 8 you should have:** 8 write-ups, a working home lab, at least one detection query you wrote yourself, and a portfolio README worth linking on a resume. That is more hands-on evidence than most CS graduates present at interview.

---

## 9) Common Beginner Mistakes

| Mistake | Correction |
|---|---|
| Practising techniques outside authorized platforms | The authorization is the entire point of a CTF. Outside it, it's an offence — see the scope statement at the top |
| Following walkthroughs without attempting first | Attempt 45 minutes, then hint, then finish yourself, then re-solve in a week |
| No write-ups | You're generating no evidence and retaining little. One per week |
| Jumping straight to HTB | Do picoCTF → THM → HTB Starting Point. The skipped rungs are where the fundamentals live |
| Believing CTF skill = job readiness | CTFs are one input. Pair them with the lab, secure-coding work, and fundamentals |
| Grinding pwn as a defender | Concepts yes, grinding no. Forensics and web pay off far sooner for your target roles |
| Solo-ing everything | Join a team or a college club. Retention and learning rate both roughly double |
| Ignoring the blue-team question | "How would I detect this?" is the field that makes your write-ups worth reading |

---

## 10) Cross-References

| File | Use it for |
|---|---|
| `Home-Lab-Setup-Guide.md` | Your own authorized targets; replay CTF techniques and detect them |
| `Cybersecurity-Career-Roadmap.md` | Where write-ups sit in the portfolio; how this feeds applications |
| `Web-Security-Checklist-OWASP.md` | The defensive answer to every web-category challenge |
| `Linux-Security-Cheat-Sheet.md` | Hardening and investigation on Linux |
| `Incident-Response-Playbook.md` | Structure for forensics-category write-ups |
| `01-Obsidian-Vault/00-Indexes/Cybersecurity-Index.md` | Turn each technique learned into a permanent concept note |

**The loop, end to end:** solve a challenge → write it up with the blue-team section → reproduce the technique in your own lab → write a detection for it → commit both to the portfolio → note the concept in the vault. That loop, run weekly for a year, is a defensible security education.
