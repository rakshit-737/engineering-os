---
title: Search in Rotated Sorted Array
description: Modified binary search - one half is always sorted; decide which half can hold the target.
domain: dsa
category: binary-search
type: problem
difficulty: intermediate
status: evergreen
tags: [binary-search, arrays]
prerequisites: [Binary-Search-Pattern, Binary-Search]
related: [Koko-Eating-Bananas, Sort-Colors]
pattern: binary-search
source: "LeetCode 33"
languages: [python, java, cpp]
---

# Search in Rotated Sorted Array

Pattern: [[Binary-Search-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

A sorted array of distinct integers was rotated at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` -> `[4,5,6,7,0,1,2]`). Return the index of `target`, or -1, in O(log n).

Example: `nums = [4,5,6,7,0,1,2], target = 0` -> `4`.

## Intuition

Split at `mid`: at least one of `[lo, mid]` and `[mid, hi]` is sorted (the rotation point lies in at most one of them). In the sorted half a range check tells us whether the target can be there.

## Brute force

Linear scan. O(n).

## Optimized approach

While `lo <= hi`: if `nums[mid] == target` return. If `nums[lo] <= nums[mid]` (left sorted): go left if `nums[lo] <= target < nums[mid]`, else right. Otherwise (right sorted): go right if `nums[mid] < target <= nums[hi]`, else left.

## Complexity

Time O(log n), space O(1).

## Implementation

### Python

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if nums[mid] == target:
                return mid
            if nums[lo] <= nums[mid]:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
            else:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
        return -1
```

### Java

```java
class Solution {
    public int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
};
```

## Edge cases

- No rotation.
- Two elements `[3,1]`: `nums[lo] <= nums[mid]` must use `<=` since `lo == mid`.
- Target absent.

## Common mistakes

- `<` instead of `<=` in `nums[lo] <= nums[mid]`.
- Mixing inclusive/exclusive bounds in the range checks.

## Follow-ups

- With duplicates (Search in Rotated Sorted Array II): when `nums[lo] == nums[mid] == nums[hi]`, shrink both ends; worst case O(n).
- Find the minimum / rotation index.
- Alternative: find the pivot first, then do a normal binary search on the right half.
