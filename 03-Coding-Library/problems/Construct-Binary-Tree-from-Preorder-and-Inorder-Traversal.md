---
title: Construct Binary Tree from Preorder and Inorder Traversal
description: Rebuild a tree recursively - preorder gives the root, inorder splits left and right subtrees.
domain: dsa
category: recursion
type: problem
difficulty: intermediate
status: evergreen
tags: [recursion, trees, divide-and-conquer, hashing]
prerequisites: [Recursion-Pattern, Trees-Pattern]
related: [Maximum-Depth-of-Binary-Tree, Validate-Binary-Search-Tree, Generate-Parentheses]
pattern: recursion
source: "LeetCode 105"
languages: [python, java, cpp]
---

# Construct Binary Tree from Preorder and Inorder Traversal

Pattern: [[Recursion-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given the preorder and inorder traversals of a binary tree with unique values, reconstruct and return the tree.

Example: `preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]` -> tree `[3,9,20,null,null,15,7]`.

## Intuition

The first preorder value is the root. Its position in inorder splits the remaining values into the left subtree (before it) and the right subtree (after it). Recurse on both sides — the subproblems have the same shape.

## Brute force

Linear search for the root in inorder at every call: O(n^2) on skewed trees.

## Optimized approach

Precompute `index[value]` for inorder. Keep a global preorder pointer. `build(lo, hi)` constructs the subtree whose inorder range is `[lo, hi]`: take `preorder[pre++]` as root, find its inorder index `m`, build left from `[lo, m-1]` then right from `[m+1, hi]` (left first, matching preorder).

## Complexity

Time O(n), space O(n) for the map plus O(h) recursion.

## Implementation

### Python

```python
class Solution:
    def buildTree(self, preorder: list[int], inorder: list[int]):
        index = {v: i for i, v in enumerate(inorder)}
        pre = 0

        def build(lo: int, hi: int):
            nonlocal pre
            if lo > hi:
                return None
            root = TreeNode(preorder[pre])
            pre += 1
            m = index[root.val]
            root.left = build(lo, m - 1)
            root.right = build(m + 1, hi)
            return root

        return build(0, len(inorder) - 1)
```

### Java

```java
import java.util.HashMap;
import java.util.Map;

class Solution {
    private int pre = 0;
    private int[] preorder;
    private final Map<Integer, Integer> index = new HashMap<>();

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        for (int i = 0; i < inorder.length; i++) index.put(inorder[i], i);
        return build(0, inorder.length - 1);
    }

    private TreeNode build(int lo, int hi) {
        if (lo > hi) return null;
        TreeNode root = new TreeNode(preorder[pre++]);
        int m = index.get(root.val);
        root.left = build(lo, m - 1);
        root.right = build(m + 1, hi);
        return root;
    }
}
```

### C++

```cpp
#include <unordered_map>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class Solution {
    int pre = 0;
    unordered_map<int, int> index;
    TreeNode* build(const vector<int>& preorder, int lo, int hi) {
        if (lo > hi) return nullptr;
        TreeNode* root = new TreeNode(preorder[pre++]);
        int m = index[root->val];
        root->left = build(preorder, lo, m - 1);
        root->right = build(preorder, m + 1, hi);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        pre = 0;
        index.clear();
        for (int i = 0; i < (int)inorder.size(); ++i) index[inorder[i]] = i;
        return build(preorder, 0, (int)inorder.size() - 1);
    }
};
```

## Edge cases

- Single node.
- Completely left- or right-skewed trees (recursion depth n).
- Duplicate values make the reconstruction ambiguous; the problem guarantees uniqueness.

## Common mistakes

- Building the right subtree before the left (preorder consumes left first).
- Slicing arrays at every call (O(n^2) copying in Python).

## Follow-ups

- Build from inorder + postorder: consume postorder from the back and build right before left.
- Preorder + postorder alone does not uniquely define a general binary tree (only a full binary tree).
- Serialize/deserialize a binary tree.
