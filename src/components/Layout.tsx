import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { NAV } from '../lib/nav';
import { toggleTheme, useResolvedTheme } from '../lib/theme';
import { Icon } from './Icon';
import { useFocusTrap } from './ui';
import { CommandPalette } from './CommandPalette';
import { usePersistError } from '../lib/store';

function NavTree({ onNavigate }: { onNavigate?: () => void }) {
  const loc = useLocation();
  const current = loc.pathname + loc.search;
  return (
    <nav aria-label="Primary">
      {NAV.map((g, i) => (
        <div className="nav-group" key={g.title ?? i}>
          {g.title && <div className="nav-group-title">{g.title}</div>}
          {g.items.map((it) => {
            const active = it.to.includes('?') ? current === it.to : loc.pathname === it.to && !(loc.search && it.to === '/knowledge');
            return (
              <NavLink key={it.label} to={it.to} className="nav-link" aria-current={active ? 'page' : undefined} onClick={onNavigate} end>
                <Icon name={it.icon} />
                {it.label}
              </NavLink>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Engineering OS home">
      <span className="brand-mark" aria-hidden="true">EO</span>
      Engineering OS
    </Link>
  );
}

function Drawer({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, onClose);
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className="drawer" role="dialog" aria-modal="true" aria-label="Navigation">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Brand />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close navigation" data-autofocus>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <NavTree onNavigate={onClose} />
      </div>
    </>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const theme = useResolvedTheme();
  const persistError = usePersistError();
  const loc = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPalette((p) => !p);
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setPalette(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // On route change (not first load): reset scroll and move focus to the new page's h1 (or <main>)
  // so screen-reader and keyboard users land on the new content instead of the stale nav link.
  const firstRender = useRef(true);
  useEffect(() => {
    try { window.scrollTo(0, 0); } catch { /* jsdom */ }
    if (firstRender.current) { firstRender.current = false; return; }
    let tries = 0;
    let raf = 0;
    const focusTarget = () => {
      const main = mainRef.current;
      if (!main) return;
      const h1 = main.querySelector<HTMLElement>('h1');
      // Pages are lazy-loaded: wait a few frames for the h1 to appear before falling back to <main>.
      if (!h1 && tries++ < 10) { raf = requestAnimationFrame(focusTarget); return; }
      const target = h1 ?? main;
      if (target !== main) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    };
    raf = requestAnimationFrame(focusTarget);
    return () => cancelAnimationFrame(raf);
  }, [loc.pathname]);

  const themeBtn = (
    <button type="button" className="icon-btn" onClick={() => toggleTheme(theme)} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );

  return (
    <div className="shell">
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Skip to content
      </a>
      <aside className="sidebar">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <Brand />
          {themeBtn}
        </div>
        <button type="button" className="search-trigger" onClick={() => setPalette(true)}>
          <Search size={14} aria-hidden="true" /> Search… <kbd>Ctrl K</kbd>
        </button>
        <NavTree />
      </aside>
      <div className="main">
        <header className="topbar">
          <button type="button" className="icon-btn" aria-label="Open navigation" aria-expanded={drawer} onClick={() => setDrawer(true)}>
            <Menu size={18} aria-hidden="true" />
          </button>
          <Brand />
          <span className="spacer" />
          <button type="button" className="icon-btn" aria-label="Search" onClick={() => setPalette(true)}>
            <Search size={16} aria-hidden="true" />
          </button>
          {themeBtn}
        </header>
        <main id="main" ref={mainRef} tabIndex={-1} className="page">
          {persistError && (
            <div role="alert" className="persist-error">
              Your changes could not be saved in this browser ({persistError}). Export a backup from{' '}
              <Link to="/settings">Settings</Link> and free up storage.
            </div>
          )}
          {children}
        </main>
      </div>
      {drawer && <Drawer onClose={() => setDrawer(false)} />}
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
    </div>
  );
}
