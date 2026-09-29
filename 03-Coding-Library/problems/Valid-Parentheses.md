---
title: Valid Parentheses
description: Validate bracket nesting with a stack of expected closing brackets.
domain: dsa
category: stack
type: problem
difficulty: beginner
status: evergreen
tags: [stack, strings]
prerequisites: [Stack-and-Monotonic-Stack-Pattern]
related: [Generate-Parentheses, Daily-Temperatures]
pattern: stack
source: "LeetCode 20"
languages: [python, java, cpp]
---

# Valid Parentheses

Pattern: [[Stack-and-Monotonic-Stack-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

A string contains only `()[]{}`. It is valid if every opener is closed by the same type, in the correct order, and every closer has a matching opener.

Example: `"()[]{}"` -> true; `"(]"` -> false; `"([)]"` -> false; `"{[]}"` -> true.

## Intuition

The most recent unmatched opener must be closed first: last in, first out, which is a stack.

## Brute force

Repeatedly delete adjacent pairs `()`, `[]`, `{}` until nothing changes; valid if empty. O(n^2).

## Optimized approach

On an opener, push its matching closer. On a closer, the stack top must equal it; pop. At the end the stack must be empty.

## Complexity

Time O(n), space O(n).

## Implementation

### Python

```python
class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {'(': ')', '[': ']', '{': '}'}
        stack = []
        for c in s:
            if c in pairs:
                stack.append(pairs[c])
            elif not stack or stack.pop() != c:
                return False
        return not stack
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '[') stack.push(']');
            else if (c == '{') stack.push('}');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
```

### C++

```cpp
#include <stack>
#include <string>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '[') st.push(']');
            else if (c == '{') st.push('}');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};
```

## Edge cases

- Odd length: can return false immediately.
- Starts with a closer: empty-stack check.
- Only openers: non-empty stack at the end.

## Common mistakes

- Using counters per bracket type: fails `"([)]"`.
- Forgetting the final emptiness check.

## Follow-ups

- Minimum removals / additions to make valid: counter-based for one type.
- Longest valid parentheses substring: stack of indices or DP.
- Generate all valid strings: [[Generate-Parentheses]].
