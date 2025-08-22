/**
 * 灵活的文件夹模式加载器
 * 支持 index.json 配置文件控制顺序
 */

interface SlideConfig {
  id: string;
  title: string;
  folder: string;
  // 新增：支持级联子页面
  subSlides?: SubSlideConfig[];
}

interface SubSlideConfig {
  id: string;
  title: string;
  file: string; // 可以是 .md 或 .html 文件
}

interface SlidesIndex {
  title?: string;
  author?: string;
  slides: SlideConfig[];
}

// 处理HTML内容，提取有用部分并处理相对路径
function processHtmlContent(htmlContent: string, folderPath: string): string {
  // 如果是完整的HTML文档，提取body内容
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let processedContent = bodyMatch ? bodyMatch[1] : htmlContent;
  
  // 提取head中的style标签
  const headStyles = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  let styleContent = '';
  
  if (headStyles) {
    const styleMatches = headStyles[1].match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    if (styleMatches) {
      styleContent = styleMatches.join('\n');
    }
  }
  
  // 提取script标签
  const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const scriptContent = scriptMatches.join('\n');
  
  // 处理相对路径的资源引用
  processedContent = processedContent.replace(
    /src="(?!http|\/|data:)([^"]+)"/g,
    `src="${folderPath}/$1"`
  );
  
  processedContent = processedContent.replace(
    /href="(?!http|\/|data:|#)([^"]+)"/g,
    `href="${folderPath}/$1"`
  );
  
  // 组合最终内容
  return `${styleContent}\n${processedContent}\n${scriptContent}`;
}

export async function loadFolderSlides(basePath: string = '/slides'): Promise<string> {
  try {
    // 优先尝试加载配置文件
    const indexResponse = await fetch(`${basePath}/index.json`);
    if (indexResponse.ok) {
      const config: SlidesIndex = await indexResponse.json();
      return await loadSlidesFromConfig(config, basePath);
    }
  } catch (error) {
    console.warn('No index.json found, falling back to auto-scan:', error);
  }
  
  // 降级到自动扫描模式
  return await loadSlidesAutoScan(basePath);
}

async function loadSlidesFromConfig(config: SlidesIndex, basePath: string): Promise<string> {
  const parts: string[] = [];
  
  for (const slide of config.slides) {
    const folderPath = `${basePath}/${slide.folder}`;
    
    try {
      let content = await loadSlideContent(folderPath);
      if (content) {
        parts.push(content);
        
        // 优先加载配置的子页面
        if (slide.subSlides && slide.subSlides.length > 0) {
          const configuredSubPages = await loadConfiguredSubPages(folderPath, slide.subSlides);
          if (configuredSubPages.length > 0) {
            parts.push(...configuredSubPages);
          }
        } else {
          // 回退到自动扫描子页面
          const subPages = await loadSubPages(folderPath);
          if (subPages.length > 0) {
            parts.push(...subPages);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to load slide ${slide.id}:`, error);
    }
  }
  
  return parts.join('\n\n---\n\n');
}

// 加载配置指定的子页面
async function loadConfiguredSubPages(folderPath: string, subSlides: SubSlideConfig[]): Promise<string[]> {
  const subPages: string[] = [];
  
  for (const subSlide of subSlides) {
    try {
      const filePath = `${folderPath}/${subSlide.file}`;
      let content: string | null = null;
      
      // 根据文件扩展名决定处理方式
      if (subSlide.file.endsWith('.html')) {
        const htmlResponse = await fetch(filePath);
        if (htmlResponse.ok) {
          const htmlContent = await htmlResponse.text();
          const processedHtml = processHtmlContent(htmlContent, folderPath);
          content = `<div class="html-slide">\n${processedHtml}\n</div>`;
        }
      } else {
        // 默认按Markdown处理
        const response = await fetch(filePath);
        if (response.ok) {
          content = await response.text();
          
          // 处理相对路径
          content = content.replace(
            /!\[([^\]]*)\]\((?!http|\/|data:)([^)]+)\)/g, 
            `![$1](${folderPath}/$2)`
          );
        }
      }
      
      if (content) {
        // 添加垂直分页标记和子页面标题注释
        subPages.push(`--\n\n<!-- Slide: ${subSlide.title} -->\n\n${content}`);
      }
    } catch (error) {
      console.warn(`Failed to load sub-slide ${subSlide.id}:`, error);
    }
  }
  
  return subPages;
}

async function loadSlidesAutoScan(basePath: string): Promise<string> {
  const parts: string[] = [];
  let slideIndex = 1;
  
  while (slideIndex <= 50) { // 最多50页
    const folderPath = `${basePath}/${String(slideIndex).padStart(2, '0')}`;
    
    try {
      const content = await loadSlideContent(folderPath);
      if (!content) {
        // 如果连续3页都没有，认为结束
        if (slideIndex > 3 && parts.length > 0) {
          break;
        }
        slideIndex++;
        continue;
      }
      
      parts.push(content);
      
      // 检查子页面
      const subPages = await loadSubPages(folderPath);
      if (subPages.length > 0) {
        parts.push(...subPages);
      }
      
      slideIndex++;
    } catch (error) {
      console.warn(`Failed to load slide ${slideIndex}:`, error);
      slideIndex++;
    }
  }
  
  return parts.join('\n\n---\n\n');
}

// 处理HTML文件内容，提取有效部分并处理相对路径
function processHtmlContent(htmlContent: string, folderPath: string): string {
  let processedContent = htmlContent;
  
  // 如果是完整的HTML文档，提取body内容
  if (htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html')) {
    // 提取head中的style和script标签
    const headContent = extractHeadContent(htmlContent);
    
    // 提取body内容
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      processedContent = headContent + bodyMatch[1];
    } else {
      // 如果没有body标签，使用整个HTML内容
      processedContent = headContent + htmlContent;
    }
  }
  
  // 处理相对路径资源
  processedContent = processHtmlRelativePaths(processedContent, folderPath);
  
  return processedContent;
}

// 提取HTML头部的样式和脚本
function extractHeadContent(htmlContent: string): string {
  const headMatch = htmlContent.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return '';
  
  const headContent = headMatch[1];
  let extractedContent = '';
  
  // 提取style标签
  const styleMatches = headContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (styleMatches) {
    extractedContent += styleMatches.join('\n') + '\n';
  }
  
  // 提取内联script标签（不包含src属性的）
  const scriptMatches = headContent.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
  if (scriptMatches) {
    extractedContent += scriptMatches.join('\n') + '\n';
  }
  
  return extractedContent;
}

// 处理HTML文件中的相对路径资源
function processHtmlRelativePaths(htmlContent: string, folderPath: string): string {
  let content = htmlContent;
  
  // 处理相对路径的图片
  content = content.replace(
    /src\s*=\s*["'](?!https?:\/\/|\/|data:)([^"']+)["']/gi,
    `src="${folderPath}/$1"`
  );
  
  // 处理相对路径的CSS文件
  content = content.replace(
    /href\s*=\s*["'](?!https?:\/\/|\/|data:)([^"']+\.css)["']/gi,
    `href="${folderPath}/$1"`
  );
  
  // 处理相对路径的JavaScript文件
  content = content.replace(
    /<script[^>]+src\s*=\s*["'](?!https?:\/\/|\/|data:)([^"']+)["']/gi,
    `<script src="${folderPath}/$1"`
  );
  
  // 处理CSS中的background-image等相对路径
  content = content.replace(
    /url\s*\(\s*["']?(?!https?:\/\/|\/|data:)([^"')]+)["']?\s*\)/gi,
    `url("${folderPath}/$1")`
  );
  
  return content;
}

async function loadSlideContent(folderPath: string): Promise<string | null> {
  // 优先尝试加载 index.html
  try {
    const htmlResponse = await fetch(`${folderPath}/index.html`);
    if (htmlResponse.ok) {
      const htmlContent = await htmlResponse.text();
      // 处理HTML内容，提取body部分或直接使用
      const processedHtml = processHtmlContent(htmlContent, folderPath);
      return `<div class="html-slide">\n${processedHtml}\n</div>`;
    }
  } catch {
    // HTML文件不存在，继续尝试Markdown
  }
  
  // 回退到加载 index.md
  try {
    const response = await fetch(`${folderPath}/index.md`);
    if (!response.ok) return null;
    
    let content = await response.text();
    
    // 处理相对路径的图片
    content = content.replace(
      /!\[([^\]]*)\]\((?!http|\/|data:)([^)]+)\)/g, 
      `![$1](${folderPath}/$2)`
    );
    
    return content;
  } catch {
    return null;
  }
}

async function loadSubPages(folderPath: string): Promise<string[]> {
  const subPages: string[] = [];
  let subIndex = 1;
  
  while (subIndex <= 10) { // 最多10个子页面
    let content = null;
    
    // 优先尝试HTML文件
    try {
      const htmlResponse = await fetch(`${folderPath}/sub-${subIndex}.html`);
      if (htmlResponse.ok) {
        const htmlContent = await htmlResponse.text();
        const processedHtml = processHtmlContent(htmlContent, folderPath);
        content = `<div class="html-slide">\n${processedHtml}\n</div>`;
      }
    } catch {
      // HTML文件不存在，继续尝试Markdown
    }
    
    // 回退到Markdown文件
    if (!content) {
      try {
        const response = await fetch(`${folderPath}/sub-${subIndex}.md`);
        if (!response.ok) break;
        
        content = await response.text();
        
        // 处理相对路径
        content = content.replace(
          /!\[([^\]]*)\]\((?!http|\/|data:)([^)]+)\)/g, 
          `![$1](${folderPath}/$2)`
        );
      } catch {
        break;
      }
    }
    
    if (content) {
      subPages.push(`--\n\n${content}`);
      subIndex++;
    } else {
      break;
    }
  }
  
  return subPages;
}
