---
title: Java Interview Essentials
description: JVM, Strings, equality, Collections, exceptions and threading answers for Java interview rounds.
domain: dsa
category: language-essentials
type: cheatsheet
difficulty: beginner
status: evergreen
tags: [java, interview]
prerequisites: []
related: [Cpp-Interview-Essentials, java-library, Java-Cheat-Sheet]
---

# Java Interview Essentials

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

Campus Java rounds cycle through the same clusters: platform (JVM/JRE/JDK, memory, GC), Strings (immutability, pool), equality (`==` vs `equals`, hashCode contract), Collections (which structure, what complexity), exceptions, and threading basics. Depth expected is one crisp paragraph per topic plus one "gotcha" you can explain — the HashMap-key bug is the canonical one.

## Details

**JVM vs JRE vs JDK:** JVM executes bytecode (per-platform — this is "write once, run anywhere"); JRE = JVM + core libraries, enough to *run* Java; JDK = JRE + compiler (`javac`) and tools, needed to *develop*. JDK ⊃ JRE ⊃ JVM.

**Memory areas:** **Heap** — all objects and arrays; shared across threads; GC-managed. **Stack** — one per thread; frames hold locals and references; overflow = infinite recursion. **Metaspace** — class metadata (replaced PermGen in Java 8; grows in native memory). Static fields and the string pool live on the heap, not metaspace.

**GC in a paragraph:** the JVM reclaims objects unreachable from GC roots (thread stacks, statics). Heap is generational — most objects die young, so cheap frequent minor GCs sweep the young generation and survivors are promoted to the old generation, collected rarely (major GC). Modern collectors (G1, ZGC) do most work concurrently to shrink pauses. You cannot force GC — `System.gc()` is only a hint.

**String immutability:** `String` cannot change after construction; every "modification" returns a new object. Enables the **string pool** (literals with equal value share one interned object), safe HashMap keys (hashCode cached), thread safety, and security (a path/URL can't mutate after validation). `String` is declared `final` so no subclass can override methods and sneak in mutability, which would break all of the above. Heavy concatenation in loops → use `StringBuilder` (O(n) vs O(n²)).

**`==` vs `equals`:** `==` compares references (same object?); `equals` compares logical value when overridden.

```java
String a = "hi", b = "hi";            // both point at the pooled literal
System.out.println(a == b);           // true — same interned object
System.out.println(a == new String("hi")); // false — new heap object
System.out.println(a.equals(new String("hi"))); // true — value comparison
```

**Contract:** if you override `equals` you MUST override `hashCode` so equal objects share a hash. **The HashMap-key bug story:**

```java
class Point {
    final int x, y;
    Point(int x, int y) { this.x = x; this.y = y; }
    @Override public boolean equals(Object o) {          // hashCode NOT overridden!
        return o instanceof Point p && p.x == x && p.y == y;
    }
}
Map<Point, String> map = new HashMap<>();
map.put(new Point(1, 2), "v");
map.get(new Point(1, 2));             // null! default hashCode → wrong bucket
```

Equal keys hash to different buckets, so `get` never finds the entry. The same corruption occurs if a key mutates after insertion — it now sits in a bucket that no longer matches its hash. Moral: keys must be immutable with consistent `equals`/`hashCode`.

**Collections framework:**

| Collection | Backing structure | Key complexities |
|---|---|---|
| `ArrayList` | resizable array | get O(1); add amortized O(1); insert/remove middle O(n) |
| `LinkedList` | doubly linked list | add/remove at ends O(1); get(i) O(n) |
| `HashMap` | array of buckets (list → red-black tree past 8) | put/get/remove avg O(1), worst O(log n); no order |
| `TreeMap` | red-black tree | put/get O(log n); sorted keys, floor/ceiling ops |
| `HashSet` | HashMap under the hood | add/contains avg O(1); no order |
| `PriorityQueue` | binary heap | peek O(1); offer/poll O(log n) — see [[Heap-Pattern]] |

**ArrayList vs array:** array is fixed-size, holds primitives directly, `.length`; `ArrayList` grows dynamically (~1.5x on overflow), objects only (autoboxing for primitives), rich API (`add/remove/contains`), works with generics and Collections utilities.

**Checked vs unchecked exceptions:** checked (`IOException`, `SQLException`) extend `Exception` outside the `RuntimeException` branch — recoverable external failures; compiler forces catch-or-declare. Unchecked (`NullPointerException`, `ArrayIndexOutOfBoundsException`) extend `RuntimeException` — programming bugs; no handling forced, fix the code. `Error` (`OutOfMemoryError`) — don't catch.

**final / finally / finalize:** `final` — keyword: variable unreassignable, method un-overridable, class unextendable. `finally` — try/catch block that runs regardless (cleanup; superseded by try-with-resources). `finalize()` — pre-GC hook, unreliable and deprecated. Same spelling, zero relation — say that up front.

**Threads basics:** implement `Runnable` (or `Callable`) over extending `Thread` — it separates task from runner, leaves your one `extends` slot free, and pools (`ExecutorService`) accept it. `start()` spawns the thread; calling `run()` directly is just a plain method call on the current thread. **`synchronized` in a paragraph:** marks a block/method so only one thread at a time may hold the object's intrinsic lock, making check-then-act sequences like `count++` atomic and (equally important) guaranteeing visibility of writes to the next lock holder; too coarse a lock serializes everything, so keep critical sections minimal or use `java.util.concurrent` (AtomicInteger, ConcurrentHashMap).

## Interview Angle

Rapid-fire with expected answers:
- Is Java pass-by-value or pass-by-reference? — Always pass-by-value; for objects the *reference* is copied.
- Can `main` be non-static? — No; JVM calls it without creating an instance.
- `String s = new String("x")` — how many objects? — Up to two: pooled `"x"` plus the heap copy.
- StringBuilder vs StringBuffer? — Same API; Buffer is synchronized (legacy), Builder is faster.
- HashMap vs Hashtable? — Hashtable is legacy synchronized, no null keys; use HashMap or ConcurrentHashMap.
- Why is `wait()` on Object, not Thread? — Waiting is tied to the monitor lock, which every object owns.
- Can we override `main` or a `static` method? — Overload yes, override no (hiding).
- Interface vs abstract class post-Java 8? — Interfaces gained `default` methods; still no instance state or constructors (see [[OOP-Concepts]]).
- What breaks if `hashCode` is inconsistent with `equals`? — Hash collections silently lose keys (bug story above — tell it).

## Related

- [[OOP-Concepts]]
- [[Cpp-Interview-Essentials]]
- [[Heap-Pattern]]
