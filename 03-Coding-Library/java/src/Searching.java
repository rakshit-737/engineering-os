/**
 * Searching algorithms over sorted int[] arrays.
 */
public final class Searching {

    private Searching() {
    }

    /**
     * Classic binary search for an exact match in a sorted (ascending) array.
     * Time: O(log n).
     * Space: O(1).
     * Interview note: use lo + (hi - lo) / 2 for the midpoint — (lo + hi) / 2
     * can overflow int; if duplicates exist, the returned index is arbitrary.
     *
     * @param nums   sorted ascending array
     * @param target value to find
     * @return index of target, or -1 if absent
     */
    public static int binarySearch(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) {
                return mid;
            }
            if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return -1;
    }

    /**
     * Lower bound: first index i such that nums[i] &gt;= target
     * (the insertion point that keeps the array sorted).
     * Time: O(log n).
     * Space: O(1).
     * Interview note: half-open [lo, hi) template; returns nums.length when
     * every element is smaller — this is C++ std::lower_bound and the building
     * block for "first/last occurrence" and LIS patience sorting.
     *
     * @param nums   sorted ascending array
     * @param target value to bound
     * @return first index with nums[i] &gt;= target, or nums.length if none
     */
    public static int lowerBound(int[] nums, int target) {
        int lo = 0;
        int hi = nums.length;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}
