import { useState } from 'react';
import type { Experiment, ResearchPaper } from '../types';
import { setSlice, useAppState } from '../lib/store';
import { newId } from '../lib/storage';
import { CrudTable, type FieldDef } from '../components/CrudTable';
import { PageHeader } from '../components/ui';
import { DocBrowser } from './Knowledge';
import { WithIndex } from '../components/WithIndex';

const PAPER_FIELDS: FieldDef<ResearchPaper>[] = [
  { key: 'title', label: 'Title', kind: 'text', required: true, inTable: true, wide: true },
  { key: 'authors', label: 'Authors', kind: 'text', inTable: true },
  { key: 'venue', label: 'Venue', kind: 'text', inTable: true },
  { key: 'year', label: 'Year', kind: 'text', inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: ['to-read', 'reading', 'read'], inTable: true },
  { key: 'url', label: 'URL', kind: 'url' },
  { key: 'problem', label: 'Problem', kind: 'textarea' },
  { key: 'gap', label: 'Research gap', kind: 'textarea' },
  { key: 'method', label: 'Method', kind: 'textarea' },
  { key: 'results', label: 'Results', kind: 'textarea' },
  { key: 'limitations', label: 'Limitations', kind: 'textarea' },
  { key: 'novelty', label: 'Novelty', kind: 'textarea' },
  { key: 'futureWork', label: 'Future work', kind: 'textarea' },
];

const EXP_FIELDS: FieldDef<Experiment>[] = [
  { key: 'date', label: 'Date', kind: 'date', inTable: true },
  { key: 'title', label: 'Title', kind: 'text', required: true, inTable: true },
  { key: 'hypothesis', label: 'Hypothesis', kind: 'textarea', inTable: true },
  { key: 'setup', label: 'Setup', kind: 'textarea' },
  { key: 'result', label: 'Result', kind: 'textarea', inTable: true },
];

export default function Research() {
  const [tab, setTab] = useState<'papers' | 'experiments' | 'notes'>('papers');
  const papers = useAppState((s) => s.papers);
  const experiments = useAppState((s) => s.experiments);
  const tabs = [['papers', `Reading list (${papers.length})`], ['experiments', `Experiments (${experiments.length})`], ['notes', 'Research notes']] as const;
  return (
    <>
      <PageHeader title="Research" description="A structured reading list and an experiment log. Each paper captures problem, gap, method, results, limitations and novelty." />
      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => (
          <button key={k} role="tab" type="button" aria-selected={tab === k} aria-controls={`panel-${k}`} id={`tab-${k}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'papers' && (
          <CrudTable
            noun="paper" items={papers} fields={PAPER_FIELDS} filterField="status"
            onChange={(l) => setSlice('papers', l)}
            makeEmpty={(): ResearchPaper => ({ id: newId(), title: '', authors: '', venue: '', year: '', url: '', status: 'to-read', problem: '', gap: '', method: '', results: '', limitations: '', novelty: '', futureWork: '', createdAt: new Date().toISOString() })}
            empty={{ title: 'Reading list is empty', text: 'Add papers you intend to read. Fill the structured fields as you read — they become your literature review.' }}
          />
        )}
        {tab === 'experiments' && (
          <CrudTable
            noun="experiment" items={experiments} fields={EXP_FIELDS} defaultSort="date"
            onChange={(l) => setSlice('experiments', l)}
            makeEmpty={(): Experiment => ({ id: newId(), date: new Date().toISOString().slice(0, 10), title: '', hypothesis: '', setup: '', result: '', createdAt: new Date().toISOString() })}
            empty={{ title: 'No experiments logged', text: 'Write the hypothesis before running anything. Negative results are results.' }}
          />
        )}
        {tab === 'notes' && <WithIndex>{(docs) => <DocBrowser docs={docs} lockDomain="research" />}</WithIndex>}
      </div>
    </>
  );
}
