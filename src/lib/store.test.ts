import { afterEach, describe, expect, it, vi } from 'vitest';
import { __resetStoreForTests, getPersistError, getState, replaceState, setSlice } from './store';
import { defaultState } from './storage';

describe('store persistence errors', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    __resetStoreForTests();
  });

  it('keeps in-memory state but surfaces an error when localStorage rejects writes', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    setSlice('mission', 'ship');
    expect(getState().mission).toBe('ship');
    expect(getPersistError()).toMatch(/mission/);
    spy.mockRestore();
    setSlice('mission', 'ship 2');
    expect(getPersistError()).toBeNull();
  });

  it('replaceState reports every slice that failed, not just the last', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k: string) => {
      if (k.endsWith('tasks')) throw new DOMException('full', 'QuotaExceededError');
    });
    replaceState(defaultState());
    expect(getPersistError()).toMatch(/tasks/);
  });
});
