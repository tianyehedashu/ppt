## 文件夹模式说明

### 灵活的顺序控制
- 使用 `slides/index.json` 配置文件控制页面顺序
- 文件夹可以用语义化名称（如 `intro`, `architecture`）
- 无需重命名文件夹，只需调整配置文件

### 配置示例
```json
{
  "slides": [
    {"id": "intro", "title": "项目介绍", "folder": "intro"},
    {"id": "arch", "title": "系统架构", "folder": "architecture"},
    {"id": "deploy", "title": "部署方案", "folder": "deployment"}
  ]
}
```
