import * as d3 from 'd3';

export function renderLine(el: HTMLElement, cfg: { data?: { x: number; y: number }[]; width?: number; height?: number }) {
  const data = cfg.data ?? d3.range(0, 100).map(x => ({ x, y: Math.sin(x / 10) }));
  const width = cfg.width ?? 640;
  const height = cfg.height ?? 360;
  el.innerHTML = '';
  const svg = d3.select(el).append('svg').attr('width', width).attr('height', height);
  const x = d3.scaleLinear().domain(d3.extent(data, d => d.x) as [number, number]).range([40, width - 10]);
  const y = d3.scaleLinear().domain(d3.extent(data, d => d.y) as [number, number]).nice().range([height - 30, 10]);
  svg.append('g').attr('transform', `translate(0,${height - 30})`).call(d3.axisBottom(x) as any);
  svg.append('g').attr('transform', `translate(40,0)`).call(d3.axisLeft(y) as any);
  const line = d3.line<{ x: number; y: number }>().x(d => x(d.x)).y(d => y(d.y));
  svg.append('path').datum(data).attr('fill', 'none').attr('stroke', '#ef4444').attr('stroke-width', 2).attr('d', line as any);
}


