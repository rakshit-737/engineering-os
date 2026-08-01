"""Bit manipulation and number theory algorithms with complexity and interview notes."""

from __future__ import annotations

from typing import TypeVar

T = TypeVar("T")


def count_set_bits(n: int) -> int:
    """
    Count Set Bits (Kernighan's algorithm)
    Time: O(k) where k is the number of set bits
    Space: O(1)
    Interview note: n & (n - 1) clears the lowest set bit; loop runs once per set bit.
    Raises ValueError for negative input (Python ints have infinite sign extension).
    """
    if n < 0:
        raise ValueError("count_set_bits requires a non-negative integer")

    count = 0
    while n:
        n &= n - 1
        count += 1
    return count


def single_number(nums: list[int]) -> int:
    """
    Single Number (XOR fold)
    Time: O(n)
    Space: O(1)
    Interview note: x ^ x == 0 and x ^ 0 == x, so pairs cancel and the unique survives.
    Assumes every element appears exactly twice except one element appearing once.
    Raises ValueError for an empty list.
    """
    if not nums:
        raise ValueError("single_number requires a non-empty list")

    result = 0
    for value in nums:
        result ^= value
    return result


def is_power_of_two(n: int) -> bool:
    """
    Power-of-Two Check
    Time: O(1)
    Space: O(1)
    Interview note: a power of two has exactly one set bit, so n & (n - 1) == 0.
    Zero and negatives are not powers of two.
    """
    return n > 0 and n & (n - 1) == 0


def gcd(a: int, b: int) -> int:
    """
    Greatest Common Divisor (Euclid's algorithm)
    Time: O(log(min(a, b)))
    Space: O(1)
    Interview note: gcd(a, b) == gcd(b, a mod b); worst case is consecutive Fibonaccis.
    Result is always non-negative; gcd(0, 0) == 0 by convention.
    """
    a = abs(a)
    b = abs(b)
    while b:
        a, b = b, a % b
    return a


def lcm(a: int, b: int) -> int:
    """
    Least Common Multiple
    Time: O(log(min(a, b)))
    Space: O(1)
    Interview note: compute abs(a) // gcd * abs(b) to avoid overflow in fixed-width languages.
    lcm with zero is 0 by convention.
    """
    if a == 0 or b == 0:
        return 0
    return abs(a) // gcd(a, b) * abs(b)


def sieve_of_eratosthenes(limit: int) -> list[int]:
    """
    Sieve of Eratosthenes: all primes <= limit.
    Time: O(n log log n)
    Space: O(n)
    Interview note: start crossing out at p*p since smaller multiples were already marked.
    Returns an empty list for limit < 2.
    """
    if limit < 2:
        return []

    is_prime = [True] * (limit + 1)
    is_prime[0] = is_prime[1] = False

    p = 2
    while p * p <= limit:
        if is_prime[p]:
            for multiple in range(p * p, limit + 1, p):
                is_prime[multiple] = False
        p += 1

    return [i for i in range(2, limit + 1) if is_prime[i]]


def fast_pow(base: int, exp: int, mod: int | None = None) -> int:
    """
    Fast Exponentiation (square-and-multiply)
    Time: O(log exp) multiplications
    Space: O(1)
    Interview note: process exponent bits LSB-first; this is the core of RSA/Diffie-Hellman.
    With mod=None returns base**exp exactly; exp must be non-negative.
    """
    if exp < 0:
        raise ValueError("fast_pow requires a non-negative exponent")
    if mod is not None and mod <= 0:
        raise ValueError("fast_pow requires a positive modulus")

    result = 1
    if mod is not None:
        result %= mod
        base %= mod

    while exp:
        if exp & 1:
            result = result * base if mod is None else (result * base) % mod
        base = base * base if mod is None else (base * base) % mod
        exp >>= 1

    return result


def all_subsets_bitmask(items: list[T]) -> list[list[T]]:
    """
    All Subsets via Bitmask Enumeration
    Time: O(n * 2^n)
    Space: O(n * 2^n)
    Interview note: mask bit i decides membership of items[i]; masks 0..2^n-1 cover the power set.
    Returns 2^n subsets including the empty set; positional duplicates are kept distinct.
    """
    n = len(items)
    subsets: list[list[T]] = []
    for mask in range(1 << n):
        subset = [items[i] for i in range(n) if mask & (1 << i)]
        subsets.append(subset)
    return subsets
