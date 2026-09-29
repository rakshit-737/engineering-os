import { Link, useLocation } from 'react-router-dom';
import { EmptyState, PageHeader } from '../components/ui';

export default function NotFound() {
  const loc = useLocation();
  return (
    <>
      <PageHeader title="Page not found" />
      <EmptyState title={`Nothing at ${loc.pathname}`}>
        The link may be outdated. Press <kbd>Ctrl</kbd> <kbd>K</kbd> to search, or jump to one of these:
      </EmptyState>
      <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
        <Link className="btn" to="/">Dashboard</Link>
        <Link className="btn" to="/knowledge">Knowledge</Link>
        <Link className="btn" to="/today">Today</Link>
        <Link className="btn" to="/graph">Graph</Link>
      </div>
    </>
  );
}
