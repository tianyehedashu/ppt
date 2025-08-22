import type { Selection } from 'd3-selection';

export type ArchSpec = {
  layout?: { type?: 'dag' | 'force' | 'grid' | 'manual'; rankdir?: 'LR' | 'TB'; nodeGap?: number; levelGap?: number };
  nodes: { id: string; label?: string; type?: string; group?: string; x?: number; y?: number }[];
  edges: { source: string; target: string; label?: string; directed?: boolean; style?: 'straight' | 'orthogonal' | 'curved' }[];
  groups?: { id: string; label?: string; nodes: string[]; collapsed?: boolean }[];
  interactions?: { zoom?: boolean; drag?: boolean; collapse?: boolean; highlightPathOnHover?: boolean };
};

export function renderD3Blocks(root: Document | HTMLElement) {
  const scope = root instanceof Document ? root : (root.ownerDocument ?? document);
  const nodes = Array.from(scope.querySelectorAll('[data-d3]')) as HTMLElement[];
  for (const el of nodes) {
    const type = el.getAttribute('data-d3');
    const cfgRaw = el.getAttribute('data-config');
    let config: any = {};
    if (cfgRaw) {
      try { config = JSON.parse(cfgRaw); } catch { /* ignore */ }
    }
    if (type === 'bar') {
      import('./charts/bar').then(m => m.renderBar(el, config));
    } else if (type === 'line') {
      import('./charts/line').then(m => m.renderLine(el, config));
    } else if (type === 'arch') {
      import('./charts/architecture').then(m => m.renderArchitecture(el, config as ArchSpec));
    }
  }

  // code block variant for d3-arch
  const codeBlocks = Array.from(scope.querySelectorAll('code.language-d3-arch')) as HTMLElement[];
  for (const code of codeBlocks) {
    try {
      const json = JSON.parse(code.textContent || '{}') as ArchSpec;
      const container = document.createElement('div');
      container.setAttribute('data-d3', 'arch');
      code.parentElement?.replaceWith(container);
      import('./charts/architecture').then(m => m.renderArchitecture(container, json));
    } catch {}
  }
}


