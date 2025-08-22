import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';
import Reveal from 'reveal.js';
import Markdown from 'markdown-it';
import mermaid from 'mermaid';

// Reveal plugins
// @ts-ignore
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js';
// @ts-ignore
import RevealNotes from 'reveal.js/plugin/notes/notes.esm.js';
// @ts-ignore
import RevealZoom from 'reveal.js/plugin/zoom/zoom.esm.js';

import { renderMarkdownToSections } from './lib/markdown/splitter';
import { useImageRenderer } from './lib/markdown/image';
import { applyHighlightHook } from './lib/highlight';
import { renderD3Blocks } from './lib/d3';
import { loadFolderSlides } from './lib/markdown/folder-slides';
import './styles/theme.css';
import './styles/mermaid.css';

// 错误处理
class AppError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'AppError';
  }
}

// 显示错误信息
function showError(container: HTMLElement, message: string, details?: string): void {
  container.innerHTML = `
    <div style="
      padding: 40px;
      text-align: center;
      color: #ef4444;
      font-family: ui-sans-serif, system-ui, sans-serif;
    ">
      <h2 style="margin: 0 0 16px 0; font-size: 24px;">加载错误</h2>
      <p style="margin: 0 0 16px 0; font-size: 16px;">${message}</p>
      ${details ? `<details style="margin-top: 16px; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
        <summary style="cursor: pointer; color: #64748b;">详细信息</summary>
        <pre style="margin-top: 8px; padding: 16px; background: #f8fafc; border-radius: 6px; overflow: auto; font-size: 14px;">${details}</pre>
      </details>` : ''}
      <p style="margin: 24px 0 0 0; color: #64748b; font-size: 14px;">
        请检查文件路径和格式是否正确
      </p>
    </div>
  `;
}

// 显示加载状态
function showLoading(container: HTMLElement, message: string = '正在加载...'): void {
  container.innerHTML = `
    <div style="
      padding: 40px;
      text-align: center;
      color: #64748b;
      font-family: ui-sans-serif, system-ui, sans-serif;
    ">
      <div style="
        width: 32px;
        height: 32px;
        border: 3px solid #e2e8f0;
        border-top: 3px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px auto;
      "></div>
      <p style="margin: 0; font-size: 16px;">${message}</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `;
}

// 加载 Markdown 文件
async function loadMarkdown(src: string): Promise<string> {
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new AppError(
        `无法加载文件 "${src}"`,
        new Error(`HTTP ${response.status}: ${response.statusText}`)
      );
    }
    const text = await response.text();
    if (!text.trim()) {
      throw new AppError(`文件 "${src}" 为空`);
    }
    return text;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `网络错误：无法加载 "${src}"`,
      error as Error
    );
  }
}

// 初始化 Markdown 渲染器
function createMarkdownRenderer(): Markdown {
  try {
    const md = new Markdown({
      html: false,
      linkify: true,
      typographer: true,
      highlight: applyHighlightHook()
    });
    
    useImageRenderer(md, { basePath: '/assets' });
    return md;
  } catch (error) {
    throw new AppError('无法初始化 Markdown 渲染器', error as Error);
  }
}

// 初始化 Reveal.js
async function initializeReveal(): Promise<Reveal.Api> {
  try {
    const deck = new Reveal({
      hash: true,
      plugins: [RevealHighlight, RevealNotes, RevealZoom],
      viewDistance: 3,
      // 添加更多配置选项
      controls: true,
      progress: true,
      center: true,
      touch: true,
      transition: 'slide'
    });
    
    await deck.initialize();
    return deck;
  } catch (error) {
    throw new AppError('无法初始化 Reveal.js', error as Error);
  }
}

// 初始化 Mermaid
async function initializeMermaid(): Promise<void> {
  try {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true
      }
    });
    
    await mermaid.run({ 
      querySelector: '.reveal .slides',
      suppressErrors: false
    });
  } catch (error) {
    console.warn('Mermaid 渲染警告:', error);
    // Mermaid 错误不应阻塞整个应用
  }
}

// 渲染 D3 图表（带错误处理）
function renderD3Charts(): void {
  try {
    renderD3Blocks(document);
  } catch (error) {
    console.error('D3 渲染错误:', error);
    // D3 错误不应阻塞整个应用
  }
}

// 节流函数
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 主启动函数
async function bootstrap(): Promise<void> {
  const slidesRoot = document.getElementById('slides-root');
  if (!slidesRoot) {
    throw new AppError('找不到幻灯片容器元素 #slides-root');
  }

  try {
    // 1. 显示加载状态
    showLoading(slidesRoot, '正在加载幻灯片...');

    // 2. 获取文件路径
    const url = new URL(location.href);
    const src = url.searchParams.get('src');

    // 3. 加载 Markdown 内容
    showLoading(slidesRoot, '正在加载内容...');
    let mdText: string;
    
    if (src) {
      // 单文件模式
      mdText = await loadMarkdown(src);
    } else {
      // 文件夹模式（默认）
      mdText = await loadFolderSlides('/slides');
    }

    // 4. 渲染 Markdown
    showLoading(slidesRoot, '正在处理内容...');
    const md = createMarkdownRenderer();
    const { sectionsHtml } = renderMarkdownToSections(md, mdText);
    
    if (!sectionsHtml.trim()) {
      throw new AppError('Markdown 内容解析后为空');
    }

    slidesRoot.innerHTML = sectionsHtml;

    // 5. 初始化 Reveal.js
    showLoading(slidesRoot, '正在初始化演示...');
    const deck = await initializeReveal();

    // 6. 初始化 Mermaid（异步，不阻塞）
    initializeMermaid().catch(error => {
      console.warn('Mermaid 初始化失败:', error);
    });

    // 7. 渲染 D3 图表
    renderD3Charts();

    // 8. 设置事件监听器（节流优化）
    const throttledRenderD3 = throttle(renderD3Charts, 300);
    
    deck.on('slidechanged', () => {
      throttledRenderD3();
    });

    deck.on('ready', () => {
      console.log('Arch PPT 加载完成');
      // 可以在这里添加分析或其他初始化代码
    });

    // 9. 添加键盘快捷键
    document.addEventListener('keydown', (event) => {
      // 例如：Ctrl+R 重新加载当前幻灯片
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        location.reload();
      }
    });

  } catch (error) {
    console.error('Bootstrap error:', error);
    
    if (error instanceof AppError) {
      showError(
        slidesRoot, 
        error.message, 
        error.cause?.stack || error.cause?.toString()
      );
    } else {
      showError(
        slidesRoot,
        '未知错误，请查看控制台了解详情',
        error instanceof Error ? error.stack : String(error)
      );
    }
  }
}

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason);
});

// 启动应用
bootstrap().catch((error) => {
  console.error('应用启动失败:', error);
});