---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Operating Systems

Hub: [[CS-Core-Index]]

## Core Idea

The OS multiplexes hardware (CPU, memory, I/O) across many programs while giving each the illusion of a private machine. Two mechanisms do most of the work: the process/thread abstraction plus scheduling for the CPU, and virtual memory for RAM. Everything a program asks of the kernel goes through syscalls.

## Details

### Processes vs Threads

| | Process | Thread |
|---|---|---|
| Address space | Own (isolated) | Shared with siblings |
| Contains | Code, heap, files, at least one thread | Stack, registers, program counter |
| Creation cost | Heavy (fork: copy page tables, COW) | Light |
| Failure blast radius | Contained | One bad thread can corrupt all |
| Communication | IPC (pipes, sockets, shared mem) | Plain shared variables + locks |

Rule of thumb: processes for isolation, threads for cheap parallelism within one program.

### Scheduling

- **Round-robin**: each runnable task gets a fixed time slice (quantum), then goes to the back of the queue. Fair, simple, good responsiveness; too-small quanta waste time on context switches.
- **Priority**: higher priority runs first; risk is starvation of low-priority tasks, fixed by aging (priority slowly rises while waiting). Priority inversion (low-prio task holds a lock a high-prio task needs) is fixed by priority inheritance.
- **CFS (Linux)**: picks the task with the least virtual runtime so far, tracked in a red-black tree — "fair share of CPU over time" rather than fixed slices. (Replaced by EEVDF in newer kernels, same fairness spirit.)

### Memory

- **Virtual memory**: each process sees a private, contiguous address space; the MMU translates virtual to physical addresses via page tables. Enables isolation, overcommit, and swapping.
- **Paging**: memory is split into fixed-size pages (typically 4 KB). A virtual address = page number + offset. Page not in RAM → page fault → kernel loads it from disk (or allocates it).
- **TLB**: a small cache of recent virtual→physical translations. A hit costs ~1 cycle; a miss forces a page-table walk (multiple memory accesses). This is why locality of reference matters for real performance, not just Big-O.

### Syscalls and Context Switches

- A **syscall** (read, write, mmap, fork...) traps from user mode into kernel mode. It is a controlled, privileged function call — the only legal way into the kernel.
- A **context switch** saves one task's registers and switches page tables to run another. Direct cost is microseconds; the hidden cost is trashed CPU caches and TLB entries. Too many threads → the machine spends its time switching, not working.

### Deadlock: the 4 Coffman Conditions

All four must hold simultaneously:

1. **Mutual exclusion** — resources are held exclusively.
2. **Hold and wait** — a task holds one resource while waiting for another.
3. **No preemption** — resources can't be forcibly taken away.
4. **Circular wait** — a cycle of tasks each waiting on the next.

Handling: **prevent** (break one condition — most practical: acquire locks in a global fixed order, killing circular wait), **avoid** (Banker's algorithm — rarely used), **detect and recover** (databases do this: find the cycle, abort a victim transaction), or **ignore** (the "ostrich algorithm" — most OSes, honestly).

## Interview Angle

- "Process vs thread?" — lead with address space isolation vs sharing, then cost, then failure isolation. Mention that threads share the heap but each has its own stack.
- "What happens on a context switch?" — save registers, switch page tables, restore other task's registers; mention cache/TLB pollution as the real cost.
- "What is virtual memory for?" — isolation between processes, more apparent memory than physical RAM, and simple linear addressing for programs.
- "How do you prevent deadlock?" — the expected answer is lock ordering; be ready to state all four Coffman conditions and which one ordering breaks.
- Scheduling questions usually probe tradeoffs: round-robin fairness vs context-switch overhead, priority vs starvation.

## Related

- [[Concurrency-Basics]]
- [[Hash-Tables]]
- [[Recursion-and-Stack-Frames]]
- [[Computer-Networks]]
- [[Distributed-Systems]]
