---
title: Top K Frequent Elements
description: Return the k most frequent values with bucket sort by frequency in O(n), or a size-k heap.
domain: dsa
category: sorting
type: problem
difficulty: intermediate
status: evergreen
tags: [sorting, bucket-sort, heap, hashing]
prerequisites: [Sorting-and-Searching-Pattern, Heap-Pattern]
related: [Kth-Largest-Element-in-an-Array, Group-Anagrams, Sort-Colors]
pattern: sorting
source: "LeetCode 347"
languages: [python, java, cpp]
---

# Top K Frequent Elements

Pattern: [[Sorting-and-Searching-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an integer array and `k`, return the `k` values that occur most often, in any order. The answer is guaranteed to be unique.

Example: `nums = [1,1,1,2,2,3], k = 2` -> `[1,2]`.

## Intuition

Count frequencies, then select the top k by frequency. Frequencies are bounded by `n`, so we can bucket by frequency instead of comparison sorting.

## Brute force

Count, sort distinct values by frequency descending, take k: O(n log n).

## Optimized approach

`buckets[f]` = values with frequency `f` (size `n + 1`). Walk from `f = n` down to 1 collecting values until we have k. Heap alternative: min-heap of size k keyed by frequency, O(n log k).

## Complexity

Bucket: O(n) time, O(n) space. Heap: O(n log k) time, O(n) space for counts.

## Implementation

### Python

```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for val, f in count.items():
            buckets[f].append(val)
        out = []
        for f in range(len(buckets) - 1, 0, -1):
            for val in buckets[f]:
                out.append(val)
                if len(out) == k:
                    return out
        return out
```

### Java

```java
import java.util.*;

class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums) count.merge(x, 1, Integer::sum);
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> e : count.entrySet()) buckets.get(e.getValue()).add(e.getKey());
        int[] out = new int[k];
        int idx = 0;
        for (int f = nums.length; f > 0 && idx < k; f--)
            for (int val : buckets.get(f)) {
                if (idx == k) break;
                out[idx++] = val;
            }
        return out;
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
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int x : nums) ++count[x];
        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& [val, f] : count) buckets[f].push_back(val);
        vector<int> out;
        for (int f = nums.size(); f > 0 && (int)out.size() < k; --f)
            for (int val : buckets[f]) {
                if ((int)out.size() == k) break;
                out.push_back(val);
            }
        return out;
    }
};
```

## Edge cases

- `k` equals the number of distinct values: return all.
- All elements equal: one value.
- Negative values (fine: they are map keys, not indices).

## Common mistakes

- Using values as bucket indices instead of frequencies.
- Max-heap of all distinct values then popping k (works, O(n + d log d); say why the size-k min-heap is better when k is small).

## Follow-ups

- Top K Frequent Words (ties broken lexicographically): heap with a custom comparator.
- Streaming data: count-min sketch plus heap for approximate heavy hitters.
- Quickselect on frequencies for O(n) average without buckets.
