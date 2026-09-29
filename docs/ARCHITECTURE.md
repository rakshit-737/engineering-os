# Architecture

Engineering OS is a static React + TypeScript app over a folder of Markdown notes.

```
numbered folders (*.md) ──► scripts/build-content.ts ──► public/content/*.json ──► React UI (HashRouter)
                                                                              └─► localStorage (eos:v1:*)
```

## Content pipeline

- `scripts/build-content.ts` walks every top-level folder matching `^\d\d-` (skipping `node_modules`, `.opencode`, `dist`, dot-folders) and reads each `.md` file. It runs automatically via `predev` / `prebuild`.
- All parsing logic lives in `scripts/lib/content.ts` as pure functions (unit-tested): frontmatter, title fallback, domain inference, slugging, wikilinks, relative-link resolution, headings, task counts, search text.
- Sources are normalised first (UTF-8 BOM stripped, CRLF/CR → LF). Files over 1 MB (`MAX_SOURCE_BYTES`) are a hard error; empty files warn.
- Frontmatter is parsed with `gray-matter`. Invalid YAML (typically an unquoted `title: A: B`) falls back to a lenient line parser (also understands `[a, b]` and tab/space-indented `- item` block lists) and emits a warning instead of dropping metadata.
- **Slugs:** explicit `slug:` frontmatter wins; otherwise the file name, lower-cased. `README.md` files without `slug` get a path-derived slug (`03-coding-library-python-readme`). Duplicate slugs are a hard error (exit 1).
- **Wikilinks** `[[Name]]` / `[[Name|label]]` resolve case-insensitively by slug, then by title. Links inside fenced code and inline code (e.g. mermaid `A[[x]]`) are ignored. Unresolved wikilinks, broken relative `.md` links, and frontmatter `prerequisites`/`related` entries that match no note are warnings for `npm run content` and failures for `npm run check:links` (unresolved prerequisites/related are also dropped from the output so the UI never renders dead links).
- Output (git-ignored, regenerated): `index.json` (metadata incl. headings, backlinks, outgoing links), `search.json` (title, slug, tags, h2/h3 headings, description + plaintext capped at 1,200 chars per doc, ~0.8 MB total), `graph.json` (nodes + deduplicated edges from prerequisites/related/links), `docs/<slug>.json` (metadata + raw Markdown + resolved relative-link map).

## Routing: HashRouter

GitHub Pages cannot rewrite unknown paths to `index.html`. `BrowserRouter` would need a `404.html` redirect hack and still break deep links for crawlers/refresh edge cases. `HashRouter` works on any static host with zero config. Vite uses `base: '/engineering-os/'` for builds and `/` in dev; content is fetched relative to `import.meta.env.BASE_URL`. Every page component is `React.lazy`-loaded and wrapped in a per-route `ErrorBoundary`.

## Rendering & security model

- All sanitisation lives in `src/lib/sanitize.ts` (one DOMPurify config + one hook, shared by Markdown and mermaid). Markdown → HTML with `marked`, then **always** `sanitizeHtml` (no `style`, `script`, `iframe`, `form`, `object`, `embed`, `base`, `meta`, `link`, no `style` attributes, only `http(s)`, `mailto`, relative and `#` URLs; non-checkbox `<input>` removed). External links get `target=_blank rel="noopener noreferrer"`.
- Wikilinks become `#/doc/<slug>` links; in-page anchors are rewritten and scrolled via JS so they do not fight the hash router.
- Code highlighting uses `highlight.js/lib/core` with nine languages, dynamically imported only when a page has code.
- Mermaid is dynamically imported only when a page has a mermaid block, initialised with `securityLevel: 'strict'` and the current theme; its SVG output is sanitized again with `sanitizeSvg` (keeps `<style>`/`style=` which mermaid needs; strips scripts, handlers, `javascript:` URLs; SVG `<a>` gets the same target/rel treatment).
- **CSP** (production only, injected as `<meta>` by the `eos-pages` Vite plugin): `default-src 'self'; script-src 'self' 'sha256-<theme bootstrap>'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'none'`. `style-src 'unsafe-inline'` is required by mermaid and React style props; script execution stays locked to same-origin + the one hashed inline script. `frame-ancestors` cannot be set via `<meta>` and GitHub Pages does not allow custom headers, so clickjacking protection is not available on this host.
- User data never leaves the browser. No analytics, no remote fonts, no third-party requests.

## State model (localStorage)

- One key per slice: `eos:v1:<slice>` (e.g. `eos:v1:docStatus`, `eos:v1:projects`).
- **Migrations:** `STATE_VERSION` + `MIGRATIONS` in `storage.ts`. Imports run through `migrate()` before validation; a missing version is v1, a newer version is rejected with a clear error (never silently truncated). For v2: add `MIGRATIONS[1]`, bump `STATE_VERSION`, switch the prefix to `eos:v2:` and on first load read `eos:v1:*`, migrate, write v2, keep v1 keys until the next export.
- **Quota:** writes that throw (quota, private mode) keep in-memory state and set `getPersistError()` / `usePersistError()` so the UI can prompt an export. Imports above 5 MB are rejected before `JSON.parse`.
- Every read is wrapped in try/catch and validated with `zod` (`src/lib/storage.ts`). Arrays are filtered item-by-item and records entry-by-entry, so one corrupt record does not wipe a slice. Unavailable/throwing storage degrades to in-memory defaults.
- Import is strict: the whole payload must validate or nothing changes; a confirm dialog shows what will be replaced. Export produces `{ app, exportedAt, state }`.
- `src/lib/store.ts` is a tiny external store (`useSyncExternalStore`) with cross-tab sync via the `storage` event.
- Calculations (progress, pulse, Today planner, CGPA, checklist completion, metrics) are pure functions in `src/lib/progress.ts`.
- Checklist items are keyed `slug#index` (index = order of task checkboxes in the rendered note). Reordering tasks in a note shifts keys; that trade-off keeps Markdown free of IDs.

## Offline

`public/sw.js` (registered only in production, scope = base path). The build stamps `VERSION` with a hash of `index.html` + content payloads, so every deploy gets new caches and `activate` deletes old `eos-*` caches.

- Navigations and `content/*.json`: network-first with `cache: 'no-cache'` (revalidates past GitHub Pages' 10-minute HTTP cache), cached copy only offline; an offline page if nothing is cached.
- `assets/*` (content-hashed): cache-first.
- Other in-scope files: stale-while-revalidate.
- Only same-origin `200` `basic` responses are cached (no opaque, error or 404 responses).

## GitHub Pages

- `base: '/engineering-os/'`; the build copies `index.html` to `404.html` so mistyped paths still boot the app; `public/.nojekyll` is shipped.
- Deploy workflow: `contents: read` at top level, `pages: write` + `id-token: write` only on the deploy job, `concurrency: pages` without cancellation, all actions pinned to commit SHAs (Dependabot keeps them current).
- CI: `npm audit --audit-level=high`, `check:links`, lint, typecheck, tests, build; weekly scheduled run also does an informational external-link check (lychee).

## Dependencies

| Package | Why |
|---|---|
| react, react-dom | UI |
| react-router-dom | HashRouter + nested routes |
| marked | Fast, small GFM parser with renderer hooks |
| dompurify | HTML sanitization (the security boundary) |
| highlight.js | Syntax highlighting; only `core` + 9 languages are loaded, lazily |
| mermaid | Diagrams; lazy chunk loaded only on pages with diagrams |
| minisearch | Small client-side full-text search. Boosts title > slug/tags > headings > description > body; prefix for 3+ chars, fuzzy only for 5+ chars (1 edit, 2 for 8+) with low weight so acronyms like `cap`/`raft`/`jwt` don't pull in typo-neighbours. Regression-tested against the real index in `scripts/search-quality.test.ts` |
| zod | Runtime validation for stored and imported data |
| lucide-react | Tree-shaken icons |
| dev: vite, @vitejs/plugin-react, typescript, tsx | Build, dev server, running the content script |
| dev: gray-matter | Frontmatter parsing (build time only, not shipped) |
| dev: vitest, jsdom, @testing-library/* | Tests |
| dev: eslint, typescript-eslint, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y, globals | Linting incl. accessibility |

No UI kit, no CSS framework, no chart library, no graph library: the graph uses a small hand-written force layout (`src/lib/graphLayout.ts`) on SVG; metrics use plain SVG bars.
