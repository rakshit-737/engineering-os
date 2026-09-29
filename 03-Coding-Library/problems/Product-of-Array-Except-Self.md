---
title: Product of Array Except Self
description: Compute each position's product of all other elements with prefix and suffix products, no division.
domain: dsa
category: arrays-and-hashing
type: problem
difficulty: intermediate
status: evergreen
tags: [arrays, prefix-product]
prerequisites: [Prefix-Sum-Pattern]
related: [Subarray-Sum-Equals-K, Arrays-and-Hashing-Pattern]
pattern: arrays-and-hashing
source: "LeetCode 238"
languages: [python, java, cpp]
---

# Product of Array Except Self

Pattern: [[Arrays-and-Hashing-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an integer array `nums`, return `answer` where `answer[i]` is the product of every element except `nums[i]`. Do it in O(n) without using division.

Example: `[1, 2, 3, 4]` -> `[24, 12, 8, 6]`.

## Intuition

`answer[i] = (product of everything left of i) * (product of everything right of i)`. Both are running products — the multiplicative cousin of prefix sums ([[Prefix-Sum-Pattern]]).

## Brute force

For each `i`, multiply all other elements. Time O(n^2), space O(1) extra.

## Optimized approach

Pass 1 (left to right): `answer[i] = product of nums[0..i-1]`. Pass 2 (right to left): keep a running `suffix` and multiply it into `answer[i]`, then update `suffix *= nums[i]`. The output array doubles as the prefix storage, so extra space is O(1).

## Complexity

Time O(n), extra space O(1) (output excluded).

## Implementation

### Python

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        ans = [1] * n
        for i in range(1, n):
            ans[i] = ans[i - 1] * nums[i - 1]
        suffix = 1
        for i in range(n - 1, -1, -1):
            ans[i] *= suffix
            suffix *= nums[i]
        return ans
```

### Java

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, 1);
        for (int i = 1; i < n; ++i) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; --i) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
};
```

## Edge cases

- One zero: every position except the zero's becomes 0.
- Two or more zeros: everything is 0.
- Negative numbers.

## Common mistakes

- Using total product / `nums[i]`: breaks on zeros and is disallowed.
- Off-by-one: prefix for index `i` must exclude `nums[i]`.

## Follow-ups

- Why is division bad even when allowed? Zeros, and integer overflow of the total product.
- 2D version: product of the matrix except the cell (row/column prefix products or flatten).
