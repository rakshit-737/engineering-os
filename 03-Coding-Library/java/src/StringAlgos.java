import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * String algorithms.
 */
public final class StringAlgos {

    private StringAlgos() {
    }

    /**
     * Knuth-Morris-Pratt: all start indices where pattern occurs in text,
     * including overlapping occurrences.
     * Time: O(n + m) — text scanned once, LPS table built once.
     * Space: O(m) for the LPS (longest proper prefix that is also a suffix) table.
     * Interview note: after a full match, reset j to lps[m - 1] (not 0) so
     * overlapping matches are found; an empty pattern returns an empty list here
     * by convention — state your convention before coding.
     *
     * @param text    string to scan
     * @param pattern string to find
     * @return list of 0-based start indices, in increasing order
     */
    public static List<Integer> kmpSearch(String text, String pattern) {
        List<Integer> matches = new ArrayList<>();
        int n = text.length();
        int m = pattern.length();
        if (m == 0 || m > n) {
            return matches;
        }
        int[] lps = buildLps(pattern);
        int j = 0;
        for (int i = 0; i < n; i++) {
            while (j > 0 && text.charAt(i) != pattern.charAt(j)) {
                j = lps[j - 1];
            }
            if (text.charAt(i) == pattern.charAt(j)) {
                j++;
            }
            if (j == m) {
                matches.add(i - m + 1);
                j = lps[j - 1];
            }
        }
        return matches;
    }

    private static int[] buildLps(String pattern) {
        int[] lps = new int[pattern.length()];
        int len = 0;
        for (int i = 1; i < pattern.length(); i++) {
            while (len > 0 && pattern.charAt(i) != pattern.charAt(len)) {
                len = lps[len - 1];
            }
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
            }
            lps[i] = len;
        }
        return lps;
    }

    /**
     * Whether two strings are anagrams of each other (exact char counts match).
     * Time: O(n).
     * Space: O(k) where k is the number of distinct characters.
     * Interview note: for a known lowercase a-z alphabet an int[26] count array
     * is the fastest idiom; the HashMap version shown here handles any chars.
     * Sorting both strings also works but costs O(n log n).
     *
     * @param a first string
     * @param b second string
     * @return true if a and b contain exactly the same characters with the same counts
     */
    public static boolean isAnagram(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }
        Map<Character, Integer> counts = new HashMap<>();
        for (int i = 0; i < a.length(); i++) {
            counts.merge(a.charAt(i), 1, Integer::sum);
        }
        for (int i = 0; i < b.length(); i++) {
            char c = b.charAt(i);
            Integer count = counts.get(c);
            if (count == null) {
                return false;
            }
            if (count == 1) {
                counts.remove(c);
            } else {
                counts.put(c, count - 1);
            }
        }
        return counts.isEmpty();
    }

    /**
     * Longest palindromic substring via expand-around-center.
     * Time: O(n^2) worst case (each of 2n - 1 centers expands up to O(n)).
     * Space: O(1) beyond the returned substring.
     * Interview note: try both odd (i, i) and even (i, i + 1) centers at every
     * position; ties keep the earliest occurrence. Mention Manacher's O(n)
     * algorithm exists but is rarely expected to be coded live.
     *
     * @param s input string
     * @return the longest palindromic substring (earliest on ties; "" for empty input)
     */
    public static String longestPalindromicSubstring(String s) {
        if (s.length() <= 1) {
            return s;
        }
        int bestStart = 0;
        int bestLen = 1;
        for (int center = 0; center < s.length(); center++) {
            int len = Math.max(expand(s, center, center), expand(s, center, center + 1));
            if (len > bestLen) {
                bestLen = len;
                bestStart = center - (len - 1) / 2;
            }
        }
        return s.substring(bestStart, bestStart + bestLen);
    }

    private static int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}
