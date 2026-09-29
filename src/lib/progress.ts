import type { AppState, CareerApplication, Course, DocMeta, DocProgress, Project, TodaySlot, TodayState } from '../types';
import { domainInfo } from './domains';
import { TODAY_SLOTS } from './storage';

export interface Progress {
  total: number;
  done: number;
  learning: number;
  revise: number;
  pct: number;
}

export function computeProgress(docs: DocMeta[], statuses: Record<string, DocProgress>): Progress {
  let done = 0, learning = 0, revise = 0;
  for (const d of docs) {
    const s = statuses[d.slug];
    if (s === 'done') done++;
    else if (s === 'learning') learning++;
    else if (s === 'revise') revise++;
  }
  const total = docs.length;
  return { total, done, learning, revise, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** Docs that count as "learnable" (not indexes). */
export function trackable(docs: DocMeta[]): DocMeta[] {
  return docs.filter((d) => d.type !== 'index');
}

export function progressByDomain(docs: DocMeta[], statuses: Record<string, DocProgress>): Record<string, Progress> {
  const groups = new Map<string, DocMeta[]>();
  for (const d of trackable(docs)) {
    if (!groups.has(d.domain)) groups.set(d.domain, []);
    groups.get(d.domain)!.push(d);
  }
  const out: Record<string, Progress> = {};
  for (const [k, v] of groups) out[k] = computeProgress(v, statuses);
  return out;
}

export type PulseKey = 'build' | 'learn' | 'research' | 'career' | 'academic';
export const PULSE_KEYS: PulseKey[] = ['build', 'learn', 'research', 'career', 'academic'];

export function pulse(docs: DocMeta[], statuses: Record<string, DocProgress>): Record<PulseKey, Progress> {
  const out = {} as Record<PulseKey, Progress>;
  for (const k of PULSE_KEYS) {
    out[k] = computeProgress(trackable(docs).filter((d) => domainInfo(d.domain).pulse === k), statuses);
  }
  return out;
}

/** Task-list progress for a single doc: keys are `slug#index`. */
export function checklistProgress(doc: Pick<DocMeta, 'slug' | 'taskCount'>, checks: Record<string, boolean>): Progress {
  let done = 0;
  for (let i = 0; i < doc.taskCount; i++) if (checks[`${doc.slug}#${i}`]) done++;
  const total = doc.taskCount;
  return { total, done, learning: 0, revise: 0, pct: total ? Math.round((done / total) * 100) : 0 };
}

// ---------- Today planner ----------

/** Deterministic PRNG so rerolls are reproducible and testable. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function candidatesFor(
  slot: TodaySlot,
  docs: DocMeta[],
  statuses: Record<string, DocProgress>,
  domains: string[],
): DocMeta[] {
  const pool = trackable(docs);
  if (slot === 'review') return pool.filter((d) => statuses[d.slug] === 'revise' || statuses[d.slug] === 'learning');
  const inDomain = domains.length ? pool.filter((d) => domains.includes(d.domain)) : pool;
  const learning = inDomain.filter((d) => statuses[d.slug] === 'learning');
  const fresh = inDomain.filter((d) => !statuses[d.slug] || statuses[d.slug] === 'not-started');
  return [...learning, ...fresh];
}

export function pickFor(
  slot: TodaySlot,
  date: string,
  seed: number,
  docs: DocMeta[],
  statuses: Record<string, DocProgress>,
  domains: string[],
  exclude: Set<string> = new Set(),
): string | null {
  const c = candidatesFor(slot, docs, statuses, domains).filter((d) => !exclude.has(d.slug));
  if (!c.length) return null;
  // Prefer in-progress docs, then prerequisites-first ordering among fresh ones.
  const learning = c.filter((d) => statuses[d.slug] === 'learning');
  const pool = learning.length && seed === 0 ? learning : c;
  const idx = hash(`${date}:${slot}:${seed}`) % pool.length;
  return pool[idx]!.slug;
}

export function buildToday(
  prev: TodayState | null,
  date: string,
  docs: DocMeta[],
  s: Pick<AppState, 'docStatus' | 'todayConfig'>,
): TodayState {
  const keep = prev && prev.date === date ? prev : null;
  const used = new Set<string>();
  const slots = {} as TodayState['slots'];
  for (const slot of TODAY_SLOTS) {
    const cur = keep?.slots[slot];
    if (cur && (cur.locked || cur.done || cur.slug)) {
      slots[slot] = cur;
      if (cur.slug) used.add(cur.slug);
      continue;
    }
    const slug = pickFor(slot, date, 0, docs, s.docStatus, s.todayConfig.domains[slot], used);
    if (slug) used.add(slug);
    slots[slot] = { slug, locked: false, done: false, seed: 0 };
  }
  return { date, slots };
}

export function localDate(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// ---------- Academic ----------

export const GRADE_POINTS: Record<string, number> = {
  O: 10, 'A+': 9, A: 8, 'B+': 7, B: 6, C: 5, P: 4, F: 0,
};

export function gradePoint(grade: string): number | null {
  const g = grade.trim().toUpperCase();
  if (g in GRADE_POINTS) return GRADE_POINTS[g]!;
  const n = Number(g);
  return g !== '' && Number.isFinite(n) && n >= 0 && n <= 10 ? n : null;
}

export function cgpa(courses: Pick<Course, 'credits' | 'grade'>[]): { cgpa: number | null; credits: number } {
  let pts = 0, credits = 0;
  for (const c of courses) {
    const gp = gradePoint(c.grade);
    if (gp === null || !(c.credits > 0)) continue;
    pts += gp * c.credits;
    credits += c.credits;
  }
  return { cgpa: credits ? Math.round((pts / credits) * 100) / 100 : null, credits };
}

// ---------- Metrics ----------

export function countBy<T, K extends string>(items: T[], key: (t: T) => K): Record<K, number> {
  const out = {} as Record<K, number>;
  for (const i of items) {
    const k = key(i);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

export function applicationsByStatus(apps: CareerApplication[]) {
  return countBy(apps, (a) => a.status);
}
export function projectsByMaturity(projects: Project[]) {
  return countBy(projects, (p) => String(p.maturity) as '1' | '2' | '3' | '4' | '5');
}

export function isLab(d: DocMeta): boolean {
  return /lab/i.test(d.category) || d.tags.some((t) => /lab|ctf/i.test(t)) || /lab/i.test(d.slug);
}
