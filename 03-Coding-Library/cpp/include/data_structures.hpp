#pragma once
// Interview-classic data structures with complexity and interview notes.
// Header-only, C++17, STL only.

#include <algorithm>
#include <cstddef>
#include <list>
#include <memory>
#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

namespace algos {

/*
 * MinStack — stack supporting O(1) minimum retrieval
 * Time: O(1) for push / pop / top / get_min
 * Space: O(n) — a parallel stack of running minimums
 * Interview note: pushing min(value, current_min) alongside each element handles duplicate minimums for free.
 */
class MinStack {
public:
    void push(int value) {
        values_.push_back(value);
        mins_.push_back(mins_.empty() ? value : std::min(value, mins_.back()));
    }

    void pop() {
        values_.pop_back();
        mins_.pop_back();
    }

    int top() const { return values_.back(); }
    int get_min() const { return mins_.back(); }
    bool empty() const { return values_.empty(); }
    std::size_t size() const { return values_.size(); }

private:
    std::vector<int> values_;
    std::vector<int> mins_;
};

/*
 * DisjointSet (Union-Find) — path compression + union by rank
 * Time: O(alpha(n)) amortized per find/unite (effectively constant)
 * Space: O(n)
 * Interview note: both optimizations together give the inverse-Ackermann bound; either alone is only O(log n).
 */
class DisjointSet {
public:
    explicit DisjointSet(int n) : parent_(static_cast<std::size_t>(n)), rank_(static_cast<std::size_t>(n), 0) {
        for (int i = 0; i < n; ++i) {
            parent_[static_cast<std::size_t>(i)] = i;
        }
    }

    int find(int x) {
        if (parent_[static_cast<std::size_t>(x)] != x) {
            parent_[static_cast<std::size_t>(x)] = find(parent_[static_cast<std::size_t>(x)]);  // path compression
        }
        return parent_[static_cast<std::size_t>(x)];
    }

    // Returns true if a merge happened, false if a and b were already connected.
    bool unite(int a, int b) {
        int root_a = find(a);
        int root_b = find(b);
        if (root_a == root_b) {
            return false;
        }
        if (rank_[static_cast<std::size_t>(root_a)] < rank_[static_cast<std::size_t>(root_b)]) {
            std::swap(root_a, root_b);
        }
        parent_[static_cast<std::size_t>(root_b)] = root_a;  // attach shorter tree under taller
        if (rank_[static_cast<std::size_t>(root_a)] == rank_[static_cast<std::size_t>(root_b)]) {
            ++rank_[static_cast<std::size_t>(root_a)];
        }
        return true;
    }

    bool connected(int a, int b) { return find(a) == find(b); }

private:
    std::vector<int> parent_;
    std::vector<int> rank_;
};

/*
 * Trie (prefix tree) — unordered_map children per node
 * Time: O(L) per insert / search / starts_with, L = word length
 * Space: O(total characters inserted)
 * Interview note: unordered_map children trade memory for alphabet flexibility vs. a fixed array[26];
 * unique_ptr children make node ownership automatic (RAII — no manual delete, no leaks).
 */
class Trie {
public:
    Trie() : root_(std::make_unique<Node>()) {}

    void insert(const std::string& word) {
        Node* node = root_.get();
        for (const char c : word) {
            auto& child = node->children[c];
            if (!child) {
                child = std::make_unique<Node>();
            }
            node = child.get();
        }
        node->is_end = true;
    }

    bool search(const std::string& word) const {
        const Node* node = walk(word);
        return node != nullptr && node->is_end;
    }

    bool starts_with(const std::string& prefix) const { return walk(prefix) != nullptr; }

private:
    struct Node {
        std::unordered_map<char, std::unique_ptr<Node>> children;
        bool is_end = false;
    };

    const Node* walk(const std::string& s) const {
        const Node* node = root_.get();
        for (const char c : s) {
            const auto it = node->children.find(c);
            if (it == node->children.end()) {
                return nullptr;
            }
            node = it->second.get();
        }
        return node;
    }

    std::unique_ptr<Node> root_;
};

/*
 * LRUCache — std::list + std::unordered_map storing list iterators (THE classic C++ interview implementation)
 * Time: O(1) average for get / put
 * Space: O(capacity)
 * Interview note: this design only works because std::list guarantees iterator stability —
 * insert, erase (of other elements), and splice never invalidate iterators to remaining nodes,
 * so the map's stored iterators stay valid while splice() moves a node to the front in O(1)
 * without copying. A std::vector or std::deque would invalidate them and break the map.
 */
class LRUCache {
public:
    explicit LRUCache(std::size_t capacity) : capacity_(capacity) {}

    // Returns the value, or -1 if absent. A hit refreshes recency.
    int get(int key) {
        const auto it = index_.find(key);
        if (it == index_.end()) {
            return -1;
        }
        items_.splice(items_.begin(), items_, it->second);  // move node to front; iterator stays valid
        return it->second->second;
    }

    void put(int key, int value) {
        if (capacity_ == 0) {
            return;
        }
        const auto it = index_.find(key);
        if (it != index_.end()) {
            it->second->second = value;
            items_.splice(items_.begin(), items_, it->second);
            return;
        }
        if (items_.size() == capacity_) {
            index_.erase(items_.back().first);  // evict least recently used (back)
            items_.pop_back();
        }
        items_.emplace_front(key, value);
        index_[key] = items_.begin();
    }

    std::size_t size() const { return items_.size(); }

private:
    std::size_t capacity_;
    std::list<std::pair<int, int>> items_;  // front = most recently used, back = least
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> index_;
};

}  // namespace algos
