---
title: Single Number
description: XOR all numbers; pairs cancel and the unique element remains, in O(1) space.
domain: dsa
category: bit-manipulation
type: problem
difficulty: beginner
status: evergreen
tags: [bit-manipulation, xor]
prerequisites: [Bit-Manipulation-Pattern]
related: [Counting-Bits, Two-Sum]
pattern: bit-manipulation
source: "LeetCode 136"
languages: [python, java, cpp]
---

# Single Number

Pattern: [[Bit-Manipulation-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Every element of a non-empty integer array appears exactly twice except one, which appears once. Find it in linear time with constant extra space.

Example: `[4,1,2,1,2]` -> `4`.

## Intuition

XOR is associative and commutative, `x ^ x = 0` and `x ^ 0 = x`. XOR-ing everything cancels each pair, leaving the single element.

## Brute force

Hash map of counts, or a set that adds/removes: O(n) time, O(n) space. Sorting and scanning pairs: O(n log n).

## Optimized approach

`acc = 0; for x in nums: acc ^= x; return acc`.

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
from functools import reduce
from operator import xor

class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        return reduce(xor, nums, 0)
```

### Java

```java
class Solution {
    public int singleNumber(int[] nums) {
        int acc = 0;
        for (int x : nums) acc ^= x;
        return acc;
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int acc = 0;
        for (int x : nums) acc ^= x;
        return acc;
    }
};
```

## Edge cases

- Single-element array.
- Negative numbers: XOR works on two's complement bits.
- Zero as the answer.

## Common mistakes

- Using a sum-based trick (`2 * sum(set) - sum`) and calling it O(1) space (the set is O(n)).

## Follow-ups

- Single Number II (others appear three times): count each bit position mod 3, or the `ones`/`twos` state machine.
- Single Number III (two unique numbers): XOR all, isolate the lowest set bit `diff & -diff`, split into two groups.
- Missing Number in `0..n`: XOR indices and values.
