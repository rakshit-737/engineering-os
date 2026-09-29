---
title: Career Toolkit README
description: What lives in the Career Toolkit folder and why the CSV tracker is an offline fallback.
domain: career
category: applications
type: guide
difficulty: beginner
status: evergreen
tags: [readme, tracker]
related: [Career-Index, Application-Tracker-Guide]
order: 99
---

# Career Toolkit README

Start at [[Career-Index]].

## Folder layout

- `Resume/` -- resume engine, tailoring, review checklist, project description bank.
- `Interviews/` -- interview engine: coding, CS fundamentals, system design, security, behavioral, project defense, HR.
- `Applications/` -- application pipeline guide.
- `Roadmaps/` -- role roadmaps (skill-based, project-driven).
- Root -- templates: [[Cold-Email-Templates]], [[STAR-Story-Template]], [[Technical-Interview-Roadmap]].

## About `Internship-Application-Tracker.csv`

The **primary** application tracker is the web app at `/career`. The CSV in this folder is an **offline fallback**: use it when the app is not running, or to keep a plain-text copy you can open in any spreadsheet. Columns: `Company, Role, Location, ApplicationDate, Status, Referral, Round, Notes, NextAction, NextActionDate`. Use the same stage names as the app (see [[Application-Tracker-Guide]]) so the two are easy to reconcile. Do not commit personal contact details you would not want public.
