import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Maximize2, Minus, Plus } from 'lucide-react';
import { loadGraph, useAsync } from '../lib/content';
import { runLayout } from '../lib/graphLayout';
import { DOMAINS, domainInfo } from '../lib/domains';
import { EmptyState, ErrorState, Loading, PageHeader } from '../components/ui';
import type { GraphData } from '../types';

interface View { x: number; y: number; k: number }

function GraphView({ data }: { data: GraphData }) {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('');
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState<string | null>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const drag = useRef<{ px: number; py: number; moved: boolean } | null>(null);
  // Active pointers, for two-finger pinch zoom on touch screens.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, edges } = useMemo(() => {
    const ns = domain ? data.nodes.filter((n) => n.domain === domain) : data.nodes;
    const ids = new Set(ns.map((n) => n.id));
    return { nodes: ns, edges: data.edges.filter((e) => ids.has(e.source) && ids.has(e.target)) };
  }, [data, domain]);

  const layout = useMemo(() => {
    const pos = runLayout(nodes.map((n) => n.id), edges, nodes.length > 250 ? 180 : 260);
    return new Map(pos.map((p) => [p.id, p]));
  }, [nodes, edges]);

  const degree = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of edges) {
      m.set(e.source, (m.get(e.source) ?? 0) + 1);
      m.set(e.target, (m.get(e.target) ?? 0) + 1);
    }
    return m;
  }, [edges]);

  const bounds = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const p of layout.values()) {
      minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
    }
    if (!isFinite(minX)) return { x: -100, y: -100, w: 200, h: 200 };
    const pad = 40;
    return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
  }, [layout]);

  const neighbours = useMemo(() => {
    if (!focus) return null;
    const s = new Set([focus]);
    for (const e of edges) {
      if (e.source === focus) s.add(e.target);
      if (e.target === focus) s.add(e.source);
    }
    return s;
  }, [focus, edges]);

  const matches = q.trim() ? nodes.filter((n) => n.title.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8) : [];

  const centerOn = (id: string) => {
    const p = layout.get(id);
    if (!p) return;
    setFocus(id);
    const k = 2.5;
    setView({ k, x: -(p.x - (bounds.x + bounds.w / 2)) * k, y: -(p.y - (bounds.y + bounds.h / 2)) * k });
  };

  const zoom = (f: number) => setView((v) => ({ ...v, k: Math.min(8, Math.max(0.3, v.k * f)) }));
  // React's onWheel is passive, so the page would scroll while zooming. Attach a non-passive listener.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v) => ({ ...v, k: Math.min(8, Math.max(0.3, v.k * (e.deltaY < 0 ? 1.15 : 1 / 1.15))) }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const endPointer = (id: number) => {
    pointers.current.delete(id);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) setTimeout(() => (drag.current = null), 0);
  };

  const scale = svgRef.current ? bounds.w / Math.max(1, svgRef.current.clientWidth) : 1;

  const cx = bounds.x + bounds.w / 2, cy = bounds.y + bounds.h / 2;
  const transform = `translate(${cx + view.x} ${cy + view.y}) scale(${view.k}) translate(${-cx} ${-cy})`;
  // Tabbing through hundreds of nodes is a trap; only expose all nodes to Tab for small graphs.
  const keyboardNodes = nodes.length <= 120;
  const showLabels = view.k > 1.6 || nodes.length < 60;

  return (
    <>
      <div className="filters">
        <select className="select" aria-label="Filter by domain" value={domain} onChange={(e) => { setDomain(e.target.value); setFocus(null); setView({ x: 0, y: 0, k: 1 }); }}>
          <option value="">All domains</option>
          {DOMAINS.filter((d) => data.nodes.some((n) => n.domain === d.id)).map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <div style={{ position: 'relative' }}>
          <input className="input" type="search" placeholder="Find a note to focus…" aria-label="Find a note in the graph" value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && matches[0]) { centerOn(matches[0].id); setQ(''); } }} />
          {matches.length > 0 && (
            <ul className="doc-list" style={{ position: 'absolute', zIndex: 5, width: 'min(300px, calc(100vw - 32px))', background: 'var(--bg)', boxShadow: 'var(--shadow)' }}>
              {matches.map((m) => (
                <li key={m.id}><button type="button" className="doc-row btn-ghost" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => { centerOn(m.id); setQ(''); }}>{m.title}</button></li>
              ))}
            </ul>
          )}
        </div>
        {focus && <button type="button" className="btn btn-ghost" onClick={() => setFocus(null)}>Clear focus</button>}
        <span className="subtle" style={{ alignSelf: 'center' }}>{nodes.length} notes · {edges.length} links</span>
      </div>
      <div className="graph-wrap">
        <svg
          ref={svgRef}
          viewBox={`${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`}
          role="group"
          aria-label={`Knowledge graph with ${nodes.length} notes. ${keyboardNodes ? 'Tab to a node and press Enter to open it.' : 'Filter by domain or find a note to make nodes keyboard-focusable, or use the list below.'}`}
          onPointerDown={(e) => {
            pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.current.size === 1) drag.current = { px: e.clientX, py: e.clientY, moved: false };
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.current.size >= 2) {
              const [a, b] = [...pointers.current.values()] as [{ x: number; y: number }, { x: number; y: number }];
              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              if (pinch.current) { const f = dist / pinch.current; setView((v) => ({ ...v, k: Math.min(8, Math.max(0.3, v.k * f)) })); }
              pinch.current = dist;
              if (drag.current) drag.current.moved = true;
              return;
            }
            const d = drag.current;
            if (!d) return;
            const dx = e.clientX - d.px, dy = e.clientY - d.py;
            if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true;
            d.px = e.clientX; d.py = e.clientY;
            setView((v) => ({ ...v, x: v.x + dx * scale, y: v.y + dy * scale }));
          }}
          onPointerUp={(e) => endPointer(e.pointerId)}
          onPointerCancel={(e) => endPointer(e.pointerId)}
        >
          <g transform={transform}>
            {edges.map((e) => {
              const a = layout.get(e.source), b = layout.get(e.target);
              if (!a || !b) return null;
              const hl = !!focus && (e.source === focus || e.target === focus);
              return <line key={`${e.source}|${e.target}`} className={`graph-edge${hl ? ' hl' : ''}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />;
            })}
            {nodes.map((n) => {
              const p = layout.get(n.id);
              if (!p) return null;
              const r = 3 + Math.min(6, Math.sqrt(degree.get(n.id) ?? 0));
              const dim = neighbours && !neighbours.has(n.id);
              return (
                 
                <g key={n.id} className={`graph-node${dim ? ' dim' : ''}`} transform={`translate(${p.x} ${p.y})`}
                  role="link" aria-label={n.title}
                  tabIndex={keyboardNodes || (neighbours?.has(n.id) ?? false) ? 0 : undefined}
                  onFocus={() => setFocus(n.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/doc/${encodeURIComponent(n.id)}`); }}
                  onClick={() => { if (!drag.current?.moved) navigate(`/doc/${encodeURIComponent(n.id)}`); }}>
                  <title>{n.title}</title>
                  <circle r={r} fill={domainInfo(n.domain).color} />
                  {(showLabels || focus === n.id || (neighbours?.has(n.id) ?? false)) && <text x={r + 2} y={3}>{n.title}</text>}
                </g>
              );
            })}
          </g>
        </svg>
        <div className="graph-controls">
          <button type="button" className="icon-btn" aria-label="Zoom in" onClick={() => zoom(1.3)}><Plus size={14} aria-hidden="true" /></button>
          <button type="button" className="icon-btn" aria-label="Zoom out" onClick={() => zoom(1 / 1.3)}><Minus size={14} aria-hidden="true" /></button>
          <button type="button" className="icon-btn" aria-label="Reset view" onClick={() => { setView({ x: 0, y: 0, k: 1 }); setFocus(null); }}><Maximize2 size={14} aria-hidden="true" /></button>
        </div>
      </div>
      <div className="legend" aria-hidden="true">
        {DOMAINS.filter((d) => nodes.some((n) => n.domain === d.id)).map((d) => (
          <span key={d.id} className="chip"><span className="chip-dot" style={{ background: d.color }} />{d.label}</span>
        ))}
      </div>
      <details className="section">
        <summary>Accessible list view ({nodes.length} notes)</summary>
        <ul style={{ columns: '260px', marginTop: 12 }}>
          {[...nodes].sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0)).map((n) => (
            <li key={n.id}><Link to={`/doc/${encodeURIComponent(n.id)}`}>{n.title}</Link> <span className="subtle">{degree.get(n.id) ?? 0} links</span></li>
          ))}
        </ul>
      </details>
    </>
  );
}

export default function Graph() {
  const g = useAsync(loadGraph, []);
  return (
    <>
      <PageHeader title="Knowledge graph" description="Notes connected by prerequisites, related links and wikilinks. Scroll or pinch to zoom, drag to pan, click or tap a node to open it. A keyboard-friendly list is below the graph." />
      {g.error ? <ErrorState error={g.error} onRetry={g.retry} /> : !g.data ? <Loading /> : g.data.nodes.length ? <GraphView data={g.data} /> : <EmptyState title="Graph is empty">No notes have been ingested yet.</EmptyState>}
    </>
  );
}
