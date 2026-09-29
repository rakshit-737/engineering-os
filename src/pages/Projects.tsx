import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { setSlice, useAppState } from '../lib/store';
import { newId } from '../lib/storage';
import { CrudTable, type FieldDef } from '../components/CrudTable';
import { WithIndex } from '../components/WithIndex';
import { PageHeader } from '../components/ui';

export const MATURITY = ['Prototype', 'Functional', 'Production-ish', 'Scalable', 'Research-grade'] as const;
export const maturityLabel = (v: string | number) => `L${v} · ${MATURITY[Number(v) - 1] ?? '?'}`;

const FIELDS: FieldDef<Project>[] = [
  { key: 'name', label: 'Name', kind: 'text', required: true, inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: ['idea', 'active', 'paused', 'shipped', 'archived'], inTable: true },
  { key: 'maturity', label: 'Maturity', kind: 'select', options: [1, 2, 3, 4, 5], optionLabel: maturityLabel, inTable: true },
  { key: 'stack', label: 'Stack', kind: 'text', inTable: true },
  { key: 'repo', label: 'Repository URL', kind: 'url', inTable: true },
  { key: 'objective', label: 'Objective — what will this teach or prove?', kind: 'textarea' },
  { key: 'problem', label: 'Problem', kind: 'textarea' },
  { key: 'milestones', label: 'Milestones (one per line)', kind: 'textarea' },
];

export default function Projects() {
  const projects = useAppState((s) => s.projects);
  return (
    <>
      <PageHeader
        title="Project Lab"
        description="Projects you are building, with a maturity level from 1 (Prototype) to 5 (Research-grade). Raise maturity deliberately: tests, observability, security, scale."
      />
      <CrudTable
        noun="project"
        items={projects}
        fields={FIELDS}
        filterField="status"
        onChange={(l) => setSlice('projects', l)}
        makeEmpty={(): Project => ({ id: newId(), name: '', objective: '', problem: '', stack: '', repo: '', milestones: '', status: 'idea', maturity: 1, createdAt: new Date().toISOString() })}
        empty={{ title: 'No projects yet', text: 'Record the objective and the problem first — a project without a learning goal is just typing.' }}
      />
      <section className="section">
        <h2 className="section-title">Maturity model</h2>
        <ol className="muted" style={{ paddingLeft: 20, margin: 0 }}>
          <li><strong>Prototype</strong> — proves the idea, happy path only.</li>
          <li><strong>Functional</strong> — complete feature set, basic tests, README.</li>
          <li><strong>Production-ish</strong> — CI, error handling, config, security review, deploy.</li>
          <li><strong>Scalable</strong> — load-tested, observable, documented failure modes.</li>
          <li><strong>Research-grade</strong> — measured against baselines, reproducible, written up.</li>
        </ol>
      </section>
      <section className="section">
        <h2 className="section-title">Project templates</h2>
        <WithIndex>
          {(docs) => {
            const t = docs.filter((d) => d.domain === 'projects');
            return t.length ? (
              <ul>{t.map((d) => <li key={d.slug}><Link to={`/doc/${encodeURIComponent(d.slug)}`}>{d.title}</Link></li>)}</ul>
            ) : (
              <p className="subtle">No project template notes found.</p>
            );
          }}
        </WithIndex>
      </section>
    </>
  );
}
