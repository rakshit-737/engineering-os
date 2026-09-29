---
title: Largest Rectangle in Histogram
description: Find the largest rectangle under a histogram using a monotonic increasing stack of indices.
domain: dsa
category: stack
type: problem
difficulty: advanced
status: evergreen
tags: [monotonic-stack, arrays]
prerequisites: [Stack-and-Monotonic-Stack-Pattern, Daily-Temperatures]
related: [Daily-Temperatures, Trapping-Rain-Water]
pattern: stack
source: "LeetCode 84"
languages: [python, java, cpp]
---

# Largest Rectangle in Histogram

Pattern: [[Stack-and-Monotonic-Stack-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given bar heights of width 1, return the area of the largest axis-aligned rectangle that fits entirely under the histogram.

Example: `[2,1,5,6,2,3]` -> `10` (bars 5 and 6, height 5, width 2).

## Intuition

The best rectangle uses some bar `i` as its shortest bar and extends left and right until a strictly shorter bar. Those limits are the previous-smaller and next-smaller elements, which a monotonic increasing stack produces in one pass.

## Brute force

For each bar expand left/right while bars are at least as tall. O(n^2).

## Optimized approach

Keep indices with increasing heights. When bar `i` is shorter than the top, pop `top`: its right limit is `i`, its left limit is the new stack top (or -1). Area = `h[top] * (i - left - 1)`. Append a sentinel height 0 at the end to flush the stack.

## Complexity

Time O(n), space O(n).

## Implementation

### Python

```python
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        stack, best = [], 0
        for i, h in enumerate(heights + [0]):
            while stack and heights[stack[-1]] > h:
                top = stack.pop()
                left = stack[-1] if stack else -1
                best = max(best, heights[top] * (i - left - 1))
            stack.append(i)
        return best
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length, best = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i <= n; i++) {
            int h = (i == n) ? 0 : heights[i];
            while (!stack.isEmpty() && heights[stack.peek()] > h) {
                int top = stack.pop();
                int left = stack.isEmpty() ? -1 : stack.peek();
                best = Math.max(best, heights[top] * (i - left - 1));
            }
            stack.push(i);
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
    int largestRectangleArea(vector<int>& heights) {
        int n = heights.size(), best = 0;
        vector<int> st;
        for (int i = 0; i <= n; ++i) {
            int h = (i == n) ? 0 : heights[i];
            while (!st.empty() && heights[st.back()] > h) {
                int top = st.back(); st.pop_back();
                int left = st.empty() ? -1 : st.back();
                best = max(best, heights[top] * (i - left - 1));
            }
            st.push_back(i);
        }
        return best;
    }
};
```

## Edge cases

- Single bar.
- All equal heights: the whole width.
- Increasing heights: everything resolves at the sentinel.

## Common mistakes

- Forgetting the sentinel, leaving bars on the stack unprocessed.
- Width computed as `i - top` instead of `i - left - 1`.

## Follow-ups

- Maximal Rectangle in a binary matrix: build a histogram per row and reuse this.
- Why each index is pushed/popped once (amortized argument).
