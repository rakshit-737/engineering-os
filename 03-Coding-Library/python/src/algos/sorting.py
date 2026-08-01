"""Sorting algorithms with complexity and interview notes."""

from __future__ import annotations


def merge_sort(nums: list[int]) -> list[int]:
    """
    Merge Sort
    Time: O(n log n)
    Space: O(n)
    Interview note: stable and predictable; useful when stability matters.
    """
    if len(nums) <= 1:
        return nums[:]

    mid = len(nums) // 2
    left = merge_sort(nums[:mid])
    right = merge_sort(nums[mid:])

    merged: list[int] = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1

    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged


def quick_sort(nums: list[int]) -> list[int]:
    """
    Quick Sort (functional version)
    Average Time: O(n log n), Worst: O(n^2)
    Space: O(n) for recursion and partitions in this implementation
    Interview note: mention pivot strategy and worst-case mitigation.
    """
    if len(nums) <= 1:
        return nums[:]

    pivot = nums[len(nums) // 2]
    left = [x for x in nums if x < pivot]
    mid = [x for x in nums if x == pivot]
    right = [x for x in nums if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)
