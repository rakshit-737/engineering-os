---
title: Koko Eating Bananas
description: Binary search on the answer - the smallest eating speed that finishes within h hours.
domain: dsa
category: binary-search
type: problem
difficulty: intermediate
status: evergreen
tags: [binary-search, answer-space]
prerequisites: [Binary-Search-Pattern]
related: [Search-in-Rotated-Sorted-Array, Longest-Increasing-Subsequence]
pattern: binary-search
source: "LeetCode 875"
languages: [python, java, cpp]
---

# Koko Eating Bananas

Pattern: [[Binary-Search-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

There are piles of bananas `piles[i]`. Each hour Koko picks one pile and eats up to `k` bananas from it (if fewer remain she finishes that pile and waits). Find the minimum integer `k` so she finishes all piles within `h` hours (`h >= len(piles)`).

Example: `piles = [3,6,7,11], h = 8` -> `4`.

## Intuition

`hours(k) = sum(ceil(p / k))` is non-increasing in `k`. So "can finish at speed k" is false...false, true...true over `k` in `[1, max(piles)]`: binary search for the first true.

## Brute force

Try `k = 1, 2, ...` until feasible. O(max(piles) * n).

## Optimized approach

`lo = 1`, `hi = max(piles)`. While `lo < hi`: `mid = (lo + hi) // 2`; if `hours(mid) <= h`, `hi = mid` else `lo = mid + 1`. Return `lo`.

## Complexity

Time O(n log max(piles)), space O(1).

## Implementation

### Python

```python
class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        lo, hi = 1, max(piles)
        while lo < hi:
            mid = (lo + hi) // 2
            hours = sum((p + mid - 1) // mid for p in piles)
            if hours <= h:
                hi = mid
            else:
                lo = mid + 1
        return lo
```

### Java

```java
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int lo = 1, hi = 0;
        for (int p : piles) hi = Math.max(hi, p);
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long hours = 0;
            for (int p : piles) hours += (p + mid - 1L) / mid;
            if (hours <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
}
```

### C++

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int lo = 1, hi = *max_element(piles.begin(), piles.end());
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            long long hours = 0;
            for (int p : piles) hours += (p + (long long)mid - 1) / mid;
            if (hours <= h) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};
```

## Edge cases

- `h == len(piles)`: answer is `max(piles)`.
- Very large `h`: answer 1.
- Piles near 10^9: hour totals overflow 32-bit, and `p + mid - 1` can overflow too; use 64-bit.

## Common mistakes

- Using floating-point `ceil` (precision issues) instead of integer `(p + k - 1) / k`.
- `lo = 0` leading to division by zero.

## Follow-ups

- Same template: Capacity to Ship Packages Within D Days, Split Array Largest Sum, Minimum Days to Make Bouquets.
- State the monotonic predicate explicitly before coding — the key interview signal.
