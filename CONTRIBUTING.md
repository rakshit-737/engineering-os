# Contributing

## Setup

```bash
npm install
npm run dev        # local dev server (regenerates content index first)
npm run build      # production build into dist/
npm run lint
npm run typecheck
npm test
npm run check:links
```

## Adding content

1. Pick the owning folder (see `README.md`).
2. Follow [docs/CONTENT-SCHEMA.md](docs/CONTENT-SCHEMA.md): frontmatter, unique `Title-Case` file name, `[[wikilinks]]`, Mermaid diagrams, `- [ ]` checklists.
3. Prefer concrete examples, tradeoffs, failure modes and interview questions. Write `> TODO:` rather than inventing facts.
4. Run `npm run check:links` before opening a PR.

## Commits

Conventional style: `feat(scope): ...`, `fix(scope): ...`, `docs(scope): ...`, `content(scope): ...`.
