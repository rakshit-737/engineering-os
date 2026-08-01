from __future__ import annotations

import heapq
import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.heaps_intervals import (
    insert_interval,
    k_way_merge,
    kth_largest,
    merge_intervals,
    min_meeting_rooms,
    top_k_frequent,
)


class TestHeapsIntervals(unittest.TestCase):
    def test_top_k_frequent(self) -> None:
        self.assertEqual(top_k_frequent([], 0), [])
        self.assertEqual(top_k_frequent([7], 1), [7])
        self.assertEqual(top_k_frequent([1, 1, 1, 2, 2, 3], 2), [1, 2])
        self.assertEqual(set(top_k_frequent([4, 4, 5, 5, 6], 2)), {4, 5})
        self.assertEqual(set(top_k_frequent([1, 2, 3, 3], 3)), {1, 2, 3})  # k == distinct

    def test_kth_largest(self) -> None:
        self.assertEqual(kth_largest([5], 1), 5)
        self.assertEqual(kth_largest([3, 2, 1, 5, 6, 4], 2), 5)
        self.assertEqual(kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4)  # duplicates
        self.assertEqual(kth_largest([-3, -1, -2], 3), -3)  # k == len

    def test_kth_largest_invalid_k(self) -> None:
        with self.assertRaises(ValueError):
            kth_largest([1, 2], 0)
        with self.assertRaises(ValueError):
            kth_largest([1, 2], 3)
        with self.assertRaises(ValueError):
            kth_largest([], 1)

    def test_kth_largest_random_against_sorted(self) -> None:
        rng = random.Random(7)
        for _ in range(30):
            nums = [rng.randint(-50, 50) for _ in range(rng.randint(1, 40))]
            k = rng.randint(1, len(nums))
            self.assertEqual(kth_largest(nums, k), sorted(nums, reverse=True)[k - 1])

    def test_k_way_merge(self) -> None:
        self.assertEqual(k_way_merge([]), [])
        self.assertEqual(k_way_merge([[], [], []]), [])
        self.assertEqual(k_way_merge([[1, 4, 5], [1, 3, 4], [2, 6]]), [1, 1, 2, 3, 4, 4, 5, 6])
        self.assertEqual(k_way_merge([[2, 2, 2]]), [2, 2, 2])

    def test_k_way_merge_matches_heapq_merge(self) -> None:
        rng = random.Random(21)
        for _ in range(20):
            lists = [sorted(rng.randint(-30, 30) for _ in range(rng.randint(0, 15)))
                     for _ in range(rng.randint(0, 6))]
            self.assertEqual(k_way_merge(lists), list(heapq.merge(*lists)))

    def test_merge_intervals(self) -> None:
        self.assertEqual(merge_intervals([]), [])
        self.assertEqual(merge_intervals([[1, 4]]), [[1, 4]])
        self.assertEqual(
            merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]),
            [[1, 6], [8, 10], [15, 18]],
        )
        self.assertEqual(merge_intervals([[1, 4], [4, 5]]), [[1, 5]])  # touching

    def test_merge_intervals_nested_and_unsorted(self) -> None:
        self.assertEqual(merge_intervals([[2, 3], [1, 10], [4, 5]]), [[1, 10]])
        self.assertEqual(merge_intervals([[5, 6], [1, 2]]), [[1, 2], [5, 6]])

    def test_insert_interval(self) -> None:
        self.assertEqual(insert_interval([], [5, 7]), [[5, 7]])
        self.assertEqual(insert_interval([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]])
        self.assertEqual(
            insert_interval([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]),
            [[1, 2], [3, 10], [12, 16]],
        )

    def test_insert_interval_no_overlap(self) -> None:
        self.assertEqual(insert_interval([[1, 2], [8, 9]], [4, 5]), [[1, 2], [4, 5], [8, 9]])
        self.assertEqual(insert_interval([[3, 4]], [1, 2]), [[1, 2], [3, 4]])  # before all
        self.assertEqual(insert_interval([[3, 4]], [6, 8]), [[3, 4], [6, 8]])  # after all

    def test_insert_interval_swallows_everything(self) -> None:
        self.assertEqual(insert_interval([[2, 3], [5, 6], [8, 9]], [1, 10]), [[1, 10]])

    def test_min_meeting_rooms(self) -> None:
        self.assertEqual(min_meeting_rooms([]), 0)
        self.assertEqual(min_meeting_rooms([[1, 5]]), 1)
        self.assertEqual(min_meeting_rooms([[0, 30], [5, 10], [15, 20]]), 2)
        self.assertEqual(min_meeting_rooms([[7, 10], [2, 4]]), 1)

    def test_min_meeting_rooms_back_to_back_reuses_room(self) -> None:
        self.assertEqual(min_meeting_rooms([[1, 3], [3, 5], [5, 7]]), 1)
        self.assertEqual(min_meeting_rooms([[1, 4], [2, 4], [3, 4], [4, 5]]), 3)

    def test_min_meeting_rooms_all_overlap(self) -> None:
        self.assertEqual(min_meeting_rooms([[1, 10], [2, 9], [3, 8], [4, 7]]), 4)


if __name__ == "__main__":
    unittest.main()
