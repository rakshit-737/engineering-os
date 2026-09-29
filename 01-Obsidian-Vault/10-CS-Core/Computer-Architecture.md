---
title: Computer Architecture
description: "Subject hub: ISA, datapath, pipelining, caches, memory hierarchy, and why hardware shapes software performance."
domain: cs-core
category: computer-architecture
type: index
difficulty: intermediate
status: evergreen
tags: [cs-core, computer-architecture, hardware]
prerequisites: [Big-O-Notation]
related: [CPU-Caches-and-Memory-Hierarchy, Pipelining-and-Branch-Prediction, Operating-Systems, Compilers-and-Interpreters]
---

# Computer Architecture

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

A CPU executes a stream of instructions defined by its **instruction set architecture (ISA)** — the contract between software and hardware. Everything below the ISA (pipelines, caches, branch predictors, out-of-order execution) exists to run that stream faster without changing its meaning. Most real-world performance surprises come from two places: **memory access patterns** (caches) and **control flow** (branch prediction).

## Roadmap

1. Data representation — two's complement, IEEE 754 floating point, endianness
2. ISA — registers, load/store vs register-memory, RISC vs CISC, calling conventions
3. Single-cycle datapath → multi-cycle → pipelined datapath
4. [[Pipelining-and-Branch-Prediction]] — hazards, forwarding, stalls, speculation
5. [[CPU-Caches-and-Memory-Hierarchy]] — locality, cache organization, coherence
6. Virtual memory hardware — MMU, TLB (with [[Virtual-Memory-and-Paging]])
7. Parallelism — superscalar, SIMD, multicore, GPUs
8. Capstone: explain why iterating a 2-D array row-major vs column-major can differ by a large factor, and measure it

## Key Concepts

| Concept | One-line meaning |
|---|---|
| ISA | Instructions, registers, and memory model visible to software (x86-64, ARM64, RISC-V) |
| CPI / IPC | Cycles per instruction / instructions per cycle |
| Iron law | CPU time = instructions × CPI × clock period |
| Pipelining | Overlap stages of consecutive instructions to raise throughput |
| Hazard | Structural, data, or control condition that forces a stall |
| Locality | Temporal (reuse soon) and spatial (neighbors soon) |
| Cache line | Unit of transfer between cache levels, commonly 64 bytes on x86-64 |
| Coherence | Keeping per-core caches consistent (e.g. MESI protocol) |
| Amdahl's law | Speedup ≤ 1 / ((1 − p) + p/s) for a fraction p sped up by s |

```mermaid
flowchart LR
  R[Registers] --> L1[L1 cache]
  L1 --> L2[L2 cache]
  L2 --> L3[Shared L3]
  L3 --> RAM[DRAM]
  RAM --> SSD[SSD / disk]
```

Faster and smaller on the left; larger and slower to the right.

## Notes

- [[CPU-Caches-and-Memory-Hierarchy]]
- [[Pipelining-and-Branch-Prediction]]
- Related systems notes: [[Virtual-Memory-and-Paging]], [[Arrays-vs-Linked-Lists]] (why contiguous memory wins)

## Interview Questions (with answers)

- **RISC vs CISC?** — RISC uses a small set of fixed-length, simple instructions and load/store memory access, which is easy to pipeline. CISC has variable-length, complex instructions; modern x86 decodes them into RISC-like micro-ops internally, so the distinction matters mostly at the ISA level.
- **Why does pipelining improve throughput but not latency?** — Each instruction still passes through every stage; the pipeline just starts a new instruction every cycle, so completions per unit time rise.
- **What is false sharing?** — Two cores write different variables that live on the same cache line; coherence forces the line to bounce between cores. Fix: pad or align per-thread data to separate lines.
- **Explain Amdahl's law with an example.** — If 90% of a program parallelizes perfectly, the maximum speedup with infinite cores is 1 / 0.1 = 10×.
- **Little vs big endian?** — Little-endian stores the least significant byte at the lowest address (x86, most ARM configurations); big-endian stores the most significant byte first (network byte order).
- **Why is `0.1 + 0.2 != 0.3` in floating point?** — 0.1 and 0.2 have no exact binary representation, so rounding errors accumulate; compare with a tolerance or use decimal types for money.

## Coding Exercises

- [ ] Time row-major vs column-major traversal of a large 2-D array in C/C++ or Java
- [ ] Sum an array with and without a data-dependent branch on sorted vs shuffled input; explain the difference with branch prediction
- [ ] Demonstrate false sharing with two threads incrementing adjacent counters, then fix with padding
- [ ] Write a function that detects the machine's endianness
- [ ] Hand-trace a 5-stage pipeline for a short instruction sequence with a load-use hazard

## Connections

- **System design** — data layout (columnar stores, arrays of structs vs structs of arrays), batching, and avoiding pointer-chasing are architecture-aware design choices; NUMA affects large servers.
- **Cybersecurity** — Spectre and Meltdown exploit speculative execution and cache timing side channels; Rowhammer abuses DRAM physics; constant-time crypto code avoids secret-dependent branches and memory accesses. See [[Applied-Cryptography]] and [[Memory-Safety]].
- **AI** — deep learning performance is dominated by memory bandwidth and matrix-multiply throughput; GPUs/TPUs trade branch-heavy flexibility for massive SIMD/SIMT parallelism; the roofline model explains whether a kernel is compute- or memory-bound.

## Related

- [[Operating-Systems]]
- [[Compilers-and-Interpreters]]
- [[Concurrency-Basics]]
