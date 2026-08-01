---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Concurrency Basics

Hub: [[CS-Core-Index]]

## Core Idea

Concurrency is structuring a program to make progress on multiple tasks at once; parallelism is actually executing them simultaneously on multiple cores. Threads share one address space (cheap communication, but every shared mutable variable needs synchronization), processes have isolated memory (safe but expensive to communicate), and async/event-loop code multiplexes many IO waits onto one thread. Pick the model from the workload: CPU-bound wants parallelism, IO-bound wants concurrency.

## Details

**The three models.**

| Model | Memory | Best for | Failure modes | Python tool |
|---|---|---|---|---|
| Threads | shared | IO-bound; shared state | races, deadlocks | `threading` |
| Processes | isolated | CPU-bound | IPC/serialization cost | `multiprocessing` |
| Async | shared, 1 thread | many concurrent IO waits | blocking call stalls everything | `asyncio` |

**Race condition.** Two threads run `counter += 1`, which is really read-modify-write. Interleaving: both read 5, both write 6 — one increment lost. Fix with a mutex (lock) making the critical section atomic:

```python
lock = threading.Lock()
def increment():
    with lock:            # only one thread inside at a time
        global counter
        counter += 1
```

**Deadlock.** Thread A holds lock 1 and waits for lock 2; thread B holds 2 and waits for 1. Requires four conditions simultaneously (mutual exclusion, hold-and-wait, no preemption, circular wait); break any one. Practical fix: every thread acquires locks in the same global order, or use timeouts.

**The GIL.** CPython's Global Interpreter Lock lets only one thread execute Python bytecode at a time. So Python threads give zero speedup on CPU-bound code — use `multiprocessing` (or C extensions/NumPy, which release the GIL) for that. Threads are still fine for IO-bound work because the GIL is released during blocking IO. Note: the GIL does NOT make compound operations like `+=` atomic — you still need locks.

**False sharing.** Two threads write to different variables that happen to sit on the same 64-byte cache line; the hardware cache-coherence protocol bounces the line between cores, and "independent" counters run many times slower. Fix by padding/aligning per-thread data. Classic reason parallel code scales worse than expected.

**Worked example.** Scraping 100 URLs: sequential = sum of all latencies (~100 x 200ms = 20s). With a thread pool or `asyncio.gather`, all requests wait concurrently: ~max latency, well under a second. Same task CPU-bound (parse 100 huge files) needs `ProcessPoolExecutor` to actually use multiple cores in Python.

**Other essentials.** Atomicity (indivisible operation), semaphores (allow N holders — e.g. cap concurrent connections), condition variables (wait until predicate holds), thread-safe queues (`queue.Queue`) for producer-consumer — often better than sharing raw state at all. "Don't communicate by sharing memory; share memory by communicating."

**Pitfalls recap.**
- Checking then acting without a lock (check-then-act race): `if key not in d: d[key] = ...` is not atomic.
- Holding a lock while doing IO or calling unknown code — invites deadlock and kills throughput; keep critical sections tiny.
- One blocking/CPU-heavy call inside an async event loop freezes every coroutine; offload with `run_in_executor`.
- Assuming the GIL makes code thread-safe — it only serializes bytecodes, not your compound operations.

## Interview Angle

- First words out of your mouth: classify the workload. "Is this CPU-bound or IO-bound?" drives every subsequent choice, and interviewers listen for it.
- Define race condition and deadlock precisely, with the lost-update interleaving as your example; know the four deadlock conditions and the lock-ordering fix.
- Python roles: explain the GIL crisply — what it serializes, why threads still help for IO, why it doesn't remove the need for locks.
- Concurrency vs parallelism one-liner: "concurrency is dealing with many things at once; parallelism is doing many things at once."
- Systems-savvy differentiators: mention false sharing, preferring message passing/queues over shared state, and immutability as the cheapest thread-safety strategy.

## Related

- [[Big-O-Notation]]
- [[Hash-Tables]]
- [[System-Design-Basics]]
- [[CS-Core-Index]]
