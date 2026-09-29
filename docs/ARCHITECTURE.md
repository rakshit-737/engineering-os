# Architecture

Engineering OS is a static React + TypeScript app over a folder of Markdown notes.

```
numbered folders (*.md) ──► scripts/build-content.ts ──► public/content/*.json ──► React UI (HashRouter)
                                                                              └─► localStorage (eos:v1:*)
```

## Content pipeline

- `scripts/build-content.ts` walks every top-level folder matching `^\d\d-` (skipping `node_modules`, `.opencode`, `dist`, dot-folders) and reads each `.md` file. It runs automatically via `predev` / `prebuild`.
- All parsing logic lives in `scripts/lib/content.ts` as pure functions (unit-tested): frontmatter, title fallback, domain inference, slugging, wikilinks, relative-link resolution, headings, task counts, search text.
- Frontmatter is parsed with `gray-matter`. Invalid YAML (typically an unquoted `title: A: B`) falls back to a lenient line parser and emits a warning instead of dropping metadata.
- **Slugs:** explicit `slug:` frontmatter wins; otherwise the file name, lower-cased. `README.md` files without `slug` get a path-derived slug (`03-coding-library-python-readme`). Duplicate slugs are a hard error (exit 1).
- **Wikilinks** `[[Name]]` / `[[Name|label]]` resolve case-insensitively by slug, then by title. Links inside fenced code and inline code (e.g. mermaid `A[[x]]`) are ignored. Unresolved wikilinks and broken relative `.md` links are warnings for `npm run content` and failures for `npm run check:links`.
- Output (git-ignored, regenerated): `index.json` (metadata incl. headings, backlinks, outgoing links), `search.json` (plaintext capped at ~2k chars per doc), `graph.json` (nodes + deduplicated edges from prerequisites/related/links), `docs/<slug>.json` (metadata + raw Markdown + resolved relative-link map).

## Routing: HashRouter

GitHub Pages cannot rewrite unknown paths to `index.html`. `BrowserRouter` would need a `404.html` redirect hack and still break deep links for crawlers/refresh edge cases. `HashRouter` works on any static host with zero config. Vite uses `base: '/engineering-os/'` for builds and `/` in dev; content is fetched relative to `import.meta.env.BASE_URL`. Every page component is `React.lazy`-loaded and wrapped in a per-route `ErrorBoundary`.

## Rendering & security model

- Markdown → HTML with `marked`, then **always** `DOMPurify.sanitize` (no `style`, `script`, `iframe`, `form`, `object`, `embed`, no `style` attributes, only `http(s)`, `mailto`, relative and `#` URLs; non-checkbox `<input>` removed). External links get `target=_blank rel="noopener noreferrer"`.
- Wikilinks become `#/doc/<slug>` links; in-page anchors are rewritten and scrolled via JS so they do not fight the hash router.
- Code highlighting uses `highlight.js/lib/core` with nine languages, dynamically imported only when a page has code.
- Mermaid is dynamically imported only when a page has a mermaid block, initialised with `securityLevel: 'strict'` and the current theme; its SVG output is sanitized again.
- User data never leaves the browser. No analytics, no remote fonts, no third-party requests.

## State model (localStorage)

- One key per slice: `eos:v1:<slice>` (e.g. `eos:v1:docStatus`, `eos:v1:projects`). The `v1` namespace allows future migrations.
- Every read is wrapped in try/catch and validated with `zod` (`src/lib/storage.ts`). Arrays are filtered item-by-item and records entry-by-entry, so one corrupt record does not wipe a slice. Unavailable/throwing storage degrades to in-memory defaults.
- Import is strict: the whole payload must validate or nothing changes; a confirm dialog shows what will be replaced. Export produces `{ app, exportedAt, state }`.
- `src/lib/store.ts` is a tiny external store (`useSyncExternalStore`) with cross-tab sync via the `storage` event.
- Calculations (progress, pulse, Today planner, CGPA, checklist completion, metrics) are pure functions in `src/lib/progress.ts`.
- Checklist items are keyed `slug#index` (index = order of task checkboxes in the rendered note). Reordering tasks in a note shifts keys; that trade-off keeps Markdown free of IDs.

## Offline

`public/sw.js` (registered only in production, scope = base path): network-first for `content/*` and navigations with cache fallback; stale-while-revalidate for hashed assets.

## Dependencies

| Package | Why |
|---|---|
| react, react-dom | UI |
| react-router-dom | HashRouter + nested routes |
| marked | Fast, small GFM parser with renderer hooks |
| dompurify | HTML sanitization (the security boundary) |
| highlight.js | Syntax highlighting; only `core` + 9 languages are loaded, lazily |
| mermaid | Diagrams; lazy chunk loaded only on pages with diagrams |
| minisearch | Small client-side full-text search with fuzzy/prefix/boosting |
| zod | Runtime validation for stored and imported data |
| lucide-react | Tree-shaken icons |
| dev: vite, @vitejs/plugin-react, typescript, tsx | Build, dev server, running the content script |
| dev: gray-matter | Frontmatter parsing (build time only, not shipped) |
| dev: vitest, jsdom, @testing-library/* | Tests |
| dev: eslint, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y, globals | Linting incl. accessibility |

No UI kit, no CSS framework, no chart library, no graph library: the graph uses a small hand-written force layout (`src/lib/graphLayout.ts`) on SVG; metrics use plain SVG bars.
