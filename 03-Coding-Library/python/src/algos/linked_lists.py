"""Singly linked list patterns with complexity and interview notes."""

from __future__ import annotations


class ListNode:
    """
    Singly linked list node.
    Time: O(1) per operation on a node.
    Space: O(1) per node.
    Interview note: draw boxes and arrows before coding pointer updates.
    """

    def __init__(self, val: int = 0, next: ListNode | None = None) -> None:
        self.val = val
        self.next = next

    def __repr__(self) -> str:
        return f"ListNode({self.val})"


def from_list(values: list[int]) -> ListNode | None:
    """
    Build a linked list from a Python list (test helper).
    Time: O(n)
    Space: O(n)
    Interview note: a dummy head keeps the build loop branch-free.
    """
    dummy = ListNode()
    tail = dummy
    for value in values:
        tail.next = ListNode(value)
        tail = tail.next
    return dummy.next


def to_list(head: ListNode | None) -> list[int]:
    """
    Convert a linked list back to a Python list (test helper).
    Time: O(n)
    Space: O(n)
    Interview note: handy for asserting structure after pointer surgery.
    """
    values: list[int] = []
    node = head
    while node is not None:
        values.append(node.val)
        node = node.next
    return values


def reverse_list(head: ListNode | None) -> ListNode | None:
    """
    Reverse a linked list iteratively.
    Time: O(n)
    Space: O(1)
    Interview note: track (prev, curr) and save curr.next before rewiring.
    """
    prev: ListNode | None = None
    curr = head
    while curr is not None:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev


def has_cycle(head: ListNode | None) -> bool:
    """
    Detect a cycle with Floyd's tortoise and hare.
    Time: O(n)
    Space: O(1)
    Interview note: fast moves 2 steps, slow 1; they must meet inside a cycle.
    """
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next  # type: ignore[union-attr]
        fast = fast.next.next
        if slow is fast:
            return True
    return False


def find_cycle_start(head: ListNode | None) -> ListNode | None:
    """
    Return the node where the cycle begins, or None if acyclic (Floyd phase 2).
    Time: O(n)
    Space: O(1)
    Interview note: after the meeting point, reset one pointer to head and
    advance both one step at a time; they meet at the cycle entrance.
    Proof sketch: let a = distance head -> cycle start, b = distance
    cycle start -> meeting point, c = cycle length. Slow walked a + b;
    fast walked 2(a + b) and the extra (a + b) must be whole laps, so
    a + b = k * c, i.e. a = k * c - b. Walking a steps from head therefore
    lands exactly (c - b) steps past the meeting point along the cycle,
    which is the cycle start — so both pointers arrive there together.
    """
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next  # type: ignore[union-attr]
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None

    finder = head
    while finder is not slow:
        finder = finder.next  # type: ignore[union-attr]
        slow = slow.next  # type: ignore[union-attr]
    return finder


def merge_two_sorted(
    first: ListNode | None, second: ListNode | None
) -> ListNode | None:
    """
    Merge two sorted linked lists into one sorted list (reuses nodes).
    Time: O(n + m)
    Space: O(1)
    Interview note: dummy head plus tail pointer avoids head special cases.
    """
    dummy = ListNode()
    tail = dummy
    while first is not None and second is not None:
        if first.val <= second.val:
            tail.next = first
            first = first.next
        else:
            tail.next = second
            second = second.next
        tail = tail.next
    tail.next = first if first is not None else second
    return dummy.next


def middle_node(head: ListNode | None) -> ListNode | None:
    """
    Return the middle node (second of two middles for even length).
    Time: O(n)
    Space: O(1)
    Interview note: when fast hits the end, slow sits at the middle.
    """
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next  # type: ignore[union-attr]
        fast = fast.next.next
    return slow


def remove_nth_from_end(head: ListNode | None, n: int) -> ListNode | None:
    """
    Remove the n-th node from the end in one pass using a dummy head.
    Time: O(n)
    Space: O(1)
    Interview note: lead pointer goes n + 1 ahead of trail from the dummy,
    so trail stops just before the node to delete (handles removing head).
    Out-of-range n (n <= 0 or n > length) returns the list unchanged.
    """
    if n <= 0:
        return head  # nothing to remove
    dummy = ListNode(0, head)
    lead: ListNode | None = dummy
    trail = dummy
    for _ in range(n + 1):
        if lead is None:
            return head  # n larger than list length: no change
        lead = lead.next
    while lead is not None:
        lead = lead.next
        trail = trail.next  # type: ignore[assignment, union-attr]
    trail.next = trail.next.next  # type: ignore[union-attr]
    return dummy.next


def is_palindrome(head: ListNode | None) -> bool:
    """
    Check whether a linked list reads the same forwards and backwards.
    Time: O(n)
    Space: O(1)
    Interview note: find the middle, reverse the second half in place,
    compare the two halves, then restore the list before returning.
    """
    if head is None or head.next is None:
        return True

    # Find node just before the second half (slow ends at end of first half).
    slow = head
    fast = head
    while fast.next is not None and fast.next.next is not None:
        slow = slow.next  # type: ignore[assignment, union-attr]
        fast = fast.next.next

    second = reverse_list(slow.next)

    result = True
    left: ListNode | None = head
    right = second
    while right is not None:
        if left is None or left.val != right.val:
            result = False
            break
        left = left.next
        right = right.next

    slow.next = reverse_list(second)  # restore original structure
    return result
