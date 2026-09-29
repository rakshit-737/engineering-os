import { useCallback, useEffect, useState } from 'react';
import type { DocMeta, DocPayload, GraphData, SearchEntry } from '../types';

const base = () => import.meta.env.BASE_URL.replace(/\/?$/, '/');
const cache = new Map<string, Promise<unknown>>();

export async function fetchJson<T>(path: string): Promise<T> {
  const url = `${base()}content/${path}`;
  const hit = cache.get(url);
  if (hit) return hit as Promise<T>;
  const p = fetch(url).then(async (r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} loading ${path}`);
    return (await r.json()) as T;
  });
  cache.set(url, p);
  p.catch(() => cache.delete(url)); // allow retry
  return p;
}

export const loadIndex = () => fetchJson<DocMeta[]>('index.json');
export const loadSearch = () => fetchJson<SearchEntry[]>('search.json');
export const loadGraph = () => fetchJson<GraphData>('graph.json');
export const loadDoc = (slug: string) => fetchJson<DocPayload>(`docs/${encodeURIComponent(slug)}.json`);

export interface Async<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  retry: () => void;
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): Async<T> {
  const [state, setState] = useState<{ data: T | null; error: Error | null; loading: boolean }>({ data: null, error: null, loading: true });
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ data: s.data, error: null, loading: true }));
    fn().then(
      (data) => alive && setState({ data, error: null, loading: false }),
      (error: unknown) => alive && setState({ data: null, error: error instanceof Error ? error : new Error(String(error)), loading: false }),
    );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);
  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, retry };
}

export function useIndex(): Async<DocMeta[]> {
  return useAsync(loadIndex, []);
}

export function sortDocs(docs: DocMeta[]): DocMeta[] {
  return [...docs].sort(
    (a, b) => (a.order ?? 9999) - (b.order ?? 9999) || a.title.localeCompare(b.title),
  );
}

export function groupBy<T>(items: T[], key: (t: T) => string): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const i of items) {
    const k = key(i);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(i);
  }
  return [...m.entries()];
}

/** For tests */
export function __clearContentCache(): void {
  cache.clear();
}
