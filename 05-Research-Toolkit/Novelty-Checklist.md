---
title: Novelty Checklist
description: Checks that a contribution has an explicit delta over the closest work, an ablation proving it, and fair baselines.
domain: research
category: validation
type: checklist
difficulty: advanced
status: evergreen
tags: [novelty, baselines, ablation]
prerequisites: [Literature-Review-Template]
related: [Ablation-Study-Guide, Datasets-and-Baselines-Guide, Publication-Checklist]
order: 70
---

# Novelty Checklist

Run this BEFORE building (to kill weak ideas cheaply) and AGAIN before writing the intro (to phrase the claim you can actually defend). A novelty claim is a sentence of the form: *"Unlike [closest work], we [delta], which matters because [measured consequence]."* Every check below feeds one part of that sentence.

## Check 1 — Closest 3 Papers and Explicit Delta

Find the 3 papers a hostile reviewer would say already did your work (search your own title's keywords — that's what the reviewer will do). For each, state the delta in one concrete sentence. "They didn't try X" is not a delta unless you can say why X changes the outcome.

| Closest paper | What it already does | Explicit delta (what we do that it cannot) | Why the delta should matter |
|---------------|----------------------|--------------------------------------------|------------------------------|
| 1. | | | |
| 2. | | | |
| 3. | | | |

- [ ] All 3 deltas survive this test: if the closest paper's authors read my delta sentence, they could not reply "we already do that in Section N"
- [ ] The delta is the SAME across all 3 rows (if each row needs a different delta, the contribution is unfocused — narrow the claim)
- [ ] The 3 papers appear in my related work with these exact deltas stated — hiding the closest work is the fastest route to rejection by its authors as reviewers

## Check 2 — Ablation Proves the Delta Matters

The delta must be causally linked to the improvement, not just co-present with it.

- [ ] There is a run that is **full method minus only the delta** — if this ablation matches the full method, the novelty is decoration
- [ ] If the delta has multiple components, each has its own ablation row (remove one at a time, not all at once)
- [ ] Ablation uses the same seeds/data/budget as the main results table — an ablation under a different setup proves nothing
- [ ] The ablation gap is larger than seed noise (report mean±std over ≥3 seeds; a 0.2 gap with ±0.4 std is a null result)
- [ ] I can state the mechanism: WHY does removing the delta hurt, and does the failure-case analysis show errors consistent with that mechanism?

## Check 3 — Baseline Fairness

An unfair baseline comparison converts real novelty into an unreviewable claim. A baseline is fair when it got the same chances your method did:

- [ ] Baselines include the strongest published method for this exact problem from the last ~2 years (not just the classic everyone beats)
- [ ] Same dataset, same splits, same preprocessing, same evaluation script for every method
- [ ] Same tuning budget: if my method got 20 hyperparameter trials, each baseline gets 20 — logged, not estimated
- [ ] Same compute/parameter budget, or the difference is reported in a table column (a 10x bigger model "winning" is a scaling result, not a method result)
- [ ] Re-ran baselines myself where feasible; quoted numbers are marked "(reported in [cite])" and never mixed silently with re-run numbers in one table
- [ ] If my re-run of a baseline underperforms its paper's number, I say so and use the HIGHER of the two in comparisons
- [ ] Statistical claim matches evidence: "outperforms" requires mean±std over multiple seeds and a gap exceeding the noise, not a single lucky run

## Check 4 — Prior-Art Search Was Actually Done

- [ ] Searched at least 3 phrasings of my own claim (method name, problem name, reported effect) on Google Scholar plus one field database; queries logged in [[Literature-Review-Template]]
- [ ] Checked the last 6-12 months of arXiv and recent proceedings of the main venues (scoop risk comes from recent work)
- [ ] Checked adjacent fields that solve the same problem under a different name
- [ ] Asked one person in the area "has someone done this?" before building
- [ ] Re-ran the search right before submission, not only at idea time

## Verdict

- Claim sentence (fill it): "Unlike ____, we ____, which matters because ____."
- [ ] All three checks pass → proceed to [[Publication-Checklist]]
- [ ] Check 1 fails → this is incremental work; either find a new angle or reframe honestly as a reproduction/analysis paper (those are publishable too)
- [ ] Check 2 fails → you have a result but not YOUR result; more ablations before more writing
- [ ] Check 3 fails → fix the comparison before drawing any conclusion; reviewers find this and it poisons the whole paper

Related: [[Ablation-Study-Guide]] (Check 2) · [[Datasets-and-Baselines-Guide]] (Check 3) · [[Research-Ideas-Backlog-Template]] (where killed ideas go).
