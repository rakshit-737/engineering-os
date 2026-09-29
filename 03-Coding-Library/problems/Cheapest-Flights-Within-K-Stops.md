---
title: Cheapest Flights Within K Stops
description: Bellman-Ford limited to k+1 rounds of relaxation using a copy of the previous round's distances.
domain: dsa
category: shortest-path
type: problem
difficulty: advanced
status: evergreen
tags: [graphs, bellman-ford, shortest-path, dp]
prerequisites: [Shortest-Path-Pattern]
related: [Network-Delay-Time, DP-Pattern]
pattern: shortest-path
source: "LeetCode 787"
languages: [python, java, cpp]
---

# Cheapest Flights Within K Stops

Pattern: [[Shortest-Path-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

There are `n` cities and directed flights `(from, to, price)`. Find the cheapest price from `src` to `dst` using at most `k` intermediate stops (so at most `k + 1` flights). Return -1 if impossible.

Example: `n = 4, flights = [ [0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200] ], src = 0, dst = 3, k = 1` -> `700` (0 -> 1 -> 3). The cheaper 0 -> 1 -> 2 -> 3 (400) needs 2 stops.

## Intuition

Round `i` of Bellman-Ford computes the cheapest cost using at most `i` edges — as long as each round reads only the previous round's values. Run exactly `k + 1` rounds.

## Brute force

DFS over all paths with at most k + 1 edges. Exponential.

## Optimized approach

`dist[src] = 0`, others infinity. Repeat `k + 1` times: `tmp = copy(dist)`; for each edge `(u, v, w)`, if `dist[u]` is finite, `tmp[v] = min(tmp[v], dist[u] + w)`; then `dist = tmp`. Answer `dist[dst]` or -1.

Plain Dijkstra on cost alone is wrong here: a cheaper path with too many stops can block a slightly more expensive path that fits the limit. A Dijkstra/BFS on state `(node, stops)` also works.

## Complexity

Time O(k * E), space O(n).

## Implementation

### Python

```python
class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        INF = float("inf")
        dist = [INF] * n
        dist[src] = 0
        for _ in range(k + 1):
            tmp = dist[:]
            for u, v, w in flights:
                if dist[u] != INF and dist[u] + w < tmp[v]:
                    tmp[v] = dist[u] + w
            dist = tmp
        return -1 if dist[dst] == INF else dist[dst]
```

### Java

```java
import java.util.Arrays;

class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        final int INF = Integer.MAX_VALUE;
        int[] dist = new int[n];
        Arrays.fill(dist, INF);
        dist[src] = 0;
        for (int round = 0; round <= k; round++) {
            int[] tmp = dist.clone();
            for (int[] f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (dist[u] != INF && dist[u] + w < tmp[v]) tmp[v] = dist[u] + w;
            }
            dist = tmp;
        }
        return dist[dst] == INF ? -1 : dist[dst];
    }
}
```

### C++

```cpp
#include <climits>
#include <vector>
using namespace std;

class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        const int INF = INT_MAX;
        vector<int> dist(n, INF);
        dist[src] = 0;
        for (int round = 0; round <= k; ++round) {
            vector<int> tmp = dist;
            for (auto& f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (dist[u] != INF && dist[u] + w < tmp[v]) tmp[v] = dist[u] + w;
            }
            dist = tmp;
        }
        return dist[dst] == INF ? -1 : dist[dst];
    }
};
```

## Edge cases

- `src == dst`: 0.
- `k = 0`: only direct flights.
- Unreachable destination: -1.

## Common mistakes

- Updating `dist` in place within a round, which lets one round chain several edges and breaks the stop limit.
- Adding to `INF` and overflowing in Java/C++.
- Confusing stops (intermediate nodes) with edges: k stops = k + 1 edges.

## Follow-ups

- Return the actual route: store parent per round.
- Why Dijkstra on cost alone fails; how state expansion `(node, stops)` fixes it.
- Negative prices: Bellman-Ford still works for the bounded version.
