---
title: Daily Dashboard
description: Morning plan and evening shutdown template built around one reusable artifact per day.
domain: command-center
category: loop
type: template
difficulty: beginner
status: evergreen
tags: [daily, focus, planning]
prerequisites: [Command-Center-Index]
related: [Weekly-Review, Goals-Framework, Metrics-Definitions, Engineering-Journal-Template]
order: 10
---

# Daily Dashboard

The live version of this page is `/today` in the web app (state is kept in your browser). The Markdown template below is for Obsidian or plain-file users. Copy this file to `Daily/YYYY-MM-DD.md` each morning (or use Obsidian daily-notes plugin pointed at this template). Fill the top in 5 minutes. Review the bottom in 5 minutes before stopping.

**The one rule:** the day is a success if one reusable artifact exists at the end that did not exist in the morning. Everything else is optional.

---

Date:
Energy (1-5):
Non-negotiable deadline today (if any):

## 1) Mission Targets — pick ONE each

- **Build** (ship one reusable asset — code, script, template):
- **Learn** (one concept → one vault note with the Details section actually filled):
- **Career** (one application sent, one STAR story written, or one mock problem under time):

Bad targets: "study DSA", "work on project" (unfalsifiable).
Good targets: "implement LRU cache from memory + pass tests", "fill Details in [[Hash-Tables]]", "apply to 2 companies from tracker".

## 2) Focus Blocks

Phone in another room. One block = one target. If a block dies, write why in Blockers — that data is worth more than the block.

| Block | Time | Target | Done? |
|-------|------|--------|-------|
| A — Deep work 90 min | | Build target | |
| B — Deep work 90 min | | Learn target | |
| C — Execution 60 min | | Career target + admin | |

## 3) Artifact Log — evidence, not vibes

- File(s) created/changed:
- Commit hash (`git log --oneline -1`):
- Vault note touched:

## 4) Blockers

- Blocker:
- Root cause (5 whys until it's boring):
- Countermeasure (checklist, script, or note — which toolkit does it go in?):

## 5) Shutdown Review (5 min, mandatory)

- What worked:
- What failed:
- What gets automated/templated so it never costs time again:
- Tomorrow's Block A task (decide NOW — morning-you is dumber):

## 6) Scorecard (0-2 each, honest)

| Metric | Score | 2 means |
|--------|-------|---------|
| Focus | | Blocks ran without context switching |
| Output | | Artifact shipped and works |
| Reusability | | Artifact will be used again, not one-off |
| Consistency | | Streak unbroken, review done |

Total: /8 · Streak: __ days · A 5+/8 day repeated for a semester beats any 8/8 heroic day.

## 7) Checklist (tick as you go)

- [ ] Mission targets written before the first block
- [ ] Each target traces to a weekly objective in [[Goals-Framework]]
- [ ] Block A done
- [ ] Block B done
- [ ] Block C done
- [ ] Artifact logged with file path or commit hash
- [ ] Short entry in the [[Engineering-Journal-Template|engineering journal]]
- [ ] Shutdown review done and tomorrow's Block A decided

Metric definitions (what Focus, Output, Reusability and Consistency mean and why): [[Metrics-Definitions]]. Rolls up into [[Weekly-Review]].
