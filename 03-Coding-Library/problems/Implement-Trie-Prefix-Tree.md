---
title: Implement Trie (Prefix Tree)
description: Build a prefix tree supporting insert, exact search and prefix search in O(word length).
domain: dsa
category: trie
type: problem
difficulty: intermediate
status: evergreen
tags: [trie, design, strings]
prerequisites: [Trie-Pattern]
related: [Word-Search-II, Group-Anagrams]
pattern: trie
source: "LeetCode 208"
languages: [python, java, cpp]
---

# Implement Trie (Prefix Tree)

Pattern: [[Trie-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Implement a `Trie` class with `insert(word)`, `search(word)` (true if the exact word was inserted) and `startsWith(prefix)` (true if any inserted word has that prefix). Words are lowercase English letters.

Example: `insert("apple"); search("apple") -> true; search("app") -> false; startsWith("app") -> true; insert("app"); search("app") -> true`.

## Intuition

Store words as paths from a root, one character per edge, so all words sharing a prefix share the same path. A flag marks nodes where a complete word ends.

## Brute force

Keep a list/set of words. `search` is O(1) average with a set, but `startsWith` must scan all words: O(total characters).

## Optimized approach

Each node has up to 26 children and an `is_end` flag. Insert walks/creates nodes; search and startsWith walk existing nodes and differ only in whether `is_end` is required at the end.

## Complexity

Each operation O(L) for a word of length L. Space O(total characters * alphabet) worst case for array children (hash-map children use less memory for sparse tries).

## Implementation

### Python

```python
class TrieNode:
    __slots__ = ("children", "is_end")

    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_end = True

    def _walk(self, s: str):
        node = self.root
        for ch in s:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def search(self, word: str) -> bool:
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._walk(prefix) is not None
```

### Java

```java
class Trie {
    private static class Node {
        Node[] children = new Node[26];
        boolean isEnd;
    }

    private final Node root = new Node();

    public void insert(String word) {
        Node node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new Node();
            node = node.children[i];
        }
        node.isEnd = true;
    }

    private Node walk(String s) {
        Node node = root;
        for (char c : s.toCharArray()) {
            node = node.children[c - 'a'];
            if (node == null) return null;
        }
        return node;
    }

    public boolean search(String word) {
        Node node = walk(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return walk(prefix) != null;
    }
}
```

### C++

```cpp
#include <array>
#include <memory>
#include <string>
using namespace std;

class Trie {
    struct Node {
        array<unique_ptr<Node>, 26> children{};
        bool isEnd = false;
    };
    Node root;

    const Node* walk(const string& s) const {
        const Node* node = &root;
        for (char c : s) {
            node = node->children[c - 'a'].get();
            if (!node) return nullptr;
        }
        return node;
    }
public:
    void insert(const string& word) {
        Node* node = &root;
        for (char c : word) {
            auto& child = node->children[c - 'a'];
            if (!child) child = make_unique<Node>();
            node = child.get();
        }
        node->isEnd = true;
    }
    bool search(const string& word) const {
        const Node* node = walk(word);
        return node && node->isEnd;
    }
    bool startsWith(const string& prefix) const {
        return walk(prefix) != nullptr;
    }
};
```

## Edge cases

- A word that is a prefix of another (`app` vs `apple`): `is_end` distinguishes them.
- Inserting the same word twice.
- Empty prefix: `startsWith("")` is true (root exists).

## Common mistakes

- `search` returning true for a prefix that was never inserted as a word.
- C++ raw `new` without deletion (leaks); `unique_ptr` handles cleanup. Very deep tries can make recursive destruction deep, which is acceptable for interview input sizes.

## Follow-ups

- Delete a word (decrement counts / prune childless nodes).
- Count words with a given prefix: store a counter per node.
- Autocomplete top-k suggestions; wildcard `.` search (DFS on the trie).
- Memory: array children vs hash-map children trade-off.
