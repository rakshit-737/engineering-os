---
title: Subarray Sum Equals K
description: Count subarrays summing to k with prefix sums and a hash map of prefix frequencies.
domain: dsa
category: prefix-sum
type: problem
difficulty: intermediate
status: evergreen
tags: [prefix-sum, hashing, arrays]
prerequisites: [Prefix-Sum-Pattern, Two-Sum]
related: [Two-Sum, Product-of-Array-Except-Self]
pattern: prefix-sum
source: "LeetCode 560"
languages: [python, java, cpp]
---

# Subarray Sum Equals K

Pattern: [[Prefix-Sum-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an integer array (values may be negative) and an integer `k`, count the contiguous non-empty subarrays whose sum equals `k`.

Example: `nums = [1, 2, 3], k = 3` -> `2` (`[1,2]` and `[3]`).

## Intuition

`sum(i..j) = P[j+1] - P[i]`, where `P` is the prefix sum. So we need the number of earlier prefixes equal to `P_current - k` — that is [[Two-Sum]] on prefix sums.

## Brute force

Fix a start, extend the end, maintain a running sum. Time O(n^2), space O(1).

## Optimized approach

Map `count[prefix]`, seeded with `count[0] = 1` (the empty prefix). For each element: `prefix += x`; `ans += count[prefix - k]`; `count[prefix] += 1`.

## Complexity

Time O(n), space O(n).

## Implementation

### Python

```python
from collections import defaultdict

class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        count = defaultdict(int)
        count[0] = 1
        prefix = ans = 0
        for x in nums:
            prefix += x
            ans += count[prefix - k]
            count[prefix] += 1
        return ans
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        count.put(0, 1);
        int prefix = 0, ans = 0;
        for (int x : nums) {
            prefix += x;
            ans += count.getOrDefault(prefix - k, 0);
            count.merge(prefix, 1, Integer::sum);
        }
        return ans;
    }
}
```

### C++

```cpp
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> count{{0, 1}};
        int prefix = 0, ans = 0;
        for (int x : nums) {
            prefix += x;
            auto it = count.find(prefix - k);
            if (it != count.end()) ans += it->second;
            ++count[prefix];
        }
        return ans;
    }
};
```

## Edge cases

- `k = 0` with zeros in the array: `[0,0]` -> 3.
- Negative numbers: why sliding window fails here.
- Whole array sums to `k`: needs the `count[0] = 1` seed.

## Common mistakes

- Forgetting the `{0: 1}` seed.
- Trying a sliding window: it requires non-negative values to be monotonic.
- Updating `count[prefix]` before querying (counts empty subarrays when `k = 0`).

## Follow-ups

- Longest subarray with sum k: store the first index of each prefix instead of counts.
- Subarray sum divisible by k: key by `prefix mod k` (normalize negatives).
- 2D: count submatrices summing to target (fix row pair, run this on column sums).
