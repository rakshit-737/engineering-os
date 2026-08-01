import java.util.Arrays;

/**
 * Dynamic programming classics.
 */
public final class DP {

    private DP() {
    }

    /**
     * Minimum number of coins summing to amount (unbounded supply per coin).
     * Time: O(amount * coins.length).
     * Space: O(amount).
     * Interview note: bottom-up with an "impossible" sentinel of amount + 1 —
     * cleaner than Integer.MAX_VALUE, which overflows when you add 1 to it.
     * This is unbounded knapsack; distinguish it from the 0/1 variant.
     *
     * @param coins  coin denominations (non-positive values are ignored)
     * @param amount target amount (must be &gt;= 0)
     * @return minimum coin count, or -1 if the amount cannot be formed
     */
    public static int coinChangeMin(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            if (coin <= 0) {
                continue;
            }
            for (int i = coin; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    /**
     * Length of the longest strictly increasing subsequence (patience method).
     * Time: O(n log n).
     * Space: O(n) for the tails array.
     * Interview note: tails[k] = smallest possible tail of an increasing
     * subsequence of length k+1; binary-search the lower bound and replace.
     * The tails array is NOT itself a valid subsequence — only its length is
     * the answer. Use &lt;= in the search comparison for the non-strict variant.
     *
     * @param nums input array
     * @return length of the longest strictly increasing subsequence
     */
    public static int longestIncreasingSubsequence(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int lo = 0;
            int hi = size;
            while (lo < hi) {
                int mid = lo + (hi - lo) / 2;
                if (tails[mid] < x) {
                    lo = mid + 1;
                } else {
                    hi = mid;
                }
            }
            tails[lo] = x;
            if (lo == size) {
                size++;
            }
        }
        return size;
    }

    /**
     * Levenshtein edit distance (insert, delete, replace — each cost 1).
     * Time: O(m * n).
     * Space: O(n) using two rolling rows instead of the full matrix.
     * Interview note: on a match take the diagonal for free; otherwise
     * 1 + min(diagonal=replace, up=delete, left=insert). Mention the rolling-row
     * space optimization — it is the expected follow-up.
     *
     * @param a first string
     * @param b second string
     * @return minimum number of single-character edits turning a into b
     */
    public static int editDistance(String a, String b) {
        int m = a.length();
        int n = b.length();
        int[] prev = new int[n + 1];
        int[] curr = new int[n + 1];
        for (int j = 0; j <= n; j++) {
            prev[j] = j;
        }
        for (int i = 1; i <= m; i++) {
            curr[0] = i;
            for (int j = 1; j <= n; j++) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    curr[j] = prev[j - 1];
                } else {
                    curr[j] = 1 + Math.min(prev[j - 1], Math.min(prev[j], curr[j - 1]));
                }
            }
            int[] tmp = prev;
            prev = curr;
            curr = tmp;
        }
        return prev[n];
    }
}
