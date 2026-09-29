---
title: Technical Interview Roadmap (12 Weeks)
description: Pattern-first 12-week plan combining DSA, system design, mocks and application timeline.
domain: career
category: interviews
type: roadmap
difficulty: intermediate
status: evergreen
tags: [dsa, mock-interviews, planning]
related: [Interview-Engine-Index, Interview-DSA-Strategy, Application-Tracker-Guide]
order: 5
role: "Software Engineer (intern / new grad)"
---

# Technical Interview Roadmap (12 Weeks)

A pattern-first plan: each week owns one problem pattern, links to its vault note, and ends with a measurable milestone. Total volume: ~130 problems, 10+ mocks, applications running in parallel from Week 5.

## Weekly Cadence

- 4 days DSA (2-3 problems/day to hit the week's quota, timed after Week 4)
- 1 day system design basics
- 1 day project deep-dive + resume alignment
- 1 day mock interview + review (see Mock-Interview Cadence below)

## 12-Week Plan

| Week | Focus pattern | Vault note | Problems | Milestone |
|------|---------------|------------|----------|-----------|
| 1 | Arrays, strings, hashmaps (warm-up) | [[CS-Core-Index]] | 12 | Solve any easy in <15 min without hints |
| 2 | Two pointers | [[Two-Pointer-Pattern]] | 10 | Recognize the pattern from problem statement alone |
| 3 | Sliding window | [[Sliding-Window-Pattern]] | 10 | Explain fixed vs. variable window trade-off out loud |
| 4 | Binary search (incl. on answer space) | [[Binary-Search-Pattern]] | 10 | No off-by-one errors across 5 consecutive problems |
| 5 | Linked lists, stacks, queues + recursion | [[CS-Core-Index]] | 10 | First timed mock passed; applications begin |
| 6 | Trees + BFS/DFS | [[BFS-DFS-Pattern]] | 12 | Write BFS and DFS from memory, iterative and recursive |
| 7 | Graphs (BFS/DFS cont., topological sort, union-find) | [[BFS-DFS-Pattern]] | 12 | Solve a medium graph problem in <30 min |
| 8 | Heaps + top-K + intervals | [[Heap-Pattern]] | 10 | Explain when heap beats sorting; 2 mediums back-to-back |
| 9 | Dynamic programming I (1-D, knapsack) | [[DP-Pattern]] | 12 | State the recurrence before writing any code |
| 10 | Dynamic programming II (2-D, strings) + review of weak patterns | [[DP-Pattern]] | 12 | 3 DP mediums solved under interview timing |
| 11 | System design basics + API/backend | [[System-Design-Basics]] | 6 + 2 designs | Whiteboard a URL-shortener and a rate-limiter unaided |
| 12 | Mixed timed sets + behavioral polish | [[Behavioral-STAR-Method]] | 12 mixed | Full onsite simulation: 2 coding + 1 design + 1 behavioral in one day |

**Rule:** a week is not "done" by problem count — it is done when the milestone passes. If it fails, carry the pattern into the next week's review day rather than moving the whole schedule.

## Mock-Interview Cadence

| Weeks | Frequency | Format |
|-------|-----------|--------|
| 1-4 | Every 2 weeks | Untimed peer mock, focus on thinking out loud |
| 5-8 | Weekly | Timed 45-min coding mock (peer or platform), 1 pattern + 1 random |
| 9-11 | Weekly | Alternate: coding mock / system-design mock; record and review |
| 12 | Twice | Full onsite simulation (see Week 12 milestone) |

After every mock, log 3 things in the vault: the pattern that failed, the explanation that was unclear, the fix for next time. Behavioral answers come from the story bank in [[STAR-Story-Template]].

## Application Timeline (tracked in the web app at `/career`, or offline in `Internship-Application-Tracker.csv`; see [[Application-Tracker-Guide]])

| Weeks | Action | Tracker discipline |
|-------|--------|--------------------|
| 1-4 | Build target list (20-30 companies), tailor resume, line up referrals via [[Cold-Email-Templates]] | Add rows with Company, Role, Referral contact; Status = "Researching" |
| 5-8 | Apply in batches of 5-8/week, referral-first | Set ApplicationDate, Status = "Applied"; NextAction = follow-up date (+7 days) |
| 9-11 | Interviews land here — schedule them *after* the relevant pattern week where possible | Update Round after every contact; Notes = questions asked (feed back into prep) |
| 12+ | Follow-ups, thank-you emails, offer comparison | Weekly pass over every row: anything with a stale NextActionDate gets acted on or closed |

**Sunday review (15 min):** open the tracker, sort by NextActionDate, clear every overdue action. An application with no NextAction is a dead application.

## Weekly Review Questions

1. Which patterns still fail under time pressure? (Re-open the linked vault note and redo 2 problems.)
2. Which explanations are unclear when spoken aloud?
3. Which resume project needs deeper metrics?
4. Which communication habits need improvement (from mock recordings)?
5. Is the tracker current — every active application with a NextActionDate?


See also: [[Career-Index]]
