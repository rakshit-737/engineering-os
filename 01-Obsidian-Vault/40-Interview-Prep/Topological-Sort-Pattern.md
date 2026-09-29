---
title: Topological Sort Pattern
description: Order a DAG so every edge points forward, using Kahn's in-degree BFS or DFS post-order; detects cycles.
domain: dsa
category: topological-sort
type: pattern
difficulty: intermediate
status: evergreen
tags: [graphs, topological-sort, dag, cycle-detection]
prerequisites: [BFS-DFS-Pattern]
related: [BFS-DFS-Pattern, Union-Find-Pattern, DP-Pattern]
---

# Topological Sort Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

A topological order lists the nodes of a directed graph so that for every edge `u -> v`, `u` comes before `v`. It exists **iff the graph has no directed cycle**. Two standard algorithms:

- **Kahn's (BFS):** repeatedly take a node with in-degree 0, remove its outgoing edges. If fewer than V nodes get taken, there is a cycle.
- **DFS post-order:** a node is finished after all its descendants; reversed finish order is topological. A back edge to a node still "on the path" (gray) means a cycle.

## Details

**Recognition cues:**
- "Prerequisites", "dependencies", "build order", "task scheduling" -> topo sort.
- "Is it possible to finish / is there a cycle in a directed graph" -> Kahn's count check.
- "Alien dictionary" (derive letter order from sorted words) -> build edges, then topo sort.
- "Minimum semesters / parallel time" -> Kahn's processed by levels.
- "Longest path in a DAG" -> DP over topological order.

**Template - Kahn's algorithm:**

```python
from collections import deque
def topo_order(n, edges):            # edges: (u, v) meaning u before v
    graph = [[] for _ in range(n)]
    indeg = [0] * n
    for u, v in edges:
        graph[u].append(v)
        indeg[v] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == n else []   # [] means cycle
```

**Template - DFS with three colors:** 0 = unvisited, 1 = on current path, 2 = done. Visiting a color-1 node means a cycle; append on finish, reverse at the end.

**Complexity:** O(V + E) time and space for both.

**Classic traps:**
- Edge direction: `[a, b]` "a requires b" means the edge is `b -> a`.
- Two-state visited in directed DFS cannot detect cycles correctly.
- Undirected graphs do not have topological orders; cycle detection there is DSU or parent-aware DFS.
- Forgetting isolated nodes (they have in-degree 0 and must appear in the order).

## Interview Angle

- Prefer Kahn's in interviews: iterative (no recursion limit) and cycle detection is a single count comparison.
- For "lexicographically smallest order", swap the queue for a min-heap.

## Practice Problems

- [[Course-Schedule]]
- [[Course-Schedule-II]]

## Related

- [[BFS-DFS-Pattern]]
- [[Graph-Traversal-BFS-DFS]]
- [[DP-Pattern]]
