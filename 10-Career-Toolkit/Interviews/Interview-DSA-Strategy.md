---
title: Interview DSA Strategy
description: How to run a 45-minute coding round minute by minute, communicate, and recover when stuck.
domain: career
category: interviews
type: guide
difficulty: intermediate
status: evergreen
tags: [dsa, coding-interview]
related: [Interview-Engine-Index, Technical-Interview-Roadmap, Big-O-Notation]
order: 10
---

# Interview DSA Strategy

Interviewers typically score four things: problem solving, coding, verification/testing and communication. A correct but silent solution loses points; a well-communicated near-solution can still pass.

## The 45-minute run sheet

| Minutes | Phase | What you do |
|---|---|---|
| 0-2 | Intro | Short hello; skip the life story |
| 2-7 | Clarify | Restate the problem. Ask: input size, value ranges, duplicates, empty input, sorted?, return format, in-place allowed? Write 1-2 examples incl. an edge case |
| 7-12 | Approach | State brute force + its complexity. Then identify the pattern and propose the better approach with time/space. **Get agreement before coding** |
| 12-30 | Code | Clean, named variables, helper functions. Narrate intent, not keystrokes |
| 30-38 | Test | Dry-run your example line by line. Then edge cases: empty, single element, all equal, max size, negative |
| 38-43 | Optimize / follow-ups | Discuss tradeoffs, alternative approaches, what changes if input streams / does not fit in memory |
| 43-45 | Your questions | One real question about the team or work |

## Pattern recognition cues

| Signal in problem | Likely pattern | Note |
|---|---|---|
| Sorted array, pair/triplet sum | Two pointers | [[Two-Pointer-Pattern]] |
| Contiguous subarray/substring with constraint | Sliding window | [[Sliding-Window-Pattern]] |
| Sorted / monotonic answer space, "minimum max" | Binary search | [[Binary-Search-Pattern]] |
| Top K, running median, merge K | Heap | [[Heap-Pattern]] |
| Grid / graph reachability, shortest unweighted path | BFS/DFS | [[BFS-DFS-Pattern]] |
| Connectivity, grouping, cycle in undirected graph | Union-Find | [[Union-Find-Pattern]] |
| All combinations / permutations | Backtracking | [[Backtracking-Pattern]] |
| Overlapping subproblems, "number of ways", min cost | DP | [[DP-Pattern]] |
| Overlapping ranges | Intervals | [[Intervals-Pattern]] |
| Local choice provably optimal | Greedy | [[Greedy-Pattern]] |

Use the input size to sanity-check target complexity: roughly, n up to ~10^5 needs about O(n log n) or better; n up to ~20 permits exponential search.

## When stuck

1. Say so and say what you are trying: "I'm considering a hashmap to cut the inner loop."
2. Solve a smaller instance by hand and look for the repeated work.
3. Go back to brute force and ask what it recomputes.
4. Take the hint gracefully; interviewers expect to give some.

## Common traps

- Coding before agreeing on the approach.
- Not stating complexity (both time and space).
- Testing by "looks right" instead of tracing.
- Silent 5-minute stretches.
- Language gaps: know your language's standard library ([[Python-Stdlib-Cheat-Sheet]], [[Java-Cheat-Sheet]], [[Cpp-STL-Cheat-Sheet]]).
