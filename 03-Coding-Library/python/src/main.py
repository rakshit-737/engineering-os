from __future__ import annotations

import argparse

from algos.data_structures import DisjointSet, LRUCache, MinStack, Trie
from algos.dp import coin_change_min, edit_distance, longest_increasing_subsequence
from algos.graphs import bfs_shortest_unweighted, dijkstra
from algos.searching import binary_search, lower_bound
from algos.sorting import merge_sort, quick_sort


def run_demo() -> None:
    nums = [7, 2, 9, 1, 4, 4]
    sorted_nums = merge_sort(nums)

    print("Original:", nums)
    print("Merge sort:", sorted_nums)
    print("Quick sort:", quick_sort(nums))

    target = 4
    print("Binary search index for 4:", binary_search(sorted_nums, target))
    print("Lower bound for 5:", lower_bound(sorted_nums, 5))

    unweighted = {1: [2, 3], 2: [4], 3: [4], 4: []}
    print("BFS distances from 1:", bfs_shortest_unweighted(unweighted, 1))

    weighted = {
        1: [(2, 2), (3, 5)],
        2: [(3, 1), (4, 4)],
        3: [(4, 1)],
        4: [],
    }
    print("Dijkstra distances from 1:", dijkstra(weighted, 1))

    stack = MinStack()
    for value in [5, 2, 7]:
        stack.push(value)
    print("MinStack min after pushes [5,2,7]:", stack.get_min())

    dsu = DisjointSet(4)
    dsu.union(0, 1)
    dsu.union(2, 3)
    print("DSU connected(0,1):", dsu.connected(0, 1), "| connected(0,3):", dsu.connected(0, 3))

    trie = Trie()
    trie.insert("code")
    print("Trie search 'code':", trie.search("code"), "| prefix 'co':", trie.starts_with("co"))

    cache = LRUCache(2)
    cache.put(1, 100)
    cache.put(2, 200)
    cache.put(3, 300)
    print("LRU get(1) after eviction:", cache.get(1), "| get(3):", cache.get(3))

    print("Coin change min for 11 with [1,2,5]:", coin_change_min([1, 2, 5], 11))
    print("LIS of [10,9,2,5,3,7,101,18]:", longest_increasing_subsequence([10, 9, 2, 5, 3, 7, 101, 18]))
    print("Edit distance horse->ros:", edit_distance("horse", "ros"))


def main() -> None:
    parser = argparse.ArgumentParser(description="Coding Library CLI")
    parser.add_argument("--demo", action="store_true", help="Run demo outputs")
    args = parser.parse_args()

    if args.demo:
        run_demo()
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
