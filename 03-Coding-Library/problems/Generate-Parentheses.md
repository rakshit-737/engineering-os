---
title: Generate Parentheses
description: Recursively build balanced strings, adding '(' while opens remain and ')' while it stays valid.
domain: dsa
category: recursion
type: problem
difficulty: intermediate
status: evergreen
tags: [recursion, backtracking, strings]
prerequisites: [Recursion-Pattern, Backtracking-Pattern]
related: [Valid-Parentheses, Subsets, Permutations]
pattern: recursion
source: "LeetCode 22"
languages: [python, java, cpp]
---

# Generate Parentheses

Pattern: [[Recursion-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Given `n`, return every string of `n` pairs of parentheses that is well-formed.

Example: `n = 3` -> `["((()))","(()())","(())()","()(())","()()()"]`.

## Intuition

A prefix can grow into a valid string iff `open <= n` and `close <= open`. Recurse only along prefixes that satisfy this, so every leaf at length `2n` is valid — no filtering needed.

## Brute force

Generate all 2^(2n) strings of `(` and `)` and keep the valid ones (check with a counter). O(2^(2n) * n).

## Optimized approach

`build(s, open, close)`: if `len == 2n` record; if `open < n` recurse with `(`; if `close < open` recurse with `)`.

## Complexity

The number of results is the nth Catalan number, about `4^n / (n^1.5 * sqrt(pi))`. Time O(4^n / sqrt(n)) overall, space O(n) recursion depth plus output.

## Implementation

### Python

```python
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        res, path = [], []

        def build(open_: int, close: int) -> None:
            if len(path) == 2 * n:
                res.append("".join(path))
                return
            if open_ < n:
                path.append("(")
                build(open_ + 1, close)
                path.pop()
            if close < open_:
                path.append(")")
                build(open_, close + 1)
                path.pop()

        build(0, 0)
        return res
```

### Java

```java
import java.util.*;

class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        build(new StringBuilder(), 0, 0, n, res);
        return res;
    }

    private void build(StringBuilder sb, int open, int close, int n, List<String> res) {
        if (sb.length() == 2 * n) {
            res.add(sb.toString());
            return;
        }
        if (open < n) {
            sb.append('(');
            build(sb, open + 1, close, n, res);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            build(sb, open, close + 1, n, res);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}
```

### C++

```cpp
#include <string>
#include <vector>
using namespace std;

class Solution {
    vector<string> res;
    string path;
    void build(int open, int close, int n) {
        if ((int)path.size() == 2 * n) { res.push_back(path); return; }
        if (open < n) { path.push_back('('); build(open + 1, close, n); path.pop_back(); }
        if (close < open) { path.push_back(')'); build(open, close + 1, n); path.pop_back(); }
    }
public:
    vector<string> generateParenthesis(int n) {
        res.clear();
        path.clear();
        build(0, 0, n);
        return res;
    }
};
```

## Edge cases

- `n = 1` -> `["()"]`.
- `n = 0` -> `[""]` with this code; confirm expectations.

## Common mistakes

- Allowing `)` when `close == open` (produces invalid prefixes).
- Building new strings at every level in Java (`s + "("`) — works, but StringBuilder with undo is cheaper.

## Follow-ups

- Count only: Catalan numbers via DP `C(n) = sum C(i) * C(n-1-i)`.
- Multiple bracket types.
- Remove Invalid Parentheses (BFS/backtracking with pruning).
