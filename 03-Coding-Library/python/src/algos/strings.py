"""String algorithms with complexity and interview notes."""

from __future__ import annotations

from collections import Counter


def prefix_function(s: str) -> list[int]:
    """
    Prefix function (KMP failure table)
    Time: O(n)
    Space: O(n)
    Interview note: pi[i] is the length of the longest proper prefix of
    s[:i+1] that is also a suffix; explain the fallback chain pi[k-1].
    """
    pi = [0] * len(s)
    for i in range(1, len(s)):
        k = pi[i - 1]
        while k > 0 and s[i] != s[k]:
            k = pi[k - 1]
        if s[i] == s[k]:
            k += 1
        pi[i] = k
    return pi


def kmp_search(text: str, pattern: str) -> list[int]:
    """
    Knuth-Morris-Pratt substring search
    Time: O(n + m)
    Space: O(m)
    Interview note: after a full match, fall back to pi[m-1] so
    overlapping matches are still found.
    Returns all starting indices where pattern occurs in text.
    An empty pattern matches at every position 0..len(text).
    """
    n = len(text)
    m = len(pattern)
    if m == 0:
        return list(range(n + 1))
    if m > n:
        return []

    pi = prefix_function(pattern)
    matches: list[int] = []
    k = 0
    for i, ch in enumerate(text):
        while k > 0 and ch != pattern[k]:
            k = pi[k - 1]
        if ch == pattern[k]:
            k += 1
        if k == m:
            matches.append(i - m + 1)
            k = pi[k - 1]
    return matches


def rabin_karp(text: str, pattern: str) -> list[int]:
    """
    Rabin-Karp substring search (rolling hash)
    Time: O(n + m) expected, O(n * m) worst case on hash collisions
    Space: O(1) extra (excluding output)
    Interview note: always verify a hash hit with a direct comparison;
    mention the rolling update t = (t - lead * base^(m-1)) * base + next.
    Returns all starting indices where pattern occurs in text.
    An empty pattern matches at every position 0..len(text).
    """
    n = len(text)
    m = len(pattern)
    if m == 0:
        return list(range(n + 1))
    if m > n:
        return []

    base = 256
    mod = 1_000_000_007
    high = pow(base, m - 1, mod)

    p_hash = 0
    t_hash = 0
    for i in range(m):
        p_hash = (p_hash * base + ord(pattern[i])) % mod
        t_hash = (t_hash * base + ord(text[i])) % mod

    matches: list[int] = []
    for i in range(n - m + 1):
        if t_hash == p_hash and text[i : i + m] == pattern:
            matches.append(i)
        if i < n - m:
            t_hash = ((t_hash - ord(text[i]) * high) * base + ord(text[i + m])) % mod
    return matches


def longest_palindromic_substring(s: str) -> str:
    """
    Longest palindromic substring (expand around center)
    Time: O(n^2)
    Space: O(1)
    Interview note: 2n - 1 centers (each char and each gap); mention
    Manacher's O(n) as the follow-up.
    Returns the leftmost longest palindromic substring.
    """
    if not s:
        return ""

    best_start = 0
    best_len = 1

    def expand(left: int, right: int) -> None:
        nonlocal best_start, best_len
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        length = right - left - 1
        if length > best_len:
            best_len = length
            best_start = left + 1

    for center in range(len(s)):
        expand(center, center)
        expand(center, center + 1)

    return s[best_start : best_start + best_len]


def is_anagram(a: str, b: str) -> bool:
    """
    Anagram check (character counting)
    Time: O(n)
    Space: O(k) for k distinct characters
    Interview note: Counter beats sorting's O(n log n); a fixed-size
    array works when the alphabet is known.
    """
    if len(a) != len(b):
        return False
    return Counter(a) == Counter(b)


def z_function(s: str) -> list[int]:
    """
    Z-function
    Time: O(n)
    Space: O(n)
    Interview note: z[i] is the length of the longest common prefix of s
    and s[i:]; z[0] is defined as 0 here. Concatenating
    pattern + sep + text turns this into pattern matching.
    """
    n = len(s)
    z = [0] * n
    left = 0
    right = 0
    for i in range(1, n):
        if i < right:
            z[i] = min(right - i, z[i - left])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > right:
            left = i
            right = i + z[i]
    return z
