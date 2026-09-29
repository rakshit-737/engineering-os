import { z } from 'zod';
import type { AppState, TodaySlot } from '../types';

export const STORAGE_PREFIX = 'eos:v1:';
/** Schema version written into exports. Bump together with a MIGRATIONS entry. */
export const STATE_VERSION = 1;
/** Reject imports above this before JSON.parse to avoid freezing the tab. */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

/**
 * Migration strategy for a future v2: add `MIGRATIONS[1] = (v1) => v2shape` and bump
 * STATE_VERSION. Imports (and, when the key prefix changes to eos:v2:, a one-time
 * read of the eos:v1:* slices) run through `migrate` before validation, so old
 * exports keep working and nothing is silently dropped.
 */
export const MIGRATIONS: Record<number, (s: Record<string, unknown>) => Record<string, unknown>> = {};

export function migrate(input: Record<string, unknown>): { ok: true; state: Record<string, unknown> } | { ok: false; error: string } {
  const raw = input.version;
  let v = raw === undefined ? 1 : raw;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) return { ok: false, error: `Unknown state version "${String(raw)}".` };
  if (v > STATE_VERSION) return { ok: false, error: `Export is from a newer app version (v${v}); this build understands up to v${STATE_VERSION}.` };
  let s: Record<string, unknown> = { ...input };
  while (v < STATE_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) return { ok: false, error: `No migration from v${v}.` };
    s = step(s);
    v += 1;
  }
  return { ok: true, state: { ...s, version: STATE_VERSION } };
}
export const TODAY_SLOTS: TodaySlot[] = ['build', 'learn', 'research', 'career', 'review'];

const str = z.string().max(20000);
const short = z.string().max(500);
const id = z.string().min(1).max(100);
const createdAt = z.string().max(40);

export const DocProgressSchema = z.enum(['not-started', 'learning', 'done', 'revise']);

export const ProjectSchema = z.object({
  id, name: short.min(1), objective: str, problem: str, stack: short, repo: short, milestones: str,
  status: z.enum(['idea', 'active', 'paused', 'shipped', 'archived']),
  maturity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  createdAt,
});
export const TaskSchema = z.object({ id, title: short.min(1), status: z.enum(['todo', 'doing', 'done']), due: short, area: short, createdAt });
export const GoalSchema = z.object({
  id, title: short.min(1), horizon: z.enum(['week', 'month', 'quarter', 'year']), metric: short,
  status: z.enum(['open', 'achieved', 'dropped']), createdAt,
});
export const MilestoneSchema = z.object({ id, title: short.min(1), target: short, done: z.boolean(), createdAt });
export const HabitSchema = z.object({ id, name: short.min(1), cadence: z.enum(['daily', 'weekly']), log: z.array(short).max(5000), createdAt });
export const JournalSchema = z.object({ id, date: short, title: short, body: str, createdAt });
export const DecisionSchema = z.object({ id, date: short, title: short.min(1), context: str, decision: str, consequences: str, createdAt });
export const AchievementSchema = z.object({ id, date: short, title: short.min(1), evidence: str, createdAt });
export const ApplicationSchema = z.object({
  id, company: short.min(1), role: short, location: short,
  status: z.enum(['wishlist', 'applied', 'oa', 'interview', 'offer', 'rejected', 'withdrawn']),
  deadline: short, oa: short, interview: short, outcome: short, notes: str, createdAt,
});
export const PaperSchema = z.object({
  id, title: short.min(1), authors: short, venue: short, year: short, url: short,
  status: z.enum(['to-read', 'reading', 'read']),
  problem: str, gap: str, method: str, results: str, limitations: str, novelty: str, futureWork: str, createdAt,
});
export const ExperimentSchema = z.object({ id, date: short, title: short.min(1), hypothesis: str, setup: str, result: str, createdAt });
export const CourseSchema = z.object({ id, code: short, name: short.min(1), credits: z.number().min(0).max(40), grade: short, semester: short, createdAt });
export const AcademicItemSchema = z.object({
  id, kind: z.enum(['exam', 'assignment', 'lab']), course: short, title: short.min(1), due: short,
  status: z.enum(['pending', 'submitted', 'graded']), createdAt,
});
const SlotStateSchema = z.object({ slug: z.string().max(200).nullable(), locked: z.boolean(), done: z.boolean(), seed: z.number() });
const slotRecord = <T extends z.ZodTypeAny>(s: T) =>
  z.object({ build: s, learn: s, research: s, career: s, review: s });

export const StateSchema = z.object({
  version: z.literal(1),
  docStatus: z.record(z.string().max(200), DocProgressSchema),
  checks: z.record(z.string().max(220), z.boolean()),
  bookmarks: z.array(z.string().max(200)).max(5000),
  pins: z.array(z.string().max(200)).max(200),
  mission: z.string().max(1000),
  weeklyObjectives: z.array(z.object({ id, text: short, done: z.boolean() })).max(200),
  tasks: z.array(TaskSchema),
  goals: z.array(GoalSchema),
  milestones: z.array(MilestoneSchema),
  habits: z.array(HabitSchema),
  journal: z.array(JournalSchema),
  decisions: z.array(DecisionSchema),
  achievements: z.array(AchievementSchema),
  applications: z.array(ApplicationSchema),
  projects: z.array(ProjectSchema),
  papers: z.array(PaperSchema),
  experiments: z.array(ExperimentSchema),
  courses: z.array(CourseSchema),
  academicItems: z.array(AcademicItemSchema),
  todayConfig: z.object({ domains: slotRecord(z.array(z.string().max(50)).max(20)) }),
  today: z.object({ date: short, slots: slotRecord(SlotStateSchema) }).nullable(),
  activity: z.array(z.object({ at: short, kind: short, label: short, slug: z.string().max(200).optional() })).max(500),
  theme: z.enum(['light', 'dark', 'system']),
});

// Compile-time guarantee that the schema and the TS interface agree.
type SchemaOut = z.infer<typeof StateSchema>;
const _typecheck: (s: SchemaOut) => AppState = (s) => s;
void _typecheck;

export type SliceKey = Exclude<keyof AppState, 'version'>;
export const SLICE_KEYS = Object.keys(StateSchema.shape).filter((k) => k !== 'version') as SliceKey[];

export function defaultState(): AppState {
  return {
    version: 1,
    docStatus: {}, checks: {}, bookmarks: [], pins: [],
    mission: '', weeklyObjectives: [],
    tasks: [], goals: [], milestones: [], habits: [], journal: [], decisions: [], achievements: [],
    applications: [], projects: [], papers: [], experiments: [], courses: [], academicItems: [],
    todayConfig: {
      domains: {
        build: ['projects', 'system-design', 'lld', 'patterns'],
        learn: ['cs-core', 'ai', 'cybersecurity'],
        research: ['research', 'ai'],
        career: ['career', 'dsa'],
        review: [],
      },
    },
    today: null,
    activity: [],
    theme: 'system',
  };
}

type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>;

function safeStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

/**
 * Validate one slice. Arrays are filtered item-by-item so one corrupt record does
 * not wipe the rest; anything else falls back to the default.
 */
export function validateSlice<K extends SliceKey>(key: K, value: unknown): AppState[K] {
  const schema = StateSchema.shape[key] as z.ZodTypeAny;
  const full = schema.safeParse(value);
  if (full.success) return full.data as AppState[K];
  if (schema instanceof z.ZodArray && Array.isArray(value)) {
    const item = schema.element as z.ZodTypeAny;
    return value.flatMap((v) => {
      const r = item.safeParse(v);
      return r.success ? [r.data] : [];
    }) as AppState[K];
  }
  if (schema instanceof z.ZodRecord && value && typeof value === 'object' && !Array.isArray(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (schema.valueSchema.safeParse(v).success && k.length <= 220) out[k] = v;
    }
    return out as AppState[K];
  }
  return defaultState()[key];
}

export function loadState(storage: Storage | null = safeStorage()): AppState {
  const state = defaultState();
  if (!storage) return state;
  for (const key of SLICE_KEYS) {
    try {
      const raw = storage.getItem(STORAGE_PREFIX + key);
      if (raw == null) continue;
      (state as unknown as Record<string, unknown>)[key] = validateSlice(key, JSON.parse(raw));
    } catch {
      /* corrupt JSON -> keep default */
    }
  }
  return state;
}

export function saveSlice<K extends SliceKey>(key: K, value: AppState[K], storage: Storage | null = safeStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false; // quota exceeded / private mode
  }
}

export function clearState(storage: Storage | null = safeStorage()): void {
  if (!storage) return;
  for (const key of SLICE_KEYS) {
    try {
      storage.removeItem(STORAGE_PREFIX + key);
    } catch {
      /* ignore */
    }
  }
}

export function exportState(state: AppState): string {
  return JSON.stringify({ app: 'engineering-os', exportedAt: new Date().toISOString(), state }, null, 2);
}

export type ImportResult = { ok: true; state: AppState } | { ok: false; error: string };

/** Strict import: the whole payload must validate, otherwise nothing is changed. */
export function importState(json: string): ImportResult {
  if (json.length > MAX_IMPORT_BYTES) {
    return { ok: false, error: `File is too large (max ${Math.round(MAX_IMPORT_BYTES / 1024 / 1024)} MB).` };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }
  const candidate =
    parsed && typeof parsed === 'object' && 'state' in parsed ? (parsed as { state: unknown }).state : parsed;
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return { ok: false, error: 'Missing state object.' };
  const migrated = migrate(candidate as Record<string, unknown>);
  if (!migrated.ok) return migrated;
  // allow older exports that omit newer slices
  const merged = { ...defaultState(), ...migrated.state };
  const r = StateSchema.safeParse(merged);
  if (!r.success) {
    const issue = r.error.issues[0];
    return { ok: false, error: `Invalid data at "${issue?.path.join('.') ?? '?'}": ${issue?.message ?? 'unknown error'}` };
  }
  return { ok: true, state: r.data };
}

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
