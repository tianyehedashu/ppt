# 高级 Fragment 技巧

---

## 嵌套 Fragment 动画

<div class="fragment">
<h3>🏗️ 系统架构</h3>

<div class="fragment">
<h4>前端层</h4>
<ul>
<li class="fragment">React 组件</li>
<li class="fragment">状态管理</li>
<li class="fragment">路由系统</li>
</ul>
</div>

<div class="fragment">
<h4>后端层</h4>
<ul>
<li class="fragment">API 服务</li>
<li class="fragment">业务逻辑</li>
<li class="fragment">数据访问</li>
</ul>
</div>

</div>

---

## 表格数据分步展示

| 功能模块 | 状态 | 进度 |
|---------|------|------|
| <span class="fragment">用户管理</span> | <span class="fragment highlight-green">✅ 完成</span> | <span class="fragment">100%</span> |
| <span class="fragment">权限系统</span> | <span class="fragment highlight-blue">🔄 进行中</span> | <span class="fragment">75%</span> |
| <span class="fragment">数据分析</span> | <span class="fragment highlight-red">⏳ 计划中</span> | <span class="fragment">0%</span> |

---

## 架构图分步构建

<div style="position: relative; height: 400px;">

<!-- 基础层 -->
<div class="fragment" style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); background: #3498db; color: white; padding: 20px; border-radius: 8px;">
数据库层
</div>

<!-- 服务层 -->
<div class="fragment" style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); background: #2ecc71; color: white; padding: 20px; border-radius: 8px;">
业务服务层
</div>

<!-- API层 -->
<div class="fragment" style="position: absolute; bottom: 160px; left: 50%; transform: translateX(-50%); background: #f39c12; color: white; padding: 20px; border-radius: 8px;">
API 网关
</div>

<!-- 前端层 -->
<div class="fragment" style="position: absolute; bottom: 240px; left: 50%; transform: translateX(-50%); background: #e74c3c; color: white; padding: 20px; border-radius: 8px;">
前端应用
</div>

<!-- 连接线 -->
<div class="fragment" style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: 2px; height: 20px; background: #34495e;"></div>
<div class="fragment" style="position: absolute; bottom: 150px; left: 50%; transform: translateX(-50%); width: 2px; height: 20px; background: #34495e;"></div>
<div class="fragment" style="position: absolute; bottom: 230px; left: 50%; transform: translateX(-50%); width: 2px; height: 20px; background: #34495e;"></div>

</div>

---

## 交互式内容分步显示

<div class="fragment">
<h3>🎯 用户故事</h3>
<blockquote>
作为一个开发者，我希望能够轻松创建分步演示
</blockquote>
</div>

<div class="fragment">
<h4>📋 需求分析</h4>
<ul>
<li class="fragment">支持多种动画效果</li>
<li class="fragment">可控制显示顺序</li>
<li class="fragment">易于实现和维护</li>
</ul>
</div>

<div class="fragment">
<h4>💡 解决方案</h4>

<div class="fragment">
<p><strong>使用 Reveal.js Fragments：</strong></p>

```html
<p class="fragment">逐步显示的内容</p>
<p class="fragment fade-up">带动画效果</p>
<p class="fragment" data-fragment-index="2">控制顺序</p>
```
</div>

</div>

---

## 代码演化过程

<h3>🔄 代码重构演示</h3>

<!-- 初始版本 -->
<div class="fragment">
<h4>v1.0 - 初始版本</h4>
```javascript
function getUserData(id) {
    return fetch('/api/users/' + id).then(res => res.json());
}
```
</div>

<!-- 添加错误处理 -->
<div class="fragment">
<h4>v1.1 - 添加错误处理</h4>
```javascript
function getUserData(id) {
    return fetch('/api/users/' + id)
        .then(res => {
            if (!res.ok) throw new Error('User not found');
            return res.json();
        })
        .catch(err => console.error(err));
}
```
</div>

<!-- 使用async/await -->
<div class="fragment">
<h4>v2.0 - 现代化语法</h4>
```javascript
async function getUserData(id) {
    try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) throw new Error('User not found');
        return await res.json();
    } catch (err) {
        console.error('Failed to fetch user:', err);
        return null;
    }
}
```
</div>

---

## 数据可视化分步构建

<div class="fragment">
<h3>📊 销售数据分析</h3>
</div>

<div style="display: flex; justify-content: space-around; margin: 30px 0;">

<div class="fragment">
<div style="text-align: center;">
<h4>Q1</h4>
<div style="background: #3498db; height: 60px; width: 60px; margin: 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">85%</div>
</div>
</div>

<div class="fragment">
<div style="text-align: center;">
<h4>Q2</h4>
<div style="background: #2ecc71; height: 80px; width: 60px; margin: 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">92%</div>
</div>
</div>

<div class="fragment">
<div style="text-align: center;">
<h4>Q3</h4>
<div style="background: #f39c12; height: 70px; width: 60px; margin: 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">88%</div>
</div>
</div>

<div class="fragment">
<div style="text-align: center;">
<h4>Q4</h4>
<div style="background: #e74c3c; height: 95px; width: 60px; margin: 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">95%</div>
</div>
</div>

</div>

<div class="fragment">
<p style="text-align: center; margin-top: 30px;">
<strong>🎉 年度目标达成率：90%</strong>
</p>
</div>
