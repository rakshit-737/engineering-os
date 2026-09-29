---
title: Shortest Path Pattern
description: Choose BFS, 0-1 BFS, Dijkstra or Bellman-Ford based on edge weights and constraints.
domain: dsa
category: shortest-path
type: pattern
difficulty: advanced
status: evergreen
tags: [graphs, dijkstra, bellman-ford, bfs]
prerequisites: [BFS-DFS-Pattern, Heap-Pattern]
related: [BFS-DFS-Pattern, Queue-and-Deque-Pattern, Union-Find-Pattern, DP-Pattern]
---

# Shortest Path Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

The algorithm is chosen by the **edge weights**, not by the problem story:

| Weights | Algorithm | Time |
|---|---|---|
| All equal (unweighted) | BFS | O(V + E) |
| Only 0 or 1 | 0-1 BFS (deque) | O(V + E) |
| Non-negative | Dijkstra (min-heap) | O(E log V) |
| Negative allowed, or "at most k edges" | Bellman-Ford | O(V * E) or O(k * E) |
| All pairs, small V | Floyd-Warshall | O(V^3) |

All of them repeatedly **relax** edges: if `dist[u] + w < dist[v]`, improve `dist[v]`.

## Details

**Recognition cues:**
- "Minimum cost / time / effort to reach" with weights -> Dijkstra.
- "Minimum moves" on a grid or word graph -> BFS.
- "Free moves vs paid moves" (e.g. follow arrow free, change arrow costs 1) -> 0-1 BFS.
- "With at most k stops" or negative edges -> Bellman-Ford with k+1 rounds.
- "Minimize the maximum edge on a path" -> modified Dijkstra (max instead of sum) or binary search + BFS.

**Template - Dijkstra with lazy deletion:**

```python
import heapq
def dijkstra(graph, src, n):
    dist = [float("inf")] * n
    dist[src] = 0
    heap = [(0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue                  # stale entry
        for v, w in graph[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(heap, (dist[v], v))
    return dist
```

**Template - 0-1 BFS:**

```python
from collections import deque
dq = deque([src]); dist[src] = 0
while dq:
    u = dq.popleft()
    for v, w in graph[u]:
        if dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
            dq.appendleft(v) if w == 0 else dq.append(v)
```

**Template - Bellman-Ford limited to k edges:** repeat k times: copy `dist` into `tmp`, relax every edge reading from `dist` and writing to `tmp`, then `dist = tmp`. The copy prevents chaining several edges in one round.

**Why Dijkstra fails with negative edges:** it finalizes a node when popped, assuming no later path can be cheaper; a negative edge breaks that assumption.

**Classic traps:**
- Using Dijkstra when the path length is also constrained (stops) — state must include the constraint.
- Infinity overflow (`INT_MAX + w`) in Java/C++.
- Forgetting the stale-entry check (still correct but can blow up time).

## Interview Angle

- Say which algorithm and why, citing the weight constraint, before writing code.
- Be ready to extend state: `(node, stops)`, `(node, keys_collected)` — shortest path on an expanded graph.

## Practice Problems

- [[Network-Delay-Time]]
- [[Cheapest-Flights-Within-K-Stops]]
- [[Rotting-Oranges]] (unweighted BFS)

## Related

- [[BFS-DFS-Pattern]]
- [[Heap-Pattern]]
- [[Queue-and-Deque-Pattern]]
- [[Graph-Traversal-BFS-DFS]]
