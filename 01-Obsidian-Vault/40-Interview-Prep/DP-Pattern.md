---
title: DP Pattern
description: Classify into a DP family (knapsack, LIS, edit distance, interval, grid) to get state and recurrence.
domain: dsa
category: dynamic-programming
type: pattern
difficulty: advanced
status: evergreen
tags: [dp, recursion]
prerequisites: [Recursion-Pattern]
related: [Greedy-Pattern, Backtracking-Pattern, Dynamic-Programming]
---

# DP Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

DP applies when a problem has *optimal substructure* (the best answer builds from best answers to subproblems) and *overlapping subproblems* (naive recursion recomputes the same states). Don't derive from scratch in an interview — classify the problem into a known family (knapsack, LIS, edit distance, interval, grid paths); the family hands you the state and recurrence.

## Details

**Recognition cues:**
- "Count the number of ways...", "minimum/maximum cost to reach...", "longest/shortest subsequence...", "can you partition/reach...".
- Choices at each step + the future depends only on a small summary of the past (the state), not the full history.
- Brute force is exponential and you can see repeated subcalls.

**The five families:**

| Family | State | Example recurrence |
|---|---|---|
| Knapsack (0/1, unbounded) | dp[i][cap] = best using first i items | take vs skip item i |
| LIS | dp[i] = best sequence ending at i | max over j<i with a[j]<a[i] |
| Edit distance | dp[i][j] = align prefix i with prefix j | match / insert / delete / replace |
| Interval | dp[i][j] = best for range i..j | split at k between i and j |
| Grid | dp[r][c] = best path to cell | from top / left |

**Method (say these steps out loud):** 1) define the state in one sentence; 2) write the recurrence with base cases; 3) memoize top-down first; 4) convert to bottom-up table if needed; 5) optimize space (often only the previous row is needed).

**Template — top-down memoization:**

```python
from functools import lru_cache

def coin_change(coins, amount):          # min coins to make amount
    @lru_cache(None)
    def dp(rem):
        if rem == 0: return 0
        if rem < 0:  return float('inf')
        return 1 + min(dp(rem - c) for c in coins)
    ans = dp(amount)
    return ans if ans != float('inf') else -1
```

**Worked example — Coin Change:** state = remaining amount (one number summarizes everything); recurrence = 1 + min over coins; base = dp(0)=0. States × transitions = O(amount · len(coins)).

**Classic problems:** Climbing Stairs (warm-up Fibonacci), Coin Change (unbounded knapsack), Longest Increasing Subsequence, Edit Distance, House Robber (take/skip), Longest Common Subsequence, Partition Equal Subset Sum (0/1 knapsack).

**Complexity:** time = (number of states) × (work per state); space = number of states, often reducible one dimension. LIS is O(n²) by table, O(n log n) with the patience-sorting/binary-search trick.

**Classic traps:**
- Defining the state wrong (missing a dimension) — the recurrence then "needs" information the state doesn't carry. Fix the state, don't patch the recurrence.
- Base cases: off-by-one on empty prefix (dp[0] means "zero items considered", not "first item").
- 0/1 vs unbounded knapsack loop order in bottom-up: iterate capacity descending for 0/1, ascending for unbounded.
- Jumping straight to a 2D table when a greedy or simpler state works — confirm overlapping subproblems exist first.

## Interview Angle

- Name the family early: "This is 0/1 knapsack with sum as capacity." It signals pattern fluency and gives you the solution skeleton for free.
- Interviewers probe the state definition: be able to answer "what exactly does dp[i][j] mean?" in one precise sentence — most DP failures are ambiguous states.
- Offer top-down first (faster to write correctly), mention the bottom-up conversion and space optimization as follow-ups.
- If stuck, write the brute-force recursion, then point at the repeated calls and memoize — that path is legitimate and interviewers respect it.
- Reference implementations live in 03-Coding-Library.

## Practice Problems

- [[Climbing-Stairs]]
- [[Coin-Change]]
- [[Longest-Common-Subsequence]]
- [[Partition-Equal-Subset-Sum]]
- [[Longest-Increasing-Subsequence]]

## Related

- [[Dynamic-Programming]]
- [[Recursion-and-Stack-Frames]]
- [[Big-O-Notation]]
- [[Binary-Search-Pattern]]
