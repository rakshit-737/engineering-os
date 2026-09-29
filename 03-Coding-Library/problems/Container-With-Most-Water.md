---
title: Container With Most Water
description: Maximize the water held between two lines by converging pointers and always moving the shorter side.
domain: dsa
category: two-pointers
type: problem
difficulty: intermediate
status: evergreen
tags: [two-pointers, greedy, arrays]
prerequisites: [Two-Pointer-Pattern]
related: [Three-Sum, Greedy-Pattern]
pattern: two-pointers
source: "LeetCode 11"
languages: [python, java, cpp]
---

# Container With Most Water

Pattern: [[Two-Pointer-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

`height[i]` is the height of a vertical line at x = i. Pick two lines; together with the x-axis they form a container holding `min(height[i], height[j]) * (j - i)` water. Return the maximum.

Example: `[1,8,6,2,5,4,8,3,7]` -> `49` (lines at index 1 and 8: `min(8,7) * 7`).

## Intuition

Start with the widest container. Area is capped by the shorter line. Moving the taller pointer inward can only shrink width while the cap stays at most the shorter height, so it never helps. Moving the shorter one is the only move that might.

## Brute force

All pairs. Time O(n^2), space O(1).

## Optimized approach

`lo = 0`, `hi = n - 1`. Record the area, then move whichever pointer has the smaller height (either on ties). Stop when they meet.

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
class Solution:
    def maxArea(self, height: list[int]) -> int:
        lo, hi, best = 0, len(height) - 1, 0
        while lo < hi:
            best = max(best, min(height[lo], height[hi]) * (hi - lo))
            if height[lo] < height[hi]:
                lo += 1
            else:
                hi -= 1
        return best
```

### Java

```java
class Solution {
    public int maxArea(int[] height) {
        int lo = 0, hi = height.length - 1, best = 0;
        while (lo < hi) {
            best = Math.max(best, Math.min(height[lo], height[hi]) * (hi - lo));
            if (height[lo] < height[hi]) lo++;
            else hi--;
        }
        return best;
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
    int maxArea(vector<int>& height) {
        int lo = 0, hi = (int)height.size() - 1, best = 0;
        while (lo < hi) {
            best = max(best, min(height[lo], height[hi]) * (hi - lo));
            if (height[lo] < height[hi]) ++lo;
            else --hi;
        }
        return best;
    }
};
```

## Edge cases

- Two lines: one candidate.
- Zero heights.
- Strictly increasing or decreasing heights.

## Common mistakes

- Moving the taller pointer.
- Confusing this with [[Trapping-Rain-Water]] (that sums water over every bar; this picks one pair).

## Follow-ups

- Prove the greedy move with an exchange argument out loud.
- Trapping Rain Water: the natural next question.
