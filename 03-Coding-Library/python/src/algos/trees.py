"""Binary tree algorithms with complexity and interview notes."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass


@dataclass
class TreeNode:
    """
    Binary tree node
    Time: O(1) per construction
    Space: O(1) per node
    Interview note: dataclass gives structural equality for free, but
    compare nodes by identity (is) when values may repeat.
    """

    val: int
    left: TreeNode | None = None
    right: TreeNode | None = None


def inorder(root: TreeNode | None) -> list[int]:
    """
    Inorder traversal (recursive: left, node, right)
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: inorder of a BST yields values in sorted order.
    Appends into one shared list; concatenating sublists per call would
    copy O(n) at each level and degrade to O(n^2) on a skewed tree.
    """
    result: list[int] = []

    def walk(node: TreeNode | None) -> None:
        if node is None:
            return
        walk(node.left)
        result.append(node.val)
        walk(node.right)

    walk(root)
    return result


def preorder(root: TreeNode | None) -> list[int]:
    """
    Preorder traversal (recursive: node, left, right)
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: preorder is the natural order for copying or
    serializing a tree.
    Appends into one shared list to stay O(n) (see inorder).
    """
    result: list[int] = []

    def walk(node: TreeNode | None) -> None:
        if node is None:
            return
        result.append(node.val)
        walk(node.left)
        walk(node.right)

    walk(root)
    return result


def postorder(root: TreeNode | None) -> list[int]:
    """
    Postorder traversal (recursive: left, right, node)
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: postorder visits children before parents, so it fits
    deletion and bottom-up aggregation.
    Appends into one shared list to stay O(n) (see inorder).
    """
    result: list[int] = []

    def walk(node: TreeNode | None) -> None:
        if node is None:
            return
        walk(node.left)
        walk(node.right)
        result.append(node.val)

    walk(root)
    return result


def inorder_iterative(root: TreeNode | None) -> list[int]:
    """
    Inorder traversal (iterative with explicit stack)
    Time: O(n)
    Space: O(h) stack
    Interview note: push the whole left spine, pop, then move right;
    each node is pushed and popped exactly once.
    """
    result: list[int] = []
    stack: list[TreeNode] = []
    node = root
    while node is not None or stack:
        while node is not None:
            stack.append(node)
            node = node.left
        node = stack.pop()
        result.append(node.val)
        node = node.right
    return result


def level_order(root: TreeNode | None) -> list[list[int]]:
    """
    Level-order traversal (BFS)
    Time: O(n)
    Space: O(w) for the widest level
    Interview note: snapshot len(queue) at the start of each round to
    split output into levels.
    Returns a list of levels, each a list of values left to right.
    """
    if root is None:
        return []
    levels: list[list[int]] = []
    queue: deque[TreeNode] = deque([root])
    while queue:
        level: list[int] = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        levels.append(level)
    return levels


def lowest_common_ancestor(
    root: TreeNode | None, p: TreeNode, q: TreeNode
) -> TreeNode | None:
    """
    Lowest common ancestor in a binary tree
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: if both subtrees report a hit the current node is
    the LCA; a node counts as its own ancestor.
    Assumes both p and q are nodes of the tree rooted at root.
    """
    if root is None or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left is not None and right is not None:
        return root
    return left if left is not None else right


def is_valid_bst(
    root: TreeNode | None,
    low: float = float("-inf"),
    high: float = float("inf"),
) -> bool:
    """
    BST validation (min/max bounds method)
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: comparing only with the parent misses deep
    violations; every node must satisfy the inherited (low, high) range.
    Uses strict inequality, so duplicate values are invalid.
    """
    if root is None:
        return True
    if not low < root.val < high:
        return False
    return is_valid_bst(root.left, low, root.val) and is_valid_bst(
        root.right, root.val, high
    )


def serialize(root: TreeNode | None) -> str:
    """
    Serialize a binary tree (preorder with null markers)
    Time: O(n)
    Space: O(n)
    Interview note: preorder plus "#" markers uniquely encodes the
    structure; no inorder pass is needed.
    """
    parts: list[str] = []

    def walk(node: TreeNode | None) -> None:
        if node is None:
            parts.append("#")
            return
        parts.append(str(node.val))
        walk(node.left)
        walk(node.right)

    walk(root)
    return ",".join(parts)


def deserialize(data: str) -> TreeNode | None:
    """
    Deserialize a binary tree (inverse of serialize)
    Time: O(n)
    Space: O(n)
    Interview note: consume tokens with a shared iterator so each
    recursive call resumes where the previous one stopped.
    """
    tokens = iter(data.split(","))

    def build() -> TreeNode | None:
        token = next(tokens)
        if token == "#":
            return None
        node = TreeNode(int(token))
        node.left = build()
        node.right = build()
        return node

    return build()


def max_depth(root: TreeNode | None) -> int:
    """
    Maximum depth of a binary tree
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: depth of empty tree is 0; state whether depth counts
    nodes or edges before coding.
    """
    if root is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))


def invert(root: TreeNode | None) -> TreeNode | None:
    """
    Invert (mirror) a binary tree in place
    Time: O(n)
    Space: O(h) recursion stack
    Interview note: swap children at every node; a tuple assignment does
    the swap and both recursions in one line.
    Returns the same root for chaining.
    """
    if root is None:
        return None
    root.left, root.right = invert(root.right), invert(root.left)
    return root
