---
title: Arrays and Hashing Pattern
description: Trade O(n) memory for O(1) lookups - hash maps and sets turn nested scans into single passes.
domain: dsa
category: arrays-and-hashing
type: pattern
difficulty: beginner
status: evergreen
tags: [arrays, hashing, counting]
prerequisites: [Hash-Tables, Big-O-Notation]
related: [Two-Pointer-Pattern, Prefix-Sum-Pattern, Sliding-Window-Pattern]
---

# Arrays and Hashing Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Most O(n^2) array questions ask "have I seen something that pairs with the current element?". A hash map (value -> index/count) or hash set answers that in O(1) expected time, collapsing the inner loop. The second half of the pattern is choosing a **canonical key** so that things which should be grouped hash to the same bucket (sorted letters for anagrams, count tuples, normalized coordinates).

## Details

**Recognition cues:**
- "Find a pair / complement / duplicate" in an unsorted array -> hash map of seen values.
- "Group items that are equivalent" -> map from canonical key to list.
- "Count occurrences / most frequent" -> frequency map (then bucket or heap).
- "Longest run of consecutive values" without sorting -> set with "start of run" check.
- "Can't sort" or "must keep original indices" -> hashing over two pointers.

**Template - complement lookup:**

```python
def pair_with_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:     # check BEFORE insert: no self-pairing
            return seen[target - x], i
        seen[x] = i
    return None
```

**Template - canonical key grouping:**

```python
from collections import defaultdict
groups = defaultdict(list)
for s in words:
    groups["".join(sorted(s))].append(s)
```

**Worked example - Longest Consecutive Sequence:** put all numbers in a set; only start counting from `x` when `x - 1` is absent (x starts a run), then walk `x + 1, x + 2, ...`. Every number is visited at most twice, so O(n) despite the nested loop.

**Complexity:** O(n) expected time, O(n) space. Worst-case hashing is O(n) per operation under adversarial collisions — mention it if asked about guarantees.

**Classic traps:**
- Inserting before checking (pairs an element with itself).
- Mutable keys: Python lists are unhashable (use tuples); Java arrays hash by identity (use `Arrays.toString` or a String key).
- Using a set where multiplicity matters (anagrams need counts).
- Forgetting that `unordered_map::operator[]` inserts a default value on lookup.

## Interview Angle

- Always state the trade: "O(n) extra memory buys O(n) time." Then offer the sorted/two-pointer O(1)-space alternative if the interviewer cares about memory.
- Know your language's map API cold: `getOrDefault`/`merge` (Java), `find`/`count` (C++), `Counter`/`defaultdict` (Python).

## Practice Problems

- [[Two-Sum]]
- [[Group-Anagrams]]
- [[Product-of-Array-Except-Self]]
- [[Valid-Anagram]]
- [[Top-K-Frequent-Elements]]
- [[Subarray-Sum-Equals-K]]

## Related

- [[Hash-Tables]]
- [[Two-Pointer-Pattern]]
- [[Prefix-Sum-Pattern]]
