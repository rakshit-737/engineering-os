"""Heap and interval patterns with complexity and interview notes."""

from __future__ import annotations

import heapq
from collections import Counter


def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Return the k most frequent values, most frequent first.
    Time: O(n log k)
    Space: O(n)
    Interview note: heapq.nlargest over Counter items keeps a size-k heap;
    bucket sort by count is the O(n) follow-up.
    """
    counts = Counter(nums)
    return [value for value, _ in heapq.nlargest(k, counts.items(), key=lambda item: item[1])]


def kth_largest(nums: list[int], k: int) -> int:
    """
    Return the k-th largest element using a min-heap of size k.
    Time: O(n log k)
    Space: O(k)
    Interview note: the heap root is always the k-th largest seen so far;
    quickselect gives O(n) average if asked to beat this.
    """
    if not 1 <= k <= len(nums):
        raise ValueError("k must satisfy 1 <= k <= len(nums)")
    heap: list[int] = []
    for value in nums:
        if len(heap) < k:
            heapq.heappush(heap, value)
        elif value > heap[0]:
            heapq.heapreplace(heap, value)
    return heap[0]


def k_way_merge(lists: list[list[int]]) -> list[int]:
    """
    Merge k sorted lists into one sorted list.
    Time: O(n log k) where n is the total element count.
    Space: O(k) for the heap (plus O(n) output).
    Interview note: push (value, list_index, elem_index) tuples so ties on
    value break on the indices and each pop knows where its successor lives.
    """
    heap: list[tuple[int, int, int]] = []
    for list_index, seq in enumerate(lists):
        if seq:
            heap.append((seq[0], list_index, 0))
    heapq.heapify(heap)

    merged: list[int] = []
    while heap:
        value, list_index, elem_index = heapq.heappop(heap)
        merged.append(value)
        next_index = elem_index + 1
        if next_index < len(lists[list_index]):
            heapq.heappush(heap, (lists[list_index][next_index], list_index, next_index))
    return merged


def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """
    Merge overlapping closed intervals [start, end].
    Time: O(n log n)
    Space: O(n)
    Interview note: sort by start; an interval merges into the last kept
    one iff its start <= that interval's end (touching counts as overlap).
    """
    merged: list[list[int]] = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged


def insert_interval(
    intervals: list[list[int]], new_interval: list[int]
) -> list[list[int]]:
    """
    Insert one interval into a sorted, non-overlapping list and merge.
    Time: O(n)
    Space: O(n)
    Interview note: three sweeps — copy strictly-before intervals, absorb
    every overlapping one into the new interval, copy strictly-after ones.
    """
    start, end = new_interval
    result: list[list[int]] = []
    i = 0
    n = len(intervals)

    while i < n and intervals[i][1] < start:
        result.append(intervals[i])
        i += 1

    while i < n and intervals[i][0] <= end:
        start = min(start, intervals[i][0])
        end = max(end, intervals[i][1])
        i += 1
    result.append([start, end])

    while i < n:
        result.append(intervals[i])
        i += 1

    return result


def min_meeting_rooms(intervals: list[list[int]]) -> int:
    """
    Minimum number of rooms needed to host all meetings [start, end).
    Time: O(n log n)
    Space: O(n)
    Interview note: sort starts and ends separately; a start before the
    current earliest end opens a room, otherwise reuse one (advance the
    end pointer). Heap alternative: sort by start and keep a min-heap of
    end times, popping every end <= the next start — the peak heap size
    is the answer; the heap version generalizes to "which room" queries.
    """
    if not intervals:
        return 0

    starts = sorted(interval[0] for interval in intervals)
    ends = sorted(interval[1] for interval in intervals)

    rooms = 0
    max_rooms = 0
    end_ptr = 0
    for start in starts:
        while end_ptr < len(ends) and ends[end_ptr] <= start:
            rooms -= 1
            end_ptr += 1
        rooms += 1
        max_rooms = max(max_rooms, rooms)
    return max_rooms
