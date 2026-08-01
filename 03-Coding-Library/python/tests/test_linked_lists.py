from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.linked_lists import (
    ListNode,
    find_cycle_start,
    from_list,
    has_cycle,
    is_palindrome,
    merge_two_sorted,
    middle_node,
    remove_nth_from_end,
    reverse_list,
    to_list,
)


def build_cycle(values: list[int], pos: int) -> ListNode | None:
    """Build a list whose tail links back to the node at index pos."""
    head = from_list(values)
    if head is None or pos < 0:
        return head
    tail = head
    while tail.next is not None:
        tail = tail.next
    entry = head
    for _ in range(pos):
        entry = entry.next  # type: ignore[assignment, union-attr]
    tail.next = entry
    return head


class TestLinkedLists(unittest.TestCase):
    def test_from_list_to_list_roundtrip(self) -> None:
        self.assertEqual(to_list(from_list([])), [])
        self.assertEqual(to_list(from_list([7])), [7])
        self.assertEqual(to_list(from_list([1, 2, 2, 3])), [1, 2, 2, 3])

    def test_reverse_list(self) -> None:
        self.assertIsNone(reverse_list(None))
        self.assertEqual(to_list(reverse_list(from_list([5]))), [5])
        self.assertEqual(to_list(reverse_list(from_list([1, 2, 3, 4]))), [4, 3, 2, 1])

    def test_has_cycle_false(self) -> None:
        self.assertFalse(has_cycle(None))
        self.assertFalse(has_cycle(from_list([1])))
        self.assertFalse(has_cycle(from_list([1, 2, 3])))

    def test_has_cycle_true(self) -> None:
        self.assertTrue(has_cycle(build_cycle([1, 2, 3, 4], 1)))
        self.assertTrue(has_cycle(build_cycle([1], 0)))  # self-loop

    def test_find_cycle_start(self) -> None:
        self.assertIsNone(find_cycle_start(None))
        self.assertIsNone(find_cycle_start(from_list([1, 2, 3])))
        head = build_cycle([1, 2, 3, 4, 5], 2)
        start = find_cycle_start(head)
        assert head is not None and start is not None
        self.assertIs(start, head.next.next)  # type: ignore[union-attr]
        whole = build_cycle([1, 2], 0)
        self.assertIs(find_cycle_start(whole), whole)

    def test_merge_two_sorted(self) -> None:
        self.assertIsNone(merge_two_sorted(None, None))
        self.assertEqual(to_list(merge_two_sorted(from_list([1, 3]), None)), [1, 3])
        self.assertEqual(to_list(merge_two_sorted(None, from_list([2]))), [2])
        merged = merge_two_sorted(from_list([1, 2, 4]), from_list([1, 3, 4, 9]))
        self.assertEqual(to_list(merged), [1, 1, 2, 3, 4, 4, 9])

    def test_merge_two_sorted_disjoint_ranges(self) -> None:
        merged = merge_two_sorted(from_list([10, 20]), from_list([1, 2, 3]))
        self.assertEqual(to_list(merged), [1, 2, 3, 10, 20])

    def test_middle_node(self) -> None:
        self.assertIsNone(middle_node(None))
        single = from_list([1])
        self.assertIs(middle_node(single), single)
        odd = middle_node(from_list([1, 2, 3, 4, 5]))
        assert odd is not None
        self.assertEqual(odd.val, 3)
        even = middle_node(from_list([1, 2, 3, 4]))
        assert even is not None
        self.assertEqual(even.val, 3)  # second of the two middles

    def test_remove_nth_from_end(self) -> None:
        self.assertEqual(to_list(remove_nth_from_end(from_list([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5])
        self.assertEqual(to_list(remove_nth_from_end(from_list([1, 2]), 1)), [1])

    def test_remove_nth_from_end_removes_head(self) -> None:
        self.assertIsNone(remove_nth_from_end(from_list([1]), 1))
        self.assertEqual(to_list(remove_nth_from_end(from_list([1, 2, 3]), 3)), [2, 3])

    def test_remove_nth_from_end_n_too_large(self) -> None:
        head = from_list([1, 2, 3])
        self.assertEqual(to_list(remove_nth_from_end(head, 4)), [1, 2, 3])

    def test_remove_nth_from_end_n_nonpositive(self) -> None:
        self.assertEqual(to_list(remove_nth_from_end(from_list([1, 2, 3]), 0)), [1, 2, 3])
        self.assertEqual(to_list(remove_nth_from_end(from_list([1, 2, 3]), -2)), [1, 2, 3])
        self.assertIsNone(remove_nth_from_end(None, 0))

    def test_is_palindrome_true(self) -> None:
        self.assertTrue(is_palindrome(None))
        self.assertTrue(is_palindrome(from_list([1])))
        self.assertTrue(is_palindrome(from_list([1, 2, 2, 1])))
        self.assertTrue(is_palindrome(from_list([1, 2, 3, 2, 1])))

    def test_is_palindrome_false(self) -> None:
        self.assertFalse(is_palindrome(from_list([1, 2])))
        self.assertFalse(is_palindrome(from_list([1, 2, 3, 1])))
        self.assertFalse(is_palindrome(from_list([1, 1, 2, 1])))  # adversarial near-palindrome

    def test_is_palindrome_restores_list(self) -> None:
        for values in ([1, 2, 3, 2, 1], [1, 2, 2, 1], [1, 2, 3, 4]):
            head = from_list(values)
            is_palindrome(head)
            self.assertEqual(to_list(head), values)


if __name__ == "__main__":
    unittest.main()
