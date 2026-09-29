---
slug: cpp-library
title: C++ Coding Library
description: Header-only C++17 STL algorithm library with a plain test harness.
domain: dsa
category: libraries
type: guide
difficulty: beginner
status: evergreen
tags: [code, library]
prerequisites: []
related: [DSA-Index]
---
# C++ Coding Library

Reusable algorithms and patterns for interview prep and practical engineering tasks.
Header-only, C++17, STL only — the C++ sibling of the `python/` library, following the
same philosophy: pure functions where possible, explicit complexity documentation,
interview notes inline.

## Run

```bash
cd 03-Coding-Library/cpp && g++ -std=c++17 -Wall -Wextra -O2 tests/test_main.cpp -I include -o test_main && ./test_main
```

Compiles with zero warnings under `-Wall -Wextra`. No test framework — a plain `main()`
harness with a `check(name, cond)` pass/fail counter, exiting 1 on any failure.
(On Windows the produced binary is `test_main.exe`; `./test_main` still works from Git Bash.)

## Structure

- `include/sorting.hpp` - merge sort, quick sort, insertion sort (return new vectors, input untouched)
- `include/searching.hpp` - `binary_search_index` (index or -1; named to avoid clashing with `std::binary_search`), `lower_bound_index`
- `include/graphs.hpp` - BFS shortest path (unweighted), Dijkstra (min-heap via `std::priority_queue` + `std::greater`)
- `include/data_structures.hpp` - MinStack, DisjointSet (path compression + union by rank), Trie, LRUCache
- `include/dp.hpp` - coin change, LIS in O(n log n), edit distance
- `include/string_algos.hpp` - KMP search, anagram check, longest palindromic substring
- `tests/test_main.cpp` - framework-free test harness covering every public function incl. edge cases

## Design Principles

- Header-only: `#pragma once` guards, everything `inline` or class-based, just `-I include` to use
- Everything lives in namespace `algos::` — no global-namespace pollution, no `using namespace std;`
- Pure functions where possible: sorts and searches take `const&` and return new values
- Explicit complexity documentation: every function's comment block states Time and Space
- Interview notes included inline — one per function
- STL only, no external dependencies, no test framework

## C++-Specific Interview Idioms

- **RAII**: the Trie owns its nodes through `std::unique_ptr` — destruction is automatic and
  leak-free with zero manual `delete`. Say "RAII" out loud in interviews when you pick smart pointers.
- **Iterator invalidation**: `std::vector` invalidates iterators on reallocation and erase;
  `std::list` never invalidates iterators to surviving nodes (insert/erase/splice-safe). Knowing
  *which* containers guarantee stability is a classic C++ interview discriminator.
- **Why `std::list` + `std::unordered_map` for LRU**: the map stores list iterators for O(1)
  lookup, and `list::splice` moves a node to the front in O(1) without copying or invalidating
  the stored iterator. A vector/deque would invalidate the map's iterators on modification —
  the design only works because of `std::list`'s iterator-stability guarantee.
- **Min-heap via `std::greater`**: `std::priority_queue` is a max-heap by default; Dijkstra
  passes `std::greater` and orders pairs as `(distance, node)` so comparison hits distance first.
- **Unsigned index safety**: binary search uses a half-open `[lo, hi)` loop to dodge the
  `std::size_t` underflow bug in the classic `hi = mid - 1` formulation, and `is_anagram`
  casts `char` to `unsigned char` before array indexing (plain `char` may be signed — UB otherwise).

## Extend

1. Add a new header in `include/` (`#pragma once`, namespace `algos::`, header-only)
2. Document Time/Space complexity and one interview note per function
3. Add `check(...)` cases for it in `tests/test_main.cpp` — keep the suite green and warning-free
