import java.util.ArrayDeque;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * Graph algorithms over adjacency maps. Nodes are ints; a node with no
 * outgoing edges may simply be absent from the map.
 */
public final class Graphs {

    private Graphs() {
    }

    /**
     * BFS shortest path lengths from a source in an unweighted directed graph.
     * Time: O(V + E).
     * Space: O(V) for the queue and distance map.
     * Interview note: BFS gives shortest paths only when all edges have equal
     * weight; the distance map doubles as the visited set — unreachable nodes
     * are simply absent from the result.
     *
     * @param adjacency node -&gt; list of neighbor nodes
     * @param source    start node
     * @return map from each reachable node to its edge-count distance (source is 0)
     */
    public static Map<Integer, Integer> bfsShortestUnweighted(
            Map<Integer, List<Integer>> adjacency, int source) {
        Map<Integer, Integer> dist = new HashMap<>();
        dist.put(source, 0);
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(source);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int next : adjacency.getOrDefault(node, List.of())) {
                if (!dist.containsKey(next)) {
                    dist.put(next, dist.get(node) + 1);
                    queue.add(next);
                }
            }
        }
        return dist;
    }

    /**
     * Dijkstra shortest path costs from a source. Edges are int[]{to, weight}
     * with non-negative weights.
     * Time: O((V + E) log V) with a binary-heap PriorityQueue.
     * Space: O(V + E) for the heap (duplicates allowed) and distance map.
     * Interview note: java.util.PriorityQueue has no decrease-key, so the
     * standard Java idiom is "lazy deletion" — push duplicates and skip any
     * popped entry that is staler than the recorded distance. Negative weights
     * break Dijkstra; use Bellman-Ford instead.
     *
     * @param adjacency node -&gt; list of int[]{to, weight} edges (weights &gt;= 0)
     * @param source    start node
     * @return map from each reachable node to its minimum total weight (source is 0)
     */
    public static Map<Integer, Integer> dijkstra(
            Map<Integer, List<int[]>> adjacency, int source) {
        Map<Integer, Integer> dist = new HashMap<>();
        dist.put(source, 0);
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e[1]));
        pq.add(new int[] {source, 0});
        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int node = top[0];
            int d = top[1];
            if (d > dist.getOrDefault(node, Integer.MAX_VALUE)) {
                continue; // stale heap entry — lazy deletion
            }
            for (int[] edge : adjacency.getOrDefault(node, List.of())) {
                int next = edge[0];
                int candidate = d + edge[1];
                if (candidate < dist.getOrDefault(next, Integer.MAX_VALUE)) {
                    dist.put(next, candidate);
                    pq.add(new int[] {next, candidate});
                }
            }
        }
        return dist;
    }
}
