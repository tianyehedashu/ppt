import * as d3 from 'd3';
import type { ArchSpec } from '../index';

type Node = { id: string; label?: string; x?: number; y?: number };
type Edge = { source: string; target: string };

export function renderArchitecture(el: HTMLElement, spec: ArchSpec) {
  const width = (spec as any).width ?? 960;
  const height = (spec as any).height ?? 540;
  el.innerHTML = '';
  const svg = d3.select(el).append('svg').attr('width', width).attr('height', height);

  // zoom & pan
  const root = svg.append('g');
  svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 2]).on('zoom', (e) => {
    root.attr('transform', e.transform.toString());
  }));

  const nodes: Node[] = spec.nodes.map(n => ({ id: n.id, label: n.label ?? n.id, x: n.x, y: n.y }));
  const edges: Edge[] = spec.edges.map(e => ({ source: e.source, target: e.target }));

  // simple DAG-like manual layout (fallback): place nodes in rows by id hash
  const rankdir = spec.layout?.rankdir ?? 'LR';
  const nodeGap = spec.layout?.nodeGap ?? 140;
  const levelGap = spec.layout?.levelGap ?? 120;

  if (!nodes.every(n => typeof n.x === 'number' && typeof n.y === 'number')) {
    const levels = new Map<string, number>();
    // naive topological depth by counting incoming edges
    const incoming = new Map(nodes.map(n => [n.id, 0]));
    edges.forEach(e => incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1));
    const queue = nodes.filter(n => (incoming.get(n.id) ?? 0) === 0);
    queue.forEach(n => levels.set(n.id, 0));
    for (const e of edges) {
      const s = levels.get(e.source) ?? 0;
      const t = Math.max(s + 1, levels.get(e.target) ?? 0);
      levels.set(e.target, t);
    }
    const byLevel = new Map<number, Node[]>();
    nodes.forEach(n => {
      const lv = levels.get(n.id) ?? 0;
      const arr = byLevel.get(lv) ?? [];
      arr.push(n); byLevel.set(lv, arr);
    });
    const maxPerRow = Math.max(...Array.from(byLevel.values()).map(a => a.length));
    byLevel.forEach((arr, lv) => {
      arr.forEach((n, i) => {
        if (rankdir === 'LR') {
          n.x = 80 + lv * levelGap;
          n.y = 80 + i * nodeGap - (nodeGap * (arr.length - 1)) / 2 + height / 2 - (nodeGap * maxPerRow) / 2;
        } else { // TB
          n.x = 80 + i * nodeGap - (nodeGap * (arr.length - 1)) / 2 + width / 2 - (nodeGap * maxPerRow) / 2;
          n.y = 80 + lv * levelGap;
        }
      });
    });
  }

  // edges (straight)
  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const links = root.append('g').attr('fill', 'none').attr('stroke', '#94a3b8').attr('stroke-width', 1.5);
  links.selectAll('path')
    .data(edges)
    .join('path')
    .attr('d', e => {
      const s = nodeById.get(e.source)!; const t = nodeById.get(e.target)!;
      return `M ${s.x},${s.y} L ${t.x},${t.y}`;
    });

  // nodes
  const gNodes = root.append('g').selectAll('g.node').data(nodes).join('g').attr('class', 'node').attr('transform', d => `translate(${d.x},${d.y})`);
  gNodes.append('rect')
    .attr('x', -50).attr('y', -20).attr('rx', 6).attr('ry', 6)
    .attr('width', 100).attr('height', 40)
    .attr('fill', '#0ea5e9').attr('fill-opacity', 0.1).attr('stroke', '#0284c7');
  gNodes.append('text')
    .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
    .attr('font-family', 'ui-sans-serif, system-ui, sans-serif').attr('font-size', 12)
    .text(d => d.label ?? d.id);

  if ((spec.interactions?.drag ?? true) !== false) {
    gNodes.call(d3.drag<SVGGElement, Node>().on('drag', (ev, d) => {
      d.x = ev.x; d.y = ev.y;
      d3.select(ev.sourceEvent.target.closest('g.node')).attr('transform', `translate(${d.x},${d.y})`);
      links.selectAll('path').attr('d', e => {
        const s = nodeById.get((e as any).source)!; const t = nodeById.get((e as any).target)!;
        return `M ${s.x},${s.y} L ${t.x},${t.y}`;
      });
    }));
  }
}


