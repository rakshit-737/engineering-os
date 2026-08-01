# Python Stdlib Cheat Sheet — Power Tools

The batteries most people reinstall from PyPI without realizing they're built in.
All snippets runnable on Python 3.10+.

## collections

```python
from collections import Counter, defaultdict, deque

Counter("mississippi").most_common(2)        # [('i', 4), ('s', 4)]
Counter(a=3) - Counter(a=1)                  # Counter({'a': 2}) — multiset arithmetic

groups = defaultdict(list)                   # no KeyError on first append
for word in ["ant", "bee", "ape"]:
    groups[word[0]].append(word)             # {'a': ['ant', 'ape'], 'b': ['bee']}

dq = deque([1, 2, 3], maxlen=3)              # O(1) at both ends; maxlen = rolling window
dq.appendleft(0); dq.append(4)               # deque([1, 2, 4]) — items fall off the far end
```

## itertools

```python
from itertools import chain, combinations, groupby, islice, pairwise, product

list(chain([1, 2], [3, 4]))                  # [1, 2, 3, 4] — flatten one level
list(product("AB", repeat=2))                # AA AB BA BB — nested loops as one
list(combinations([1, 2, 3], 2))             # (1,2) (1,3) (2,3)
list(pairwise([1, 4, 9]))                    # [(1, 4), (4, 9)] — sliding window of 2
list(islice(iter(range(10**9)), 3))          # [0, 1, 2] — slice ANY iterator lazily

# groupby only groups ADJACENT items — sort by the same key first
data = sorted(["ant", "bee", "ape"], key=lambda w: w[0])
{k: list(g) for k, g in groupby(data, key=lambda w: w[0])}   # {'a': [...], 'b': [...]}
```

## functools

```python
from functools import cache, lru_cache, partial, reduce

@cache                                       # unbounded memoization (lru_cache(None))
def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)
fib(80)                                      # instant; fib.cache_info() shows hits

int16 = partial(int, base=16)                # freeze arguments
int16("ff")                                  # 255

reduce(lambda a, b: a | b, [{1}, {2}, {3}])  # {1, 2, 3} — fold a sequence
```

## pathlib

```python
from pathlib import Path

p = Path("data") / "logs" / "app.log"        # / joins paths, cross-platform
p.parent.mkdir(parents=True, exist_ok=True)  # mkdir -p
p.write_text("hello\n"); p.read_text()       # one-line file IO
p.suffix, p.stem, p.name                     # '.log', 'app', 'app.log'
sorted(Path("data").rglob("*.log"))          # recursive glob
p.with_suffix(".bak")                        # data/logs/app.bak
```

## dataclasses

```python
from dataclasses import dataclass, field, asdict

@dataclass(order=True, frozen=True)          # ==, <, hashable, immutable — for free
class Task:
    priority: int
    name: str = "untitled"
    tags: list[str] = field(default_factory=list)   # NEVER a mutable default directly

t = Task(1, "ship", ["dev"])
asdict(t)                                    # {'priority': 1, 'name': 'ship', 'tags': ['dev']}
sorted([Task(2), Task(1)])[0].priority       # 1 — sorts by fields in order
```

## heapq

```python
import heapq

h = [5, 1, 4]; heapq.heapify(h)              # min-heap in-place, O(n)
heapq.heappush(h, 0); heapq.heappop(h)       # 0 — smallest first, O(log n)
heapq.nlargest(2, [3, 1, 4, 1, 5])           # [5, 4] — top-k without full sort
heapq.nsmallest(2, [("b", 2), ("a", 1)], key=lambda t: t[1])   # [('a', 1), ('b', 2)]
# max-heap trick: push (-priority, item), negate on pop
```

## bisect

```python
import bisect

a = [10, 20, 30]
bisect.insort(a, 25)                         # [10, 20, 25, 30] — keep list sorted
bisect.bisect_left(a, 20)                    # 1 — insertion index (== index if present)

grade = lambda s: "FDCBA"[bisect.bisect([60, 70, 80, 90], s)]
grade(72)                                    # 'C' — breakpoint lookup, no if-chain
```

## subprocess

```python
import subprocess

r = subprocess.run(["git", "status", "-s"], capture_output=True, text=True, timeout=30)
r.returncode, r.stdout                       # inspect result yourself
subprocess.run(["pytest", "-x"], check=True) # raises CalledProcessError on non-zero
# Always pass a LIST of args; shell=True + user input = injection bug
```

## json / csv

```python
import json, csv
from pathlib import Path

obj = json.loads('{"a": 1}')                          # str -> dict
Path("out.json").write_text(json.dumps(obj, indent=2, default=str))  # default=str: dates etc.

with open("rows.csv", newline="") as f:               # newline="" always, esp. Windows
    rows = list(csv.DictReader(f))                    # each row is a dict by header

with open("out.csv", "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["name", "score"])
    w.writeheader(); w.writerows([{"name": "ada", "score": 10}])
```

## contextlib

```python
from contextlib import contextmanager, suppress, redirect_stdout
import io, os, time

with suppress(FileNotFoundError):            # cleaner than try/except/pass
    os.remove("maybe-missing.tmp")

@contextmanager
def timed(label):                            # write your own `with` blocks
    t0 = time.perf_counter()
    try: yield
    finally: print(f"{label}: {time.perf_counter() - t0:.3f}s")

with timed("query"): sum(range(10**6))       # query: 0.02Xs

buf = io.StringIO()
with redirect_stdout(buf): print("captured") # buf.getvalue() == "captured\n"
```

## Honorable Mentions (one-liners)

| Need | Stdlib answer |
|---|---|
| Pretty-print nested data | `from pprint import pp; pp(obj)` |
| Deep copy | `import copy; copy.deepcopy(obj)` |
| Temp file/dir that self-cleans | `tempfile.TemporaryDirectory()` |
| Quick HTTP server for a folder | `python -m http.server 8000` |
| Timing a snippet | `python -m timeit "sorted(range(1000))"` |
| Readable enums | `from enum import Enum, auto` |
| Type-checked dict shapes | `from typing import TypedDict` |
| Date arithmetic | `from datetime import date, timedelta` |
