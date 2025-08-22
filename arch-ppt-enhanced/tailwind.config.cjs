/**
 * Tailwind CSS 配置 - Arch PPT 优化版
 * 
 * 特点：
 * 1. 使用 tw- 前缀避免与 Reveal.js 样式冲突
 * 2. 禁用 preflight 避免重置 Reveal.js 基础样式
 * 3. 严格的内容扫描和安全列表
 * 4. 针对演示优化的响应式断点
 */

module.exports = {
  // 前缀隔离，避免样式冲突
  prefix: 'tw-',
  
  // 禁用基础样式重置
  corePlugins: { 
    preflight: false 
  },
  
  // 内容扫描路径
  content: [
    './index.html',
    './src/**/*.{ts,js,tsx,jsx,vue}',
    './slides/**/*.{md,mdx}',
    './public/**/*.html'
  ],
  
  // 安全列表：防止动态类名被误删
  safelist: [
    // 常用颜色类
    { pattern: /^tw-bg-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^tw-text-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^tw-border-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(50|100|200|300|400|500|600|700|800|900)$/ },
    
    // 常用间距类
    { pattern: /^tw-p-\d+$/ },
    { pattern: /^tw-m-\d+$/ },
    { pattern: /^tw-px-\d+$/ },
    { pattern: /^tw-py-\d+$/ },
    { pattern: /^tw-mx-\d+$/ },
    { pattern: /^tw-my-\d+$/ },
    
    // 常用布局类
    'tw-flex', 'tw-grid', 'tw-block', 'tw-inline', 'tw-hidden',
    'tw-justify-center', 'tw-justify-between', 'tw-justify-around',
    'tw-items-center', 'tw-items-start', 'tw-items-end',
    'tw-text-center', 'tw-text-left', 'tw-text-right',
    
    // 常用尺寸类
    { pattern: /^tw-w-(auto|full|screen|\d+|1\/2|1\/3|2\/3|1\/4|3\/4)$/ },
    { pattern: /^tw-h-(auto|full|screen|\d+)$/ },
    
    // Typography 插件类
    'tw-prose', 'tw-prose-sm', 'tw-prose-lg', 'tw-prose-xl',
    'tw-prose-invert'
  ],
  
  // 主题配置
  theme: {
    // 针对演示优化的断点
    screens: {
      'sm': '640px',
      'md': '768px', 
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // 演示特定断点
      'slide': '960px',  // 标准幻灯片宽度
      'present': '1200px' // 演示模式
    },
    
    extend: {
      // 演示相关的颜色
      colors: {
        'slide': {
          bg: 'var(--reveal-background-color, #191919)',
          text: 'var(--reveal-main-color, #fff)',
          accent: 'var(--reveal-link-color, #42affa)'
        }
      },
      
      // 演示相关的字体
      fontFamily: {
        'slide': ['var(--reveal-main-font)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace']
      },
      
      // 演示相关的间距
      spacing: {
        'slide': '960px',
        'slide-h': '700px'
      },
      
      // 动画时长
      transitionDuration: {
        'slide': '300ms'
      },
      
      // 阴影
      boxShadow: {
        'slide': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'slide-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }
    }
  },
  
  // 插件配置
  plugins: [
    require('@tailwindcss/typography')({
      className: 'tw-prose'
    })
  ],
  
  // 变体配置
  variants: {
    extend: {
      // 支持暗黑模式变体
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
      
      // 支持打印变体
      display: ['print'],
      margin: ['print'],
      padding: ['print']
    }
  }
};