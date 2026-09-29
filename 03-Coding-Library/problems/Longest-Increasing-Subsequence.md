---
title: Longest Increasing Subsequence
description: O(n log n) LIS using patience-sorting tails and binary search, with the O(n^2) DP as baseline.
domain: dsa
category: dp-lis
type: problem
difficulty: intermediate
status: evergreen
tags: [dp, binary-search, lis]
prerequisites: [DP-Pattern, Binary-Search-Pattern]
related: [Longest-Common-Subsequence, Merge-Intervals]
pattern: dp-lis
source: "LeetCode 300"
languages: [python, java, cpp]
---

# Longest Increasing Subsequence

Pattern: [[DP-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Return the length of the longest strictly increasing subsequence of an integer array.

Example: `[10,9,2,5,3,7,101,18]` -> `4` (e.g. `[2,3,7,101]`).

## Intuition

`tails[k]` = the smallest possible tail value of an increasing subsequence of length `k + 1`. A smaller tail is always at least as good for extension. `tails` stays sorted, so each new number either extends the longest one or replaces the first tail `>= x` (binary search).

## Brute force

`dp[i]` = LIS ending at `i` = `1 + max(dp[j])` over `j < i` with `nums[j] < nums[i]`. O(n^2) time, O(n) space. (Enumerating subsequences is O(2^n).)

## Optimized approach

For each `x`: `i = lower_bound(tails, x)`; if `i == len(tails)` append, else `tails[i] = x`. Answer `len(tails)`. Note `tails` is not itself an LIS, only its length is meaningful.

## Complexity

Time O(n log n), space O(n).

## Implementation

### Python

```python
from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums: list[int]) -> int:
        tails = []
        for x in nums:
            i = bisect_left(tails, x)
            if i == len(tails):
                tails.append(x)
            else:
                tails[i] = x
        return len(tails)
```

### Java

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0, hi = size;               // first index with tails[i] >= x
            while (lo < hi) {
                int mid = (lo + hi) >>> 1;
                if (tails[mid] < x) lo = mid + 1;
                else hi = mid;
            }
            tails[lo] = x;
            if (lo == size) size++;
        }
        return size;
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
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};
```

## Edge cases

- Strictly decreasing: 1.
- All equal: 1 (strictly increasing, so `lower_bound`, not `upper_bound`).
- Single element: 1.

## Common mistakes

- Using `upper_bound`/`bisect_right`, which computes the longest non-decreasing subsequence.
- Claiming `tails` is the actual subsequence.

## Follow-ups

- Reconstruct one LIS: store the index in `tails` and a parent pointer per element.
- Number of LIS: O(n^2) DP with counts.
- Russian Doll Envelopes: sort by width asc, height desc, then LIS on heights.
