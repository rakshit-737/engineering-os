---
title: Word Search II
description: Find all dictionary words on a letter grid by DFS guided by a trie of the words.
domain: dsa
category: trie
type: problem
difficulty: advanced
status: evergreen
tags: [trie, backtracking, dfs, grid]
prerequisites: [Trie-Pattern, Implement-Trie-Prefix-Tree, Backtracking-Pattern]
related: [Implement-Trie-Prefix-Tree, Number-of-Islands, Subsets]
pattern: trie
source: "LeetCode 212"
languages: [python, java, cpp]
---

# Word Search II

Pattern: [[Trie-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given an `m x n` board of letters and a list of words, return every word that can be formed by a path of horizontally/vertically adjacent cells, using each cell at most once per word.

Example: board
```
o a a n
e t a e
i h k r
i f l v
```
words `["oath","pea","eat","rain"]` -> `["eat","oath"]`.

## Intuition

Running a separate grid search for every word repeats work. Put all words into a trie and run one DFS from each cell, walking the trie in lockstep; abandon a path as soon as the prefix is not in the trie.

## Brute force

For each word, DFS from every cell (Word Search I). O(W * m * n * 4^L).

## Optimized approach

Build a trie storing the complete word at its end node. DFS(r, c, node): take the child for `board[r][c]`; if missing, return. If the child has a word, record it and clear it (avoid duplicates). Mark the cell (`'#'`), recurse into 4 neighbours, restore. Optionally prune: remove leaf trie nodes once they are exhausted.

## Complexity

Time O(m * n * 4 * 3^(L-1)) in the worst case, L = max word length (the first step has 4 directions, then at most 3 since we cannot go back). Space O(total characters in words) for the trie plus O(L) recursion.

## Implementation

### Python

```python
class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        root = {}
        for w in words:
            node = root
            for ch in w:
                node = node.setdefault(ch, {})
            node["$"] = w

        m, n, found = len(board), len(board[0]), []

        def dfs(r: int, c: int, parent: dict) -> None:
            ch = board[r][c]
            node = parent.get(ch)
            if node is None:
                return
            if "$" in node:
                found.append(node.pop("$"))
            board[r][c] = "#"
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < m and 0 <= nc < n and board[nr][nc] != "#":
                    dfs(nr, nc, node)
            board[r][c] = ch
            if not node:                 # prune exhausted branch
                parent.pop(ch)

        for r in range(m):
            for c in range(n):
                dfs(r, c, root)
        return found
```

### Java

```java
import java.util.*;

class Solution {
    private static class Node {
        Node[] next = new Node[26];
        String word;
    }

    public List<String> findWords(char[][] board, String[] words) {
        Node root = new Node();
        for (String w : words) {
            Node node = root;
            for (char c : w.toCharArray()) {
                if (node.next[c - 'a'] == null) node.next[c - 'a'] = new Node();
                node = node.next[c - 'a'];
            }
            node.word = w;
        }
        List<String> found = new ArrayList<>();
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                dfs(board, r, c, root, found);
        return found;
    }

    private void dfs(char[][] board, int r, int c, Node parent, List<String> found) {
        if (r < 0 || c < 0 || r >= board.length || c >= board[0].length) return;
        char ch = board[r][c];
        if (ch == '#') return;
        Node node = parent.next[ch - 'a'];
        if (node == null) return;
        if (node.word != null) {
            found.add(node.word);
            node.word = null;
        }
        board[r][c] = '#';
        dfs(board, r + 1, c, node, found);
        dfs(board, r - 1, c, node, found);
        dfs(board, r, c + 1, node, found);
        dfs(board, r, c - 1, node, found);
        board[r][c] = ch;
    }
}
```

### C++

```cpp
#include <memory>
#include <string>
#include <vector>
using namespace std;

class Solution {
    struct Node {
        unique_ptr<Node> next[26];
        const string* word = nullptr;
    };
    vector<string> found;

    void dfs(vector<vector<char>>& board, int r, int c, Node* parent) {
        if (r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size()) return;
        char ch = board[r][c];
        if (ch == '#') return;
        Node* node = parent->next[ch - 'a'].get();
        if (!node) return;
        if (node->word) { found.push_back(*node->word); node->word = nullptr; }
        board[r][c] = '#';
        dfs(board, r + 1, c, node);
        dfs(board, r - 1, c, node);
        dfs(board, r, c + 1, node);
        dfs(board, r, c - 1, node);
        board[r][c] = ch;
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        Node root;
        for (const string& w : words) {
            Node* node = &root;
            for (char c : w) {
                auto& nx = node->next[c - 'a'];
                if (!nx) nx = make_unique<Node>();
                node = nx.get();
            }
            node->word = &w;
        }
        found.clear();
        for (int r = 0; r < (int)board.size(); ++r)
            for (int c = 0; c < (int)board[0].size(); ++c)
                dfs(board, r, c, &root);
        return found;
    }
};
```

## Edge cases

- Duplicate words in the dictionary: stored once at the end node, reported once.
- A word that is a prefix of another (`"oa"`, `"oath"`): keep searching after recording.
- 1 x 1 board.

## Common mistakes

- Reporting the same word multiple times (clear it after finding).
- Forgetting to restore the cell after DFS.
- Stopping DFS after finding a word (longer words may share the prefix).

## Follow-ups

- Prune trie leaves after use for large dictionaries (shown in the Python version).
- Word Search I (single word): plain backtracking without a trie.
- Boggle with diagonal moves: 8 directions, same structure.
