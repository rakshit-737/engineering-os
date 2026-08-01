from __future__ import annotations

import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from algos.bit_math import (
    all_subsets_bitmask,
    count_set_bits,
    fast_pow,
    gcd,
    is_power_of_two,
    lcm,
    sieve_of_eratosthenes,
    single_number,
)


class TestBitMath(unittest.TestCase):
    def test_count_set_bits(self) -> None:
        self.assertEqual(count_set_bits(0), 0)
        self.assertEqual(count_set_bits(1), 1)
        self.assertEqual(count_set_bits(255), 8)
        self.assertEqual(count_set_bits(1 << 64), 1)
        self.assertEqual(count_set_bits(0b101101), 4)

    def test_count_set_bits_negative_raises(self) -> None:
        with self.assertRaises(ValueError):
            count_set_bits(-1)

    def test_count_set_bits_against_builtin(self) -> None:
        rng = random.Random(7)
        for _ in range(50):
            n = rng.randint(0, 10**12)
            self.assertEqual(count_set_bits(n), bin(n).count("1"))

    def test_single_number(self) -> None:
        self.assertEqual(single_number([42]), 42)
        self.assertEqual(single_number([2, 1, 2]), 1)
        self.assertEqual(single_number([4, 1, 2, 1, 2]), 4)
        self.assertEqual(single_number([-3, 5, 5]), -3)
        with self.assertRaises(ValueError):
            single_number([])

    def test_is_power_of_two(self) -> None:
        for power in (1, 2, 4, 1024, 1 << 40):
            self.assertTrue(is_power_of_two(power))
        for not_power in (0, -2, 3, 6, 1023):
            self.assertFalse(is_power_of_two(not_power))

    def test_gcd(self) -> None:
        self.assertEqual(gcd(0, 0), 0)
        self.assertEqual(gcd(0, 5), 5)
        self.assertEqual(gcd(12, 18), 6)
        self.assertEqual(gcd(-12, 18), 6)
        self.assertEqual(gcd(17, 13), 1)

    def test_lcm(self) -> None:
        self.assertEqual(lcm(0, 5), 0)
        self.assertEqual(lcm(4, 6), 12)
        self.assertEqual(lcm(-4, 6), 12)
        self.assertEqual(lcm(7, 7), 7)
        self.assertEqual(lcm(3, 5), 15)

    def test_sieve_edges(self) -> None:
        self.assertEqual(sieve_of_eratosthenes(-5), [])
        self.assertEqual(sieve_of_eratosthenes(0), [])
        self.assertEqual(sieve_of_eratosthenes(1), [])
        self.assertEqual(sieve_of_eratosthenes(2), [2])

    def test_sieve_known_primes(self) -> None:
        self.assertEqual(
            sieve_of_eratosthenes(30),
            [2, 3, 5, 7, 11, 13, 17, 19, 23, 29],
        )
        self.assertEqual(len(sieve_of_eratosthenes(100)), 25)

    def test_fast_pow_basic(self) -> None:
        self.assertEqual(fast_pow(2, 10), 1024)
        self.assertEqual(fast_pow(5, 0), 1)
        self.assertEqual(fast_pow(0, 0), 1)
        self.assertEqual(fast_pow(0, 5), 0)
        self.assertEqual(fast_pow(-2, 3), -8)

    def test_fast_pow_mod(self) -> None:
        self.assertEqual(fast_pow(2, 10, 1000), 24)
        self.assertEqual(fast_pow(3, 200, 7), pow(3, 200, 7))
        self.assertEqual(fast_pow(10, 0, 1), 0)
        self.assertEqual(fast_pow(7, 100, 1), 0)

    def test_fast_pow_against_builtin(self) -> None:
        rng = random.Random(11)
        for _ in range(50):
            base = rng.randint(-50, 50)
            exp = rng.randint(0, 30)
            mod = rng.randint(1, 10**6)
            self.assertEqual(fast_pow(base, exp), base**exp)
            self.assertEqual(fast_pow(base, exp, mod), pow(base, exp, mod))

    def test_fast_pow_invalid(self) -> None:
        with self.assertRaises(ValueError):
            fast_pow(2, -1)
        with self.assertRaises(ValueError):
            fast_pow(2, 3, 0)

    def test_all_subsets_empty_and_single(self) -> None:
        self.assertEqual(all_subsets_bitmask([]), [[]])
        self.assertEqual(all_subsets_bitmask([1]), [[], [1]])

    def test_all_subsets_full(self) -> None:
        subsets = all_subsets_bitmask([1, 2, 3])
        self.assertEqual(len(subsets), 8)
        as_sets = [tuple(sorted(s)) for s in subsets]
        for expected in ((), (1,), (2,), (3,), (1, 2), (1, 3), (2, 3), (1, 2, 3)):
            self.assertIn(expected, as_sets)

    def test_all_subsets_duplicates_kept_distinct(self) -> None:
        subsets = all_subsets_bitmask(["a", "a"])
        self.assertEqual(len(subsets), 4)
        self.assertEqual(subsets.count(["a"]), 2)


if __name__ == "__main__":
    unittest.main()
