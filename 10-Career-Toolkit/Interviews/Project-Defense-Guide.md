---
title: Project Defense Guide
description: How to defend your projects under probing -- architecture, tradeoffs, what you would change, failure stories and likely questions.
domain: career
category: interviews
type: guide
difficulty: intermediate
status: evergreen
tags: [projects, interviews, deep-dive]
related: [Project-Description-Bank-Template, Resume-Engine, Interview-System-Design-Strategy]
order: 60
---

# Project Defense Guide

Interviewers pick one resume project and drill until they reach the edge of your knowledge. The goal is to show that you built it, understood it, and can reason about it -- not that it was perfect.

## Prepare per project (write it down)

1. **60-second pitch:** problem, users, what you built, one result.
2. **Architecture diagram** you can draw from memory in 2 minutes: components, data flow, storage, external dependencies.
3. **Your exact contribution** if it was a team project. Be precise; overclaiming is found out fast.
4. **Three key decisions and their tradeoffs:** what alternatives existed, why you chose this, what it cost.
5. **Failure story:** a bug, outage or wrong decision -- how you found it, fixed it, what you changed.
6. **What you would change** with more time, or at 100x scale.
7. **Numbers and how you measured them.** Only real ones.
8. **Security:** authn/authz, input validation, secrets, what an attacker would try first.
9. **Testing:** what you tested, what you did not, why.

## Likely probing questions

- Why this stack and not {{obvious alternative}}?
- Walk me through what happens when a user does X.
- Where is the bottleneck? What breaks first under 10x load?
- How is data stored? Show me the schema. Why these indexes?
- What happens if {{DB / external API / worker}} goes down?
- How do you handle concurrent writes / duplicates / retries?
- How did you measure {{metric on resume}}? What was the baseline?
- How would an attacker abuse this? What did you do about it?
- What was the hardest bug? How did you debug it?
- What would you do differently if starting today?
- (ML) What was the train/val/test split? Any leakage? Why this metric? What baseline?

## Answering pattern

State the decision -> alternatives -> why -> cost of the choice. Example: "I used SQLite because it was single-user and zero-ops; the tradeoff is no concurrent writers, so for multi-user I'd move to Postgres."

## Red flags to avoid

- "I just followed a tutorial" with no extension or understanding.
- Can't explain code that is in your repo.
- Metrics you cannot explain the measurement of.
- Defensiveness when a weakness is pointed out. Agree, then propose the fix.

Related: [[Project-Description-Bank-Template]], [[Interview-System-Design-Strategy]], [[Threat-Modeling-STRIDE]].
