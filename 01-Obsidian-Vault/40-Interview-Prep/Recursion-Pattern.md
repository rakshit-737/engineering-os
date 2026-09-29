---
title: Recursion Pattern
description: Trust the recursive contract - base case, smaller subproblem, combine - the foundation for trees, backtracking and DP.
domain: dsa
category: recursion
type: pattern
difficulty: beginner
status: evergreen
tags: [recursion, divide-and-conquer]
prerequisites: [Recursion-and-Stack-Frames]
related: [Backtracking-Pattern, DP-Pattern, Trees-Pattern, Sorting-and-Searching-Pattern]
---

# Recursion Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

A recursive function is a promise: "given a smaller input of the same shape, I return the right answer". Write three things: the **base case** (smallest input answered directly), the **reduction** (how the input shrinks), and the **combination** (how sub-answers form this answer). Do not trace every call mentally — trust the contract, verify it on the base case and one step above it.

Three families grow out of recursion: **divide and conquer** (merge sort, quickselect, tree construction), **backtracking** (explore choices, undo), and **dynamic programming** (recursion + memoization of overlapping subproblems).

## Details

**Recognition cues:**
- Input is recursive by nature: trees, nested lists, expressions -> direct recursion.
- "Split in halves and combine" -> divide and conquer.
- "Generate all ..." -> backtracking ([[Backtracking-Pattern]]).
- Recursion recomputes the same arguments -> memoize, i.e. DP ([[DP-Pattern]]).
- `x^n`, `a * b mod m` -> halving recursion (O(log n)).

**Template:**

```python
def solve(problem):
    if is_base(problem):
        return base_answer(problem)
    parts = split(problem)                 # strictly smaller
    sub_answers = [solve(p) for p in parts]
    return combine(sub_answers)
```

**Worked example - fast power:** `pow(x, n) = pow(x*x, n // 2) * (x if n is odd else 1)`, base `n == 0 -> 1`. One recursive call per level gives O(log n); calling `pow(x, n/2)` twice gives O(n).

**Complexity analysis:** draw the recursion tree. Total work = sum over levels. Master theorem for `T(n) = a T(n/b) + O(n^d)`: compare `d` with `log_b a`. Space = maximum depth of the call stack.

**Classic traps:**
- Missing or unreachable base case -> infinite recursion / stack overflow.
- Reduction that does not shrink (`solve(n)` calling `solve(n)`).
- Mutating shared state without undoing it (backtracking bugs).
- Python default recursion limit (about 1000): use iteration or raise the limit for deep inputs.
- Exponential blow-up from overlapping subproblems (naive Fibonacci) — memoize.

## Interview Angle

- State the contract and base case before coding; interviewers look for that discipline.
- Offer the iterative conversion (explicit stack) when depth could reach 10^4+.

## Practice Problems

- [[Generate-Parentheses]]
- [[Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal]]
- [[Pow-x-n]]
- [[Maximum-Depth-of-Binary-Tree]]
- [[Climbing-Stairs]]

## Related

- [[Recursion-and-Stack-Frames]]
- [[Backtracking-Pattern]]
- [[DP-Pattern]]
- [[Trees-Pattern]]
