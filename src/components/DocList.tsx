import { Link } from 'react-router-dom';
import type { DocMeta } from '../types';
import { useAppState } from '../lib/store';
import { humanize } from '../lib/domains';
import { Chip, DomainChip, StatusChip } from './ui';

export function DocList({ docs, showDomain }: { docs: DocMeta[]; showDomain?: boolean }) {
  const statuses = useAppState((s) => s.docStatus);
  return (
    <ul className="doc-list">
      {docs.map((d) => (
        <li key={d.slug}>
          <Link className="doc-row" to={`/doc/${encodeURIComponent(d.slug)}`}>
            <div className="doc-row-main">
              <div className="title">{d.title}</div>
              {d.description && <div className="desc">{d.description}</div>}
            </div>
            <div className="meta">
              <StatusChip status={statuses[d.slug] ?? 'not-started'} />
              {showDomain && <span className="hide-sm"><DomainChip domain={d.domain} /></span>}
              <span className="hide-sm"><Chip>{humanize(d.type)}</Chip></span>
              {d.difficulty && <span className="hide-sm"><Chip>{humanize(d.difficulty)}</Chip></span>}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
