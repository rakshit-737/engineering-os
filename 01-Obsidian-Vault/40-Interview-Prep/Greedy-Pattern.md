---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Greedy Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

Make the locally optimal choice at each step and never look back. Works only when the problem has the **greedy-choice property** (a locally optimal choice is part of some globally optimal solution) and **optimal substructure**. The standard proof tool is the **exchange argument**: take any optimal solution, swap its first differing choice for the greedy choice, and show the result is no worse — repeat until the optimal solution *is* the greedy one. Matroid one-liner: if the feasible sets form a matroid, greedy on sorted weights is provably optimal (this is why Kruskal's MST works).

## Details

Recognition cues:
- "Maximize/minimize count of non-conflicting things" (intervals, tasks, meetings)
- Sorting the input by one key makes the rest of the decision trivial
- Each decision is irrevocable and doesn't need future information
- DP state would work but collapses to a single running value

Template skeleton:

```python
def greedy(items):
    items.sort(key=lambda x: x[1])   # sort by the key that makes choices safe
    taken, bound = 0, float("-inf")
    for start, end in items:
        if start >= bound:            # compatible with choices so far
            taken += 1
            bound = end               # commit; never revisit
    return taken
```

Classic problems:
- **Activity Selection / Non-overlapping Intervals** — sort by end time, take every interval that doesn't conflict (LC 435 counts the removals instead)
- **Jump Game** — track farthest reachable index in one pass; greedy on reach
- **Gas Station** — if total gas >= total cost a solution exists; restart candidate start whenever tank goes negative
- **Assign Cookies** — sort both arrays, two pointers, satisfy greediest child that fits
- **Huffman coding (idea)** — repeatedly merge the two least-frequent nodes via a min-heap; greedy merge is optimal by exchange argument

Complexity: usually O(n log n) for the sort plus O(n) scan; Huffman is O(n log n) with a heap.

Counterexample drill (run before trusting any greedy rule):
- Try n = 2 or 3 with ties and with extreme skew (one huge item, many tiny ones)
- Try inputs where the greedy key and the value conflict (short interval, large weight)
- Weighted variants usually break unweighted greedy — weighted interval scheduling needs [[DP-Pattern]]

**The trap:** greedy that *looks* right but fails. Coin change with coins {1, 3, 4} and target 6: greedy gives 4+1+1 (3 coins), optimal is 3+3 (2 coins). Before committing in an interview, either sketch the exchange argument or attack your rule with a small counterexample. If you can't do either, fall back to DP.

## Interview Angle

Trigger words: "maximum number of...", "minimum removals", "earliest finish", scheduling, intervals, "can you reach". Say out loud *why* greedy is safe ("sort by end time; taking the earliest-finishing interval leaves the most room, exchange argument makes any optimal solution match it") — interviewers probe for the justification, not the loop. If pressed and unsure, state the DP formulation and show it degenerates to greedy.

## Related

- [[Intervals-Pattern]]
- [[Heap-Pattern]]
- [[DP-Pattern]]
- [[Two-Pointer-Pattern]]
- [[Interview-Prep-Index]]
