"""Searching algorithms with complexity and interview notes."""

from __future__ import annotations


def binary_search(sorted_nums: list[int], target: int) -> int:
    """
    Binary Search
    Time: O(log n)
    Space: O(1)
    Interview note: carefully state loop invariant and boundary updates.
    Returns index of target or -1 if not found.
    """
    left = 0
    right = len(sorted_nums) - 1

    while left <= right:
        mid = left + (right - left) // 2
        value = sorted_nums[mid]

        if value == target:
            return mid
        if value < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1


def lower_bound(sorted_nums: list[int], target: int) -> int:
    """
    Lower bound: first index i where sorted_nums[i] >= target.
    Time: O(log n)
    Space: O(1)
    Interview note: useful for range queries and insertion position.
    """
    left = 0
    right = len(sorted_nums)

    while left < right:
        mid = left + (right - left) // 2
        if sorted_nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left
