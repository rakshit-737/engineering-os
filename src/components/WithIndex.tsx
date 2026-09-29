import type { ReactNode } from 'react';
import type { DocMeta } from '../types';
import { useIndex } from '../lib/content';
import { ErrorState, Loading } from './ui';

/** Loads index.json once (cached) and renders loading / error / content states. */
export function WithIndex({ children }: { children: (docs: DocMeta[]) => ReactNode }) {
  const { data, error, loading, retry } = useIndex();
  if (error) return <ErrorState error={error} onRetry={retry} />;
  if (loading || !data) return <Loading label="Loading content index" />;
  return <>{children(data)}</>;
}
