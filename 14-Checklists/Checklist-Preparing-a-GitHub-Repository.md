---
title: "Checklist: Preparing a GitHub Repository"
description: Make a repository discoverable, safe, and easy to contribute to before sharing it.
domain: checklists
category: engineering
type: checklist
difficulty: beginner
status: evergreen
tags: [github, open-source, portfolio]
prerequisites: []
related: [Checklist-Production-README, Checklist-Releasing-Software]
order: 70
---
# Checklist: Preparing a GitHub Repository

Run before making a repository public or linking it on a resume.

## Hygiene

- [ ] Remove secrets from the full git history (gitleaks `detect`), and rotate any that were ever committed.
- [ ] Add a stack-appropriate `.gitignore`; confirm no build artifacts, `node_modules`, `.env`, or IDE folders are tracked.
- [ ] Delete dead branches and stale experimental folders.
- [ ] Make the default branch `main` (or document the one you use).

## Documentation

- [ ] Write the README using [[Checklist-Production-README]].
- [ ] Add a `LICENSE` file (MIT/Apache-2.0 for permissive, or state "all rights reserved").
- [ ] Add `CONTRIBUTING.md` with setup, test, and PR steps.
- [ ] Add `SECURITY.md` with how to report vulnerabilities.
- [ ] Add `CODE_OF_CONDUCT.md` if you accept outside contributors.

## Automation

- [ ] Add a CI workflow that runs lint, tests, and build on pushes and pull requests.
- [ ] Show the CI status badge in the README.
- [ ] Enable Dependabot or Renovate for dependency updates.
- [ ] Enable secret scanning and push protection.
- [ ] Enable CodeQL or another SAST workflow for supported languages.
- [ ] Add issue and pull request templates ([[Issue-Template]], [[Pull-Request-Template]]).

## Settings

- [ ] Protect the default branch: require PRs, passing checks, and no force pushes.
- [ ] Set the repository description, website link, and 5 to 10 topics.
- [ ] Add a social preview image showing the project.
- [ ] Pin the repository on your profile if it is portfolio work.
- [ ] Create a first tagged release once it works end to end ([[Checklist-Releasing-Software]]).

## Final check

- [ ] Clone into a fresh directory and follow the README exactly; fix every step that fails.
- [ ] Read the repo as a stranger: can you tell what it does in 10 seconds from the top of the README?
- [ ] Check commit history for embarrassing messages or personal data you do not want public.

Back to [[Checklists-Index]].
