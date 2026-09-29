---
title: 3Sum
description: Find all unique triplets summing to zero by sorting, fixing one element and converging two pointers.
domain: dsa
category: two-pointers
type: problem
difficulty: intermediate
status: evergreen
tags: [two-pointers, sorting, arrays]
prerequisites: [Two-Pointer-Pattern, Two-Sum]
related: [Two-Sum, Container-With-Most-Water]
pattern: two-pointers
source: "LeetCode 15"
languages: [python, java, cpp]
---

# 3Sum

Pattern: [[Two-Pointer-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an integer array, return every unique triplet of values `[a, b, c]` (taken from three different indices) with `a + b + c == 0`. The output must not contain duplicate triplets.

Example: `[-1, 0, 1, 2, -1, -4]` -> `[ [-1, -1, 2], [-1, 0, 1] ]`.

## Intuition

Fix the smallest element `a = nums[i]`; the rest is sorted Two Sum for target `-a`, solvable with converging pointers. Sorting also makes duplicate skipping easy: equal values are adjacent.

## Brute force

Three nested loops plus a set of sorted triplets for dedup. Time O(n^3).

## Optimized approach

1. Sort.
2. For each `i` (skip if `nums[i] == nums[i-1]`; stop if `nums[i] > 0`), set `lo = i + 1`, `hi = n - 1`.
3. If the sum is too small, `lo++`; too big, `hi--`; zero, record, then advance both and skip duplicates on `lo`.

## Complexity

Time O(n^2) (sort O(n log n) is dominated), space O(1) extra apart from the output (sort may use O(log n) stack).

## Implementation

### Python

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        n, res = len(nums), []
        for i in range(n - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, n - 1
            while lo < hi:
                s = nums[i] + nums[lo] + nums[hi]
                if s < 0:
                    lo += 1
                elif s > 0:
                    hi -= 1
                else:
                    res.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
        return res
```

### Java

```java
import java.util.*;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> res = new ArrayList<>();
        int n = nums.length;
        for (int i = 0; i < n - 2 && nums[i] <= 0; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                int s = nums[i] + nums[lo] + nums[hi];
                if (s < 0) lo++;
                else if (s > 0) hi--;
                else {
                    res.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                    lo++;
                    hi--;
                    while (lo < hi && nums[lo] == nums[lo - 1]) lo++;
                }
            }
        }
        return res;
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
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        int n = nums.size();
        for (int i = 0; i + 2 < n && nums[i] <= 0; ++i) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int lo = i + 1, hi = n - 1;
            while (lo < hi) {
                int s = nums[i] + nums[lo] + nums[hi];
                if (s < 0) ++lo;
                else if (s > 0) --hi;
                else {
                    res.push_back({nums[i], nums[lo], nums[hi]});
                    ++lo; --hi;
                    while (lo < hi && nums[lo] == nums[lo - 1]) ++lo;
                }
            }
        }
        return res;
    }
};
```

## Edge cases

- Fewer than 3 elements: empty result.
- All zeros `[0,0,0,0]` -> exactly one triplet `[0,0,0]`.
- No solution.

## Common mistakes

- Missing duplicate skipping on `i` or on `lo`, producing repeated triplets.
- Skipping duplicates on `i` by comparing with `nums[i+1]` (drops valid triplets like `[-1,-1,2]`).

## Follow-ups

- 3Sum Closest: same loop, track minimum `|sum - target|`.
- 4Sum / kSum: recursion down to the two-pointer base case, O(n^(k-1)).
- Why not a hash set per `i`? It works in O(n^2) too, but dedup is messier and uses O(n) space.
