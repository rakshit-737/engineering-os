---
title: Longest Substring Without Repeating Characters
description: Variable-size sliding window with a last-seen map that jumps the left edge past duplicates.
domain: dsa
category: sliding-window
type: problem
difficulty: intermediate
status: evergreen
tags: [sliding-window, hashing, strings]
prerequisites: [Sliding-Window-Pattern]
related: [Minimum-Window-Substring, Sliding-Window-Maximum]
pattern: sliding-window
source: "LeetCode 3"
languages: [python, java, cpp]
---

# Longest Substring Without Repeating Characters

Pattern: [[Sliding-Window-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given a string `s`, return the length of the longest contiguous substring in which no character appears twice.

Example: `"abcabcbb"` -> `3` (`"abc"`); `"pwwkew"` -> `3` (`"wke"`).

## Intuition

Keep a window `[left, right]` with all-distinct characters. When `s[right]` already appears inside the window, the window must start after that earlier occurrence.

## Brute force

Check every substring for uniqueness. O(n^3), or O(n^2) with an incremental set.

## Optimized approach

Store `last[c]` = latest index of `c`. For each `right`: if `last[c] >= left`, set `left = last[c] + 1`. Update `last[c] = right` and `best = max(best, right - left + 1)`.

## Complexity

Time O(n), space O(min(n, alphabet)).

## Implementation

### Python

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last, left, best = {}, 0, 0
        for right, c in enumerate(s):
            if last.get(c, -1) >= left:
                left = last[c] + 1
            last[c] = right
            best = max(best, right - left + 1)
        return best
```

### Java

```java
import java.util.Arrays;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        int[] last = new int[128];
        Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (last[c] >= left) left = last[c] + 1;
            last[c] = right;
            best = Math.max(best, right - left + 1);
        }
        return best;
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
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);
        int left = 0, best = 0;
        for (int right = 0; right < (int)s.size(); ++right) {
            unsigned char c = s[right];
            if (last[c] >= left) left = last[c] + 1;
            last[c] = right;
            best = max(best, right - left + 1);
        }
        return best;
    }
};
```

## Edge cases

- Empty string: 0.
- All same characters: 1.
- Duplicate outside the current window (`"abba"`): the `>= left` check prevents `left` moving backwards.

## Common mistakes

- `left = last[c] + 1` without the `>= left` guard, which can move `left` backwards.
- Using `char` as an index in C++ without casting to unsigned (negative for non-ASCII).

## Follow-ups

- At most K distinct characters: count map + shrink while `distinct > K`.
- Return the substring itself: track `bestLeft`.
