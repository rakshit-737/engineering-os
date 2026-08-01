"""Dynamic programming patterns with complexity and interview notes."""

from __future__ import annotations

import bisect


def fib(n: int) -> int:
    """
    Fibonacci, bottom-up with O(1) space.
    Time: O(n)
    Space: O(1)
    Interview note: lead with recurrence + state, then optimize space.
    """
    if n < 2:
        return n
    prev, curr = 0, 1
    for _ in range(n - 1):
        prev, curr = curr, prev + curr
    return curr


def coin_change_min(coins: list[int], amount: int) -> int:
    """
    Minimum coins to reach amount; -1 if unreachable.
    Time: O(amount * len(coins))
    Space: O(amount)
    Interview note: unbounded knapsack pattern; state = min coins for value v.
    """
    INF = amount + 1
    dp = [0] + [INF] * amount
    for value in range(1, amount + 1):
        for coin in coins:
            if coin <= value and dp[value - coin] + 1 < dp[value]:
                dp[value] = dp[value - coin] + 1
    return dp[amount] if dp[amount] != INF else -1


def longest_increasing_subsequence(nums: list[int]) -> int:
    """
    Length of strictly increasing subsequence (patience sorting).
    Time: O(n log n)
    Space: O(n)
    Interview note: tails[i] = smallest tail of an increasing subsequence
    of length i+1; binary search keeps tails sorted.
    """
    tails: list[int] = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)


def knapsack_01(weights: list[int], values: list[int], capacity: int) -> int:
    """
    0/1 knapsack maximum value.
    Time: O(n * capacity)
    Space: O(capacity)
    Interview note: iterate capacity downward so each item is used once.
    """
    dp = [0] * (capacity + 1)
    for weight, value in zip(weights, values):
        for cap in range(capacity, weight - 1, -1):
            dp[cap] = max(dp[cap], dp[cap - weight] + value)
    return dp[capacity]


def edit_distance(a: str, b: str) -> int:
    """
    Levenshtein distance (insert, delete, replace).
    Time: O(len(a) * len(b))
    Space: O(min(len(a), len(b)))
    Interview note: classic 2D grid DP; explain the three transitions clearly.
    """
    if len(a) < len(b):
        a, b = b, a

    prev = list(range(len(b) + 1))
    for i, ch_a in enumerate(a, start=1):
        curr = [i] + [0] * len(b)
        for j, ch_b in enumerate(b, start=1):
            if ch_a == ch_b:
                curr[j] = prev[j - 1]
            else:
                curr[j] = 1 + min(prev[j - 1], prev[j], curr[j - 1])
        prev = curr
    return prev[len(b)]
