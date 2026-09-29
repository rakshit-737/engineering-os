/** Minimal force-directed layout (repulsion + springs + centering). Pure and deterministic. */
export interface LayoutNode { id: string; x: number; y: number; vx: number; vy: number }

export function initialLayout(ids: string[], radius = 400): LayoutNode[] {
  // golden-angle spiral: deterministic, well-spread start
  return ids.map((id, i) => {
    const r = radius * Math.sqrt((i + 0.5) / Math.max(1, ids.length));
    const a = i * 2.399963;
    return { id, x: r * Math.cos(a), y: r * Math.sin(a), vx: 0, vy: 0 };
  });
}

export function stepLayout(
  nodes: LayoutNode[],
  edges: { source: string; target: string }[],
  alpha: number,
): void {
  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const n = nodes.length;
  const k = 40; // ideal edge length
  // repulsion with a simple grid cutoff to keep it roughly O(n * neighbours)
  const cell = 120;
  const grid = new Map<string, number[]>();
  nodes.forEach((p, i) => {
    const key = `${Math.floor(p.x / cell)},${Math.floor(p.y / cell)}`;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key)!.push(i);
  });
  for (let i = 0; i < n; i++) {
    const a = nodes[i]!;
    const gx = Math.floor(a.x / cell), gy = Math.floor(a.y / cell);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        for (const j of grid.get(`${gx + dx},${gy + dy}`) ?? []) {
          if (j <= i) continue;
          const b = nodes[j]!;
          let ddx = a.x - b.x, ddy = a.y - b.y;
          let d2 = ddx * ddx + ddy * ddy;
          if (d2 < 0.01) { ddx = 0.1 * (i - j); ddy = 0.1; d2 = 0.02; }
          const f = (k * k) / d2 * alpha;
          a.vx += ddx * f; a.vy += ddy * f;
          b.vx -= ddx * f; b.vy -= ddy * f;
        }
      }
  }
  for (const e of edges) {
    const ai = idx.get(e.source), bi = idx.get(e.target);
    if (ai === undefined || bi === undefined) continue;
    const a = nodes[ai]!, b = nodes[bi]!;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    const f = ((d - k) / d) * 0.05 * alpha;
    a.vx += dx * f; a.vy += dy * f;
    b.vx -= dx * f; b.vy -= dy * f;
  }
  for (const p of nodes) {
    p.vx -= p.x * 0.002 * alpha;
    p.vy -= p.y * 0.002 * alpha;
    p.vx *= 0.6; p.vy *= 0.6;
    const v = Math.hypot(p.vx, p.vy);
    if (v > 20) { p.vx *= 20 / v; p.vy *= 20 / v; }
    p.x += p.vx; p.y += p.vy;
  }
}

export function runLayout(ids: string[], edges: { source: string; target: string }[], iterations = 250): LayoutNode[] {
  const nodes = initialLayout(ids, Math.sqrt(ids.length) * 30);
  for (let i = 0; i < iterations; i++) stepLayout(nodes, edges, 1 - i / iterations);
  return nodes;
}
