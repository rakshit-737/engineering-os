---
title: Trie Pattern
description: Prefix trees give O(L) insert and prefix lookup and prune multi-word searches.
domain: dsa
category: trie
type: pattern
difficulty: intermediate
status: evergreen
tags: [trie, strings, prefix]
prerequisites: [Trees-Pattern, Arrays-and-Hashing-Pattern]
related: [Trees-Pattern, Backtracking-Pattern, Bit-Manipulation-Pattern]
---

# Trie Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

A trie stores strings as root-to-node paths, one character per edge, so words with a common prefix share nodes. Operations cost O(L) in the word length, independent of how many words are stored, and — the real win — a search can **stop early** the moment a prefix does not exist. That pruning is what makes multi-word grid search and autocomplete fast.

## Details

**Recognition cues:**
- "Starts with", "autocomplete", "prefix count" -> trie.
- "Search many words at once" in a grid or text -> build a trie of the words, DFS once.
- "Wildcard `.` matching" over a dictionary -> DFS over trie children.
- "Maximum XOR of two numbers" -> binary trie over bits (greedy choose opposite bit).
- "Replace words with shortest root" -> walk until the first end-of-word.

**Template:**

```python
class TrieNode:
    def __init__(self):
        self.children = {}      # or [None] * 26 for fixed lowercase
        self.is_end = False
        self.count = 0          # words passing through (for prefix counts)

def insert(root, word):
    node = root
    for ch in word:
        node = node.children.setdefault(ch, TrieNode())
        node.count += 1
    node.is_end = True

def find(root, s):
    node = root
    for ch in s:
        node = node.children.get(ch)
        if node is None:
            return None
    return node                 # exact word: node and node.is_end
```

**Worked example - Word Search II:** store the full word at its end node. DFS from each cell while walking the trie; if the current letter has no child, stop. On finding a word, record it and clear it so it is reported once. Pruning exhausted leaves keeps later searches fast.

**Complexity:** insert/search O(L). Space O(total characters) nodes; with 26-slot arrays each node costs 26 pointers — hash-map children are leaner for sparse alphabets.

**Classic traps:**
- Treating a prefix as a word (forgetting `is_end`).
- Reporting duplicates in grid search.
- Memory blow-up with array children on large alphabets (Unicode) — use maps.

## Interview Angle

- Justify the trie over a hash set: a set answers exact lookups, but prefix queries would need scanning every word.
- Know the binary-trie variant for XOR problems; it is a frequent follow-up for "strong" candidates.

## Practice Problems

- [[Implement-Trie-Prefix-Tree]]
- [[Word-Search-II]]

## Related

- [[Trees-Pattern]]
- [[Backtracking-Pattern]]
- [[Bit-Manipulation-Pattern]]
