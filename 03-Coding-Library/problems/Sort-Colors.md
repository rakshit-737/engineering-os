---
title: Sort Colors
description: One-pass in-place Dutch National Flag partition of 0s, 1s and 2s with three pointers.
domain: dsa
category: sorting
type: problem
difficulty: intermediate
status: evergreen
tags: [sorting, two-pointers, partition]
prerequisites: [Sorting-and-Searching-Pattern, Two-Pointer-Pattern]
related: [Top-K-Frequent-Elements, Kth-Largest-Element-in-an-Array]
pattern: sorting
source: "LeetCode 75"
languages: [python, java, cpp]
---

# Sort Colors

Pattern: [[Sorting-and-Searching-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

An array contains only 0, 1 and 2. Sort it in place so all 0s come first, then 1s, then 2s, without using a library sort.

Example: `[2,0,2,1,1,0]` -> `[0,0,1,1,2,2]`.

## Intuition

Maintain three regions: `[0, lo)` all 0s, `[lo, mid)` all 1s, `(hi, n-1]` all 2s; `[mid, hi]` is unknown. Classify `nums[mid]` and shrink the unknown region.

## Brute force

Counting sort: count each value, then overwrite. O(n) time, two passes — acceptable, but the one-pass partition is the expected follow-up.

## Optimized approach

- `nums[mid] == 0`: swap with `nums[lo]`, `lo++`, `mid++`.
- `nums[mid] == 1`: `mid++`.
- `nums[mid] == 2`: swap with `nums[hi]`, `hi--` (do not advance `mid`: the swapped-in value is unclassified).

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        lo, mid, hi = 0, 0, len(nums) - 1
        while mid <= hi:
            if nums[mid] == 0:
                nums[lo], nums[mid] = nums[mid], nums[lo]
                lo += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                nums[mid], nums[hi] = nums[hi], nums[mid]
                hi -= 1
```

### Java

```java
class Solution {
    public void sortColors(int[] nums) {
        int lo = 0, mid = 0, hi = nums.length - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) swap(nums, lo++, mid++);
            else if (nums[mid] == 1) mid++;
            else swap(nums, mid, hi--);
        }
    }

    private void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }
}
```

### C++

```cpp
#include <utility>
#include <vector>
using namespace std;

class Solution {
public:
    void sortColors(vector<int>& nums) {
        int lo = 0, mid = 0, hi = (int)nums.size() - 1;
        while (mid <= hi) {
            if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);
            else if (nums[mid] == 1) ++mid;
            else swap(nums[mid], nums[hi--]);
        }
    }
};
```

## Edge cases

- All the same color.
- Length 1.
- Already sorted or reverse sorted.

## Common mistakes

- Advancing `mid` after swapping with `hi`.
- Loop condition `mid < hi` (misses the last unknown element).

## Follow-ups

- This is the 3-way partition used in quicksort for many duplicate keys.
- k colors: counting sort O(n + k), or recursive partitioning O(n log k).
