---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Heap Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

A heap (priority queue) gives O(1) peek and O(log n) push/pop of the min (or max) element — a complete binary tree stored in an array. It is the tool whenever you repeatedly need "the current best" from a changing set: top-K selection, merging K sorted streams, scheduling, and streaming medians.

## Details

**Recognition cues:**
- "K largest / K smallest / K closest / K most frequent" → heap of size K, not a full sort.
- "Merge K sorted lists/arrays" → heap holding one head element per list.
- "Median / percentile of a stream" → two heaps (max-heap of lower half, min-heap of upper half).
- Repeated "give me the min/max, then update the set" (Dijkstra, task schedulers, meeting rooms).

**Key trick for top-K:** to find the K *largest*, keep a **min**-heap of size K — the root is the weakest of the current top K; anything bigger replaces it. (And symmetric: K smallest → max-heap.)

**Template — Kth largest:**

```python
import heapq

def kth_largest(nums, k):
    heap = []                      # min-heap of the k largest so far
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)    # evict the smallest
    return heap[0]                 # O(n log k)
```

**Python notes:** `heapq` is min-heap only — negate values for a max-heap. Ties on non-comparable payloads: push tuples `(key, counter, item)`. `heapq.heapify(list)` builds a heap in O(n). `heapq.merge` and `nlargest/nsmallest` exist — mention them, then hand-roll.

**Worked example — Merge K Sorted Lists:** push `(node.val, i, node)` for each list head; pop the min, append to result, push that node's successor. Every element passes through the heap once → O(N log K) for N total elements across K lists.

**Classic problems:** Kth Largest Element in an Array, Top K Frequent Elements, Merge K Sorted Lists, Find Median from Data Stream (two heaps), Task Scheduler, Meeting Rooms II (min-heap of end times).

**Complexity:**

| Operation | Cost |
|---|---|
| peek min/max | O(1) |
| push / pop | O(log n) |
| heapify n items | O(n) |
| top-K over n items | O(n log k) |

**Classic traps:**
- Heaping all n elements (O(n log n)) when a size-K heap gives O(n log k) — the whole point of the pattern.
- Mixing up which heap type top-K needs (see key trick above); interviewers watch for this.
- Assuming a heap supports search or delete-arbitrary — it doesn't (O(n)); use lazy deletion (pop and discard stale entries) or an indexed heap.
- Two-heaps median: forgetting the rebalance step that keeps sizes within 1 of each other.

## Interview Angle

- The sorting comparison is the expected first line: "Full sort is O(n log n); since I only need K of them, a heap gives O(n log k)." Also mention Quickselect (average O(n)) as the alternative for a single Kth statistic — knowing when each wins is a common follow-up.
- Be ready to explain *why* the array encoding works: children of index i at 2i+1, 2i+2; sift-up on push, sift-down on pop.
- Streaming/"data doesn't fit in memory" framing is a hint toward heaps — a size-K heap uses O(k) memory over an unbounded stream.
- For scheduler-style questions, say what the priority key is before coding ("heap keyed on end time").

## Related

- [[Trees-and-BSTs]]
- [[Sorting-Algorithms]]
- [[Big-O-Notation]]
- [[Hash-Tables]]
