---
title: Redundant Connection
description: Find the edge that closes a cycle in an undirected graph by unioning edges until one joins an existing set.
domain: dsa
category: union-find
type: problem
difficulty: intermediate
status: evergreen
tags: [union-find, graphs, cycle-detection]
prerequisites: [Union-Find-Pattern]
related: [Number-of-Provinces, Course-Schedule]
pattern: union-find
source: "LeetCode 684"
languages: [python, java, cpp]
---

# Redundant Connection

Pattern: [[Union-Find-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

A tree with n nodes (labelled 1..n) had one extra undirected edge added, giving n edges. Return an edge whose removal leaves a tree; if several qualify, return the one that appears last in the input.

Example: `[ [1,2],[1,3],[2,3] ]` -> `[2,3]`.

## Intuition

Process edges in order. The first edge whose endpoints are already connected closes the cycle. Because the graph has exactly one cycle, that edge is the last cycle edge in input order, which is what the problem asks for.

## Brute force

For each edge (from last to first), remove it and check connectivity with DFS. O(n^2).

## Optimized approach

DSU over 1..n. For each edge, if `find(u) == find(v)` return it; otherwise union.

## Complexity

Time O(n * alpha(n)), space O(n).

## Implementation

### Python

```python
class Solution:
    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:
        parent = list(range(len(edges) + 1))

        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for u, v in edges:
            ru, rv = find(u), find(v)
            if ru == rv:
                return [u, v]
            parent[ru] = rv
        return []
```

### Java

```java
class Solution {
    private int[] parent;

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    public int[] findRedundantConnection(int[][] edges) {
        parent = new int[edges.length + 1];
        for (int i = 0; i < parent.length; i++) parent[i] = i;
        for (int[] e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) return e;
            parent[a] = b;
        }
        return new int[0];
    }
}
```

### C++

```cpp
#include <numeric>
#include <vector>
using namespace std;

class Solution {
    vector<int> parent;
    int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        parent.resize(edges.size() + 1);
        iota(parent.begin(), parent.end(), 0);
        for (auto& e : edges) {
            int a = find(e[0]), b = find(e[1]);
            if (a == b) return e;
            parent[a] = b;
        }
        return {};
    }
};
```

## Edge cases

- The cycle includes node 1 or node n (1-indexed labels: allocate n + 1 slots).
- Smallest case: 3 nodes forming a triangle.

## Common mistakes

- 0-indexed parent array of size n with 1-indexed labels.
- Union without find (linking the nodes instead of their roots).

## Follow-ups

- Redundant Connection II (directed graph): handle a node with two parents plus cycles.
- Detect a cycle in a directed graph: DSU does not work; use DFS colors or [[Topological-Sort-Pattern]].
