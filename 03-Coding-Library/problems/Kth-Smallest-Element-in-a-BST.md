---
title: Kth Smallest Element in a BST
description: In-order traversal of a BST yields sorted order; stop at the kth visited node.
domain: dsa
category: bst
type: problem
difficulty: intermediate
status: evergreen
tags: [bst, trees, stack]
prerequisites: [Trees-Pattern, Validate-Binary-Search-Tree]
related: [Validate-Binary-Search-Tree, Kth-Largest-Element-in-an-Array]
pattern: bst
source: "LeetCode 230"
languages: [python, java, cpp]
---

# Kth Smallest Element in a BST

Pattern: [[Trees-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given the root of a BST and an integer `k` (1-indexed, always valid), return the kth smallest value.

Example: `root = [3,1,4,null,2], k = 1` -> `1`.

## Intuition

In-order traversal (left, node, right) of a BST visits values in increasing order. The kth node visited is the answer, and we can stop early.

## Brute force

Collect the full in-order list and index `k - 1`. O(n) time and space.

## Optimized approach

Iterative in-order with an explicit stack: push the left spine, pop, decrement `k`; when `k` hits 0 return; otherwise go to the right child.

## Complexity

Time O(h + k), space O(h).

## Implementation

### Python

```python
class Solution:
    def kthSmallest(self, root, k: int) -> int:
        stack, node = [], root
        while True:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            k -= 1
            if k == 0:
                return node.val
            node = node.right
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode node = root;
        while (true) {
            while (node != null) {
                stack.push(node);
                node = node.left;
            }
            node = stack.pop();
            if (--k == 0) return node.val;
            node = node.right;
        }
    }
}
```

### C++

```cpp
#include <stack>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* node = root;
        while (true) {
            while (node) { st.push(node); node = node->left; }
            node = st.top(); st.pop();
            if (--k == 0) return node->val;
            node = node->right;
        }
    }
};
```

## Edge cases

- `k = 1`: leftmost node.
- `k = n`: rightmost node.
- Skewed tree: stack depth O(n).

## Common mistakes

- Pre-order instead of in-order.
- Recursive version that does not stop early or mishandles the shared counter.

## Follow-ups

- Frequent inserts/deletes with many kth queries: augment nodes with subtree sizes for O(h) queries.
- Kth largest: reverse in-order (right, node, left).
