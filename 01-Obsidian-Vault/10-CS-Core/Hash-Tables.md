---
title: Hash Tables
description: "Average O(1) lookup via hashing: collisions, load factor, resizing, and attacks."
domain: cs-core
category: data-structures
type: concept
difficulty: beginner
status: evergreen
tags: [cs-core, data-structures]
prerequisites: [Arrays-vs-Linked-Lists]
related: [Data-Structures-Overview, Database-Indexing]
---

# Hash Tables

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

A hash table stores key-value pairs by running the key through a hash function to pick a bucket index in an array, giving O(1) *average* insert, lookup, and delete. Since infinitely many keys map to finitely many buckets, collisions are inevitable (pigeonhole principle); the table's real engineering is collision handling (chaining or open addressing) and resizing when the load factor grows. Worst case degrades to O(n) when many keys collide.

## Details

**Mechanics.** `index = hash(key) % capacity`. Requirements on the hash function: deterministic, fast, uniform spread. Keys must be immutable/hashable — if a key mutates after insertion, its hash no longer matches its bucket and it is effectively lost (why Python dict keys must be hashable and lists aren't allowed).

**Collision strategies.**
- **Chaining**: each bucket holds a small list of entries; lookup scans the chain. Simple, tolerates load factor > 1. Java's HashMap converts long chains (>= 8) to red-black trees to cap worst case at O(log n).
- **Open addressing**: on collision, probe other slots (linear probing, quadratic, double hashing). Cache-friendly, no pointer overhead, but deletions need tombstones and clustering hurts as the table fills. CPython's dict uses open addressing.

**Load factor and resizing.** load = entries / buckets. Past a threshold (~0.7 open addressing, ~1.0 chaining) the table allocates a bigger array and *rehashes every entry* — O(n) for that one operation, amortized O(1) overall (same argument as dynamic array growth in [[Arrays-vs-Linked-Lists]]).

| Operation | Average | Worst |
|---|---|---|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |
| Space | O(n) | O(n) |

**Worked example — first non-repeating character.** Brute force compares each char against all others: O(n^2). One pass to build a count map, second pass to find the first char with count 1: O(n) time, O(k) space for alphabet size k.

```python
from collections import Counter
def first_unique(s):
    counts = Counter(s)                 # pass 1: O(n)
    for i, ch in enumerate(s):          # pass 2: O(n)
        if counts[ch] == 1:
            return i
    return -1
```

**Pitfalls.**
- "O(1)" is average-case under good hashing. Adversarial inputs that all collide give O(n) per op — real DoS vector (hash-flooding), which is why Python randomizes string hashing per process.
- Mutable keys: mutating a key object after insertion orphans the entry.
- Iterating while inserting/deleting can trigger a rehash and invalidate iteration (RuntimeError in Python).
- Equal objects must have equal hashes — override `__eq__` and `__hash__` together (equivalently `equals`/`hashCode` in Java).
- Ordering: don't rely on iteration order in general; CPython dicts preserve insertion order (3.7+) but sets don't.
- Hash tables can't do range queries or ordered traversal — that's what [[Trees-and-BSTs]] are for.

## Interview Angle

- The most frequent interview accelerator, period: whenever you write nested loops asking "have I seen this before?" or "does the complement exist?", a hash map converts O(n^2) to O(n) at the cost of O(n) space. Say the trade explicitly.
- Core drill problems: two-sum, group anagrams (key = sorted string or char-count tuple), longest consecutive sequence, LRU cache (hash map + doubly linked list), subarray sum equals k (prefix-sum counts).
- Design probe: "how would you implement a hash map?" — cover hash function, buckets, one collision strategy in detail, load factor, resize-and-rehash. Then "chaining vs open addressing?" — memory layout and cache behavior is the good answer.
- Know your language's facts: Python dict = open addressing, insertion-ordered, string hash randomized; `set` for membership-only; `defaultdict`/`Counter` for cleaner code.
- Hash map vs balanced BST: O(1) average vs O(log n) guaranteed *plus* ordered operations — pick BST when you need range/min/max/predecessor.

## Related

- [[Arrays-vs-Linked-Lists]]
- [[Two-Pointer-Pattern]]
- [[Big-O-Notation]]
- [[Trees-and-BSTs]]
- [[Hashing-vs-Encryption]]
- [[CS-Core-Index]]
