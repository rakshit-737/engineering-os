---
title: Cohesion and Coupling
description: Maximise how strongly a module's elements belong together; minimise how much modules depend on each other's internals.
domain: lld
category: principles
type: concept
difficulty: beginner
status: evergreen
tags: [cohesion, coupling, modularity, design-principles]
prerequisites: [OOP-Concepts]
related: [Single-Responsibility-Principle, Dependency-Inversion-Principle, Facade-Pattern, Observer-Pattern]
order: 7
---

# Cohesion and Coupling

Back to [[LLD-Index]].

## Definition

Introduced by Larry Constantine in structured design (Stevens, Myers, Constantine, "Structured Design", IBM Systems Journal, 1974; Yourdon and Constantine, *Structured Design*, 1979).

- **Cohesion:** the degree to which elements inside a module belong together. Aim high.
- **Coupling:** the degree of interdependence between modules. Aim low.

Classic scales (worst to best):

| Cohesion | Meaning |
|---|---|
| Coincidental | Unrelated things in one module (`Utils`) |
| Logical | Grouped by category, selected by flag (`handle(type)`) |
| Temporal | Grouped because they run at the same time (`init()`) |
| Procedural | Steps of a procedure |
| Communicational | Operate on the same data |
| Sequential | Output of one is input of the next |
| Functional | All parts contribute to one well-defined task |

| Coupling | Meaning |
|---|---|
| Content | One module modifies another's internals |
| Common | Shared global mutable state |
| External | Shared external format/protocol/device |
| Control | Passing flags that steer the other's logic |
| Stamp | Passing a whole structure when only part is used |
| Data | Passing only needed primitive/value data |
| Message | Communicating only via messages/interfaces |

## Violating example

```java
import java.util.ArrayList;
import java.util.List;

class Globals { static List<String> cart = new ArrayList<>(); static double taxRate = 0.18; } // common coupling

class Invoice {
    double total(boolean includeTax, boolean isExport) {   // control coupling
        double sum = Globals.cart.size() * 100.0;
        if (includeTax && !isExport) sum *= (1 + Globals.taxRate);
        return sum;
    }
}

class CartUi {
    void clearAndBill() {
        Globals.cart.clear();                                // reaches into shared state
        System.out.println(new Invoice().total(true, false));
    }
}
```

## Refactored

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

final class Cart {                                   // functional cohesion: owns its data
    private final List<Double> prices = new ArrayList<>();
    void add(double price) { prices.add(price); }
    double subtotal() { return prices.stream().mapToDouble(Double::doubleValue).sum(); }
    List<Double> items() { return Collections.unmodifiableList(prices); }
}

interface TaxPolicy { double apply(double amount); }
class DomesticTax implements TaxPolicy { public double apply(double a) { return a * 1.18; } }
class ExportTax   implements TaxPolicy { public double apply(double a) { return a; } }

class InvoiceCalculator {                            // data coupling via interface
    private final TaxPolicy tax;
    InvoiceCalculator(TaxPolicy tax) { this.tax = tax; }
    double total(double subtotal) { return tax.apply(subtotal); }
}

public class CouplingDemo {
    public static void main(String[] args) {
        Cart cart = new Cart();
        cart.add(100); cart.add(50);
        System.out.println(new InvoiceCalculator(new DomesticTax()).total(cart.subtotal()));
    }
}
```

## Detecting violations in code review

- Low cohesion: `Utils`/`Common`/`Misc` classes; methods using disjoint subsets of fields (LCOM metrics); class described with "and".
- High coupling:
  - Law of Demeter breaks: `order.getCustomer().getAddress().getCity()` ("train wrecks").
  - Boolean/enum flag parameters (control coupling).
  - Mutable statics / singletons used as globals ([[Singleton-Pattern]] misuse).
  - Passing a whole `Order` when the method needs one field (stamp coupling).
  - A small change forcing edits in many modules; circular package dependencies.
  - Tests needing large fixture graphs.

## Tradeoffs and over-application

- Zero coupling is impossible; the aim is coupling to **stable abstractions** ([[Dependency-Inversion-Principle]]).
- Decoupling via events/messages ([[Observer-Pattern]]) lowers static coupling but hides control flow and makes debugging harder.
- Splitting for cohesion increases the number of modules and interfaces; overly fine modules raise coupling between them.
- Some stamp coupling (passing a value object) is fine and more readable than long parameter lists.

## Related patterns

[[Facade-Pattern]] (reduces client coupling to a subsystem), [[Observer-Pattern]], [[Command-Pattern]] (decouples invoker from receiver), [[Dependency-Injection]], [[Single-Responsibility-Principle]], [[Interface-Segregation-Principle]].

## Interview questions

1. **Why high cohesion + low coupling?** Changes stay local, modules are testable and reusable independently.
2. **Relationship with SRP?** SRP is a cohesion principle phrased around actors.
3. **What is the Law of Demeter?** A method should only call methods on itself, its params, objects it creates, and its direct fields — "talk only to friends".
4. **Worst kind of coupling?** Content coupling (modifying another module's internals), then common (global mutable state).
5. **Does microservices guarantee low coupling?** No; shared DBs or chatty synchronous calls create a distributed monolith.
