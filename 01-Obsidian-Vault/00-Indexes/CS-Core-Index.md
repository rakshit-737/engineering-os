# CS Core Index

Hub for computer science fundamentals. Every note here should survive the test: *could I explain this on a whiteboard in an interview tomorrow?*

## Seed Notes (exist — fill their Details sections)

**Foundations**
- [[Big-O-Notation]] — the vocabulary everything else uses
- [[Arrays-vs-Linked-Lists]] — memory layout intuition
- [[Hash-Tables]] — the most-used structure in interviews and production
- [[Recursion-and-Stack-Frames]] — why deep recursion dies

**Algorithms**
- [[Binary-Search]] — and its generalization to answer spaces
- [[Sorting-Algorithms]] — bounds, stability, what Timsort is
- [[Graph-Traversal-BFS-DFS]] — half of all interview problems in disguise
- [[Dynamic-Programming]] — state, recurrence, base case

**Structures & Systems**
- [[Trees-and-BSTs]] — invariants and traversals
- [[Concurrency-Basics]] — threads vs processes vs async

**Systems Deep Dives**
- [[Operating-Systems]] — processes, scheduling, memory, syscalls, deadlock
- [[Computer-Networks]] — TCP/IP stack, HTTP/1.1-2-3, DNS, sockets
- [[DBMS]] — indexing, transactions, isolation levels, normalization
- [[Compilers-and-Interpreters]] — how code becomes execution
- [[Distributed-Systems]] — CAP, replication, quorums, consensus

## Planned Notes (create with Concept-Note-Template when studied)

- [[Version-Control-Internals]] — how git actually stores history
- [[Design-Patterns]] — the handful that appear in real codebases

## Runnable Companions

Theory lives here; working code lives in `03-Coding-Library/python`:
- Implementations: `src/algos/` (sorting, searching, graphs, data structures, DP)
- Verification: `python -m unittest discover -s tests` — 48 tests

## Practice Loop (per concept)

1. Read/learn → fill the note's Details section same day
2. Implement the core idea from memory (no peeking)
3. Run the test suite against your implementation
4. Solve 2 problems that use it ([[Interview-Prep-Index]] has the patterns)
5. One-line summary added to the note's Core Idea — if you can't compress it, you don't own it yet

Back to [[Home]]
