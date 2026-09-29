---
title: Literature Review Template
description: Structured literature review with search strategy, snowballing, screening log, synthesis matrix, and gaps.
domain: research
category: literature
type: template
difficulty: intermediate
status: evergreen
tags: [literature-review, search, synthesis]
prerequisites: [How-to-Read-a-Paper]
related: [Paper-Note-Template, Novelty-Checklist, Research-Workflow]
order: 30
---

# Literature Review Template

A literature review answers one question: **what is known, what is contested, and what gap does my work fill?** It is an argument, not a summary pile. Budget: 15-25 papers screened, 8-12 read properly ([[Paper-Note-Template]] each; see [[How-to-Read-a-Paper]]), 2 weeks max for a student project.

## Research Topic

One sentence. If it has "and" in it twice, split into two reviews.

## Research Questions — max 3, answerable from literature

<!-- Bad: "what is ML security?" Good: "which defenses against prompt
     injection have been evaluated against adaptive attackers?" -->

1.
2.

## Search Strategy

### Databases — pick 2-3, log which

| Database | Use when | Note |
|----------|----------|------|
| Google Scholar | Always — broadest coverage | Sort by citations first pass, by date second pass |
| arXiv | ML/systems/theory preprints | Check if a peer-reviewed version exists before citing |
| ACM DL | Systems, SE, HCI, security venues | Filter by sponsor (SIGSOFT, SIGSAC…) to cut noise |
| IEEE Xplore | Networks, architecture, embedded | Same paper often also on Scholar — dedupe by title |
| DBLP | Verifying venue/year of a known paper | Metadata only, no full text |
| Semantic Scholar | Forward snowballing ("cited by") | Its API exports citation lists — useful for the log |

### Query Construction

Build queries as **concept blocks**: one block per core concept, synonyms OR'd inside a block, blocks AND'd together.

```
Concept A (problem):  "prompt injection" OR "indirect injection"
Concept B (response): defense OR mitigation OR detection
Concept C (rigor):    "adaptive attacker" OR "adaptive adversary"
Query: (A-block) AND (B-block) AND (C-block)
```

- Start with A AND B only; add C only if >100 hits
- Too few hits (<10): drop the newest block, add synonyms (check papers' own keyword lists for the field's preferred terms)
- Log **exact strings + hit count + date** — reviews must be re-runnable:

| Date | Database | Query string | Hits | Kept after pass 1 |
|------|----------|--------------|-----:|------------------:|
| | | | | |

- Date range + why (e.g. post-2017 for transformer-era work):

### Snowballing — do this AFTER keyword search, it finds more than queries do

1. Pick the 3 most relevant papers found so far (not most cited — most *relevant*)
2. **Backward**: scan each one's reference list; pull anything whose title matches your inclusion criteria
3. **Forward**: open each in Google Scholar / Semantic Scholar → "Cited by" → sort by date → scan the first 2 pages
4. Repeat once on any new paper that becomes a top-3 candidate; stop after 2 iterations or when no new papers survive screening (saturation)
5. Log snowballed papers in the same screening table, source column = `snowball:<parent-paper>`

## Inclusion / Exclusion Criteria — decide BEFORE screening, apply mechanically

<!-- If you invent criteria while screening, you'll bend them to keep
     interesting papers. Write them first; amend only with a dated note. -->

| # | Criterion | Type | Rationale |
|---|-----------|------|-----------|
| I1 | Peer-reviewed venue or arXiv with >N citations | Include | Quality floor |
| I2 | Evaluates on real data / real systems (not toy-only) | Include | RQ needs empirical evidence |
| I3 | Published ≥ YYYY | Include | Pre-<era> methods obsolete for this RQ |
| E1 | Survey of surveys / position paper with no evaluation | Exclude | No extractable evidence |
| E2 | Non-English, no accessible full text | Exclude | Cannot verify claims |
| E3 | Same authors, superseded by later version | Exclude | Cite the latest only |

## Screening Log

Two passes: title+abstract (30 sec each), then intro+conclusion (5 min each). Only survivors get a full read. Record the criterion ID, not a vague reason.

| Paper | Venue | Year | Source (query/snowball) | Pass 1 | Pass 2 | Criterion in/out |
|-------|-------|-----:|-------------------------|--------|--------|------------------|
| | | | | | | |

## Thematic Clusters

<!-- Group by APPROACH or ASSUMPTION, not by year or author. The clusters
     become your related-work section headings. 3-5 clusters typical.
     For each: what the cluster agrees on, what it ignores. -->

- Theme A — <name>: papers [ ], shared idea:, blind spot:
- Theme B — <name>:
- Theme C — <name>:

## Synthesis Matrix — papers × themes

<!-- One row per paper that survived pass 2, one column per theme above.
     Cell = that paper's position/finding on that theme, in <10 words,
     or "—" if silent. This matrix WRITES your related-work section:
     each column becomes a paragraph, each mostly-empty column or
     contradictory column is a gap candidate. -->

| Paper | Theme A: <name> | Theme B: <name> | Theme C: <name> |
|-------|-----------------|-----------------|-----------------|
| Author YYYY | | | |
| Author YYYY | | | |

Read the matrix two ways:
- **Down a column**: do papers agree? Contradictions = "contested" material for your review
- **Across empty cells**: a theme no paper addresses for a problem variant = gap evidence

## Comparative Matrix

| Paper | Problem variant | Method | Dataset/testbed | Best metric | Key limitation |
|-------|-----------------|--------|-----------------|-------------|----------------|
| | | | | | |

<!-- The Limitation column IS the review. Recurring limitations across
     rows = the field's open problems = your gap candidates. -->

## Gaps

<!-- A real gap satisfies all three: (1) visible in the matrix above,
     (2) matters practically, (3) attackable with your resources.
     List 2-3, pick one. "Nobody has done X" is not a gap unless
     you can also say why X matters and why it's now feasible. -->

1.
2.

## Proposed Direction

Thesis sentence: "Existing work does X but fails at Y under condition Z; we propose W." Run it through [[Novelty-Checklist]] before committing a semester to it.
