---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Arrays vs Linked Lists

Hub: [[CS-Core-Index]]

## Core Idea

Arrays store elements in one contiguous memory block, so index arithmetic gives O(1) random access and great cache behavior. Linked lists store each element in its own node with a pointer to the next (and previous, if doubly linked), so insertion/deletion at a known node is O(1) but reaching position i costs O(n). The choice is a memory-layout tradeoff: locality and access speed vs. cheap structural edits.

## Details

**Array mechanics.** `addr(a[i]) = base + i * element_size` — one multiply and add, no traversal. Dynamic arrays (Python `list`, C++ `vector`, Java `ArrayList`) over-allocate; when full they reallocate (usually 1.5-2x growth) and copy everything. That copy is O(n), but spread over many appends the *amortized* append cost is O(1).

**Linked list mechanics.** Each node holds a value plus pointer(s). Insert after a node you already hold: rewire two pointers, O(1). But finding that node is O(n), and each node dereference is a potential cache miss because nodes are scattered across the heap.

| Operation | Array (dynamic) | Singly Linked List |
|---|---|---|
| Access by index | O(1) | O(n) |
| Search (unsorted) | O(n) | O(n) |
| Append at end | O(1) amortized | O(1) with tail pointer |
| Insert/delete at front | O(n) (shift all) | O(1) |
| Insert/delete at known node | O(n) (shift) | O(1) |
| Extra space per element | none (plus slack capacity) | 1-2 pointers |

**Worked example.** Implement an LRU cache: you need O(1) "move this entry to the front" and O(1) "evict from the back". An array can't do either without shifting; a doubly linked list does both by pointer rewiring. Pair it with a [[Hash-Tables]] map from key to node and every operation is O(1) — the classic hybrid where each structure covers the other's weakness.

```python
# Deleting node B from a doubly linked list A <-> B <-> C: pure rewiring, O(1)
b.prev.next = b.next
b.next.prev = b.prev
```

**Middle-ground structures.** A deque (Python `collections.deque`) is a doubly linked list of fixed-size blocks: O(1) push/pop at both ends with better locality than a pure list. Ring buffers give queue semantics on a plain array. Reach for these before a hand-rolled linked list.

**Pitfalls.**
- "Linked list insert is O(1)" is only true *at a node you already hold* — with search included it's O(n).
- Big-O hides constants: iterating a list of nodes can be 10-100x slower than an array of the same size purely from cache misses. In practice arrays win most benchmarks even where lists look better on paper.
- Forgetting to update head/tail pointers on edge deletions (empty list, single element) is the classic bug; a dummy/sentinel head node removes most special cases.
- Pointer overhead: on a 64-bit system a list of small ints can spend more memory on pointers than on data.
- Deleting from an array while iterating it forward skips elements; iterate backwards or build a new array.

## Interview Angle

- Say the cache-locality point out loud: "asymptotically the list wins for front-insertion, but contiguous arrays dominate real hardware because of prefetching and cache lines." That sentence signals systems awareness.
- Know amortized analysis for dynamic array append — interviewers probe "why is append O(1) if resize is O(n)?"
- Linked-list coding questions are really pointer-discipline tests: reverse a list, detect a cycle (Floyd's tortoise/hare), merge two sorted lists. Practice drawing boxes and arrows before coding, and use a dummy head.
- Expect the follow-up "when would you actually use a linked list?" Good answers: LRU cache, O(1) splicing of queues, arena/free-list allocators — not "when I insert a lot" (a common wrong answer, since finding the spot is O(n)).

## Related

- [[Big-O-Notation]]
- [[Hash-Tables]]
- [[Trees-and-BSTs]]
- [[Two-Pointer-Pattern]]
- [[CS-Core-Index]]
