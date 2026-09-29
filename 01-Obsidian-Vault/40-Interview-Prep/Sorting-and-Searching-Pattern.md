---
title: Sorting and Searching Pattern
description: Sort to expose structure, use counting/bucket sorts when keys are bounded, and partition for selection.
domain: dsa
category: sorting
type: pattern
difficulty: intermediate
status: evergreen
tags: [sorting, searching, partition, bucket-sort]
prerequisites: [Sorting-Algorithms, Big-O-Notation]
related: [Binary-Search-Pattern, Two-Pointer-Pattern, Intervals-Pattern, Heap-Pattern]
---

# Sorting and Searching Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Sorting is a preprocessing step that buys structure: equal items become adjacent (dedup, grouping), order enables two pointers and binary search, and interval/greedy problems become one sweep. The O(n log n) cost is usually acceptable; beat it only when keys are bounded (counting/bucket sort, O(n + k)) or when you need just one order statistic (quickselect, O(n) average).

## Details

**Recognition cues:**
- Pairs/triplets with a sum, deduplicated output -> sort + two pointers.
- Intervals, meetings, "earliest finish" -> sort by start or end.
- Values in a small range (0..2, ages, frequencies <= n) -> counting / bucket sort.
- "kth smallest/largest", "median" -> quickselect or heap.
- Custom ordering ("largest number from concatenation") -> comparator sort.
- Search in sorted or partially sorted data -> binary search ([[Binary-Search-Pattern]]).

**Know the library sorts:**
- Python `sorted`/`list.sort`: Timsort, stable, O(n log n).
- Java `Arrays.sort(int[])`: dual-pivot quicksort (not stable, primitives); `Arrays.sort(Object[])`/`Collections.sort`: stable merge sort (TimSort).
- C++ `std::sort`: introsort, not stable; `std::stable_sort` when order of equals matters; `std::nth_element` for selection.

**Template - 3-way partition (Dutch flag):**

```python
def three_way(a, pivot):
    lo = mid = 0; hi = len(a) - 1
    while mid <= hi:
        if a[mid] < pivot:  a[lo], a[mid] = a[mid], a[lo]; lo += 1; mid += 1
        elif a[mid] > pivot: a[mid], a[hi] = a[hi], a[mid]; hi -= 1
        else: mid += 1
```

**Template - bucket by frequency (top k):** count, then `buckets[freq].append(value)`, walk buckets from high to low.

**Complexity cheat sheet:** comparison sorts need Omega(n log n) comparisons in the worst case; counting sort O(n + k); radix sort O(d * (n + b)); quickselect O(n) average, O(n^2) worst without random pivots.

**Classic traps:**
- Java comparator `(a, b) -> a - b` overflows for large magnitudes; use `Integer.compare`.
- Sorting destroys original indices — sort index arrays or pairs if you need them.
- C++ comparators must be strict weak orderings (`<`, never `<=`), otherwise undefined behaviour.

## Interview Angle

- Ask "can I sort the input?" early — it often unlocks the whole problem, but note the lost indices and the O(n log n) cost.
- Be ready to implement merge sort and quicksort partition from memory, and explain stability.

## Practice Problems

- [[Sort-Colors]]
- [[Top-K-Frequent-Elements]]
- [[Kth-Largest-Element-in-an-Array]]
- [[Merge-Intervals]]
- [[Search-in-Rotated-Sorted-Array]]

## Related

- [[Sorting-Algorithms]]
- [[Binary-Search-Pattern]]
- [[Two-Pointer-Pattern]]
- [[Intervals-Pattern]]
