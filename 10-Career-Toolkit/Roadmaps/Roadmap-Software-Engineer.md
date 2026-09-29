---
title: Roadmap -- Software Engineer
description: Skill-based, project-driven path to an SWE internship or new-grad role, from foundations to job-ready.
domain: career
category: roadmaps
type: roadmap
role: "Software Engineer"
difficulty: intermediate
status: evergreen
tags: [swe, backend, dsa]
related: [Technical-Interview-Roadmap, Interview-DSA-Strategy, Interview-System-Design-Strategy]
order: 10
---

# Roadmap -- Software Engineer

**What the role does:** designs, builds, tests and operates software. Hiring at entry level is weighted toward coding rounds (DSA), CS fundamentals and evidence you can ship a working, tested project.

## Stage 1 -- Foundation
- [ ] One language to fluency (Python, Java or C++): standard library, collections, error handling
- [ ] Complexity analysis ([[Big-O-Notation]])
- [ ] Core data structures: arrays, hash maps, linked lists, stacks/queues, trees, heaps, graphs
- [ ] Git workflow: branches, rebase vs merge, PRs ([[Git-Cheat-Sheet]])
- [ ] Linux shell basics and a debugger

## Stage 2 -- Core
- [ ] DSA patterns: two pointers, sliding window, binary search, BFS/DFS, heaps, DP ([[Technical-Interview-Roadmap]])
- [ ] OS, networks, DBMS, OOP fundamentals ([[Interview-CS-Fundamentals-Questions]])
- [ ] SQL: joins, indexes, transactions ([[SQL-Cheat-Sheet]])
- [ ] Build and test a REST API; unit + integration tests
- [ ] HTTP, auth basics ([[Authentication-vs-Authorization]])

## Stage 3 -- Specialization (pick one: backend, frontend, mobile, systems)
- [ ] Backend: one framework (Spring Boot / FastAPI / Express), Postgres, caching, background jobs
- [ ] Docker; deploy one service to a cloud or PaaS
- [ ] Concurrency basics ([[Concurrency-Basics]])
- [ ] Low-level design: SOLID and a few GoF patterns ([[OOP-Concepts]])
- [ ] System design basics ([[System-Design-Basics]])

## Stage 4 -- Job-ready
- [ ] ~150 problems across patterns, timed mediums in about 30 minutes
- [ ] 2 system design mocks, 4+ coding mocks logged ([[Mock-Interview-Log-Template]])
- [ ] Resume tailored and reviewed ([[Resume-Review-Checklist]])
- [ ] Project defense prepared for each project ([[Project-Defense-Guide]])

## How this differs from neighbouring roles
- vs [[Roadmap-Security-Engineer]]: same coding bar, but you are judged on product delivery (features, latency, reliability), not on threat models.
- vs [[Roadmap-ML-Engineer]]: no model training; data is something you store and serve, not something you fit.
- The deciding skill: shipping a tested, deployed service and explaining its trade-offs.

## Readiness test (do these cold before applying)
- [ ] Solve an unseen LeetCode medium in 25 minutes, talking through complexity, in a language you can write without an IDE.
- [ ] Take a feature request ("add pagination + search to the task API"), implement it with tests and a migration, and open a PR a stranger could review.
- [ ] Explain one production failure mode of your project (DB connection exhaustion, N+1 queries, race on concurrent update) and the fix.

## Portfolio projects

| Project | Scope | What it proves |
|---|---|---|
| URL shortener / pastebin service | REST API, Postgres, Redis cache, rate limiting, Docker, tests, simple load test | Backend fundamentals, caching, measured performance |
| Collaborative app (e.g. task board with real-time updates) | Auth, WebSockets, roles, deployed with CI | Full-stack delivery, concurrency, authz |
| Contribution to an open-source project | 2-3 merged PRs (bug fixes, tests, docs) | Reading unfamiliar code, code review etiquette |

## Proof-of-skill signals
- Deployed projects with READMEs, tests and CI
- Merged open-source PRs
- Consistent contest/practice record (optional)
- Internship or real users

## Interview focus
Coding (DSA) dominates, then CS fundamentals, project deep-dive and behavioral; system design basics for new grads at some companies.

## Common traps
- Grinding problem count without reviewing mistakes
- Tutorial clones with no extension
- Listing ten languages you cannot interview in

## Study in Engineering OS
[[Interview-DSA-Strategy]], [[CS-Core-Index]], [[Interview-Prep-Index]], [[System-Design-Index]], [[Java-Interview-Essentials]], [[Cpp-Interview-Essentials]]. Plain-text topics: System Design: Rate-Limiting, System Design: Caching.

## Optional certifications
Not needed for SWE roles; a cloud associate-level cert (e.g. AWS Certified Developer - Associate) is optional.
