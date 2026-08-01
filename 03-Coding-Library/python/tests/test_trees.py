from __future__ import annotations

import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.trees import (
    TreeNode,
    deserialize,
    inorder,
    inorder_iterative,
    invert,
    is_valid_bst,
    level_order,
    lowest_common_ancestor,
    max_depth,
    postorder,
    preorder,
    serialize,
)


def sample_tree() -> TreeNode:
    #        1
    #      /   \
    #     2     3
    #    / \     \
    #   4   5     6
    return TreeNode(
        1,
        TreeNode(2, TreeNode(4), TreeNode(5)),
        TreeNode(3, None, TreeNode(6)),
    )


def random_tree(rng: random.Random, size: int) -> TreeNode | None:
    if size == 0:
        return None
    left_size = rng.randint(0, size - 1)
    return TreeNode(
        rng.randint(-100, 100),
        random_tree(rng, left_size),
        random_tree(rng, size - 1 - left_size),
    )


class TestTrees(unittest.TestCase):
    def test_traversals_empty(self) -> None:
        self.assertEqual(inorder(None), [])
        self.assertEqual(preorder(None), [])
        self.assertEqual(postorder(None), [])
        self.assertEqual(inorder_iterative(None), [])
        self.assertEqual(level_order(None), [])

    def test_traversals_single(self) -> None:
        node = TreeNode(7)
        self.assertEqual(inorder(node), [7])
        self.assertEqual(preorder(node), [7])
        self.assertEqual(postorder(node), [7])
        self.assertEqual(inorder_iterative(node), [7])
        self.assertEqual(level_order(node), [[7]])

    def test_traversals_known_tree(self) -> None:
        root = sample_tree()
        self.assertEqual(inorder(root), [4, 2, 5, 1, 3, 6])
        self.assertEqual(preorder(root), [1, 2, 4, 5, 3, 6])
        self.assertEqual(postorder(root), [4, 5, 2, 6, 3, 1])

    def test_inorder_iterative_matches_recursive(self) -> None:
        rng = random.Random(42)
        for _ in range(30):
            root = random_tree(rng, rng.randint(0, 40))
            self.assertEqual(inorder_iterative(root), inorder(root))

    def test_level_order_levels(self) -> None:
        self.assertEqual(level_order(sample_tree()), [[1], [2, 3], [4, 5, 6]])
        skewed = TreeNode(1, TreeNode(2, TreeNode(3)))
        self.assertEqual(level_order(skewed), [[1], [2], [3]])

    def test_max_depth(self) -> None:
        self.assertEqual(max_depth(None), 0)
        self.assertEqual(max_depth(TreeNode(1)), 1)
        self.assertEqual(max_depth(sample_tree()), 3)
        skewed = TreeNode(1, None, TreeNode(2, None, TreeNode(3, None, TreeNode(4))))
        self.assertEqual(max_depth(skewed), 4)

    def test_invert(self) -> None:
        self.assertIsNone(invert(None))
        root = sample_tree()
        expected_reversed = list(reversed(inorder(root)))
        inverted = invert(root)
        self.assertIs(inverted, root)
        self.assertEqual(inorder(inverted), expected_reversed)
        invert(root)
        self.assertEqual(inorder(root), [4, 2, 5, 1, 3, 6])

    def test_is_valid_bst_valid(self) -> None:
        self.assertTrue(is_valid_bst(None))
        self.assertTrue(is_valid_bst(TreeNode(1)))
        bst = TreeNode(8, TreeNode(3, TreeNode(1), TreeNode(6)), TreeNode(10))
        self.assertTrue(is_valid_bst(bst))

    def test_is_valid_bst_deep_violation(self) -> None:
        # 6 is greater than its parent 5 but violates grandparent 10:
        # a parent-only check would wrongly accept this tree.
        root = TreeNode(10, TreeNode(5, TreeNode(3), TreeNode(6)), TreeNode(15))
        self.assertTrue(is_valid_bst(root))
        root.left.right.val = 12
        self.assertFalse(is_valid_bst(root))
        root.left.right.val = 6
        root.right.left = TreeNode(9)
        self.assertFalse(is_valid_bst(root))

    def test_is_valid_bst_duplicates_invalid(self) -> None:
        self.assertFalse(is_valid_bst(TreeNode(2, TreeNode(2))))
        self.assertFalse(is_valid_bst(TreeNode(2, None, TreeNode(2))))

    def test_lowest_common_ancestor(self) -> None:
        root = sample_tree()
        four = root.left.left
        five = root.left.right
        six = root.right.right
        self.assertIs(lowest_common_ancestor(root, four, five), root.left)
        self.assertIs(lowest_common_ancestor(root, four, six), root)
        # A node is its own ancestor.
        self.assertIs(lowest_common_ancestor(root, root.left, four), root.left)
        self.assertIs(lowest_common_ancestor(root, root, six), root)

    def test_serialize_deserialize_roundtrip(self) -> None:
        root = sample_tree()
        self.assertEqual(deserialize(serialize(root)), root)
        single = TreeNode(-5)
        self.assertEqual(deserialize(serialize(single)), single)

    def test_serialize_empty(self) -> None:
        self.assertEqual(serialize(None), "#")
        self.assertIsNone(deserialize("#"))

    def test_serialize_roundtrip_random(self) -> None:
        rng = random.Random(7)
        for _ in range(20):
            root = random_tree(rng, rng.randint(0, 30))
            restored = deserialize(serialize(root))
            self.assertEqual(restored, root)
            self.assertEqual(level_order(restored), level_order(root))


if __name__ == "__main__":
    unittest.main()
