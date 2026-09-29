---
title: Minimum Window Substring
description: Shortest substring of s covering all characters of t, via expand-then-shrink sliding window with a missing counter.
domain: dsa
category: sliding-window
type: problem
difficulty: advanced
status: evergreen
tags: [sliding-window, hashing, strings]
prerequisites: [Sliding-Window-Pattern, Valid-Anagram]
related: [Longest-Substring-Without-Repeating-Characters, Valid-Anagram]
pattern: sliding-window
source: "LeetCode 76"
languages: [python, java, cpp]
---

# Minimum Window Substring

Pattern: [[Sliding-Window-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given strings `s` and `t`, return the shortest substring of `s` containing every character of `t` with at least the same multiplicity. Return `""` if none exists.

Example: `s = "ADOBECODEBANC", t = "ABC"` -> `"BANC"`.

## Intuition

Expand `right` until the window covers `t`; then shrink `left` as far as possible while still covering, recording the best. A single integer `missing` tracks how many required characters are still uncovered, so validity is O(1).

## Brute force

Check every substring against `t`'s counts. O(n^2 * alphabet) or worse.

## Optimized approach

`need[c]` = count of `c` in `t`; `missing = len(t)`. For each `right`: if `need[s[right]] > 0`, `missing--`; then `need[s[right]]--` (may go negative = surplus). While `missing == 0`: record window, then `need[s[left]]++`; if it becomes positive, `missing++`; `left++`.

## Complexity

Time O(|s| + |t|), space O(alphabet).

## Implementation

### Python

```python
from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        need = Counter(t)
        missing = len(t)
        left, best = 0, (0, float("inf"))
        for right, c in enumerate(s):
            if need[c] > 0:
                missing -= 1
            need[c] -= 1
            while missing == 0:
                if right - left < best[1] - best[0]:
                    best = (left, right)
                need[s[left]] += 1
                if need[s[left]] > 0:
                    missing += 1
                left += 1
        return "" if best[1] == float("inf") else s[best[0]:best[1] + 1]
```

### Java

```java
class Solution {
    public String minWindow(String s, String t) {
        int[] need = new int[128];
        for (char c : t.toCharArray()) need[c]++;
        int missing = t.length(), left = 0, bestLo = 0, bestLen = Integer.MAX_VALUE;
        for (int right = 0; right < s.length(); right++) {
            if (need[s.charAt(right)]-- > 0) missing--;
            while (missing == 0) {
                if (right - left + 1 < bestLen) {
                    bestLen = right - left + 1;
                    bestLo = left;
                }
                if (++need[s.charAt(left++)] > 0) missing++;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestLo, bestLo + bestLen);
    }
}
```

### C++

```cpp
#include <climits>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    string minWindow(string s, string t) {
        vector<int> need(128, 0);
        for (char c : t) ++need[c];
        int missing = t.size(), left = 0, bestLo = 0, bestLen = INT_MAX;
        for (int right = 0; right < (int)s.size(); ++right) {
            if (need[s[right]]-- > 0) --missing;
            while (missing == 0) {
                if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestLo = left; }
                if (++need[s[left++]] > 0) ++missing;
            }
        }
        return bestLen == INT_MAX ? "" : s.substr(bestLo, bestLen);
    }
};
```

## Edge cases

- `t` longer than `s`: `""`.
- `t` with repeated characters (`"AA"`): multiplicity matters.
- The whole `s` is the answer.

## Common mistakes

- Tracking "distinct characters satisfied" but decrementing on every occurrence (double counting).
- Recording the window after shrinking instead of before.

## Follow-ups

- Return all minimal windows, or the count of valid windows.
- Very large `s` with small `t`: filter `s` to positions whose char is in `t`, then run the window on that list.
