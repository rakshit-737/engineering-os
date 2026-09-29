---
title: Longest Palindromic Substring
description: Expand around every center (odd and even) to find the longest palindromic substring in O(n^2).
domain: dsa
category: strings
type: problem
difficulty: intermediate
status: evergreen
tags: [strings, two-pointers, palindrome]
prerequisites: [Two-Pointer-Pattern]
related: [Longest-Common-Subsequence, DP-Pattern]
pattern: strings
source: "LeetCode 5"
languages: [python, java, cpp]
---

# Longest Palindromic Substring

Pattern: [[Two-Pointer-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given a string `s`, return its longest contiguous substring that reads the same forwards and backwards. If there are ties, any one is fine.

Example: `"babad"` -> `"bab"` (or `"aba"`); `"cbbd"` -> `"bb"`.

## Intuition

Every palindrome has a center: a single character (odd length) or a gap between two characters (even length). There are `2n - 1` centers; from each, grow outward with two pointers while the ends match.

## Brute force

Check all O(n^2) substrings, each in O(n). Time O(n^3), space O(1).

## Optimized approach

For each index `i`, expand around `(i, i)` and `(i, i + 1)`. Track the best `[start, end]`. A DP table `dp[i][j] = s[i]==s[j] and dp[i+1][j-1]` also gives O(n^2) time but O(n^2) space, so expand-around-center is preferred.

## Complexity

Time O(n^2), space O(1). (Manacher's algorithm achieves O(n) but is rarely expected.)

## Implementation

### Python

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        def expand(lo: int, hi: int) -> tuple[int, int]:
            while lo >= 0 and hi < len(s) and s[lo] == s[hi]:
                lo -= 1
                hi += 1
            return lo + 1, hi          # half-open [lo+1, hi)

        best_lo, best_hi = 0, 0
        for i in range(len(s)):
            for lo, hi in (expand(i, i), expand(i, i + 1)):
                if hi - lo > best_hi - best_lo:
                    best_lo, best_hi = lo, hi
        return s[best_lo:best_hi]
```

### Java

```java
class Solution {
    private int bestLo = 0, bestLen = 0;

    public String longestPalindrome(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return s.substring(bestLo, bestLo + bestLen);
    }

    private void expand(String s, int lo, int hi) {
        while (lo >= 0 && hi < s.length() && s.charAt(lo) == s.charAt(hi)) {
            lo--;
            hi++;
        }
        int len = hi - lo - 1;
        if (len > bestLen) {
            bestLen = len;
            bestLo = lo + 1;
        }
    }
}
```

### C++

```cpp
#include <string>
using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size(), bestLo = 0, bestLen = 0;
        auto expand = [&](int lo, int hi) {
            while (lo >= 0 && hi < n && s[lo] == s[hi]) { --lo; ++hi; }
            if (hi - lo - 1 > bestLen) { bestLen = hi - lo - 1; bestLo = lo + 1; }
        };
        for (int i = 0; i < n; ++i) {
            expand(i, i);
            expand(i, i + 1);
        }
        return s.substr(bestLo, bestLen);
    }
};
```

## Edge cases

- Single character: itself.
- All identical characters: the whole string.
- Even-length answers (`"cbbd"`) need the `(i, i+1)` center.

## Common mistakes

- Only expanding odd centers.
- Off-by-one when converting the stopped pointers back to the palindrome bounds (`lo + 1`, length `hi - lo - 1`).
- Confusing substring (contiguous) with subsequence (Longest Palindromic Subsequence is a DP problem).

## Follow-ups

- Count all palindromic substrings: same expansion, count each successful step.
- Longest palindromic subsequence: LCS of `s` and reverse(`s`) — see [[Longest-Common-Subsequence]].
- O(n): Manacher's algorithm (mention, rarely required to code).
