---
title: Asset Manifest
description: Pointer to the live content inventory, with note counts per folder generated from the content index.
domain: command-center
category: navigation
type: index
difficulty: beginner
status: evergreen
tags: [navigation, inventory]
prerequisites: []
related: [Command-Center-Index, Home]
order: 90
---

# Asset Manifest

The repository README holds the canonical inventory (counts per domain and type, repository map, canonical index per folder). This note keeps only the per-folder note counts, which the README does not list.

Source: `public/content/index.json` after `npm run content` (2026-09-29): **501 notes**. Regenerate before quoting; counts drift as content is added.

| Folder | Notes | Canonical index |
|---|---:|---|
| `00-Command-Center` | 12 | [[Command-Center-Index]] |
| `01-Obsidian-Vault` | 107 | [[Home]] |
| `02-Prompt-Library` | 3 | [[Prompt-Library]] |
| `03-Coding-Library` | 58 | [[DSA-Index]] |
| `04-Academic-Toolkit` | 16 | [[Academic-Index]] |
| `05-Research-Toolkit` | 15 | [[Research-OS-Index]] |
| `06-Cybersecurity-Toolkit` | 56 | [[Security-Engineering-OS]] |
| `07-Developer-Toolkit` | 9 | [[Cheat-Sheet-Index]] |
| `08-Automation-Toolkit` | 1 | [[Automation-Toolkit]] |
| `09-AI-Toolkit` | 46 | [[AI-Engineering-Index]] |
| `10-Career-Toolkit` | 31 | [[Career-Index]] |
| `11-Project-Templates` | 3 | [[Project-Lab-Index]] |
| `12-System-Design` | 79 | [[System-Design-Index]], [[Case-Studies-Index]], [[LLD-Index]] |
| `13-Engineering-Patterns` | 32 | [[Patterns-Index]] |
| `14-Checklists` | 11 | [[Checklists-Index]] |
| `15-Decision-Records` | 9 | [[ADR-Index]] |
| `16-Project-Lab` | 13 | [[Project-Lab-Index]] |

Counts cover Markdown notes only. Source code, tests and non-Markdown assets (for example in `03-Coding-Library` and `11-Project-Templates`) are not counted here.
