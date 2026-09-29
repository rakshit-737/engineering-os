import { useSyncExternalStore } from 'react';
import type { Activity, AppState } from '../types';
import { clearState, defaultState, loadState, saveSlice, SLICE_KEYS, STORAGE_PREFIX, type SliceKey } from './storage';

let state: AppState = loadState();
const listeners = new Set<() => void>();
/** Set when localStorage rejects a write (quota exceeded, private mode, blocked). */
let persistError: string | null = null;

function persist<K extends SliceKey>(key: K, value: AppState[K]): void {
  const ok = saveSlice(key, value);
  persistError = ok ? null : `Could not save "${key}" — browser storage is full or unavailable. Export your data now.`;
}

export function getPersistError(): string | null {
  return persistError;
}

function emit() {
  for (const l of listeners) l();
}

export function getState(): AppState {
  return state;
}

export function setSlice<K extends SliceKey>(key: K, updater: AppState[K] | ((prev: AppState[K]) => AppState[K])): void {
  const prev = state[key];
  const next = typeof updater === 'function' ? (updater as (p: AppState[K]) => AppState[K])(prev) : updater;
  if (next === prev) return;
  state = { ...state, [key]: next };
  persist(key, next);
  emit();
}

export function logActivity(kind: string, label: string, slug?: string): void {
  const entry: Activity = { at: new Date().toISOString(), kind, label, ...(slug ? { slug } : {}) };
  setSlice('activity', (a) => [entry, ...a].slice(0, 50));
}

export function replaceState(next: AppState): void {
  state = next;
  const failed = SLICE_KEYS.filter((k) => !saveSlice(k, next[k] as never));
  persistError = failed.length ? `Could not save ${failed.join(', ')} — browser storage is full or unavailable.` : null;
  emit();
}

export function resetState(): void {
  clearState();
  state = defaultState();
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

// Keep tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(STORAGE_PREFIX)) {
      state = loadState();
      emit();
    }
  });
}

export function useAppState<T>(select: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => select(state), () => select(state));
}

/** Non-null while the latest write to localStorage failed; UI should surface it. */
export function usePersistError(): string | null {
  return useSyncExternalStore(subscribe, getPersistError, getPersistError);
}

/** For tests */
export function __resetStoreForTests(s: AppState = defaultState()): void {
  state = s;
  emit();
}
