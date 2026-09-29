---
title: Dynamic Programming
description: "Optimal substructure plus overlapping subproblems: state, recurrence, base case."
domain: cs-core
category: algorithms
type: concept
difficulty: intermediate
status: evergreen
tags: [cs-core, algorithms]
prerequisites: [Recursion-and-Stack-Frames]
related: [DP-Pattern, Algorithms-Overview]
---

# Dynamic Programming

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

Dynamic programming solves problems whose recursive decomposition has *overlapping subproblems* and *optimal substructure* (the optimal answer is built from optimal answers to subproblems) by computing each subproblem once and storing the result. Two implementations of the same idea: memoization (top-down recursion + cache) and tabulation (bottom-up table fill). Complexity = (number of distinct states) x (work per state).

## Details

**The four-step recipe.**
1. **State** — the minimal parameters that determine a subproblem's answer, e.g. `dp[i]` = best answer using first i items.
2. **Recurrence** — express the state in terms of smaller states, by considering the choices at this step.
3. **Base cases** — smallest states answerable directly.
4. **Order** — recursion+cache handles it automatically; tabulation must fill dependencies first.

**Worked example — coin change (min coins to make `amount`).** State: `dp[a]` = fewest coins summing to a. Recurrence: `dp[a] = 1 + min(dp[a - c] for c in coins)`. Base: `dp[0] = 0`. O(amount x len(coins)) time — versus O(coins^amount) for naive recursion.

```python
def coin_change(coins, amount):
    dp = [0] + [float('inf')] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

Top-down version of the same recurrence:

```python
from functools import lru_cache
@lru_cache(maxsize=None)
def f(a):
    if a == 0: return 0
    return min((f(a - c) + 1 for c in coins if c <= a), default=float('inf'))
```

**Why it works here:** naive Fibonacci-style recursion recomputes the same amounts exponentially many times; caching collapses the call tree to `amount + 1` distinct states.

| Approach | Time | Space | Notes |
|---|---|---|---|
| Naive recursion | exponential | O(depth) stack | recomputes overlapping states |
| Memoization | O(states x work) | O(states) + stack | easy to derive, recursion-depth risk |
| Tabulation | O(states x work) | O(states) | no stack; enables space tricks |
| Rolled tabulation | same time | often O(1)/O(n) | keep only last row(s) |

**Canonical archetypes** (recognize the state shape): 1-D sequence (climbing stairs, house robber), 2-D two-sequence (edit distance, LCS: `dp[i][j]` from `dp[i-1][j-1]`, `dp[i-1][j]`, `dp[i][j-1]`), knapsack (item x capacity), interval DP, bitmask DP for n <= 20. See [[DP-Pattern]] for drill problems.

**Pitfalls.**
- Wrong or bloated state: if the recurrence needs information the state doesn't carry, add a dimension; if a dimension never affects the answer, drop it.
- Memoizing on mutable/unhashable arguments (lists) in Python breaks `lru_cache` — pass indices, not slices; slices also silently add O(n) copying per call.
- Top-down on deep 1-D problems hits Python's ~1000-frame recursion limit — see [[Recursion-and-Stack-Frames]]; convert to tabulation.
- Tabulation order bugs: 0/1 knapsack iterates capacity descending in the 1-D form; ascending turns it into unbounded knapsack.
- Greedy masquerading as DP: coin change with coins {1,3,4} and amount 6 — greedy gives 4+1+1 (3 coins), DP gives 3+3 (2 coins). Greedy needs a proof; DP doesn't.

## Interview Angle

- Always derive brute-force recursion first, then say "these subproblems overlap, so I'll memoize," then optionally convert to a table and roll the space. Jumping straight to a table you memorized reads as recall, not reasoning.
- Name the state in words ("dp[i][j] = min edits to convert word1[:i] into word2[:j]") before writing any code; most DP failures are state-definition failures.
- State complexity as states x work-per-state — it's the one-line justification interviewers want.
- Common probes: "can you reduce space?" (keep last row), "can you reconstruct the actual solution?" (store parent choices), "why not greedy?" (have the counterexample ready).
- Trigger phrases for DP: "minimum/maximum cost", "number of ways", "longest/shortest subsequence", "can you partition".

## Related

- [[DP-Pattern]]
- [[Recursion-and-Stack-Frames]]
- [[Big-O-Notation]]
- [[Graph-Traversal-BFS-DFS]]
- [[CS-Core-Index]]
