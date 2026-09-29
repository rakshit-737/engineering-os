---
title: Maximum Depth of Binary Tree
description: Compute tree height with post-order recursion or level-order BFS.
domain: dsa
category: trees
type: problem
difficulty: beginner
status: evergreen
tags: [trees, recursion, dfs]
prerequisites: [Trees-Pattern, Recursion-Pattern]
related: [Binary-Tree-Level-Order-Traversal, Validate-Binary-Search-Tree]
pattern: trees
source: "LeetCode 104"
languages: [python, java, cpp]
---

# Maximum Depth of Binary Tree

Pattern: [[Trees-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Return the number of nodes on the longest path from the root down to a leaf. An empty tree has depth 0.

Example: `[3,9,20,null,null,15,7]` -> `3`.

## Intuition

The depth of a tree is one plus the deeper of its two subtrees — a textbook post-order recursion.

## Brute force

Enumerate all root-to-leaf paths and take the longest. Same O(n) but more memory; the recursion below is the natural solution.

## Optimized approach

`depth(null) = 0`; `depth(node) = 1 + max(depth(left), depth(right))`. Iterative alternative: BFS and count levels (see [[Binary-Tree-Level-Order-Traversal]]).

## Complexity

Time O(n). Space O(h) recursion stack: O(log n) balanced, O(n) skewed.

## Implementation

### Python

```python
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val, self.left, self.right = val, left, right

class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

### Java

```java
// class TreeNode { int val; TreeNode left, right; TreeNode(int v) { val = v; } }

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
```

### C++

```cpp
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};
```

## Edge cases

- Empty tree: 0.
- Skewed tree of 10^4+ nodes: deep recursion may overflow the stack in Python (default limit about 1000); use BFS.

## Common mistakes

- Counting edges instead of nodes (off by one).
- Minimum depth is NOT `1 + min(...)` blindly: a node with one child is not a leaf.

## Follow-ups

- Minimum depth (handle single-child nodes).
- Balanced binary tree check: return height or -1 in one pass.
- Diameter of a binary tree: at each node, `left + right` heights.
