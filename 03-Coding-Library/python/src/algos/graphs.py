"""Graph algorithms with complexity and interview notes."""

from __future__ import annotations

import heapq
from collections import deque

Graph = dict[int, list[tuple[int, int]]]


def bfs_shortest_unweighted(adj: dict[int, list[int]], start: int) -> dict[int, int]:
    """
    BFS shortest distance on unweighted graph.
    Time: O(V + E)
    Space: O(V)
    Interview note: BFS gives shortest paths only when edges are unweighted.
    """
    dist: dict[int, int] = {start: 0}
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for nxt in adj.get(node, []):
            if nxt in dist:
                continue
            dist[nxt] = dist[node] + 1
            queue.append(nxt)

    return dist


def dijkstra(graph: Graph, start: int) -> dict[int, int]:
    """
    Dijkstra shortest paths from start.
    Time: O((V + E) log V)
    Space: O(V)
    Interview note: requires non-negative edge weights.
    """
    dist: dict[int, int] = {start: 0}
    heap: list[tuple[int, int]] = [(0, start)]

    while heap:
        current_dist, node = heapq.heappop(heap)
        if current_dist > dist.get(node, 10**18):
            continue

        for nxt, weight in graph.get(node, []):
            new_dist = current_dist + weight
            if new_dist < dist.get(nxt, 10**18):
                dist[nxt] = new_dist
                heapq.heappush(heap, (new_dist, nxt))

    return dist
