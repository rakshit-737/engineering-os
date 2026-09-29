# Development

Requirements: Node 20+ (CI uses 22), npm.

```bash
npm install
npm run dev          # builds content, starts Vite at http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run content` | Regenerate `public/content/` from the Markdown folders (prints warnings) |
| `npm run check:links` | Fail on unresolved wikilinks or broken relative `.md` links (no files written) |
| `npm run lint` | ESLint (TypeScript, React hooks, jsx-a11y) |
| `npm run typecheck` | `tsc -b` in strict mode |
| `npm test` | Vitest (jsdom) |
| `npm run build` | Content + typecheck + production build into `dist/` (base `/engineering-os/`) |
| `npm run preview` | Serve `dist/` at `http://localhost:4173/engineering-os/` |

## Writing content

Follow `docs/CONTENT-SCHEMA.md`. Quote any frontmatter value that contains `: ` (e.g. `title: "Checklist: API Design"`); the pipeline tolerates it but warns.

## Layout

```
scripts/build-content.ts     CLI: walk folders, write JSON
scripts/lib/content.ts       pure parsing functions (+ tests)
src/lib/                     markdown, search, storage, store, progress, graph layout, domains
src/components/              Layout, CommandPalette, CrudTable, Markdown, ui primitives
src/pages/                   one lazy-loaded component per route
src/styles/app.css           design tokens + all styles
public/                      favicon, manifest, service worker (content/ is generated)
```

## Adding a page

1. Create `src/pages/Foo.tsx` with a default export.
2. Register a lazy route in `src/App.tsx`.
3. Add it to `src/lib/nav.ts` (sidebar + command palette).

## Adding persisted state

Add the type in `src/types/index.ts`, the schema + default in `src/lib/storage.ts` (the compile-time check fails if they disagree), and read/write it with `useAppState` / `setSlice`.

## Deploying

Pushing to `master` (or `main`) runs `.github/workflows/deploy.yml`. In the repository settings, set **Pages → Source** to **GitHub Actions**.
