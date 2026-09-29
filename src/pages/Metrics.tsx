import { applicationsByStatus, checklistProgress, isLab, progressByDomain, projectsByMaturity } from '../lib/progress';
import { domainInfo, humanize } from '../lib/domains';
import { useAppState } from '../lib/store';
import { WithIndex } from '../components/WithIndex';
import { PageHeader } from '../components/ui';
import { MATURITY } from './Projects';
import { APP_STATUSES } from './Career';
import type { DocMeta } from '../types';

interface Bar { label: string; value: number; max?: number; color?: string; suffix?: string }

/**
 * Horizontal bar chart as plain HTML (no chart library). HTML instead of a scaled SVG keeps labels
 * at a readable size on phones and gives screen readers a real list.
 */
export function BarChart({ title, bars }: { title: string; bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.max ?? b.value));
  const allZero = bars.every((b) => b.value === 0);
  return (
    <figure className="card" style={{ margin: 0 }}>
      <figcaption className="card-title">{title}</figcaption>
      {bars.length === 0 || allZero ? (
        <p className="subtle" style={{ margin: 0 }}>No data yet.</p>
      ) : (
        <ul className="bar-list">
          {bars.map((b) => {
            const pct = (b.max ? b.value / Math.max(1, b.max) : b.value / max) * 100;
            return (
              <li key={b.label} className="progress-row">
                <span className="bar-label" title={b.label}>{b.label}</span>
                <span className="progress" aria-hidden="true"><span style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: b.color ?? 'var(--accent)' }} /></span>
                <span className="subtle">{b.value}{b.max ? `/${b.max}` : ''}{b.suffix ?? ''}</span>
              </li>
            );
          })}
        </ul>
      )}
    </figure>
  );
}

function Body({ docs }: { docs: DocMeta[] }) {
  const s = useAppState((st) => st);
  const perDomain = progressByDomain(docs, s.docStatus);
  const problems = docs.filter((d) => d.type === 'problem');
  const labs = docs.filter((d) => d.domain === 'cybersecurity' && isLab(d));
  const apps = applicationsByStatus(s.applications);
  const mat = projectsByMaturity(s.projects);
  const checklists = docs.filter((d) => d.taskCount > 0);
  const totalTasks = checklists.reduce((n, d) => n + d.taskCount, 0);
  const doneTasks = checklists.reduce((n, d) => n + checklistProgress(d, s.checks).done, 0);
  const papersRead = s.papers.filter((p) => p.status === 'read').length;

  const stat = (label: string, value: string | number, sub?: string) => (
    <div className="card"><div className="subtle">{label}</div><div className="stat">{value}</div>{sub && <div className="subtle">{sub}</div>}</div>
  );

  return (
    <>
      <div className="grid grid-auto" style={{ marginBottom: 16 }}>
        {stat('Notes done', docs.filter((d) => s.docStatus[d.slug] === 'done').length, `of ${docs.length}`)}
        {stat('DSA problems solved', problems.filter((d) => s.docStatus[d.slug] === 'done').length, `of ${problems.length} problem notes`)}
        {stat('Papers read', papersRead, `${s.papers.length} on list`)}
        {stat('Security labs done', labs.filter((d) => s.docStatus[d.slug] === 'done').length, `of ${labs.length}`)}
        {stat('Checklist items', `${doneTasks}/${totalTasks}`)}
        {stat('Experiments logged', s.experiments.length)}
      </div>
      <div className="grid grid-2">
        <BarChart
          title="Notes done per domain"
          bars={Object.entries(perDomain).sort((a, b) => b[1].total - a[1].total).map(([d, p]) => ({ label: domainInfo(d).label, value: p.done, max: p.total, color: domainInfo(d).color }))}
        />
        <BarChart title="Applications by status" bars={APP_STATUSES.map((st) => ({ label: st === 'oa' ? 'OA' : humanize(st), value: apps[st] ?? 0 }))} />
        <BarChart title="Projects by maturity" bars={MATURITY.map((m, i) => ({ label: `L${i + 1} ${m}`, value: mat[String(i + 1) as '1'] ?? 0 }))} />
        <BarChart
          title="Checklist completion (started)"
          bars={checklists
            .map((d) => ({ d, p: checklistProgress(d, s.checks) }))
            .filter((x) => x.p.done > 0)
            .sort((a, b) => b.p.pct - a.p.pct)
            .slice(0, 12)
            .map(({ d, p }) => ({ label: d.title, value: p.done, max: p.total }))}
        />
      </div>
    </>
  );
}

export default function Metrics() {
  return (
    <>
      <PageHeader title="Metrics" description="Computed only from your real state in this browser — no invented numbers." />
      <WithIndex>{(docs) => <Body docs={docs} />}</WithIndex>
    </>
  );
}
