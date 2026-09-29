---
title: Bit Manipulation Pattern
description: Use bitwise operators for parity, set membership, counting and subset enumeration.
domain: dsa
category: bit-manipulation
type: pattern
difficulty: intermediate
status: evergreen
tags: [bits, math]
prerequisites: []
related: [Math-Pattern, DP-Pattern]
---

# Bit Manipulation Pattern

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Treat an integer as an array of bits and exploit hardware-speed operators for set membership, parity, and counting tricks that would otherwise need extra data structures. A bitmask over n items encodes any subset in one int — the backbone of subset enumeration and bitmask DP.

## Details

Operator table:

| Op | Name | Effect |
|----|------|--------|
| `a & b` | AND | 1 where both bits set — masking, testing |
| `a \| b` | OR | 1 where either set — setting bits |
| `a ^ b` | XOR | 1 where bits differ — toggling, parity |
| `~a` | NOT | flip all bits; in Python equals `-a - 1` |
| `a << k` | left shift | multiply by 2^k; `1 << k` builds a mask |
| `a >> k` | right shift | floor-divide by 2^k |

Key idioms:
- `x & (x - 1)` — clears the **lowest set bit** (loop it to count bits; zero result ⇒ power of two)
- `x & -x` — **isolates** the lowest set bit (two's complement trick)
- `x ^ x == 0`, `x ^ 0 == x` — XOR self-cancellation; XOR of a list cancels every paired value
- `x | (1 << k)` set bit k, `x & ~(1 << k)` clear it, `(x >> k) & 1` test it
- `bin(x).count("1")` / `x.bit_count()` (3.10+) — popcount without the loop

Template — subsets via bitmask:

```python
def subsets(nums):
    n, out = len(nums), []
    for mask in range(1 << n):                     # 2^n masks
        out.append([nums[i] for i in range(n)
                    if mask & (1 << i)])           # bit i set => include nums[i]
    return out
```

Classic problems:
- **Single Number** — XOR everything; pairs cancel, the singleton survives. O(n) time, O(1) space
- **Counting Bits** — DP: `bits[i] = bits[i & (i - 1)] + 1` (or `bits[i >> 1] + (i & 1)`)
- **Subsets via bitmask** — template above; also powers bitmask DP over subsets (O(2^n · n))
- **Power of Two** — `n > 0 and n & (n - 1) == 0`

Complexity: single-int ops are O(1) for fixed-width values (O(word count) for Python bignums); subset enumeration is O(2^n · n).

**The trap:** Python ints are arbitrary precision — there is no overflow, which kills classic 32-bit tricks. `~x` is mathematically `-x - 1`, not a 32-bit flipped word: `~5` is `-6`, not `4294967290`. To emulate fixed width, mask explicitly: `x & 0xFFFFFFFF` after each op, and to read a masked value as signed: `x - (1 << 32) if x >= (1 << 31) else x`. Right shift of a negative Python int is arithmetic and never reaches 0 in a naive loop — mask first. This bites hardest in "add two numbers without +" style questions.

## Interview Angle

Trigger words: "without extra space", "appears once/twice", "count set bits", parity, "O(1) space", subset enumeration. State the idiom by name ("clear lowest set bit") before using it — it signals fluency. If the interviewer's solution assumes 32-bit ints, proactively mention the Python masking caveat; it's a cheap way to look language-aware.

## Practice Problems

- [[Single-Number]]
- [[Counting-Bits]]
- [[Subsets]]

## Related

- [[DP-Pattern]]
- [[Backtracking-Pattern]]
- [[Two-Pointer-Pattern]]
- [[Interview-Prep-Index]]
