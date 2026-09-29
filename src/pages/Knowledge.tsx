import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DocMeta, DocProgress } from '../types';
import { groupBy, sortDocs } from '../lib/content';
import { DOMAINS, domainInfo, humanize } from '../lib/domains';
import { useAppState } from '../lib/store';
import { DocList } from '../components/DocList';
import { WithIndex } from '../components/WithIndex';
import { EmptyState, PageHeader, STATUSES, statusLabel } from '../components/ui';

export interface FilterState {
  domain: string;
  category: string;
  type: string;
  difficulty: string;
  status: string;
  tag: string;
  q: string;
}

export function applyFilters(docs: DocMeta[], f: FilterState, statuses: Record<string, DocProgress>): DocMeta[] {
  const q = f.q.trim().toLowerCase();
  return docs.filter(
    (d) =>
      (!f.domain || d.domain === f.domain) &&
      (!f.category || d.category === f.category) &&
      (!f.type || d.type === f.type) &&
      (!f.difficulty || d.difficulty === f.difficulty) &&
      (!f.status || (statuses[d.slug] ?? 'not-started') === f.status) &&
      (!f.tag || d.tags.includes(f.tag)) &&
      (!q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)),
  );
}

const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort();

/** Filterable, category-grouped listing. `lockDomain` hides the domain filter. */
export function DocBrowser({ docs, lockDomain }: { docs: DocMeta[]; lockDomain?: string }) {
  const [params, setParams] = useSearchParams();
  const statuses = useAppState((s) => s.docStatus);
  const f: FilterState = {
    domain: lockDomain ?? params.get('domain') ?? '',
    category: params.get('category') ?? '',
    type: params.get('type') ?? '',
    difficulty: params.get('difficulty') ?? '',
    status: params.get('status') ?? '',
    tag: params.get('tag') ?? '',
    q: params.get('q') ?? '',
  };
  const scope = lockDomain ? docs.filter((d) => d.domain === lockDomain) : docs;
  const filtered = useMemo(() => sortDocs(applyFilters(scope, f, statuses)), [scope, statuses, f.domain, f.category, f.type, f.difficulty, f.status, f.tag, f.q]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (k: keyof FilterState, v: string) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v);
    else p.delete(k);
    setParams(p, { replace: true });
  };
  const any = Object.entries(f).some(([k, v]) => v && !(k === 'domain' && lockDomain));
  const groups = groupBy(filtered, (d) => (lockDomain ? d.category : d.domain));

  const sel = (k: keyof FilterState, label: string, opts: string[], fmt: (s: string) => string = humanize) => (
    <select className="select" aria-label={label} value={f[k]} onChange={(e) => set(k, e.target.value)}>
      <option value="">{label}: all</option>
      {opts.map((o) => <option key={o} value={o}>{fmt(o)}</option>)}
    </select>
  );

  return (
    <>
      <div className="filters" role="search">
        <input className="input" type="search" placeholder="Filter by title…" aria-label="Filter by title" value={f.q} onChange={(e) => set('q', e.target.value)} style={{ maxWidth: 220 }} />
        {!lockDomain && sel('domain', 'Domain', DOMAINS.map((d) => d.id).filter((id) => docs.some((d) => d.domain === id)), (s) => domainInfo(s).label)}
        {sel('category', 'Category', uniq(scope.map((d) => d.category)))}
        {sel('type', 'Type', uniq(scope.map((d) => d.type)))}
        {sel('difficulty', 'Difficulty', uniq(scope.map((d) => d.difficulty)))}
        {sel('status', 'Progress', STATUSES, (s) => statusLabel(s as DocProgress))}
        {sel('tag', 'Tag', uniq(scope.flatMap((d) => d.tags)), (s) => `#${s}`)}
        {any && (
          <button type="button" className="btn btn-ghost" onClick={() => setParams(new URLSearchParams(), { replace: true })}>Clear filters</button>
        )}
      </div>
      <p className="subtle" aria-live="polite">{filtered.length} of {scope.length} notes</p>
      {filtered.length === 0 ? (
        <EmptyState title={scope.length ? 'No notes match these filters' : 'No notes here yet'}>
          {scope.length
            ? 'Loosen a filter or clear them all.'
            : 'Add Markdown files with frontmatter to this domain’s folder, then rebuild content (npm run content).'}
        </EmptyState>
      ) : (
        groups.map(([g, list]) => (
          <section className="section" key={g}>
            <h2 className="section-title">
              {lockDomain ? humanize(g) : domainInfo(g).label} <span className="subtle">{list.length}</span>
            </h2>
            <DocList docs={list} showDomain={!lockDomain} />
          </section>
        ))
      )}
    </>
  );
}

export default function Knowledge() {
  return (
    <>
      <PageHeader title="Knowledge" description="Every note in the repository. Filter by domain, type, difficulty, your progress or tag." />
      <WithIndex>{(docs) => <DocBrowser docs={docs} />}</WithIndex>
    </>
  );
}
