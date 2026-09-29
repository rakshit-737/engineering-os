import { beforeEach, describe, expect, it } from 'vitest';
import { defaultState, exportState, importState, loadState, saveSlice, STORAGE_PREFIX, validateSlice } from './storage';

class MemStorage {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

const project = { id: 'p1', name: 'Limiter', objective: '', problem: '', stack: 'Go', repo: '', milestones: '', status: 'active', maturity: 2, createdAt: '2026-01-01' };

describe('storage', () => {
  let st: MemStorage;
  beforeEach(() => { st = new MemStorage(); });

  it('uses versioned keys and round-trips slices', () => {
    saveSlice('mission', 'ship it', st);
    expect(st.m.has(`${STORAGE_PREFIX}mission`)).toBe(true);
    expect(STORAGE_PREFIX).toBe('eos:v1:');
    expect(loadState(st).mission).toBe('ship it');
  });

  it('survives corrupt JSON and wrong types', () => {
    st.setItem(`${STORAGE_PREFIX}mission`, '{not json');
    st.setItem(`${STORAGE_PREFIX}theme`, '"neon"');
    st.setItem(`${STORAGE_PREFIX}bookmarks`, '42');
    const s = loadState(st);
    expect(s.mission).toBe('');
    expect(s.theme).toBe('system');
    expect(s.bookmarks).toEqual([]);
  });

  it('keeps valid array items and drops invalid ones', () => {
    const out = validateSlice('projects', [project, { ...project, id: 'p2', maturity: 9 }, 'junk', null]);
    expect(out.map((p) => p.id)).toEqual(['p1']);
  });

  it('filters invalid entries from record slices', () => {
    expect(validateSlice('docStatus', { a: 'done', b: 'hacked', c: 5 })).toEqual({ a: 'done' });
  });

  it('works when storage is unavailable or throws', () => {
    expect(loadState(null)).toEqual(defaultState());
    const throwing = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('quota'); }, removeItem: () => undefined };
    expect(loadState(throwing).theme).toBe('system');
    expect(saveSlice('mission', 'x', throwing)).toBe(false);
  });
});

describe('import / export', () => {
  it('round-trips an export', () => {
    const s = { ...defaultState(), mission: 'm', projects: [project as never], docStatus: { a: 'done' as const } };
    const r = importState(exportState(s));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.state).toEqual(s);
  });
  it('accepts a bare state object and fills missing newer slices', () => {
    const r = importState(JSON.stringify({ version: 1, mission: 'old' }));
    expect(r.ok && r.state.mission).toBe('old');
  });
  it.each([
    ['not json', 'nope{'],
    ['null', 'null'],
    ['wrong version', JSON.stringify({ ...defaultState(), version: 2 })],
    ['bad enum', JSON.stringify({ ...defaultState(), theme: 'neon' })],
    ['bad nested record', JSON.stringify({ ...defaultState(), projects: [{ ...project, maturity: 7 }] })],
    ['wrong type', JSON.stringify({ ...defaultState(), bookmarks: 'a,b' })],
    ['oversized string', JSON.stringify({ ...defaultState(), mission: 'x'.repeat(5000) })],
  ])('rejects %s', (_n, json) => {
    const r = importState(json);
    expect(r.ok).toBe(false);
  });
});
