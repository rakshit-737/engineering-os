---
title: Longest Common Subsequence
description: Classic 2D DP over prefixes of two strings, reducible to O(min(m, n)) space.
domain: dsa
category: dp-2d
type: problem
difficulty: intermediate
status: evergreen
tags: [dp, strings, 2d-dp]
prerequisites: [DP-Pattern]
related: [Longest-Increasing-Subsequence, Longest-Palindromic-Substring]
pattern: dp-2d
source: "LeetCode 1143"
languages: [python, java, cpp]
---

# Longest Common Subsequence

Pattern: [[DP-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given two strings, return the length of their longest common subsequence (characters in the same relative order, not necessarily contiguous). Return 0 if none.

Example: `"abcde", "ace"` -> `3` (`"ace"`).

## Intuition

Compare the last characters of the two prefixes. If equal, they can both end the LCS: `1 + LCS(i-1, j-1)`. Otherwise drop one of them: `max(LCS(i-1, j), LCS(i, j-1))`.

## Brute force

Enumerate all 2^m subsequences of one string and test each against the other. Exponential.

## Optimized approach

`dp[i][j]` = LCS of `a[:i]` and `b[:j]`, with row/column 0 equal to 0. Fill row by row. Only the previous row is needed, so keep two rows (or one row plus a saved diagonal).

## Complexity

Time O(m * n), space O(n) with rolling rows (O(m * n) for the full table, needed to reconstruct the string).

## Implementation

### Python

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        n = len(text2)
        prev = [0] * (n + 1)
        for ch in text1:
            cur = [0] * (n + 1)
            for j in range(1, n + 1):
                if ch == text2[j - 1]:
                    cur[j] = prev[j - 1] + 1
                else:
                    cur[j] = max(prev[j], cur[j - 1])
            prev = cur
        return prev[n]
```

### Java

```java
class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++)
                dp[i][j] = text1.charAt(i - 1) == text2.charAt(j - 1)
                        ? dp[i - 1][j - 1] + 1
                        : Math.max(dp[i - 1][j], dp[i][j - 1]);
        return dp[m][n];
    }
}
```

### C++

```cpp
#include <algorithm>
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int m = text1.size(), n = text2.size();
        vector<int> prev(n + 1, 0), cur(n + 1, 0);
        for (int i = 1; i <= m; ++i) {
            for (int j = 1; j <= n; ++j)
                cur[j] = (text1[i - 1] == text2[j - 1]) ? prev[j - 1] + 1
                                                        : max(prev[j], cur[j - 1]);
            swap(prev, cur);
        }
        return prev[n];
    }
};
```

## Edge cases

- Either string empty: 0.
- Identical strings: their length.
- No common characters: 0.

## Common mistakes

- Off-by-one between `dp` indices and string indices.
- Confusing subsequence with substring (Longest Common Substring resets to 0 on mismatch).

## Follow-ups

- Reconstruct the LCS string by walking back through the full table.
- Edit Distance and Shortest Common Supersequence: same table shape.
- Longest palindromic subsequence = LCS(s, reverse(s)).
