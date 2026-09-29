import { describe, expect, it } from 'vitest';
import { createSearch } from './search';
import type { SearchEntry } from '../types';

const e = (slug: string, title: string, o: Partial<SearchEntry> = {}): SearchEntry => ({
  slug, title, description: '', tags: [], domain: 'cs-core', type: 'concept', text: '', ...o,
});

const entries = [
  e('rate-limiting', 'Rate Limiting', { domain: 'system-design', tags: ['api'], text: 'token bucket algorithm' }),
  e('token-bucket-notes', 'Bucket Notes', { text: 'rate limiting mentioned in passing rate limiting' }),
  e('sql-injection', 'SQL Injection', { domain: 'cybersecurity', type: 'playbook', tags: ['owasp', 'web'] }),
  e('xss', 'Cross-Site Scripting', { domain: 'cybersecurity', tags: ['owasp'], text: 'script injection in browsers' }),
  e('dynamic-programming', 'Dynamic Programming', { domain: 'dsa', type: 'pattern', tags: ['dp'] }),
];

describe('search', () => {
  const s = createSearch(entries);

  it('ranks title matches above body matches', () => {
    const r = s.search('rate limiting');
    expect(r[0]!.slug).toBe('rate-limiting');
    expect(r.map((x) => x.slug)).toContain('token-bucket-notes');
  });
  it('supports prefix search', () => {
    expect(s.search('dyna')[0]!.slug).toBe('dynamic-programming');
  });
  it('supports fuzzy search for typos', () => {
    expect(s.search('injectoin').map((x) => x.slug)).toContain('sql-injection');
  });
  it('boosts tags', () => {
    expect(s.search('owasp').map((x) => x.slug).sort()).toEqual(['sql-injection', 'xss']);
  });
  it('filters by domain, type and tag', () => {
    expect(s.search('injection', { domain: 'cybersecurity' }).every((x) => x.domain === 'cybersecurity')).toBe(true);
    expect(s.search('injection', { type: 'playbook' }).map((x) => x.slug)).toEqual(['sql-injection']);
    expect(s.search('injection', { tag: 'web' }).map((x) => x.slug)).toEqual(['sql-injection']);
    expect(s.search('rate', { domain: 'dsa' })).toEqual([]);
  });
  it('returns nothing for blank queries and tolerates duplicate slugs', () => {
    expect(s.search('   ')).toEqual([]);
    expect(() => createSearch([...entries, entries[0]!])).not.toThrow();
  });
});
