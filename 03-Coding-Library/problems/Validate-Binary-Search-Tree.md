---
title: Validate Binary Search Tree
description: Check the BST property by passing down open (low, high) bounds during DFS.
domain: dsa
category: bst
type: problem
difficulty: intermediate
status: evergreen
tags: [bst, trees, recursion]
prerequisites: [Trees-Pattern, Trees-and-BSTs]
related: [Kth-Smallest-Element-in-a-BST, Maximum-Depth-of-Binary-Tree]
pattern: bst
source: "LeetCode 98"
languages: [python, java, cpp]
---

# Validate Binary Search Tree

Pattern: [[Trees-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Determine whether a binary tree is a valid BST: every node's value is strictly greater than all values in its left subtree and strictly less than all values in its right subtree.

Example: `[2,1,3]` -> true; `[5,1,4,null,null,3,6]` -> false (3 is in 5's right subtree).

## Intuition

Checking only a node against its direct children is not enough. Each node must lie in an interval inherited from all its ancestors: going left tightens the upper bound, going right tightens the lower bound.

## Brute force

For every node, scan its whole left and right subtrees for max/min. O(n^2) worst case.

## Optimized approach

`valid(node, lo, hi)`: null is valid; otherwise require `lo < node.val < hi` and recurse with `(lo, node.val)` on the left and `(node.val, hi)` on the right. Alternative: in-order traversal must be strictly increasing.

## Complexity

Time O(n), space O(h).

## Implementation

### Python

```python
class Solution:
    def isValidBST(self, root) -> bool:
        def valid(node, lo, hi) -> bool:
            if not node:
                return True
            if not (lo < node.val < hi):
                return False
            return valid(node.left, lo, node.val) and valid(node.right, node.val, hi)
        return valid(root, float("-inf"), float("inf"))
```

### Java

```java
class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean valid(TreeNode node, long lo, long hi) {
        if (node == null) return true;
        if (node.val <= lo || node.val >= hi) return false;
        return valid(node.left, lo, node.val) && valid(node.right, node.val, hi);
    }
}
```

### C++

```cpp
#include <climits>

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class Solution {
    bool valid(TreeNode* node, long long lo, long long hi) {
        if (!node) return true;
        if (node->val <= lo || node->val >= hi) return false;
        return valid(node->left, lo, node->val) && valid(node->right, node->val, hi);
    }
public:
    bool isValidBST(TreeNode* root) {
        return valid(root, LLONG_MIN, LLONG_MAX);
    }
};
```

## Edge cases

- Node values equal to `INT_MIN`/`INT_MAX`: use 64-bit or nullable bounds.
- Duplicates: invalid under the strict definition.
- Empty tree: valid.

## Common mistakes

- Comparing only with immediate children.
- Using `Integer.MIN_VALUE` as the sentinel, which rejects a legitimate node with that value.

## Follow-ups

- Recover a BST where two nodes were swapped (in-order, find the two inversions).
- Iterative in-order validation with an explicit stack.
- Largest BST subtree inside a binary tree (post-order returning min/max/size).
