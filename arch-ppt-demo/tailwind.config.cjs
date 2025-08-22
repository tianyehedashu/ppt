/**
 * Tailwind 可选启用，默认模板未 import 其样式以避免冲突。
 */
module.exports = {
  prefix: 'tw-',
  corePlugins: { preflight: false },
  content: [
    './index.html',
    './src/**/*.{ts,js,tsx,jsx,vue}',
    './slides/**/*.{md,mdx}'
  ],
  safelist: [
    { pattern: /^tw-bg-/ },
    { pattern: /^tw-text-/ },
    { pattern: /^tw-border-/ }
  ],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')]
};


