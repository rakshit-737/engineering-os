---
tags: [concept, interview]
created: 2026-08-01
status: evergreen
---

# Sliding Window Pattern

Hub: [[Interview-Prep-Index]]

## Core Idea

Maintain a contiguous window `[left, right]` over an array/string plus an invariant describing a valid window (e.g. "at most K distinct chars"). Expand `right` one step at a time; while the invariant breaks, shrink from `left`. Each index enters and leaves the window once, so the O(n²) "all subarrays" scan collapses to O(n).

## Details

**Recognition cues:**
- "Longest/shortest **substring/subarray** with condition" — the word *contiguous* (explicit or implied) is the tell.
- "At most / exactly K distinct", "without repeating characters", "sum ≥ / ≤ target" (positive numbers only).
- Fixed-size variant: "every window of size K" (averages, anagram matching).
- If the subarray need not be contiguous, it's subsequence territory → DP, not sliding window.

**Template — variable-size window (longest valid):**

```python
def longest_window(s, k):
    count, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        count[ch] = count.get(ch, 0) + 1        # 1. extend right
        while len(count) > k:                    # 2. invariant broken -> shrink
            count[s[left]] -= 1
            if count[s[left]] == 0:
                del count[s[left]]
            left += 1
        best = max(best, right - left + 1)       # 3. window valid -> record
    return best
```

For *shortest* valid window (e.g. Minimum Window Substring), invert it: shrink `while` the window is still valid and record inside the shrink loop.

**Worked example — Longest Substring Without Repeating Characters:** invariant = "no char count > 1". Extend right; on a duplicate, advance left past it (or use a last-seen-index map to jump). "abcabcbb" → answer 3 ("abc"). O(n) time, O(min(n, alphabet)) space.

**Classic problems:** Longest Substring Without Repeating Characters, Minimum Window Substring, Longest Repeating Character Replacement, Max Consecutive Ones III, Sliding Window Maximum (monotonic deque variant), Find All Anagrams in a String (fixed window + counts).

**Complexity:** O(n) time — `left` and `right` each move at most n steps total (amortized argument; say the word "amortized"). Space O(k) or O(alphabet) for the window state.

**Classic traps:**
- Window state (hash map / counts) not updated symmetrically on shrink — decrement AND delete zero-count keys, or `len(count)` lies.
- Sliding window on sums breaks with **negative numbers** — shrinking no longer monotonically decreases the sum. Then you need prefix sums + hash map instead. Interviewers plant this deliberately.
- "Exactly K" is not one window: compute atMost(K) − atMost(K−1).
- Off-by-one in window length: it's `right − left + 1`.
- Using nested loops that re-scan the window contents — that reintroduces O(n·k); all bookkeeping must be O(1) per step.

## Interview Angle

- Lead with the invariant: "My window invariant is at most K distinct; I expand right, shrink while broken." That sentence shows you have the pattern, not a memorized solution.
- Expect the probe "why is this O(n) when there's a nested while loop?" — answer with the amortized argument: each element is added once and removed once.
- Expect the negative-numbers probe on sum problems — pre-empt it.
- State the fixed vs variable window distinction; fixed-size windows don't need the while loop, just add-one/remove-one per step.

## Related

- [[Two-Pointer-Pattern]]
- [[Hash-Tables]]
- [[Big-O-Notation]]
- [[Arrays-vs-Linked-Lists]]
