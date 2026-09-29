---
title: Grade Calculation Guide
description: How SGPA and CGPA are calculated as credit-weighted averages, with worked examples and target-score math.
domain: academic
category: grades
type: guide
difficulty: beginner
status: evergreen
tags: [sgpa, cgpa, grades, gpa]
prerequisites: []
related: [Semester-Planner, Semester-Dashboard-Template, Course-Template]
order: 80
---

# Grade Calculation Guide

SGPA and CGPA are **credit-weighted averages** of grade points. A 4-credit course moves your GPA twice as much as a 2-credit course. You can calculate them in the web app at `/academic`, or record them in `CGPA-Tracker.csv` in this folder.

> Grade-point scales, grade cut-offs, and rules for failed or repeated courses differ between universities. Check your institution's academic regulations. The 10-point scale below is a common example, not a universal rule.

## Formulas

```
SGPA = Σ (Credits_i × GradePoint_i) / Σ Credits_i        over courses in one semester

CGPA = Σ (Credits_j × GradePoint_j) / Σ Credits_j        over all courses in all semesters
```

CGPA is **not** the plain average of your SGPAs unless every semester has the same total credits. Use total weighted points ÷ total credits.

## Example Grade Scale (10-point)

| Grade | Grade point |
|---|---:|
| O | 10 |
| A+ | 9 |
| A | 8 |
| B+ | 7 |
| B | 6 |
| C | 5 |
| F | 0 |

## Worked Example: SGPA

| Course | Credits | Grade | Grade point | Credits × GP |
|---|---:|---|---:|---:|
| Data Structures | 4 | A+ | 9 | 36 |
| DBMS | 4 | A | 8 | 32 |
| Discrete Maths | 3 | B+ | 7 | 21 |
| OS Lab | 2 | O | 10 | 20 |
| Soft Skills | 1 | A | 8 | 8 |
| **Total** | **14** | | | **117** |

SGPA = 117 / 14 = **8.36** (rounded to two decimals)

A plain average of grade points would give (9 + 8 + 7 + 10 + 8) / 5 = 8.40, which is wrong because it ignores credits.

## Worked Example: CGPA

| Semester | Total credits | SGPA | Weighted points (credits × SGPA) |
|---|---:|---:|---:|
| 1 | 20 | 8.00 | 160 |
| 2 | 22 | 8.50 | 187 |
| 3 | 14 | 8.36 | 117 |
| **Total** | **56** | | **464** |

CGPA = 464 / 56 = **8.29**

The simple average of SGPAs would be (8.00 + 8.50 + 8.36) / 3 = 8.29 here only by coincidence. With unequal credits, the two methods usually differ. Always use weighted points. (Using the exact weighted points per semester, not rounded SGPAs, avoids rounding drift.)

## Target Math: What SGPA Do I Need?

To reach target CGPA `T` after the next semester with `C_next` credits:

```
Required SGPA = (T × (C_done + C_next) − WeightedPoints_done) / C_next
```

Example: 56 credits done with 464 weighted points. Target CGPA 8.5 after a 22-credit semester:

Required SGPA = (8.5 × 78 − 464) / 22 = (663 − 464) / 22 = 199 / 22 = **9.05**

If the required SGPA is above your scale's maximum, the target isn't reachable in one semester. Plan over two.

## Target Math: Minimum End-Term Score

For a course graded out of 100 where internals are already known:

```
Needed end-term % = (Grade cut-off − Internal marks earned) / End-term weight × 100
```

Example: A-grade cut-off is 70 overall. You have 32/40 internal marks. End-term is worth 60.

Needed = (70 − 32) / 60 × 100 = **63.3%** on the end-term paper.

Do this for every course before finals. Put extra hours where a small gain crosses a grade boundary, not where you're already safe or far from the next cut-off.

## Using CGPA-Tracker.csv

Columns: `Semester, Course, Credits, GradePoint, WeightedPoints`. `WeightedPoints = Credits × GradePoint`. Sum per semester for SGPA and across all rows for CGPA.

## Checklist

- [ ] Confirmed my university's grade scale and cut-offs
- [ ] All completed courses entered with credits and grade points
- [ ] Required SGPA for target CGPA calculated
- [ ] Minimum end-term score per course calculated before finals
