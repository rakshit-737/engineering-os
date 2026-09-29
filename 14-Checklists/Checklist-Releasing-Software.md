---
title: "Checklist: Releasing Software"
description: Versioning, changelog, artifact, and communication steps for cutting a release.
domain: checklists
category: release
type: checklist
difficulty: intermediate
status: evergreen
tags: [release, versioning, semver]
prerequisites: []
related: [Checklist-Deployment, Checklist-Preparing-a-GitHub-Repository]
order: 90
---
# Checklist: Releasing Software

For libraries, CLIs, and versioned services. For rolling a service change to production, also run [[Checklist-Deployment]].

## Prepare

- [ ] Decide the version bump with SemVer: breaking change -> major, new feature -> minor, fix -> patch.
- [ ] Confirm every breaking change has a migration note.
- [ ] Update `CHANGELOG.md` (Keep a Changelog format: Added, Changed, Deprecated, Removed, Fixed, Security).
- [ ] Bump version numbers in all manifests (`package.json`, `pyproject.toml`, etc.) in one commit.
- [ ] Run the full test suite, including integration tests, on the release commit.
- [ ] Update docs and README examples that changed behavior.

## Build

- [ ] Build artifacts in CI from the tagged commit, never from a laptop.
- [ ] Generate checksums (SHA-256) for downloadable artifacts.
- [ ] Sign artifacts or container images (Sigstore cosign) where consumers verify them.
- [ ] Generate an SBOM (Syft or the build tool's SBOM output).
- [ ] Scan artifacts for known vulnerabilities before publishing.

## Publish

- [ ] Create an annotated git tag `vX.Y.Z` on the release commit.
- [ ] Publish to the registry (PyPI, npm, GHCR) using CI with trusted publishing or scoped tokens.
- [ ] Create a GitHub Release with the changelog section and artifacts attached.
- [ ] Verify the published package installs in a clean environment.

## After

- [ ] Announce the release with highlights and upgrade notes.
- [ ] Watch issue tracker and error reports for regressions for the next few days.
- [ ] Open issues for anything deferred from this release.
- [ ] If a release is broken, publish a fixed patch release rather than overwriting the tag.

Back to [[Checklists-Index]].
