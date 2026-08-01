from __future__ import annotations

import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.strings import (
    is_anagram,
    kmp_search,
    longest_palindromic_substring,
    prefix_function,
    rabin_karp,
    z_function,
)


def naive_find_all(text: str, pattern: str) -> list[int]:
    if len(pattern) == 0:
        return list(range(len(text) + 1))
    return [
        i
        for i in range(len(text) - len(pattern) + 1)
        if text[i : i + len(pattern)] == pattern
    ]


class TestStrings(unittest.TestCase):
    def test_prefix_function_known_values(self) -> None:
        self.assertEqual(prefix_function(""), [])
        self.assertEqual(prefix_function("a"), [0])
        self.assertEqual(prefix_function("aabaaab"), [0, 1, 0, 1, 2, 2, 3])
        self.assertEqual(prefix_function("abcabcd"), [0, 0, 0, 1, 2, 3, 0])

    def test_kmp_basic_and_overlapping(self) -> None:
        self.assertEqual(kmp_search("hello world", "world"), [6])
        self.assertEqual(kmp_search("aaaa", "aa"), [0, 1, 2])
        self.assertEqual(kmp_search("abababab", "abab"), [0, 2, 4])

    def test_kmp_no_match_and_pattern_too_long(self) -> None:
        self.assertEqual(kmp_search("abc", "xyz"), [])
        self.assertEqual(kmp_search("ab", "abc"), [])
        self.assertEqual(kmp_search("", "a"), [])

    def test_kmp_empty_pattern(self) -> None:
        self.assertEqual(kmp_search("abc", ""), [0, 1, 2, 3])
        self.assertEqual(kmp_search("", ""), [0])

    def test_kmp_full_text_match(self) -> None:
        self.assertEqual(kmp_search("abc", "abc"), [0])

    def test_rabin_karp_basic_and_overlapping(self) -> None:
        self.assertEqual(rabin_karp("hello world", "world"), [6])
        self.assertEqual(rabin_karp("aaaa", "aa"), [0, 1, 2])
        self.assertEqual(rabin_karp("mississippi", "issi"), [1, 4])

    def test_rabin_karp_edges(self) -> None:
        self.assertEqual(rabin_karp("abc", ""), [0, 1, 2, 3])
        self.assertEqual(rabin_karp("", ""), [0])
        self.assertEqual(rabin_karp("ab", "abc"), [])
        self.assertEqual(rabin_karp("abc", "xyz"), [])

    def test_search_random_against_naive(self) -> None:
        rng = random.Random(42)
        for _ in range(100):
            text = "".join(rng.choice("ab") for _ in range(rng.randint(0, 40)))
            pattern = "".join(rng.choice("ab") for _ in range(rng.randint(1, 4)))
            expected = naive_find_all(text, pattern)
            self.assertEqual(kmp_search(text, pattern), expected)
            self.assertEqual(rabin_karp(text, pattern), expected)

    def test_longest_palindrome_basic(self) -> None:
        self.assertIn(longest_palindromic_substring("babad"), {"bab", "aba"})
        self.assertEqual(longest_palindromic_substring("cbbd"), "bb")
        self.assertEqual(longest_palindromic_substring("abba"), "abba")

    def test_longest_palindrome_edges(self) -> None:
        self.assertEqual(longest_palindromic_substring(""), "")
        self.assertEqual(longest_palindromic_substring("x"), "x")
        self.assertEqual(longest_palindromic_substring("abcd"), "a")
        self.assertEqual(longest_palindromic_substring("aaaa"), "aaaa")

    def test_is_anagram(self) -> None:
        self.assertTrue(is_anagram("listen", "silent"))
        self.assertTrue(is_anagram("", ""))
        self.assertTrue(is_anagram("aabb", "bbaa"))
        self.assertFalse(is_anagram("rat", "car"))
        self.assertFalse(is_anagram("aab", "abb"))
        self.assertFalse(is_anagram("ab", "abc"))

    def test_z_function_known_values(self) -> None:
        self.assertEqual(z_function(""), [])
        self.assertEqual(z_function("a"), [0])
        self.assertEqual(z_function("aaaaa"), [0, 4, 3, 2, 1])
        self.assertEqual(z_function("abacaba"), [0, 0, 1, 0, 3, 0, 1])
        self.assertEqual(z_function("abcd"), [0, 0, 0, 0])

    def test_z_function_matches_definition_random(self) -> None:
        rng = random.Random(7)
        for _ in range(50):
            s = "".join(rng.choice("ab") for _ in range(rng.randint(0, 30)))
            z = z_function(s)
            for i in range(1, len(s)):
                length = 0
                while i + length < len(s) and s[length] == s[i + length]:
                    length += 1
                self.assertEqual(z[i], length)


if __name__ == "__main__":
    unittest.main()
