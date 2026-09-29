import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, ExternalLink, Pin } from 'lucide-react';
import { loadDoc, sortDocs, useAsync, useIndex } from '../lib/content';
import { logActivity, setSlice, useAppState } from '../lib/store';
import { checklistProgress } from '../lib/progress';
import { domainInfo, humanize } from '../lib/domains';
import { domainHref } from '../components/hubs';
import type { DocMeta, DocProgress } from '../types';
import { Markdown } from '../components/Markdown';
import { Chip, DomainChip, EmptyState, ErrorState, Loading, ProgressBar, scrollBehavior, STATUSES, statusLabel } from '../components/ui';

/** The page header already shows the title; drop a leading `# Title` to avoid a duplicate h1. */
function stripLeadingH1(body: string): string {
  return body.replace(/^\s*#\s+[^\n]*\n?/, '');
}

const REPO = 'https://github.com/rakshit-737/engineering-os/blob/master/';

function Toc({ headings }: { headings: DocMeta['headings'] }) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!headings.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px' },
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [headings]);
  if (headings.length < 2) return <aside className="toc" aria-hidden="true" />;
  return (
    <aside className="toc">
      <nav aria-label="On this page">
        <h2>On this page</h2>
        <ul>
          {headings.map((h) => (
            <li key={h.id} className={`d${h.depth}`}>
              <button
                type="button"
                aria-current={active === h.id ? 'true' : undefined}
                onClick={() => {
                  const el = document.getElementById(h.id);
                  el?.scrollIntoView({ behavior: scrollBehavior() });
                  el?.setAttribute('tabindex', '-1');
                  el?.focus({ preventScroll: true });
                }}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function LinkPanel({ title, slugs, bySlug }: { title: string; slugs: string[]; bySlug: Map<string, DocMeta> }) {
  const valid = slugs.filter((s) => bySlug.has(s));
  if (!valid.length) return null;
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {valid.map((s) => (
          <li key={s}>
            <Link to={`/doc/${encodeURIComponent(s)}`}>{bySlug.get(s)!.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DocPage() {
  const { slug = '' } = useParams();
  const doc = useAsync(() => loadDoc(slug), [slug]);
  const index = useIndex();
  const status = useAppState((s) => s.docStatus[slug] ?? 'not-started');
  const bookmarked = useAppState((s) => s.bookmarks.includes(slug));
  const pinned = useAppState((s) => s.pins.includes(slug));
  const checks = useAppState((s) => s.checks);

  const bySlug = useMemo(() => new Map((index.data ?? []).map((d) => [d.slug, d])), [index.data]);
  const exists = useCallback((s: string) => !index.data || bySlug.has(s), [bySlug, index.data]);

  useEffect(() => {
    if (doc.data) document.title = `${doc.data.title} · Engineering OS`;
    return () => {
      document.title = 'Engineering OS — Personal Engineering Operating System';
    };
  }, [doc.data]);

  if (doc.error) {
    const notFound = /404/.test(doc.error.message);
    return notFound ? (
      <EmptyState title="Note not found" action={<Link className="btn" to="/knowledge">Browse knowledge</Link>}>
        No note has the slug “{slug}”. It may have been renamed — try search (Ctrl K).
      </EmptyState>
    ) : (
      <ErrorState error={doc.error} onRetry={doc.retry} />
    );
  }
  if (doc.loading || !doc.data) return <Loading label="Loading note" />;
  const d = doc.data;

  const siblings = sortDocs((index.data ?? []).filter((x) => x.domain === d.domain && x.category === d.category));
  const pos = siblings.findIndex((x) => x.slug === d.slug);
  const prev = pos > 0 ? siblings[pos - 1] : undefined;
  const next = pos >= 0 && pos < siblings.length - 1 ? siblings[pos + 1] : undefined;
  const cp = checklistProgress(d, checks);

  const setStatus = (s: DocProgress) => {
    setSlice('docStatus', (m) => {
      const n = { ...m };
      if (s === 'not-started') delete n[slug];
      else n[slug] = s;
      return n;
    });
    logActivity('status', `${statusLabel(s)}: ${d.title}`, slug);
  };
  const toggle = (key: 'bookmarks' | 'pins', on: boolean) =>
    setSlice(key, (l) => (on ? l.filter((x) => x !== slug) : [slug, ...l]));

  return (
    <div className="doc-layout">
      <article>
        <header className="doc-header">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to={domainHref(d.domain)}>{domainInfo(d.domain).label}</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/domain/${d.domain}?category=${encodeURIComponent(d.category)}`}>{humanize(d.category)}</Link>
          </nav>
          <h1>{d.title}</h1>
          {d.description && <p className="muted" style={{ margin: '0 0 12px' }}>{d.description}</p>}
          <div className="row">
            <DomainChip domain={d.domain} />
            <Chip>{humanize(d.type)}</Chip>
            {d.difficulty && <Chip>{humanize(d.difficulty)}</Chip>}
            {d.status !== 'evergreen' && <Chip>{humanize(d.status)}</Chip>}
            {d.pattern && <Chip>Pattern: {humanize(d.pattern)}</Chip>}
            {d.source && <Chip>{d.source}</Chip>}
            {d.adr_status && <Chip>ADR: {humanize(d.adr_status)}</Chip>}
            {d.role && <Chip>Role: {d.role}</Chip>}
            <span className="subtle">{Math.max(1, Math.round(d.wordCount / 220))} min read</span>
          </div>
          <div className="row no-print" style={{ marginTop: 12 }}>
            <label className="row" htmlFor="doc-status">
              <span className="subtle">Status</span>
              <select id="doc-status" className="select" style={{ width: 140 }} value={status} onChange={(e) => setStatus(e.target.value as DocProgress)}>
                {STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>
            </label>
            <button type="button" className="icon-btn" aria-pressed={bookmarked} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'} onClick={() => toggle('bookmarks', bookmarked)}>
              <Bookmark size={16} aria-hidden="true" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button type="button" className="icon-btn" aria-pressed={pinned} aria-label={pinned ? 'Unpin from dashboard' : 'Pin to dashboard'} onClick={() => toggle('pins', pinned)}>
              <Pin size={16} aria-hidden="true" fill={pinned ? 'currentColor' : 'none'} />
            </button>
            <span className="spacer" />
            <a className="btn btn-sm btn-ghost" href={REPO + d.path.split('/').map(encodeURIComponent).join('/')} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={13} aria-hidden="true" /> Edit on GitHub
            </a>
          </div>
          {cp.total > 0 && (
            <div style={{ marginTop: 12 }}>
              <div className="row subtle" style={{ marginBottom: 4 }}>Checklist {cp.done}/{cp.total}</div>
              <ProgressBar value={cp.pct} label="Checklist completion" />
            </div>
          )}
        </header>
        <Markdown slug={d.slug} body={stripLeadingH1(d.body)} linkMap={d.linkMap} exists={exists} />
        <footer className="doc-footer">
          <div className="side-panel">
            <LinkPanel title="Prerequisites" slugs={d.prerequisites} bySlug={bySlug} />
            <LinkPanel title="Related" slugs={d.related} bySlug={bySlug} />
            <LinkPanel title="Backlinks" slugs={d.backlinks} bySlug={bySlug} />
          </div>
          {d.tags.length > 0 && (
            <div className="row" style={{ marginTop: 16 }}>
              {d.tags.map((t) => (
                <Link key={t} className="chip" to={`/knowledge?tag=${encodeURIComponent(t)}`}>#{t}</Link>
              ))}
            </div>
          )}
          <nav className="pager" aria-label="Previous and next in category">
            {prev && (
              <Link to={`/doc/${encodeURIComponent(prev.slug)}`}>
                <div className="subtle">Previous</div>
                {prev.title}
              </Link>
            )}
            {next && (
              <Link className="next" to={`/doc/${encodeURIComponent(next.slug)}`}>
                <div className="subtle">Next</div>
                {next.title}
              </Link>
            )}
          </nav>
        </footer>
      </article>
      <Toc headings={d.headings} />
    </div>
  );
}
