---
tags: [concept, cs-core]
created: 2026-08-01
status: evergreen
---

# Big O Notation

Hub: [[CS-Core-Index]]

## Core Idea

Big O describes an upper bound on how an algorithm's runtime or memory grows as input size n grows, ignoring constant factors and lower-order terms. Formally, f(n) = O(g(n)) means there exist constants c and n0 such that f(n) <= c*g(n) for all n >= n0. It measures growth *rate*, not actual speed — an O(n) algorithm with a huge constant can lose to O(n log n) at realistic sizes.

## Details

**The family.** Big O is an upper bound, Big Omega a lower bound, Big Theta a tight bound. Interviews say "Big O" but almost always mean Theta of the worst case. Distinguish worst case, average case, and amortized cost (e.g. dynamic array append: worst-case O(n), amortized O(1)).

**Common classes, from slowest-growing (best) to fastest-growing (worst):**

| Class | Name | Typical example |
|---|---|---|
| O(1) | constant | hash lookup, array index |
| O(log n) | logarithmic | [[Binary-Search]], balanced BST op |
| O(n) | linear | single scan, counting |
| O(n log n) | linearithmic | merge/heap sort, sort-then-scan |
| O(n^2) | quadratic | nested loops over pairs |
| O(2^n) | exponential | naive subset enumeration |
| O(n!) | factorial | permutation enumeration |

Rule of thumb for competitive limits: ~10^8 simple operations per second. n = 10^5 rules out O(n^2); n = 20 hints at O(2^n) bitmask solutions.

**Worked example.** Two-sum: brute force checks all pairs, O(n^2) time / O(1) space. With a hash map you scan once, checking `target - x` per element: O(n) time / O(n) space — a textbook time-for-space trade via [[Hash-Tables]].

```python
def two_sum(nums, target):        # O(n) time, O(n) space
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
```

**Analysis mechanics.**
- Sequential blocks add; drop the smaller: O(n + n^2) = O(n^2).
- Nested dependent loops: sum the work — `for i in range(n): for j in range(i)` does n(n-1)/2 iterations = O(n^2).
- Halving each step gives log n; recursion cost = (number of nodes in call tree) x (work per node). Master theorem for divide-and-conquer: T(n) = 2T(n/2) + O(n) = O(n log n).

**Pitfalls.**
- Two independent inputs stay separate: matrix scan is O(m*n), not O(n^2).
- Hidden costs: string concatenation in a loop is O(n^2) in Python; slicing `arr[1:]` copies, turning "linear" recursion into quadratic; `in` on a list is O(n) but O(1) on a set.
- Recursion space: depth counts even with no explicit allocation — see [[Recursion-and-Stack-Frames]].
- "Hash is O(1)" is average case; worst case with adversarial collisions is O(n).
- log base doesn't matter (constant factor), but say "log base 2" if asked why.

## Interview Angle

- State time AND space complexity for every solution before coding, and compare against brute force: "brute force is O(n^2) time O(1) space; I'll trade space for a hash map to get O(n)/O(n)." That framing alone is a strong signal.
- When asked "can you do better?", check the theoretical floor: you must read all input (Omega(n)), comparison sorting is Omega(n log n). Knowing when to stop optimizing is the point of the question.
- Be ready to justify amortized O(1) for dynamic array append and to separate average vs worst case for hashing and quicksort.
- Don't hand-wave recursive complexity — draw the recursion tree or state the recurrence.

## Related

- [[Sorting-Algorithms]]
- [[Hash-Tables]]
- [[Binary-Search]]
- [[Recursion-and-Stack-Frames]]
- [[Dynamic-Programming]]
- [[CS-Core-Index]]
