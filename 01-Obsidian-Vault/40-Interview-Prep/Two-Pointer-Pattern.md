---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Two Pointer Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

Two indexes moving with purpose replace a nested O(n²) pair scan with a single O(n) pass. Three shapes: **converging** (both ends moving inward — needs sorted data or a symmetric property), **fast/slow** (cycle detection, middle of list), and **reader/writer** (in-place array compaction). The pattern works when moving a pointer provably discards candidates that cannot be the answer.

## Details

**Recognition cues:**
- **Sorted** array + "find a pair/triplet with sum/target/property" → converging pointers.
- "Palindrome check", "container/trapping water" → converging from both ends.
- Linked list + "cycle?", "middle node", "kth from end" → fast/slow (Floyd).
- "Remove duplicates / move zeroes **in place**, O(1) extra space" → reader/writer.

**Template — converging (Two Sum on sorted input):**

```python
def two_sum_sorted(a, target):
    lo, hi = 0, len(a) - 1
    while lo < hi:
        s = a[lo] + a[hi]
        if s == target: return [lo, hi]
        if s < target:  lo += 1   # a[lo] can't pair with anything: discard it
        else:           hi -= 1
    return []
```

**Template — fast/slow (cycle detection):**

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast: return True
    return False
```

**Worked example — Container With Most Water:** start at both ends; area is limited by the shorter line, so moving the *taller* pointer can only shrink or equal the area — always move the shorter one. That exchange argument ("every skipped candidate is provably no better") is the correctness proof interviewers want to hear.

**Classic problems:** Two Sum II (sorted), 3Sum (sort + fix one + converge), Valid Palindrome, Container With Most Water, Linked List Cycle, Remove Duplicates from Sorted Array, Trapping Rain Water.

**Complexity:** O(n) time (each pointer moves ≤ n steps), O(1) extra space — the space bound is the usual selling point over a hash-map solution. 3Sum: O(n²) total (O(n) converge inside an O(n) outer loop) after an O(n log n) sort.

**Classic traps:**
- Converging pointers on an **unsorted** array — the discard argument collapses. Either sort first (losing original indices — note it) or use a hash map.
- 3Sum duplicate handling: skip repeated values at every pointer or you emit duplicate triplets.
- Fast/slow termination: guard `while fast and fast.next`, not `while slow != fast` (fails on no-cycle lists).
- Off-by-one on `lo < hi` vs `lo <= hi` — pairs need strict `<`.
- Confusing with sliding window: two-pointer converges/discards individual *pairs*; sliding window maintains a *contiguous range* with an invariant. Related but distinct — see [[Sliding-Window-Pattern]].

## Interview Angle

- Say the discard argument out loud: "If the sum is too small, a[lo] can never work with any remaining element, so I discard it." Correctness reasoning is the differentiator, not the loop itself.
- Two Sum family follow-up chain is standard: unsorted (hash map, O(n) space) → sorted (two pointers, O(1) space) → 3Sum → 4Sum. Know the whole ladder.
- For Floyd's cycle: be ready for the follow-up "find the cycle *start*" (reset one pointer to head, advance both by 1) and sketch why it works.
- If the interviewer bans extra space, that's a broad hint toward two pointers or reader/writer in place.

## Related

- [[Sliding-Window-Pattern]]
- [[Arrays-vs-Linked-Lists]]
- [[Hash-Tables]]
- [[Sorting-Algorithms]]
