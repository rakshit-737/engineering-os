---
title: Course Schedule II
description: Return a valid course order using DFS post-order topological sort with three-color cycle detection.
domain: dsa
category: topological-sort
type: problem
difficulty: intermediate
status: evergreen
tags: [graphs, topological-sort, dfs]
prerequisites: [Topological-Sort-Pattern, Course-Schedule]
related: [Course-Schedule, BFS-DFS-Pattern]
pattern: topological-sort
source: "LeetCode 210"
languages: [python, java, cpp]
---

# Course Schedule II

Pattern: [[Topological-Sort-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Same setup as [[Course-Schedule]] (`[a, b]` means take b before a). Return any ordering of all courses that respects the prerequisites, or an empty array if impossible.

Example: `n = 4, [ [1,0],[2,0],[3,1],[3,2] ]` -> `[0,1,2,3]` or `[0,2,1,3]`.

## Intuition

A topological order is exactly what we need. Kahn's pop order is one; this page shows the DFS alternative: a node is appended after all its dependents finish, so reversed post-order is a valid order.

## Brute force

Try permutations and validate each. O(n! * E).

## Optimized approach

Build edges `b -> a`. DFS with colors: 0 unvisited, 1 on the current path, 2 finished. Reaching a color-1 node means a cycle. On finishing a node, append it to `order`. Return `reversed(order)`. (Kahn's version: return the dequeue order if its length is n.)

## Complexity

Time O(V + E), space O(V + E).

## Implementation

### Python

```python
class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        graph = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            graph[b].append(a)
        color = [0] * numCourses
        order = []

        def dfs(u: int) -> bool:          # False if a cycle is found
            color[u] = 1
            for v in graph[u]:
                if color[v] == 1 or (color[v] == 0 and not dfs(v)):
                    return False
            color[u] = 2
            order.append(u)
            return True

        for u in range(numCourses):
            if color[u] == 0 and not dfs(u):
                return []
        return order[::-1]
```

### Java

```java
import java.util.*;

class Solution {
    private List<List<Integer>> graph;
    private int[] color;
    private int[] order;
    private int idx;

    public int[] findOrder(int numCourses, int[][] prerequisites) {
        graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        for (int[] p : prerequisites) graph.get(p[1]).add(p[0]);
        color = new int[numCourses];
        order = new int[numCourses];
        idx = numCourses - 1;               // fill from the back = reversed post-order
        for (int u = 0; u < numCourses; u++)
            if (color[u] == 0 && !dfs(u)) return new int[0];
        return order;
    }

    private boolean dfs(int u) {
        color[u] = 1;
        for (int v : graph.get(u)) {
            if (color[v] == 1) return false;
            if (color[v] == 0 && !dfs(v)) return false;
        }
        color[u] = 2;
        order[idx--] = u;
        return true;
    }
}
```

### C++

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class Solution {
    vector<vector<int>> graph;
    vector<int> color, order;
    bool dfs(int u) {
        color[u] = 1;
        for (int v : graph[u]) {
            if (color[v] == 1) return false;
            if (color[v] == 0 && !dfs(v)) return false;
        }
        color[u] = 2;
        order.push_back(u);
        return true;
    }
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        graph.assign(numCourses, {});
        color.assign(numCourses, 0);
        order.clear();
        for (auto& p : prerequisites) graph[p[1]].push_back(p[0]);
        for (int u = 0; u < numCourses; ++u)
            if (color[u] == 0 && !dfs(u)) return {};
        reverse(order.begin(), order.end());
        return order;
    }
};
```

## Edge cases

- No prerequisites: any permutation, e.g. `[0..n-1]` reversed is fine.
- Cycle anywhere: empty array.
- Deep chains (n up to thousands): Python recursion limit; Kahn's avoids it.

## Common mistakes

- Returning post-order without reversing.
- Two-state visited, which cannot distinguish a back edge from a cross edge.

## Follow-ups

- Lexicographically smallest order: Kahn's with a min-heap instead of a queue.
- Alien Dictionary: derive edges from adjacent word pairs, then topo sort.
