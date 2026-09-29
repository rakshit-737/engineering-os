import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search } from 'lucide-react';
import { ALL_NAV } from '../lib/nav';
import { loadSearch } from '../lib/content';
import { createSearch, type DocSearch } from '../lib/search';
import { domainInfo } from '../lib/domains';
import { toggleTheme, useResolvedTheme } from '../lib/theme';
import type { SearchEntry } from '../types';
import { Icon } from './Icon';
import { useFocusTrap } from './ui';

interface Item {
  id: string;
  group: 'Documents' | 'Navigation' | 'Actions';
  label: string;
  sub?: string;
  icon?: string;
  run: () => void;
}

let searchPromise: Promise<DocSearch> | null = null;
function getSearch(loader: () => Promise<SearchEntry[]>): Promise<DocSearch> {
  searchPromise ??= loader().then(createSearch);
  searchPromise.catch(() => (searchPromise = null));
  return searchPromise;
}
export function __resetPaletteSearch() {
  searchPromise = null;
}

export function CommandPalette({ onClose, loader = loadSearch }: { onClose: () => void; loader?: () => Promise<SearchEntry[]> }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [engine, setEngine] = useState<DocSearch | null>(null);
  const [loadError, setLoadError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const theme = useResolvedTheme();
  useFocusTrap(ref, onClose);

  useEffect(() => {
    let alive = true;
    getSearch(loader).then(
      (s) => alive && setEngine(s),
      () => alive && setLoadError(true),
    );
    return () => {
      alive = false;
    };
  }, [loader]);

  const items = useMemo<Item[]>(() => {
    const query = q.trim().toLowerCase();
    const go = (to: string) => () => {
      onClose();
      navigate(to);
    };
    const nav: Item[] = ALL_NAV.filter(
      (n) => !query || n.label.toLowerCase().includes(query) || (n.keywords ?? '').includes(query),
    ).map((n) => ({ id: `nav:${n.to}`, group: 'Navigation', label: n.label, icon: n.icon, run: go(n.to) }));
    const actions: Item[] = [
      { id: 'act:theme', group: 'Actions' as const, label: 'Toggle theme', icon: 'Moon', run: () => { toggleTheme(theme); onClose(); } },
    ].filter((a) => !query || a.label.toLowerCase().includes(query) || 'dark light theme'.includes(query));
    const docs: Item[] = query && engine
      ? engine.search(query, {}, 12).map((h) => ({
          id: `doc:${h.slug}`, group: 'Documents' as const, label: h.title, sub: domainInfo(h.domain).label,
          run: go(`/doc/${encodeURIComponent(h.slug)}`),
        }))
      : [];
    return [...docs, ...nav.slice(0, query ? 8 : 30), ...actions];
  }, [q, engine, navigate, onClose, theme]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (items.length ? (a + 1) % items.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(Math.max(0, items.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[active]?.run();
    }
  };

  let lastGroup = '';
  return (
    <div className="overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-input">
          <Search size={16} aria-hidden="true" />
          <input
            data-autofocus
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-autocomplete="list"
            aria-activedescendant={items[active] ? `pi-${active}` : undefined}
            aria-label="Search docs and commands"
            placeholder="Search docs, jump to a page…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="palette-list" ref={listRef} className="palette-list" role="listbox" aria-label="Results">
          {items.map((it, i) => {
            const header = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            return (
              <li key={it.id} role="presentation">
                {header && <div className="palette-group" role="presentation">{header}</div>}
                <div
                  id={`pi-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className="palette-item"
                  tabIndex={-1}
                  onMouseMove={() => setActive(i)}
                  onClick={it.run}
                  onKeyDown={() => undefined}
                >
                  {it.icon ? <Icon name={it.icon} /> : <FileText size={16} aria-hidden="true" />}
                  <span>{it.label}</span>
                  {it.sub && <span className="sub">{it.sub}</span>}
                </div>
              </li>
            );
          })}
          {!items.length && (
            <li className="palette-group" role="presentation">
              {q && !engine && !loadError ? 'Loading search index…' : 'No results. Try a shorter or different term.'}
            </li>
          )}
          {loadError && <li className="palette-group" role="presentation">Search index failed to load — navigation still works.</li>}
        </ul>
        <div className="palette-foot" aria-hidden="true">
          <span><kbd>↑</kbd> <kbd>↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
