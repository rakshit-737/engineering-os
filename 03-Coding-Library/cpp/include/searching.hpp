#pragma once
// Searching algorithms with complexity and interview notes.
// Header-only, C++17, STL only.

#include <algorithm>
#include <cstddef>
#include <vector>

namespace algos {

/*
 * Binary Search (index-returning; named to avoid clashing with std::binary_search)
 * Time: O(log n)
 * Space: O(1)
 * Interview note: half-open [lo, hi) loop avoids the classic unsigned `hi = -1` underflow bug.
 */
inline int binary_search_index(const std::vector<int>& nums, int target) {
    std::size_t lo = 0;
    std::size_t hi = nums.size();
    while (lo < hi) {
        const std::size_t mid = lo + (hi - lo) / 2;  // overflow-safe midpoint
        if (nums[mid] == target) {
            return static_cast<int>(mid);
        }
        if (nums[mid] < target) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    return -1;
}

/*
 * Lower Bound (first index i with nums[i] >= target; returns nums.size() if none)
 * Time: O(log n)
 * Space: O(1)
 * Interview note: std::lower_bound is the STL workhorse for "insertion point" and duplicate-range questions.
 */
inline int lower_bound_index(const std::vector<int>& nums, int target) {
    const auto it = std::lower_bound(nums.begin(), nums.end(), target);
    return static_cast<int>(it - nums.begin());
}

}  // namespace algos
