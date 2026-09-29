---
title: Compilers and Interpreters
description: "How source code becomes execution: lexing, parsing, IR, optimization, codegen, JITs."
domain: cs-core
category: compilers
type: concept
difficulty: intermediate
status: evergreen
tags: [cs-core, compilers]
prerequisites: [Trees-and-BSTs]
related: [Lexing-and-Parsing, Finite-Automata-and-Regular-Languages, Computer-Architecture]
---

# Compilers and Interpreters

Hub: [[CS-Core-Index]] · [[CS-Core-Curriculum]]

## Core Idea

Every language implementation walks the same pipeline — characters to tokens to tree to checked tree to executable form — and the only real difference between "compiled" and "interpreted" is *when* the last step happens: fully ahead of time, at runtime line-by-line, or adaptively while running (JIT). Knowing the pipeline tells you when errors surface, where performance comes from, and what actually ships to users.

## Details

### The Pipeline

1. **Lexing** — raw characters → tokens. `x = y + 42` becomes `IDENT(x) EQUALS IDENT(y) PLUS INT(42)`. Typos like an unterminated string die here.
2. **Parsing** — tokens → **AST** (abstract syntax tree) according to the grammar. `y + 42` becomes a `BinOp(+, Name(y), Num(42))` node. Syntax errors ("unexpected token") die here.
3. **Semantic analysis** — walk the AST with symbol tables: resolve names, check types, verify `y` exists and supports `+`. Statically typed languages catch type errors here, before anything runs.
4. **Codegen / optimization** — AST (usually via an intermediate representation like LLVM IR) → target code: machine code, or bytecode for a VM. Optimizations happen on the IR: constant folding, dead-code elimination, inlining, loop transforms.

```python
import ast
print(ast.dump(ast.parse("x = y + 42")))
# Module(body=[Assign(targets=[Name('x')], value=BinOp(Name('y'), Add(), Constant(42)))])
```

### Compiled vs Interpreted vs JIT

| Strategy | What ships | Example | Character |
|---|---|---|---|
| Ahead-of-time compile | Native machine code | C, C++, Rust, Go | Fastest execution, per-platform builds, all static errors before run |
| Bytecode interpreter | Bytecode run by a VM loop | CPython (`.pyc`) | Portable, quick start, slow loops (dispatch cost per instruction) |
| JIT | Bytecode + machine code generated at runtime for hot paths | JVM (HotSpot), V8, PyPy | Near-native speed after warm-up; can optimize using runtime facts |

- **Python**: source is compiled to bytecode (`.pyc` files, the `dis` module shows it), then a C loop interprets each instruction. "Interpreted" really means "compiled to bytecode, then interpreted".
- **JVM**: javac produces `.class` bytecode; HotSpot interprets first, profiles, then JIT-compiles hot methods — and can even de-optimize if its assumptions break.
- **V8 (JavaScript)**: Ignition interpreter + TurboFan JIT. It speculates on types ("this is always an int"), compiles fast code for that case, and bails out to the interpreter if a different type shows up — which is why type-stable JS is faster.

### Why It Matters Practically

- **Performance**: interpreter dispatch costs ~10-100x on tight loops — why numeric Python delegates to C (NumPy) and why JIT'd Java can rival C after warm-up. JIT adds warm-up latency: bad for CLIs and serverless cold starts, fine for long-running servers.
- **Error timing**: AOT-compiled/statically-typed languages surface type errors at build time; Python raises `NameError`/`TypeError` only when the line executes — so an untested branch can hide a crash. Tests and type checkers (mypy) exist to pull those errors earlier.
- **Portability**: bytecode runs anywhere the VM runs ("write once, run anywhere"); native binaries need one build per OS/architecture. Go cross-compiles to sidestep this; Java ships one jar.

## Interview Angle

- "Is Python compiled or interpreted?" — the trap question. Answer: both — compiled to bytecode, interpreted by the CPython VM; mention `dis.dis()` as proof and you're done.
- "What's a JIT and why is it fast?" — compiles hot code at runtime using observed behavior (real types, real branches) that an AOT compiler can't know; costs warm-up time and memory.
- "Compiler phases?" — name lex → parse → semantic analysis → optimize → codegen, and one error type caught at each phase. That mapping (phase → error class) is what's really being tested.
- "Why is Java 'write once, run anywhere'?" — bytecode targets the JVM, not the hardware; the JVM per platform absorbs the differences.
- Recursion shows up here concretely: parsers and AST walks are recursive by nature — deep expressions can hit recursion limits.

## Roadmap

1. [[Finite-Automata-and-Regular-Languages]] — the theory behind lexers
2. [[Lexing-and-Parsing]] — tokens, context-free grammars, recursive descent, LL vs LR
3. Semantic analysis — symbol tables, scopes, type checking
4. Intermediate representations — ASTs, three-address code, SSA
5. Optimization — constant folding, dead-code elimination, inlining, loop-invariant code motion
6. Code generation — instruction selection, register allocation; see [[Computer-Architecture]]
7. Runtimes — stack frames ([[Recursion-and-Stack-Frames]]), garbage collection, JIT
8. Capstone: arithmetic-expression interpreter, then compile the same AST to stack-machine bytecode

## Key Concepts

Token · lexeme · grammar ambiguity · precedence and associativity · AST vs parse tree · symbol table · SSA · basic block · control-flow graph · register allocation as graph coloring · tail-call optimization

## More Interview Questions (with answers)

- **Parse tree vs AST?** — A parse tree mirrors every grammar rule (parentheses, helper nonterminals); an AST keeps only the semantically relevant structure.
- **Why is left recursion a problem for recursive descent?** — `E -> E + T` makes the parser call itself without consuming input, recursing forever; rewrite as `E -> T ('+' T)*`.
- **What is SSA?** — Static single assignment: each variable is assigned exactly once, with φ-functions at control-flow merges; data flow becomes explicit, which simplifies many optimizations.
- **How does a tracing GC find live objects?** — It starts from roots (stacks, globals, registers) and marks everything reachable; the rest is garbage. Reference counting frees at zero instead but needs extra handling for cycles.

## Coding Exercises

- [ ] Tokenizer for arithmetic with identifiers and numbers
- [ ] Recursive-descent parser producing an AST with correct precedence
- [ ] Tree-walking evaluator, then a constant-folding pass
- [ ] Compile the AST to stack bytecode and write the VM loop
- [ ] Inspect a real pipeline with Python's `ast` and `dis` modules

## Connections

- **System design** — SQL planners, template engines, and rule engines are small compilers; separating parse → validate → execute makes DSLs safe to expose.
- **Cybersecurity** — injection happens when data is parsed as code; parser differentials enable request smuggling; stack canaries and CFI are compiler mitigations; [[Reverse-Engineering-Basics]] starts from compiled output.
- **AI** — ML compilers (XLA, TVM, Triton, `torch.compile`) lower computation graphs to kernels through the same IR → optimize → codegen pipeline; LLM tokenizers are lexers with a learned vocabulary.

## Related

- [[Recursion-and-Stack-Frames]]
- [[Trees-and-BSTs]]
- [[Big-O-Notation]]
- [[Operating-Systems]]
