---
title: Merge Intervals
description: Sort intervals by start and sweep once, extending the last merged interval on overlap.
domain: dsa
category: intervals
type: problem
difficulty: intermediate
status: evergreen
tags: [intervals, sorting, sweep]
prerequisites: [Intervals-Pattern, Sorting-and-Searching-Pattern]
related: [Merge-K-Sorted-Lists, Greedy-Pattern]
pattern: intervals
source: "LeetCode 56"
languages: [python, java, cpp]
---

# Merge Intervals

Pattern: [[Intervals-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given a list of closed intervals `[start, end]`, merge all overlapping intervals and return the non-overlapping result covering the same points.

Example: `[ [1,3],[2,6],[8,10],[15,18] ]` -> `[ [1,6],[8,10],[15,18] ]`. Touching intervals `[1,4],[4,5]` merge into `[1,5]`.

## Intuition

After sorting by start, any interval that overlaps the merged block must overlap its last interval, so a single pass comparing with the last output interval suffices.

## Brute force

Repeatedly scan all pairs and merge overlapping ones until no change. O(n^2) or worse.

## Optimized approach

Sort by start. For each interval: if the output is empty or `start > last.end`, append it; otherwise set `last.end = max(last.end, end)`.

## Complexity

Time O(n log n) for the sort, O(n) for the sweep. Space O(n) for output (O(log n) to O(n) for the sort).

## Implementation

### Python

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda iv: iv[0])
        out = []
        for start, end in intervals:
            if out and start <= out[-1][1]:
                out[-1][1] = max(out[-1][1], end)
            else:
                out.append([start, end])
        return out
```

### Java

```java
import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] iv : intervals) {
            if (!out.isEmpty() && iv[0] <= out.get(out.size() - 1)[1]) {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], iv[1]);
            } else {
                out.add(new int[]{iv[0], iv[1]});
            }
        }
        return out.toArray(new int[0][]);
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
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> out;
        for (auto& iv : intervals) {
            if (!out.empty() && iv[0] <= out.back()[1])
                out.back()[1] = max(out.back()[1], iv[1]);
            else
                out.push_back(iv);
        }
        return out;
    }
};
```

## Edge cases

- One interval.
- Nested interval `[1,10],[2,3]`: the `max` keeps 10.
- Touching endpoints: merge because intervals are closed (`<=`).

## Common mistakes

- Setting `last.end = end` instead of `max(last.end, end)` (breaks nesting).
- Java comparator `a[0] - b[0]` can overflow for extreme values; use `Integer.compare`.

## Follow-ups

- Insert Interval into a sorted non-overlapping list in O(n).
- Non-overlapping Intervals (minimum removals): sort by end, greedy.
- Meeting Rooms II (max overlap): sweep line or min-heap of end times.
