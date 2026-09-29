---
title: Python for ML
description: NumPy vectorization, broadcasting, views vs copies, and the Pandas pitfalls that silently corrupt ML datasets.
domain: ai
category: foundations
type: concept
difficulty: beginner
status: evergreen
tags: [python, numpy, pandas, data-wrangling]
prerequisites: [Python-Stdlib-Cheat-Sheet]
related: [Linear-Algebra-for-ML, Feature-Engineering, Cross-Validation-and-Model-Selection]
order: 1
---

# Python for ML

Hub: [[AI-Engineering-Index]]

## Core Idea

Most ML bugs are data bugs, and most data bugs in Python come from a handful of NumPy/Pandas semantics: loops instead of vectorized ops, accidental broadcasting, mutating a view you thought was a copy, chained assignment, silent dtype upcasts, and joins that multiply rows. Know these mechanics and you avoid a large class of silent errors.

## NumPy Vectorization

Python loops execute one interpreter step per element. NumPy ufuncs run a compiled loop over contiguous memory.

```python
import numpy as np

x = np.random.rand(1_000_000)

# Slow: interpreter loop
out = np.empty_like(x)
for i in range(len(x)):
    out[i] = x[i] * 2 + 1

# Fast: vectorized
out = x * 2 + 1

# Conditional logic without loops
y = np.where(x > 0.5, 1.0, 0.0)

# Reductions along axes
M = np.random.rand(100, 5)
col_means = M.mean(axis=0)   # shape (5,)
row_sums = M.sum(axis=1)     # shape (100,)
```

Rules of thumb:
- Replace `for` loops with ufuncs, `np.where`, boolean masks, `np.einsum`, or matrix products.
- `np.vectorize` is a convenience wrapper, not a speedup.
- Preallocate arrays instead of repeatedly calling `np.append` (it copies each time).

## Broadcasting

Two shapes are compatible when, aligned from the right, each dimension is equal or one of them is 1.

```python
X = np.random.rand(100, 3)       # (100, 3)
mu = X.mean(axis=0)              # (3,)
Xc = X - mu                      # (100,3) - (3,) -> OK, per-column centering

row_mean = X.mean(axis=1)        # (100,)
# X - row_mean                   # ERROR: (100,3) vs (100,)
Xr = X - row_mean[:, None]       # (100,1) broadcasts across columns
Xr = X - X.mean(axis=1, keepdims=True)  # cleaner

# Pairwise squared distances, no loops
A = np.random.rand(50, 3); B = np.random.rand(40, 3)
D2 = ((A[:, None, :] - B[None, :, :]) ** 2).sum(-1)  # (50, 40)
```

The dangerous case is broadcasting that *succeeds* but is wrong:

```python
y_true = np.array([1, 0, 1])          # (3,)
y_pred = np.array([[1], [0], [1]])    # (3,1), e.g. model.predict output
err = y_true - y_pred                 # (3,3) -- silently wrong!
assert (y_true - y_pred.ravel()).shape == (3,)
```

Always check shapes of targets vs predictions; `(n,)` vs `(n,1)` is a classic loss bug.

## Views vs Copies

| Operation | Result |
|---|---|
| Basic slicing `a[1:5]`, `a[:, 0]`, `a.T`, `reshape` (when possible) | view (shares memory) |
| Fancy indexing `a[[0, 2]]`, boolean mask `a[a > 0]` | copy |
| `a.copy()` | copy |

```python
a = np.arange(10)
v = a[2:5]
v[:] = 0          # modifies a!
print(a)          # [0 1 0 0 0 5 6 7 8 9]

m = a[a > 5]
m[:] = -1         # does NOT modify a
print(np.shares_memory(a, v), np.shares_memory(a, m))  # True False
```

Production implication: a function that normalizes a slice in place can corrupt the caller's training array. Copy at API boundaries, or document in-place behavior.

## Pandas Pitfalls

### SettingWithCopyWarning and chained assignment

```python
import pandas as pd

df = pd.DataFrame({"age": [20, 35, 50], "income": [1.0, 2.0, 3.0]})

# Chained assignment: two indexing ops; the write may hit a temporary copy
df[df.age > 30]["income"] = 0          # may not modify df

# Correct: single .loc call
df.loc[df.age > 30, "income"] = 0

# Subset you intend to modify independently: make it explicit
sub = df[df.age > 30].copy()
sub["income"] = sub["income"] * 2      # no warning, df untouched
```

With Copy-on-Write (the default behavior in pandas 3.0, opt-in in 2.x via `pd.options.mode.copy_on_write = True`), chained assignment never modifies the parent. Write code that is correct under both: one `.loc` for writes, `.copy()` for derived frames.

### dtype and NaN traps

```python
s = pd.Series([1, 2, None])
print(s.dtype)                  # float64 -- int upcast because NaN is a float
s2 = pd.Series([1, 2, None], dtype="Int64")  # nullable integer

np.nan == np.nan                # False
df = pd.DataFrame({"x": [1, np.nan]})
df[df.x == np.nan]              # empty! use df[df.x.isna()]

pd.Series(["1", "2", "x"]).astype(float)           # raises
pd.to_numeric(pd.Series(["1", "2", "x"]), errors="coerce")  # NaN for "x"
```

- Numeric columns read as `object` usually mean a stray string ("N/A", "-", commas). Check `df.dtypes` after every load.
- `mean()`, `sum()` skip NaN by default; NumPy's `np.mean` on the raw array does not.
- `groupby` drops NaN keys by default (`dropna=True`) -- rows can disappear from aggregates.
- Categorical/ID columns stored as int will be treated as ordinal by models; cast deliberately.

### apply vs vectorized

```python
df = pd.DataFrame({"a": np.random.rand(100_000), "b": np.random.rand(100_000)})

# Row-wise apply: Python call per row, slow
df["c"] = df.apply(lambda r: r.a * r.b if r.a > 0.5 else 0, axis=1)

# Vectorized
df["c"] = np.where(df.a > 0.5, df.a * df.b, 0)

# String ops: use .str accessor, datetime ops: .dt accessor
df2 = pd.DataFrame({"email": ["a@x.com", "b@y.org"]})
df2["domain"] = df2.email.str.split("@").str[1]
```

`apply` is acceptable for genuinely non-vectorizable logic on small data; otherwise it is a loop in disguise.

### Merge explosions

If the join key is not unique on the side you assume, rows multiply.

```python
users = pd.DataFrame({"uid": [1, 2], "country": ["IN", "US"]})
events = pd.DataFrame({"uid": [1, 1, 2], "evt": ["a", "b", "c"]})
dupe_users = pd.concat([users, users.iloc[[0]]])  # uid 1 duplicated

bad = events.merge(dupe_users, on="uid")        # 5 rows, not 3

# Guard: validate asserts key cardinality, raises MergeError otherwise
ok = events.merge(users, on="uid", how="left", validate="many_to_one")
assert len(ok) == len(events)

# Debug unmatched keys
chk = events.merge(users, on="uid", how="left", indicator=True)
print(chk["_merge"].value_counts())
```

Merge explosions inflate training data with duplicated labels and can leak across train/test when duplicates land on both sides.

## Tradeoffs

- Vectorization trades memory for speed: pairwise-distance broadcasting on (n, m, d) can exhaust RAM; chunk it or use `scipy.spatial.distance.cdist`.
- Views save memory but create aliasing; copies are safe but cost memory.
- Pandas is single-threaded and in-memory; for larger-than-RAM data consider Polars, DuckDB, or Spark.

## Failure modes

- `(n,)` vs `(n,1)` broadcasting in loss/metric code.
- In-place mutation of a slice shared with the caller.
- Chained assignment silently doing nothing.
- `== np.nan` filters returning empty frames.
- Int columns upcast to float after a left join introduces NaN.
- Many-to-many merges duplicating rows.

## Production notes

- Assert shapes and row counts at pipeline boundaries (`assert len(out) == len(inp)`).
- Pin dtypes when reading: `pd.read_csv(..., dtype={...}, parse_dates=[...])`.
- Use `validate=` on every merge in feature pipelines.
- Set a random seed (`np.random.default_rng(seed)`) for reproducibility.

## Interview questions

1. **Why is NumPy faster than a Python loop?** Operations run in compiled C over contiguous typed memory, avoiding per-element interpreter overhead and boxing.
2. **State the broadcasting rule.** Align shapes from the trailing dimension; each pair must be equal or one must be 1; missing leading dims are treated as 1.
3. **Does `a[a > 0]` return a view?** No, boolean and fancy indexing return copies; basic slicing returns views.
4. **What causes SettingWithCopyWarning?** Writing to an object that may be a copy of a slice, usually via chained indexing; fix with a single `.loc` or an explicit `.copy()`.
5. **Why did my int column become float?** NaN is a float; missing values upcast. Use nullable `Int64`.
6. **How do you detect a merge explosion?** Compare row counts before/after, use `validate="many_to_one"`, check key uniqueness with `df.key.is_unique`.
7. **When is `apply` acceptable?** Small data or logic that cannot be expressed with vectorized/`.str`/`.dt` ops.

## Related

- [[Linear-Algebra-for-ML]]
- [[Feature-Engineering]]
- [[Cross-Validation-and-Model-Selection]]
- [[Python-Stdlib-Cheat-Sheet]]
