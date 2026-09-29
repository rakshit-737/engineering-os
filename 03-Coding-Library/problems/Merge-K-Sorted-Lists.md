---
title: Merge K Sorted Lists
description: K-way merge of sorted linked lists with a min-heap of current heads.
domain: dsa
category: heap
type: problem
difficulty: advanced
status: evergreen
tags: [heap, linked-list, k-way-merge]
prerequisites: [Heap-Pattern, Linked-List-Pattern]
related: [Kth-Largest-Element-in-an-Array, Reverse-Linked-List, Merge-Intervals]
pattern: heap
source: "LeetCode 23"
languages: [python, java, cpp]
---

# Merge K Sorted Lists

Pattern: [[Heap-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given `k` linked lists, each sorted ascending, merge them into one sorted linked list and return its head.

Example: `[ [1,4,5],[1,3,4],[2,6] ]` -> `1->1->2->3->4->4->5->6`.

## Intuition

The next node of the merged list is the smallest among the k current heads. A min-heap returns that in O(log k) and accepts the replacement head in O(log k).

## Brute force

Collect all values, sort, rebuild: O(N log N) with N total nodes. Or merge lists one by one into an accumulator: O(N * k).

## Optimized approach

Push each non-null head into a min-heap keyed by value (with a tie-breaker index so nodes are never compared directly). Pop the min, append to a dummy tail, push its `next`. Alternative: divide and conquer pairwise merging, also O(N log k).

## Complexity

Time O(N log k), space O(k) for the heap.

## Implementation

### Python

```python
import heapq

class Solution:
    def mergeKLists(self, lists):
        heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
        heapq.heapify(heap)
        dummy = tail = ListNode(0)
        while heap:
            _, i, node = heapq.heappop(heap)
            tail.next = tail = node
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next
```

### Java

```java
import java.util.PriorityQueue;

class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));
        for (ListNode node : lists) if (node != null) heap.offer(node);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!heap.isEmpty()) {
            ListNode node = heap.poll();
            tail.next = node;
            tail = node;
            if (node.next != null) heap.offer(node.next);
        }
        return dummy.next;
    }
}
```

### C++

```cpp
#include <queue>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);
        for (ListNode* node : lists) if (node) heap.push(node);
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!heap.empty()) {
            ListNode* node = heap.top(); heap.pop();
            tail->next = node;
            tail = node;
            if (node->next) heap.push(node->next);
        }
        return dummy.next;
    }
};
```

## Edge cases

- `lists` empty, or all lists empty: return null.
- One list: returned unchanged.
- Duplicate values across lists.

## Common mistakes

- Python: pushing `(val, node)` tuples; equal values then compare `ListNode` objects and raise `TypeError`. Add the index tie-breaker.
- Python chained assignment `tail.next = tail = node` assigns left to right (`tail.next` first, then `tail`), which is what we want; reversing it (`tail = tail.next = node`) also works, but be explicit if unsure.
- C++: the comparator must be "greater" for a min-heap.

## Follow-ups

- Merge k sorted arrays, or find the smallest range covering an element from each list.
- External merge sort for data that does not fit in memory.
- Compare heap vs divide-and-conquer on constant factors and memory.
