---
title: Prefix Sum Pattern
description: Precompute running totals so any range sum is one subtraction; combine with hashing for subarray counting.
domain: dsa
category: prefix-sum
type: pattern
difficulty: beginner
status: evergreen
tags: [prefix-sum, arrays, hashing]
prerequisites: [Arrays-and-Hashing-Pattern]
related: [Sliding-Window-Pattern, Arrays-and-Hashing-Pattern, DP-Pattern]
---

# Prefix Sum Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Define `P[0] = 0` and `P[i+1] = P[i] + a[i]`. Then `sum(a[l..r]) = P[r+1] - P[l]` in O(1) after O(n) preprocessing. The deeper trick: a condition on a subarray becomes a condition on a **pair of prefix values**, which you can look up in a hash map while scanning — this works even with negative numbers, where sliding windows break.

## Details

**Recognition cues:**
- Many range-sum queries on a static array -> prefix array.
- "Count/longest subarrays with sum = k" (negatives allowed) -> prefix sum + hash map.
- "Subarray sum divisible by k" -> hash map keyed by `prefix mod k`.
- "Equal number of 0s and 1s" -> map 0 to -1, then find equal prefix sums.
- Many range **updates** then one read -> difference array (the inverse of prefix sums).
- 2D region sums -> 2D prefix with inclusion-exclusion.

**Template - count subarrays with sum k:**

```python
from collections import defaultdict
def count_k(nums, k):
    seen = defaultdict(int); seen[0] = 1   # empty prefix
    prefix = ans = 0
    for x in nums:
        prefix += x
        ans += seen[prefix - k]
        seen[prefix] += 1
    return ans
```

**Template - difference array (range add):**

```python
diff = [0] * (n + 1)
for l, r, v in updates:     # add v to a[l..r]
    diff[l] += v
    diff[r + 1] -= v
# running sum of diff recovers the final array
```

**2D prefix:** `S[i+1][j+1] = a[i][j] + S[i][j+1] + S[i+1][j] - S[i][j]`; region `(r1,c1)-(r2,c2)` = `S[r2+1][c2+1] - S[r1][c2+1] - S[r2+1][c1] + S[r1][c1]`.

**Complexity:** O(n) build, O(1) per query; O(n) extra space.

**Classic traps:**
- Forgetting the `{0: 1}` seed (misses subarrays starting at index 0).
- Off-by-one between `P` (length n+1) and `a` (length n).
- Negative modulo in Java/C++: normalize with `((p % k) + k) % k`.
- Integer overflow of long running sums: use 64-bit.

## Interview Angle

- When the interviewer says "numbers can be negative", that is the cue to drop sliding window and reach for prefix sums + hashing.
- Product of Array Except Self is the multiplicative cousin (prefix and suffix products).

## Practice Problems

- [[Subarray-Sum-Equals-K]]
- [[Product-of-Array-Except-Self]]
- [[Gas-Station]]

## Related

- [[Sliding-Window-Pattern]]
- [[Arrays-and-Hashing-Pattern]]
- [[DP-Pattern]]
