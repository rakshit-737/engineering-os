---
title: Counting Bits
description: Popcount for every number 0..n in O(n) using dp[i] = dp[i >> 1] + (i & 1).
domain: dsa
category: bit-manipulation
type: problem
difficulty: beginner
status: evergreen
tags: [bit-manipulation, dp]
prerequisites: [Bit-Manipulation-Pattern, DP-Pattern]
related: [Single-Number, Climbing-Stairs]
pattern: bit-manipulation
source: "LeetCode 338"
languages: [python, java, cpp]
---

# Counting Bits

Pattern: [[Bit-Manipulation-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

For every `i` in `0..n`, return the number of 1 bits in the binary representation of `i`.

Example: `n = 5` -> `[0,1,1,2,1,2]`.

## Intuition

`i >> 1` drops the last bit, and we already know its popcount. Add back the dropped bit `i & 1`. (Equivalent: `dp[i] = dp[i & (i - 1)] + 1`, since `i & (i - 1)` clears the lowest set bit.)

## Brute force

Count bits of each number individually (Kernighan loop). O(n log n) worst case.

## Optimized approach

`ans[0] = 0`; for `i` from 1 to n, `ans[i] = ans[i >> 1] + (i & 1)`.

## Complexity

Time O(n), space O(n) for the output.

## Implementation

### Python

```python
class Solution:
    def countBits(self, n: int) -> list[int]:
        ans = [0] * (n + 1)
        for i in range(1, n + 1):
            ans[i] = ans[i >> 1] + (i & 1)
        return ans
```

### Java

```java
class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
        return ans;
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> countBits(int n) {
        vector<int> ans(n + 1, 0);
        for (int i = 1; i <= n; ++i) ans[i] = ans[i >> 1] + (i & 1);
        return ans;
    }
};
```

## Edge cases

- `n = 0` -> `[0]`.
- Powers of two have exactly one set bit.

## Common mistakes

- Operator precedence: in C++/Java `ans[i >> 1] + i & 1` parses as `(ans[i>>1] + i) & 1`. Parenthesize `(i & 1)`.

## Follow-ups

- Built-ins: `Integer.bitCount`, `__builtin_popcount` / `std::popcount` (C++20), `int.bit_count()` (Python 3.10+).
- Hamming distance between two numbers: popcount of `x ^ y`.
