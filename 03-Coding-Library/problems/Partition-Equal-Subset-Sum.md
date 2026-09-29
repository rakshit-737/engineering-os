---
title: Partition Equal Subset Sum
description: 0/1 knapsack feasibility - can a subset reach half the total sum - with a 1D boolean DP.
domain: dsa
category: dp-knapsack
type: problem
difficulty: intermediate
status: evergreen
tags: [dp, knapsack, subset-sum]
prerequisites: [DP-Pattern, Coin-Change]
related: [Coin-Change, Subsets]
pattern: dp-knapsack
source: "LeetCode 416"
languages: [python, java, cpp]
---

# Partition Equal Subset Sum

Pattern: [[DP-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an array of positive integers, decide whether it can be split into two subsets with equal sums.

Example: `[1,5,11,5]` -> true (`[1,5,5]` and `[11]`); `[1,2,3,5]` -> false.

## Intuition

Equal halves means some subset sums to `total / 2` (so `total` must be even). That is subset-sum: a 0/1 knapsack where each item is used at most once.

## Brute force

Try all 2^n subsets. Exponential.

## Optimized approach

`dp[s]` = some subset of processed items sums to `s`. Start `dp[0] = true`. For each `x`, iterate `s` from `target` down to `x`: `dp[s] |= dp[s - x]`. Iterating downward prevents reusing `x` in the same round (the defining difference from unbounded knapsack like [[Coin-Change]]).

## Complexity

Time O(n * target), space O(target). Pseudo-polynomial: depends on the sum's magnitude.

## Implementation

### Python

```python
class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [True] + [False] * target
        for x in nums:
            for s in range(target, x - 1, -1):
                dp[s] = dp[s] or dp[s - x]
            if dp[target]:
                return True
        return dp[target]
```

### Java

```java
class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 != 0) return false;
        int target = total / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;
        for (int x : nums)
            for (int s = target; s >= x; s--)
                dp[s] = dp[s] || dp[s - x];
        return dp[target];
    }
}
```

### C++

```cpp
#include <bitset>
#include <numeric>
#include <vector>
using namespace std;

class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int total = accumulate(nums.begin(), nums.end(), 0);
        if (total % 2) return false;
        int target = total / 2;
        vector<char> dp(target + 1, 0);
        dp[0] = 1;
        for (int x : nums)
            for (int s = target; s >= x; --s)
                dp[s] = dp[s] || dp[s - x];
        return dp[target];
    }
};
```

C++ bitset trick (when the max sum is bounded, e.g. 20000): `bitset<20001> b(1); for (int x : nums) b |= b << x; return b[target];`.

## Edge cases

- Odd total: false immediately.
- Single element: false (unless the problem allows empty subsets and it is 0; values are positive here).
- An element larger than `target`: it just never updates.

## Common mistakes

- Iterating `s` upward, which lets one item count multiple times.
- Using `vector<bool>` in hot loops in C++ (bit-proxy overhead; `vector<char>` is simpler).

## Follow-ups

- Target Sum (assign +/- signs): reduces to subset sum with `(total + target) / 2`.
- Minimize the difference between two subset sums.
- Partition into k equal subsets: backtracking with pruning or bitmask DP.
