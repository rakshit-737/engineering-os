import java.util.Arrays;

/**
 * Sorting algorithms: pure static functions over int[] that never mutate
 * their input and always return a new array.
 */
public final class Sorting {

    private Sorting() {
    }

    /**
     * Merge sort.
     * Time: O(n log n) in all cases.
     * Space: O(n) auxiliary for the split copies and merge buffer.
     * Interview note: stable and predictable; pick it when stability or a
     * worst-case guarantee matters (quicksort degrades to O(n^2)).
     *
     * @param nums input array (not mutated)
     * @return new sorted array
     */
    public static int[] mergeSort(int[] nums) {
        if (nums.length <= 1) {
            return Arrays.copyOf(nums, nums.length);
        }
        int mid = nums.length / 2;
        int[] left = mergeSort(Arrays.copyOfRange(nums, 0, mid));
        int[] right = mergeSort(Arrays.copyOfRange(nums, mid, nums.length));

        int[] merged = new int[nums.length];
        int i = 0;
        int j = 0;
        int k = 0;
        while (i < left.length && j < right.length) {
            merged[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
        }
        while (i < left.length) {
            merged[k++] = left[i++];
        }
        while (j < right.length) {
            merged[k++] = right[j++];
        }
        return merged;
    }

    /**
     * Quick sort (Hoare partition on a defensive copy, middle-element pivot).
     * Time: O(n log n) average, O(n^2) worst case.
     * Space: O(n) for the returned copy, O(log n) average recursion depth.
     * Interview note: mention pivot strategy (middle/random beats first-element
     * on sorted input) and that duplicates are handled by the Hoare scheme.
     *
     * @param nums input array (not mutated)
     * @return new sorted array
     */
    public static int[] quickSort(int[] nums) {
        int[] copy = Arrays.copyOf(nums, nums.length);
        quickSortInPlace(copy, 0, copy.length - 1);
        return copy;
    }

    private static void quickSortInPlace(int[] a, int lo, int hi) {
        if (lo >= hi) {
            return;
        }
        int pivot = a[lo + (hi - lo) / 2];
        int i = lo;
        int j = hi;
        while (i <= j) {
            while (a[i] < pivot) {
                i++;
            }
            while (a[j] > pivot) {
                j--;
            }
            if (i <= j) {
                int tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
                i++;
                j--;
            }
        }
        quickSortInPlace(a, lo, j);
        quickSortInPlace(a, i, hi);
    }

    /**
     * Insertion sort (on a defensive copy).
     * Time: O(n^2) worst/average, O(n) when already (nearly) sorted.
     * Space: O(n) for the returned copy, O(1) auxiliary beyond it.
     * Interview note: the go-to for tiny or nearly-sorted inputs; real-world
     * sorts (TimSort, pdqsort) use it as the small-partition base case.
     *
     * @param nums input array (not mutated)
     * @return new sorted array
     */
    public static int[] insertionSort(int[] nums) {
        int[] a = Arrays.copyOf(nums, nums.length);
        for (int i = 1; i < a.length; i++) {
            int key = a[i];
            int j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
        return a;
    }
}
