---
title: Publication Checklist
description: Venue selection, desk-reject prevention, writing pass, artifact release, and camera-ready checks.
domain: research
category: publishing
type: checklist
difficulty: advanced
status: evergreen
tags: [publishing, submission, camera-ready]
prerequisites: [Novelty-Checklist]
related: [Reproducibility-Checklist, Reviewer-Response-Template]
order: 80
---

# Publication Checklist

Work through top to bottom. Venue selection happens BEFORE the final writing push — page limits, formatting, and anonymity rules shape the paper.

## Venue Selection

- [ ] Listed 3 candidate venues by checking where my closest-3 papers (from [[Novelty-Checklist]]) were published — that's where this community reads
- [ ] Matched tier to contribution honestly: workshop = early/partial results and first papers; conference = complete contribution with strong evaluation; journal = extended/mature work, slower turnaround
- [ ] Checked deadline, page limit, and anonymization policy (double-blind = scrub names, acks, "our prior work [cite]" self-references, GitHub links)
- [ ] Checked scope: my keywords appear in the venue's last 2 years of accepted titles (if not, it's out of scope regardless of quality)
- [ ] Checked arXiv/preprint policy before posting a preprint
- [ ] Picked a fallback venue with a deadline 1-3 months later, so a rejection has a destination
- [ ] For a first paper: seriously considered the workshop track — real reviews, real deadline, lower stakes, faster iteration

## Pre-Submission — Content

- [ ] Novelty claim sentence appears verbatim in abstract and intro ("Unlike X, we Y, which matters because Z")
- [ ] Every claim in the abstract is backed by a specific table/figure in the paper
- [ ] Strongest recent baseline included; comparison passes the fairness checks in [[Novelty-Checklist]]
- [ ] Ablation table present; every component of the claimed contribution has a row
- [ ] Error analysis: at least one paragraph on WHERE the method fails, with examples from [[Experiment-Tracker]] failure cases
- [ ] Limitations section written by me before a reviewer writes it for me
- [ ] All numbers traceable to a run ID in the experiment tracker

## Pre-Submission — Desk-Reject Causes (fix ALL, these kill papers before review)

- [ ] Formatting: exact template version, page limit respected INCLUDING references if the venue counts them
- [ ] Anonymity: no author names in PDF metadata (`pdfinfo paper.pdf`), no identifying repo links, no "in our previous paper [12]" where [12] is yours
- [ ] Scope: paper matches the call-for-papers topics list
- [ ] Dual submission: not under review anywhere else; declared any overlapping preprint per venue policy
- [ ] Missing mandatory sections: many venues require ethics statement / reproducibility checklist / limitations — check the CFP checklist
- [ ] Placeholder text: no leftover `TODO`, `XXX`, `\ref{??}`, or "Lorem" anywhere (`grep -i "todo\|xxx\|??" paper.tex`)
- [ ] Compiled PDF opened and visually checked page by page — broken figures render fine in the editor and broken in the PDF

## Writing Pass

- [ ] Abstract structure: problem (1 sentence) → gap (1) → method (1-2) → key result with a NUMBER (1) → implication (1)
- [ ] Every figure/table interpretable from its caption alone (reviewers skim captions first)
- [ ] Table conventions: units stated, best results bolded, ± std where multiple seeds, arrow (↑/↓) showing metric direction
- [ ] Figures legible at 100% zoom in grayscale print; fonts in figures ≥ caption font size
- [ ] References: every arXiv citation checked for a published version; consistent format; no "[Online]. Available:" garbage from auto-importers
- [ ] Read aloud once end-to-end — catches broken sentences no silent read finds

## Artifact / Code Release

Run the full [[Reproducibility-Checklist]] first; the items below are the release-specific extras.


- [ ] Repo has: `README` with install + one-command reproduction per table ("Table 2: `bash scripts/table2.sh`"), `LICENSE`, pinned dependencies (`requirements.txt` with versions or lockfile)
- [ ] Fresh-clone test: cloned into a clean env on another machine (or container) and reproduced one headline number — the README lies until this passes
- [ ] Data: included, scripted download, or clearly documented access procedure; redistribution rights verified for anything bundled
- [ ] Tagged the exact submission state: `git tag v1.0-submission`
- [ ] Anonymized release for double-blind (anonymous.4open.science or equivalent); de-anonymized version ready for camera-ready
- [ ] If the venue has artifact evaluation: read its criteria now — badges are cheap credibility for a first paper

## Camera-Ready (after acceptance)

- [ ] De-anonymized: authors, affiliations, acknowledgments, grant numbers, real repo link restored
- [ ] Every reviewer-promised change actually made (cross-check against the response letter, item by item)
- [ ] Copyright form / DOI metadata / final template version per acceptance email — camera-ready template often differs from submission template
- [ ] Page limit for camera-ready re-checked (sometimes +1 page allowed; sometimes de-anonymization pushes you over)
- [ ] Final PDF: metadata title/authors correct, fonts embedded (venue compliance checkers reject otherwise)
- [ ] arXiv updated to camera-ready version; repo tag `v1.0-camera-ready`

## Post-Submission

- [ ] Reviewer-response skeleton created from [[Reviewer-Response-Template]] on submission day, not when reviews land
- [ ] Improvement backlog: everything cut for the deadline, logged while memory is fresh
- [ ] Replication archive: submitted PDF + source + exact repo commit + tracker file, zipped and stored
