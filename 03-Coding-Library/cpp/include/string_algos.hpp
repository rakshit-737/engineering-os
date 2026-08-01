#pragma once
// String algorithms with complexity and interview notes.
// Header-only, C++17, STL only.

#include <array>
#include <cstddef>
#include <string>
#include <vector>

namespace algos {

/*
 * KMP Search (all match start indices of pattern in text; overlaps included)
 * Time: O(n + m) — n = text length, m = pattern length
 * Space: O(m) for the failure (longest proper prefix-suffix) table
 * Interview note: the failure table lets the text pointer never move backward,
 * which is the whole point vs. naive O(n*m). Empty pattern returns no matches by convention here.
 */
inline std::vector<int> kmp_search(const std::string& text, const std::string& pattern) {
    std::vector<int> matches;
    const std::size_t m = pattern.size();
    if (m == 0 || m > text.size()) {
        return matches;
    }

    std::vector<std::size_t> fail(m, 0);
    std::size_t k = 0;
    for (std::size_t i = 1; i < m; ++i) {
        while (k > 0 && pattern[i] != pattern[k]) {
            k = fail[k - 1];
        }
        if (pattern[i] == pattern[k]) {
            ++k;
        }
        fail[i] = k;
    }

    k = 0;
    for (std::size_t i = 0; i < text.size(); ++i) {
        while (k > 0 && text[i] != pattern[k]) {
            k = fail[k - 1];
        }
        if (text[i] == pattern[k]) {
            ++k;
        }
        if (k == m) {
            matches.push_back(static_cast<int>(i + 1 - m));
            k = fail[k - 1];  // continue searching — allows overlapping matches
        }
    }
    return matches;
}

/*
 * Anagram Check
 * Time: O(n)
 * Space: O(1) — fixed 256-slot count array regardless of input size
 * Interview note: cast char to unsigned char before indexing — plain char may be signed,
 * and a negative index into the array is undefined behavior.
 */
inline bool is_anagram(const std::string& a, const std::string& b) {
    if (a.size() != b.size()) {
        return false;
    }
    std::array<int, 256> counts{};
    for (const char c : a) {
        ++counts[static_cast<unsigned char>(c)];
    }
    for (const char c : b) {
        --counts[static_cast<unsigned char>(c)];
    }
    for (const int count : counts) {
        if (count != 0) {
            return false;
        }
    }
    return true;
}

/*
 * Longest Palindromic Substring (expand around center)
 * Time: O(n^2)
 * Space: O(1) beyond the returned substring
 * Interview note: 2n-1 centers (each char + each gap) cover odd and even palindromes;
 * mention Manacher's O(n) as the follow-up but implement this one — it is what interviews expect.
 */
inline std::string longest_palindromic_substring(const std::string& s) {
    if (s.empty()) {
        return "";
    }
    std::size_t best_start = 0;
    std::size_t best_len = 1;
    const auto n = static_cast<std::ptrdiff_t>(s.size());

    const auto expand = [&](std::ptrdiff_t left, std::ptrdiff_t right) {
        while (left >= 0 && right < n && s[static_cast<std::size_t>(left)] == s[static_cast<std::size_t>(right)]) {
            --left;
            ++right;
        }
        const auto len = static_cast<std::size_t>(right - left - 1);
        if (len > best_len) {
            best_len = len;
            best_start = static_cast<std::size_t>(left + 1);
        }
    };

    for (std::ptrdiff_t center = 0; center < n; ++center) {
        expand(center, center);      // odd-length palindromes
        expand(center, center + 1);  // even-length palindromes
    }
    return s.substr(best_start, best_len);
}

}  // namespace algos
