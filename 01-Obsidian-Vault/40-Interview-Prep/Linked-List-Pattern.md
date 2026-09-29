---
title: Linked List Pattern
description: Pointer rewiring with dummy heads, fast/slow runners and in-place reversal.
domain: dsa
category: linked-list
type: pattern
difficulty: beginner
status: evergreen
tags: [linked-list, pointers, two-pointers]
prerequisites: [Arrays-vs-Linked-Lists]
related: [Two-Pointer-Pattern, Recursion-Pattern, Heap-Pattern]
---

# Linked List Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Linked list problems are almost never algorithmically hard; they test whether you can rewire pointers without losing nodes. Three tools cover nearly everything: a **dummy head** (removes special cases for the first node), **fast/slow pointers** (middle, cycle, kth from end), and **in-place reversal** (prev/curr/next).

## Details

**Recognition cues:**
- Output list might have a different head (merge, remove, partition) -> dummy node.
- "Middle", "cycle", "nth from end", "palindrome list" -> fast/slow runners.
- "Reverse", "reverse in groups", "reorder list" -> iterative reversal.
- "Merge k sorted lists" -> min-heap of heads ([[Heap-Pattern]]).
- "Copy list with random pointer", "LRU cache" -> hash map node -> node / doubly linked list + map.

**Template - reversal:**

```python
def reverse(head):
    prev = None
    while head:
        nxt = head.next
        head.next = prev
        prev, head = head, nxt
    return prev
```

**Template - dummy head merge:**

```python
def merge(a, b):
    dummy = tail = ListNode(0)
    while a and b:
        if a.val <= b.val: tail.next, a = a, a.next
        else:              tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next
```

**Template - middle node:** `slow = fast = head; while fast and fast.next: slow, fast = slow.next, fast.next.next` (slow ends at the second middle for even length).

**Complexity:** typically O(n) time, O(1) extra space — the O(1) space is usually the point.

**Classic traps:**
- Overwriting `next` before saving it.
- Null checks in fast/slow: `fast and fast.next`.
- Forgetting to terminate the new tail (`tail.next = None`) creating cycles.
- C++: deleting removed nodes if the interviewer asks about memory ownership.

## Interview Angle

- Draw the pointers for 3 nodes before coding; walk through the empty and single-node cases out loud.
- Floyd's follow-up (cycle start) is standard: reset one pointer to head, move both by one.

## Practice Problems

- [[Reverse-Linked-List]]
- [[Linked-List-Cycle]]
- [[Merge-K-Sorted-Lists]]

## Related

- [[Two-Pointer-Pattern]]
- [[Arrays-vs-Linked-Lists]]
- [[Recursion-Pattern]]
