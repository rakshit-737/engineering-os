from __future__ import annotations

import argparse

from algos.bit_math import count_set_bits, fast_pow, sieve_of_eratosthenes, single_number
from algos.data_structures import DisjointSet, LRUCache, MinStack, Trie
from algos.dp import coin_change_min, edit_distance, longest_increasing_subsequence
from algos.graphs import bfs_shortest_unweighted, dijkstra
from algos.heaps_intervals import merge_intervals, min_meeting_rooms, top_k_frequent
from algos.linked_lists import from_list, has_cycle, reverse_list, to_list
from algos.searching import binary_search, lower_bound
from algos.security_utils import generate_token, hash_password, hmac_sign, hmac_verify, verify_password
from algos.sorting import merge_sort, quick_sort
from algos.strings import is_anagram, kmp_search, longest_palindromic_substring
from algos.trees import TreeNode, is_valid_bst, level_order, serialize


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

    print("KMP 'aba' in 'ababa':", kmp_search("ababa", "aba"))
    print("Longest palindrome in 'babad':", longest_palindromic_substring("babad"))
    print("Anagram 'listen'/'silent':", is_anagram("listen", "silent"))

    root = TreeNode(2, TreeNode(1), TreeNode(3))
    print("Level order of BST [2,1,3]:", level_order(root))
    print("Valid BST:", is_valid_bst(root), "| serialized:", serialize(root))

    head = from_list([1, 2, 3, 4, 5])
    print("Reversed [1..5]:", to_list(reverse_list(head)))
    print("Cycle in fresh [1,2,3]:", has_cycle(from_list([1, 2, 3])))

    print("Top-2 frequent of [1,1,1,2,2,3]:", top_k_frequent([1, 1, 1, 2, 2, 3], 2))
    print("Merge [[1,3],[2,6],[8,10]]:", merge_intervals([[1, 3], [2, 6], [8, 10]]))
    print("Meeting rooms for [[0,30],[5,10],[15,20]]:", min_meeting_rooms([[0, 30], [5, 10], [15, 20]]))

    print("Set bits in 29:", count_set_bits(29), "| single number of [4,1,2,1,2]:", single_number([4, 1, 2, 1, 2]))
    print("Primes <= 30:", sieve_of_eratosthenes(30))
    print("3^13 mod 7:", fast_pow(3, 13, 7))

    key = b"demo-key"
    tag = hmac_sign(key, b"payload")
    print("HMAC verify ok:", hmac_verify(key, b"payload", tag), "| tampered:", hmac_verify(key, b"payload!", tag))
    stored = hash_password("hunter2")
    print("Password verify ok:", verify_password("hunter2", stored), "| wrong:", verify_password("hunter3", stored))
    print("Random token (16 bytes):", generate_token(16))


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
