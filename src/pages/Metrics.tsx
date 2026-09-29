import { applicationsByStatus, checklistProgress, isLab, progressByDomain, projectsByMaturity } from '../lib/progress';
import { domainInfo, humanize } from '../lib/domains';
import { useAppState } from '../lib/store';
import { WithIndex } from '../components/WithIndex';
import { PageHeader } from '../components/ui';
import { MATURITY } from './Projects';
import { APP_STATUSES } from './Career';
import type { DocMeta } from '../types';

interface Bar { label: string; value: number; max?: number; color?: string; suffix?: string }

/** Plain SVG horizontal bar chart; no chart library. */
export function BarChart({ title, bars }: { title: string; bars: Bar[] }) {
  const max = Math.max(1, ...bars.map((b) => b.max ?? b.value));
  const rowH = 22;
  const labelW = 130;
  const w = 480;
  return (
    <figure className="card" style={{ margin: 0 }}>
      <figcaption className="card-title">{title}</figcaption>
      {bars.length === 0 ? (
        <p className="subtle" style={{ margin: 0 }}>No data yet.</p>
      ) : (
        <svg viewBox={`0 0 ${w} ${bars.length * rowH}`} width="100%" role="img" aria-label={`${title}: ${bars.map((b) => `${b.label} ${b.value}${b.max ? ` of ${b.max}` : ''}`).join(', ')}`}>
          {bars.map((b, i) => {
            const bw = ((w - labelW - 70) * (b.max ? b.value / Math.max(1, b.max) : b.value / max));
            return (
              <g key={b.label} transform={`translate(0 ${i * rowH})`}>
                <text x={0} y={15} fontSize={12} fill="var(--fg-muted)">{b.label.length > 18 ? `${b.label.slice(0, 17)}…` : b.label}</text>
                <rect x={labelW} y={5} width={w - labelW - 70} height={12} rx={3} fill="var(--bg-muted)" />
                <rect x={labelW} y={5} width={Math.max(0, bw)} height={12} rx={3} fill={b.color ?? 'var(--accent)'} />
                <text x={w - 62} y={15} fontSize={12} fill="var(--fg)">{b.value}{b.max ? `/${b.max}` : ''}{b.suffix ?? ''}</text>
              </g>
            );
          })}
        </svg>
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
        {stat('Notes done', Object.values(s.docStatus).filter((x) => x === 'done').length, `of ${docs.length}`)}
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
