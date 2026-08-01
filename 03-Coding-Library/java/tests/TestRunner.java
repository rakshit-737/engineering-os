import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Plain main() test harness — no JUnit, no build tool.
 * Run: javac -d out src/*.java tests/*.java &amp;&amp; java -cp out TestRunner
 */
public final class TestRunner {

    private static int passed = 0;
    private static int failed = 0;

    private static void check(String name, boolean cond) {
        if (cond) {
            passed++;
        } else {
            failed++;
            System.out.println("FAIL: " + name);
        }
    }

    public static void main(String[] args) {
        testSorting();
        testSearching();
        testGraphs();
        testMinStack();
        testDisjointSet();
        testTrie();
        testLruCache();
        testDp();
        testStringAlgos();

        System.out.println(passed + " passed, " + failed + " failed");
        if (failed > 0) {
            System.exit(1);
        }
    }

    // ---------------------------------------------------------------- Sorting

    private static void testSorting() {
        int[] empty = {};
        int[] single = {7};
        int[] messy = {5, 2, 9, 1, 5, 6};
        int[] sortedMessy = {1, 2, 5, 5, 6, 9};

        check("mergeSort empty", Sorting.mergeSort(empty).length == 0);
        check("mergeSort single", Arrays.equals(Sorting.mergeSort(single), new int[] {7}));
        check("mergeSort typical", Arrays.equals(Sorting.mergeSort(messy), sortedMessy));
        check("mergeSort reverse", Arrays.equals(
                Sorting.mergeSort(new int[] {3, 2, 1}), new int[] {1, 2, 3}));
        int[] original = {3, 1, 2};
        Sorting.mergeSort(original);
        check("mergeSort does not mutate input", Arrays.equals(original, new int[] {3, 1, 2}));

        check("quickSort empty", Sorting.quickSort(empty).length == 0);
        check("quickSort single", Arrays.equals(Sorting.quickSort(single), new int[] {7}));
        check("quickSort typical", Arrays.equals(Sorting.quickSort(messy), sortedMessy));
        check("quickSort all duplicates", Arrays.equals(
                Sorting.quickSort(new int[] {4, 4, 4}), new int[] {4, 4, 4}));
        check("quickSort already sorted", Arrays.equals(
                Sorting.quickSort(new int[] {1, 2, 3, 4}), new int[] {1, 2, 3, 4}));
        int[] original2 = {3, 1, 2};
        Sorting.quickSort(original2);
        check("quickSort does not mutate input", Arrays.equals(original2, new int[] {3, 1, 2}));

        check("insertionSort empty", Sorting.insertionSort(empty).length == 0);
        check("insertionSort single", Arrays.equals(Sorting.insertionSort(single), new int[] {7}));
        check("insertionSort typical", Arrays.equals(Sorting.insertionSort(messy), sortedMessy));
        check("insertionSort negative values", Arrays.equals(
                Sorting.insertionSort(new int[] {0, -3, 2, -1}), new int[] {-3, -1, 0, 2}));
    }

    // -------------------------------------------------------------- Searching

    private static void testSearching() {
        int[] nums = {1, 3, 3, 5, 8};

        check("binarySearch found first", Searching.binarySearch(nums, 1) == 0);
        check("binarySearch found last", Searching.binarySearch(nums, 8) == 4);
        int idx3 = Searching.binarySearch(nums, 3);
        check("binarySearch found duplicate (either index)", idx3 == 1 || idx3 == 2);
        check("binarySearch not found", Searching.binarySearch(nums, 4) == -1);
        check("binarySearch empty", Searching.binarySearch(new int[] {}, 1) == -1);
        check("binarySearch single found", Searching.binarySearch(new int[] {5}, 5) == 0);
        check("binarySearch single not found", Searching.binarySearch(new int[] {5}, 6) == -1);

        check("lowerBound first duplicate", Searching.lowerBound(nums, 3) == 1);
        check("lowerBound below all", Searching.lowerBound(nums, 0) == 0);
        check("lowerBound above all", Searching.lowerBound(nums, 9) == 5);
        check("lowerBound between values", Searching.lowerBound(nums, 4) == 3);
        check("lowerBound empty", Searching.lowerBound(new int[] {}, 3) == 0);
    }

    // ----------------------------------------------------------------- Graphs

    private static void testGraphs() {
        Map<Integer, List<Integer>> adj = Map.of(
                1, List.of(2, 3),
                2, List.of(4),
                3, List.of(4),
                4, List.of());
        Map<Integer, Integer> dist = Graphs.bfsShortestUnweighted(adj, 1);
        check("bfs distances", dist.equals(Map.of(1, 0, 2, 1, 3, 1, 4, 2)));
        check("bfs unreachable node absent", !dist.containsKey(99));
        check("bfs source only (empty graph)",
                Graphs.bfsShortestUnweighted(Map.of(), 7).equals(Map.of(7, 0)));
        Map<Integer, Integer> fromLeaf = Graphs.bfsShortestUnweighted(adj, 4);
        check("bfs directed: no back edges from leaf", fromLeaf.equals(Map.of(4, 0)));

        Map<Integer, List<int[]>> wadj = Map.of(
                1, List.of(new int[] {2, 4}, new int[] {3, 1}),
                3, List.of(new int[] {2, 2}),
                2, List.of(new int[] {4, 5}));
        Map<Integer, Integer> ddist = Graphs.dijkstra(wadj, 1);
        check("dijkstra picks cheaper indirect path", ddist.equals(Map.of(1, 0, 3, 1, 2, 3, 4, 8)));
        check("dijkstra unreachable node absent", !ddist.containsKey(42));
        check("dijkstra source only (empty graph)",
                Graphs.dijkstra(Map.of(), 5).equals(Map.of(5, 0)));
    }

    // --------------------------------------------------------------- MinStack

    private static void testMinStack() {
        DataStructures.MinStack ms = new DataStructures.MinStack();
        check("MinStack starts empty", ms.isEmpty());
        ms.push(3);
        ms.push(5);
        ms.push(2);
        ms.push(2);
        ms.push(8);
        check("MinStack size", ms.size() == 5);
        check("MinStack min with duplicates", ms.getMin() == 2);
        check("MinStack pop returns top", ms.pop() == 8);
        check("MinStack min survives non-min pop", ms.getMin() == 2);
        check("MinStack pop duplicate min keeps min", ms.pop() == 2 && ms.getMin() == 2);
        check("MinStack pop last dup restores older min", ms.pop() == 2 && ms.getMin() == 3);
        check("MinStack top peeks without removing", ms.top() == 5 && ms.size() == 2);
        ms.pop();
        ms.pop();
        check("MinStack empty after popping all", ms.isEmpty());
        boolean threw = false;
        try {
            ms.pop();
        } catch (NoSuchElementException e) {
            threw = true;
        }
        check("MinStack pop on empty throws", threw);
    }

    // ------------------------------------------------------------ DisjointSet

    private static void testDisjointSet() {
        DataStructures.DisjointSet dsu = new DataStructures.DisjointSet(6);
        check("DSU starts with n components", dsu.componentCount() == 6);
        check("DSU union merges", dsu.union(0, 1));
        check("DSU union chain link", dsu.union(1, 2));
        check("DSU union of already-joined is false", !dsu.union(0, 2));
        check("DSU connected across chain", dsu.connected(0, 2));
        check("DSU not connected to outsider", !dsu.connected(0, 3));
        dsu.union(3, 4);
        dsu.union(4, 5);
        check("DSU second chain connected end-to-end", dsu.connected(3, 5));
        check("DSU component count after unions", dsu.componentCount() == 2);
        check("DSU chains still separate", !dsu.connected(2, 3));
        dsu.union(2, 3);
        check("DSU all merged into one", dsu.componentCount() == 1 && dsu.connected(0, 5));
        check("DSU find is stable root", dsu.find(0) == dsu.find(5));

        DataStructures.DisjointSet single = new DataStructures.DisjointSet(1);
        check("DSU single element self-connected", single.connected(0, 0));
    }

    // ------------------------------------------------------------------- Trie

    private static void testTrie() {
        DataStructures.Trie trie = new DataStructures.Trie();
        check("Trie empty search", !trie.search("car"));
        trie.insert("car");
        trie.insert("card");
        trie.insert("care");
        check("Trie search exact word", trie.search("car"));
        check("Trie prefix is not a word", !trie.search("ca"));
        check("Trie startsWith prefix", trie.startsWith("ca"));
        check("Trie search longer than inserted", !trie.search("cart"));
        check("Trie startsWith full word", trie.startsWith("card"));
        check("Trie startsWith missing branch", !trie.startsWith("dog"));
        check("Trie startsWith empty prefix", trie.startsWith(""));
        check("Trie empty string not a word until inserted", !trie.search(""));
        trie.insert("");
        check("Trie empty string searchable after insert", trie.search(""));
    }

    // --------------------------------------------------------------- LRUCache

    private static void testLruCache() {
        DataStructures.LRUCache<String, Integer> cache = new DataStructures.LRUCache<>(2);
        cache.put("a", 1);
        cache.put("b", 2);
        check("LRU stores values", Integer.valueOf(1).equals(cache.get("a"))
                && Integer.valueOf(2).equals(cache.get("b")));
        cache.get("a"); // refresh a — b becomes eldest
        cache.put("c", 3);
        check("LRU evicts least recently used", !cache.containsKey("b"));
        check("LRU keeps refreshed entry", cache.containsKey("a"));
        check("LRU keeps newest entry", cache.containsKey("c"));
        check("LRU iteration order is eldest-first",
                new ArrayList<>(cache.keySet()).equals(List.of("a", "c")));
        check("LRU size capped at capacity", cache.size() == 2);
        check("LRU get missing returns null", cache.get("b") == null);
        cache.put("a", 10);
        check("LRU put updates value in place", Integer.valueOf(10).equals(cache.get("a"))
                && cache.size() == 2);

        DataStructures.LRUCache<Integer, Integer> one = new DataStructures.LRUCache<>(1);
        one.put(1, 1);
        one.put(2, 2);
        check("LRU capacity 1 keeps only newest", !one.containsKey(1) && one.containsKey(2));

        boolean threw = false;
        try {
            new DataStructures.LRUCache<String, String>(0);
        } catch (IllegalArgumentException e) {
            threw = true;
        }
        check("LRU rejects non-positive capacity", threw);
    }

    // --------------------------------------------------------------------- DP

    private static void testDp() {
        check("coinChangeMin typical", DP.coinChangeMin(new int[] {1, 2, 5}, 11) == 3);
        check("coinChangeMin impossible", DP.coinChangeMin(new int[] {2}, 3) == -1);
        check("coinChangeMin zero amount", DP.coinChangeMin(new int[] {1}, 0) == 0);
        check("coinChangeMin no coins", DP.coinChangeMin(new int[] {}, 5) == -1);
        check("coinChangeMin exact single coin", DP.coinChangeMin(new int[] {5, 10}, 10) == 1);

        check("LIS empty", DP.longestIncreasingSubsequence(new int[] {}) == 0);
        check("LIS single", DP.longestIncreasingSubsequence(new int[] {10}) == 1);
        check("LIS classic", DP.longestIncreasingSubsequence(
                new int[] {10, 9, 2, 5, 3, 7, 101, 18}) == 4);
        check("LIS strict (duplicates count once)", DP.longestIncreasingSubsequence(
                new int[] {7, 7, 7}) == 1);
        check("LIS longer case", DP.longestIncreasingSubsequence(
                new int[] {1, 3, 6, 7, 9, 4, 10, 5, 6}) == 6);
        check("LIS strictly decreasing", DP.longestIncreasingSubsequence(
                new int[] {5, 4, 3, 2, 1}) == 1);

        check("editDistance classic", DP.editDistance("horse", "ros") == 3);
        check("editDistance from empty", DP.editDistance("", "abc") == 3);
        check("editDistance to empty", DP.editDistance("abc", "") == 3);
        check("editDistance both empty", DP.editDistance("", "") == 0);
        check("editDistance identical", DP.editDistance("same", "same") == 0);
        check("editDistance intention/execution", DP.editDistance("intention", "execution") == 5);
    }

    // ------------------------------------------------------------ StringAlgos

    private static void testStringAlgos() {
        check("kmp multiple matches",
                StringAlgos.kmpSearch("ababcababc", "abc").equals(List.of(2, 7)));
        check("kmp overlapping matches",
                StringAlgos.kmpSearch("aaaa", "aa").equals(List.of(0, 1, 2)));
        check("kmp whole text match",
                StringAlgos.kmpSearch("abc", "abc").equals(List.of(0)));
        check("kmp not found", StringAlgos.kmpSearch("abcdef", "xyz").isEmpty());
        check("kmp empty pattern convention", StringAlgos.kmpSearch("abc", "").isEmpty());
        check("kmp pattern longer than text", StringAlgos.kmpSearch("ab", "abc").isEmpty());
        check("kmp empty text", StringAlgos.kmpSearch("", "a").isEmpty());

        check("isAnagram true", StringAlgos.isAnagram("listen", "silent"));
        check("isAnagram false same length", !StringAlgos.isAnagram("rat", "car"));
        check("isAnagram false different length", !StringAlgos.isAnagram("a", "ab"));
        check("isAnagram both empty", StringAlgos.isAnagram("", ""));
        check("isAnagram counts matter", !StringAlgos.isAnagram("aab", "abb"));

        check("palindrome babad", StringAlgos.longestPalindromicSubstring("babad").equals("bab"));
        check("palindrome even center", StringAlgos.longestPalindromicSubstring("cbbd").equals("bb"));
        check("palindrome empty", StringAlgos.longestPalindromicSubstring("").equals(""));
        check("palindrome single", StringAlgos.longestPalindromicSubstring("a").equals("a"));
        check("palindrome no repeat picks first char",
                StringAlgos.longestPalindromicSubstring("ac").equals("a"));
        check("palindrome long even",
                StringAlgos.longestPalindromicSubstring("forgeeksskeegfor").equals("geeksskeeg"));
    }
}
