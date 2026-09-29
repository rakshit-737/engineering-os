---
title: Linked List Cycle
description: Detect a cycle in a linked list with Floyd's fast and slow pointers in O(1) space.
domain: dsa
category: linked-list
type: problem
difficulty: beginner
status: evergreen
tags: [linked-list, two-pointers, fast-slow]
prerequisites: [Linked-List-Pattern, Two-Pointer-Pattern]
related: [Reverse-Linked-List, Merge-K-Sorted-Lists]
pattern: linked-list
source: "LeetCode 141"
languages: [python, java, cpp]
---

# Linked List Cycle

Pattern: [[Linked-List-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given the head of a singly linked list, return true if some node can be reached again by following `next` pointers (the list has a cycle).

Example: `3 -> 2 -> 0 -> -4 -> (back to 2)` -> true.

## Intuition

Two runners on a circular track, one twice as fast, must eventually meet. If there is no cycle, the fast runner hits the end.

## Brute force

Store visited nodes in a hash set; a repeat means a cycle. O(n) time, O(n) space.

## Optimized approach

`slow` moves one step, `fast` two steps. If they ever reference the same node, there is a cycle. If `fast` or `fast.next` is null, there is none. Once both are in the cycle the gap shrinks by one each step, so they meet within one lap.

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
class Solution:
    def hasCycle(self, head) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow, fast = slow.next, fast.next.next
            if slow is fast:
                return True
        return False
```

### Java

```java
class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
```

### C++

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};
```

## Edge cases

- Empty list or one node without a self-loop: false.
- One node pointing to itself: true.

## Common mistakes

- Comparing node values instead of node identity.
- Loop condition `while slow != fast` with both starting at head (exits immediately).

## Follow-ups

- Find where the cycle begins (Linked List Cycle II): after meeting, reset one pointer to head and move both one step at a time; they meet at the entry.
- Cycle length: keep one pointer fixed and count steps around.
- Find the duplicate number in an array of n+1 values in [1, n]: same Floyd trick on `i -> nums[i]`.
