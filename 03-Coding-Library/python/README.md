---
slug: python-library
title: Python Coding Library
description: Python algorithm library with unit tests, run instructions and module map.
domain: dsa
category: libraries
type: guide
difficulty: beginner
status: evergreen
tags: [code, library]
prerequisites: []
related: [DSA-Index]
---
# Python Coding Library

Reusable algorithms and patterns for interview prep and practical engineering tasks.

## Run

```bash
python src/main.py --demo
```

## Test

```bash
python -m unittest discover -s tests -v
```

135 tests, stdlib only — no pytest required.

## Structure

- `src/algos/sorting.py` - sorting algorithms
- `src/algos/searching.py` - searching algorithms
- `src/algos/graphs.py` - graph traversal and shortest path
- `src/algos/data_structures.py` - MinStack, DisjointSet, Trie, LRUCache
- `src/algos/dp.py` - fib, coin change, LIS, knapsack, edit distance
- `src/algos/strings.py` - KMP, Rabin-Karp, Z-function, palindromes, anagrams
- `src/algos/trees.py` - traversals, level order, LCA, BST validation, serialize/deserialize
- `src/algos/linked_lists.py` - reverse, Floyd cycle detection, merge, palindrome in O(1) space
- `src/algos/heaps_intervals.py` - top-K, k-way merge, merge/insert intervals, meeting rooms
- `src/algos/bit_math.py` - bit tricks, gcd/lcm, sieve, modular fast power, bitmask subsets
- `src/algos/security_utils.py` - defensive crypto: SHA-256, HMAC, PBKDF2 password hashing, secure tokens
- `src/main.py` - small CLI for quick demos
- `tests/` - unittest suite (one file per module)

## Design Principles

- Pure functions where possible
- Explicit complexity documentation
- Interview notes included inline
- Avoid hidden side effects

## Extend

1. Add new algorithm file in `src/algos`
2. Add complexity notes
3. Add a demo case in `src/main.py`
4. Add a matching `tests/test_<module>.py` — keep the suite green