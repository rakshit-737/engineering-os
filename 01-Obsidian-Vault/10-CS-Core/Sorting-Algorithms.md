---
title: Sorting Algorithms
description: "Comparison-sort bounds, stability, and what production sorts actually do."
domain: cs-core
category: algorithms
type: concept
difficulty: beginner
status: evergreen
tags: [cs-core, algorithms]
prerequisites: [Big-O-Notation]
related: [Binary-Search, Algorithms-Overview]
---

# Sorting Algorithms

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

Sorting orders elements by a comparison key. Any algorithm that only compares elements needs Omega(n log n) comparisons in the worst case (a comparison tree must have n! leaves, and log2(n!) ~ n log n). Merge sort and heap sort hit that bound guaranteed; quicksort hits it in expectation and wins in practice via cache behavior; counting/radix sort beat the bound for bounded integer keys because they don't compare at all. *Stability* — equal elements keep their relative order — is the property that decides many real choices.

## Details

| Algorithm | Best | Average | Worst | Space | Stable | Notes |
|---|---|---|---|---|---|---|
| Bubble | O(n) | O(n^2) | O(n^2) | O(1) | yes | teaching only |
| Insertion | O(n) | O(n^2) | O(n^2) | O(1) | yes | best on tiny/nearly-sorted input |
| Selection | O(n^2) | O(n^2) | O(n^2) | O(1) | no | minimal swaps |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes | guaranteed; external sorting |
| Quick | O(n log n) | O(n log n) | O(n^2) | O(log n) | no | fastest in practice, in-place |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no | guaranteed + in-place, poor cache use |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | yes | integer keys in range k |
| Radix | O(d(n + k)) | same | same | O(n + k) | yes | d digits; uses counting sort per digit |
| Timsort | O(n) | O(n log n) | O(n log n) | O(n) | yes | Python/Java built-in; exploits runs |

**Merge sort mechanics.** Split in half, sort each, merge two sorted halves with two pointers. Recurrence T(n) = 2T(n/2) + O(n) = O(n log n). The merge is where stability comes from: on ties, take from the left half first.

**Quicksort mechanics.** Pick a pivot, partition into <pivot and >pivot, recurse on both sides. Worst case O(n^2) when partitions are lopsided — e.g. first-element pivot on already-sorted input. Fixes: random pivot or median-of-three. Duplicates-heavy input wants 3-way partitioning (Dutch national flag).

**Worked example — why stability matters.** Rows `(name, grade)` already sorted by name; now sort by grade. A stable sort keeps names alphabetical within each grade — so "sort by name, then stable-sort by grade" yields a correct two-key ordering with no tuple keys. An unstable sort scrambles the names. This is why Timsort being stable makes Python's `sorted(rows, key=lambda r: r.grade)` compose correctly.

```python
rows.sort(key=lambda r: r.name)     # secondary key first
rows.sort(key=lambda r: r.grade)    # stable primary sort preserves name order
```

**Counting sort sketch (beats n log n).** For grades 0-100: tally counts per value, prefix-sum the counts into positions, place elements. O(n + k), no comparisons — the information comes from the key's bounded integer structure.

**Related tools.** Quickselect (partition but recurse one side) finds the k-th element in O(n) average. A heap gives streaming top-k in O(n log k) — see [[Heap-Pattern]]. Sorting is often step one of a solution: sort then [[Binary-Search]], sort then two pointers, sort intervals by start.

**Pitfalls.**
- Quicksort's O(n^2) on sorted/reverse-sorted input with naive pivot — always mention the randomized fix.
- Assuming stability: quicksort, heapsort, and C++ `std::sort` are unstable (`std::stable_sort` exists); Python `list.sort` and Java `Arrays.sort` on objects (Timsort) are stable.
- Merge sort's O(n) auxiliary array — it is not in-place; forgetting this in a space-constrained follow-up.
- Custom comparators that violate transitivity or consistency give undefined behavior (can crash `std::sort`).
- "Radix sort is always faster": O(d(n+k)) beats O(n log n) only when digit count d is small relative to log n; useless for arbitrary floats/strings without care.

## Interview Angle

- Rarely "implement quicksort" anymore; instead: "which sort and why?" Answer with constraints — guaranteed bound? stability? memory? nearly sorted? bounded ints? Each maps to one row of the table.
- Know the lower-bound argument in one sentence: comparison sorts are decision trees with n! leaves, so height >= log2(n!) = Omega(n log n). Then note counting/radix sidestep it by not comparing.
- Know your language's built-in: Python and Java objects use Timsort — stable, O(n log n) worst, O(n) on already-sorted runs; that's why pre-sorted data sorts near-instantly.
- Classic probes: sort colors / Dutch flag (one-pass 3-way partition), merge k sorted lists (heap), k-th largest (quickselect vs heap), meeting rooms (sort intervals), sort a nearly-sorted array (insertion sort or min-heap of size k).

## Related

- [[Big-O-Notation]]
- [[Binary-Search]]
- [[Heap-Pattern]]
- [[Recursion-and-Stack-Frames]]
- [[Arrays-vs-Linked-Lists]]
- [[CS-Core-Index]]
