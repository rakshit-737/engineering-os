---
title: Operating Systems
description: "Subject hub: processes, threads, scheduling, synchronization, memory, file systems."
domain: cs-core
category: operating-systems
type: index
difficulty: intermediate
status: evergreen
tags: [cs-core, operating-systems]
prerequisites: []
related: [Processes-and-Threads, CPU-Scheduling, Virtual-Memory-and-Paging, Deadlocks]
---

# Operating Systems

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

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

## Roadmap

1. [[Processes-and-Threads]] — address spaces, PCB, fork/exec, user vs kernel threads
2. [[CPU-Scheduling]] — FCFS, SJF, RR, MLFQ, CFS/EEVDF; metrics (turnaround, response, throughput)
3. [[Synchronization-Primitives]] — races, mutexes, semaphores, condition variables, atomics
4. [[Deadlocks]] — Coffman conditions, lock ordering, Banker's algorithm, detection
5. [[Virtual-Memory-and-Paging]] — page tables, TLB, page faults, replacement (LRU, Clock)
6. [[File-Systems]] — inodes, directories, journaling, page cache, fsync
7. Capstone: explain `fork()` + copy-on-write + `exec()` end to end, then write a bounded producer-consumer queue

## Key Concepts

Kernel vs user mode · syscall trap · context switch · PCB · copy-on-write · critical section · spurious wakeup · priority inversion · thrashing · working set · inode · journaling · memory-mapped files

## More Interview Questions (with answers)

- **What happens on `fork()`?** — The kernel creates a child with a copy of the parent's PCB and a *copy-on-write* mapping of its pages: both share physical pages marked read-only, and a write triggers a fault that copies just that page. `fork()` returns the child PID to the parent and 0 to the child.
- **Mutex vs semaphore?** — A mutex has an owner and protects a critical section (lock/unlock by the same thread). A counting semaphore is a counter of available units with no owner; it is used for signaling and resource pools.
- **What is thrashing?** — The combined working sets exceed physical RAM, so the system spends most of its time servicing page faults. Fix: reduce multiprogramming, add RAM, improve locality.
- **Can a single-threaded program deadlock?** — Yes: re-acquiring a non-reentrant lock it already holds, or blocking on a pipe/condition that only it would ever signal.
- **What does `fsync` guarantee?** — That the file's written data and metadata have been pushed to stable storage (as far as the device honors flushes); `write()` alone only reaches the page cache.

## Coding Exercises

- [ ] Bounded blocking queue with one mutex + two condition variables (Python `threading`, Java `ReentrantLock`, or C++ `std::condition_variable`)
- [ ] Dining philosophers without deadlock (resource ordering)
- [ ] Simulate FCFS / SJF / RR on a job list and compute average waiting time
- [ ] LRU page-replacement simulator; count faults for a reference string and compare with FIFO (reproduce Belady's anomaly with `1 2 3 4 1 2 5 1 2 3 4 5` at 3 vs 4 frames)
- [ ] Mini shell: `fork` + `execvp` + `waitpid`, with one pipe

## Connections

- **System design** — thread pools, connection pools, and async event loops are scheduling decisions made in user space; `fsync` semantics decide database durability; memory limits and the OOM killer shape container sizing.
- **Cybersecurity** — privilege separation relies on process isolation and kernel/user mode; ASLR and NX are virtual-memory features; TOCTOU races are synchronization bugs with security impact. See [[Memory-Safety]] and [[Least-Privilege]].
- **AI** — data loaders use multiple processes to sidestep Python's GIL; model weights are often `mmap`-ed so pages load lazily; out-of-memory errors from oversized batches are a memory-management story.

## Related

- [[Concurrency-Basics]]
- [[Hash-Tables]]
- [[Recursion-and-Stack-Frames]]
- [[Computer-Networks]]
- [[Distributed-Systems]]
