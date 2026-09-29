---
title: Gas Station
description: One-pass greedy that resets the start after any prefix with negative tank.
domain: dsa
category: greedy
type: problem
difficulty: intermediate
status: evergreen
tags: [greedy, arrays, circular]
prerequisites: [Greedy-Pattern]
related: [Jump-Game, Prefix-Sum-Pattern]
pattern: greedy
source: "LeetCode 134"
languages: [python, java, cpp]
---

# Gas Station

Pattern: [[Greedy-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Stations on a circular route have `gas[i]` fuel; going from station i to i+1 costs `cost[i]`. Starting with an empty tank, return the index of the station from which you can complete one full clockwise loop, or -1. If a solution exists it is unique.

Example: `gas = [1,2,3,4,5], cost = [3,4,5,1,2]` -> `3`.

## Intuition

Two facts: (1) a loop is possible iff `sum(gas) >= sum(cost)`; (2) if starting at `s` you run dry before reaching station `j`, then no station between `s` and `j` can be a start either (each would arrive at `j` with no more fuel than you had), so jump the candidate to `j + 1`.

## Brute force

Simulate from every start. O(n^2).

## Optimized approach

Track `total` (sum of `gas[i] - cost[i]`) and `tank` (since the current candidate). When `tank < 0`, set `start = i + 1`, `tank = 0`. At the end return `start` if `total >= 0`, else -1.

## Complexity

Time O(n), space O(1).

## Implementation

### Python

```python
class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        total = tank = start = 0
        for i in range(len(gas)):
            diff = gas[i] - cost[i]
            total += diff
            tank += diff
            if tank < 0:
                start, tank = i + 1, 0
        return start if total >= 0 else -1
```

### Java

```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total >= 0 ? start : -1;
    }
}
```

### C++

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < (int)gas.size(); ++i) {
            int diff = gas[i] - cost[i];
            total += diff;
            tank += diff;
            if (tank < 0) { start = i + 1; tank = 0; }
        }
        return total >= 0 ? start : -1;
    }
};
```

## Edge cases

- Single station: `gas[0] >= cost[0]` -> 0.
- Total deficit: -1 regardless of `start`.
- `start` becoming `n` only happens when total is negative, so it is never returned.

## Common mistakes

- Simulating the circle again after finding `start` (unnecessary given the total check).
- Resetting `total` along with `tank`.

## Follow-ups

- Prove fact (2) formally.
- Return all valid starts when uniqueness is not guaranteed (prefix-sum minimum reasoning).
