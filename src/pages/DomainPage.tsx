import { Link, useParams } from 'react-router-dom';
import { domainInfo, humanize } from '../lib/domains';
import { computeProgress, trackable } from '../lib/progress';
import { groupBy } from '../lib/content';
import { useAppState } from '../lib/store';
import { WithIndex } from '../components/WithIndex';
import { PageHeader, ProgressBar } from '../components/ui';
import { DocBrowser } from './Knowledge';
import type { DocMeta } from '../types';

const HUB_LINKS: Record<string, { label: string; to: string }[]> = {
  'system-design': [{ label: 'LLD hub', to: '/lld' }, { label: 'Patterns', to: '/domain/patterns' }, { label: 'ADRs', to: '/domain/adr' }],
  lld: [{ label: 'System Design hub', to: '/system-design' }, { label: 'Patterns', to: '/domain/patterns' }],
  dsa: [{ label: 'Cheat sheets', to: '/knowledge?type=cheatsheet' }, { label: 'Metrics', to: '/metrics' }],
  cybersecurity: [{ label: 'Checklists', to: '/checklists' }, { label: 'Roadmaps', to: '/knowledge?type=roadmap' }],
  ai: [{ label: 'Research', to: '/research' }, { label: 'Prompts', to: '/domain/prompts' }],
  'cs-core': [{ label: 'DSA hub', to: '/dsa' }, { label: 'Graph', to: '/graph' }],
};

function CategoryProgress({ docs }: { docs: DocMeta[] }) {
  const statuses = useAppState((s) => s.docStatus);
  const groups = groupBy(trackable(docs), (d) => d.category);
  if (groups.length < 2) return null;
  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-title">Progress by category</div>
      {groups.map(([cat, list]) => {
        const p = computeProgress(list, statuses);
        return (
          <div className="progress-row" key={cat}>
            <span>{humanize(cat)}</span>
            <ProgressBar value={p.pct} label={`${humanize(cat)} progress`} />
            <span className="subtle">{p.done}/{p.total}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function DomainPage({ hub }: { hub?: string }) {
  const params = useParams();
  const domain = hub ?? params.domain ?? '';
  const info = domainInfo(domain);
  const statuses = useAppState((s) => s.docStatus);
  return (
    <>
      <PageHeader
        title={info.label}
        description={info.blurb || undefined}
        actions={HUB_LINKS[domain]?.map((l) => <Link key={l.to} className="btn btn-sm" to={l.to}>{l.label}</Link>)}
      />
      <WithIndex>
        {(all) => {
          const docs = all.filter((d) => d.domain === domain);
          const p = computeProgress(trackable(docs), statuses);
          return (
            <>
              {docs.length > 0 && (
                <div className="card" style={{ marginBottom: 16 }}>
                  <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong>Overall</strong>
                    <span className="subtle">{p.done} done · {p.learning} learning · {p.revise} to revise · {p.total} total</span>
                  </div>
                  <ProgressBar value={p.pct} label={`${info.label} progress`} />
                </div>
              )}
              {hub && <CategoryProgress docs={docs} />}
              <DocBrowser docs={all} lockDomain={domain} />
            </>
          );
        }}
      </WithIndex>
    </>
  );
}
