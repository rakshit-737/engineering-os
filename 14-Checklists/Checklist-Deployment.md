---
title: "Checklist: Deployment"
description: Pre-deploy, deploy, and post-deploy checks for shipping a service change safely.
domain: checklists
category: release
type: checklist
difficulty: intermediate
status: evergreen
tags: [deployment, devops, release]
prerequisites: []
related: [Pattern-Canary-Release, Pattern-Blue-Green-Deployment, Pattern-Feature-Flags]
order: 40
---
# Checklist: Deployment

Run per production deployment. The goal is that every deploy is boring and reversible.

## Before

- [ ] Confirm CI is green on the exact commit being deployed (lint, tests, build, security scans).
- [ ] Confirm the artifact is immutable and referenced by digest or version tag, not `latest`.
- [ ] Review the diff since the last deploy, including dependency bumps.
- [ ] Check that database migrations are backward compatible with the currently running version.
- [ ] Gate risky new behavior behind a flag that defaults to off ([[Pattern-Feature-Flags]]).
- [ ] Verify new configuration and secrets exist in the target environment.
- [ ] Write the rollback command down before starting.
- [ ] Announce the deploy window in the team channel if users may notice.
- [ ] Avoid deploying right before you go offline.

## During

- [ ] Run migrations first (expand phase) and verify they completed.
- [ ] Roll out progressively ([[Pattern-Canary-Release]] or [[Pattern-Blue-Green-Deployment]]).
- [ ] Watch error rate, latency, and saturation dashboards for the new version during rollout.
- [ ] Run smoke tests against the new version before sending it full traffic.
- [ ] Abort and roll back on threshold breach instead of debugging live.

## After

- [ ] Verify key user journeys end to end in production.
- [ ] Check logs for new error signatures introduced by this version.
- [ ] Confirm background jobs and consumers are processing (queue depth not growing).
- [ ] Enable flags gradually and record who flipped what.
- [ ] Tag the release and update the changelog.
- [ ] Schedule the contract phase of migrations (dropping old columns) for a later deploy.
- [ ] Record any manual step you had to do, then automate it.

Back to [[Checklists-Index]].
