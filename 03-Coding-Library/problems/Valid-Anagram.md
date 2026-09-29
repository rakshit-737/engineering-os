---
title: Valid Anagram
description: Check whether two strings are anagrams by comparing character counts.
domain: dsa
category: strings
type: problem
difficulty: beginner
status: evergreen
tags: [strings, hashing, counting]
prerequisites: [Arrays-and-Hashing-Pattern]
related: [Group-Anagrams, Minimum-Window-Substring]
pattern: strings
source: "LeetCode 242"
languages: [python, java, cpp]
---

# Valid Anagram

Pattern: [[Arrays-and-Hashing-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given two lowercase strings `s` and `t`, return true if `t` is a rearrangement of `s` (same letters with the same multiplicities).

Example: `s = "anagram", t = "nagaram"` -> true; `s = "rat", t = "car"` -> false.

## Intuition

Order does not matter, only counts. Count letters in `s`, subtract letters in `t`, and check that every counter returns to zero.

## Brute force

Sort both strings and compare. Time O(n log n), space O(n) for the sorted copies.

## Optimized approach

If lengths differ, return false. Otherwise one 26-slot array: increment for `s[i]`, decrement for `t[i]`. All zeros means anagram.

## Complexity

Time O(n), space O(1) (26 counters).

## Implementation

### Python

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = [0] * 26
        for a, b in zip(s, t):
            count[ord(a) - 97] += 1
            count[ord(b) - 97] -= 1
        return all(c == 0 for c in count)
```

### Java

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
}
```

### C++

```cpp
#include <array>
#include <string>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        array<int, 26> count{};
        for (size_t i = 0; i < s.size(); ++i) {
            ++count[s[i] - 'a'];
            --count[t[i] - 'a'];
        }
        for (int c : count) if (c != 0) return false;
        return true;
    }
};
```

## Edge cases

- Different lengths: immediate false.
- Empty strings: true.
- Repeated letters (`"aab"` vs `"abb"`): counts catch it where set comparison would not.

## Common mistakes

- Comparing sets of characters instead of counts.
- Forgetting the length check and relying on the counters only (still correct, but the early exit is free).

## Follow-ups

- Unicode input: use a hash map (`Counter`, `HashMap<Character,Integer>`) instead of a fixed array.
- Find all anagram start positions of `p` in `s`: fixed-size sliding window with the same counters ([[Sliding-Window-Pattern]]).
