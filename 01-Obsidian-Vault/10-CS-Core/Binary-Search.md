---
title: Binary Search
description: "Halving a monotone search space, including search over answer spaces."
domain: cs-core
category: algorithms
type: concept
difficulty: beginner
status: evergreen
tags: [cs-core, algorithms]
prerequisites: [Big-O-Notation]
related: [Binary-Search-Pattern, Sorting-Algorithms, Algorithms-Overview]
---

# Binary Search

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

Binary search finds a target in a *sorted* (more generally, monotonic) search space by comparing against the middle element and discarding the half that cannot contain the answer, giving O(log n) time. The real requirement is not "sorted array" but a monotonic predicate: everything left of some boundary is False, everything right is True, and you are hunting the boundary. The loop invariant — what lo and hi are guaranteed to bracket — is the whole algorithm; the code is just maintaining it.

## Details

**Mechanics.** Keep `[lo, hi]` (or half-open `[lo, hi)`) as the range that may contain the answer. Each iteration: compute mid, test, shrink the range so the invariant still holds. Terminates because the range strictly shrinks.

```python
def binary_search(a, target):          # classic exact match
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2      # avoids overflow in fixed-width langs
        if a[mid] == target:
            return mid
        elif a[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

```python
def lower_bound(a, target):            # first index with a[i] >= target
    lo, hi = 0, len(a)                 # half-open [lo, hi)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < target:
            lo = mid + 1
        else:
            hi = mid                   # mid might be the answer; keep it
    return lo
```

| Variant | Returns | Loop condition | Shrink step |
|---|---|---|---|
| Exact match | index or -1 | `lo <= hi` | `mid ± 1` both sides |
| Lower bound | first i with a[i] >= t | `lo < hi` | `hi = mid` on success |
| Upper bound | first i with a[i] > t | `lo < hi` | flip the comparison |

Complexity: O(log n) time, O(1) space iterative. In Python, use `bisect.bisect_left` / `bisect_right` instead of hand-rolling when allowed.

**Worked example — search on the answer space.** "Ship packages within D days; find the minimum capacity." Capacity is monotonic: if capacity c works, every c' > c works. So binary search c between max(weights) and sum(weights), with a `feasible(c)` greedy check per probe — O(n log(sum)). Same skeleton solves Koko eating bananas, split array largest sum, min days to make bouquets. This is the [[Binary-Search-Pattern]].

**Pitfalls.**
- Off-by-one in mid: `mid = (lo + hi) // 2` rounds down, so with `lo = mid` (not `mid + 1`) a two-element range never shrinks — infinite loop. If you write `lo = mid`, you need `mid = (lo + hi + 1) // 2`.
- In C/Java/C++, `(lo + hi) / 2` can overflow int; write `lo + (hi - lo) / 2`.
- Mixing conventions: pick closed `[lo, hi]` or half-open `[lo, hi)` and keep loop condition, init, and updates consistent — most bugs come from mixing.
- Duplicates: exact-match search returns *an* occurrence, not the first; use lower/upper bound for ranges and counts.
- Applying it to unsorted data, or to a predicate that isn't actually monotonic.

## Interview Angle

- Interviewers deliberately probe boundaries: empty array, target absent, target at index 0 or n-1, all duplicates. Trace your loop on a 2-element array before declaring done — that's where the infinite-loop bug lives.
- Say your invariant explicitly: "answer, if it exists, is always within [lo, hi]" — it proves correctness and prevents off-by-ones.
- The senior move: recognizing binary search on the *answer space* when nothing in the problem is an array — "minimize the maximum", "find smallest X such that..." are the trigger phrases.
- Rotated sorted array (find pivot / search) and "first bad version" are the most common direct variants; know both cold.

## Related

- [[Binary-Search-Pattern]]
- [[Big-O-Notation]]
- [[Sorting-Algorithms]]
- [[Trees-and-BSTs]]
- [[CS-Core-Index]]
