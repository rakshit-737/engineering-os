#pragma once
// Dynamic programming algorithms with complexity and interview notes.
// Header-only, C++17, STL only.

#include <algorithm>
#include <cstddef>
#include <string>
#include <vector>

namespace algos {

/*
 * Coin Change (minimum coins to make amount; -1 if impossible)
 * Time: O(amount * coins)
 * Space: O(amount)
 * Interview note: bottom-up with an `amount + 1` sentinel avoids INT_MAX overflow when adding 1.
 */
inline int coin_change_min(const std::vector<int>& coins, int amount) {
    if (amount < 0) {
        return -1;
    }
    const int sentinel = amount + 1;  // impossible marker: no answer can exceed `amount` coins
    std::vector<int> dp(static_cast<std::size_t>(amount) + 1, sentinel);
    dp[0] = 0;
    for (int target = 1; target <= amount; ++target) {
        for (const int coin : coins) {
            if (coin > 0 && coin <= target) {
                dp[static_cast<std::size_t>(target)] = std::min(
                    dp[static_cast<std::size_t>(target)], dp[static_cast<std::size_t>(target - coin)] + 1);
            }
        }
    }
    return dp[static_cast<std::size_t>(amount)] == sentinel ? -1 : dp[static_cast<std::size_t>(amount)];
}

/*
 * Longest Increasing Subsequence (strictly increasing, length only)
 * Time: O(n log n) via patience-sorting tails + std::lower_bound
 * Space: O(n)
 * Interview note: `tails[k]` = smallest tail of any increasing subsequence of length k+1;
 * tails is always sorted, which is what makes std::lower_bound valid — tails is NOT the subsequence itself.
 */
inline int longest_increasing_subsequence(const std::vector<int>& nums) {
    std::vector<int> tails;
    for (const int x : nums) {
        const auto it = std::lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) {
            tails.push_back(x);
        } else {
            *it = x;
        }
    }
    return static_cast<int>(tails.size());
}

/*
 * Edit Distance (Levenshtein: insert / delete / replace, unit cost)
 * Time: O(m * n)
 * Space: O(n) — two rolling rows instead of the full m x n table
 * Interview note: mention the rolling-row optimization; the full table is only needed
 * if the interviewer asks you to reconstruct the edit script.
 */
inline int edit_distance(const std::string& a, const std::string& b) {
    const std::size_t m = a.size();
    const std::size_t n = b.size();
    std::vector<int> prev(n + 1);
    std::vector<int> curr(n + 1);
    for (std::size_t j = 0; j <= n; ++j) {
        prev[j] = static_cast<int>(j);
    }
    for (std::size_t i = 1; i <= m; ++i) {
        curr[0] = static_cast<int>(i);
        for (std::size_t j = 1; j <= n; ++j) {
            if (a[i - 1] == b[j - 1]) {
                curr[j] = prev[j - 1];
            } else {
                curr[j] = 1 + std::min({prev[j], curr[j - 1], prev[j - 1]});
            }
        }
        std::swap(prev, curr);
    }
    return prev[n];
}

}  // namespace algos
