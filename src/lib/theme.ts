import { useEffect, useState } from 'react';
import type { ThemePref } from '../types';
import { setSlice, useAppState } from './store';

export function applyTheme(pref: ThemePref): void {
  const root = document.documentElement;
  if (pref === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', pref);
}

function systemDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

/** Resolved theme (light|dark), reacting to system changes. */
export function useResolvedTheme(): 'light' | 'dark' {
  const pref = useAppState((s) => s.theme);
  const [sys, setSys] = useState(systemDark);
  useEffect(() => {
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const on = () => setSys(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return pref === 'system' ? (sys ? 'dark' : 'light') : pref;
}

export function toggleTheme(current: 'light' | 'dark'): void {
  setSlice('theme', current === 'dark' ? 'light' : 'dark');
}
