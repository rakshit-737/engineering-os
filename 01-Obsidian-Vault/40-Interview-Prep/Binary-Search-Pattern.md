---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Binary Search Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

Binary search is not "find x in a sorted array" — it is "find the boundary in any monotonic predicate." If `check(X)` being true implies `check(X+1)` is true, the answer space looks like FFFF...TTTT and you can binary search for the first T. This "binary search on the answer" turns optimization problems into feasibility checks.

## Details

**Recognition cues:**
- Sorted (or rotated-sorted) array, O(log n) required.
- "Minimize the maximum" / "maximize the minimum" — classic answer-space search.
- "Smallest capacity / speed / days such that a task succeeds."
- Answer is a number in a known range, and checking one candidate is easy (usually a greedy O(n) scan).

**Template — first index where predicate is true:**

```python
def binary_search_answer(lo, hi, check):
    # invariant: answer is in [lo, hi]; check is F...FT...T
    while lo < hi:
        mid = (lo + hi) // 2
        if check(mid):
            hi = mid        # mid might be the answer, keep it
        else:
            lo = mid + 1    # mid failed, discard it
    return lo
```

**Worked example — Koko Eating Bananas:** find minimum eating speed `k` to finish piles in `h` hours. `check(k)` = "sum(ceil(pile/k)) <= h", monotonic in k (faster always helps). Search k in [1, max(piles)]. Each check is O(n), total O(n log max).

**Classic problems:** Koko Eating Bananas, Capacity to Ship Packages Within D Days, Split Array Largest Sum, Search in Rotated Sorted Array, Find First and Last Position of Element (lower/upper bound), Median of Two Sorted Arrays (hard partition variant).

**Complexity:**

| Variant | Time |
|---|---|
| Plain search in sorted array | O(log n) |
| Answer-space search with O(n) check | O(n log R), R = answer range |

**Classic traps:**
- Off-by-one / infinite loop: with `hi = mid` you need `while lo < hi` and `mid = (lo+hi)//2` (biased low). Mixing conventions (`lo <= hi` with `hi = mid`) loops forever. Pick one template and never improvise.
- Shrinking the wrong side: always tie the update to the invariant ("answer is in [lo, hi]"), and re-state the invariant when unsure.
- Forgetting that the predicate must be *monotonic* — if it isn't, binary search silently returns garbage.
- Integer overflow on `(lo+hi)/2` matters in Java/C++ (use `lo + (hi-lo)/2`); Python is immune, but say it anyway.

## Interview Angle

- The high-value sentence: "The answer is monotonic — if speed k works, k+1 works — so I'll binary search the answer and write a greedy feasibility check." That reframing *is* the solution.
- Interviewers probe loop bounds: be able to explain why your loop terminates and why the invariant holds on both branches.
- Know `bisect_left` / `bisect_right` in Python and what each returns; hand-roll only when asked.
- Rotated array questions test whether you can decide which half is sorted at each step — practice stating that condition cleanly.
- If you find a bug, fix it via the invariant, not by shuffling `+1`s until tests pass — interviewers notice the difference.

## Related

- [[Binary-Search]]
- [[Big-O-Notation]]
- [[Sorting-Algorithms]]
- [[DP-Pattern]]
