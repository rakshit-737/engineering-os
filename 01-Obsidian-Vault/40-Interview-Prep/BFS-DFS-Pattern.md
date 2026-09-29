---
title: BFS DFS Pattern
description: Model problems as state graphs; BFS for fewest steps, DFS for exhaustive exploration.
domain: dsa
category: bfs-dfs
type: pattern
difficulty: intermediate
status: evergreen
tags: [graphs, bfs, dfs]
prerequisites: []
related: [Shortest-Path-Pattern, Topological-Sort-Pattern, Union-Find-Pattern, Graph-Traversal-BFS-DFS]
---

# BFS DFS Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Model the problem as states + transitions, even when no explicit graph is given. BFS (queue, level by level) finds the *minimum number of steps* in an unweighted graph; DFS (recursion or stack) explores *all configurations* — connectivity, backtracking, cycle detection, topological order.

## Details

**Recognition cues:**
- "Shortest path / minimum moves / fewest steps" on unweighted transitions → BFS.
- "Number of islands / connected components / flood fill" → either; DFS is shorter to write.
- "All permutations / combinations / paths / valid configurations" → DFS + backtracking.
- "Course prerequisites / build order" → topological sort (Kahn's BFS or DFS postorder).
- A grid, a word-transformation puzzle, or a lock/state puzzle is a graph in disguise: cells/words/states are nodes, legal moves are edges.

**Templates:**

```python
from collections import deque

def bfs(start, is_goal, neighbors):
    q, seen = deque([(start, 0)]), {start}
    while q:
        node, dist = q.popleft()
        if is_goal(node): return dist
        for nxt in neighbors(node):
            if nxt not in seen:
                seen.add(nxt)          # mark when ENQUEUING, not when popping
                q.append((nxt, dist + 1))
    return -1
```

```python
def dfs(node, seen, neighbors):
    seen.add(node)
    for nxt in neighbors(node):
        if nxt not in seen:
            dfs(nxt, seen, neighbors)
```

**Worked example — Number of Islands:** scan the grid; on each unvisited `'1'`, increment the count and DFS/BFS to sink the whole component (mark visited). Each cell is visited once → O(rows·cols).

**Classic problems:** Number of Islands, Word Ladder (BFS levels = transformation steps), Course Schedule (cycle detection / topo sort), Rotting Oranges (multi-source BFS: enqueue all rotten first), Clone Graph.

**Complexity:** O(V + E) time for both; grid of n·m cells has V = nm, E ≈ 4nm. Space: BFS holds a frontier (worst case O(V)); recursive DFS holds the recursion stack (worst case O(V) — deep grids can hit Python's recursion limit; use an explicit stack or `sys.setrecursionlimit`).

**Classic trap:** marking nodes visited when *popping* from the BFS queue instead of when *enqueuing*. The same node gets enqueued many times, blowing up memory and time. Second trap: using DFS for a shortest-path question — DFS gives *a* path, not the shortest.

## Interview Angle

- Say explicitly: "This grid/word puzzle is really a graph — nodes are X, edges are Y." Interviewers listen for that modeling step.
- Justify the choice: "I need minimum steps, so BFS" or "I need every configuration, so DFS with backtracking."
- Know multi-source BFS (start with several nodes in the queue) and bidirectional BFS (Word Ladder optimization) as name-drops.
- For topological sort, be ready to state both versions: Kahn's algorithm (BFS on in-degree 0 nodes) and DFS postorder reversed; cycle ⇒ no valid order.
- State the recursion-depth caveat for DFS in Python before the interviewer asks.

## Practice Problems

- [[Number-of-Islands]]
- [[Rotting-Oranges]]
- [[Course-Schedule]]
- [[Word-Search-II]]

## Related

- [[Graph-Traversal-BFS-DFS]]
- [[Recursion-and-Stack-Frames]]
- [[Trees-and-BSTs]]
- [[Big-O-Notation]]
