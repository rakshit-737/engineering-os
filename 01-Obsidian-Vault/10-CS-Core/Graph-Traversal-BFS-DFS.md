---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Graph Traversal BFS DFS

Hub: [[CS-Core-Index]]

## Core Idea

BFS explores a graph level by level using a FIFO queue, so the first time it reaches a node is via a fewest-edges path — it computes shortest paths in unweighted graphs. DFS follows one branch as deep as possible (recursion or explicit stack) before backtracking — the tool for cycle detection, connected components, topological sort, and exhaustive path exploration. Both visit every vertex and edge once: O(V + E) time with a visited set.

## Details

**Representation first.** Adjacency list `{node: [neighbors]}` is the default: O(V + E) space, cheap neighbor iteration. Adjacency matrix is O(V^2) — only for dense graphs or O(1) edge lookup. Grids ARE graphs: cell = node, 4-directional moves = edges.

```python
from collections import deque

def bfs(graph, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in dist:          # mark when ENQUEUING, not when popping
                dist[v] = dist[u] + 1
                q.append(v)
    return dist

def dfs(graph, u, visited):
    visited.add(u)
    for v in graph[u]:
        if v not in visited:
            dfs(graph, v, visited)
```

| Property | BFS | DFS |
|---|---|---|
| Data structure | queue (FIFO) | stack / recursion (LIFO) |
| Time | O(V + E) | O(V + E) |
| Space | O(V) — can hold a whole level | O(V) worst; O(depth) typical |
| Finds | shortest path (unweighted) | any path, structure info |
| Use when | "minimum steps/moves" | cycles, components, ordering, backtracking |

**Worked example — shortest path in a grid maze.** From `(0,0)` to `(r-1,c-1)` avoiding walls: BFS from the start, expanding 4 neighbors, marking visited on enqueue. First arrival at the goal = minimum steps, because BFS processes all distance-k cells before any distance-(k+1) cell. DFS here can return a wildly long path — it finds *a* path, not the shortest.

**Key variants to know.**
- **Multi-source BFS**: seed the queue with all sources at distance 0 (rotting oranges, nearest exit).
- **Topological sort**: Kahn's algorithm = BFS on in-degree-0 nodes; or DFS with post-order reversed. Leftover nodes mean a cycle (deadlock/build-order detection).
- **Cycle detection**: directed graphs need 3 colors (white/gray/black) — a gray-to-gray edge is a cycle; undirected just checks "visited neighbor that isn't my parent".
- **Connected components / flood fill**: loop over nodes, run either traversal from each unvisited one, count runs.
- Weighted shortest path is NOT BFS — that's Dijkstra (BFS + priority queue, see [[Heap-Pattern]]); 0/1 weights allow 0-1 BFS with a deque.

**Pitfalls.**
- Marking visited on *pop* instead of *enqueue* lets the same node enter the queue once per incoming edge — the queue balloons to O(E) instead of O(V) and duplicates waste work; omit the visited check entirely and traversal on a cyclic graph never terminates.
- Recursive DFS on a long path graph overflows Python's ~1000-frame recursion limit — see [[Recursion-and-Stack-Frames]]; use an explicit stack or raise the limit.
- Forgetting the visited set entirely: infinite loop on any cycle.
- Level-order logic bug: to process BFS by levels, snapshot `len(q)` and loop exactly that many pops per level.
- Grid problems: check bounds before indexing; mutate the grid in place as your visited set to save memory when allowed.

## Interview Angle

- The selection heuristic to say out loud: "the problem says minimum number of steps, so BFS" or "I need to explore all paths / detect ordering, so DFS." Interviewers grade the *choice* as much as the code.
- State O(V + E) and justify it: each vertex enqueued once, each edge relaxed once.
- Most-asked concrete problems: number of islands (flood fill), rotting oranges (multi-source BFS), course schedule (topological sort / cycle detection), word ladder (BFS on implicit graph), clone graph. Grid + implicit-graph modeling is the actual skill under test.
- Expected follow-ups: "what if edges have weights?" (Dijkstra), "iterative DFS?" (explicit stack), "space of BFS vs DFS on a wide shallow graph?" (BFS holds an entire level).

## Related

- [[Trees-and-BSTs]]
- [[BFS-DFS-Pattern]]
- [[Recursion-and-Stack-Frames]]
- [[Heap-Pattern]]
- [[Big-O-Notation]]
- [[CS-Core-Index]]
