export type ArchSpec = {
  layout?: { 
    type?: 'dag' | 'force' | 'grid' | 'manual'; 
    rankdir?: 'LR' | 'TB'; 
    nodeGap?: number; 
    levelGap?: number;
  };
  nodes: { 
    id: string; 
    label?: string; 
    type?: 'gateway' | 'service' | 'database' | 'queue' | string; 
    group?: string; 
    x?: number; 
    y?: number;
    width?: number;
    height?: number;
  }[];
  edges: { 
    source: string; 
    target: string; 
    label?: string; 
    directed?: boolean; 
    style?: 'straight' | 'orthogonal' | 'curved';
  }[];
  groups?: { 
    id: string; 
    label?: string; 
    nodes: string[]; 
    collapsed?: boolean;
  }[];
  interactions?: { 
    zoom?: boolean; 
    drag?: boolean; 
    collapse?: boolean; 
    highlightPathOnHover?: boolean;
  };
  width?: number;
  height?: number;
};

export type D3ChartConfig = {
  width?: number;
  height?: number;
  data?: any;
  [key: string]: any;
};

// 错误处理装饰器
function handleErrors<T extends any[], R>(
  fn: (...args: T) => R,
  fallback: (error: Error, ...args: T) => R
) {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      console.error('D3 rendering error:', error);
      return fallback(error as Error, ...args);
    }
  };
}

// 验证 JSON 配置
function validateConfig(config: any, expectedType: 'bar' | 'line' | 'arch'): boolean {
  if (!config || typeof config !== 'object') return false;
  
  switch (expectedType) {
    case 'arch':
      return Array.isArray(config.nodes) && Array.isArray(config.edges);
    case 'bar':
    case 'line':
      return Array.isArray(config.data) || config.data === undefined;
    default:
      return true;
  }
}

// 创建错误显示
function createErrorDisplay(el: HTMLElement, message: string): void {
  el.innerHTML = `
    <div style="
      padding: 20px; 
      text-align: center; 
      color: #ef4444; 
      border: 1px dashed #ef4444; 
      border-radius: 6px; 
      background: rgba(239, 68, 68, 0.05);
    ">
      <strong>Rendering Error:</strong><br>
      ${message}
    </div>
  `;
}

// 性能优化：渲染去重
const renderedElements = new WeakSet<HTMLElement>();

export function renderD3Blocks(root: Document | HTMLElement): void {
  const scope = root instanceof Document ? root : (root.ownerDocument ?? document);
  
  // 处理 data-d3 属性的元素
  const dataD3Elements = Array.from(scope.querySelectorAll('[data-d3]')) as HTMLElement[];
  for (const el of dataD3Elements) {
    // 避免重复渲染
    if (renderedElements.has(el)) continue;
    
    const type = el.getAttribute('data-d3');
    const cfgRaw = el.getAttribute('data-config');
    
    let config: D3ChartConfig = {};
    if (cfgRaw) {
      try {
        config = JSON.parse(cfgRaw);
      } catch (error) {
        createErrorDisplay(el, `Invalid JSON config: ${cfgRaw}`);
        continue;
      }
    }

    // 验证配置
    if (!validateConfig(config, type as any)) {
      createErrorDisplay(el, `Invalid config for chart type: ${type}`);
      continue;
    }

    // 渲染对应图表
    const renderChart = handleErrors(
      async (element: HTMLElement, chartConfig: D3ChartConfig) => {
        switch (type) {
          case 'bar':
            const barModule = await import('./charts/bar');
            barModule.renderBar(element, chartConfig);
            break;
          case 'line':
            const lineModule = await import('./charts/line');
            lineModule.renderLine(element, chartConfig);
            break;
          case 'arch':
            const archModule = await import('./charts/architecture');
            archModule.renderArchitecture(element, chartConfig as ArchSpec);
            break;
          default:
            throw new Error(`Unknown chart type: ${type}`);
        }
        renderedElements.add(element);
      },
      (error: Error, element: HTMLElement) => {
        createErrorDisplay(element, error.message);
      }
    );

    renderChart(el, config);
  }

  // 处理 d3-arch 代码块
  const codeBlocks = Array.from(scope.querySelectorAll('code.language-d3-arch')) as HTMLElement[];
  for (const code of codeBlocks) {
    // 避免重复处理
    if (renderedElements.has(code)) continue;
    
    try {
      const jsonText = code.textContent || '{}';
      const json = JSON.parse(jsonText) as ArchSpec;
      
      // 验证架构图配置
      if (!validateConfig(json, 'arch')) {
        throw new Error('Invalid architecture diagram configuration');
      }
      
      // 创建容器替换代码块
      const container = document.createElement('div');
      container.setAttribute('data-d3', 'arch');
      container.style.minHeight = '400px';
      
      const parent = code.parentElement;
      if (parent) {
        parent.replaceWith(container);
        
        // 渲染架构图
        const renderArch = handleErrors(
          async (element: HTMLElement, archSpec: ArchSpec) => {
            const archModule = await import('./charts/architecture');
            archModule.renderArchitecture(element, archSpec);
            renderedElements.add(element);
          },
          (error: Error, element: HTMLElement) => {
            createErrorDisplay(element, error.message);
          }
        );
        
        renderArch(container, json);
      }
    } catch (error) {
      console.error('Failed to parse d3-arch code block:', error);
      // 保持原代码块但添加错误提示
      if (code.parentElement) {
        const errorDiv = document.createElement('div');
        createErrorDisplay(errorDiv, `Failed to parse architecture diagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
        code.parentElement.appendChild(errorDiv);
      }
    }
  }
}

// 清理函数（可选，用于性能优化）
export function clearD3RenderCache(): void {
  // 注意：WeakSet 不能直接清空，这里只是提供接口
  // 实际应用中可以考虑使用 Map 来支持手动清理
}