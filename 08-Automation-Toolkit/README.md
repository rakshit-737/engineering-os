---
title: Automation Toolkit
slug: automation-toolkit
description: Scripts and CI workflow templates that remove repeated manual work.
domain: automation
category: overview
type: index
difficulty: beginner
status: evergreen
tags: [automation, ci]
prerequisites: []
related: [Checklist-Deployment]
order: 1
---
# Automation Toolkit

This folder contains scripts and workflows that reduce repeated manual work.

## Scripts

- `scripts/scaffold_project.py` - create starter project structure from template
- `scripts/organize_files.py` - organize files in a directory by extension
- `scripts/backup_engineering_os.ps1` - create timestamped zip backups

## GitHub Actions

- `github-actions/python-ci-template.yml` - lint + test starter workflow

## Usage Principle

If you repeat a task more than twice, automate it and document usage.