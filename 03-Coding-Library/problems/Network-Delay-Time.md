---
title: Network Delay Time
description: Single-source shortest paths with Dijkstra; the answer is the largest finite distance.
domain: dsa
category: shortest-path
type: problem
difficulty: intermediate
status: evergreen
tags: [graphs, dijkstra, heap, shortest-path]
prerequisites: [Shortest-Path-Pattern, Heap-Pattern]
related: [Cheapest-Flights-Within-K-Stops, Rotting-Oranges]
pattern: shortest-path
source: "LeetCode 743"
languages: [python, java, cpp]
---

# Network Delay Time

Pattern: [[Shortest-Path-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

There are `n` nodes labelled 1..n and directed edges `times[i] = (u, v, w)` meaning a signal takes `w` time from `u` to `v` (w >= 0). A signal starts at node `k`. Return the time for all nodes to receive it, or -1 if some node is unreachable.

Example: `times = [ [2,1,1],[2,3,1],[3,4,1] ], n = 4, k = 2` -> `2`.

## Intuition

Each node receives the signal at its shortest-path distance from `k`. All nodes are done at the maximum of those distances. Non-negative weights mean Dijkstra applies.

## Brute force

Bellman-Ford: relax every edge n - 1 times. O(V * E).

## Optimized approach

Dijkstra with a min-heap of `(dist, node)`. Pop the closest; skip if stale (`d > dist[node]`); relax outgoing edges, pushing improved distances. Answer = `max(dist)` if every node is finite, else -1.

## Complexity

Time O(E log V) with a binary heap (lazy deletion gives O(E log E), same order). Space O(V + E).

## Implementation

### Python

```python
import heapq
from collections import defaultdict

class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        graph = defaultdict(list)
        for u, v, w in times:
            graph[u].append((v, w))
        dist = {}
        heap = [(0, k)]
        while heap:
            d, u = heapq.heappop(heap)
            if u in dist:
                continue
            dist[u] = d
            for v, w in graph[u]:
                if v not in dist:
                    heapq.heappush(heap, (d + w, v))
        return max(dist.values()) if len(dist) == n else -1
```

### Java

```java
import java.util.*;

class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());
        for (int[] t : times) graph.get(t[0]).add(new int[]{t[1], t[2]});
        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        heap.offer(new int[]{0, k});
        while (!heap.isEmpty()) {
            int[] top = heap.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;
            for (int[] e : graph.get(u)) {
                if (d + e[1] < dist[e[0]]) {
                    dist[e[0]] = d + e[1];
                    heap.offer(new int[]{dist[e[0]], e[0]});
                }
            }
        }
        int ans = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            ans = Math.max(ans, dist[i]);
        }
        return ans;
    }
}
```

### C++

```cpp
#include <algorithm>
#include <climits>
#include <functional>
#include <queue>
#include <utility>
#include <vector>
using namespace std;

class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int, int>>> graph(n + 1);
        for (auto& t : times) graph[t[0]].push_back({t[1], t[2]});
        vector<int> dist(n + 1, INT_MAX);
        dist[k] = 0;
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> heap;
        heap.push({0, k});
        while (!heap.empty()) {
            auto [d, u] = heap.top(); heap.pop();
            if (d > dist[u]) continue;
            for (auto [v, w] : graph[u]) {
                if (d + w < dist[v]) {
                    dist[v] = d + w;
                    heap.push({dist[v], v});
                }
            }
        }
        int ans = 0;
        for (int i = 1; i <= n; ++i) {
            if (dist[i] == INT_MAX) return -1;
            ans = max(ans, dist[i]);
        }
        return ans;
    }
};
```

## Edge cases

- Unreachable node: -1.
- `n = 1`: 0.
- Parallel edges between the same pair: relaxation keeps the smaller.

## Common mistakes

- Not skipping stale heap entries (still correct but slower) or, worse, finalizing a node on push instead of pop.
- 0-indexed arrays with 1-indexed labels.
- Using Dijkstra when negative weights are possible (use Bellman-Ford).

## Follow-ups

- Negative weights: Bellman-Ford or SPFA; negative cycle detection.
- Weights only 0/1: 0-1 BFS with a deque.
- All-pairs: Floyd-Warshall O(V^3).
