// Plain-main test harness — no framework, mirrors the python library's stdlib-only testing philosophy.
// Build: g++ -std=c++17 -Wall -Wextra -O2 tests/test_main.cpp -I include -o test_main

#include <cstdio>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

#include "data_structures.hpp"
#include "dp.hpp"
#include "graphs.hpp"
#include "searching.hpp"
#include "sorting.hpp"
#include "string_algos.hpp"

namespace {

int g_passed = 0;
int g_failed = 0;

void check(const std::string& name, bool cond) {
    if (cond) {
        ++g_passed;
    } else {
        ++g_failed;
        std::printf("FAIL: %s\n", name.c_str());
    }
}

void test_sorting() {
    const std::vector<int> input = {5, 2, 9, 1, 5, 6};
    const std::vector<int> expected = {1, 2, 5, 5, 6, 9};

    check("merge_sort sorts with duplicates", algos::merge_sort(input) == expected);
    check("merge_sort leaves input untouched", input == std::vector<int>({5, 2, 9, 1, 5, 6}));
    check("merge_sort empty", algos::merge_sort({}) == std::vector<int>{});
    check("merge_sort single", algos::merge_sort({7}) == std::vector<int>{7});
    check("merge_sort already sorted", algos::merge_sort({1, 2, 3}) == std::vector<int>({1, 2, 3}));
    check("merge_sort reverse sorted", algos::merge_sort({3, 2, 1}) == std::vector<int>({1, 2, 3}));
    check("merge_sort negatives", algos::merge_sort({-1, -5, 3, 0}) == std::vector<int>({-5, -1, 0, 3}));

    check("quick_sort sorts with duplicates", algos::quick_sort(input) == expected);
    check("quick_sort leaves input untouched", input == std::vector<int>({5, 2, 9, 1, 5, 6}));
    check("quick_sort empty", algos::quick_sort({}) == std::vector<int>{});
    check("quick_sort single", algos::quick_sort({7}) == std::vector<int>{7});
    check("quick_sort all equal", algos::quick_sort({4, 4, 4}) == std::vector<int>({4, 4, 4}));
    check("quick_sort reverse sorted", algos::quick_sort({3, 2, 1}) == std::vector<int>({1, 2, 3}));

    check("insertion_sort sorts with duplicates", algos::insertion_sort(input) == expected);
    check("insertion_sort leaves input untouched", input == std::vector<int>({5, 2, 9, 1, 5, 6}));
    check("insertion_sort empty", algos::insertion_sort({}) == std::vector<int>{});
    check("insertion_sort single", algos::insertion_sort({7}) == std::vector<int>{7});
    check("insertion_sort nearly sorted", algos::insertion_sort({1, 3, 2}) == std::vector<int>({1, 2, 3}));
}

void test_searching() {
    const std::vector<int> sorted = {1, 3, 5, 7, 9, 11};

    check("binary_search_index finds middle", algos::binary_search_index(sorted, 7) == 3);
    check("binary_search_index finds first", algos::binary_search_index(sorted, 1) == 0);
    check("binary_search_index finds last", algos::binary_search_index(sorted, 11) == 5);
    check("binary_search_index missing value", algos::binary_search_index(sorted, 4) == -1);
    check("binary_search_index below range", algos::binary_search_index(sorted, 0) == -1);
    check("binary_search_index above range", algos::binary_search_index(sorted, 99) == -1);
    check("binary_search_index empty", algos::binary_search_index({}, 5) == -1);
    check("binary_search_index single hit", algos::binary_search_index({5}, 5) == 0);
    check("binary_search_index single miss", algos::binary_search_index({5}, 6) == -1);

    check("lower_bound_index exact match", algos::lower_bound_index(sorted, 5) == 2);
    check("lower_bound_index between values", algos::lower_bound_index(sorted, 4) == 2);
    check("lower_bound_index below all", algos::lower_bound_index(sorted, 0) == 0);
    check("lower_bound_index above all", algos::lower_bound_index(sorted, 99) == 6);
    check("lower_bound_index empty", algos::lower_bound_index({}, 5) == 0);
    check("lower_bound_index duplicates -> first", algos::lower_bound_index({2, 4, 4, 4, 8}, 4) == 1);
}

void test_graphs() {
    const std::unordered_map<int, std::vector<int>> adj = {
        {1, {2, 3}},
        {2, {4}},
        {3, {4}},
        {4, {}},
        {5, {}},  // isolated node
    };
    const auto dist = algos::bfs_shortest_unweighted(adj, 1);
    check("bfs source distance 0", dist.at(1) == 0);
    check("bfs direct neighbor", dist.at(2) == 1 && dist.at(3) == 1);
    check("bfs two hops", dist.at(4) == 2);
    check("bfs unreachable node absent", dist.find(5) == dist.end());

    const auto single = algos::bfs_shortest_unweighted({}, 42);
    check("bfs source not in adjacency still distance 0", single.size() == 1 && single.at(42) == 0);

    const std::unordered_map<int, std::vector<std::pair<int, int>>> weighted = {
        {1, {{2, 4}, {3, 1}}},
        {3, {{2, 2}, {4, 7}}},
        {2, {{4, 1}}},
        {6, {}},  // unreachable
    };
    const auto d = algos::dijkstra(weighted, 1);
    check("dijkstra source distance 0", d.at(1) == 0);
    check("dijkstra prefers multi-edge shorter path", d.at(2) == 3);  // 1->3->2 beats direct 1->2
    check("dijkstra one hop", d.at(3) == 1);
    check("dijkstra relaxes through cheaper route", d.at(4) == 4);  // 1->3->2->4 beats 1->3->4
    check("dijkstra unreachable node absent", d.find(6) == d.end());
}

void test_min_stack() {
    algos::MinStack st;
    check("min_stack starts empty", st.empty() && st.size() == 0);
    st.push(5);
    st.push(3);
    st.push(8);
    check("min_stack top", st.top() == 8);
    check("min_stack min tracks smallest", st.get_min() == 3);
    st.pop();
    check("min_stack min after pop", st.get_min() == 3);
    st.push(3);  // duplicate of current min
    st.push(1);
    check("min_stack new min", st.get_min() == 1);
    st.pop();
    check("min_stack duplicate min survives pop", st.get_min() == 3);
    st.pop();
    st.pop();
    check("min_stack min restored", st.get_min() == 5 && st.size() == 1);
}

void test_disjoint_set() {
    algos::DisjointSet ds(6);
    check("disjoint_set initially separate", !ds.connected(0, 1));
    check("disjoint_set unite returns true on merge", ds.unite(0, 1));
    check("disjoint_set connected after unite", ds.connected(0, 1));
    check("disjoint_set unite returns false when already joined", !ds.unite(1, 0));
    ds.unite(2, 3);
    ds.unite(1, 2);
    check("disjoint_set transitive connectivity", ds.connected(0, 3));
    check("disjoint_set unrelated stays separate", !ds.connected(0, 4));
    check("disjoint_set shared root after compression", ds.find(0) == ds.find(3));
    check("disjoint_set self connected", ds.connected(5, 5));
}

void test_trie() {
    algos::Trie trie;
    check("trie empty search misses", !trie.search("apple"));
    trie.insert("apple");
    trie.insert("app");
    trie.insert("banana");
    check("trie finds inserted word", trie.search("apple"));
    check("trie finds shorter inserted word", trie.search("app"));
    check("trie prefix is not a word", !trie.search("appl"));
    check("trie missing word", !trie.search("orange"));
    check("trie starts_with hit", trie.starts_with("app"));
    check("trie starts_with full word", trie.starts_with("banana"));
    check("trie starts_with miss", !trie.starts_with("bx"));
    check("trie empty prefix matches", trie.starts_with(""));
    check("trie empty string not inserted", !trie.search(""));
    trie.insert("");
    check("trie empty string after insert", trie.search(""));
}

void test_lru_cache() {
    algos::LRUCache cache(2);
    check("lru miss returns -1", cache.get(1) == -1);
    cache.put(1, 100);
    cache.put(2, 200);
    check("lru get hit", cache.get(1) == 100);
    cache.put(3, 300);  // evicts key 2 (key 1 was refreshed by get)
    check("lru evicts least recently used", cache.get(2) == -1);
    check("lru refreshed key survives", cache.get(1) == 100);
    check("lru new key present", cache.get(3) == 300);
    cache.put(1, 111);  // overwrite refreshes recency and value
    check("lru overwrite updates value", cache.get(1) == 111);
    cache.put(4, 400);  // evicts key 3
    check("lru overwrite refreshed recency", cache.get(1) == 111 && cache.get(3) == -1);
    check("lru size tracks entries", cache.size() == 2);

    algos::LRUCache tiny(1);
    tiny.put(7, 70);
    tiny.put(8, 80);
    check("lru capacity 1 keeps only newest", tiny.get(7) == -1 && tiny.get(8) == 80);

    algos::LRUCache zero(0);
    zero.put(1, 10);
    check("lru capacity 0 stores nothing", zero.get(1) == -1 && zero.size() == 0);
}

void test_dp() {
    check("coin_change standard", algos::coin_change_min({1, 2, 5}, 11) == 3);  // 5+5+1
    check("coin_change impossible", algos::coin_change_min({2}, 3) == -1);
    check("coin_change zero amount", algos::coin_change_min({1, 5}, 0) == 0);
    check("coin_change exact single coin", algos::coin_change_min({1, 3, 4}, 4) == 1);
    check("coin_change no coins", algos::coin_change_min({}, 7) == -1);
    check("coin_change negative amount", algos::coin_change_min({1}, -1) == -1);

    check("lis standard", algos::longest_increasing_subsequence({10, 9, 2, 5, 3, 7, 101, 18}) == 4);
    check("lis empty", algos::longest_increasing_subsequence({}) == 0);
    check("lis single", algos::longest_increasing_subsequence({5}) == 1);
    check("lis strictly increasing rejects duplicates", algos::longest_increasing_subsequence({2, 2, 2}) == 1);
    check("lis decreasing", algos::longest_increasing_subsequence({5, 4, 3}) == 1);
    check("lis all increasing", algos::longest_increasing_subsequence({1, 2, 3, 4}) == 4);

    check("edit_distance horse->ros", algos::edit_distance("horse", "ros") == 3);
    check("edit_distance intention->execution", algos::edit_distance("intention", "execution") == 5);
    check("edit_distance identical", algos::edit_distance("abc", "abc") == 0);
    check("edit_distance from empty", algos::edit_distance("", "abc") == 3);
    check("edit_distance to empty", algos::edit_distance("abc", "") == 3);
    check("edit_distance both empty", algos::edit_distance("", "") == 0);
}

void test_string_algos() {
    check("kmp single match", algos::kmp_search("hello world", "world") == std::vector<int>{6});
    check("kmp multiple matches", algos::kmp_search("abababa", "aba") == std::vector<int>({0, 2, 4}));
    check("kmp overlapping matches", algos::kmp_search("aaaa", "aa") == std::vector<int>({0, 1, 2}));
    check("kmp no match", algos::kmp_search("abc", "xyz") == std::vector<int>{});
    check("kmp pattern longer than text", algos::kmp_search("ab", "abc") == std::vector<int>{});
    check("kmp empty pattern convention", algos::kmp_search("abc", "") == std::vector<int>{});
    check("kmp whole text match", algos::kmp_search("abc", "abc") == std::vector<int>{0});

    check("is_anagram true", algos::is_anagram("listen", "silent"));
    check("is_anagram false same length", !algos::is_anagram("hello", "world"));
    check("is_anagram different lengths", !algos::is_anagram("ab", "abc"));
    check("is_anagram both empty", algos::is_anagram("", ""));
    check("is_anagram repeated letters", algos::is_anagram("aabb", "bbaa"));
    check("is_anagram count mismatch", !algos::is_anagram("aab", "abb"));

    const std::string babad = algos::longest_palindromic_substring("babad");
    check("lps babad", babad == "bab" || babad == "aba");
    check("lps even length", algos::longest_palindromic_substring("cbbd") == "bb");
    check("lps empty", algos::longest_palindromic_substring("").empty());
    check("lps single char", algos::longest_palindromic_substring("x") == "x");
    check("lps whole string", algos::longest_palindromic_substring("racecar") == "racecar");
    check("lps no repeat -> single char", algos::longest_palindromic_substring("abc").size() == 1);
}

}  // namespace

int main() {
    test_sorting();
    test_searching();
    test_graphs();
    test_min_stack();
    test_disjoint_set();
    test_trie();
    test_lru_cache();
    test_dp();
    test_string_algos();

    std::printf("\n%d passed, %d failed, %d total\n", g_passed, g_failed, g_passed + g_failed);
    return g_failed == 0 ? 0 : 1;
}
