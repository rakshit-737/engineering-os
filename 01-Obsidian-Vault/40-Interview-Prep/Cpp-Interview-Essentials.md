---
title: C++ Interview Essentials
description: RAII, ownership, smart pointers, move semantics and STL answers for C++ interview rounds.
domain: dsa
category: language-essentials
type: cheatsheet
difficulty: intermediate
status: evergreen
tags: [cpp, interview]
prerequisites: []
related: [Java-Interview-Essentials, cpp-library, Cpp-STL-Cheat-Sheet]
---

# Cpp Interview Essentials

Hub: [[Interview-Prep-Index]] | Roadmap: [[DSA-Index]]

## Core Idea

C++ interviews probe whether you understand *ownership*. RAII is THE C++ idea: a resource (memory, file, lock) is acquired in a constructor and released in a destructor, so cleanup rides on scope exit — deterministically, even during exceptions. Smart pointers, `std::lock_guard`, `std::vector` are all RAII. Everything else (stack vs heap, move semantics, virtual destructors) hangs off this one concept.

## Details

**Stack vs heap allocation:** stack — automatic locals; allocation is a pointer bump, freed at scope exit, fast, size-limited (~1–8 MB). Heap — `new`/`malloc`; survives scope, sized at runtime, slower, and *you* own the release. Default to stack objects and let containers/smart pointers own any heap they need — that's RAII in practice.

**Pointers vs references:**

| | Pointer | Reference |
|---|---|---|
| Can be null | yes | no — must bind at initialization |
| Reseatable | yes (`p = &other`) | no — bound for life |
| Arithmetic | yes | no |
| Syntax | `*p`, `p->m` | plain `r.m` — alias for the object |
| Use | optional/reseat/arrays | function params, avoiding copies |

**new/delete vs smart pointers:** raw `new`/`delete` leaks on any early return or thrown exception between them; smart pointers put the `delete` in a destructor (RAII). **`unique_ptr`** — sole ownership, zero overhead, movable not copyable; the default choice (`std::make_unique`). **`shared_ptr`** — reference-counted shared ownership; costlier (atomic count in a control block); use only when lifetime is genuinely shared. **`weak_ptr`** — non-owning observer of a `shared_ptr`; breaks reference cycles (parent↔child both `shared_ptr` = leak; make the back-edge weak) and must `lock()` before use.

**Copy vs move in a paragraph:** copying duplicates resources (deep copy of a vector's buffer — O(n)); moving *steals* them — the move constructor takes the source's internal pointer and leaves the source empty-but-valid, O(1). `std::move(x)` performs no move itself: it merely casts `x` to an rvalue reference, i.e. a label saying "I no longer need this — feel free to pillage." Overload resolution then picks the move constructor/assignment. Don't use a moved-from object except to assign or destroy it.

**Virtual functions and the vtable:** `virtual` enables runtime dispatch — a call through a base pointer runs the derived override. Mechanism: each polymorphic class has a static vtable (array of function pointers); each object carries a hidden vptr to it; a virtual call is an indirect jump through the vptr (small cost, blocks inlining). **Virtual destructors:** `delete basePtr` where the object is Derived and Base's destructor is non-virtual is undefined behavior — Derived's destructor never runs, its members leak. Rule: any class meant for polymorphic deletion needs `virtual ~Base()`.

**STL container complexities:**

| Container | Structure | Access | Insert/erase | Find |
|---|---|---|---|---|
| `vector` | contiguous array | O(1) | back amortized O(1); middle O(n) | O(n) |
| `deque` | chunked blocks | O(1) | both ends amortized O(1) | O(n) |
| `list` | doubly linked | O(n) | O(1) at a known iterator | O(n) |
| `map` / `set` | red-black tree | — | O(log n) | O(log n), sorted order |
| `unordered_map` | hash table | — | avg O(1), worst O(n) | avg O(1) |

**Iterator invalidation rules:**

| Container | Insert invalidates | Erase invalidates |
|---|---|---|
| `vector` | ALL iterators/pointers if capacity grows (reallocation); else those at/after the point | at/after the erased element |
| `deque` | ALL iterators, even for end inserts; references survive end inserts only | all (middle); front/back erase: only the erased element |
| `list` | nothing | only the erased iterator |
| `map`/`set` | nothing | only the erased iterator |
| `unordered_map` | all iterators on rehash; references survive | only the erased iterator |

The trap: holding `it`/`&v[0]` across `push_back`, or `v.erase(it)` inside a loop without `it = v.erase(it)`.

**Const correctness:** `const` is a compiler-checked promise. Read pointer declarations right-to-left: `const int* p` — pointee immutable; `int* const p` — pointer immutable. `void f(const std::string& s)` — no-copy and no-modify, the default for in-params. A `const` member function (`int size() const`) may be called on const objects and cannot mutate members. Const-correctness is viral — one missing `const` propagates outward, so get it right from the start.

## Interview Angle

Rapid-fire with expected answers:
- What is RAII? — Resource lifetime tied to object scope: constructor acquires, destructor releases; exception-safe by construction. Lead with this term whenever memory comes up.
- `delete` vs `delete[]`? — Array `new[]` must pair with `delete[]`, else undefined behavior.
- struct vs class? — Only default access/inheritance: struct public, class private.
- Can constructors be virtual? Destructors? — Constructors no (no object/vptr yet); destructors yes and should be in polymorphic bases.
- What happens calling a virtual function in a constructor? — Base's version runs; the derived part doesn't exist yet.
- `vector::reserve` vs `resize`? — reserve changes capacity only; resize changes size (constructs elements).
- Dangling pointer vs memory leak? — Pointer to freed memory vs memory with no pointer; smart pointers prevent both.
- Why prefer `++it` over `it++` for iterators? — Post-increment copies the old iterator; pre-increment doesn't.
- References vs pointers — when must it be a pointer? — Nullability, reseating, or arithmetic; otherwise take a reference.
- Java folks: contrast with GC — C++ destruction is deterministic at scope exit, which is why RAII can manage files/locks, not just memory (see [[Java-Interview-Essentials]]).

## Related

- [[OOP-Concepts]]
- [[Java-Interview-Essentials]]
- [[System-Design-Basics]]
