from __future__ import annotations

import bisect
import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.searching import binary_search, lower_bound


class TestBinarySearch(unittest.TestCase):
    def test_empty(self) -> None:
        self.assertEqual(binary_search([], 1), -1)

    def test_found_all_positions(self) -> None:
        data = [1, 3, 5, 7, 9]
        for index, value in enumerate(data):
            self.assertEqual(binary_search(data, value), index)

    def test_not_found(self) -> None:
        data = [1, 3, 5, 7, 9]
        for missing in [0, 2, 4, 6, 8, 10]:
            self.assertEqual(binary_search(data, missing), -1)

    def test_single_element(self) -> None:
        self.assertEqual(binary_search([5], 5), 0)
        self.assertEqual(binary_search([5], 4), -1)


class TestLowerBound(unittest.TestCase):
    def test_empty(self) -> None:
        self.assertEqual(lower_bound([], 1), 0)

    def test_boundaries(self) -> None:
        data = [2, 4, 4, 6]
        self.assertEqual(lower_bound(data, 1), 0)
        self.assertEqual(lower_bound(data, 4), 1)
        self.assertEqual(lower_bound(data, 5), 3)
        self.assertEqual(lower_bound(data, 7), 4)

    def test_random_against_bisect(self) -> None:
        rng = random.Random(7)
        for _ in range(50):
            data = sorted(rng.randint(0, 50) for _ in range(rng.randint(0, 40)))
            target = rng.randint(-5, 55)
            self.assertEqual(lower_bound(data, target), bisect.bisect_left(data, target))


if __name__ == "__main__":
    unittest.main()
