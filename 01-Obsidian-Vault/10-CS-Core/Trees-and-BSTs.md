---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Trees and BSTs

Hub: [[CS-Core-Index]]

## Core Idea

A tree is a connected acyclic hierarchy: n nodes, n-1 edges, one root, no cycles. A binary search tree adds the ordering invariant — *every* node in the left subtree is less than the node, *every* node in the right subtree is greater — which turns search, insert, and delete into a single root-to-leaf walk: O(h), where h is the tree's height. Balanced, h = O(log n); degenerate (sorted insert order), the tree is a linked list and h = n. Self-balancing variants (AVL, red-black) guarantee O(log n).

## Details

**Vocabulary.** Root, leaf, height (longest root-to-leaf path), depth, subtree. Complete tree: all levels full except possibly the last, filled left to right (the shape heaps use). Balanced: height O(log n).

| Operation | BST average (balanced) | BST worst (degenerate) | Notes |
|---|---|---|---|
| Search | O(log n) | O(n) | one comparison per level |
| Insert | O(log n) | O(n) | search, then attach leaf |
| Delete | O(log n) | O(n) | 3 cases; hardest op |
| Inorder traversal | O(n) | O(n) | yields sorted order |
| Min / Max | O(log n) | O(n) | leftmost / rightmost node |

**Traversals.** Inorder (left, node, right) on a BST emits keys in sorted order — the single most exploited fact in tree problems. Preorder (node, left, right) serializes/copies a tree; postorder (left, right, node) deletes children before parents and computes bottom-up values (heights, subtree sums). Level-order is BFS with a queue — see [[Graph-Traversal-BFS-DFS]]. All are O(n) time, O(h) stack space.

```python
def search(node, key):                 # O(h): one path down
    while node and node.val != key:
        node = node.left if key < node.val else node.right
    return node

def inorder(node, out):                # BST -> sorted list
    if node:
        inorder(node.left, out)
        out.append(node.val)
        inorder(node.right, out)
```

**Delete — the three cases.** Leaf: unlink. One child: splice the child into the node's place. Two children: replace the node's value with its inorder successor (leftmost node of the right subtree), then delete that successor — it has at most one child, reducing to an easier case.

**Worked example — validate BST.** The classic trap: checking only `left.val < node.val < right.val` accepts invalid trees (a grandchild in the left subtree can exceed the root). Correct approach: pass down (min, max) bounds — the invariant is about *entire subtrees*.

```python
def is_bst(node, lo=float('-inf'), hi=float('inf')):
    if not node:
        return True
    if not (lo < node.val < hi):
        return False
    return is_bst(node.left, lo, node.val) and is_bst(node.right, node.val, hi)
```

Alternative: inorder traversal must be strictly increasing.

**Balancing.** Inserting 1,2,3,...,n into a plain BST gives a right chain — every op O(n). AVL trees rebalance with rotations when subtree heights differ by more than 1 (stricter balance, faster lookups); red-black trees allow looser balance for cheaper inserts (used by C++ `std::map`, Java `TreeMap`). Know that rotations exist and restore the invariant in O(1) — details are rarely asked. B-trees generalize to high fan-out for disk/database indexes.

**Pitfalls.**
- Validating a BST with the local parent-child check only — the bounds/inorder argument above.
- Quoting O(log n) without saying "if balanced"; the honest answer is O(h).
- Recursion depth on skewed trees: O(h) stack becomes O(n) and can overflow — see [[Recursion-and-Stack-Frames]].
- Duplicates: a strict BST has none; state your convention (e.g. duplicates go right, or store counts) before coding.
- Confusing "binary tree" with "BST" — many problems (max depth, invert, diameter) never use the ordering invariant.

## Interview Angle

- Lead with the money fact: "inorder traversal of a BST is sorted." It solves validate-BST, k-th smallest element, two-sum in BST, and recover-swapped-nodes almost by itself.
- Answer complexities as O(h), then split: O(log n) balanced, O(n) degenerate, and name AVL/red-black as the guarantee mechanism. That's the expected depth on balancing for most roles.
- Core problem set: max depth, invert tree, validate BST, lowest common ancestor (BST version: first node between p and q; general version: postorder), level-order traversal, serialize/deserialize, k-th smallest.
- "Hash map vs BST/TreeMap?" — hash gives O(1) average but no order; BST gives O(log n) *plus* min/max, predecessor/successor, and range queries. Range or "closest" requirements are the BST trigger. See [[Hash-Tables]].
- Recursive tree solutions: always state O(h) stack space unprompted.

## Related

- [[Graph-Traversal-BFS-DFS]]
- [[Heap-Pattern]]
- [[Recursion-and-Stack-Frames]]
- [[Binary-Search]]
- [[Hash-Tables]]
- [[CS-Core-Index]]
