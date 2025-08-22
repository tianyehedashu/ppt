import * as d3 from 'd3';

export function renderBar(el: HTMLElement, cfg: { data?: number[]; width?: number; height?: number }) {
  const data = cfg.data ?? [3, 1, 4, 1, 5, 9];
  const width = cfg.width ?? 640;
  const height = cfg.height ?? 360;
  el.innerHTML = '';
  const svg = d3.select(el).append('svg').attr('width', width).attr('height', height);
  const x = d3.scaleBand().domain(d3.range(data.length).map(String)).range([40, width - 10]).padding(0.2);
  const y = d3.scaleLinear().domain([0, d3.max(data) ?? 0]).nice().range([height - 30, 10]);
  svg.append('g').attr('transform', `translate(0,${height - 30})`).call(d3.axisBottom(x).tickFormat(d => String(Number(d) + 1)) as any);
  svg.append('g').attr('transform', `translate(40,0)`).call(d3.axisLeft(y) as any);
  svg.append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (_, i) => x(String(i))!)
    .attr('y', d => y(d))
    .attr('width', x.bandwidth())
    .attr('height', d => y(0) - y(d))
    .attr('fill', '#4f46e5');
}


