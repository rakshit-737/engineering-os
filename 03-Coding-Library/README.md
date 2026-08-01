# Coding Library

Reusable algorithm implementations in three languages, all dependency-free, all with self-contained test suites and complexity + interview notes on every function.

| Language | Location | Tests | Run |
|----------|----------|------:|-----|
| Python | `python/` | 135 | `python -m unittest discover -s tests` |
| Java | `java/` | 111 | `javac -d out src/*.java tests/*.java && java -cp out TestRunner` |
| C++ | `cpp/` | 116 | `g++ -std=c++17 -Wall -Wextra -O2 tests/test_main.cpp -I include -o test_main && ./test_main` |

## Why three languages

- **Python** — the drill language: fastest to write, used for interview practice and the widest module set (includes `security_utils.py` defensive crypto)
- **Java** — campus placements and enterprise interviews; language-specific idioms included (LinkedHashMap LRU, Collections framework usage)
- **C++** — competitive programming and systems roles; STL idioms included (list+map LRU, iterator-stability notes)

## Shared design principles

- Zero external dependencies — stdlib/STL only, no test framework
- Every public function: Time/Space complexity + one interview note
- Edge cases tested: empty input, single element, duplicates, eviction order
- Same core set across languages (sorting, searching, graphs, data structures, DP, strings) so you can port knowledge between them

## Language study companions

- Vault notes: `../01-Obsidian-Vault/40-Interview-Prep/` — OOP-Concepts, Java-Interview-Essentials, Cpp-Interview-Essentials
- Cheat sheets: `../07-Developer-Toolkit/` — Python-Stdlib, Java, Cpp-STL

## Extend

1. Pick the language directory, follow its README structure
2. Complexity + interview note on every new function
3. Add tests to its harness — keep all three suites green
