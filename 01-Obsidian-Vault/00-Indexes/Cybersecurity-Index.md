# Cybersecurity Index

Hub for security knowledge. House rule: every note pairs a concept with a **defense** and, where possible, runnable code or a lab reference. Attack knowledge is context for defense, practiced only in authorized labs/CTFs.

## Seed Notes (exist — fill their Details sections)

**Principles**
- [[CIA-Triad]] — the frame for every security answer
- [[Least-Privilege]] — the principle behind most controls
- [[Authentication-vs-Authorization]] — the distinction interviews probe

**Web & Application**
- [[OWASP-Top-10]] — the risk taxonomy
- [[SQL-Injection]] — runnable defense in Secure-Coding-Examples
- [[XSS]] — attacks users, not the datastore

**Crypto & Transport**
- [[TLS-Handshake]] — what HTTPS actually negotiates
- [[Hashing-vs-Encryption]] — one-way vs reversible, and when each applies

**Operations**
- [[Threat-Modeling-STRIDE]] — systematic threat enumeration
- [[Incident-Response-Lifecycle]] — NIST 800-61 phases

**Defense in Depth**
- [[Network-Security]] — segmentation, firewalls, IDS/IPS
- [[Cloud-Security]] — IAM, shared responsibility, metadata endpoints
- [[Memory-Safety]] — buffer overflows, why Rust/bounds-checking exist
- [[Malware-Analysis-Basics]] — static/dynamic triage (lab only)
- [[Security-Logging-and-Detection]] — what to log, what to alert on

**Specialist Foundations**
- [[Applied-Cryptography]] — symmetric/asymmetric, signatures, key exchange, common misuse
- [[Reverse-Engineering-Basics]] — disassembly, debugging, CTF workflow (lab only)

## Planned Notes (create with Concept-Note-Template when studied)

- [[Active-Directory-Security]] — Kerberos, common attack paths, hardening
- [[Digital-Forensics-Basics]] — evidence handling, disk/memory analysis workflow

## Toolkit Companions

Career package in `06-Cybersecurity-Toolkit/`:
- **Start here**: `Cybersecurity-Career-Roadmap.md` — roles, certs, 12-month plan, portfolio
- **Practice**: `Home-Lab-Setup-Guide.md`, `CTF-Getting-Started-Guide.md`
- **Job one**: `SOC-Analyst-Playbook.md`, `Security-Interview-Questions.md`
- **Reference sheets**: Linux, Windows, network traffic analysis, ports/protocols, OWASP checklist
- **Process**: `Incident-Response-Playbook.md`, `Threat-Model-Template.md`
- Runnable defensive patterns: `11-Project-Templates/Secure-Coding-Examples/` — 5 self-verifying scripts + `03-Coding-Library/python/src/algos/security_utils.py`
- Lab practice: TryHackMe / HackTheBox / picoCTF — always in-scope targets only

## Practice Loop (per vulnerability class)

1. Understand the mechanism → note with Details filled
2. Reproduce in an authorized lab (never on real targets)
3. Write the defense: code pattern or configuration
4. Add detection: what log line / alert would catch this?
5. Map it to [[OWASP-Top-10]] and [[Threat-Modeling-STRIDE]] categories

Back to [[Home]]
