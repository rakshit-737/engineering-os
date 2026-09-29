---
title: Number of Islands
description: Count connected components of land cells in a grid with DFS/BFS flood fill.
domain: dsa
category: bfs-dfs
type: problem
difficulty: intermediate
status: evergreen
tags: [graphs, dfs, bfs, grid]
prerequisites: [BFS-DFS-Pattern]
related: [Rotting-Oranges, Number-of-Provinces, Union-Find-Pattern]
pattern: bfs-dfs
source: "LeetCode 200"
languages: [python, java, cpp]
---

# Number of Islands

Pattern: [[BFS-DFS-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given a grid of `'1'` (land) and `'0'` (water), count the islands: maximal groups of land cells connected horizontally or vertically.

Example:
```
11000
11000
00100
00011   -> 3
```

## Intuition

The grid is an implicit graph: each land cell connects to its 4 neighbours. Every unvisited land cell starts a new component; flood-fill it so it is never counted again.

## Brute force

There is no meaningfully worse approach; the naive risk is revisiting cells without marking them (exponential/infinite). The standard solution is linear.

## Optimized approach

Scan all cells. On an unvisited `'1'`, increment the count and flood fill (DFS or BFS) marking cells as `'0'` (or in a visited set). BFS with an explicit queue avoids deep recursion on large grids.

## Complexity

Time O(m * n), space O(m * n) worst case for the queue/recursion.

## Implementation

### Python

```python
from collections import deque

class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        m, n, count = len(grid), len(grid[0]), 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] != '1':
                    continue
                count += 1
                grid[r][c] = '0'
                q = deque([(r, c)])
                while q:
                    x, y = q.popleft()
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < m and 0 <= ny < n and grid[nx][ny] == '1':
                            grid[nx][ny] = '0'
                            q.append((nx, ny))
        return count
```

### Java

```java
class Solution {
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
        return count;
    }

    private void sink(char[][] g, int r, int c) {
        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r + 1, c);
        sink(g, r - 1, c);
        sink(g, r, c + 1);
        sink(g, r, c - 1);
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
    void sink(vector<vector<char>>& g, int r, int c) {
        if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != '1') return;
        g[r][c] = '0';
        sink(g, r + 1, c); sink(g, r - 1, c);
        sink(g, r, c + 1); sink(g, r, c - 1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < (int)grid.size(); ++r)
            for (int c = 0; c < (int)grid[0].size(); ++c)
                if (grid[r][c] == '1') { ++count; sink(grid, r, c); }
        return count;
    }
};
```

## Edge cases

- All water: 0. All land: 1.
- Single row or column.
- Diagonal land cells are NOT connected.

## Common mistakes

- Marking visited when popping instead of when pushing (BFS enqueues duplicates).
- Mutating the input when the interviewer wants it preserved: ask, or use a visited set.
- Recursive DFS on a 300x300 all-land grid can hit recursion limits in Python.

## Follow-ups

- Max area of island, perimeter, or number of distinct island shapes.
- Number of Islands II (land added online): [[Union-Find-Pattern]].
- Count islands in a stream of rows with limited memory.
