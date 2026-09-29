import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Lock, RefreshCw, Unlock } from 'lucide-react';
import { buildToday, localDate, pickFor } from '../lib/progress';
import { getState, logActivity, setSlice, useAppState } from '../lib/store';
import { TODAY_SLOTS } from '../lib/storage';
import { domainInfo } from '../lib/domains';
import { WithIndex } from '../components/WithIndex';
import { EmptyState, PageHeader } from '../components/ui';
import type { DocMeta, TodaySlot } from '../types';

const SLOT_HINT: Record<TodaySlot, string> = {
  build: 'Ship something small',
  learn: 'Understand one concept deeply',
  research: 'Read or run one experiment',
  career: 'One step on applications or interview prep',
  review: 'Revisit something marked “revise” or in progress',
};

function Planner({ docs }: { docs: DocMeta[] }) {
  const today = useAppState((s) => s.today);
  const config = useAppState((s) => s.todayConfig);
  const statuses = useAppState((s) => s.docStatus);
  const date = localDate();
  const bySlug = new Map(docs.map((d) => [d.slug, d]));

  useEffect(() => {
    if (!today || today.date !== date) {
      const s = getState();
      setSlice('today', buildToday(s.today, date, docs, s));
    }
  }, [today, date, docs]);

  if (!today || today.date !== date) return null;

  const update = (slot: TodaySlot, patch: Partial<(typeof today.slots)[TodaySlot]>) =>
    setSlice('today', (t) => (t ? { ...t, slots: { ...t.slots, [slot]: { ...t.slots[slot], ...patch } } } : t));

  const reroll = (slot: TodaySlot) => {
    const cur = today.slots[slot];
    const used = new Set(TODAY_SLOTS.map((s) => today.slots[s].slug).filter((x): x is string => !!x));
    if (cur.slug) used.add(cur.slug);
    const seed = cur.seed + 1;
    const slug = pickFor(slot, date, seed, docs, statuses, config.domains[slot], used) ?? cur.slug;
    update(slot, { slug, seed, done: false });
  };

  const done = TODAY_SLOTS.filter((s) => today.slots[s].done).length;

  return (
    <>
      <p className="subtle">{done}/{TODAY_SLOTS.length} slots done · {date}</p>
      <div className="card" style={{ padding: 0 }}>
        {TODAY_SLOTS.map((slot) => {
          const st = today.slots[slot];
          const doc = st.slug ? bySlug.get(st.slug) : undefined;
          return (
            <div key={slot} className={`slot${st.done ? ' done' : ''}`}>
              <div>
                <div className="slot-label">{slot.toUpperCase()}</div>
                <div className="subtle">{SLOT_HINT[slot]}</div>
              </div>
              <div className="slot-doc">
                {doc ? (
                  <>
                    <Link to={`/doc/${encodeURIComponent(doc.slug)}`}>{doc.title}</Link>
                    <div className="subtle">{domainInfo(doc.domain).label}{statuses[doc.slug] ? ` · ${statuses[doc.slug]}` : ''}</div>
                  </>
                ) : (
                  <span className="muted">
                    {slot === 'review' ? 'Nothing to review — mark notes “Revise” or “Learning” to fill this.' : 'Nothing left in the configured domains. Adjust them in Settings.'}
                  </span>
                )}
              </div>
              <div className="row">
                <label className="checkbox-row">
                  <input type="checkbox" aria-label={`Mark ${slot} done`} checked={st.done} disabled={!doc} onChange={() => {
                    update(slot, { done: !st.done });
                    if (!st.done && doc) logActivity('today', `Completed ${slot}: ${doc.title}`, doc.slug);
                  }} />
                  <span aria-hidden="true">Done</span>
                </label>
                <button type="button" className="icon-btn" aria-pressed={st.locked} aria-label={st.locked ? `Unlock ${slot}` : `Lock ${slot}`} onClick={() => update(slot, { locked: !st.locked })}>
                  {st.locked ? <Lock size={14} aria-hidden="true" /> : <Unlock size={14} aria-hidden="true" />}
                </button>
                <button type="button" className="icon-btn" aria-label={`Suggest another ${slot} item`} disabled={st.locked || st.done} onClick={() => reroll(slot)}>
                  <RefreshCw size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {docs.length === 0 && <EmptyState title="No content">Build content first.</EmptyState>}
      <div className="row" style={{ marginTop: 16 }}>
        <button type="button" className="btn" onClick={() => {
          const s = getState();
          const cleared = s.today ? { ...s.today, slots: Object.fromEntries(TODAY_SLOTS.map((k) => {
            const v = s.today!.slots[k];
            return [k, v.locked || v.done ? v : { slug: null, locked: false, done: false, seed: 0 }];
          })) as typeof s.today.slots } : null;
          setSlice('today', buildToday(cleared, date, docs, s));
        }}>Re-plan unlocked slots</button>
        <Link className="btn btn-ghost" to="/settings">Configure domains</Link>
      </div>
    </>
  );
}

export default function Today() {
  return (
    <>
      <PageHeader
        title="Today"
        description="Five slots, auto-suggested from notes you have not started or need to revise. Lock what you want to keep, reroll the rest, and mark slots done."
      />
      <WithIndex>{(docs) => <Planner docs={docs} />}</WithIndex>
    </>
  );
}
