import { vi } from 'vitest';
import type { DocMeta, DocPayload, SearchEntry } from '../types';

export const fixtureDocs: DocMeta[] = [
  {
    slug: 'rate-limiting', title: 'Rate Limiting', description: 'Protect services', domain: 'system-design', category: 'hld',
    type: 'concept', status: 'evergreen', tags: ['api'], prerequisites: [], related: [], path: '12-System-Design/Rate-Limiting.md',
    headings: [{ depth: 2, text: 'Why', id: 'why' }], wordCount: 100, taskCount: 1, backlinks: [], outgoing: [],
  },
];

export const fixtureSearch: SearchEntry[] = [
  { slug: 'rate-limiting', title: 'Rate Limiting', description: 'Protect services', tags: ['api'], domain: 'system-design', type: 'concept', text: 'token bucket' },
  { slug: 'sql-injection', title: 'SQL Injection', description: '', tags: [], domain: 'cybersecurity', type: 'concept', text: '' },
];

export const fixtureDoc: DocPayload = {
  ...fixtureDocs[0]!,
  body: '# Rate Limiting\n\n## Why\n\nSee [[Rate-Limiting]].\n\n- [ ] add a limiter\n',
  linkMap: {},
};

export function mockFetch() {
  const fn = vi.fn(async (url: string) => {
    const u = String(url);
    const body = u.endsWith('index.json') ? fixtureDocs
      : u.endsWith('search.json') ? fixtureSearch
      : u.endsWith('graph.json') ? { nodes: [], edges: [] }
      : u.includes('/docs/rate-limiting.json') ? fixtureDoc
      : null;
    return body
      ? new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } })
      : new Response('not found', { status: 404, statusText: 'Not Found' });
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}
