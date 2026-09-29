import matter from 'gray-matter';
import { inferDomain } from '../../src/lib/domains';
import { createSlugger, toSlug } from '../../src/lib/slug';
import type { DocMeta, DocPayload, GraphData, GraphEdge, Heading, SearchEntry } from '../../src/types';

export interface SourceFile {
  /** repo-relative POSIX path */
  path: string;
  raw: string;
}

export interface ParsedDoc {
  meta: Omit<DocMeta, 'backlinks' | 'outgoing'>;
  body: string;
  wikilinks: { target: string; slug: string }[];
  mdLinks: string[];
  warnings: string[];
}

export interface BuildResult {
  docs: DocPayload[];
  index: DocMeta[];
  search: SearchEntry[];
  graph: GraphData;
  errors: string[];
  warnings: string[];
  unresolvedWikilinks: { from: string; target: string }[];
  brokenMdLinks: { from: string; href: string }[];
}

const FENCE_RE = /^(```|~~~)[\s\S]*?^\1[^\n]*$/gm;

/** Remove fenced code blocks and inline code so links inside code are ignored. */
export function stripCode(md: string): string {
  return md.replace(FENCE_RE, '').replace(/`[^`\n]*`/g, '');
}

export function extractWikilinks(md: string): { target: string; label?: string }[] {
  const out: { target: string; label?: string }[] = [];
  const re = /\[\[([^\]|#\n]+)(?:#[^\]|\n]*)?(?:\|([^\]\n]+))?\]\]/g;
  for (const m of stripCode(md).matchAll(re)) {
    out.push({ target: (m[1] ?? '').trim(), label: m[2]?.trim() });
  }
  return out;
}

export function extractMdLinks(md: string): string[] {
  const out: string[] = [];
  const re = /\]\(([^)\s]+?\.md)(#[^)\s]*)?(?:\s+"[^"]*")?\)/g;
  for (const m of stripCode(md).matchAll(re)) {
    const href = m[1] ?? '';
    if (/^[a-z]+:/i.test(href)) continue;
    out.push(href);
  }
  return out;
}

export function extractTitle(body: string, filePath: string): string {
  const m = stripCode(body).match(/^#\s+(.+?)\s*#*\s*$/m);
  if (m?.[1]) return m[1].trim();
  const base = filePath.split('/').pop() ?? filePath;
  return base.replace(/\.md$/i, '').replace(/[-_]+/g, ' ');
}

export function extractHeadings(body: string): Heading[] {
  const slugger = createSlugger();
  const out: Heading[] = [];
  for (const line of body.replace(FENCE_RE, '').split('\n')) {
    const m = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const depth = (m[1] ?? '').length;
    const text = (m[2] ?? '').replace(/\[\[([^\]|]+)\|?([^\]]*)\]\]/g, (_s, a: string, b: string) => b || a);
    const id = slugger(text);
    if (depth >= 2 && depth <= 3) out.push({ depth, text, id });
  }
  return out;
}

export function countTasks(body: string): number {
  return (body.replace(FENCE_RE, '').match(/^\s*[-*+]\s+\[[ xX]\]\s/gm) ?? []).length;
}

/** Plain text for search: strip code, markup, links. */
export function stripMarkdown(body: string, limit = 5000): string {
  const text = body
    .replace(FENCE_RE, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_s, a: string, b?: string) => b ?? a)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^[#>\-*+|\s]+/gm, '')
    .replace(/[*_~|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const sp = cut.lastIndexOf(' ');
  return sp > limit * 0.8 ? cut.slice(0, sp) : cut;
}

export function isReadme(path: string): boolean {
  return /(^|\/)readme\.md$/i.test(path);
}

/** Slug: explicit frontmatter `slug`, else file name; READMEs derive from their folder path. */
export function slugFor(path: string, explicit?: unknown): string {
  if (typeof explicit === 'string' && explicit.trim()) return toSlug(explicit);
  if (isReadme(path)) {
    const dirs = path.split('/').slice(0, -1);
    return toSlug([...dirs, 'readme'].join('-'));
  }
  return toSlug(path.split('/').pop() ?? path);
}

function asString(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') return v.trim();
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  return undefined;
}

function asList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(asString).filter((s): s is string => !!s);
  if (typeof v === 'string' && v.trim()) return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function inferType(path: string): string {
  const name = (path.split('/').pop() ?? '').toLowerCase();
  if (isReadme(path) || /index/.test(name)) return 'index';
  if (/checklist/.test(name)) return 'checklist';
  if (/template/.test(name)) return 'template';
  if (/cheat-?sheet/.test(name)) return 'cheatsheet';
  if (/roadmap/.test(name)) return 'roadmap';
  if (/playbook/.test(name)) return 'playbook';
  if (/tracker/.test(name)) return 'tracker';
  return 'guide';
}

function inferCategory(path: string): string {
  const parts = path.split('/');
  if (parts.length > 2) return toSlug((parts[parts.length - 2] ?? 'general').replace(/^\d\d-/, ''));
  return 'general';
}

/**
 * Fallback for frontmatter that is not valid YAML (typically unquoted `title: A: B`).
 * Splits each line on the FIRST ": " and understands `[a, b]` inline lists.
 */
export function lenientFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!m) return { data: {}, body: raw };
  const data: Record<string, unknown> = {};
  for (const line of (m[1] ?? '').split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = (kv[2] ?? '').replace(/\s+#.*$/, '').trim();
    if (/^\[.*\]$/.test(v)) {
      data[kv[1]!] = v.slice(1, -1).split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      continue;
    }
    v = v.replace(/^["']|["']$/g, '');
    data[kv[1]!] = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
  }
  return { data, body: raw.slice(m[0].length) };
}

export function parseDoc(file: SourceFile): ParsedDoc {
  const warnings: string[] = [];
  let data: Record<string, unknown> = {};
  let body = file.raw;
  try {
    // gray-matter caches by input string; pass a fresh options object to disable cache side effects
    const parsed = matter(file.raw, {});
    data = (parsed.data ?? {}) as Record<string, unknown>;
    body = parsed.content;
  } catch (e) {
    const lenient = lenientFrontmatter(file.raw);
    data = lenient.data;
    body = lenient.body;
    warnings.push(
      `${file.path}: invalid YAML frontmatter (${(e as Error).message.split('\n')[0]}); parsed leniently — quote values containing ": "`,
    );
  }
  const slug = slugFor(file.path, data.slug);
  const title = asString(data.title) || extractTitle(body, file.path);
  const orderRaw = data.order;
  const meta: ParsedDoc['meta'] = {
    slug,
    title,
    description: asString(data.description) ?? '',
    domain: asString(data.domain) || inferDomain(file.path),
    category: asString(data.category) || inferCategory(file.path),
    type: asString(data.type) || inferType(file.path),
    difficulty: asString(data.difficulty),
    status: asString(data.status) || 'draft',
    tags: asList(data.tags),
    prerequisites: asList(data.prerequisites).map(toSlug),
    related: asList(data.related).map(toSlug),
    order: typeof orderRaw === 'number' ? orderRaw : undefined,
    path: file.path,
    headings: extractHeadings(body),
    wordCount: stripMarkdown(body, Infinity).split(/\s+/).filter(Boolean).length,
    taskCount: countTasks(body),
  };
  for (const k of ['pattern', 'source', 'scale', 'adr_status', 'date', 'role'] as const) {
    const v = asString(data[k]);
    if (v) meta[k] = v;
  }
  const langs = asList(data.languages);
  if (langs.length) meta.languages = langs;
  const wikilinks = extractWikilinks(body).map((w) => ({ target: w.target, slug: toSlug(w.target) }));
  return { meta, body, wikilinks, mdLinks: extractMdLinks(body), warnings };
}

function resolveRelative(fromPath: string, href: string): string {
  let clean = href.split('#')[0] ?? '';
  try {
    clean = decodeURIComponent(clean);
  } catch {
    /* keep raw */
  }
  const segs = clean.startsWith('/') ? [] : fromPath.split('/').slice(0, -1);
  for (const s of clean.replace(/^\//, '').split('/')) {
    if (s === '..') segs.pop();
    else if (s && s !== '.') segs.push(s);
  }
  return segs.join('/');
}

export function buildContent(files: SourceFile[]): BuildResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsed = files.map(parseDoc);
  const bySlug = new Map<string, ParsedDoc>();
  const byPath = new Map<string, string>();
  const byTitle = new Map<string, string>();
  for (const p of parsed) {
    warnings.push(...p.warnings);
    const existing = bySlug.get(p.meta.slug);
    if (existing) {
      errors.push(`Duplicate slug "${p.meta.slug}": ${existing.meta.path} and ${p.meta.path}`);
      continue;
    }
    bySlug.set(p.meta.slug, p);
    byPath.set(p.meta.path.toLowerCase(), p.meta.slug);
    if (!byTitle.has(toSlug(p.meta.title))) byTitle.set(toSlug(p.meta.title), p.meta.slug);
  }

  const resolve = (slug: string) => (bySlug.has(slug) ? slug : byTitle.get(slug));
  const unresolvedWikilinks: BuildResult['unresolvedWikilinks'] = [];
  const brokenMdLinks: BuildResult['brokenMdLinks'] = [];
  const outgoing = new Map<string, Set<string>>();
  const linkMaps = new Map<string, Record<string, string>>();
  const edges: GraphEdge[] = [];
  const edgeKey = new Set<string>();
  const addEdge = (source: string, target: string, kind: GraphEdge['kind']) => {
    if (source === target) return;
    const k = [source, target].sort().join('|');
    if (edgeKey.has(k)) return;
    edgeKey.add(k);
    edges.push({ source, target, kind });
  };

  for (const p of bySlug.values()) {
    const out = new Set<string>();
    for (const w of p.wikilinks) {
      const r = resolve(w.slug);
      if (r) out.add(r);
      else unresolvedWikilinks.push({ from: p.meta.path, target: w.target });
    }
    const linkMap: Record<string, string> = {};
    for (const href of p.mdLinks) {
      const target = byPath.get(resolveRelative(p.meta.path, href).toLowerCase());
      if (target) {
        linkMap[href] = target;
        out.add(target);
      } else brokenMdLinks.push({ from: p.meta.path, href });
    }
    linkMaps.set(p.meta.slug, linkMap);
    for (const kind of ['prerequisites', 'related'] as const) {
      p.meta[kind] = p.meta[kind].map((s) => {
        const r = resolve(s);
        if (!r) warnings.push(`${p.meta.path}: ${kind} entry "${s}" does not match any note`);
        return r ?? s;
      });
      for (const s of p.meta[kind]) if (bySlug.has(s)) addEdge(p.meta.slug, s, kind === 'prerequisites' ? 'prerequisite' : 'related');
    }
    for (const t of out) addEdge(p.meta.slug, t, 'link');
    outgoing.set(p.meta.slug, out);
  }

  const backlinks = new Map<string, Set<string>>();
  for (const [from, outs] of outgoing) {
    for (const to of outs) {
      if (to === from) continue;
      if (!backlinks.has(to)) backlinks.set(to, new Set());
      backlinks.get(to)!.add(from);
    }
  }

  const docs: DocPayload[] = [];
  const index: DocMeta[] = [];
  const search: SearchEntry[] = [];
  const sorted = [...bySlug.values()].sort((a, b) => a.meta.path.localeCompare(b.meta.path));
  for (const p of sorted) {
    const meta: DocMeta = {
      ...p.meta,
      backlinks: [...(backlinks.get(p.meta.slug) ?? [])].sort(),
      outgoing: [...(outgoing.get(p.meta.slug) ?? [])].filter((s) => s !== p.meta.slug).sort(),
    };
    index.push(meta);
    docs.push({ ...meta, body: p.body, linkMap: linkMaps.get(p.meta.slug) ?? {} });
    search.push({
      slug: meta.slug, title: meta.title, description: meta.description, tags: meta.tags,
      domain: meta.domain, type: meta.type, text: stripMarkdown(p.body, 2000),
    });
  }
  const graph: GraphData = {
    nodes: index.map((d) => ({ id: d.slug, title: d.title, domain: d.domain, type: d.type })),
    edges,
  };
  return { docs, index, search, graph, errors, warnings, unresolvedWikilinks, brokenMdLinks };
}
