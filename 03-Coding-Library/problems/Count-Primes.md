---
title: Count Primes
description: Count primes below n with the Sieve of Eratosthenes starting each crossing-out at p*p.
domain: dsa
category: math
type: problem
difficulty: intermediate
status: evergreen
tags: [math, sieve, primes]
prerequisites: [Math-Pattern]
related: [Pow-x-n, Counting-Bits]
pattern: math
source: "LeetCode 204"
languages: [python, java, cpp]
---

# Count Primes

Pattern: [[Math-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Return the number of prime numbers strictly less than `n`.

Example: `n = 10` -> `4` (2, 3, 5, 7).

## Intuition

Instead of testing each number for primality, cross out multiples of each prime. Whatever is never crossed out is prime.

## Brute force

Trial division of each `k < n` up to `sqrt(k)`. O(n * sqrt(n)).

## Optimized approach

Boolean array `is_prime[0..n-1]`, 0 and 1 false. For `p` from 2 while `p * p < n`: if `is_prime[p]`, mark `p*p, p*p + p, ...` false. Smaller multiples were already marked by smaller primes. Count the trues.

## Complexity

Time O(n log log n), space O(n).

## Implementation

### Python

```python
class Solution:
    def countPrimes(self, n: int) -> int:
        if n < 3:
            return 0
        is_prime = bytearray([1]) * n
        is_prime[0] = is_prime[1] = 0
        p = 2
        while p * p < n:
            if is_prime[p]:
                is_prime[p * p::p] = bytes(len(range(p * p, n, p)))
            p += 1
        return sum(is_prime)
```

### Java

```java
class Solution {
    public int countPrimes(int n) {
        if (n < 3) return 0;
        boolean[] composite = new boolean[n];
        int count = 0;
        for (int p = 2; p < n; p++) {
            if (composite[p]) continue;
            count++;
            for (long m = (long) p * p; m < n; m += p) composite[(int) m] = true;
        }
        return count;
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int countPrimes(int n) {
        if (n < 3) return 0;
        vector<char> composite(n, 0);
        int count = 0;
        for (int p = 2; p < n; ++p) {
            if (composite[p]) continue;
            ++count;
            for (long long m = 1LL * p * p; m < n; m += p) composite[m] = 1;
        }
        return count;
    }
};
```

## Edge cases

- `n <= 2` -> 0 (strictly less than n).
- `n = 3` -> 1.

## Common mistakes

- Counting primes `<= n` instead of `< n`.
- `p * p` overflowing 32-bit ints for large `p` (use 64-bit in Java/C++).
- Starting crossing-out at `2p` (still correct, just slower).

## Follow-ups

- Segmented sieve for ranges `[L, R]` with large R.
- Linear sieve (each composite marked once) that also yields smallest prime factors for fast factorization.
- Primality test for a single large number: trial division to sqrt, or Miller-Rabin.
