#pragma once
// Graph traversal and shortest-path algorithms with complexity and interview notes.
// Header-only, C++17, STL only.

#include <functional>
#include <queue>
#include <unordered_map>
#include <utility>
#include <vector>

namespace algos {

/*
 * BFS Shortest Path (unweighted graph)
 * Time: O(V + E)
 * Space: O(V)
 * Interview note: BFS gives shortest paths only when every edge has equal weight;
 * the returned map contains reachable nodes only, so map absence == unreachable.
 */
inline std::unordered_map<int, int> bfs_shortest_unweighted(
    const std::unordered_map<int, std::vector<int>>& adj, int source) {
    std::unordered_map<int, int> dist;
    std::queue<int> frontier;
    dist[source] = 0;
    frontier.push(source);

    while (!frontier.empty()) {
        const int node = frontier.front();
        frontier.pop();
        const auto it = adj.find(node);
        if (it == adj.end()) {
            continue;
        }
        for (const int next : it->second) {
            if (dist.find(next) == dist.end()) {
                dist[next] = dist[node] + 1;
                frontier.push(next);
            }
        }
    }
    return dist;
}

/*
 * Dijkstra (non-negative edge weights; adjacency lists of pair<to, weight>)
 * Time: O((V + E) log V) with a binary heap
 * Space: O(V)
 * Interview note: std::priority_queue is a max-heap, so pass std::greater to pop the
 * smallest distance; lazy deletion (skip stale entries with d > dist[node]) replaces decrease-key.
 */
inline std::unordered_map<int, int> dijkstra(
    const std::unordered_map<int, std::vector<std::pair<int, int>>>& adj, int source) {
    std::unordered_map<int, int> dist;
    using State = std::pair<int, int>;  // (distance, node) — distance first so the heap orders by it
    std::priority_queue<State, std::vector<State>, std::greater<State>> pq;
    dist[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        const auto [d, node] = pq.top();
        pq.pop();
        if (d > dist[node]) {
            continue;  // stale heap entry — a shorter path was already finalized
        }
        const auto it = adj.find(node);
        if (it == adj.end()) {
            continue;
        }
        for (const auto& [next, weight] : it->second) {
            const int candidate = d + weight;
            const auto found = dist.find(next);
            if (found == dist.end() || candidate < found->second) {
                dist[next] = candidate;
                pq.push({candidate, next});
            }
        }
    }
    return dist;
}

}  // namespace algos
