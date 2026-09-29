---
title: Binary Tree Level Order Traversal
description: Group node values by depth using BFS that processes one queue-length batch per level.
domain: dsa
category: trees
type: problem
difficulty: intermediate
status: evergreen
tags: [trees, bfs, queue]
prerequisites: [Trees-Pattern, Queue-and-Deque-Pattern]
related: [Maximum-Depth-of-Binary-Tree, Rotting-Oranges, BFS-DFS-Pattern]
pattern: trees
source: "LeetCode 102"
languages: [python, java, cpp]
---

# Binary Tree Level Order Traversal

Pattern: [[Trees-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Return the values of a binary tree grouped by level, top to bottom and left to right within a level.

Example: `[3,9,20,null,null,15,7]` -> `[ [3],[9,20],[15,7] ]`.

## Intuition

A FIFO queue visits nodes in order of distance from the root. Snapshot the queue size at the start of each round; exactly that many nodes form the current level.

## Brute force

DFS with a depth parameter, appending to `levels[depth]`. Also O(n) — a valid alternative, not worse.

## Optimized approach

Queue starts with root. While non-empty: `size = len(queue)`, pop `size` nodes, record their values, enqueue their children.

## Complexity

Time O(n), space O(w) where w is the maximum width (up to about n/2).

## Implementation

### Python

```python
from collections import deque

class Solution:
    def levelOrder(self, root) -> list[list[int]]:
        if not root:
            return []
        out, q = [], deque([root])
        while q:
            level = []
            for _ in range(len(q)):
                node = q.popleft()
                level.append(node.val)
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)
            out.append(level)
        return out
```

### Java

```java
import java.util.*;

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> out = new ArrayList<>();
        if (root == null) return out;
        Deque<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            out.add(level);
        }
        return out;
    }
}
```

### C++

```cpp
#include <queue>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> out;
        if (!root) return out;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int size = q.size();
            vector<int> level;
            for (int i = 0; i < size; ++i) {
                TreeNode* node = q.front(); q.pop();
                level.push_back(node->val);
                if (node->left) q.push(node->left);
                if (node->right) q.push(node->right);
            }
            out.push_back(move(level));
        }
        return out;
    }
};
```

## Edge cases

- Empty tree: `[]`.
- Skewed tree: one node per level.

## Common mistakes

- Reading `len(q)` inside the loop condition while also appending children (mixes levels).
- Using a Python list with `pop(0)` (O(n) per pop).

## Follow-ups

- Zigzag level order: reverse every other level.
- Right side view: last node of each level.
- Level averages, or connect next-right pointers.
