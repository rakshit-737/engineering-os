---
title: Coin Change
description: Minimum coins to make an amount via unbounded-knapsack DP over amounts.
domain: dsa
category: dp-1d
type: problem
difficulty: intermediate
status: evergreen
tags: [dp, unbounded-knapsack, bfs]
prerequisites: [DP-Pattern, Climbing-Stairs]
related: [Partition-Equal-Subset-Sum, Climbing-Stairs, Greedy-Pattern]
pattern: dp-1d
source: "LeetCode 322"
languages: [python, java, cpp]
---

# Coin Change

Pattern: [[DP-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given coin denominations (unlimited supply of each) and an `amount`, return the fewest coins that sum to `amount`, or -1 if it cannot be made.

Example: `coins = [1,2,5], amount = 11` -> `3` (5+5+1); `coins = [2], amount = 3` -> -1.

## Intuition

Greedy (largest coin first) fails for denominations like `[1,3,4]`, amount 6 (greedy 4+1+1 = 3 coins, optimal 3+3 = 2). Instead, `dp[a] = 1 + min(dp[a - c])` over coins `c <= a`.

## Brute force

Recursion trying every coin at every step: exponential.

## Optimized approach

`dp[0] = 0`, others infinity. For `a` from 1 to `amount`, for each coin `c <= a`, `dp[a] = min(dp[a], dp[a - c] + 1)`. Answer `dp[amount]` or -1.

## Complexity

Time O(amount * len(coins)), space O(amount).

## Implementation

### Python

```python
class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        INF = amount + 1
        dp = [0] + [INF] * amount
        for a in range(1, amount + 1):
            for c in coins:
                if c <= a and dp[a - c] + 1 < dp[a]:
                    dp[a] = dp[a - c] + 1
        return dp[amount] if dp[amount] != INF else -1
```

### Java

```java
import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
        return dp[amount] == INF ? -1 : dp[amount];
    }
}
```

### C++

```cpp
#include <algorithm>
#include <vector>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        const int INF = amount + 1;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        for (int a = 1; a <= amount; ++a)
            for (int c : coins)
                if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1);
        return dp[amount] == INF ? -1 : dp[amount];
    }
};
```

## Edge cases

- `amount = 0` -> 0.
- No combination possible -> -1.
- Coins larger than the amount are skipped.

## Common mistakes

- Using `INT_MAX` as infinity and then adding 1 (overflow). `amount + 1` is a safe sentinel since the answer never exceeds `amount`.
- Assuming greedy works.

## Follow-ups

- Coin Change II (number of combinations): loop coins outer, amounts inner, `dp[a] += dp[a - c]`. Swapping the loops counts ordered sequences instead.
- BFS view: amounts are nodes, coins are edges; shortest path = fewest coins.
- Reconstruct which coins were used.
