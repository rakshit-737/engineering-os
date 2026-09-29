---
title: Course Schedule
description: Decide if all courses can be finished by detecting a cycle with Kahn's topological sort.
domain: dsa
category: topological-sort
type: problem
difficulty: intermediate
status: evergreen
tags: [graphs, topological-sort, cycle-detection]
prerequisites: [Topological-Sort-Pattern, BFS-DFS-Pattern]
related: [Course-Schedule-II, Redundant-Connection]
pattern: topological-sort
source: "LeetCode 207"
languages: [python, java, cpp]
---

# Course Schedule

Pattern: [[Topological-Sort-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

There are `numCourses` courses (0..n-1). `prerequisites[i] = [a, b]` means you must take `b` before `a`. Return true if it is possible to finish all courses.

Example: `n = 2, [ [1,0] ]` -> true; `n = 2, [ [1,0],[0,1] ]` -> false.

## Intuition

Courses and prerequisites form a directed graph. All courses are finishable exactly when the graph has no cycle, i.e. a topological order exists.

## Brute force

For each course, DFS to see if it can reach itself. O(V * (V + E)).

## Optimized approach

Kahn's algorithm: compute in-degrees, queue every course with in-degree 0, pop and "take" it, decrement neighbours' in-degrees and enqueue those reaching 0. If the number taken equals `numCourses`, there is no cycle.

## Complexity

Time O(V + E), space O(V + E).

## Implementation

### Python

```python
from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indeg = [0] * numCourses
        for a, b in prerequisites:
            graph[b].append(a)
            indeg[a] += 1
        q = deque(i for i in range(numCourses) if indeg[i] == 0)
        taken = 0
        while q:
            u = q.popleft()
            taken += 1
            for v in graph[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        return taken == numCourses
```

### Java

```java
import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
        int[] indeg = new int[numCourses];
        for (int[] p : prerequisites) {
            graph.get(p[1]).add(p[0]);
            indeg[p[0]]++;
        }
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < numCourses; i++) if (indeg[i] == 0) q.offer(i);
        int taken = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            taken++;
            for (int v : graph.get(u)) if (--indeg[v] == 0) q.offer(v);
        }
        return taken == numCourses;
    }
}
```

### C++

```cpp
#include <queue>
#include <vector>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        vector<int> indeg(numCourses, 0);
        for (auto& p : prerequisites) {
            graph[p[1]].push_back(p[0]);
            ++indeg[p[0]];
        }
        queue<int> q;
        for (int i = 0; i < numCourses; ++i) if (indeg[i] == 0) q.push(i);
        int taken = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            ++taken;
            for (int v : graph[u]) if (--indeg[v] == 0) q.push(v);
        }
        return taken == numCourses;
    }
};
```

## Edge cases

- No prerequisites: true.
- Self-loop `[0,0]`: false.
- Disconnected components: Kahn's handles them because every zero in-degree node is seeded.

## Common mistakes

- Reversing edge direction (`[a, b]` means b -> a).
- DFS cycle detection with only a visited set (needs three colors: unvisited, in-stack, done).

## Follow-ups

- Return an actual order: [[Course-Schedule-II]].
- Minimum number of semesters (BFS levels of Kahn's).
- Parallel courses with a limit per semester (harder; bitmask DP for small n).
