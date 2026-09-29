---
title: Two Sum
description: Find the indices of two numbers that add up to a target using a one-pass hash map.
domain: dsa
category: arrays-and-hashing
type: problem
difficulty: beginner
status: evergreen
tags: [arrays, hashing]
prerequisites: [Arrays-and-Hashing-Pattern]
related: [Three-Sum, Subarray-Sum-Equals-K, Two-Pointer-Pattern]
pattern: arrays-and-hashing
source: "LeetCode 1"
languages: [python, java, cpp]
---

# Two Sum

Pattern: [[Arrays-and-Hashing-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an integer array `nums` and an integer `target`, return the indices of the two distinct positions whose values sum to `target`. Exactly one valid pair exists; you may not use the same index twice.

Example: `nums = [2, 7, 11, 15], target = 9` -> `[0, 1]`.

## Intuition

For each number `x`, the partner we need is `target - x`. If we remember every value we have already seen together with its index, checking for the partner is a single hash lookup.

## Brute force

Try every pair `(i, j)` with `i < j`. Time O(n^2), space O(1).

## Optimized approach

Walk left to right. For index `i`, look up `target - nums[i]` in a map of value -> index. If present, return both indices; otherwise store `nums[i] -> i`. Checking before inserting guarantees we never pair an index with itself.

## Complexity

Time O(n) expected, space O(n).

## Implementation

### Python

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            Integer j = seen.get(target - nums[i]);
            if (j != null) return new int[]{j, i};
            seen.put(nums[i], i);
        }
        return new int[0];
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
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); ++i) {
            auto it = seen.find(target - nums[i]);
            if (it != seen.end()) return {it->second, i};
            seen[nums[i]] = i;
        }
        return {};
    }
};
```

## Edge cases

- Duplicate values that form the answer: `[3, 3], target 6` -> `[0, 1]` works because we check before inserting.
- Negative numbers and zero.
- `target - x` overflow in C++/Java when values are near `INT_MIN`/`INT_MAX` (use `long` if constraints allow extremes).

## Common mistakes

- Inserting before checking, which pairs an element with itself (`[3], target 6`).
- Sorting to use two pointers and then returning sorted-order indices instead of original ones.

## Follow-ups

- Input is sorted: two pointers, O(1) space (Two Sum II).
- Return all unique pairs, or count pairs: handle duplicates with a frequency map.
- Extend to [[Three-Sum]] and 4Sum.
- Data stream version: `add(x)` / `find(target)` design with a frequency map.
