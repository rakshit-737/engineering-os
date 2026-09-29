import { describe, expect, it } from 'vitest';
import { buildToday, candidatesFor, cgpa, checklistProgress, computeProgress, pickFor, progressByDomain, pulse } from './progress';
import { defaultState } from './storage';
import type { DocMeta } from '../types';

const doc = (slug: string, domain: string, o: Partial<DocMeta> = {}): DocMeta => ({
  slug, title: slug, description: '', domain, category: 'c', type: 'concept', status: 'evergreen', tags: [],
  prerequisites: [], related: [], path: `${slug}.md`, headings: [], wordCount: 0, taskCount: 0, backlinks: [], outgoing: [], ...o,
});

const docs = [
  doc('a', 'cs-core'), doc('b', 'cs-core'), doc('c', 'cs-core'), doc('d', 'system-design'),
  doc('e', 'career'), doc('idx', 'cs-core', { type: 'index' }),
];

describe('progress', () => {
  it('computes percentages from statuses', () => {
    expect(computeProgress(docs.slice(0, 3), { a: 'done', b: 'learning', c: 'revise' })).toEqual({ total: 3, done: 1, learning: 1, revise: 1, pct: 33 });
    expect(computeProgress([], {}).pct).toBe(0);
  });
  it('groups by domain excluding index notes', () => {
    const p = progressByDomain(docs, { a: 'done', idx: 'done' });
    expect(p['cs-core']).toMatchObject({ total: 3, done: 1 });
  });
  it('maps domains into pulse buckets', () => {
    const p = pulse(docs, { d: 'done', e: 'done' });
    expect(p.build).toMatchObject({ total: 1, done: 1, pct: 100 });
    expect(p.career.pct).toBe(100);
    expect(p.learn).toMatchObject({ total: 3, done: 0 });
    expect(p.research.total).toBe(0);
  });
  it('computes checklist completion from slug#index keys', () => {
    const d = doc('chk', 'checklists', { taskCount: 4 });
    expect(checklistProgress(d, { 'chk#0': true, 'chk#3': true, 'other#1': true, 'chk#9': true })).toMatchObject({ done: 2, total: 4, pct: 50 });
  });
});

describe('today planner', () => {
  const s = defaultState();
  it('review slot draws only from revise/learning', () => {
    expect(candidatesFor('review', docs, { a: 'revise', b: 'done' }, []).map((d) => d.slug)).toEqual(['a']);
  });
  it('excludes done notes and respects configured domains', () => {
    const c = candidatesFor('learn', docs, { a: 'done' }, ['cs-core']).map((d) => d.slug);
    expect(c.sort()).toEqual(['b', 'c']);
  });
  it('is deterministic per date+seed and rerolls change the pick when possible', () => {
    const p1 = pickFor('learn', '2026-01-01', 0, docs, {}, ['cs-core']);
    expect(pickFor('learn', '2026-01-01', 0, docs, {}, ['cs-core'])).toBe(p1);
    const picks = new Set([0, 1, 2, 3, 4, 5].map((seed) => pickFor('learn', '2026-01-01', seed, docs, {}, ['cs-core'])));
    expect(picks.size).toBeGreaterThan(1);
  });
  it('keeps locked slots and does not duplicate docs across slots', () => {
    const first = buildToday(null, '2026-01-01', docs, s);
    const locked = { ...first, slots: { ...first.slots, learn: { slug: 'c', locked: true, done: false, seed: 0 } } };
    const again = buildToday(locked, '2026-01-01', docs, s);
    expect(again.slots.learn.slug).toBe('c');
    const slugs = Object.values(again.slots).map((x) => x.slug).filter(Boolean);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(buildToday(locked, '2026-01-02', docs, s).slots.learn.locked).toBe(false);
  });
});

describe('cgpa', () => {
  it('weights by credits and ignores ungraded/invalid rows', () => {
    expect(cgpa([{ credits: 4, grade: 'O' }, { credits: 2, grade: 'B' }, { credits: 3, grade: '' }, { credits: 3, grade: 'Z' }])).toEqual({ cgpa: 8.67, credits: 6 });
    expect(cgpa([{ credits: 3, grade: '8.5' }]).cgpa).toBe(8.5);
    expect(cgpa([]).cgpa).toBeNull();
  });
});
