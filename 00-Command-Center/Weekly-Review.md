# Weekly Review

Sunday, 60 minutes, calendar-blocked. Copy to `Weekly/YYYY-Wnn.md`. The review exists to answer one question: **is the system compounding or just consuming time?**

Week of:

## 1) Collect (10 min — pull data, don't remember it)

```bash
cd f:/Engineering-OS
git log --since="7 days ago" --oneline          # commits this week
git diff --stat HEAD@{7.days.ago} 2>/dev/null   # what actually changed
```

- Commits:
- Daily dashboards completed: /7
- Scorecard average: /8

## 2) Outcomes (evidence required)

- Biggest win (link the artifact):
- Most reusable thing created (will future-you use it? honestly?):
- Most valuable thing learned (which vault note holds it?):
- Money question: **what did I create this week that makes next week easier?**

## 3) Metrics

| Metric | This week | Last week | Trend |
|--------|-----------|-----------|-------|
| Deep work hours | | | |
| Artifacts shipped | | | |
| Vault notes filled (not created — filled) | | | |
| Problems solved under time | | | |
| Applications sent | | | |
| Papers summarized | | | |

## 4) Quality Audit — yes/no, no partial credit

- [ ] Every new project has README + run instructions
- [ ] Every bug hit this week has a root-cause note somewhere findable
- [ ] Anything done 3+ times manually got a script/checklist
- [ ] Tests exist for logic I'd be scared to refactor
- [ ] Tracker CSVs are current (applications, CGPA)

Each unchecked box = one concrete task in next week's plan. That's the compounding mechanism — skipping this line kills the system.

## 5) Career Pipeline

- Applications sent: · Responses: · Interviews scheduled:
- STAR stories added/sharpened:
- One networking action taken (referral ask, cold email, meetup):

## 6) Next Week — exactly 3 outcomes

Outcome = shippable noun, not activity. "48 tests green on graph module" not "practice graphs".

1.
2.
3.

## 7) Kill / Keep / Start

- **Kill** (consumed time, produced nothing twice in a row):
- **Keep** (working, don't touch):
- **Start** (one experiment max — new habit, tool, or time slot):

## 8) Close

```bash
git add -A && git commit -m "chore: week $(date +%V) review" && git push
git tag week-$(date +%Y-%m-%d) && git push --tags
```
