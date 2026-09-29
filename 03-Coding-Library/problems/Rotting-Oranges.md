---
title: Rotting Oranges
description: Multi-source BFS from all rotten oranges; the number of levels is the answer.
domain: dsa
category: bfs-dfs
type: problem
difficulty: intermediate
status: evergreen
tags: [graphs, bfs, grid, multi-source]
prerequisites: [BFS-DFS-Pattern, Queue-and-Deque-Pattern]
related: [Number-of-Islands, Binary-Tree-Level-Order-Traversal, Network-Delay-Time]
pattern: bfs-dfs
source: "LeetCode 994"
languages: [python, java, cpp]
---

# Rotting Oranges

Pattern: [[BFS-DFS-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Grid cells are 0 (empty), 1 (fresh orange) or 2 (rotten). Each minute, fresh oranges 4-adjacent to a rotten one become rotten. Return the minutes until no fresh orange remains, or -1 if impossible.

Example: `[ [2,1,1],[1,1,0],[0,1,1] ]` -> `4`.

## Intuition

Rot spreads one step per minute from every rotten orange simultaneously: that is BFS with all rotten cells in the initial queue (multi-source BFS). Minutes = number of BFS levels that rot something.

## Brute force

Simulate minute by minute, scanning the whole grid each time. O((m*n)^2).

## Optimized approach

Enqueue all 2s, count fresh 1s. Process level by level; each fresh neighbour becomes 2, `fresh--`, enqueue. Increment `minutes` after each level that made progress. At the end return `minutes` if `fresh == 0`, else -1.

## Complexity

Time O(m * n), space O(m * n).

## Implementation

### Python

```python
from collections import deque

class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        m, n = len(grid), len(grid[0])
        q, fresh = deque(), 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] == 2:
                    q.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1
        minutes = 0
        while q and fresh:
            for _ in range(len(q)):
                r, c = q.popleft()
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        q.append((nr, nc))
            minutes += 1
        return minutes if fresh == 0 else -1
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;
        Deque<int[]> q = new ArrayDeque<>();
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 2) q.offer(new int[]{r, c});
                else if (grid[r][c] == 1) fresh++;
            }
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!q.isEmpty() && fresh > 0) {
            for (int size = q.size(); size > 0; size--) {
                int[] cell = q.poll();
                for (int[] d : dirs) {
                    int nr = cell[0] + d[0], nc = cell[1] + d[1];
                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        fresh--;
                        q.offer(new int[]{nr, nc});
                    }
                }
            }
            minutes++;
        }
        return fresh == 0 ? minutes : -1;
    }
}
```

### C++

```cpp
#include <queue>
#include <utility>
#include <vector>
using namespace std;

class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size(), fresh = 0, minutes = 0;
        queue<pair<int, int>> q;
        for (int r = 0; r < m; ++r)
            for (int c = 0; c < n; ++c) {
                if (grid[r][c] == 2) q.push({r, c});
                else if (grid[r][c] == 1) ++fresh;
            }
        const int dr[] = {1, -1, 0, 0}, dc[] = {0, 0, 1, -1};
        while (!q.empty() && fresh > 0) {
            for (int size = q.size(); size > 0; --size) {
                auto [r, c] = q.front(); q.pop();
                for (int d = 0; d < 4; ++d) {
                    int nr = r + dr[d], nc = c + dc[d];
                    if (nr >= 0 && nc >= 0 && nr < m && nc < n && grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        --fresh;
                        q.push({nr, nc});
                    }
                }
            }
            ++minutes;
        }
        return fresh == 0 ? minutes : -1;
    }
};
```

## Edge cases

- No fresh oranges at all: 0 (the `while ... and fresh` guard handles it).
- Fresh oranges but no rotten ones: -1.
- A fresh orange isolated by empty cells: -1.

## Common mistakes

- Running BFS separately from each rotten orange (wrong timing, slower).
- Counting a final minute in which nothing rotted.

## Follow-ups

- Walls and Gates / 01 Matrix: same multi-source BFS for distances.
- Return the time each orange rots (store distance per cell).
