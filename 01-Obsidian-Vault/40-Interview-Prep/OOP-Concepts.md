---
tags: [concept, interview]
created: 2026-08-02
status: evergreen
---

# OOP Concepts

Hub: [[Interview-Prep-Index]]

## Core Idea

OOP models a program as objects that own state and expose behavior. Four pillars: **encapsulation** (guard state behind methods), **abstraction** (expose what, hide how), **inheritance** (reuse via is-a), **polymorphism** (one call, many behaviors). Campus interviews test each definition + a tiny example, then one design-judgment question (usually composition vs inheritance or the diamond problem).

## Details

**Encapsulation** — bundle data with the methods that operate on it; block direct access. One-liner: "private fields + public methods, so class invariants can't be broken from outside."

```java
class Account {
    private double balance;                        // hidden state
    public void deposit(double amt) { if (amt > 0) balance += amt; }
}
```

**Abstraction** — expose essential behavior, hide implementation. One-liner: "the caller sees *what* it does, never *how*." Delivered via `abstract` classes and interfaces.

```java
interface Payment { void pay(double amt); }        // caller never sees UPI/card internals
```

**Inheritance** — subclass acquires superclass members (is-a). One-liner: "code reuse plus substitutability — a `Dog` stands wherever an `Animal` is expected."

```java
class Animal { void eat() {} }
class Dog extends Animal { void bark() {} }        // Dog is-a Animal
```

**Polymorphism** — the same call behaves per the actual object. One-liner: "one interface, many forms — the JVM picks the override at runtime (dynamic dispatch)."

```java
class Cat extends Animal { @Override void eat() { System.out.println("fish"); } }

Animal a = new Cat();
a.eat();            // Cat's override runs, chosen by object type, not reference type
```

**Compile-time vs runtime polymorphism:**

| | Overloading (compile-time) | Overriding (runtime) |
|---|---|---|
| What | Same name, different parameter list | Subclass redefines identical signature |
| Resolved by | Compiler, via reference/static types | JVM, via actual object type |
| Return type | May differ freely | Same or covariant only |
| `static` / `private` / `final` | Can be overloaded | Cannot be overridden (`static` is hidden, not overridden) |
| Marker | none | `@Override` — catches signature typos at compile time |

**Abstract class vs interface (decision table):**

| Choose on | Abstract class | Interface |
|---|---|---|
| Relationship | is-a with shared state/code | capability contract ("can-do") |
| Fields | instance state allowed | only `public static final` constants |
| Constructors | yes | no |
| Multiple inheritance | no — single `extends` | yes — implement many |
| Methods | any mix of concrete/abstract | abstract + `default`/`static` (Java 8+), `private` (9+) |

Post-Java-8 nuance: `default` methods mean "interfaces can't have code" is now wrong — the surviving real differences are **per-instance state and constructors**, which interfaces still lack.

**Composition over inheritance** — prefer has-a:

```java
// BAD: class Stack<T> extends ArrayList<T>  → inherits get(i)/add(i,e), breaks the stack contract
class Stack<T> {                                   // GOOD: Stack HAS a list
    private final List<T> items = new ArrayList<>();
    public void push(T t) { items.add(t); }
    public T pop() { return items.remove(items.size() - 1); }
}
```

Composition exposes only the intended API, allows swapping implementations, and dodges fragile-base-class breakage. Inherit only for a true is-a that honors substitutability.

**SOLID in five one-liners:**
- **S**ingle Responsibility — a class has exactly one reason to change.
- **O**pen/Closed — open for extension, closed for modification: add subclasses/strategies, don't edit working code.
- **L**iskov Substitution — a subclass must work wherever its parent does, no surprises.
- **I**nterface Segregation — many small interfaces beat one fat one; never force unused methods.
- **D**ependency Inversion — depend on abstractions, not concrete classes; inject dependencies.

## Interview Angle

- **Diamond problem:** D inherits B and C, both inheriting A — whose A does D get? **C++** permits multiple class inheritance and fixes the ambiguity with `virtual` inheritance (one shared A subobject). **Java** bans multiple class inheritance outright; the diamond reappears only when two interfaces supply the same `default` method — the compiler then forces D to override it (it may delegate with `B.super.method()`).
- **is-a vs has-a:** is-a → inheritance (`Dog extends Animal`); has-a → composition (`Car` has an `Engine`). If X can't honor every promise of Y, it isn't is-a — use has-a.
- Square-extends-Rectangle is the stock LSP violation: `setWidth` on a Square breaks Rectangle's independent-sides contract.
- Rapid-fire: override a `static` method? (No — method hiding.) Override a constructor? (No — not inherited.) Private methods polymorphic? (No — statically bound.) Why `@Override`? (Turns a silent overload into a compile error.)
- Score differentiation comes from tying each pillar to your own project ("I encapsulated X because...") — bare definitions are table stakes.

## Related

- [[Java-Interview-Essentials]]
- [[Cpp-Interview-Essentials]]
- [[System-Design-Basics]]
