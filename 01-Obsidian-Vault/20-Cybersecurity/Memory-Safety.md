---
title: "Memory Safety"
description: "Memory-corruption bug classes and why memory-safe languages matter."
domain: cybersecurity
category: fundamentals
type: concept
difficulty: intermediate
status: evergreen
tags: [cybersecurity, memory, exploitation]
prerequisites: []
related: []
order: 10
---

# Memory Safety

Hub: [[Cybersecurity-Index]] | Engineering OS: [[Security-Engineering-OS]]

> See Exploitation Fundamentals for how memory-corruption bugs are exploited in principle and how ASLR/DEP/canaries mitigate them.

## Core Idea

A memory-safety bug lets a program read or write memory it was never meant to touch. In languages like C/C++ that don't enforce bounds, a buffer overflow can overwrite adjacent data — including the saved return address that controls where execution goes next — turning a data-handling bug into attacker-controlled code execution. Decades of defense have layered mitigations (canaries, DEP/NX, ASLR) on top of unsafe code, but the durable fix is memory-safe languages, which is why security bodies now recommend Rust/Go/Java-class languages for new systems code.

## Details

**Mechanism — stack buffer overflow at concept level**
- A function call pushes a stack frame: local variables (buffers included), the saved frame pointer, and the *return address* — where the CPU jumps when the function returns.
- `strcpy(buf, input)` with no length check writes past the end of `buf` when input is longer. On a typical downward-growing stack, the overflow runs toward the saved frame pointer and return address.
- Overwriting the return address means that when the function returns, execution resumes at an attacker-chosen location instead of the caller. Same family: heap overflows, use-after-free (using freed memory that now holds something else), and out-of-bounds *reads* that leak secrets.
- The root cause is always the same: the language trusted the programmer to respect buffer bounds, and the code didn't.

**Why it matters**
- Historic proof: the 1988 Morris worm spread partly via a buffer overflow in `fingerd`; SQL Slammer (2003) and Code Red (2001) were overflow-driven worms that saturated the internet in hours; Heartbleed (2014) was an out-of-bounds *read* leaking private keys from OpenSSL.
- Ongoing scale: Microsoft and Google have each reported that roughly 70% of their serious security bugs are memory-safety issues. CWE classes to recognize: CWE-119/787 (out-of-bounds write), CWE-125 (out-of-bounds read), CWE-416 (use-after-free).
- Consequence class: remote code execution — the worst outcome on the severity ladder.

**Defenses (mitigation stack for unsafe code)**
| Defense | What it does | What it costs the attacker |
|---|---|---|
| Stack canary | Random value placed before the return address; checked at return — overflow corrupts it and the process aborts | Must leak or avoid the canary |
| DEP/NX | Marks data pages (stack/heap) non-executable | Can't just jump to injected shellcode; must reuse existing code (ROP) |
| ASLR | Randomizes load addresses of stack, heap, libraries each run | Needs an info leak to find addresses before redirecting execution |
| Bounds checking | Language/runtime verifies every access is in-bounds | Removes the bug class entirely where applied |

- These compose: each mitigation forces the attacker to chain additional bugs (a leak + an overflow), raising exploit cost — defense in depth, not a cure. Modern exploits routinely defeat any one layer alone.

**Memory-safe languages**
- Rust in one paragraph: every value has a single owner; references borrow it either as one mutable reference or many immutable ones, never both; the compiler tracks lifetimes so no reference can outlive the memory it points to. The result is C-class performance with buffer overflows, use-after-free, and data races rejected *at compile time* rather than caught (or missed) at runtime. Java/Go/Python get safety via runtime bounds checks and garbage collection instead.
- Policy reality: CISA/NSA guidance and major vendors now push memory-safe languages for new code; Rust is in the Linux kernel, Android, and Windows components.

**Hardening existing C/C++**
- Compile-time: `_FORTIFY_SOURCE` (bounds-checked libc variants), stack protector on, PIE + full RELRO so ASLR applies everywhere.
- Test-time: AddressSanitizer (ASan) and friends catch out-of-bounds and use-after-free in tests; pair with fuzzing so malformed inputs hit the parser before attackers do.
- Code-level: banned-function lists (`gets`, bare `strcpy`), `strlcpy`/`snprintf`-style bounded APIs, code review focus on any manual length arithmetic.
- Detection side: a canary abort or ASan crash in production telemetry is a signal worth triaging as a possible exploitation attempt — route it into [[Security-Logging-and-Detection]].

## Interview Angle

- "Explain a buffer overflow" wants the stack story: frame layout → unchecked copy → return address overwritten → control-flow hijack. Draw the frame; precision here is the whole question.
- Follow-up is almost always "how do we defend?" Give the layered trio — canaries (detect corruption), DEP/NX (data isn't code), ASLR (addresses unpredictable) — then land on memory-safe languages as the root-cause fix. Ordering answers as mitigate → eliminate shows maturity.
- "Why is Rust safe?" One line: ownership and borrowing let the compiler prove at compile time that no reference outlives its memory and no aliasing+mutation races exist — no GC needed.
- Know one number and one story: ~70% of severe vulns are memory safety (Microsoft/Google), and Heartbleed as the example that *reads* are dangerous too (confidentiality leg of [[CIA-Triad]], not just integrity).
- If asked "is C dead?": no — the answer is hardened toolchains and sanitizers for existing code, memory-safe languages for new attack-surface code.

## Related

- [[CIA-Triad]]
- [[OWASP-Top-10]]
- [[Threat-Modeling-STRIDE]]
- [[Security-Logging-and-Detection]]
- [[Cybersecurity-Index]]
