---
title: Reviewer Response Template
description: Point-by-point rebuttal structure with tone rules, phrase bank, and a worked example.
domain: research
category: publishing
type: template
difficulty: advanced
status: evergreen
tags: [rebuttal, peer-review]
prerequisites: [Publication-Checklist]
related: [Research-OS-Index]
order: 90
---

# Reviewer Response Template

Goal of a response: make it EASY for the reviewer to raise their score. Every point gets three parts — restate, respond, act. Never skip a point, never merge two points, never reply to a criticism with only prose when an experiment or edit is possible.

## Tone Rules

1. Reviewer time is a gift; open by using it well, not by flattering ("We thank R1 for identifying an ambiguity in Section 3" beats "We thank the esteemed reviewer")
2. Never write "the reviewer misunderstood" — if they misread it, the writing failed; say "we have clarified Section X, which did not make clear that…"
3. Concede fast and visibly when they're right; credibility earned on easy points is spent on the hard ones
4. Disagree with evidence, never with adjectives — a new experiment, a citation, or a pointer to an existing table; "we respectfully disagree" followed by opinion convinces nobody
5. Every response ends with a concrete, checkable action ("Revised: Section 4.2, para 2; Table 5 added") or an explicit "no change, because…"
6. Answer the question they asked before the question you wish they'd asked
7. Keep each response ≤ 1 paragraph + action line; long defenses read as insecurity

## Phrase Bank

**Agree (fix and move on):**
- "The reviewer is correct. We have [change] (Section X, p. Y)."
- "Good catch — this was an error. Corrected in [location]; it does not affect other results because [reason]."
- "We agree this experiment strengthens the paper. We ran it: [one-sentence result]. Added as Table N."

**Partially agree (concede the valid part explicitly, bound the rest):**
- "We agree that [valid part], and have [change]. However, [remaining part] is outside our threat model / problem setting, which we now state explicitly in Section X."
- "The reviewer raises a fair concern about [X]. Our claim holds for [narrower scope]; we have weakened the claim in the abstract and intro accordingly."
- "We agree [X] would be valuable and now discuss it as future work (Section N); a full treatment requires [resource/scope reason], but we have added [smaller feasible experiment] as evidence."

**Disagree with evidence (never bare disagreement):**
- "We believe this concern is addressed by our existing results: Table 3 shows [specific number] under exactly the condition the reviewer describes. We have added a sentence in Section X pointing to this."
- "To check this, we ran the additional experiment the reviewer implies: [setup]. Result: [number], consistent with our original claim. Added as Appendix C."
- "Our reading of [cited paper] differs: it evaluates [A], whereas our setting is [B] (their Section 3.1). We have sharpened this distinction in Related Work."

## Manuscript ID

Paper #___ — "<title>" (venue, cycle) <!-- e.g. Paper #142 — "…" (ICSE 2027, second cycle) -->

## Summary of Major Revisions

<!-- 3-6 bullets, biggest change first. Reviewers read this before their
     own points — front-load new experiments and corrected errors. -->

1.
2.

## Point-by-Point Responses

<!-- Number every point R1.1, R1.2… Quote or faithfully paraphrase the
     comment — reviewers notice when their point is restated weaker.
     Mark changes in the revised PDF (colored text or latexdiff) and
     cite locations here. -->

### Reviewer 1

**R1.1 Comment:** "…"

**Response:**

**Action taken:** (Section/page/table, or "No change — see response.")

**R1.2 Comment:** "…"

**Response:**

**Action taken:**

### Reviewer 2

**R2.1 Comment:** "…"

**Response:**

**Action taken:**

## Filled Example Exchange

**R2.3 Comment:** "The comparison to BaselineX is unconvincing — the authors tune their own method extensively but appear to use BaselineX's default hyperparameters."

**Response:** The reviewer is right that the original submission did not document the baseline's tuning budget, and we agree an untuned baseline would make the comparison unfair. We re-ran BaselineX with the same 20-trial random search used for our method (same search space where parameters are shared, ranges in Appendix B.2). Tuned BaselineX improves from 71.2 to 72.8 F1; our method achieves 75.1 ± 0.4 over 3 seeds, so the conclusion is unchanged. Table 2 now reports the tuned number, and Section 5.1 states the identical tuning budget for all methods.

**Action taken:** Table 2 updated (tuned BaselineX); Section 5.1, para 1 revised; Appendix B.2 added with search spaces and budgets.

## Additional Changes Not Requested

<!-- List every change reviewers didn't ask for, however small — an
     undeclared change discovered by a reviewer looks like sneaking. -->

## Closing Statement

We thank the reviewers for their time and specific suggestions; the added [experiments/clarifications] have materially improved the paper, and we believe all raised concerns are addressed above.

Related: [[Publication-Checklist]] · [[Research-Workflow]] · [[Research-OS-Index]]
