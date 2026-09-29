---
title: Union-Find Pattern
description: Disjoint set union with path compression and union by rank for near-constant connectivity queries.
domain: dsa
category: union-find
type: pattern
difficulty: intermediate
status: evergreen
tags: [graphs, dsu]
prerequisites: [BFS-DFS-Pattern]
related: [BFS-DFS-Pattern, Greedy-Pattern]
---

# Union-Find Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Disjoint Set Union (DSU) maintains a partition of elements into sets under two operations: `find(x)` (which set is x in?) and `union(x, y)` (merge their sets). With **path compression** (point every visited node straight at the root during find) and **union by rank** (attach the shorter tree under the taller), both operations run in amortized **O(α(n))** — inverse Ackermann, ≤ 4 for any realistic n, effectively constant.

## Details

Recognition cues:
- Dynamic connectivity: "are a and b connected?" as edges arrive incrementally
- Counting connected components without building an explicit graph
- Cycle detection in an **undirected** graph (union returns False → edge closes a cycle)
- Grouping by transitive equivalence (same account, same email, similar strings)

Full implementation:

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx == ry:
            return False                 # already connected — cycle if x-y is an edge
        if self.rank[rx] < self.rank[ry]:
            rx, ry = ry, rx
        self.parent[ry] = rx             # attach smaller rank under larger
        if self.rank[rx] == self.rank[ry]:
            self.rank[rx] += 1
        self.components -= 1
        return True
```

Classic problems:
- **Number of Provinces** — union every pair with `isConnected[i][j] == 1`; answer is `components`
- **Redundant Connection** — process edges in order; the first edge whose union returns False is the answer
- **Accounts Merge** — union emails within each account (map email → id), then group emails by root and sort
- Also: Kruskal's MST, number-of-islands variants with incremental additions

Complexity: O(α(n)) amortized per op after both optimizations; O(n) space. Path compression alone or union by rank alone gives O(log n) — still fine, but say "inverse Ackermann" for the pair.

vs BFS/DFS tradeoff: for a **static** graph given up front, [[BFS-DFS-Pattern]] finds components in the same O(V+E) and also gives paths, distances, and ordering. DSU wins when edges arrive **online** (answer connectivity between insertions), when you only need "same set?" and never the path, or when building adjacency lists is awkward (union by grid cell, by email string via an id map). DSU cannot answer "what is the path" and does not support edge deletion.

**The trap:** cycle detection with DSU is for undirected graphs only — directed cycle detection needs DFS colors or Kahn's algorithm. Also don't forget path compression: a skewed tree without it degrades find to O(n).

## Interview Angle

Trigger words: connected components, "merge accounts", "redundant edge", dynamic connectivity, "friend circles". Write the DSU class from memory in under two minutes — it's a known quantity and hesitation shows. Name-drop α(n) correctly ("amortized inverse Ackermann, effectively constant") and be ready to justify union by rank with the tree-height argument.

## Practice Problems

- [[Number-of-Provinces]]
- [[Redundant-Connection]]

## Related

- [[BFS-DFS-Pattern]]
- [[Greedy-Pattern]]
- [[Heap-Pattern]]
- [[Interview-Prep-Index]]
