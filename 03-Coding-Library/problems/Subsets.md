---
title: Subsets
description: Generate the power set by include/exclude backtracking (or bitmask enumeration).
domain: dsa
category: backtracking
type: problem
difficulty: intermediate
status: evergreen
tags: [backtracking, recursion, bitmask]
prerequisites: [Backtracking-Pattern, Recursion-Pattern]
related: [Permutations, Generate-Parentheses, Bit-Manipulation-Pattern]
pattern: backtracking
source: "LeetCode 78"
languages: [python, java, cpp]
---

# Subsets

Pattern: [[Backtracking-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an array of distinct integers, return all possible subsets (the power set), in any order, with no duplicates.

Example: `[1,2,3]` -> `[ [],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3] ]`.

## Intuition

Each element is either in or out: 2^n subsets. Backtracking walks that decision tree; recording the current path at every node (not only leaves) yields each subset once when we only move forward in the array.

## Brute force

Iterate masks `0 .. 2^n - 1` and pick bits: also O(n * 2^n) and a fine alternative (see [[Bit-Manipulation-Pattern]]).

## Optimized approach

`backtrack(start)`: record a copy of `path`; for `i` from `start` to `n - 1`, push `nums[i]`, recurse with `i + 1`, pop.

## Complexity

Time O(n * 2^n) (2^n subsets, O(n) to copy each), space O(n) recursion excluding output.

## Implementation

### Python

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        res, path = [], []

        def backtrack(start: int) -> None:
            res.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1)
                path.pop()

        backtrack(0)
        return res
```

### Java

```java
import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {
        res.add(new ArrayList<>(path));
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, res);
            path.remove(path.size() - 1);
        }
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
    vector<vector<int>> res;
    vector<int> path;
    void backtrack(const vector<int>& nums, int start) {
        res.push_back(path);
        for (int i = start; i < (int)nums.size(); ++i) {
            path.push_back(nums[i]);
            backtrack(nums, i + 1);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        res.clear();
        backtrack(nums, 0);
        return res;
    }
};
```

## Edge cases

- Empty input: `[ [] ]`.
- Single element: `[ [], [x] ]`.

## Common mistakes

- Appending `path` itself instead of a copy (all entries end up empty).
- Java `path.remove(Integer)` vs `remove(int index)` confusion: use the index form.

## Follow-ups

- Subsets II (duplicates): sort, and skip `nums[i] == nums[i-1]` when `i > start`.
- Combination Sum / combinations of size k: same skeleton with pruning.
- Iterative build: start with `[ [] ]`, for each x append x to copies of all existing subsets.
