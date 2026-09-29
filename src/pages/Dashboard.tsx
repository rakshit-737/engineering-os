import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { DOMAINS } from '../lib/domains';
import { progressByDomain, pulse, PULSE_KEYS } from '../lib/progress';
import { setSlice, useAppState } from '../lib/store';
import { newId } from '../lib/storage';
import { WithIndex } from '../components/WithIndex';
import { EmptyState, PageHeader, ProgressBar } from '../components/ui';
import type { DocMeta } from '../types';

const PULSE_LABEL = { build: 'Build', learn: 'Learn', research: 'Research', career: 'Career', academic: 'Academic' };

function Mission() {
  const mission = useAppState((s) => s.mission);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(mission);
  if (editing)
    return (
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          setSlice('mission', draft.trim().slice(0, 1000));
          setEditing(false);
        }}
      >
        <label htmlFor="mission" className="sr-only">Current mission</label>
        <textarea id="mission" className="textarea" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. Ship a production-grade rate limiter and understand every line of it." />
        <div className="row">
          <button className="btn btn-primary btn-sm" type="submit">Save</button>
          <button className="btn btn-sm" type="button" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </form>
    );
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <p style={{ margin: 0, flex: 1, fontSize: 15 }} className={mission ? '' : 'muted'}>
        {mission || 'No mission set. One sentence describing what you are building or mastering right now keeps every other choice honest.'}
      </p>
      <button className="btn btn-sm" type="button" onClick={() => { setDraft(mission); setEditing(true); }}>
        {mission ? 'Edit' : 'Set mission'}
      </button>
    </div>
  );
}

function Objectives() {
  const items = useAppState((s) => s.weeklyObjectives);
  const [text, setText] = useState('');
  return (
    <div className="card">
      <div className="card-title">Weekly objectives <span className="subtle">{items.filter((i) => i.done).length}/{items.length}</span></div>
      {items.length === 0 && <p className="subtle" style={{ marginTop: 0 }}>Three objectives or fewer. Outcomes, not activities.</p>}
      {items.map((o) => (
        <div className="checkbox-row" key={o.id}>
          <input
            type="checkbox"
            id={`obj-${o.id}`}
            checked={o.done}
            onChange={() => setSlice('weeklyObjectives', (l) => l.map((x) => (x.id === o.id ? { ...x, done: !x.done } : x)))}
          />
          <label htmlFor={`obj-${o.id}`} style={{ flex: 1, textDecoration: o.done ? 'line-through' : undefined }}>{o.text}</label>
          <button type="button" className="icon-btn" aria-label={`Remove ${o.text}`} onClick={() => setSlice('weeklyObjectives', (l) => l.filter((x) => x.id !== o.id))}>
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
      <form
        className="row"
        style={{ marginTop: 8 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setSlice('weeklyObjectives', (l) => [...l, { id: newId(), text: text.trim().slice(0, 500), done: false }]);
          setText('');
        }}
      >
        <input className="input" style={{ flex: 1 }} aria-label="New objective" placeholder="Add objective…" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn" type="submit" aria-label="Add objective"><Plus size={14} aria-hidden="true" /></button>
      </form>
    </div>
  );
}

function Body({ docs }: { docs: DocMeta[] }) {
  const s = useAppState((st) => st);
  const bySlug = new Map(docs.map((d) => [d.slug, d]));
  const p = pulse(docs, s.docStatus);
  const perDomain = progressByDomain(docs, s.docStatus);
  const active = s.projects.filter((x) => x.status === 'active');
  const saved = [...new Set([...s.pins, ...s.bookmarks])].filter((x) => bySlug.has(x)).slice(0, 10);

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Current mission</div>
        <Mission />
      </div>
      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">Engineering pulse <span className="subtle">notes marked done</span></div>
          {PULSE_KEYS.map((k) => (
            <div className="progress-row" key={k}>
              <span>{PULSE_LABEL[k]}</span>
              <ProgressBar value={p[k].pct} label={`${PULSE_LABEL[k]} progress`} />
              <span className="subtle">{p[k].done}/{p[k].total}</span>
            </div>
          ))}
        </div>
        <Objectives />
        <div className="card">
          <div className="card-title">Active projects <Link to="/projects" className="subtle">All</Link></div>
          {active.length ? (
            <ul className="stack" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {active.map((x) => (
                <li key={x.id} className="row" style={{ justifyContent: 'space-between' }}>
                  <span>{x.name}</span><span className="chip">L{x.maturity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="subtle" style={{ margin: 0 }}>No active projects. <Link to="/projects">Start one in the Project Lab</Link> — every project should teach something.</p>
          )}
        </div>
        <div className="card">
          <div className="card-title">Pinned & bookmarked</div>
          {saved.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {saved.map((x) => <li key={x}><Link to={`/doc/${encodeURIComponent(x)}`}>{bySlug.get(x)!.title}</Link></li>)}
            </ul>
          ) : (
            <p className="subtle" style={{ margin: 0 }}>Pin or bookmark notes from their page header to keep them here.</p>
          )}
        </div>
        <div className="card">
          <div className="card-title">Recent activity</div>
          {s.activity.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {s.activity.slice(0, 8).map((a, i) => (
                <li key={`${a.at}-${i}`}>
                  {a.slug && bySlug.has(a.slug) ? <Link to={`/doc/${encodeURIComponent(a.slug)}`}>{a.label}</Link> : a.label}{' '}
                  <span className="subtle">{new Date(a.at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="subtle" style={{ margin: 0 }}>Status changes and completed Today slots appear here.</p>
          )}
        </div>
        <div className="card">
          <div className="card-title">Quick actions</div>
          <div className="row">
            <Link className="btn btn-sm" to="/today">Plan today</Link>
            <Link className="btn btn-sm" to="/projects">New project</Link>
            <Link className="btn btn-sm" to="/career">Log application</Link>
            <Link className="btn btn-sm" to="/research">Add paper</Link>
            <Link className="btn btn-sm" to="/command-center">Journal</Link>
            <Link className="btn btn-sm" to="/settings">Export data</Link>
          </div>
        </div>
      </div>
      <section className="section">
        <h2 className="section-title">Domains</h2>
        {docs.length === 0 ? (
          <EmptyState title="No content yet">Run <code>npm run content</code> to ingest the Markdown folders.</EmptyState>
        ) : (
          <div className="grid grid-auto">
            {DOMAINS.filter((d) => perDomain[d.id]).map((d) => {
              const pr = perDomain[d.id]!;
              const hub = ['system-design', 'lld', 'ai', 'cybersecurity', 'dsa', 'cs-core'].includes(d.id);
              return (
                <Link key={d.id} className="tile" to={hub ? `/${d.id}` : `/domain/${d.id}`}>
                  <div className="tile-head"><span className="chip-dot" style={{ background: d.color }} aria-hidden="true" />{d.label}</div>
                  <p>{d.blurb}</p>
                  <ProgressBar value={pr.pct} label={`${d.label} progress`} />
                  <span className="subtle">{pr.done}/{pr.total} done</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default function Dashboard() {
  return (
    <>
      <PageHeader title="Dashboard" description="Where you are, what you are building, and what to do next." />
      <WithIndex>{(docs) => <Body docs={docs} />}</WithIndex>
    </>
  );
}
