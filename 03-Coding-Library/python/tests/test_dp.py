from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.dp import (
    coin_change_min,
    edit_distance,
    fib,
    knapsack_01,
    longest_increasing_subsequence,
)


class TestFib(unittest.TestCase):
    def test_base_cases(self) -> None:
        self.assertEqual(fib(0), 0)
        self.assertEqual(fib(1), 1)

    def test_sequence(self) -> None:
        self.assertEqual([fib(n) for n in range(10)], [0, 1, 1, 2, 3, 5, 8, 13, 21, 34])


class TestCoinChange(unittest.TestCase):
    def test_standard(self) -> None:
        self.assertEqual(coin_change_min([1, 2, 5], 11), 3)

    def test_unreachable(self) -> None:
        self.assertEqual(coin_change_min([2], 3), -1)

    def test_zero_amount(self) -> None:
        self.assertEqual(coin_change_min([1, 5], 0), 0)


class TestLIS(unittest.TestCase):
    def test_standard(self) -> None:
        self.assertEqual(longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]), 4)

    def test_all_equal_is_one(self) -> None:
        self.assertEqual(longest_increasing_subsequence([7, 7, 7]), 1)

    def test_empty(self) -> None:
        self.assertEqual(longest_increasing_subsequence([]), 0)

    def test_strictly_decreasing(self) -> None:
        self.assertEqual(longest_increasing_subsequence([5, 4, 3, 2]), 1)


class TestKnapsack(unittest.TestCase):
    def test_standard(self) -> None:
        self.assertEqual(knapsack_01([1, 3, 4, 5], [1, 4, 5, 7], 7), 9)

    def test_zero_capacity(self) -> None:
        self.assertEqual(knapsack_01([1, 2], [10, 20], 0), 0)

    def test_item_too_heavy(self) -> None:
        self.assertEqual(knapsack_01([10], [100], 5), 0)


class TestEditDistance(unittest.TestCase):
    def test_standard(self) -> None:
        self.assertEqual(edit_distance("horse", "ros"), 3)
        self.assertEqual(edit_distance("intention", "execution"), 5)

    def test_identical(self) -> None:
        self.assertEqual(edit_distance("abc", "abc"), 0)

    def test_empty_sides(self) -> None:
        self.assertEqual(edit_distance("", "abc"), 3)
        self.assertEqual(edit_distance("abc", ""), 3)


if __name__ == "__main__":
    unittest.main()
