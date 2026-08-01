---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Intervals Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

Most interval problems collapse to: **sort, then sweep once**. The only real design decision is the sort key. Sort by **start** when you're merging or stitching intervals together (you need to see neighbors in timeline order). Sort by **end** when you're greedily selecting a maximum set of compatible intervals (earliest finish leaves the most room — see [[Greedy-Pattern]]).

## Details

Recognition cues:
- Input is pairs `[start, end]` (meetings, bookings, ranges, timelines)
- "Merge", "overlap", "conflict", "minimum rooms", "maximum non-overlapping"
- Two sorted timelines that must be combined

Overlap test for `a` and `b` (any order): `a.start <= b.end and b.start <= a.end`. After sorting by start it simplifies to `cur.start <= prev.end`.

Merge template (sort by start):

```python
def merge(intervals):
    intervals.sort(key=lambda iv: iv[0])
    out = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:                   # overlaps (or touches) previous
            out[-1][1] = max(out[-1][1], e)   # extend
        else:
            out.append([s, e])
    return out
```

Sweep line concept: explode each interval into events `(start, +1)` and `(end, -1)`, sort events, run a counter. The running count is "how many intervals are active right now"; its max answers Meeting Rooms II. Equivalent trick: sort starts and ends in two separate arrays and two-pointer through them, or push end times into a min-heap and pop ends that finished before the next start.

Classic problems:
- **Merge Intervals** — the template above verbatim
- **Insert Interval** — three phases: copy intervals ending before the new one, absorb all that overlap it (expand new interval's bounds), copy the rest
- **Meeting Rooms I** — sort by start; any `cur.start < prev.end` means conflict
- **Meeting Rooms II** — sweep line max concurrency, or min-heap of end times; heap size = rooms
- **Non-overlapping Intervals** — sort by end, greedily keep compatible ones, answer = total − kept

Complexity: O(n log n) sort dominates; the sweep is O(n). Heap variant is O(n log n).

**The trap:** touching vs overlapping boundary convention. Do `[1,3]` and `[3,5]` overlap? Merge Intervals says yes (merge on `s <= prev_end`); Meeting Rooms and Non-overlapping Intervals say no (a meeting can start exactly when another ends — use strict `<`). Decide the convention with the interviewer *before* writing the comparison, and in sweep line order end events before start events at the same timestamp when touching doesn't conflict.

## Interview Angle

Trigger words: meetings, calendar, merge ranges, minimum rooms/platforms, remove to make non-overlapping. Announce the sort key and why. State the boundary convention explicitly — it's the most common off-by-one interviewers watch for. If asked for a follow-up, sweep line generalizes (max concurrent load, skyline-style problems).

## Related

- [[Greedy-Pattern]]
- [[Heap-Pattern]]
- [[Two-Pointer-Pattern]]
- [[Binary-Search-Pattern]]
- [[Interview-Prep-Index]]
