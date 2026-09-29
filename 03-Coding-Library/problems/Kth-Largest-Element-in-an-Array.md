---
title: Kth Largest Element in an Array
description: Keep a size-k min-heap (O(n log k)) or use quickselect (O(n) average).
domain: dsa
category: heap
type: problem
difficulty: intermediate
status: evergreen
tags: [heap, quickselect, sorting]
prerequisites: [Heap-Pattern]
related: [Merge-K-Sorted-Lists, Top-K-Frequent-Elements, Kth-Smallest-Element-in-a-BST]
pattern: heap
source: "LeetCode 215"
languages: [python, java, cpp]
---

# Kth Largest Element in an Array

Pattern: [[Heap-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Return the kth largest element in an unsorted array (kth in sorted order, duplicates counted).

Example: `nums = [3,2,1,5,6,4], k = 2` -> `5`.

## Intuition

We only need the k largest seen so far; the smallest of those is the answer. A min-heap of size k keeps exactly that, with the answer at the top.

## Brute force

Sort descending, return index `k - 1`. O(n log n).

## Optimized approach

Push each number into a min-heap; if its size exceeds k, pop the minimum. The heap top is the answer. Quickselect (partition around a random pivot, recurse into one side) gives O(n) average but O(n^2) worst case.

## Complexity

Heap: O(n log k) time, O(k) space. Quickselect: O(n) average time, O(1) extra space.

## Implementation

### Python

```python
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]
```

### Java

```java
import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int x : nums) {
            heap.offer(x);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }
}
```

### C++

```cpp
#include <functional>
#include <queue>
#include <vector>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;
        for (int x : nums) {
            heap.push(x);
            if ((int)heap.size() > k) heap.pop();
        }
        return heap.top();
    }
};
```

C++ one-liner alternative: `nth_element(nums.begin(), nums.begin() + k - 1, nums.end(), greater<int>()); return nums[k - 1];` (introselect, linear on average).

## Edge cases

- `k = 1` (maximum) and `k = n` (minimum).
- Duplicates: `[3,3,3], k = 2` -> 3.

## Common mistakes

- Using a max-heap of all n elements and popping k times (works, but O(n + k log n) and more memory — say so).
- Quickselect without a random pivot degrades on sorted input.

## Follow-ups

- Streaming kth largest (design class): keep the size-k min-heap.
- Top K frequent elements: [[Top-K-Frequent-Elements]].
- Explain when O(n log k) beats O(n log n): k much smaller than n.
