/**
 * Content pipeline: numbered Markdown folders -> public/content/*.json
 * Usage: tsx scripts/build-content.ts [--check]
 *   --check  exit non-zero on unresolved wikilinks or broken relative .md links
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildContent, type SourceFile } from './lib/content';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'content');
const SKIP = new Set(['node_modules', '.opencode', 'dist', '.git']);
const check = process.argv.includes('--check');

function walk(dir: string, acc: string[]): void {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return; // folder vanished while another process was writing
  }
  for (const name of entries) {
    if (SKIP.has(name) || name.startsWith('.')) continue;
    const full = join(dir, name);
    try {
      const st = statSync(full);
      if (st.isDirectory()) walk(full, acc);
      else if (name.toLowerCase().endsWith('.md')) acc.push(full);
    } catch {
      continue;
    }
  }
}

const files: string[] = [];
for (const name of readdirSync(ROOT)) {
  if (/^\d\d-/.test(name) && statSync(join(ROOT, name)).isDirectory()) walk(join(ROOT, name), files);
}

const sources: SourceFile[] = [];
for (const f of files) {
  try {
    sources.push({ path: relative(ROOT, f).split('\\').join('/'), raw: readFileSync(f, 'utf8') });
  } catch (e) {
    console.warn(`skip ${f}: ${(e as Error).message}`);
  }
}

const r = buildContent(sources);

if (!check) {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, 'docs'), { recursive: true });
  writeFileSync(join(OUT, 'index.json'), JSON.stringify(r.index));
  writeFileSync(join(OUT, 'search.json'), JSON.stringify(r.search));
  writeFileSync(join(OUT, 'graph.json'), JSON.stringify(r.graph));
  for (const d of r.docs) writeFileSync(join(OUT, 'docs', `${d.slug}.json`), JSON.stringify(d));
}

console.log(`content: ${r.docs.length} docs, ${r.graph.edges.length} edges${check ? ' (check only)' : ' -> public/content/'}`);
for (const w of r.warnings) console.warn(`  warn: ${w}`);
if (r.unresolvedWikilinks.length) {
  console.warn(`  ${r.unresolvedWikilinks.length} unresolved wikilink(s):`);
  for (const u of r.unresolvedWikilinks) console.warn(`    ${u.from} -> [[${u.target}]]`);
}
if (r.brokenMdLinks.length) {
  console.warn(`  ${r.brokenMdLinks.length} broken relative .md link(s):`);
  for (const b of r.brokenMdLinks) console.warn(`    ${b.from} -> ${b.href}`);
}
if (r.errors.length) {
  for (const e of r.errors) console.error(`  ERROR: ${e}`);
  process.exit(1);
}
if (check && (r.unresolvedWikilinks.length || r.brokenMdLinks.length)) {
  console.error('check:links failed');
  process.exit(1);
}
