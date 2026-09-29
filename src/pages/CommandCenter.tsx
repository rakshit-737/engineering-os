import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Achievement, Decision, Goal, Habit, JournalEntry, Milestone, Task } from '../types';
import { setSlice, useAppState } from '../lib/store';
import { newId } from '../lib/storage';
import { localDate } from '../lib/progress';
import { CrudTable, type FieldDef } from '../components/CrudTable';
import { PageHeader, TabPanel, Tabs } from '../components/ui';

const now = () => new Date().toISOString();
const today = () => localDate();

const TASK_FIELDS: FieldDef<Task>[] = [
  { key: 'title', label: 'Task', kind: 'text', required: true, inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: ['todo', 'doing', 'done'], inTable: true },
  { key: 'area', label: 'Area', kind: 'text', inTable: true },
  { key: 'due', label: 'Due', kind: 'date', inTable: true },
];
const GOAL_FIELDS: FieldDef<Goal>[] = [
  { key: 'title', label: 'Goal', kind: 'text', required: true, inTable: true },
  { key: 'horizon', label: 'Horizon', kind: 'select', options: ['week', 'month', 'quarter', 'year'], inTable: true },
  { key: 'metric', label: 'How will you know it is achieved?', kind: 'text', inTable: true },
  { key: 'status', label: 'Status', kind: 'select', options: ['open', 'achieved', 'dropped'], inTable: true },
];
const MILESTONE_FIELDS: FieldDef<Milestone>[] = [
  { key: 'title', label: 'Milestone', kind: 'text', required: true, inTable: true },
  { key: 'target', label: 'Target date', kind: 'date', inTable: true },
];
const DECISION_FIELDS: FieldDef<Decision>[] = [
  { key: 'date', label: 'Date', kind: 'date', inTable: true },
  { key: 'title', label: 'Decision', kind: 'text', required: true, inTable: true },
  { key: 'context', label: 'Context', kind: 'textarea' },
  { key: 'decision', label: 'What was decided and why', kind: 'textarea' },
  { key: 'consequences', label: 'Expected consequences', kind: 'textarea', inTable: true },
];
const JOURNAL_FIELDS: FieldDef<JournalEntry>[] = [
  { key: 'date', label: 'Date', kind: 'date', inTable: true },
  { key: 'title', label: 'Title', kind: 'text', inTable: true },
  { key: 'body', label: 'Entry', kind: 'textarea', inTable: true },
];
const ACH_FIELDS: FieldDef<Achievement>[] = [
  { key: 'date', label: 'Date', kind: 'date', inTable: true },
  { key: 'title', label: 'Achievement', kind: 'text', required: true, inTable: true },
  { key: 'evidence', label: 'Evidence (link, metric, artifact)', kind: 'textarea', inTable: true },
];

function streak(log: string[]): number {
  const set = new Set(log);
  let n = 0;
  const d = new Date();
  while (set.has(localDate(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

function Habits() {
  const habits = useAppState((s) => s.habits);
  const t = today();
  const fields: FieldDef<Habit>[] = [
    { key: 'name', label: 'Habit', kind: 'text', required: true, inTable: true },
    { key: 'cadence', label: 'Cadence', kind: 'select', options: ['daily', 'weekly'], inTable: true },
    {
      key: 'log', label: 'Today', kind: 'text', inTable: true, formHidden: true,
      render: (h) => (
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={h.log.includes(t)}
            onChange={() => setSlice('habits', (l) => l.map((x) => (x.id === h.id ? { ...x, log: x.log.includes(t) ? x.log.filter((d) => d !== t) : [...x.log, t] } : x)))}
          />
          <span>{streak(h.log)}-day streak</span>
        </label>
      ),
    },
  ];
  // Only name + cadence are editable in the form; the "Today" column is a live toggle.
  return (
    <CrudTable
      noun="habit" items={habits} fields={fields}
      onChange={(l) => setSlice('habits', l)}
      makeEmpty={(): Habit => ({ id: newId(), name: '', cadence: 'daily', log: [], createdAt: now() })}
      empty={{ title: 'No habits', text: 'Track a small number of habits that compound: one DSA problem, 30 minutes of reading, a daily commit.' }}
    />
  );
}

function Milestones() {
  const items = useAppState((s) => s.milestones);
  const fields: FieldDef<Milestone>[] = [
    ...MILESTONE_FIELDS,
    {
      key: 'done', label: 'Done', kind: 'text', inTable: true, formHidden: true,
      render: (m) => (
        <input
          type="checkbox" aria-label={`Mark ${m.title} done`} checked={m.done}
          onChange={() => setSlice('milestones', (l) => l.map((x) => (x.id === m.id ? { ...x, done: !x.done } : x)))}
        />
      ),
    },
  ];
  return (
    <CrudTable
      noun="milestone" items={items} fields={fields} defaultSort="target" onChange={(l) => setSlice('milestones', l)}
      makeEmpty={() => ({ id: newId(), title: '', target: '', done: false, createdAt: now() })}
      empty={{ title: 'No milestones', text: 'Milestones are dated checkpoints on the way to a goal: “rate limiter deployed”, “100 DSA problems”.' }}
    />
  );
}

const REVIEW_PROMPTS = {
  Weekly: [
    'What did I ship this week? Link the artifacts.',
    'Which notes moved to Done — can I explain each without looking?',
    'What blocked me, and is that blocker a system I can fix?',
    'What repeated task should become a script or checklist?',
    'Top three objectives for next week.',
  ],
  Monthly: [
    'Which project gained a maturity level? Which stalled, and why?',
    'Where did my time actually go versus where I intended?',
    'What did I learn that changed how I build?',
    'Applications and interviews: what patterns show up in outcomes?',
    'One thing to stop, one to start, one to continue.',
  ],
};

export default function CommandCenter() {
  const s = useAppState((st) => st);
  const tabs = ['Tasks', 'Goals', 'Milestones', 'Habits', 'Decisions', 'Journal', 'Achievements', 'Reviews'] as const;
  const [tab, setTab] = useState<(typeof tabs)[number]>('Tasks');
  return (
    <>
      <PageHeader title="Command Center" description={<>Tasks, goals, habits and logs — the operational side of the system. Templates live in the <Link to="/domain/command-center">command-center notes</Link>.</>} />
      <Tabs label="Command center sections" idPrefix="cc" tabs={tabs.map((t) => [t, t] as const)} value={tab} onChange={setTab} />
      <TabPanel idPrefix="cc" value={tab}>
        {tab === 'Tasks' && (
          <CrudTable noun="task" items={s.tasks} fields={TASK_FIELDS} filterField="status" defaultSort="due" onChange={(l) => setSlice('tasks', l)}
            makeEmpty={(): Task => ({ id: newId(), title: '', status: 'todo', due: '', area: '', createdAt: now() })}
            empty={{ title: 'No tasks', text: 'Capture concrete next actions. If it takes under two minutes, do it instead.' }} />
        )}
        {tab === 'Goals' && (
          <CrudTable noun="goal" items={s.goals} fields={GOAL_FIELDS} filterField="horizon" onChange={(l) => setSlice('goals', l)}
            makeEmpty={(): Goal => ({ id: newId(), title: '', horizon: 'month', metric: '', status: 'open', createdAt: now() })}
            empty={{ title: 'No goals', text: 'Goals need a measurable “done” — write the metric, not the aspiration.' }} />
        )}
        {tab === 'Milestones' && <Milestones />}
        {tab === 'Habits' && <Habits />}
        {tab === 'Decisions' && (
          <CrudTable noun="decision" items={s.decisions} fields={DECISION_FIELDS} defaultSort="date" onChange={(l) => setSlice('decisions', l)}
            makeEmpty={() => ({ id: newId(), date: today(), title: '', context: '', decision: '', consequences: '', createdAt: now() })}
            empty={{ title: 'No decisions logged', text: 'Personal ADRs: record significant choices (stack, offers, courses) with context so future-you can judge them fairly.' }} />
        )}
        {tab === 'Journal' && (
          <CrudTable noun="entry" items={s.journal} fields={JOURNAL_FIELDS} defaultSort="date" onChange={(l) => setSlice('journal', l)}
            makeEmpty={() => ({ id: newId(), date: today(), title: '', body: '', createdAt: now() })}
            empty={{ title: 'Journal is empty', text: 'Engineering journal: what you tried, what broke, what you learned. Document instead of relying on memory.' }} />
        )}
        {tab === 'Achievements' && (
          <CrudTable noun="achievement" items={s.achievements} fields={ACH_FIELDS} defaultSort="date" onChange={(l) => setSlice('achievements', l)}
            makeEmpty={() => ({ id: newId(), date: today(), title: '', evidence: '', createdAt: now() })}
            empty={{ title: 'No achievements logged', text: 'Log wins with evidence as they happen — it makes resumes and reviews trivial.' }} />
        )}
        {tab === 'Reviews' && (
          <div className="grid grid-2">
            {Object.entries(REVIEW_PROMPTS).map(([k, qs]) => (
              <div className="card" key={k}>
                <div className="card-title">{k} review</div>
                <ol style={{ margin: 0, paddingLeft: 18 }}>{qs.map((q) => <li key={q}>{q}</li>)}</ol>
                <p className="subtle">Write answers as a Journal entry.</p>
              </div>
            ))}
          </div>
        )}
      </TabPanel>
    </>
  );
}
