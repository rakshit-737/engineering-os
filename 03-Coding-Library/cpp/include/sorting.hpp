#pragma once
// Sorting algorithms with complexity and interview notes.
// Header-only, C++17, STL only.

#include <cstddef>
#include <vector>

namespace algos {

/*
 * Merge Sort
 * Time: O(n log n)
 * Space: O(n)
 * Interview note: stable and predictable; useful when stability matters.
 */
inline std::vector<int> merge_sort(const std::vector<int>& nums) {
    if (nums.size() <= 1) {
        return nums;
    }

    const auto mid = nums.begin() + static_cast<std::vector<int>::difference_type>(nums.size() / 2);
    const std::vector<int> left = merge_sort(std::vector<int>(nums.begin(), mid));
    const std::vector<int> right = merge_sort(std::vector<int>(mid, nums.end()));

    std::vector<int> merged;
    merged.reserve(nums.size());
    std::size_t i = 0;
    std::size_t j = 0;

    while (i < left.size() && j < right.size()) {
        if (left[i] <= right[j]) {
            merged.push_back(left[i]);
            ++i;
        } else {
            merged.push_back(right[j]);
            ++j;
        }
    }

    merged.insert(merged.end(), left.begin() + static_cast<std::vector<int>::difference_type>(i), left.end());
    merged.insert(merged.end(), right.begin() + static_cast<std::vector<int>::difference_type>(j), right.end());
    return merged;
}

/*
 * Quick Sort (functional version, three-way partition)
 * Average Time: O(n log n), Worst: O(n^2)
 * Space: O(n) average, O(n^2) worst — the partition copies stay alive down the recursion path,
 * so degenerate pivots cost quadratic memory as well as time (in-place Hoare/Lomuto avoids this)
 * Interview note: mention pivot strategy and worst-case mitigation (random pivot / introsort).
 */
inline std::vector<int> quick_sort(const std::vector<int>& nums) {
    if (nums.size() <= 1) {
        return nums;
    }

    const int pivot = nums[nums.size() / 2];
    std::vector<int> left;
    std::vector<int> mid;
    std::vector<int> right;
    for (const int x : nums) {
        if (x < pivot) {
            left.push_back(x);
        } else if (x == pivot) {
            mid.push_back(x);
        } else {
            right.push_back(x);
        }
    }

    std::vector<int> result = quick_sort(left);
    result.insert(result.end(), mid.begin(), mid.end());
    const std::vector<int> sorted_right = quick_sort(right);
    result.insert(result.end(), sorted_right.begin(), sorted_right.end());
    return result;
}

/*
 * Insertion Sort
 * Time: O(n^2) worst/average, O(n) on nearly-sorted input
 * Space: O(n) for the returned copy (the sort itself is in-place on that copy)
 * Interview note: best choice for tiny or nearly-sorted arrays; std::sort uses it below a cutoff.
 */
inline std::vector<int> insertion_sort(const std::vector<int>& nums) {
    std::vector<int> out = nums;
    for (std::size_t i = 1; i < out.size(); ++i) {
        const int key = out[i];
        std::size_t j = i;
        while (j > 0 && out[j - 1] > key) {
            out[j] = out[j - 1];
            --j;
        }
        out[j] = key;
    }
    return out;
}

}  // namespace algos
