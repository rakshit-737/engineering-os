---
title: Interview CS Fundamentals Questions
description: Concise, accurate answers to frequently asked OS, networking, DBMS and OOP interview questions.
domain: career
category: interviews
type: cheatsheet
difficulty: intermediate
status: evergreen
tags: [os, networks, dbms, oop]
related: [Operating-Systems, Computer-Networks, DBMS, OOP-Concepts]
order: 20
---

# Interview CS Fundamentals Questions

Short answers to say out loud; go deeper in the linked notes. If a follow-up goes past what you know, say so and reason from first principles.

## Operating systems ([[Operating-Systems]], [[Concurrency-Basics]])

**Process vs thread?** A process has its own address space and resources; threads are execution units inside a process sharing its memory and file descriptors but each with its own stack and registers. Threads are cheaper to create/switch; a bug in one thread can corrupt the whole process.

**What happens on a context switch?** The kernel saves the running task's CPU state (registers, program counter, stack pointer) and restores another's. Switching between processes also changes the address space, which can require TLB flushes, making it costlier than thread switches.

**Deadlock conditions?** Mutual exclusion, hold and wait, no preemption, circular wait -- all four must hold. Prevent by breaking one, e.g. acquiring locks in a global order.

**Mutex vs semaphore?** A mutex is a lock with ownership: the holder unlocks it. A counting semaphore allows up to N concurrent holders and can be signaled by any thread, so it is also used for signaling.

**Virtual memory / paging?** Each process sees a private virtual address space; the MMU translates pages to physical frames via page tables, with the TLB caching translations. A page fault occurs when a page is not resident; the OS loads it from disk (or kills the process on an invalid access).

**Thrashing?** The working sets of running processes exceed physical memory, so the system spends most time paging. Fix: reduce multiprogramming or add memory.

**User mode vs kernel mode / system call?** Privileged instructions run only in kernel mode. A system call is a controlled trap from user to kernel mode to request a service (e.g. `read`, `fork`).

**Scheduling algorithms?** FCFS, SJF (optimal average wait if burst times known), round robin (time slices, good response), priority (risk of starvation, fixed by aging), multilevel feedback queues.

## Computer networks ([[Computer-Networks]], [[TLS-Handshake]])

**What happens when you type a URL?** DNS resolution -> TCP connection (3-way handshake) -> TLS handshake for HTTPS -> HTTP request -> server response -> browser parses HTML and fetches sub-resources -> render.

**TCP vs UDP?** TCP: connection-oriented, reliable, ordered, flow and congestion control. UDP: connectionless, no delivery guarantees, lower overhead -- used for DNS queries, streaming, games, and as the base of QUIC.

**TCP 3-way handshake?** SYN -> SYN-ACK -> ACK, synchronizing initial sequence numbers. Teardown uses FIN/ACK in each direction.

**OSI vs TCP/IP?** OSI has 7 layers (physical, data link, network, transport, session, presentation, application); TCP/IP collapses them to roughly link, internet, transport, application.

**HTTP/1.1 vs HTTP/2 vs HTTP/3?** 1.1: text, one outstanding request per connection in practice. 2: binary framing, multiplexed streams over one TCP connection, header compression. 3: runs over QUIC (UDP), avoiding TCP head-of-line blocking across streams.

**DNS resolution?** Stub resolver -> recursive resolver -> root -> TLD -> authoritative server; answers are cached per TTL.

**Subnetting / CIDR?** `/24` means 24 network bits, leaving 256 addresses (254 usable hosts in classic IPv4 subnets).

## DBMS ([[DBMS]], [[SQL-Cheat-Sheet]])

**ACID?** Atomicity (all or nothing), Consistency (constraints hold), Isolation (concurrent transactions do not interfere beyond the chosen level), Durability (committed data survives crashes, typically via a write-ahead log).

**Isolation levels and anomalies?** Read uncommitted (dirty reads), read committed (prevents dirty reads), repeatable read (prevents non-repeatable reads), serializable (prevents phantoms as well). Exact behavior varies by engine.

**Normalization?** 1NF atomic values; 2NF no partial dependency on a composite key; 3NF no transitive dependency on the key; BCNF every determinant is a candidate key. Denormalize deliberately for read performance.

**Indexes?** Usually B+ trees: speed up reads/range scans at the cost of extra storage and slower writes. Hash indexes suit equality lookups. A composite index is used left-to-right by its column order.

**SQL vs NoSQL?** Relational: schema, joins, strong transactional guarantees. NoSQL families (key-value, document, wide-column, graph) trade some of that for flexible schema or horizontal scale. Choose by access patterns and consistency needs.

**Clustered vs non-clustered index?** Clustered determines the physical order of rows (one per table); non-clustered is a separate structure pointing to rows.

## OOP ([[OOP-Concepts]], [[Java-Interview-Essentials]], [[Cpp-Interview-Essentials]])

**Four pillars?** Encapsulation, abstraction, inheritance, polymorphism.

**Overloading vs overriding?** Overloading: same name, different parameters, resolved at compile time. Overriding: subclass redefines a base method with the same signature, resolved at runtime (dynamic dispatch).

**Abstract class vs interface?** Abstract class can hold state and constructors and allows single inheritance (in Java); an interface defines a contract a class can implement many of (Java interfaces can have default methods).

**Composition vs inheritance?** Prefer composition ("has-a") for flexibility; inheritance ("is-a") couples subclass to base implementation.

**SOLID?** Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion.

**Virtual functions in C++?** Dispatch through a vtable at runtime; a base class used polymorphically needs a virtual destructor.
