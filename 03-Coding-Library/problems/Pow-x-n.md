---
title: Pow(x, n)
description: Fast exponentiation by squaring in O(log n), handling negative exponents and INT_MIN.
domain: dsa
category: math
type: problem
difficulty: intermediate
status: evergreen
tags: [math, recursion, binary-exponentiation]
prerequisites: [Math-Pattern, Recursion-Pattern]
related: [Count-Primes, Bit-Manipulation-Pattern]
pattern: math
source: "LeetCode 50"
languages: [python, java, cpp]
---

# Pow(x, n)

Pattern: [[Math-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Implement `pow(x, n)`: raise a double `x` to a 32-bit integer power `n` (which may be negative).

Example: `x = 2.0, n = 10` -> `1024.0`; `x = 2.0, n = -2` -> `0.25`.

## Intuition

`x^n = (x^2)^(n/2)` for even n, and one extra factor of `x` for odd n. Reading the bits of `n` from least significant, multiply the result by the current power of x whenever the bit is set.

## Brute force

Multiply `x` by itself `|n|` times. O(|n|), too slow for `|n|` near 2^31.

## Optimized approach

Convert `n` to a 64-bit `N`; if negative, `x = 1/x`, `N = -N`. Loop while `N > 0`: if `N & 1`, `result *= x`; `x *= x`; `N >>= 1`.

## Complexity

Time O(log n), space O(1) iterative (O(log n) if recursive).

## Implementation

### Python

```python
class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x, n = 1 / x, -n
        result = 1.0
        while n:
            if n & 1:
                result *= x
            x *= x
            n >>= 1
        return result
```

### Java

```java
class Solution {
    public double myPow(double x, int n) {
        long N = n;                 // -Integer.MIN_VALUE overflows int
        if (N < 0) { x = 1 / x; N = -N; }
        double result = 1.0;
        while (N > 0) {
            if ((N & 1) == 1) result *= x;
            x *= x;
            N >>= 1;
        }
        return result;
    }
}
```

### C++

```cpp
class Solution {
public:
    double myPow(double x, int n) {
        long long N = n;
        if (N < 0) { x = 1 / x; N = -N; }
        double result = 1.0;
        while (N > 0) {
            if (N & 1) result *= x;
            x *= x;
            N >>= 1;
        }
        return result;
    }
};
```

## Edge cases

- `n = 0` -> 1.0 (including `x = 0`, by convention here).
- `n = INT_MIN`: negating in 32-bit overflows; widen first.
- `x = 1` or `x = -1` with huge `n`.

## Common mistakes

- `n = -n` on a 32-bit int.
- Recursing twice on `pow(x, n/2)` (turns O(log n) into O(n)).

## Follow-ups

- Modular exponentiation `a^b mod m` for large integers (same loop with `% m`) — used in hashing and cryptography.
- Matrix exponentiation for linear recurrences (Fibonacci in O(log n)).
