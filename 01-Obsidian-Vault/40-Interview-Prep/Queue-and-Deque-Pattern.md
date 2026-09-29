---
title: Queue and Deque Pattern
description: FIFO queues drive BFS and scheduling; monotonic deques give O(1) window max/min.
domain: dsa
category: queue-deque
type: pattern
difficulty: intermediate
status: evergreen
tags: [queue, deque, monotonic-queue, bfs]
prerequisites: [Stack-and-Monotonic-Stack-Pattern]
related: [BFS-DFS-Pattern, Sliding-Window-Pattern, Shortest-Path-Pattern]
---

# Queue and Deque Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

A queue processes items in arrival order — exactly what level-by-level exploration (BFS), task scheduling and stream buffering need. A deque (double-ended queue) adds O(1) operations at both ends, which enables two powerful tricks: the **monotonic deque** (sliding window max/min in O(n)) and **0-1 BFS** (push weight-0 edges to the front, weight-1 edges to the back).

## Details

**Recognition cues:**
- "Minimum steps / levels / spreading over time" -> BFS with a queue (multi-source if many starts).
- "Max/min of every window of size k" -> monotonic deque of indices.
- "Shortest path where edge weights are 0 or 1" -> 0-1 BFS with a deque.
- "Recent requests in the last T seconds", rate limiting -> queue evicting stale timestamps.
- "Design a circular buffer" -> fixed array with head/tail modulo capacity.

**Template - monotonic deque (window maximum):**

```python
from collections import deque
def window_max(a, k):
    dq, out = deque(), []            # indices, values decreasing
    for i, x in enumerate(a):
        if dq and dq[0] <= i - k:    # front fell out of the window
            dq.popleft()
        while dq and a[dq[-1]] <= x: # dominated elements never win again
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            out.append(a[dq[0]])
    return out
```

**Template - BFS by levels:**

```python
q = deque(sources); steps = 0
while q:
    for _ in range(len(q)):
        u = q.popleft()
        # expand neighbours, mark visited when ENQUEUED
    steps += 1
```

**Complexity:** O(1) per queue/deque operation; monotonic deque O(n) total; BFS O(V + E).

**Classic traps:**
- Python `list.pop(0)` is O(n) — use `collections.deque`.
- Marking BFS nodes visited when dequeued (duplicates flood the queue).
- Java `LinkedList` vs `ArrayDeque`: prefer `ArrayDeque` (no nulls allowed, faster).

## Interview Angle

- Queue from two stacks and stack from queues are common warm-ups: know the amortized O(1) argument.
- For window max, mention the heap alternative (O(n log n)) and why the deque wins.

## Practice Problems

- [[Sliding-Window-Maximum]]
- [[Implement-Queue-using-Stacks]]
- [[Rotting-Oranges]]
- [[Binary-Tree-Level-Order-Traversal]]

## Related

- [[BFS-DFS-Pattern]]
- [[Sliding-Window-Pattern]]
- [[Shortest-Path-Pattern]]
