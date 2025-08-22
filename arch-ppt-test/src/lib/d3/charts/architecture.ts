import * as d3 from 'd3';
import type { ArchSpec } from '../index';

interface ArchNode {
  id: string;
  label: string;
  type?: string;
  group?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface ArchEdge {
  source: string;
  target: string;
  label?: string;
  directed?: boolean;
  style?: 'straight' | 'orthogonal' | 'curved';
}

interface LayoutResult {
  nodes: ArchNode[];
  edges: ArchEdge[];
  cycleDetected: boolean;
}

/**
 * 改进的拓扑排序，支持循环检测
 */
function topologicalLayout(nodes: ArchNode[], edges: ArchEdge[], options: {
  rankdir: 'LR' | 'TB';
  nodeGap: number;
  levelGap: number;
  width: number;
  height: number;
}): LayoutResult {
  const { rankdir, nodeGap, levelGap, width, height } = options;
  
  // 验证输入
  if (nodes.length === 0) {
    return { nodes: [], edges, cycleDetected: false };
  }

  // 构建邻接表和入度统计
  const adjList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  nodes.forEach(n => {
    adjList.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  edges.forEach(e => {
    if (!adjList.has(e.source) || !adjList.has(e.target)) {
      console.warn(`Edge references unknown node: ${e.source} -> ${e.target}`);
      return;
    }
    adjList.get(e.source)!.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  });

  // Kahn's 算法进行拓扑排序
  const queue: string[] = [];
  const levels = new Map<string, number>();
  let processed = 0;

  // 找到所有入度为 0 的节点
  nodes.forEach(n => {
    if ((inDegree.get(n.id) ?? 0) === 0) {
      queue.push(n.id);
      levels.set(n.id, 0);
    }
  });

  // 如果没有入度为 0 的节点，说明有循环
  if (queue.length === 0 && nodes.length > 0) {
    // 回退到简单网格布局
    return gridFallbackLayout(nodes, edges, options);
  }

  // 处理队列
  while (queue.length > 0) {
    const current = queue.shift()!;
    processed++;
    const currentLevel = levels.get(current) ?? 0;

    // 处理邻接节点
    const neighbors = adjList.get(current) ?? [];
    neighbors.forEach(neighbor => {
      const newInDegree = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newInDegree);
      levels.set(neighbor, Math.max(levels.get(neighbor) ?? 0, currentLevel + 1));
      
      if (newInDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // 检测循环
  const cycleDetected = processed < nodes.length;
  if (cycleDetected) {
    console.warn('Cycle detected in graph, using fallback layout');
    return gridFallbackLayout(nodes, edges, options);
  }

  // 按层级分组节点
  const byLevel = new Map<number, ArchNode[]>();
  const maxLevel = Math.max(...Array.from(levels.values()));
  
  nodes.forEach(n => {
    const level = levels.get(n.id) ?? 0;
    const arr = byLevel.get(level) ?? [];
    arr.push({ ...n });
    byLevel.set(level, arr);
  });

  // 计算位置
  const padding = 80;
  const availableWidth = width - 2 * padding;
  const availableHeight = height - 2 * padding;
  
  byLevel.forEach((levelNodes, level) => {
    const nodesInLevel = levelNodes.length;
    if (nodesInLevel === 0) return;

    levelNodes.forEach((node, index) => {
      if (rankdir === 'LR') {
        // 水平布局
        const x = padding + (level / Math.max(maxLevel, 1)) * availableWidth;
        const y = padding + (index / Math.max(nodesInLevel - 1, 1)) * availableHeight;
        node.x = x;
        node.y = nodesInLevel === 1 ? height / 2 : y;
      } else {
        // 垂直布局  
        const x = padding + (index / Math.max(nodesInLevel - 1, 1)) * availableWidth;
        const y = padding + (level / Math.max(maxLevel, 1)) * availableHeight;
        node.x = nodesInLevel === 1 ? width / 2 : x;
        node.y = y;
      }
    });
  });

  const layoutNodes = Array.from(byLevel.values()).flat();
  return { nodes: layoutNodes, edges, cycleDetected: false };
}

/**
 * 网格回退布局（处理循环或复杂图）
 */
function gridFallbackLayout(nodes: ArchNode[], edges: ArchEdge[], options: {
  width: number;
  height: number;
}): LayoutResult {
  const { width, height } = options;
  const padding = 80;
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const rows = Math.ceil(nodes.length / cols);
  
  nodes.forEach((node, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    node.x = padding + (col / Math.max(cols - 1, 1)) * (width - 2 * padding);
    node.y = padding + (row / Math.max(rows - 1, 1)) * (height - 2 * padding);
  });

  return { nodes, edges, cycleDetected: true };
}

/**
 * 获取节点样式配置
 */
function getNodeStyle(node: ArchNode, theme: 'light' | 'dark' = 'dark') {
  const typeStyles = {
    gateway: { fill: '#fbbf24', stroke: '#f59e0b' },
    service: { fill: '#60a5fa', stroke: '#3b82f6' },
    database: { fill: '#34d399', stroke: '#10b981' },
    queue: { fill: '#f472b6', stroke: '#ec4899' },
    default: { fill: '#94a3b8', stroke: '#64748b' }
  };

  const style = typeStyles[node.type as keyof typeof typeStyles] || typeStyles.default;
  
  return {
    fill: style.fill,
    fillOpacity: theme === 'dark' ? 0.2 : 0.1,
    stroke: style.stroke,
    strokeWidth: 2
  };
}

/**
 * 创建边路径
 */
function createEdgePath(source: ArchNode, target: ArchNode, style: 'straight' | 'orthogonal' | 'curved' = 'straight'): string {
  const sx = source.x ?? 0;
  const sy = source.y ?? 0;
  const tx = target.x ?? 0;
  const ty = target.y ?? 0;

  switch (style) {
    case 'orthogonal':
      const mx = (sx + tx) / 2;
      return `M ${sx},${sy} L ${mx},${sy} L ${mx},${ty} L ${tx},${ty}`;
    
    case 'curved':
      const dx = tx - sx;
      const dy = ty - sy;
      const cpx1 = sx + dx * 0.3;
      const cpy1 = sy;
      const cpx2 = sx + dx * 0.7;
      const cpy2 = ty;
      return `M ${sx},${sy} C ${cpx1},${cpy1} ${cpx2},${cpy2} ${tx},${ty}`;
    
    default: // straight
      return `M ${sx},${sy} L ${tx},${ty}`;
  }
}

/**
 * 主渲染函数
 */
export function renderArchitecture(el: HTMLElement, spec: ArchSpec): void {
  try {
    // 参数验证
    if (!spec.nodes || spec.nodes.length === 0) {
      el.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b;">No nodes to display</div>';
      return;
    }

    const width = (spec as any).width ?? 960;
    const height = (spec as any).height ?? 540;
    const rankdir = spec.layout?.rankdir ?? 'LR';
    const nodeGap = spec.layout?.nodeGap ?? 140;
    const levelGap = spec.layout?.levelGap ?? 120;

    // 清空容器
    el.innerHTML = '';
    
    // 创建 SVG
    const svg = d3.select(el)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('background', 'transparent');

    // 添加缩放容器
    const container = svg.append('g').attr('class', 'zoom-container');
    
    // 配置缩放行为
    if (spec.interactions?.zoom !== false) {
      const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 3])
        .on('zoom', (event) => {
          container.attr('transform', event.transform.toString());
        });
      
      svg.call(zoomBehavior);
    }

    // 准备节点和边数据
    const inputNodes: ArchNode[] = spec.nodes.map(n => ({
      id: n.id,
      label: n.label ?? n.id,
      type: n.type,
      group: n.group,
      x: n.x,
      y: n.y,
      width: 100,
      height: 40
    }));

    const inputEdges: ArchEdge[] = spec.edges.map(e => ({
      source: e.source,
      target: e.target,
      label: e.label,
      directed: e.directed !== false,
      style: e.style ?? 'straight'
    }));

    // 执行布局算法
    const layoutResult = topologicalLayout(inputNodes, inputEdges, {
      rankdir,
      nodeGap,
      levelGap,
      width,
      height
    });

    // 显示警告（如果有循环）
    if (layoutResult.cycleDetected) {
      console.warn('Cycle detected in graph, using grid layout');
    }

    const { nodes, edges } = layoutResult;
    const nodeById = new Map(nodes.map(n => [n.id, n]));

    // 渲染边
    const linksGroup = container.append('g').attr('class', 'edges');
    const links = linksGroup.selectAll('g.edge')
      .data(edges)
      .join('g')
      .attr('class', 'edge');

    links.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#64748b')
      .attr('stroke-width', 2)
      .attr('marker-end', d => d.directed ? 'url(#arrowhead)' : '')
      .attr('d', d => {
        const source = nodeById.get(d.source);
        const target = nodeById.get(d.target);
        if (!source || !target) return '';
        return createEdgePath(source, target, d.style);
      });

    // 添加箭头标记
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#64748b');

    // 渲染节点
    const nodesGroup = container.append('g').attr('class', 'nodes');
    const nodeElements = nodesGroup.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);

    // 节点矩形
    nodeElements.append('rect')
      .attr('x', d => -(d.width ?? 100) / 2)
      .attr('y', d => -(d.height ?? 40) / 2)
      .attr('width', d => d.width ?? 100)
      .attr('height', d => d.height ?? 40)
      .attr('rx', 6)
      .attr('ry', 6)
      .each(function(d) {
        const style = getNodeStyle(d);
        d3.select(this)
          .attr('fill', style.fill)
          .attr('fill-opacity', style.fillOpacity)
          .attr('stroke', style.stroke)
          .attr('stroke-width', style.strokeWidth);
      });

    // 节点文本
    nodeElements.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'ui-sans-serif, system-ui, sans-serif')
      .attr('font-size', 12)
      .attr('fill', '#1f2937')
      .text(d => d.label);

    // 添加拖拽行为
    if (spec.interactions?.drag !== false) {
      const dragBehavior = d3.drag<SVGGElement, ArchNode>()
        .on('start', function(event, d) {
          d3.select(this).raise();
        })
        .on('drag', function(event, d) {
          d.x = event.x;
          d.y = event.y;
          d3.select(this).attr('transform', `translate(${d.x},${d.y})`);
          
          // 更新连接的边
          links.selectAll('path').attr('d', function(e) {
            const source = nodeById.get(e.source);
            const target = nodeById.get(e.target);
            if (!source || !target) return d3.select(this).attr('d');
            return createEdgePath(source, target, e.style);
          });
        });

      nodeElements.call(dragBehavior);
    }

    // 添加悬停效果
    if (spec.interactions?.highlightPathOnHover !== false) {
      nodeElements
        .on('mouseenter', function(event, d) {
          // 高亮相关边
          links.selectAll('path')
            .attr('opacity', e => 
              e.source === d.id || e.target === d.id ? 1 : 0.3);
        })
        .on('mouseleave', function() {
          // 恢复所有边
          links.selectAll('path').attr('opacity', 1);
        });
    }

  } catch (error) {
    console.error('Error rendering architecture diagram:', error);
    el.innerHTML = `<div style="padding: 20px; text-align: center; color: #ef4444;">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
  }
}