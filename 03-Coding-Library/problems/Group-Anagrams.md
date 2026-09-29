---
title: Group Anagrams
description: Bucket words by a canonical key (sorted letters or letter counts) in a hash map.
domain: dsa
category: arrays-and-hashing
type: problem
difficulty: intermediate
status: evergreen
tags: [hashing, strings]
prerequisites: [Arrays-and-Hashing-Pattern]
related: [Valid-Anagram, Two-Sum]
pattern: arrays-and-hashing
source: "LeetCode 49"
languages: [python, java, cpp]
---

# Group Anagrams

Pattern: [[Arrays-and-Hashing-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given a list of lowercase strings, group together the strings that are anagrams of each other (same letters, same counts). Groups may be returned in any order.

Example: `["eat","tea","tan","ate","nat","bat"]` -> `[ ["eat","tea","ate"],["tan","nat"],["bat"] ]`.

## Intuition

Anagrams share a canonical form. If we map each word to that form, grouping becomes "hash map from key to list".

## Brute force

Compare every pair with an anagram check and union them into groups. Time O(n^2 * k), where k is the word length.

## Optimized approach

Key = the word's letters sorted (O(k log k)), or a 26-count signature (O(k)). Append each word to `groups[key]`, then return the map's values.

## Complexity

Sorted key: O(n * k log k) time. Count key: O(n * k) time. Space O(n * k) for the map.

## Implementation

### Python

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for ch in s:
                count[ord(ch) - ord('a')] += 1
            groups[tuple(count)].append(s)
        return list(groups.values())
```

### Java

```java
import java.util.*;

class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] c = s.toCharArray();
            Arrays.sort(c);
            groups.computeIfAbsent(new String(c), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}
```

### C++

```cpp
#include <algorithm>
#include <string>
#include <unordered_map>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> out;
        for (auto& [key, g] : groups) out.push_back(move(g));
        return out;
    }
};
```

## Edge cases

- Empty string `""` forms its own group.
- A single word.
- All words identical.

## Common mistakes

- Using a Python `list` as a dict key (unhashable) instead of a `tuple`.
- Building a count key by joining numbers without a separator (`"1" + "11"` vs `"11" + "1"` collide).

## Follow-ups

- Unicode input: sort key or a `Counter`-based frozen key instead of 26 slots.
- Streaming words: maintain the map incrementally.
- Which key is faster depends on word length; state the trade-off rather than guessing.
