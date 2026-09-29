---
title: Recursion and Stack Frames
description: "How calls use the stack, why deep recursion overflows, and how to convert to iteration."
domain: cs-core
category: algorithms
type: concept
difficulty: beginner
status: evergreen
tags: [cs-core, algorithms]
prerequisites: []
related: [Dynamic-Programming, Algorithms-Overview]
---

# Recursion and Stack Frames

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

Recursion solves a problem by reducing it to smaller instances of itself, terminating at a base case. Every call pushes a *stack frame* — parameters, local variables, and the return address — onto the call stack; the frame pops when the call returns. This means recursion always costs O(depth) memory even when it allocates nothing, and depth beyond the stack limit crashes the program (stack overflow / Python `RecursionError` at ~1000 frames by default).

## Details

**Anatomy of a correct recursion.** (1) Base case that terminates. (2) Recursive case on strictly smaller input. (3) Combine step. Trust the recursive call to be correct for smaller input (the induction hypothesis) — don't mentally re-trace it.

```python
def factorial(n):
    if n == 0:            # base case
        return 1
    return n * factorial(n - 1)   # frame per call: depth n
```

`factorial(5)` stacks 6 frames; the multiplications happen while *unwinding*. Time O(n), space O(n) — the space is invisible in the code but real.

**Recursion tree = complexity.** Cost = number of nodes x work per node. `fib(n)` naive branches twice per call: O(2^n) time but only O(n) space, because only one root-to-leaf path is on the stack at once. Memoizing collapses the tree to n distinct states — the bridge to [[Dynamic-Programming]].

| Recursion shape | Time | Stack space |
|---|---|---|
| Linear (factorial, list walk) | O(n) | O(n) |
| Halving (binary search) | O(log n) | O(log n) |
| Divide & conquer (merge sort) | O(n log n) | O(log n) |
| Binary branching, no memo (fib) | O(2^n) | O(n) |
| Tree traversal | O(n) | O(height) |

**Worked example — iterative conversion with explicit stack.** Any recursion can become a loop by managing your own stack; this trades the fixed-size call stack (typically 1-8 MB) for heap memory (gigabytes) and removes overflow risk:

```python
def dfs_iterative(root):          # preorder tree traversal
    stack, out = [root], []
    while stack:
        node = stack.pop()
        if node:
            out.append(node.val)
            stack.append(node.right)   # right first so left pops first
            stack.append(node.left)
    return out
```

**Depth limits.** Python: `sys.getrecursionlimit()` is ~1000; a DFS on a 10^5-node path graph or top-down DP on a long sequence will crash. Options: `sys.setrecursionlimit(...)` (band-aid; the OS stack can still overflow), convert to iteration, or go bottom-up. C/Java overflow silently or with StackOverflowError at a few thousand to ~100k frames depending on frame size.

**Tail calls.** A tail call's frame could be reused (tail-call optimization), making tail recursion O(1) space — but Python and Java deliberately do NOT implement TCO (Guido: it destroys tracebacks). Never claim tail recursion saves space in Python.

**Pitfalls.**
- Missing/unreachable base case, or recursing on non-shrinking input (e.g. `mid` never excluded) — infinite recursion.
- Passing `arr[1:]` slices in Python: each slice copies O(n), silently turning O(n) into O(n^2) time and O(n^2) total space. Pass indices.
- Mutable default arguments (`def f(x, seen=set())`) share state across separate top-level calls.
- Forgetting to undo mutations when backtracking (append without pop).
- Counting recursion space: a "no extra memory" recursive solution still uses O(depth) — interviewers check this.

## Interview Angle

- When you give a recursive solution, state stack space unprompted: "time O(n), space O(h) for the recursion stack, O(n) worst case if the tree is a chain." Omitting it is the most common complexity mistake.
- Expect "input can be very deep — what breaks?" The answer: recursion depth limit; convert to an explicit stack (know the pattern cold) or bottom-up iteration.
- Explain a stack frame concretely: parameters + locals + return address, pushed per call, popped on return — this is also why iteration with your own stack is equivalent.
- Recursion is the substrate for tree traversal ([[Trees-and-BSTs]]), DFS/backtracking ([[Graph-Traversal-BFS-DFS]]), and top-down DP; naming that connection shows the map, not just the road.

## Related

- [[Dynamic-Programming]]
- [[Trees-and-BSTs]]
- [[Graph-Traversal-BFS-DFS]]
- [[Big-O-Notation]]
- [[Sorting-Algorithms]]
- [[CS-Core-Index]]
