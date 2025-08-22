/**
 * 灵活的文件夹模式加载器
 * 支持 index.json 配置文件控制顺序
 */

interface SlideConfig {
  id: string;
  title: string;
  folder: string;
}

interface SlidesIndex {
  title?: string;
  author?: string;
  slides: SlideConfig[];
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
        
        // 加载子页面
        const subPages = await loadSubPages(folderPath);
        if (subPages.length > 0) {
          parts.push(...subPages);
        }
      }
    } catch (error) {
      console.warn(`Failed to load slide ${slide.id}:`, error);
    }
  }
  
  return parts.join('\n\n---\n\n');
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

async function loadSlideContent(folderPath: string): Promise<string | null> {
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
    try {
      const response = await fetch(`${folderPath}/sub-${subIndex}.md`);
      if (!response.ok) break;
      
      let content = await response.text();
      
      // 处理相对路径
      content = content.replace(
        /!\[([^\]]*)\]\((?!http|\/|data:)([^)]+)\)/g, 
        `![#1](${folderPath}/$2)`
      );
      
      subPages.push(`--\n\n${content}`);
      subIndex++;
    } catch {
      break;
    }
  }
  
  return subPages;
}
