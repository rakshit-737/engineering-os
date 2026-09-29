---
title: Permutations
description: Generate all orderings of distinct numbers with a used-array backtracking search.
domain: dsa
category: backtracking
type: problem
difficulty: intermediate
status: evergreen
tags: [backtracking, recursion]
prerequisites: [Backtracking-Pattern]
related: [Subsets, Generate-Parentheses]
pattern: backtracking
source: "LeetCode 46"
languages: [python, java, cpp]
---

# Permutations

Pattern: [[Backtracking-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an array of distinct integers, return all possible orderings (permutations), in any order.

Example: `[1,2,3]` -> `[ [1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1] ]`.

## Intuition

Fill positions left to right; at each position choose any number not used yet. Undo the choice after exploring so the next sibling starts clean.

## Brute force

Generate all n^n sequences and filter those with distinct elements. Far worse than n!.

## Optimized approach

`used[]` boolean array. When `len(path) == n`, record a copy. Otherwise for each unused `i`: mark, push, recurse, pop, unmark. (Swap-based in-place generation is an equivalent alternative.)

## Complexity

Time O(n * n!), space O(n) excluding output.

## Implementation

### Python

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        res, path, used = [], [], [False] * len(nums)

        def backtrack() -> None:
            if len(path) == len(nums):
                res.append(path[:])
                return
            for i, x in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(x)
                backtrack()
                path.pop()
                used[i] = False

        backtrack()
        return res
```

### Java

```java
import java.util.*;

class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), res);
        return res;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {
        if (path.size() == nums.length) {
            res.add(new ArrayList<>(path));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path, res);
            path.remove(path.size() - 1);
            used[i] = false;
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
    vector<bool> used;
    void backtrack(const vector<int>& nums) {
        if (path.size() == nums.size()) { res.push_back(path); return; }
        for (int i = 0; i < (int)nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = true;
            path.push_back(nums[i]);
            backtrack(nums);
            path.pop_back();
            used[i] = false;
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        res.clear();
        used.assign(nums.size(), false);
        backtrack(nums);
        return res;
    }
};
```

## Edge cases

- Single element: one permutation.
- n = 0: `[ [] ]` by this code (one empty permutation) — confirm the expected output.

## Common mistakes

- Forgetting to unmark `used[i]` on the way back.
- Recording `path` without copying.

## Follow-ups

- Permutations II (duplicates): sort, skip `nums[i] == nums[i-1]` when `!used[i-1]`.
- Next Permutation (in-place lexicographic successor) in O(n).
- kth permutation sequence via factorial number system.
