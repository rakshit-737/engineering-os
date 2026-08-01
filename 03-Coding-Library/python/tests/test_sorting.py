from __future__ import annotations

import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.sorting import merge_sort, quick_sort


class TestSorting(unittest.TestCase):
    def test_empty(self) -> None:
        self.assertEqual(merge_sort([]), [])
        self.assertEqual(quick_sort([]), [])

    def test_single(self) -> None:
        self.assertEqual(merge_sort([5]), [5])
        self.assertEqual(quick_sort([5]), [5])

    def test_duplicates(self) -> None:
        data = [3, 1, 3, 2, 1]
        self.assertEqual(merge_sort(data), [1, 1, 2, 3, 3])
        self.assertEqual(quick_sort(data), [1, 1, 2, 3, 3])

    def test_already_sorted(self) -> None:
        data = [1, 2, 3, 4]
        self.assertEqual(merge_sort(data), data)
        self.assertEqual(quick_sort(data), data)

    def test_reverse_sorted(self) -> None:
        self.assertEqual(merge_sort([4, 3, 2, 1]), [1, 2, 3, 4])
        self.assertEqual(quick_sort([4, 3, 2, 1]), [1, 2, 3, 4])

    def test_negatives(self) -> None:
        self.assertEqual(merge_sort([0, -2, 5, -9]), [-9, -2, 0, 5])
        self.assertEqual(quick_sort([0, -2, 5, -9]), [-9, -2, 0, 5])

    def test_input_not_mutated(self) -> None:
        data = [3, 1, 2]
        merge_sort(data)
        quick_sort(data)
        self.assertEqual(data, [3, 1, 2])

    def test_random_against_builtin(self) -> None:
        rng = random.Random(42)
        for _ in range(50):
            data = [rng.randint(-1000, 1000) for _ in range(rng.randint(0, 100))]
            expected = sorted(data)
            self.assertEqual(merge_sort(data), expected)
            self.assertEqual(quick_sort(data), expected)


if __name__ == "__main__":
    unittest.main()
