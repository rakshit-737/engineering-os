# Interview Prep Index

Hub for interview patterns. House rule: a pattern isn't learned until you can produce its template from memory and name the problem cue that triggers it.

## Pattern Notes (exist — drill until automatic)

**Array & String**
- [[Two-Pointer-Pattern]] — sorted arrays, pairs, in-place partitioning
- [[Sliding-Window-Pattern]] — contiguous subarray/substring optimization
- [[Binary-Search-Pattern]] — sorted search + answer-space generalization
- [[Intervals-Pattern]] — merge/overlap/scheduling, sweep line

**Graph & Tree**
- [[BFS-DFS-Pattern]] — half of all interview problems in disguise
- [[Union-Find-Pattern]] — connectivity and components without traversal

**Optimization & Search**
- [[DP-Pattern]] — state, recurrence, base case
- [[Greedy-Pattern]] — local choice, global optimum (when provable)
- [[Backtracking-Pattern]] — choose / explore / unchoose
- [[Heap-Pattern]] — top-K, K-way merge, streaming extremes
- [[Bit-Manipulation-Pattern]] — XOR tricks, masks, bit counting

**Language & OOP (campus placement staples)**
- [[OOP-Concepts]] — 4 pillars, polymorphism, abstract vs interface, SOLID
- [[Java-Interview-Essentials]] — JVM, collections, equals/hashCode, exceptions
- [[Cpp-Interview-Essentials]] — RAII, smart pointers, vtables, STL complexity

**Beyond Coding**
- [[System-Design-Basics]] — the 4-step framework + building blocks
- [[Behavioral-STAR-Method]] — stories, structured

## Pattern Recognition Cheat Row

| Problem says | Reach for |
|---|---|
| "sorted array", "pair summing to" | [[Two-Pointer-Pattern]], [[Binary-Search-Pattern]] |
| "longest/shortest substring/subarray" | [[Sliding-Window-Pattern]] |
| "shortest path", "levels", "connected" | [[BFS-DFS-Pattern]], [[Union-Find-Pattern]] |
| "number of ways", "min cost", "can you reach" | [[DP-Pattern]], [[Greedy-Pattern]] |
| "all combinations/permutations", board | [[Backtracking-Pattern]] |
| "top K", "Kth largest", "merge K" | [[Heap-Pattern]] |
| "meetings", "overlapping ranges" | [[Intervals-Pattern]] |
| "without extra memory", "appears once" | [[Bit-Manipulation-Pattern]] |

## Training System

- 12-week plan + mock cadence: `10-Career-Toolkit/Technical-Interview-Roadmap.md`
- Story bank: `10-Career-Toolkit/STAR-Story-Template.md`
- Applications: `10-Career-Toolkit/Internship-Application-Tracker.csv`
- Implementations to drill against: `03-Coding-Library/` — Python, Java, C++ (362 tests total)

## Drill Loop (per pattern)

1. Read the note → reproduce the template from memory
2. Solve 3 classics untimed, then 2 new problems at 25 min each
3. Every miss: write the recognition cue you didn't see into the note
4. Weekly: one mixed set, patterns unlabeled — recognition is the skill

Back to [[Home]]
