---
title: Project Postmortem Template
description: Blameless retrospective template for a finished, shipped, or abandoned project.
domain: projects
category: templates
type: template
difficulty: beginner
status: evergreen
tags: [project, postmortem, retrospective]
prerequisites: []
related: [Project-Template, Project-Maturity-Model]
order: 4
---
# Project Postmortem Template

Blameless: describe decisions and conditions, not people's failings. Write it within a week of finishing, while memory is fresh. Also usable for a single incident during a project.

## Summary

- **Project:** {{name + repo link}}
- **Dates:** {{start}} to {{end}}
- **Target level vs reached level:** {{e.g. 3 vs 2}} ([[Project-Maturity-Model]])
- **Outcome in one sentence:** {{shipped / partially shipped / abandoned, and why}}

## Goals vs results

| Success criterion | Target | Actual | Met? |
|---|---|---|---|
| {{...}} | {{...}} | {{measured value}} | {{yes/no}} |

## Timeline

| Date | Event | Decision or impact |
|---|---|---|
| {{...}} | {{milestone, pivot, incident}} | {{...}} |

## What went well

- {{Practice or decision worth repeating, with evidence}}

## What went poorly

- {{Problem, its effect, and when it was noticed}}

## Root causes

<!-- Ask "why" until you reach a cause you could change next time. -->

| Problem | Root cause | Contributing factors |
|---|---|---|
| {{...}} | {{...}} | {{...}} |

## Estimates vs reality

- {{Where time actually went vs the plan}}
- {{Assumptions that turned out wrong}}

## Action items

- [ ] {{Concrete change to templates, checklists, or habits}} (owner, due date)
- [ ] {{Checklist item to add to the relevant note in the checklists folder}}

## Lessons

- **Technical:** {{...}}
- **Process:** {{...}}
- **Would I start this project again? Why?** {{...}}

## Portfolio notes

- **Resume bullet (impact + metric):** {{...}}
- **Interview story (situation, action, result):** {{...}}

Back to [[Project-Lab-Index]].
