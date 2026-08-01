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

48 tests, stdlib only — no pytest required.

## Structure

- `src/algos/sorting.py` - sorting algorithms
- `src/algos/searching.py` - searching algorithms
- `src/algos/graphs.py` - graph traversal and shortest path
- `src/algos/data_structures.py` - MinStack, DisjointSet, Trie, LRUCache
- `src/algos/dp.py` - fib, coin change, LIS, knapsack, edit distance
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