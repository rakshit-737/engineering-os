# Java Coding Library

Reusable algorithms and patterns for interview prep and practical engineering tasks — the Java sibling of `../python`.

## Run (compile + test)

```bash
cd f:/Engineering-OS/03-Coding-Library/java && javac -d out src/*.java tests/*.java && java -cp out TestRunner
```

111 checks, JDK only — no JUnit, no Maven/Gradle. The harness prints `N passed, M failed` and exits non-zero on any failure. All classes live in the default package so the one-line `javac` works.

## Structure

- `src/Sorting.java` - mergeSort, quickSort, insertionSort (pure: input never mutated, new array returned)
- `src/Searching.java` - binarySearch, lowerBound
- `src/Graphs.java` - BFS shortest path (unweighted), Dijkstra (PriorityQueue + lazy deletion)
- `src/DataStructures.java` - MinStack, DisjointSet (path compression + rank), Trie, LRUCache
- `src/DP.java` - coin change (min coins), LIS in O(n log n), edit distance
- `src/StringAlgos.java` - KMP search, anagram check, longest palindromic substring
- `tests/TestRunner.java` - plain `main()` harness with a `check(name, cond)` helper, one section per module

## Design Principles

- Pure static methods where possible; inputs never mutated
- Explicit complexity documentation — every public method's Javadoc carries `Time:` and `Space:` lines
- Interview notes included inline — one `Interview note:` line per public method
- Avoid hidden side effects
- Zero external dependencies: `javac` + `java` is the whole toolchain

## Java-Specific Interview Idioms Used

- **LRU cache** via `LinkedHashMap(capacity, 0.75f, /*accessOrder=*/true)` + overriding `removeEldestEntry` — the canonical Java answer; the hand-rolled HashMap + doubly-linked-list version is sketched in the class Javadoc for when the shortcut is banned
- **`ArrayDeque`** for stacks and queues — `java.util.Stack` is legacy and synchronized
- **`int[]{to, weight}` pairs** for graph edges instead of a tuple class
- **`PriorityQueue` + `Comparator.comparingInt`** with lazy deletion for Dijkstra (Java's heap has no decrease-key)
- **`Map.getOrDefault` / `Map.merge`** for adjacency lookups and character counting
- **`lo + (hi - lo) / 2`** midpoint to dodge int overflow in every binary search
- **`Arrays.copyOf` / `copyOfRange`** for defensive copies so sorts stay pure

## Extend

1. Add a new algorithm class in `src/` (default package, Java 17-compatible)
2. Give every public method a Javadoc with `Time:`, `Space:`, and an `Interview note:` line
3. Add a `testYourModule()` section in `tests/TestRunner.java` covering edge cases (empty, single element, not-found)
4. Re-run the one-liner above — keep the suite green
