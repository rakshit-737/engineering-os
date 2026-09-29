---
title: Stack and Monotonic Stack Pattern
description: LIFO for nesting and undo; monotonic stacks answer next/previous greater or smaller in O(n).
domain: dsa
category: stack
type: pattern
difficulty: intermediate
status: evergreen
tags: [stack, monotonic-stack]
prerequisites: [Arrays-vs-Linked-Lists]
related: [Queue-and-Deque-Pattern, Recursion-Pattern, Two-Pointer-Pattern]
---

# Stack and Monotonic Stack Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

A stack answers "what is the most recent unresolved thing?". That covers nesting (brackets, expression parsing, directory paths), undo, and simulating recursion. A **monotonic stack** keeps its contents sorted by discarding elements that can never be the answer again; each element is pushed and popped once, giving O(n) for "next greater / previous smaller" style questions.

## Details

**Recognition cues:**
- Matching or nesting (`()[]{}`, tags, decode `3[a2[c]]`) -> plain stack.
- Evaluate expressions (RPN, basic calculator) -> operand/operator stacks.
- "Next greater element", "days until warmer", "stock span" -> monotonic decreasing stack.
- "Largest rectangle", "sum of subarray minimums", "trapping water" -> previous/next smaller via monotonic increasing stack.
- "Remove k digits to make smallest number" -> greedy monotonic stack.

**Template - next greater element (indices):**

```python
def next_greater(a):
    ans = [-1] * len(a)
    stack = []                        # indices, values decreasing
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            ans[stack.pop()] = x      # x resolves everyone smaller
        stack.append(i)
    return ans
```

Which direction of monotonicity? Ask what resolves an element: a **greater** arrival resolves -> keep a **decreasing** stack; a **smaller** arrival resolves -> keep an **increasing** stack.

**Worked example - Largest Rectangle in Histogram:** when a shorter bar arrives, pop taller bars; each popped bar's rectangle spans from the new stack top + 1 to the current index - 1. A sentinel 0 at the end flushes the stack.

**Complexity:** O(n) time (amortized: each index is pushed/popped once), O(n) space.

**Classic traps:**
- Storing values when you need distances/widths (store indices).
- Strict vs non-strict comparison with duplicates (decide which side "owns" equal elements to avoid double counting).
- Forgetting to flush the remaining stack at the end.
- Java: use `ArrayDeque`, not the legacy synchronized `Stack` class.

## Interview Angle

- Say the amortized argument explicitly: "the while loop looks nested, but every index is popped at most once, so total work is O(n)."
- Stack <-> recursion equivalence: any recursive DFS can be rewritten with an explicit stack to avoid recursion limits.

## Practice Problems

- [[Valid-Parentheses]]
- [[Daily-Temperatures]]
- [[Largest-Rectangle-in-Histogram]]
- [[Trapping-Rain-Water]]
- [[Implement-Queue-using-Stacks]]

## Related

- [[Queue-and-Deque-Pattern]]
- [[Recursion-Pattern]]
- [[Recursion-and-Stack-Frames]]
