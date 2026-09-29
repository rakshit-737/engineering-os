---
title: Trapping Rain Water
description: Sum trapped water using converging pointers that track the running max from each side.
domain: dsa
category: two-pointers
type: problem
difficulty: advanced
status: evergreen
tags: [two-pointers, arrays, monotonic-stack]
prerequisites: [Two-Pointer-Pattern]
related: [Container-With-Most-Water, Largest-Rectangle-in-Histogram, Stack-and-Monotonic-Stack-Pattern]
pattern: two-pointers
source: "LeetCode 42"
languages: [python, java, cpp]
---

# Trapping Rain Water

Pattern: [[Two-Pointer-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given non-negative bar heights of width 1, compute how many units of rain water are trapped between the bars.

Example: `[0,1,0,2,1,0,1,3,2,1,2,1]` -> `6`.

## Intuition

Water above bar `i` = `min(maxLeft[i], maxRight[i]) - height[i]`. With two pointers, whichever side has the smaller running max is the binding constraint, so that side's water is already known.

## Brute force

For each bar scan left and right for maxima. Time O(n^2), space O(1). A prefix/suffix max array version is O(n) time, O(n) space.

## Optimized approach

`lo, hi` at the ends, `leftMax = rightMax = 0`. If `height[lo] < height[hi]`: update `leftMax`, add `leftMax - height[lo]`, `lo++`. Otherwise do the mirror on the right. Correct because the other side contains a bar at least as tall, so the smaller max bounds the water.

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
class Solution:
    def trap(self, height: list[int]) -> int:
        lo, hi = 0, len(height) - 1
        left_max = right_max = water = 0
        while lo < hi:
            if height[lo] < height[hi]:
                left_max = max(left_max, height[lo])
                water += left_max - height[lo]
                lo += 1
            else:
                right_max = max(right_max, height[hi])
                water += right_max - height[hi]
                hi -= 1
        return water
```

### Java

```java
class Solution {
    public int trap(int[] height) {
        int lo = 0, hi = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
        while (lo < hi) {
            if (height[lo] < height[hi]) {
                leftMax = Math.max(leftMax, height[lo]);
                water += leftMax - height[lo++];
            } else {
                rightMax = Math.max(rightMax, height[hi]);
                water += rightMax - height[hi--];
            }
        }
        return water;
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
    int trap(vector<int>& height) {
        int lo = 0, hi = (int)height.size() - 1, leftMax = 0, rightMax = 0, water = 0;
        while (lo < hi) {
            if (height[lo] < height[hi]) {
                leftMax = max(leftMax, height[lo]);
                water += leftMax - height[lo++];
            } else {
                rightMax = max(rightMax, height[hi]);
                water += rightMax - height[hi--];
            }
        }
        return water;
    }
};
```

## Edge cases

- Empty array or fewer than 3 bars: 0.
- Monotonic heights: 0.
- Flat plateaus.

## Common mistakes

- Updating the max after adding water (gives negative water).
- Moving the pointer on the side with the larger height.

## Follow-ups

- Monotonic stack solution (computes water layer by layer) — see [[Stack-and-Monotonic-Stack-Pattern]].
- Trapping Rain Water II (2D grid): min-heap from the border inward ([[Heap-Pattern]]).
