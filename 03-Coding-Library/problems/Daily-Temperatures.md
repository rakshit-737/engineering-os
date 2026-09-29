---
title: Daily Temperatures
description: Next greater element distances with a monotonic decreasing stack of indices.
domain: dsa
category: stack
type: problem
difficulty: intermediate
status: evergreen
tags: [monotonic-stack, arrays]
prerequisites: [Stack-and-Monotonic-Stack-Pattern]
related: [Valid-Parentheses, Sliding-Window-Maximum, Trapping-Rain-Water]
pattern: stack
source: "LeetCode 739"
languages: [python, java, cpp]
---

# Daily Temperatures

Pattern: [[Stack-and-Monotonic-Stack-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given daily temperatures, return for each day how many days you must wait for a strictly warmer day, or 0 if none comes.

Example: `[73,74,75,71,69,72,76,73]` -> `[1,1,4,2,1,1,0,0]`.

## Intuition

This is "next greater element". Days still waiting for a warmer day form a stack with non-increasing temperatures; a new warmer day resolves every colder day on top of the stack.

## Brute force

For each day scan forward. Time O(n^2), space O(1).

## Optimized approach

Stack of indices. For each `i`: while the stack top's temperature is less than `t[i]`, pop `j` and set `ans[j] = i - j`. Push `i`.

## Complexity

Time O(n) (each index pushed and popped once), space O(n).

## Implementation

### Python

```python
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        ans = [0] * len(temperatures)
        stack = []
        for i, t in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < t:
                j = stack.pop()
                ans[j] = i - j
            stack.append(i)
        return ans
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int j = stack.pop();
                ans[j] = i - j;
            }
            stack.push(i);
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
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0), st;
        for (int i = 0; i < n; ++i) {
            while (!st.empty() && temperatures[st.back()] < temperatures[i]) {
                ans[st.back()] = i - st.back();
                st.pop_back();
            }
            st.push_back(i);
        }
        return ans;
    }
};
```

## Edge cases

- Strictly decreasing: all zeros.
- Equal temperatures: strict `<` means equal does not count as warmer.
- Single day: `[0]`.

## Common mistakes

- Storing temperatures instead of indices (you need the distance).
- Using `<=` when the problem requires strictly warmer.

## Follow-ups

- Next greater element in a circular array: iterate `2n` indices modulo `n`.
- Previous smaller element: same stack, different comparison — building block for [[Largest-Rectangle-in-Histogram]].
- Stock span problem.
