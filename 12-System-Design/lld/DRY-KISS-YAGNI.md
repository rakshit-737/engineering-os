---
title: DRY, KISS, YAGNI
description: Three counterweight heuristics — avoid duplicated knowledge, keep designs simple, and don't build speculative features.
domain: lld
category: principles
type: concept
difficulty: beginner
status: evergreen
tags: [dry, kiss, yagni, design-principles, refactoring]
prerequisites: [OOP-Concepts]
related: [Single-Responsibility-Principle, Open-Closed-Principle, Template-Method-Pattern, Cohesion-and-Coupling]
order: 6
---

# DRY, KISS, YAGNI

Back to [[LLD-Index]].

## Definitions

- **DRY — Don't Repeat Yourself.** Andy Hunt and Dave Thomas, *The Pragmatic Programmer* (1999): "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system." It is about **knowledge**, not identical-looking text.
- **KISS — Keep It Simple, Stupid.** Attributed to Kelly Johnson (Lockheed Skunk Works, 1960). Prefer the simplest design that meets current requirements.
- **YAGNI — You Aren't Gonna Need It.** From Extreme Programming (Ron Jeffries, Kent Beck, late 1990s). Don't implement functionality until it is actually needed.

These act as brakes on SOLID over-engineering: SOLID adds seams, YAGNI/KISS ask whether a seam is paying for itself.

## Violating example

DRY violation (a business rule in two places) plus YAGNI/KISS violation (a speculative plugin framework).

```java
import java.util.HashMap;
import java.util.Map;

class SignupController {
    boolean valid(String email) { return email != null && email.contains("@") && email.length() <= 254; }
}
class ProfileController {
    boolean valid(String email) { return email != null && email.contains("@"); } // drifted copy
}

// Speculative: nobody asked for pluggable formatters or runtime registration.
interface TaxFormatterPlugin { String format(double v); }
class TaxFormatterRegistry {
    private final Map<String, TaxFormatterPlugin> plugins = new HashMap<>();
    void register(String k, TaxFormatterPlugin p) { plugins.put(k, p); }
    String format(String k, double v) { return plugins.get(k).format(v); }
}
```

## Refactored

```java
final class Email {
    private static final int MAX = 254;
    private final String value;
    private Email(String value) { this.value = value; }
    static Email parse(String raw) {
        if (raw == null || !raw.contains("@") || raw.length() > MAX)
            throw new IllegalArgumentException("invalid email");
        return new Email(raw);
    }
    String value() { return value; }
}

class SignupController  { Email read(String raw) { return Email.parse(raw); } }
class ProfileController { Email read(String raw) { return Email.parse(raw); } }

final class Tax {
    static String format(double v) { return String.format("%.2f", v); } // simplest thing that works
}

public class DryDemo {
    public static void main(String[] args) {
        System.out.println(new SignupController().read("a@b.com").value() + " " + Tax.format(3.14159));
    }
}
```

The email rule now lives in one value object; the plugin registry is gone until a second formatter is actually required.

## Detecting violations in code review

**DRY**
- The same constant, regex, or validation rule in multiple files.
- Bug fixes that must be applied in N places ("shotgun surgery").
- Schema duplicated in code, SQL and docs without generation.

**KISS**
- Generic type parameters, reflection, or metaprogramming for a single use case.
- Abstract base classes with one subclass; interfaces with one impl and no test seam.
- Clever one-liners that need a comment to explain.

**YAGNI**
- Config flags, extension points, or parameters no caller uses.
- "We might need multi-tenant / multi-DB later" without a ticket.
- Dead code paths kept "for the future".

## Tradeoffs and over-application

- **Wrong DRY** couples code that is only coincidentally similar; when the two diverge you get flag parameters. Sandi Metz: "duplication is far cheaper than the wrong abstraction." Rule of three: abstract on the third occurrence.
- DRY across service boundaries creates shared libraries that couple deploys; some duplication between services is intentional.
- YAGNI does not apply to things that are expensive to retrofit: security, data model identity, API versioning, observability hooks.
- KISS is relative to the team; "simple" means fewer concepts, not fewer lines.

## Related patterns

[[Template-Method-Pattern]] (remove duplicated algorithm skeletons), [[Strategy-Pattern]], [[Builder-Pattern]] (vs telescoping constructors), [[Open-Closed-Principle]] (tension with YAGNI), [[Single-Responsibility-Principle]].

## Interview questions

1. **Is duplicated code always a DRY violation?** No. DRY targets duplicated knowledge; two identical snippets that change for different reasons should stay separate.
2. **How do YAGNI and OCP conflict?** OCP suggests extension points; YAGNI says add them only when a real second variant arrives. Refactor toward OCP on demand.
3. **When would you ignore YAGNI?** For hard-to-change decisions: security, data migrations, public API contracts.
4. **What is the rule of three?** Tolerate duplication twice; extract an abstraction on the third instance once the shape is clear.
5. **Example of KISS in LLD interviews?** Use a `HashMap` + doubly linked list for an LRU cache rather than a pluggable eviction framework unless asked ([[LRU-Cache-LLD]]).
