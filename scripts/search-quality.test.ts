import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createSearch } from '../src/lib/search';
import type { SearchEntry } from '../src/types';

/** Regression suite against the real generated index (run `npm run content` first; CI does). */
const path = 'public/content/search.json';
const has = existsSync(path);

describe.skipIf(!has)('search quality on real content', () => {
  const s = has ? createSearch(JSON.parse(readFileSync(path, 'utf8')) as SearchEntry[]) : null;
  const top = (q: string, n: number) => s!.search(q, {}, n).map((h) => h.slug);

  it.each([
    ['cap', 'cap-theorem', 1],
    ['cap theorem', 'cap-theorem', 1],
    ['lru', 'lru-cache-lld', 1],
    ['raft', 'consensus-raft-paxos', 1],
    ['sliding window', 'sliding-window-pattern', 2],
    ['xss', 'xss', 1],
    ['kafka', 'message-queues', 3],
    ['rate-limiting', 'rate-limiting', 1],
    ['rate limiting', 'rate-limiting', 1],
    ['sql injection', 'sql-injection', 1],
    ['consistent hashing', 'sharding-and-partitioning', 3],
    ['jwt', 'authentication-security', 3],
  ] as const)('"%s" finds %s in top %i', (q, slug, n) => {
    expect(top(q, n)).toContain(slug);
  });

  it('does not return typo-neighbours for short exact terms', () => {
    // "raft" must not pull in notes that only say "draft"/"craft"
    for (const slug of top('raft', 10)) expect(slug).not.toMatch(/^adr-template$/);
  });
});
