import { lazy, Suspense, useEffect, type ComponentType } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Loading } from './components/ui';
import { useAppState } from './lib/store';
import { applyTheme } from './lib/theme';

const page = (load: () => Promise<{ default: ComponentType }>) => lazy(load);

const Dashboard = page(() => import('./pages/Dashboard'));
const Today = page(() => import('./pages/Today'));
const Knowledge = page(() => import('./pages/Knowledge'));
const DomainPage = lazy(() => import('./pages/DomainPage'));
const DocPage = page(() => import('./pages/DocPage'));
const Graph = page(() => import('./pages/Graph'));
const Projects = page(() => import('./pages/Projects'));
const Career = page(() => import('./pages/Career'));
const Research = page(() => import('./pages/Research'));
const Academic = page(() => import('./pages/Academic'));
const CommandCenter = page(() => import('./pages/CommandCenter'));
const Metrics = page(() => import('./pages/Metrics'));
const Checklists = page(() => import('./pages/Checklists'));
const Settings = page(() => import('./pages/Settings'));
const About = page(() => import('./pages/About'));
const NotFound = page(() => import('./pages/NotFound'));

const HUBS = ['system-design', 'lld', 'ai', 'cybersecurity', 'dsa', 'cs-core'] as const;

export function AppRoutes() {
  const loc = useLocation();
  return (
    <ErrorBoundary resetKey={loc.pathname}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/today" element={<Today />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/domain/:domain" element={<DomainPage />} />
          {HUBS.map((h) => (
            <Route key={h} path={`/${h}`} element={<DomainPage hub={h} />} />
          ))}
          <Route path="/doc/:slug" element={<DocPage />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/career" element={<Career />} />
          <Route path="/research" element={<Research />} />
          <Route path="/academic" element={<Academic />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  const theme = useAppState((s) => s.theme);
  useEffect(() => applyTheme(theme), [theme]);
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}
