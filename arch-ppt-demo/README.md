# Arch PPT 示例项目

该目录由 `create-arch-ppt` 生成。包含 Reveal + markdown-it + Mermaid + D3 的最小示例。

## 使用
```bash
npm i
npm run dev
```
在浏览器访问 http://localhost:5173

## 内容
- `slides/demo.md`：示例幻灯片（Mermaid、图片、D3 架构图 `d3-arch`、条形图）；
- `public/assets/diagram.svg`：示例图片，Markdown 中以相对路径 `assets/diagram.svg` 引用；
- 若需启用 Tailwind，请参考模板 README 中的说明。
