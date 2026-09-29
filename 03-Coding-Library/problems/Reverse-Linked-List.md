---
title: Reverse Linked List
description: Reverse a singly linked list in place by re-pointing next pointers, iteratively or recursively.
domain: dsa
category: linked-list
type: problem
difficulty: beginner
status: evergreen
tags: [linked-list, pointers, recursion]
prerequisites: [Linked-List-Pattern]
related: [Linked-List-Cycle, Merge-K-Sorted-Lists, Recursion-Pattern]
pattern: linked-list
source: "LeetCode 206"
languages: [python, java, cpp]
---

# Reverse Linked List

Pattern: [[Linked-List-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given the head of a singly linked list, reverse it and return the new head.

Example: `1 -> 2 -> 3 -> null` becomes `3 -> 2 -> 1 -> null`.

## Intuition

Walk the list once, flipping each node's `next` to point backwards. You need three references: `prev`, `curr`, and the saved `next` (otherwise you lose the rest of the list).

## Brute force

Copy values into an array and rebuild or overwrite in reverse order. O(n) time, O(n) space.

## Optimized approach

`prev = null`, `curr = head`. Loop: `nxt = curr.next; curr.next = prev; prev = curr; curr = nxt`. Return `prev`.

## Complexity

Iterative: O(n) time, O(1) space. Recursive: O(n) time, O(n) stack.

## Implementation

### Python

```python
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val, self.next = val, next

class Solution:
    def reverseList(self, head):
        prev, curr = None, head
        while curr:
            curr.next, prev, curr = prev, curr, curr.next
        return prev
```

### Java

```java
// class ListNode { int val; ListNode next; ListNode(int v) { val = v; } }

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nxt = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
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
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) {
            ListNode* nxt = head->next;
            head->next = prev;
            prev = head;
            head = nxt;
        }
        return prev;
    }
};
```

Recursive version (Python): `if not head or not head.next: return head; new = self.reverseList(head.next); head.next.next = head; head.next = None; return new`.

## Edge cases

- Empty list: return null.
- Single node.

## Common mistakes

- Losing the rest of the list by overwriting `next` before saving it.
- Python tuple assignment order: `curr.next, prev, curr = prev, curr, curr.next` works because the right side is evaluated first and `curr.next` is assigned before `curr` changes; reordering the targets can break it.
- Recursive version forgetting `head.next = None`, creating a cycle.

## Follow-ups

- Reverse between positions `left` and `right`.
- Reverse in groups of k.
- Palindrome linked list: find middle (fast/slow), reverse the second half, compare.
