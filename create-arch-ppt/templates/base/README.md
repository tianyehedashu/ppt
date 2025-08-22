# Arch PPT 模板

基于 Vite + Reveal.js + markdown-it + Mermaid + D3 的演示模板，支持 `d3-arch` 复杂架构图与统一风格的 Markdown 图片渲染。

## 快速开始
```bash
npm i
npm run dev
```
打开开发地址（默认 http://localhost:5173 ）。

## 目录说明
- `slides/`：编写你的 Markdown 幻灯片，支持 `---` 水平、`--` 垂直分片；
- `src/`：初始化 Reveal、Markdown 渲染、Mermaid 与 D3；
- `public/assets/`：放置图片资源，Markdown 使用相对路径引用；
- `src/lib/d3/charts/architecture.ts`：`arch` 复杂架构图渲染器（DAG 简易布局 + 缩放/拖拽）。

## Markdown 约定
- **分片**：`---`（水平），`--`（垂直）；
- **Mermaid**：使用 ```mermaid 代码块；
- **D3 架构图**：使用 ```d3-arch 代码块或 `<div data-d3="arch">`；
- **图片**：相对路径（例如 `assets/diagram.svg`），模板会统一样式并基于 `/assets` 自动解析。

## D3 架构图使用
示例（见 `slides/demo.md`）：
```d3-arch
{
  "layout": { "type": "dag", "rankdir": "LR" },
  "nodes": [{ "id": "gw" }, { "id": "svc" }, { "id": "db" }],
  "edges": [{ "source": "gw", "target": "svc" }, { "source": "svc", "target": "db" }]
}
```

## 图片风格
模板为 Markdown 图片添加类名 `md-image` 并提供样式：最大宽度 100%、自适应高度、圆角及轻微阴影。可在 `src/styles/theme.css` 覆写。

## Tailwind（可选）
- 模板已包含最小配置，但默认未引入 `src/styles/tailwind.css`；
- 开启方法：在 `src/main.ts` 引入 `import './styles/tailwind.css'`，并执行：
```bash
npm i -D tailwindcss @tailwindcss/typography
```

## 构建
```bash
npm run build
npm run preview
```

## License
MIT
