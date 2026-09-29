---
title: Climbing Stairs
description: Count ways to climb n steps with 1- or 2-steps; a Fibonacci recurrence in O(1) space.
domain: dsa
category: dp-1d
type: problem
difficulty: beginner
status: evergreen
tags: [dp, recursion, fibonacci]
prerequisites: [DP-Pattern, Recursion-Pattern]
related: [Coin-Change, Jump-Game, Longest-Increasing-Subsequence]
pattern: dp-1d
source: "LeetCode 70"
languages: [python, java, cpp]
---

# Climbing Stairs

Pattern: [[DP-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

You climb a staircase of `n` steps, taking 1 or 2 steps at a time. How many distinct sequences of moves reach the top?

Example: `n = 3` -> `3` (1+1+1, 1+2, 2+1).

## Intuition

The last move is either a 1-step (from `n-1`) or a 2-step (from `n-2`), so `ways(n) = ways(n-1) + ways(n-2)` — Fibonacci.

## Brute force

Plain recursion on the recurrence: O(2^n) time because subproblems repeat. Memoization fixes it to O(n).

## Optimized approach

Bottom-up with two rolling variables: `a = ways(i-2)`, `b = ways(i-1)`, starting from `ways(0) = 1`, `ways(1) = 1`.

## Complexity

Time O(n), space O(1). (Matrix exponentiation gives O(log n) if n is huge.)

## Implementation

### Python

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        a, b = 1, 1          # ways(0), ways(1)
        for _ in range(n - 1):
            a, b = b, a + b
        return b
```

### Java

```java
class Solution {
    public int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
```

### C++

```cpp
class Solution {
public:
    int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 2; i <= n; ++i) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};
```

## Edge cases

- `n = 1` -> 1; `n = 2` -> 2.
- Large n overflows 32-bit around n = 46; use 64-bit or modular arithmetic if required.

## Common mistakes

- Base cases off by one (`ways(0) = 1`, the empty climb).
- Presenting the exponential recursion as the final answer.

## Follow-ups

- Steps from a set `{1, 3, 5}`: `ways(n) = sum ways(n - s)`.
- Min cost climbing stairs.
- Count ordered vs unordered ways (order matters here; unordered is the coin change "combinations" variant, see [[Coin-Change]]).
