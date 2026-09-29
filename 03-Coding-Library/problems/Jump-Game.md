---
title: Jump Game
description: Greedily track the farthest reachable index to decide if the last index is reachable.
domain: dsa
category: greedy
type: problem
difficulty: intermediate
status: evergreen
tags: [greedy, arrays]
prerequisites: [Greedy-Pattern]
related: [Gas-Station, Climbing-Stairs]
pattern: greedy
source: "LeetCode 55"
languages: [python, java, cpp]
---

# Jump Game

Pattern: [[Greedy-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

You start at index 0. `nums[i]` is the maximum jump length from index `i`. Return true if you can reach the last index.

Example: `[2,3,1,1,4]` -> true; `[3,2,1,0,4]` -> false (every path lands on the 0 at index 3).

## Intuition

The set of reachable indices is always a prefix `[0, farthest]`. Scan left to right extending `farthest = max(farthest, i + nums[i])`; if you ever stand at an index beyond `farthest`, you are stuck.

## Brute force

DP: `can[i]` = any `j < i` with `can[j]` and `j + nums[j] >= i`. O(n^2). Plain recursion without memo is exponential.

## Optimized approach

For `i` in order: if `i > farthest` return false; update `farthest`; if `farthest >= n - 1` return true.

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
class Solution:
    def canJump(self, nums: list[int]) -> bool:
        farthest = 0
        for i, jump in enumerate(nums):
            if i > farthest:
                return False
            farthest = max(farthest, i + jump)
        return True
```

### Java

```java
class Solution {
    public boolean canJump(int[] nums) {
        int farthest = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > farthest) return false;
            farthest = Math.max(farthest, i + nums[i]);
        }
        return true;
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
    bool canJump(vector<int>& nums) {
        int farthest = 0;
        for (int i = 0; i < (int)nums.size(); ++i) {
            if (i > farthest) return false;
            farthest = max(farthest, i + nums[i]);
        }
        return true;
    }
};
```

## Edge cases

- Single element: true (already at the end).
- `[0]` true; `[0, 1]` false.
- Zeros that can be jumped over.

## Common mistakes

- Greedily taking the longest jump from each position (not optimal for the min-jumps variant, and unnecessary here).
- Returning true when reaching a zero without checking `farthest`.

## Follow-ups

- Jump Game II (minimum jumps): BFS-by-levels greedy with `currentEnd` and `farthest`.
- Jump Game III (jump to `i +/- nums[i]`, reach any zero): BFS/DFS.
