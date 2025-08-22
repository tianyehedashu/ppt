# Assets 文件夹

这个文件夹用于存放HTML幻灯片所需的资源文件：

- 图片文件 (PNG, JPG, SVG, GIF)
- 数据文件 (JSON, CSV)
- 字体文件 (WOFF, TTF)
- 其他媒体文件

## 使用方式

在HTML文件中，使用相对路径引用：

```html
<img src="assets/logo.png" alt="Logo">
<link rel="stylesheet" href="assets/custom.css">
<script src="assets/data.json"></script>
```

系统会自动处理相对路径，确保资源正确加载。
