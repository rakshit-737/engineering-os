import MiniSearch from 'minisearch';
import type { SearchEntry } from '../types';

export interface SearchFilters {
  domain?: string;
  type?: string;
  tag?: string;
}

export interface SearchHit {
  slug: string;
  title: string;
  description: string;
  domain: string;
  type: string;
  score: number;
}

export interface DocSearch {
  search(q: string, filters?: SearchFilters, limit?: number): SearchHit[];
}

/**
 * Fuzzy only for longer terms: short tokens ("cap", "raft", "jwt") are usually
 * acronyms/exact names where one edit ("craft", "draft") is pure noise.
 */
export function fuzzyFor(term: string): number | false {
  if (term.length < 5) return false;
  return term.length < 8 ? 1 : 2;
}

export function createSearch(entries: SearchEntry[]): DocSearch {
  const ms = new MiniSearch<SearchEntry>({
    idField: 'slug',
    fields: ['title', 'slug', 'tags', 'headings', 'description', 'text'],
    storeFields: ['title', 'description', 'domain', 'type'],
    extractField: (doc, field) => {
      const v = doc[field as keyof SearchEntry];
      if (v == null) return '';
      return Array.isArray(v) ? v.join(' ') : String(v);
    },
    searchOptions: {
      boost: { title: 5, slug: 3, tags: 3, headings: 2, description: 1.5, text: 1 },
      // prefix only for 3+ chars; exact matches outrank prefix/fuzzy expansions
      prefix: (term) => term.length >= 3,
      fuzzy: fuzzyFor,
      weights: { prefix: 0.3, fuzzy: 0.2 },
      combineWith: 'AND',
    },
  });
  // guard against duplicate ids from stale/corrupt payloads
  const bySlug = new Map<string, SearchEntry>();
  for (const e of entries) if (!bySlug.has(e.slug)) bySlug.set(e.slug, e);
  ms.addAll([...bySlug.values()]);

  return {
    search(q, filters = {}, limit = 20) {
      const query = q.trim();
      if (!query) return [];
      const filter = (r: Record<string, unknown>) => {
        const e = bySlug.get(r.id as string);
        return (
          !!e &&
          (!filters.domain || e.domain === filters.domain) &&
          (!filters.type || e.type === filters.type) &&
          (!filters.tag || e.tags.includes(filters.tag))
        );
      };
      let results = ms.search(query, { filter });
      if (!results.length) results = ms.search(query, { filter, combineWith: 'OR' });
      return results.slice(0, limit).map((r) => ({
        slug: r.id as string,
        title: r.title as string,
        description: (r.description as string) ?? '',
        domain: r.domain as string,
        type: r.type as string,
        score: r.score,
      }));
    },
  };
}
