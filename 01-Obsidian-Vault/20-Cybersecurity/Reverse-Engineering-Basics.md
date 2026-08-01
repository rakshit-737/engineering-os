---
tags: [concept, cybersecurity]
created: 2026-08-02
status: evergreen
---

# Reverse Engineering Basics

Hub: [[Cybersecurity-Index]]

> All commands and workflows here are for analyzing your own binaries, authorized lab samples, and CTF challenges (picoCTF, TryHackMe, HackTheBox) — never software you lack permission to analyze.

## Core Idea

Reverse engineering is recovering what a program does without its source code. For defenders it answers concrete questions: is this attachment malware, what does this implant talk to, what did a vendor patch actually fix, and how does this CTF binary decide "correct flag." The skill is layered: cheap static looks (file type, strings) first, disassembly last — most triage questions die at the strings stage.

## Details

**Why defenders reverse engineer**
- Malware triage: classify a sample, extract IOCs (domains, IPs, mutexes, file paths) to feed detection — the deeper end of [[Malware-Analysis-Basics]].
- Patch diffing: compare pre/post-patch binaries to understand the fixed vulnerability, so you know what exploitation would look like and can prioritize patching.
- CTFs (rev category): the legal practice ground; picoCTF rev challenges are the standard on-ramp.
- Verifying software: does this "free tool" phone home? Does the firmware match the vendor's claims?

**Static vs dynamic analysis**

| | Static (don't run it) | Dynamic (run it, observe) |
|---|---|---|
| What you do | Inspect file type, strings, imports, disassembly | Debug, trace syscalls, watch network/file activity |
| Pros | Safe, sees all code paths | Sees actual behavior, defeats simple packing/obfuscation |
| Cons | Packers/obfuscation hide logic; slow | Only executed paths; malware may detect sandboxes; must be isolated |
| Rule | Always first | Only in an isolated lab VM |

**The toolbox (all free)**

| Tool | Job |
|---|---|
| `file` | Identify type: ELF/PE, 32/64-bit, stripped or not |
| `strings -n 8` | Printable strings: URLs, error messages, flag fragments |
| `binwalk` | Find files embedded inside firmware/blobs |
| `objdump -d` / `readelf` | Quick disassembly, headers, symbols |
| Ghidra | Full disassembler + decompiler (NSA, free) — the main workhorse; decompiler output reads like rough C |
| x64dbg (Windows) / `gdb` + pwndbg (Linux) | Debuggers: breakpoints, step through, inspect registers/memory |
| `ltrace` / `strace` (Linux) | Library and syscall traces — often reveals a strcmp against the flag |

**First-CTF workflow (rev challenge)**
1. `file challenge` — what am I holding? (ELF x86-64, not stripped = easy mode)
2. `strings -n 8 challenge` — look for the flag format (`picoCTF{`), passwords, hints. Many beginner challenges end here.
3. Run it in an isolated lab VM — observe prompts and outputs; try `ltrace ./challenge` to see comparisons.
4. Open in Ghidra → find `main` → read the decompiled C. Locate the branch that prints "correct" and work backward to the condition it checks.
5. If input is transformed (XOR, arithmetic) before comparison, invert the transform on the stored target bytes.

**Assembly-reading survival minimum (x86-64)**
- Registers: `rax` (return value), `rdi, rsi, rdx, rcx` (first args, System V), `rsp` (stack pointer), `rbp` (frame base), `rip` (next instruction).
- `call func` pushes return address and jumps; `ret` pops and returns; return value lands in `rax`.
- The pattern that decides everything: `cmp a, b` sets flags, then a conditional jump acts on them — `je` (equal), `jne`, `jg`, `jl`. Every "wrong password" message sits behind one `cmp`/`jxx` pair; find it and read what is compared.
- `mov` copies, `lea` computes addresses, `xor reg, reg` just zeroes a register. `test rax, rax` + `je` = "jump if result was zero/NULL."
- You do not need to write assembly — you need to recognize these five patterns while reading Ghidra's disassembly next to its decompilation.

**Lab-only safety rules (non-negotiable for anything untrusted)**
- Dedicated analysis VM (VirtualBox/VMware), snapshot taken *before* first execution; revert after every detonation.
- Network: host-only or fully disconnected. Never NAT to your real network — samples exfiltrate and spread.
- No shared folders/clipboard with the host while a sample runs; transfer samples in, zipped and password-protected (`infected` convention), never double-click on the host.
- Static analysis is safe anywhere; *running* an unknown binary is what requires the cage.

**Legal note**
Analyze only binaries you own, wrote, or are explicitly authorized to analyze — CTF challenges and lab platforms (TryHackMe/HTB/picoCTF) grant that authorization by design. EULAs may prohibit reverse engineering commercial software; interoperability and security-research exemptions exist in some jurisdictions but are narrow — as a student, stay inside CTFs, your own code, and open source, and the question never arises.

## Interview Angle

- "How would you approach an unknown binary?" Give the ladder: `file` → `strings` → imports → sandboxed dynamic run → Ghidra on interesting functions. Cheap evidence first; escalate only as needed. Structure impresses more than tool names.
- "Static vs dynamic analysis?" Reproduce the table; add the packing point — packed malware defeats static, so you unpack or go dynamic.
- "What can strings alone tell you?" URLs/IPs (C2 candidates), file paths, registry keys, embedded credentials, compiler artifacts — real triage signal before any disassembly.
- "How do you analyze malware safely?" Snapshot-isolated VM, no bridged network, revert after each run. Saying the safety rules unprompted signals you have actually done it.
- CTF experience is the credible proof: "I solved picoCTF rev challenges with Ghidra" beats listing tools you have not opened.

## Related

- [[Malware-Analysis-Basics]]
- [[Memory-Safety]]
- [[Security-Logging-and-Detection]]
- [[Incident-Response-Lifecycle]]
- [[Cybersecurity-Index]]
