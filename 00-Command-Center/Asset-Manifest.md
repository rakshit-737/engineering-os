---
title: Asset Manifest
description: Map of the main assets in the repository by area; counts need refresh after the v2 restructure.
domain: command-center
category: navigation
type: index
difficulty: beginner
status: draft
tags: [navigation, inventory]
prerequisites: []
related: [Command-Center-Index]
order: 90
---

# Asset Manifest

> TODO: Needs refresh. This manifest was written for Engineering OS v1 (2026-08). Folder layout, file names and all counts below (tests, modules, notes) are historical and have not been re-verified after the v2 content restructure. Regenerate counts from the repo (file listing, test runner output) before quoting them. For current navigation use [[Command-Center-Index]], [[Research-OS-Index]] and [[Academic-Index]].

## Core Navigation

- Root: `../README.md`
- Daily dashboard: `./Daily-Dashboard.md`
- Weekly review: `./Weekly-Review.md`
- 72-hour plan: `./72-Hour-Execution-Plan.md`

## Knowledge Systems

- Obsidian vault home: `../01-Obsidian-Vault/00-Indexes/Home.md`
- Concept template: `../01-Obsidian-Vault/99-Templates/Concept-Note-Template.md`
- Paper template: `../01-Obsidian-Vault/99-Templates/Paper-Summary-Template.md`

## Prompt Systems

- Prompt pack: `../02-Prompt-Library/Prompt-Pack.md`
- Prompt variable guide: `../02-Prompt-Library/Prompt-Variables-Guide.md`

## Code Systems

Three-language library overview: `../03-Coding-Library/README.md` (test count: TODO refresh)
- Python (v1: 11 modules; test count TODO refresh): `../03-Coding-Library/python/` — widest set, incl. `security_utils.py` defensive crypto
- Java (v1: 6 modules + TestRunner; test count TODO refresh): `../03-Coding-Library/java/` — campus placement idioms
- C++ (header-only; test count TODO refresh): `../03-Coding-Library/cpp/` — STL idioms, zero-warning build
- Python CLI demo of every module: `../03-Coding-Library/python/src/main.py`

## Academic Systems

- Assignment template: `../04-Academic-Toolkit/Assignment-Template.md`
- Semester planner: `../04-Academic-Toolkit/Semester-Planner.md`

## Research Systems

- Literature review template: `../05-Research-Toolkit/Literature-Review-Template.md`
- Experiment tracker: `../05-Research-Toolkit/Experiment-Tracker.md`

## Cybersecurity Systems

Career package:
- Career roadmap (roles, certs, 12-month plan): `../06-Cybersecurity-Toolkit/Cybersecurity-Career-Roadmap.md`
- Security interview questions (~40 with answer outlines): `../06-Cybersecurity-Toolkit/Security-Interview-Questions.md`
- Home lab setup guide: `../06-Cybersecurity-Toolkit/Home-Lab-Setup-Guide.md`
- CTF getting-started guide: `../06-Cybersecurity-Toolkit/CTF-Getting-Started-Guide.md`
- SOC analyst playbook (big-5 alert walkthroughs): `../06-Cybersecurity-Toolkit/SOC-Analyst-Playbook.md`

Reference:
- Linux security cheat sheet: `../06-Cybersecurity-Toolkit/Linux-Security-Cheat-Sheet.md`
- Windows security cheat sheet: `../06-Cybersecurity-Toolkit/Windows-Security-Cheat-Sheet.md`
- Network traffic analysis cheat sheet: `../06-Cybersecurity-Toolkit/Network-Traffic-Analysis-Cheat-Sheet.md`
- Common ports & protocols: `../06-Cybersecurity-Toolkit/Common-Ports-and-Protocols-Cheat-Sheet.md`
- OWASP checklist: `../06-Cybersecurity-Toolkit/Web-Security-Checklist-OWASP.md`
- Incident response playbook: `../06-Cybersecurity-Toolkit/Incident-Response-Playbook.md`
- Threat model template: `../06-Cybersecurity-Toolkit/Threat-Model-Template.md`

## Developer Systems

- README template: `../07-Developer-Toolkit/README-Template.md`
- PR template: `../07-Developer-Toolkit/Pull-Request-Template.md`
- ADR template: `../15-Decision-Records/ADR-Template.md`
- Issue template: `../07-Developer-Toolkit/Issue-Template.md`
- API doc template: `../07-Developer-Toolkit/API-Documentation-Template.md`
- Git cheat sheet: `../07-Developer-Toolkit/Git-Cheat-Sheet.md`
- Python stdlib cheat sheet: `../07-Developer-Toolkit/Python-Stdlib-Cheat-Sheet.md`
- SQL cheat sheet: `../07-Developer-Toolkit/SQL-Cheat-Sheet.md`

## Automation Systems

- Scaffold script: `../08-Automation-Toolkit/scripts/scaffold_project.py`
- File organizer: `../08-Automation-Toolkit/scripts/organize_files.py`
- Backup script: `../08-Automation-Toolkit/scripts/backup_engineering_os.ps1`
- Bootstrap to new machine: `../08-Automation-Toolkit/scripts/bootstrap_engineering_os.py`
- Vault note-pack generator: `../08-Automation-Toolkit/scripts/generate_note_pack.py`

## AI + Career Systems

- Prompt engineering guide: `../09-AI-Toolkit/Prompt-Engineering-Guide.md`
- RAG playbook: `../09-AI-Toolkit/RAG-Playbook.md`
- LLM evaluation framework: `../09-AI-Toolkit/LLM-Evaluation-Framework.md`
- Model comparison template: `../09-AI-Toolkit/Model-Comparison-Template.md`
- Internship tracker: `../10-Career-Toolkit/Internship-Application-Tracker.csv`
- Interview roadmap (12-week plan): `../10-Career-Toolkit/Technical-Interview-Roadmap.md`
- STAR story bank: `../10-Career-Toolkit/STAR-Story-Template.md`
- Cold email templates (5 scenarios): `../10-Career-Toolkit/Cold-Email-Templates.md`

## Project Templates

- FastAPI service (Docker + tests): `../11-Project-Templates/FastAPI-Service-Template/README.md`
- Docker worker microservice: `../11-Project-Templates/Docker-Microservice-Template/README.md`
- Secure coding examples (runnable): `../11-Project-Templates/Secure-Coding-Examples/README.md`

## Vault Note Pack

- Prelinked concept notes (v1 counts historical, TODO refresh): `../01-Obsidian-Vault/10-CS-Core/`, `20-Cybersecurity/`, `30-AI-ML/`, `40-Interview-Prep/`
- All notes are `status: evergreen` — Core Idea, Details with examples, Interview Angle, Related links filled
- Hub indexes: `../01-Obsidian-Vault/00-Indexes/` (all 6 hubs from Home, each with practice loop + planned-notes queue)
- Extend with new seeds: `python ../08-Automation-Toolkit/scripts/generate_note_pack.py`
