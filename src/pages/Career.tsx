import { Link } from 'react-router-dom';
import type { CareerApplication } from '../types';
import { setSlice, useAppState } from '../lib/store';
import { newId } from '../lib/storage';
import { applicationsByStatus } from '../lib/progress';
import { humanize } from '../lib/domains';
import { CrudTable, type FieldDef } from '../components/CrudTable';
import { WithIndex } from '../components/WithIndex';
import { PageHeader } from '../components/ui';

export const APP_STATUSES = ['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected', 'withdrawn'] as const;
const statusLabel = (s: string | number) => (s === 'oa' ? 'OA' : humanize(String(s)));

const FIELDS: FieldDef<CareerApplication>[] = [
  { key: 'company', label: 'Company', kind: 'text', required: true, inTable: true },
  { key: 'role', label: 'Role', kind: 'text', inTable: true },
  { key: 'location', label: 'Location', kind: 'text', inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: APP_STATUSES, optionLabel: statusLabel, inTable: true },
  { key: 'deadline', label: 'Deadline', kind: 'date', inTable: true },
  { key: 'oa', label: 'OA date', kind: 'date', inTable: true },
  { key: 'interview', label: 'Interview date', kind: 'date', inTable: true },
  { key: 'outcome', label: 'Outcome', kind: 'text', inTable: true },
  { key: 'notes', label: 'Notes', kind: 'textarea' },
];

export default function Career() {
  const apps = useAppState((s) => s.applications);
  const counts = applicationsByStatus(apps);
  return (
    <>
      <PageHeader title="Career" description="Roadmaps and an application pipeline. Track every application from wishlist to outcome." />
      <div className="row" style={{ marginBottom: 16 }}>
        {APP_STATUSES.map((s) => (
          <span key={s} className="chip">{statusLabel(s)} <strong>{counts[s] ?? 0}</strong></span>
        ))}
      </div>
      <h2 className="section-title">Applications</h2>
      <CrudTable
        noun="application"
        items={apps}
        fields={FIELDS}
        filterField="status"
        defaultSort="deadline"
        onChange={(l) => setSlice('applications', l)}
        makeEmpty={(): CareerApplication => ({ id: newId(), company: '', role: '', location: '', status: 'wishlist', deadline: '', oa: '', interview: '', outcome: '', notes: '', createdAt: new Date().toISOString() })}
        empty={{ title: 'No applications tracked', text: 'Add companies you plan to apply to. Deadlines sort to the top so nothing slips.' }}
      />
      <section className="section">
        <h2 className="section-title">Roadmaps</h2>
        <WithIndex>
          {(docs) => {
            const r = docs.filter((d) => d.type === 'roadmap');
            return r.length ? (
              <div className="grid grid-auto">
                {r.map((d) => (
                  <Link key={d.slug} className="tile" to={`/doc/${encodeURIComponent(d.slug)}`}>
                    <div className="tile-head">{d.title}</div>
                    <p>{d.role ?? d.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="subtle">No roadmap notes yet (type: roadmap).</p>
            );
          }}
        </WithIndex>
        <p style={{ marginTop: 12 }}><Link to="/domain/career">All career notes, including interview prep →</Link></p>
      </section>
    </>
  );
}
