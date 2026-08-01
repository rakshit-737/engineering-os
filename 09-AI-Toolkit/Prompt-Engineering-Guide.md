# Prompt Engineering Guide

A working catalog of techniques that reliably improve LLM output quality. Every technique includes a concrete before/after example. Use the core framework for every serious prompt; layer the other techniques on when the task demands them.

---

## Core Framework

Structure every non-trivial prompt with these six parts, in order:

1. **Role** — who the model should act as (sets vocabulary, priorities, and depth)
2. **Objective** — the single concrete outcome you want
3. **Context** — everything the model needs and cannot infer (inputs, background, audience)
4. **Constraints** — what it must and must not do (length, scope, tone, forbidden moves)
5. **Output format** — exact structure of the response (headings, table, JSON, code-only)
6. **Quality checks** — what the model should verify before answering

**Before:**
> Explain database indexing.

**After:**
> Role: You are a database instructor teaching second-year CS students.
> Objective: Explain how B-tree indexes speed up SELECT queries.
> Context: Students know SQL basics and binary search trees, but not disk I/O.
> Constraints: Under 400 words. No syntax tutorials. Use one running example (a `users` table with 10M rows).
> Format: 3 sections — the problem without an index, how the B-tree changes the lookup, when an index hurts.
> Quality check: Verify every claim about complexity is stated in terms of disk pages, not just big-O.

Why it works: each part removes one class of failure. Role fixes wrong depth; objective fixes wrong deliverable; context fixes wrong assumptions; constraints fix scope creep; format fixes unusable structure; quality checks catch the model's own likely errors.

---

## Few-Shot Examples

Show 2–5 input/output pairs before the real input. The model imitates the pattern — format, tone, level of detail, and edge-case handling — far more reliably than it follows a description of the pattern.

**Before:**
> Classify these support tickets by urgency: "My invoice PDF won't download."

**After:**
> Classify each support ticket as P1 (outage/data loss), P2 (feature broken, workaround exists), or P3 (cosmetic/question). Output: `LABEL — one-line reason`.
>
> Ticket: "Site is down for all our users since 9am."
> P1 — total outage affecting all users.
>
> Ticket: "Export to CSV gives a 500 error, but copy-paste still works."
> P2 — feature broken but a workaround exists.
>
> Ticket: "Where do I change my avatar?"
> P3 — usage question, nothing broken.
>
> Ticket: "My invoice PDF won't download."

Guidelines:
- Cover the *boundary* cases, not just easy ones — the examples are where you encode judgment calls.
- Keep examples in the exact output format you want back; the model copies formatting more strongly than instructions.
- If outputs drift, the fix is usually a better example, not a longer instruction.

---

## Chain-of-Thought (Reasoning Before Answering)

Ask the model to work through the problem before committing to an answer. Improves accuracy on math, logic, multi-constraint planning, and anything where the first intuitive answer is often wrong. Costs tokens and latency — skip it for lookup-style tasks.

**Before:**
> A batch job processes 12,000 records/hour and slows 10% for each concurrent job added. With 3 jobs running, how long to process 50,000 records? Give the answer.

**After:**
> A batch job processes 12,000 records/hour and slows 10% for each concurrent job added. With 3 jobs running, how long to process 50,000 records?
> First, work through the problem step by step: state your interpretation of "slows 10% per job" (compounding or additive?), compute the effective rate, then the time. After the reasoning, give the final answer on its own line as `ANSWER: <value>`.

Guidelines:
- Force the reasoning *before* the answer. Answer-then-justify produces rationalization, not reasoning.
- Ask the model to surface ambiguities ("state your interpretation") — most wrong answers on word problems come from a silently chosen interpretation.
- Pair with a delimiter (`ANSWER:`) so downstream code can parse past the reasoning.

---

## Structured Output / JSON Schema

When the output feeds code, specify the exact schema and rules for every field. Never say just "return JSON."

**Before:**
> Extract the key info from this job posting as JSON.

**After:**
> Extract from the job posting below. Return ONLY a JSON object matching this schema — no markdown fences, no commentary:
> ```json
> {
>   "title": "string",
>   "company": "string",
>   "location": "string | null  (null if not stated; never guess)",
>   "salary_min": "integer | null  (annual, in the posting's currency)",
>   "salary_max": "integer | null",
>   "remote": "\"remote\" | \"hybrid\" | \"onsite\" | \"unspecified\"",
>   "skills": "string[]  (max 8, as written in the posting, lowercase)"
> }
> ```
> Rules: use `null` for missing values, never invent them. If a salary is given as a single number, set min and max to the same value.

Guidelines:
- Enumerate allowed values for categorical fields — otherwise you get creative variants (`"Remote-friendly"`, `"WFH"`).
- Say explicitly what to do with missing data; unspecified handling of absence is the #1 source of hallucinated fields.
- If the API supports a structured-output/JSON mode or tool-call schema, use it *and* keep the schema in the prompt — the prompt controls semantics, the API mode controls syntax.

---

## Self-Critique (Generate → Review → Revise)

Have the model check its own output against explicit criteria before finalizing. Cheap way to catch omissions and rule violations; works best when the criteria are concrete and checkable.

**Before:**
> Write a migration script to rename the `users.email` column to `email_address` in Postgres.

**After:**
> Write a migration script to rename the `users.email` column to `email_address` in Postgres.
> After writing it, review your own script against this checklist and fix anything that fails before giving the final version:
> 1. Is the migration reversible (down migration included)?
> 2. Does it handle dependent objects — indexes, constraints, views referencing the column?
> 3. Would it lock the table long enough to matter at 10M rows? If yes, note it.
> 4. Any statement that fails if run twice?
> Output the final script only, then a "Review notes" section listing what the checklist caught.

Guidelines:
- Give a checklist, not "check your work" — vague self-review produces vague reassurance.
- Asking for "Review notes" makes the critique auditable; if the notes say "nothing caught" on a nontrivial task, be suspicious.
- For high-stakes output, run the critique as a *second call* with a fresh context — the model is a better critic when it isn't attached to the draft.

---

## Reliability Additions

Bolt these onto any prompt where being wrong is expensive:

- **Ask for assumptions** — "List any assumptions you made" surfaces silent guesses (versions, environments, interpretations) so you can correct them.
- **Ask for edge cases and failure modes** — "What inputs would break this?" turns the model into its own adversarial tester.
- **Ask for a test plan** — for code or processes: "How would I verify this works?" makes claims falsifiable.
- **Ask for a reusable artifact** — "Give the final answer as a template/checklist/script I can reuse" converts one-off answers into tools.

---

## Prompt Versioning

Treat prompts like code: they regress silently when edited casually.

- **Store prompts in files, not chat history.** One file per prompt, in version control, with variables clearly marked (`{{input}}`, `{{audience}}`).
- **Version explicitly.** Header comment: version, date, what changed, and *why* (which failure the change fixed).
- **Keep a small eval set per prompt.** 5–20 representative inputs with expected outputs or a rubric. Re-run after every edit (see `LLM-Evaluation-Framework.md`).
- **Never edit and deploy in one step.** Changed prompt → run eval set → compare against previous version → then swap.
- **Pin the model version too.** A prompt's behavior is (prompt × model); note which model+version each prompt version was validated against.

Example header:

```
# extract-invoice v3 (2026-07-14)
# Model: validated on claude-sonnet-4-5
# v3: added null-handling rules — v2 hallucinated vendor addresses (eval case 7, 11)
# v2: switched to JSON schema output
# Eval: evals/extract-invoice/ — 14/15 passing
```

---

## Prompt Iteration Loop

1. **Baseline prompt** — core framework, no cleverness. Run it on your eval set.
2. **Analyze failures** — cluster them: wrong format? wrong facts? wrong scope? wrong reasoning? Each cluster maps to a different fix.
3. **Add the targeted fix** — format failures → schema + few-shot; reasoning failures → chain-of-thought; scope failures → constraints; judgment failures → boundary examples.
4. **Re-run and compare** — against the same eval set. A fix that helps 3 cases and breaks 2 is not a fix.
5. **Version the prompt** — commit with the failure it fixed noted. Stop when marginal edits stop moving the eval score; further gains usually need a better model or better retrieval, not a longer prompt.

---

## Technique Selection Cheat Sheet

| Symptom | Reach for |
|---|---|
| Output right but unusable structure | Structured output / few-shot format examples |
| Wrong depth or tone | Role + audience in context |
| Correct-looking but wrong answers | Chain-of-thought + ask for assumptions |
| Misses edge cases | Self-critique checklist + few-shot boundary examples |
| Inconsistent across similar inputs | Few-shot + explicit rules for the varying dimension |
| Worked last week, broken now | You needed prompt versioning + a regression eval |
