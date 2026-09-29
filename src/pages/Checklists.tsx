import { Link } from 'react-router-dom';
import { checklistProgress } from '../lib/progress';
import { sortDocs } from '../lib/content';
import { useAppState } from '../lib/store';
import { WithIndex } from '../components/WithIndex';
import { DomainChip, EmptyState, PageHeader, ProgressBar } from '../components/ui';

export default function Checklists() {
  const checks = useAppState((s) => s.checks);
  return (
    <>
      <PageHeader title="Checklists" description="Every checklist note. Tick items on the note page; progress is stored per item in this browser." />
      <WithIndex>
        {(docs) => {
          const list = sortDocs(docs.filter((d) => d.type === 'checklist' || d.domain === 'checklists'));
          if (!list.length) return <EmptyState title="No checklists yet">Add notes with <code>type: checklist</code> and <code>- [ ]</code> items.</EmptyState>;
          return (
            <ul className="doc-list">
              {list.map((d) => {
                const p = checklistProgress(d, checks);
                return (
                  <li key={d.slug}>
                    <Link className="doc-row" to={`/doc/${encodeURIComponent(d.slug)}`}>
                      <div className="doc-row-main">
                        <div className="title">{d.title}</div>
                        {d.description && <div className="desc">{d.description}</div>}
                      </div>
                      <div className="meta" style={{ alignItems: 'center', width: 220 }}>
                        <span className="hide-sm"><DomainChip domain={d.domain} /></span>
                        <div style={{ flex: 1, minWidth: 60 }}><ProgressBar value={p.pct} label={`${d.title} completion`} /></div>
                        <span className="subtle">{p.total ? `${p.pct}%` : '—'}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          );
        }}
      </WithIndex>
    </>
  );
}
