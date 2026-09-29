---
title: Implement Queue using Stacks
description: FIFO queue from two LIFO stacks with amortized O(1) operations via lazy transfer.
domain: dsa
category: queue-deque
type: problem
difficulty: beginner
status: evergreen
tags: [queue, stack, design, amortized]
prerequisites: [Queue-and-Deque-Pattern, Stack-and-Monotonic-Stack-Pattern]
related: [Valid-Parentheses, Sliding-Window-Maximum]
pattern: queue-deque
source: "LeetCode 232"
languages: [python, java, cpp]
---

# Implement Queue using Stacks

Pattern: [[Queue-and-Deque-Pattern]] | Roadmap: [[DSA-Index]]

## Problem

Implement a FIFO queue supporting `push(x)`, `pop()`, `peek()` and `empty()` using only standard stack operations (push to top, pop/peek top, size, is-empty). Calls to `pop`/`peek` are valid (queue non-empty).

Example: `push(1), push(2), peek() -> 1, pop() -> 1, empty() -> false`.

## Intuition

Pouring one stack into another reverses the order, turning LIFO into FIFO. Only pour when the output stack is empty, so each element is moved at most once.

## Brute force

On every `push`, move everything to a helper stack, push, and move back. Push O(n), pop O(1).

## Optimized approach

`in` receives pushes. `out` serves pops/peeks. If `out` is empty, move all of `in` into `out`, then serve from `out`'s top.

## Complexity

Amortized O(1) per operation (each element is pushed and popped at most twice). Worst-case single `pop` is O(n). Space O(n).

## Implementation

### Python

```python
class MyQueue:
    def __init__(self):
        self.inbox, self.outbox = [], []

    def push(self, x: int) -> None:
        self.inbox.append(x)

    def _shift(self) -> None:
        if not self.outbox:
            while self.inbox:
                self.outbox.append(self.inbox.pop())

    def pop(self) -> int:
        self._shift()
        return self.outbox.pop()

    def peek(self) -> int:
        self._shift()
        return self.outbox[-1]

    def empty(self) -> bool:
        return not self.inbox and not self.outbox
```

### Java

```java
import java.util.ArrayDeque;
import java.util.Deque;

class MyQueue {
    private final Deque<Integer> in = new ArrayDeque<>();
    private final Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }

    private void shift() {
        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());
    }

    public int pop() { shift(); return out.pop(); }

    public int peek() { shift(); return out.peek(); }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}
```

### C++

```cpp
#include <stack>
using namespace std;

class MyQueue {
    stack<int> in, out;
    void shift() {
        if (out.empty())
            while (!in.empty()) { out.push(in.top()); in.pop(); }
    }
public:
    void push(int x) { in.push(x); }
    int pop() { shift(); int v = out.top(); out.pop(); return v; }
    int peek() { shift(); return out.top(); }
    bool empty() { return in.empty() && out.empty(); }
};
```

## Edge cases

- Interleaved push/pop: elements pushed after a transfer must wait in `in` until `out` drains.
- `empty()` must check both stacks.

## Common mistakes

- Transferring whenever `pop` is called even if `out` is non-empty (breaks order).
- Claiming worst-case O(1) instead of amortized O(1).

## Follow-ups

- Implement a stack using queues (one queue, rotate after push: O(n) push).
- Explain the amortized argument with the accounting (banker's) method.
- Thread-safe version: what needs locking.
