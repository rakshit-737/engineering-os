---
title: Math Pattern
description: GCD, fast modular exponentiation, sieves, modular arithmetic and overflow-safe integer tricks.
domain: dsa
category: math
type: pattern
difficulty: intermediate
status: evergreen
tags: [math, number-theory, modular-arithmetic, primes]
prerequisites: [Big-O-Notation]
related: [Bit-Manipulation-Pattern, Recursion-Pattern, DP-Pattern]
---

# Math Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

A handful of number-theory tools appear again and again: Euclid's **GCD**, **fast exponentiation** by squaring, the **Sieve of Eratosthenes**, **modular arithmetic** (to keep counts inside 64 bits), and careful **overflow** handling. Recognizing a mathematical invariant often replaces simulation entirely.

## Details

**Recognition cues:**
- "Answer modulo 10^9 + 7" -> reduce after every add/multiply; use modular inverse for division (Fermat when the modulus is prime).
- "Count primes / smallest prime factor for many numbers" -> sieve.
- "x^n", "large power mod m" -> binary exponentiation.
- "Fractions, ratios, slopes, lattice points" -> GCD normalization.
- "Digits of a number", "reverse integer", "palindrome number" -> `% 10` and `/ 10` with overflow checks.
- "Ways to choose" -> combinatorics with precomputed factorials mod p.

**Templates:**

```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a                     # lcm(a, b) = a // gcd(a, b) * b

def mod_pow(base, exp, mod):
    result, base = 1, base % mod
    while exp:
        if exp & 1:
            result = result * base % mod
        base = base * base % mod
        exp >>= 1
    return result                # Python built-in: pow(base, exp, mod)

def sieve(n):                    # primes < n
    is_p = [True] * n
    is_p[0:2] = [False, False]
    for p in range(2, int(n ** 0.5) + 1):
        if is_p[p]:
            is_p[p*p::p] = [False] * len(range(p*p, n, p))
    return [i for i, v in enumerate(is_p) if v]
```

Modular inverse for prime `m`: `mod_pow(a, m - 2, m)`.

**Complexity:** GCD O(log min(a, b)); fast power O(log n); sieve O(n log log n); trial division primality O(sqrt n).

**Classic traps:**
- Java/C++ `%` of a negative number is negative: normalize with `((x % m) + m) % m`.
- `a * b` overflowing 64-bit before `% m` when `m` is near 2^62 (use `__int128` or mulmod).
- Negating `INT_MIN` overflows; widen to `long` first.
- Floating-point equality for slopes — compare reduced integer fractions instead.

## Interview Angle

- Ask about input ranges immediately; overflow is the most common math-question bug.
- Explain why the sieve starts at `p * p`: smaller multiples were already crossed out by smaller primes.

## Practice Problems

- [[Pow-x-n]]
- [[Count-Primes]]
- [[Counting-Bits]]

## Related

- [[Bit-Manipulation-Pattern]]
- [[Recursion-Pattern]]
- [[Big-O-Notation]]
