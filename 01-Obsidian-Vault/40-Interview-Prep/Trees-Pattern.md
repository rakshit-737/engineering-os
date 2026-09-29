---
title: Trees Pattern
description: Solve tree problems by choosing a traversal and defining what each recursive call returns.
domain: dsa
category: trees
type: pattern
difficulty: intermediate
status: evergreen
tags: [trees, bst, recursion, dfs, bfs]
prerequisites: [Recursion-Pattern, Trees-and-BSTs]
related: [BFS-DFS-Pattern, Recursion-Pattern, Trie-Pattern, Heap-Pattern]
---

# Trees Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Almost every binary tree problem is "pick a traversal, then decide what information flows **down** (parameters: bounds, depth, path so far) and what flows **up** (return values: height, subtree sum, found/not found)". Post-order (children first) combines subtree answers; pre-order pushes context down; in-order visits a BST in sorted order; BFS handles anything "per level".

## Details

**Recognition cues:**
- Height, diameter, balanced, max path sum -> post-order returning a value (and maybe updating a global).
- Validate BST, path sums from root -> pre-order passing bounds or running totals down.
- kth smallest, BST iterator, sorted output -> in-order.
- Level averages, right side view, zigzag -> BFS by levels.
- Lowest common ancestor -> post-order "found in left/right" (BST: walk down comparing values).
- Rebuild from traversals, serialize -> recursion with index maps.

**Template - post-order returning height and tracking a global:**

```python
def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node: return 0
        l, r = height(node.left), height(node.right)
        best = max(best, l + r)       # path through this node
        return 1 + max(l, r)          # what the parent needs
    height(root)
    return best
```

**Template - BST bounds:** `valid(node, lo, hi)`: `lo < node.val < hi`, recurse `(lo, val)` left and `(val, hi)` right.

**Worked example - LCA in a binary tree:** return `node` if it is `p` or `q`; recurse both sides; if both return non-null, this node is the LCA; otherwise pass up whichever is non-null.

**Complexity:** O(n) time; O(h) space for recursion (h = log n balanced, n skewed); BFS O(width).

**Classic traps:**
- Confusing "return value to parent" with "answer to the problem" (diameter, max path sum need both).
- BST validation against only direct children.
- Python recursion depth on skewed trees of 10^4+ nodes — offer an iterative version.
- Min depth: a node with one child is not a leaf.

## Interview Angle

- State the recursive contract in one sentence before coding: "`height(node)` returns the number of nodes on the longest downward path."
- Mention iterative alternatives (explicit stack for in-order) when asked about stack overflow.

## Practice Problems

- [[Maximum-Depth-of-Binary-Tree]]
- [[Binary-Tree-Level-Order-Traversal]]
- [[Validate-Binary-Search-Tree]]
- [[Kth-Smallest-Element-in-a-BST]]
- [[Construct-Binary-Tree-from-Preorder-and-Inorder-Traversal]]

## Related

- [[Trees-and-BSTs]]
- [[BFS-DFS-Pattern]]
- [[Recursion-Pattern]]
- [[Trie-Pattern]]
