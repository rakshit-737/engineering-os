# C++ STL Cheat Sheet — Containers & Algorithms

The STL you actually use in contests and interviews.
All snippets compile with C++17 (`-std=c++17`).

## Container quick reference

| Container | Use when | Key ops | Complexity |
|---|---|---|---|
| `vector` | Default sequence | `push_back`, `[]`, `back` | O(1) amortized append |
| `deque` | Push/pop both ends | `push_front/back`, `[]` | O(1) both ends |
| `map` / `set` | Sorted keys, order queries | `lower_bound`, `insert`, `erase` | O(log n) |
| `unordered_map/set` | Fast lookup, no order | `[]`, `count`, `find` | O(1) avg, O(n) worst |
| `priority_queue` | Repeated max/min | `push`, `top`, `pop` | O(log n) push/pop, O(1) top |
| `stack` / `queue` | LIFO / FIFO only | `push`, `top`/`front`, `pop` | O(1) |
| `multiset` | Sorted with duplicates | `insert`, `erase(it)`, `*begin` | O(log n) insert; erase(it) amortized O(1) |

## vector idioms

```cpp
vector<int> v = {3, 1, 4};
v.reserve(1'000'000);                          // pre-allocate: LATER push_backs won't reallocate
                                               // (reserve itself invalidates if it grows capacity)

v.erase(remove(v.begin(), v.end(), 3), v.end());          // erase-remove: delete all 3s, O(n)
v.erase(remove_if(v.begin(), v.end(),                     // delete by predicate
        [](int x) { return x % 2 == 0; }), v.end());

vector<vector<int>> grid(rows, vector<int>(cols, 0));     // 2D init, zero-filled
vector<int> pre(n + 1, 0);                                // prefix-sum sized n+1
// TRAP: vector<bool> is a bitset in disguise — no real references; use vector<char> for flags
```

## string ops

```cpp
string s = "hello,world";
s.substr(6);  s.substr(0, 5);                  // "world", "hello" — (pos, LENGTH not end)
if (s.find("world") != string::npos) {}        // find returns npos, not -1 (compare to npos!)

stringstream ss(s);  string tok;               // split on a delimiter
while (getline(ss, tok, ',')) parts.push_back(tok);

to_string(42);  stoi("42");  stoll("9000000000000000000");  // stoll for long long
// TRAP: stoi throws std::invalid_argument on garbage, std::out_of_range past INT_MAX
s += 'x';                                       // O(1) amortized — unlike Java, += is fine
```

## map / set patterns

```cpp
map<string, int> m;
for (auto& [key, val] : m) val++;              // structured bindings; & to mutate values

if (m.count("k")) {}                           // existence only — but does the lookup twice if
auto it = m.find("k");                         // you then access; find once, reuse the iterator
if (it != m.end()) use(it->second);

set<int> s = {10, 20, 30};
auto lo = s.lower_bound(15);                   // first >= 15 → 20; upper_bound: first > x
// TRAP: use the MEMBER s.lower_bound(x), never std::lower_bound(s.begin(), s.end(), x)
// — the free function is O(n) on set iterators, the member is O(log n)
if (lo != s.begin()) --lo;                     // largest element < 15 → 10
```

## <algorithm> essentials

```cpp
sort(v.begin(), v.end());                                  // ascending
sort(v.begin(), v.end(), greater<int>());                  // descending
vector<pair<int, int>> vp;                                 // custom comparator: MUST be strict <
sort(vp.begin(), vp.end(), [](auto& a, auto& b) {
    return a.second < b.second; });                        // <= gives UB/crashes

auto mx = *max_element(v.begin(), v.end());                // deref! returns an iterator
long long total = accumulate(v.begin(), v.end(), 0LL);     // 0LL or the sum overflows as int

sort(v.begin(), v.end());                                  // unique needs sorted input,
v.erase(unique(v.begin(), v.end()), v.end());              // then erase — dedupe idiom

// binary search family (sorted range): bool / first >= x / first > x
binary_search(v.begin(), v.end(), 7);
int idx = lower_bound(v.begin(), v.end(), 7) - v.begin();  // index of first >= 7
int cnt = upper_bound(v.begin(), v.end(), 7)
        - lower_bound(v.begin(), v.end(), 7);              // occurrences of 7
reverse(v.begin(), v.end());  next_permutation(v.begin(), v.end());
```

## priority_queue

```cpp
priority_queue<int> maxHeap;                               // MAX-heap by default (unlike Java)
priority_queue<int, vector<int>, greater<int>> minHeap;    // min-heap
maxHeap.push(3); maxHeap.top(); maxHeap.pop();             // pop() returns void — top() first

using P = pair<int, int>;                                  // {dist, node} — pairs compare
priority_queue<P, vector<P>, greater<P>> dijkstra;         // by .first then .second

auto cmp = [](const P& a, const P& b) { return a.second > b.second; };
priority_queue<P, vector<P>, decltype(cmp)> pq(cmp);       // custom: comparator in the TYPE
// Mnemonic: comparator returns true when a is WORSE (further from the top) than b
```

## pairs / tuples / structured bindings

```cpp
pair<int, string> p = {1, "one"};              // or make_pair; compares first, then second
auto [num, name] = p;                          // unpack — copies unless auto&

tuple<int, int, int> t{1, 2, 3};
auto [a, b, c] = t;                            // get<0>(t) also works
vector<pair<int, int>> edges = {{1, 2}, {3, 4}};
for (auto& [u, w] : edges) {}                  // clean iteration everywhere
tie(a, b) = minmax(x, y);                      // assign into existing variables
```

## Lambda captures

| Capture | Meaning | Use for |
|---|---|---|
| `[]` | Nothing | Pure comparators |
| `[=]` | Everything by copy | Small reads; copies are silent |
| `[&]` | Everything by reference | Local helpers, DFS recursion |
| `[x, &y]` | `x` copy, `y` ref | Being explicit |
| `[&](int u, auto&& self) -> void` | Recursive lambda | `self(v, self)` — pre-C++23 pattern |

## Fast I/O

```cpp
int main() {
    ios_base::sync_with_stdio(false);          // detach from C stdio — big speedup
    cin.tie(nullptr);                          // don't flush cout before each cin
    // TRAP: after this, NEVER mix scanf/printf with cin/cout — output interleaves wrong
    int n;  cin >> n;                          // '\n' is skipped by >> but NOT by getline
    cin.ignore();                              // needed before getline after a >> read
}
```

## Common traps

```cpp
for (auto it = v.begin(); it != v.end(); )     // iterator invalidation: erase returns
    it = (*it % 2 == 0) ? v.erase(it) : it + 1;    // the NEXT valid iterator — use it
// push_back can invalidate ALL iterators/pointers into a vector (reallocation)

map<string, int> m;
if (m["missing"] == 0) {}                      // TRAP: operator[] INSERTED {"missing", 0}
m.at("missing");                               // at() throws instead; count/find never insert

for (int i = 0; i <= v.size() - 1; i++) {}     // TRAP: empty vector → size()-1 wraps to 2^64-1
for (int i = 0; i < (int)v.size(); i++) {}     // cast, or compare i < v.size() with i unsigned
```

| Trap | Symptom | Fix |
|---|---|---|
| `v.size() - k` underflow | Huge unsigned number, crash | Cast: `(int)v.size() - k` |
| `map::operator[]` on read | Phantom zero entries appear | `count` / `find` / `at` |
| Erase while iterating | Crash or skipped elements | `it = c.erase(it)` pattern |
| `<=` in sort comparator | Random crashes (UB) | Strict weak ordering: `<` only |
| `accumulate(..., 0)` | Silent int overflow | Init with `0LL` |
| `getline` after `cin >>` | Reads empty line | `cin.ignore()` first |
| INT_MIN/INT_MAX arithmetic | Overflow UB | `long long` for sums/products |
