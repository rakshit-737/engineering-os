import { describe, expect, it } from 'vitest';
import { buildContent, extractWikilinks, lenientFrontmatter, parseDoc, slugFor, stripMarkdown } from './content';
import { inferDomain } from '../../src/lib/domains';

const fm = (o: Record<string, string>) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${v}`).join('\n')}\n---\n`;

describe('parseDoc', () => {
  it('reads frontmatter fields', () => {
    const p = parseDoc({
      path: '12-System-Design/Rate-Limiting.md',
      raw: fm({ title: 'Rate Limiting', description: 'Limits', domain: 'system-design', category: 'hld', type: 'concept', tags: '[api, distributed]', prerequisites: '[Load-Balancing]' }) + '# Rate Limiting\n\n## Why\ntext\n',
    });
    expect(p.meta).toMatchObject({ slug: 'rate-limiting', title: 'Rate Limiting', domain: 'system-design', type: 'concept', tags: ['api', 'distributed'], prerequisites: ['load-balancing'] });
    expect(p.meta.headings).toEqual([{ depth: 2, text: 'Why', id: 'why' }]);
  });

  it('falls back to first heading, then filename, when frontmatter is missing', () => {
    expect(parseDoc({ path: '07-Developer-Toolkit/Git-Cheat-Sheet.md', raw: 'intro\n\n# Git Commands\n' }).meta.title).toBe('Git Commands');
    const bare = parseDoc({ path: '07-Developer-Toolkit/Git-Cheat-Sheet.md', raw: 'no heading' });
    expect(bare.meta.title).toBe('Git Cheat Sheet');
    expect(bare.meta.domain).toBe('developer');
    expect(bare.meta.type).toBe('cheatsheet');
    expect(bare.meta.status).toBe('draft');
  });

  it('parses invalid YAML (unquoted colon) leniently instead of dropping metadata', () => {
    const p = parseDoc({ path: '14-Checklists/Checklist-API.md', raw: '---\ntitle: Checklist: API Design\ndomain: checklists\ntags: [api, http]\norder: 3\n---\n# X\n' });
    expect(p.meta.title).toBe('Checklist: API Design');
    expect(p.meta.domain).toBe('checklists');
    expect(p.meta.tags).toEqual(['api', 'http']);
    expect(p.meta.order).toBe(3);
    expect(p.warnings[0]).toMatch(/invalid YAML/);
    expect(lenientFrontmatter('no fm').data).toEqual({});
  });

  it('counts task items outside code fences only', () => {
    const p = parseDoc({ path: '14-Checklists/A.md', raw: '- [ ] one\n- [x] two\n```\n- [ ] not a task\n```\n' });
    expect(p.meta.taskCount).toBe(2);
  });
});

describe('slugs', () => {
  it('honours explicit slug frontmatter', () => {
    expect(slugFor('03-Coding-Library/python/README.md', 'Python-Library')).toBe('python-library');
    const p = parseDoc({ path: '03-Coding-Library/README.md', raw: fm({ slug: 'coding-library' }) });
    expect(p.meta.slug).toBe('coding-library');
  });
  it('derives README slugs from folder path', () => {
    expect(slugFor('03-Coding-Library/python/README.md')).toBe('03-coding-library-python-readme');
    expect(slugFor('02-Prompt-Library/README.md')).toBe('02-prompt-library-readme');
  });
  it('multiple READMEs without slug do not collide', () => {
    const r = buildContent([
      { path: '02-Prompt-Library/README.md', raw: '# A' },
      { path: '03-Coding-Library/README.md', raw: '# B' },
      { path: '03-Coding-Library/java/README.md', raw: '# C' },
    ]);
    expect(r.errors).toEqual([]);
    expect(r.docs).toHaveLength(3);
  });
  it('treats duplicate filename slugs as hard errors', () => {
    const r = buildContent([
      { path: '10-Career-Toolkit/Resume.md', raw: '# A' },
      { path: '04-Academic-Toolkit/resume.md', raw: '# B' },
    ]);
    expect(r.errors[0]).toMatch(/Duplicate slug "resume"/);
  });
  it('treats explicit slug colliding with a filename as a hard error', () => {
    const r = buildContent([
      { path: '10-Career-Toolkit/Resume.md', raw: '# A' },
      { path: '04-Academic-Toolkit/Other.md', raw: fm({ slug: 'Resume' }) },
    ]);
    expect(r.errors).toHaveLength(1);
  });
});

describe('inferDomain', () => {
  it.each([
    ['00-Command-Center/Daily.md', 'command-center'],
    ['01-Obsidian-Vault/10-CS-Core/DBMS.md', 'cs-core'],
    ['01-Obsidian-Vault/20-Cybersecurity/XSS.md', 'cybersecurity'],
    ['01-Obsidian-Vault/30-AI-ML/Transformers.md', 'ai'],
    ['01-Obsidian-Vault/40-Interview-Prep/Two-Pointers.md', 'dsa'],
    ['02-Prompt-Library/P.md', 'prompts'],
    ['03-Coding-Library/python/x.md', 'dsa'],
    ['06-Cybersecurity-Toolkit/X.md', 'cybersecurity'],
    ['10-Career-Toolkit/X.md', 'career'],
    ['12-System-Design/Caching.md', 'system-design'],
    ['12-System-Design/lld/Strategy.md', 'lld'],
    ['12-System-Design/LLD/Observer.md', 'lld'],
    ['15-Decision-Records/ADR-001.md', 'adr'],
    ['16-Projects/X.md', 'projects'],
  ])('%s -> %s', (path, domain) => expect(inferDomain(path)).toBe(domain));
});

describe('wikilinks', () => {
  it('extracts plain and labelled links, ignoring code', () => {
    const md = 'See [[Hash-Tables]] and [[Big O Notation|Big-O]].\n`arr[[0]]`\n```mermaid\nA[[subroutine]] --> B\n```\n```python\nx = m[[1]]\n```';
    expect(extractWikilinks(md)).toEqual([{ target: 'Hash-Tables', label: undefined }, { target: 'Big O Notation', label: 'Big-O' }]);
  });

  it('resolves case-insensitively by slug (or title) and reports unresolved ones', () => {
    const r = buildContent([
      { path: '01-Obsidian-Vault/10-CS-Core/Hash-Tables.md', raw: '# Hash Tables\nSee [[big-o-notation]] and [[Missing-Note]] and [[CPU Caches]].' },
      { path: '01-Obsidian-Vault/10-CS-Core/Big-O-Notation.md', raw: '# Big O\n' },
      { path: '01-Obsidian-Vault/10-CS-Core/Caches.md', raw: fm({ title: 'CPU Caches' }) },
    ]);
    const hash = r.index.find((d) => d.slug === 'hash-tables')!;
    expect(hash.outgoing).toEqual(['big-o-notation', 'caches']);
    expect(r.index.find((d) => d.slug === 'big-o-notation')!.backlinks).toEqual(['hash-tables']);
    expect(r.unresolvedWikilinks).toEqual([{ from: '01-Obsidian-Vault/10-CS-Core/Hash-Tables.md', target: 'Missing-Note' }]);
    expect(r.graph.edges.length).toBe(2);
  });

  it('resolves relative markdown links and reports broken ones', () => {
    const r = buildContent([
      { path: '06-Cybersecurity-Toolkit/A.md', raw: '[b](../07-Developer-Toolkit/B.md#x) [gone](./Gone.md) [ext](https://x.org/a.md)' },
      { path: '07-Developer-Toolkit/B.md', raw: '# B' },
    ]);
    expect(r.docs.find((d) => d.slug === 'a')!.linkMap).toEqual({ '../07-Developer-Toolkit/B.md': 'b' });
    expect(r.brokenMdLinks).toEqual([{ from: '06-Cybersecurity-Toolkit/A.md', href: './Gone.md' }]);
  });
});

describe('stripMarkdown', () => {
  it('removes code, markup and truncates on a word boundary', () => {
    const s = stripMarkdown('# Title\n\nSome **bold** [link](http://x) and [[Note|label]].\n```js\nsecret()\n```', 1000);
    expect(s).toBe('Title Some bold link and label.');
    expect(stripMarkdown('word '.repeat(100), 50).length).toBeLessThanOrEqual(50);
  });
});
