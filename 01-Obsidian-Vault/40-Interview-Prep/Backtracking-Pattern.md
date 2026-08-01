---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Backtracking Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

Systematic exhaustive search over a decision tree: **choose** an option, **explore** the consequences recursively, **unchoose** (undo the mutation) so the next sibling branch starts from a clean state. Pruning — abandoning a branch the moment it can't lead to a valid answer — is what separates workable backtracking from brute force.

## Details

Recognition cues:
- "All permutations / combinations / subsets / partitions"
- Board or grid placement with constraints (queens, sudoku, word paths)
- "Count or enumerate every valid configuration"
- Answer is a set of sequences built one element at a time under constraints

Choose / explore / unchoose template:

```python
def solve(nums):
    res, path = [], []

    def backtrack(start):
        res.append(path[:])              # or: if is_complete(path): record
        for i in range(start, len(nums)):
            if not is_valid(nums[i]):    # prune before recursing
                continue
            path.append(nums[i])         # choose
            backtrack(i + 1)             # explore
            path.pop()                   # unchoose — restore state

    backtrack(0)
    return res
```

For permutations, replace `start` with a `used` set; for grids, mark the cell, recurse into neighbors, unmark.

Classic problems:
- **Subsets** — at each index: include or skip; 2^n leaves
- **Permutations** — track used elements; n! leaves
- **N-Queens** — prune with column and two diagonal sets; place row by row
- **Word Search** — DFS on grid, mark visited cell (e.g. `board[r][c] = '#'`), restore on the way out
- **Combination Sum** — reuse allowed means recurse with `i` not `i+1`; prune when remaining target < 0

Complexity reality: exponential by nature — O(2^n) for subsets, O(n·n!) for permutations, O(4^L) per cell for word search. You don't beat it; you shrink the tree. Prune early (sort input so you can break, not continue, once a candidate exceeds the target) or memoize when subproblems repeat (at which point it's [[DP-Pattern]] territory).

**The trap:** forgetting to undo state. A missing `path.pop()`, an unmarked visited cell, or appending `path` instead of `path[:]` (aliasing the live list) silently corrupts every later branch. Rule: every mutation before the recursive call has a mirror-image undo after it.

## Interview Angle

Trigger words: "all possible", "generate every", "return combinations", N-Queens, sudoku, word search. Recite the three beats — choose, explore, unchoose — while coding, and state the branching-factor complexity unprompted (interviewers expect you to admit it's exponential and then show a prune). Mention duplicates handling: sort first, skip `nums[i] == nums[i-1]` at the same tree depth.

## Related

- [[BFS-DFS-Pattern]]
- [[DP-Pattern]]
- [[Two-Pointer-Pattern]]
- [[Interview-Prep-Index]]
