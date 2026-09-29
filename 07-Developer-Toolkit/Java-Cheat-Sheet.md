---
title: Java Cheat Sheet
description: Java collections and interview essentials (Java 17+).
domain: developer
category: cheat-sheets
type: cheatsheet
difficulty: intermediate
status: evergreen
tags: [java, dsa]
prerequisites: []
related: [Cpp-STL-Cheat-Sheet]
order: 20
---
# Java Cheat Sheet — Collections & Interview Essentials

The patterns you reach for in every DSA problem and code review.
All snippets compile on Java 17+.

## ArrayList — create / iterate / sort

```java
List<Integer> a = new ArrayList<>(List.of(3, 1, 2));  // List.of alone = IMMUTABLE
a.add(5); a.get(0); a.set(0, 9);                      // O(1) get/set, amortized O(1) add
a.remove(Integer.valueOf(5));                          // remove VALUE — a.remove(5) removes INDEX 5

for (int x : a) System.out.println(x);                 // read-only iteration
Collections.sort(a);                                   // in-place ascending
a.sort(Collections.reverseOrder());                    // descending
```

## HashMap patterns

```java
Map<String, Integer> freq = new HashMap<>();

freq.getOrDefault("k", 0);                             // read with fallback, no null check
freq.merge("k", 1, Integer::sum);                      // counter in one line
Map<Character, List<String>> groups = new HashMap<>();
groups.computeIfAbsent(word.charAt(0), c -> new ArrayList<>()).add(word);  // grouping idiom

for (Map.Entry<String, Integer> e : freq.entrySet())   // iterate keys+values together
    System.out.println(e.getKey() + "=" + e.getValue());
```

## PriorityQueue

```java
Queue<Integer> minHeap = new PriorityQueue<>();                     // min-heap by default
Queue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
minHeap.offer(3); minHeap.peek(); minHeap.poll();                   // O(log n) offer/poll

// custom comparator: e.g. int[]{value, index} by value
Queue<int[]> pq = new PriorityQueue<>((x, y) -> x[0] - y[0]);       // overflow risk on extremes
Queue<int[]> safe = new PriorityQueue<>(Comparator.comparingInt(x -> x[0]));  // prefer this
// TRAP: PriorityQueue iteration order is NOT sorted — only poll() gives sorted order
```

## Deque as stack / queue

```java
Deque<Integer> stack = new ArrayDeque<>();             // preferred over legacy Stack class
stack.push(1); stack.peek(); stack.pop();              // LIFO — all at the head

Deque<Integer> queue = new ArrayDeque<>();
queue.offer(1); queue.peek(); queue.poll();            // FIFO — offer tail, poll head
// TRAP: ArrayDeque rejects null elements — use LinkedList if you must store null
```

## String ops

```java
"a,b,,c".split(",");                                   // ["a","b","","c"] — but TRAILING empties dropped
"a.b".split("\\.");                                    // split takes a REGEX — escape . | * +
String.join("-", List.of("a", "b"));                   // "a-b"
s.substring(1, 3); s.charAt(0); s.indexOf("ab");       // substring end index is EXCLUSIVE

// TRAP: s += in a loop is O(n^2) — each += copies the whole string
StringBuilder sb = new StringBuilder();
for (String w : words) sb.append(w).append(",");
sb.setLength(Math.max(0, sb.length() - 1));            // drop trailing separator
String out = sb.reverse().toString();                  // reverse a string via SB

String.format("%5d|%-5s|%.2f", 42, "hi", 3.14159);     // "   42|hi   |3.14"
```

## Arrays

```java
int[] a = {5, 1, 4};
Arrays.sort(a);                                        // primitives: no comparator possible
Integer[] boxed = {5, 1, 4};
Arrays.sort(boxed, Comparator.reverseOrder());         // descending needs boxed type

Arrays.fill(a, -1);                                    // init sentinel values
int[] b = Arrays.copyOf(a, a.length);                  // copy (pads/truncates to new length)
int[] c = Arrays.copyOfRange(a, 1, 3);                 // slice [1, 3)

int[][] grid = new int[rows][cols];                    // zero-filled 2D
for (int[] row : grid) Arrays.fill(row, -1);           // fill 2D
Arrays.toString(a); Arrays.deepToString(grid);         // print 1D / nested arrays
// TRAP: Arrays.equals for 1D, Arrays.deepEquals for 2D — == compares references
```

## Streams essentials

```java
List<Integer> evens = nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .collect(Collectors.toList());                     // or .toList() (immutable, 16+)

Map<Integer, List<String>> byLen = words.stream()
    .collect(Collectors.groupingBy(String::length));   // {3=[ant, bee], 4=[wasp]}

Map<Integer, Long> counts = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));

int sum = nums.stream().mapToInt(Integer::intValue).sum();   // mapToInt avoids boxing
// When NOT to use in interviews: index-based logic, early exit mid-loop, mutating
// state, or hot loops — a plain for-loop is faster to write, debug, and explain.
```

## Comparators

```java
people.sort(Comparator.comparing(Person::age));                    // by one key
people.sort(Comparator.comparing(Person::age).reversed());         // descending
people.sort(Comparator.comparingInt(Person::age)                   // primitive: no boxing
    .thenComparing(Person::name));                                 // tie-break by name
people.sort(Comparator.comparing(Person::name,                     // nulls without NPE
    Comparator.nullsFirst(Comparator.naturalOrder())));
// TRAP: (a, b) -> a.age - b.age overflows for extreme values — use Integer.compare(a.age, b.age)
```

## Fast I/O (competitive)

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
StringTokenizer st = new StringTokenizer(br.readLine());  // faster than String.split
int n = Integer.parseInt(st.nextToken());

StringBuilder out = new StringBuilder();               // buffer ALL output, print once
for (int i = 0; i < n; i++) out.append(i).append('\n');
System.out.print(out);                                 // Scanner + println per line = TLE
```

## Records + var

```java
record Point(int x, int y) {}                          // ctor, equals, hashCode, toString — free
var p = new Point(1, 2);                               // p.x(), p.y() — accessors, no get prefix
record Pair<A, B>(A first, B second) {}                // generic tuple substitute

var list = new ArrayList<String>();                    // var infers LOCAL variable types only
// TRAP: var x = List.of() infers List<Object>; records are shallowly immutable —
// a record holding a List can still have that List mutated.
```

## Common traps

```java
Integer a = 127, b = 127;
boolean same = (a == b);                               // true  — Integer cache [-128, 127]
Integer c = 128, d = 128;
boolean diff = (c == d);                               // false — always .equals() for boxed types

Integer sum = 0;                                       // autoboxing trap: creates an object
for (int i = 0; i < 1_000_000; i++) sum += i;          // per iteration — use int/long for accumulators

for (String s : list)                                  // ConcurrentModificationException:
    if (s.isEmpty()) list.remove(s);                   // never structurally modify while iterating
list.removeIf(String::isEmpty);                        // the safe one-liner
// or: Iterator<String> it = list.iterator(); while (it.hasNext()) if (...) it.remove();
```

| Trap | Symptom | Fix |
|---|---|---|
| `==` on boxed types | Works in [-128, 127], fails outside | `.equals()` / unbox to `int` |
| `list.remove(5)` on `List<Integer>` | Removes index, not value | `remove(Integer.valueOf(5))` |
| `substring` end index | Off-by-one | End is exclusive: `[from, to)` |
| Subtraction comparator | Wrong order on overflow | `Integer.compare` / `comparingInt` |
| `Arrays.asList(arr)` on `int[]` | One-element `List<int[]>` | Box first, or stream `boxed()` |
| Modifying `List.of(...)` result | `UnsupportedOperationException` | Wrap: `new ArrayList<>(List.of(...))` |
