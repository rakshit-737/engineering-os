from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.data_structures import DisjointSet, LRUCache, MinStack, Trie


class TestMinStack(unittest.TestCase):
    def test_min_tracks_through_pops(self) -> None:
        stack = MinStack()
        stack.push(5)
        stack.push(2)
        stack.push(7)
        self.assertEqual(stack.get_min(), 2)
        stack.pop()
        self.assertEqual(stack.get_min(), 2)
        stack.pop()
        self.assertEqual(stack.get_min(), 5)

    def test_top_and_len(self) -> None:
        stack = MinStack()
        stack.push(1)
        stack.push(9)
        self.assertEqual(stack.top(), 9)
        self.assertEqual(len(stack), 2)


class TestDisjointSet(unittest.TestCase):
    def test_union_and_connectivity(self) -> None:
        dsu = DisjointSet(5)
        self.assertTrue(dsu.union(0, 1))
        self.assertTrue(dsu.union(1, 2))
        self.assertTrue(dsu.connected(0, 2))
        self.assertFalse(dsu.connected(0, 3))

    def test_union_same_set_returns_false(self) -> None:
        dsu = DisjointSet(3)
        dsu.union(0, 1)
        self.assertFalse(dsu.union(1, 0))

    def test_cycle_detection_pattern(self) -> None:
        dsu = DisjointSet(4)
        edges = [(0, 1), (1, 2), (2, 0)]
        cycle_found = False
        for a, b in edges:
            if not dsu.union(a, b):
                cycle_found = True
        self.assertTrue(cycle_found)


class TestTrie(unittest.TestCase):
    def test_insert_and_search(self) -> None:
        trie = Trie()
        trie.insert("apple")
        self.assertTrue(trie.search("apple"))
        self.assertFalse(trie.search("app"))
        self.assertTrue(trie.starts_with("app"))

    def test_prefix_is_not_word(self) -> None:
        trie = Trie()
        trie.insert("car")
        trie.insert("card")
        self.assertTrue(trie.search("car"))
        self.assertTrue(trie.search("card"))
        self.assertFalse(trie.search("ca"))
        self.assertFalse(trie.starts_with("dog"))


class TestLRUCache(unittest.TestCase):
    def test_eviction_order(self) -> None:
        cache = LRUCache(2)
        cache.put(1, 1)
        cache.put(2, 2)
        cache.get(1)
        cache.put(3, 3)
        self.assertEqual(cache.get(2), -1)
        self.assertEqual(cache.get(1), 1)
        self.assertEqual(cache.get(3), 3)

    def test_update_existing_key(self) -> None:
        cache = LRUCache(2)
        cache.put(1, 1)
        cache.put(1, 10)
        self.assertEqual(cache.get(1), 10)

    def test_invalid_capacity(self) -> None:
        with self.assertRaises(ValueError):
            LRUCache(0)


if __name__ == "__main__":
    unittest.main()
