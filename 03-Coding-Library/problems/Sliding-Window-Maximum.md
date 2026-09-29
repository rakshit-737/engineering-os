---
title: Sliding Window Maximum
description: Maximum of every window of size k using a monotonic deque of indices.
domain: dsa
category: queue-deque
type: problem
difficulty: advanced
status: evergreen
tags: [deque, sliding-window, monotonic-queue]
prerequisites: [Queue-and-Deque-Pattern, Sliding-Window-Pattern]
related: [Daily-Temperatures, Kth-Largest-Element-in-an-Array, Longest-Substring-Without-Repeating-Characters]
pattern: queue-deque
source: "LeetCode 239"
languages: [python, java, cpp]
---

# Sliding Window Maximum

Pattern: [[Queue-and-Deque-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an array and window size `k`, return the maximum of each contiguous window of length `k` as it slides from left to right.

Example: `nums = [1,3,-1,-3,5,3,6,7], k = 3` -> `[3,3,5,5,6,7]`.

## Intuition

An element that is smaller than a newer element can never be a window maximum again (the newer one outlives it). Keep only "possible future maxima" in a deque with decreasing values; the front is the current max.

## Brute force

Scan each window: O(n * k). A max-heap with lazy deletion gives O(n log n).

## Optimized approach

Deque of indices, values decreasing front to back. For each `i`: pop the front if it left the window (`dq[0] <= i - k`); pop from the back while `nums[back] <= nums[i]`; push `i`; once `i >= k - 1`, record `nums[dq[0]]`.

## Complexity

Time O(n) (each index enters and leaves once), space O(k).

## Implementation

### Python

```python
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq, out = deque(), []
        for i, x in enumerate(nums):
            if dq and dq[0] <= i - k:
                dq.popleft()
            while dq and nums[dq[-1]] <= x:
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                out.append(nums[dq[0]])
        return out
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] out = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) out[i - k + 1] = nums[dq.peekFirst()];
        }
        return out;
    }
}
```

### C++

```cpp
#include <deque>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq;
        vector<int> out;
        for (int i = 0; i < (int)nums.size(); ++i) {
            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();
            while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) out.push_back(nums[dq.front()]);
        }
        return out;
    }
};
```

## Edge cases

- `k = 1`: output equals input.
- `k = n`: single maximum.
- Duplicates and negative values.

## Common mistakes

- Storing values instead of indices (cannot tell when the front expired).
- Evicting the front with `<` instead of `<=` against `i - k`.

## Follow-ups

- Sliding window minimum: flip the comparison.
- Shortest subarray with sum at least K (negatives allowed): monotonic deque over prefix sums.
- Heap-based alternative and why it is O(n log n).
