from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.graphs import bfs_shortest_unweighted, dijkstra


class TestBFS(unittest.TestCase):
    def test_line_graph(self) -> None:
        adj = {1: [2], 2: [3], 3: []}
        self.assertEqual(bfs_shortest_unweighted(adj, 1), {1: 0, 2: 1, 3: 2})

    def test_unreachable_node_absent(self) -> None:
        adj = {1: [2], 2: [], 3: [4], 4: []}
        dist = bfs_shortest_unweighted(adj, 1)
        self.assertNotIn(3, dist)
        self.assertNotIn(4, dist)

    def test_cycle_terminates(self) -> None:
        adj = {1: [2], 2: [3], 3: [1]}
        self.assertEqual(bfs_shortest_unweighted(adj, 1), {1: 0, 2: 1, 3: 2})

    def test_shortest_of_two_paths(self) -> None:
        adj = {1: [2, 3], 2: [4], 3: [4], 4: []}
        self.assertEqual(bfs_shortest_unweighted(adj, 1)[4], 2)


class TestDijkstra(unittest.TestCase):
    def test_prefers_cheaper_indirect_path(self) -> None:
        graph = {
            1: [(2, 2), (3, 5)],
            2: [(3, 1), (4, 4)],
            3: [(4, 1)],
            4: [],
        }
        self.assertEqual(dijkstra(graph, 1), {1: 0, 2: 2, 3: 3, 4: 4})

    def test_single_node(self) -> None:
        self.assertEqual(dijkstra({1: []}, 1), {1: 0})

    def test_unreachable_absent(self) -> None:
        graph = {1: [(2, 1)], 2: [], 3: [(4, 1)], 4: []}
        dist = dijkstra(graph, 1)
        self.assertEqual(dist, {1: 0, 2: 1})

    def test_zero_weight_edges(self) -> None:
        graph = {1: [(2, 0)], 2: [(3, 0)], 3: []}
        self.assertEqual(dijkstra(graph, 1), {1: 0, 2: 0, 3: 0})


if __name__ == "__main__":
    unittest.main()
