"""Core data structures with complexity and interview notes."""

from __future__ import annotations


class MinStack:
    """
    Stack supporting O(1) push, pop, top, and min retrieval.
    Time: O(1) per operation
    Space: O(n)
    Interview note: pair each value with the running minimum; avoids rescanning.
    """

    def __init__(self) -> None:
        self._stack: list[tuple[int, int]] = []

    def push(self, value: int) -> None:
        current_min = value if not self._stack else min(value, self._stack[-1][1])
        self._stack.append((value, current_min))

    def pop(self) -> int:
        return self._stack.pop()[0]

    def top(self) -> int:
        return self._stack[-1][0]

    def get_min(self) -> int:
        return self._stack[-1][1]

    def __len__(self) -> int:
        return len(self._stack)


class DisjointSet:
    """
    Union-Find with path compression and union by rank.
    Time: near O(1) amortized per operation (inverse Ackermann)
    Space: O(n)
    Interview note: core tool for connectivity, cycle detection, and Kruskal MST.
    """

    def __init__(self, size: int) -> None:
        self.parent = list(range(size))
        self.rank = [0] * size

    def find(self, x: int) -> int:
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a: int, b: int) -> bool:
        root_a = self.find(a)
        root_b = self.find(b)
        if root_a == root_b:
            return False

        if self.rank[root_a] < self.rank[root_b]:
            root_a, root_b = root_b, root_a
        self.parent[root_b] = root_a
        if self.rank[root_a] == self.rank[root_b]:
            self.rank[root_a] += 1
        return True

    def connected(self, a: int, b: int) -> bool:
        return self.find(a) == self.find(b)


class Trie:
    """
    Prefix tree over lowercase words.
    Time: O(L) insert/search/prefix for word length L
    Space: O(total characters)
    Interview note: standard for autocomplete, word search, and prefix counting.
    """

    def __init__(self) -> None:
        self._root: dict = {}

    def insert(self, word: str) -> None:
        node = self._root
        for ch in word:
            node = node.setdefault(ch, {})
        node["$"] = True

    def search(self, word: str) -> bool:
        node = self._find_node(word)
        return node is not None and "$" in node

    def starts_with(self, prefix: str) -> bool:
        return self._find_node(prefix) is not None

    def _find_node(self, prefix: str) -> dict | None:
        node = self._root
        for ch in prefix:
            if ch not in node:
                return None
            node = node[ch]
        return node


class LRUCache:
    """
    Least Recently Used cache with O(1) get and put.
    Time: O(1) per operation (dict preserves insertion order in Python 3.7+)
    Space: O(capacity)
    Interview note: production version uses a doubly linked list + hash map;
    Python's ordered dict gives the same asymptotics with less code.
    """

    def __init__(self, capacity: int) -> None:
        if capacity <= 0:
            raise ValueError("capacity must be positive")
        self.capacity = capacity
        self._data: dict[int, int] = {}

    def get(self, key: int) -> int:
        if key not in self._data:
            return -1
        self._data[key] = self._data.pop(key)
        return self._data[key]

    def put(self, key: int, value: int) -> None:
        if key in self._data:
            self._data.pop(key)
        elif len(self._data) >= self.capacity:
            oldest = next(iter(self._data))
            del self._data[oldest]
        self._data[key] = value
