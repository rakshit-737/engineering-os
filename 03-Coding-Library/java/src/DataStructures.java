import java.util.ArrayDeque;
import java.util.Deque;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Interview-staple data structures as static nested classes.
 */
public final class DataStructures {

    private DataStructures() {
    }

    /**
     * Stack supporting O(1) minimum lookup via a synchronized auxiliary stack.
     * Interview note: push to the min stack only when value &lt;= current min
     * (the &lt;= is what makes duplicate minimums pop correctly).
     */
    public static class MinStack {

        private final Deque<Integer> stack = new ArrayDeque<>();
        private final Deque<Integer> mins = new ArrayDeque<>();

        /**
         * Push a value.
         * Time: O(1). Space: O(1) amortized.
         * Interview note: ArrayDeque is the modern stack — java.util.Stack is
         * legacy and synchronized.
         *
         * @param value value to push
         */
        public void push(int value) {
            stack.push(value);
            if (mins.isEmpty() || value <= mins.peek()) {
                mins.push(value);
            }
        }

        /**
         * Pop and return the top value.
         * Time: O(1). Space: O(1).
         * Interview note: pop the min stack only when the departing value equals
         * its top, keeping both stacks in lockstep.
         *
         * @return the popped value
         * @throws java.util.NoSuchElementException if the stack is empty
         */
        public int pop() {
            int value = stack.pop();
            if (!mins.isEmpty() && value == mins.peek()) {
                mins.pop();
            }
            return value;
        }

        /**
         * Return (without removing) the top value.
         * Time: O(1). Space: O(1).
         * Interview note: peek vs pop is a classic off-by-one source; ArrayDeque
         * throws on element() but returns null on peek() when empty.
         *
         * @return the top value
         * @throws java.util.NoSuchElementException if the stack is empty
         */
        public int top() {
            return stack.element();
        }

        /**
         * Return the current minimum.
         * Time: O(1). Space: O(1).
         * Interview note: the whole point of the auxiliary stack — a plain scan
         * would be O(n) per query.
         *
         * @return the minimum value on the stack
         * @throws java.util.NoSuchElementException if the stack is empty
         */
        public int getMin() {
            return mins.element();
        }

        /**
         * Whether the stack is empty.
         * Time: O(1). Space: O(1).
         * Interview note: guard calls to pop/top/getMin with this in production code.
         *
         * @return true if empty
         */
        public boolean isEmpty() {
            return stack.isEmpty();
        }

        /**
         * Number of elements on the stack.
         * Time: O(1). Space: O(1).
         * Interview note: the min stack's size is at most this, never more.
         *
         * @return element count
         */
        public int size() {
            return stack.size();
        }
    }

    /**
     * Disjoint Set / Union-Find with path compression and union by rank.
     * Interview note: the two optimizations together give near-constant
     * amortized time, O(alpha(n)) — inverse Ackermann, effectively &lt;= 4.
     */
    public static class DisjointSet {

        private final int[] parent;
        private final int[] rank;
        private int components;

        /**
         * Create n singleton sets labeled 0..n-1.
         * Time: O(n). Space: O(n).
         * Interview note: two flat int arrays — no node objects needed.
         *
         * @param n number of elements
         */
        public DisjointSet(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i;
            }
            components = n;
        }

        /**
         * Find the representative (root) of x's set, compressing the path.
         * Time: O(alpha(n)) amortized.
         * Space: O(depth) recursion during compression.
         * Interview note: path compression points every visited node directly
         * at the root, flattening future finds.
         *
         * @param x element
         * @return root of x's set
         */
        public int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        /**
         * Merge the sets containing a and b (union by rank).
         * Time: O(alpha(n)) amortized. Space: O(1).
         * Interview note: attach the shorter tree under the taller; ranks only
         * grow when both roots have equal rank. Returning false on an
         * already-joined pair is exactly the cycle test in Kruskal's MST.
         *
         * @param a first element
         * @param b second element
         * @return true if two distinct sets were merged, false if already together
         */
        public boolean union(int a, int b) {
            int ra = find(a);
            int rb = find(b);
            if (ra == rb) {
                return false;
            }
            if (rank[ra] < rank[rb]) {
                int tmp = ra;
                ra = rb;
                rb = tmp;
            }
            parent[rb] = ra;
            if (rank[ra] == rank[rb]) {
                rank[ra]++;
            }
            components--;
            return true;
        }

        /**
         * Whether a and b share a set.
         * Time: O(alpha(n)) amortized. Space: O(1).
         * Interview note: just compares roots — the standard connectivity query.
         *
         * @param a first element
         * @param b second element
         * @return true if a and b are in the same set
         */
        public boolean connected(int a, int b) {
            return find(a) == find(b);
        }

        /**
         * Number of disjoint sets remaining.
         * Time: O(1). Space: O(1).
         * Interview note: track this with a counter decremented on merge —
         * "number of connected components" questions become one-liners.
         *
         * @return current component count
         */
        public int componentCount() {
            return components;
        }
    }

    /**
     * Trie (prefix tree) over lowercase 'a'..'z'.
     * Interview note: a 26-slot child array beats a HashMap per node for speed
     * and is the expected whiteboard answer; swap to Map&lt;Character, Node&gt;
     * for arbitrary alphabets.
     */
    public static class Trie {

        private static final class Node {
            private final Node[] children = new Node[26];
            private boolean isWord;
        }

        private final Node root = new Node();

        /**
         * Insert a word.
         * Time: O(L) where L is word length. Space: O(L) new nodes worst case.
         * Interview note: mark isWord only on the final node — that flag is
         * what distinguishes search from startsWith.
         *
         * @param word lowercase word to insert
         */
        public void insert(String word) {
            Node node = root;
            for (int i = 0; i < word.length(); i++) {
                int c = word.charAt(i) - 'a';
                if (node.children[c] == null) {
                    node.children[c] = new Node();
                }
                node = node.children[c];
            }
            node.isWord = true;
        }

        /**
         * Whether the exact word was inserted.
         * Time: O(L). Space: O(1).
         * Interview note: a path can exist for a prefix of an inserted word
         * without isWord being set — search must check the flag.
         *
         * @param word lowercase word to look up
         * @return true if word was inserted
         */
        public boolean search(String word) {
            Node node = walk(word);
            return node != null && node.isWord;
        }

        /**
         * Whether any inserted word starts with the given prefix.
         * Time: O(L). Space: O(1).
         * Interview note: identical walk to search, minus the isWord check;
         * the empty prefix is trivially present.
         *
         * @param prefix lowercase prefix to test
         * @return true if some inserted word starts with prefix
         */
        public boolean startsWith(String prefix) {
            return walk(prefix) != null;
        }

        private Node walk(String s) {
            Node node = root;
            for (int i = 0; i < s.length(); i++) {
                node = node.children[s.charAt(i) - 'a'];
                if (node == null) {
                    return null;
                }
            }
            return node;
        }
    }

    /**
     * LRU cache via LinkedHashMap with accessOrder=true and removeEldestEntry —
     * the canonical Java interview answer (about ten lines).
     * Interview note: the hand-rolled version is a HashMap&lt;K, Node&gt; plus a
     * doubly-linked list with sentinel head/tail; get/put unlink the node and
     * splice it to the front, evicting from the back — same O(1) operations,
     * and worth sketching if the interviewer bans LinkedHashMap.
     *
     * @param <K> key type
     * @param <V> value type
     */
    public static class LRUCache<K, V> extends LinkedHashMap<K, V> {

        @java.io.Serial
        private static final long serialVersionUID = 1L;

        private final int capacity;

        /**
         * Create a cache holding at most capacity entries.
         * Time: O(1). Space: O(capacity) once full.
         * Interview note: the third constructor argument (accessOrder=true)
         * makes get() move an entry to most-recent — forgetting it silently
         * degrades the cache to FIFO insertion order.
         *
         * @param capacity maximum number of entries (must be positive)
         */
        public LRUCache(int capacity) {
            super(Math.max(1, capacity), 0.75f, true);
            if (capacity <= 0) {
                throw new IllegalArgumentException("capacity must be positive");
            }
            this.capacity = capacity;
        }

        /**
         * Eviction hook consulted by LinkedHashMap after every put.
         * Time: O(1). Space: O(1).
         * Interview note: returning true evicts the eldest (least recently
         * accessed) entry automatically — no manual removal code needed.
         *
         * @param eldest the least recently accessed entry
         * @return true when the cache is over capacity
         */
        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity;
        }
    }
}
