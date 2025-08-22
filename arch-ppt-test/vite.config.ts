import { defineConfig } from 'vite';

export default defineConfig({
  server: { 
    port: 5173,
    host: true,
    open: true
  },
  
  build: {
    target: 'es2019',
    minify: 'terser',
    
    rollupOptions: {
      output: {
        // 代码分割优化
        manualChunks: {
          // 将大型库分离到单独的 chunk
          'reveal': ['reveal.js'],
          'd3': ['d3'],
          'mermaid': ['mermaid'],
          'markdown': ['markdown-it']
        }
      }
    },
    
    terserOptions: {
      compress: {
        drop_console: true,  // 生产环境移除 console
        drop_debugger: true  // 生产环境移除 debugger
      }
    },
    
    // 资源处理优化
    assetsInlineLimit: 4096,  // 小于 4KB 的资源内联
    cssCodeSplit: true,       // CSS 代码分割
    
    // 生产优化
    sourcemap: false,         // 关闭 sourcemap 减少体积
    emptyOutDir: true,        // 构建前清空输出目录
  },
  
  // 依赖预构建优化
  optimizeDeps: {
    include: [
      'reveal.js',
      'd3',
      'markdown-it'
    ],
    exclude: [
      'mermaid'  // Mermaid 较大，按需加载
    ]
  },
  
  // CSS 预处理器配置
  css: {
    devSourcemap: true,
    
    postcss: {
      plugins: []  // PostCSS 插件在 postcss.config.cjs 中配置
    }
  },
  
  // 环境变量配置
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});