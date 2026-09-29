---
title: Number of Provinces
description: Count connected components of an adjacency matrix with union-find (or DFS).
domain: dsa
category: union-find
type: problem
difficulty: intermediate
status: evergreen
tags: [union-find, graphs, components]
prerequisites: [Union-Find-Pattern]
related: [Redundant-Connection, Number-of-Islands]
pattern: union-find
source: "LeetCode 547"
languages: [python, java, cpp]
---

# Number of Provinces

Pattern: [[Union-Find-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

`isConnected` is an n x n symmetric matrix where `isConnected[i][j] = 1` means cities i and j are directly connected. A province is a group of cities connected directly or indirectly. Return the number of provinces.

Example: `[ [1,1,0],[1,1,0],[0,0,1] ]` -> `2`.

## Intuition

Count connected components. Start with n singleton sets; every successful union of two different sets reduces the component count by one.

## Brute force

DFS/BFS from each unvisited city over the matrix: O(n^2). This is equally optimal for a dense matrix; DSU is shown because it generalizes to online edge additions.

## Optimized approach

DSU with path compression and union by size. For every `i < j` with a connection, `union(i, j)`; decrement `components` when the roots differ.

## Complexity

Time O(n^2 * alpha(n)) (reading the matrix dominates), space O(n).

## Implementation

### Python

```python
class Solution:
    def findCircleNum(self, isConnected: list[list[int]]) -> int:
        n = len(isConnected)
        parent = list(range(n))

        def find(x: int) -> int:
            while parent[x] != x:
                parent[x] = parent[parent[x]]   # path halving
                x = parent[x]
            return x

        components = n
        for i in range(n):
            for j in range(i + 1, n):
                if isConnected[i][j]:
                    ri, rj = find(i), find(j)
                    if ri != rj:
                        parent[ri] = rj
                        components -= 1
        return components
```

### Java

```java
class Solution {
    private int[] parent, size;

    private int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length, components = n;
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) { parent[i] = i; size[i] = 1; }
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (isConnected[i][j] == 1) {
                    int a = find(i), b = find(j);
                    if (a == b) continue;
                    if (size[a] < size[b]) { int t = a; a = b; b = t; }
                    parent[b] = a;
                    size[a] += size[b];
                    components--;
                }
        return components;
    }
}
```

### C++

```cpp
#include <numeric>
#include <utility>
#include <vector>
using namespace std;

class Solution {
    vector<int> parent, sz;
    int find(int x) {
        while (parent[x] != x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size(), components = n;
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0);
        sz.assign(n, 1);
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                if (isConnected[i][j]) {
                    int a = find(i), b = find(j);
                    if (a == b) continue;
                    if (sz[a] < sz[b]) swap(a, b);
                    parent[b] = a;
                    sz[a] += sz[b];
                    --components;
                }
        return components;
    }
};
```

## Edge cases

- Identity matrix: n provinces.
- All ones: 1 province.

## Common mistakes

- Treating the matrix as an edge list (it is n x n adjacency).
- Decrementing the count even when both cities already share a root.

## Follow-ups

- Edges arrive over time and you must answer component count after each: DSU is the right tool.
- Number of operations to make a network connected: components - 1 if enough edges.
