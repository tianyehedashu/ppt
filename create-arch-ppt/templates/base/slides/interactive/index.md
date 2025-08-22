# 交互式组件演示

这个页面展示了如何在幻灯片中嵌入HTML、CSS和JavaScript。

---

## HTML + CSS 样式演示

<div style="
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 10px;
  color: white;
  text-align: center;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
">
  <h3 style="margin: 0;">CSS 渐变背景</h3>
  <p style="margin: 10px 0 0 0;">这是内嵌的HTML和CSS样式</p>
</div>

---

## JavaScript 交互演示

<div class="interactive-demo">
  <button id="colorBtn" style="
    background: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
  ">点击改变颜色</button>
  
  <div id="colorBox" style="
    width: 100px;
    height: 100px;
    background-color: #ff6b6b;
    margin: 20px auto;
    border-radius: 10px;
    transition: all 0.5s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  "></div>

  <script>
    (function() {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
      let colorIndex = 0;
      
      const btn = document.getElementById('colorBtn');
      const box = document.getElementById('colorBox');
      
      if (btn && box) {
        btn.addEventListener('click', function() {
          colorIndex = (colorIndex + 1) % colors.length;
          box.style.backgroundColor = colors[colorIndex];
          box.style.transform = 'scale(1.1)';
          
          setTimeout(() => {
            box.style.transform = 'scale(1)';
          }, 200);
        });
      }
    })();
  </script>
</div>

---

## 响应式设计

<div style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
">
  <div style="
    background: #e74c3c;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  ">
    <h4 style="margin: 0;">卡片 1</h4>
    <p style="margin: 10px 0 0 0;">响应式布局</p>
  </div>
  
  <div style="
    background: #3498db;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  ">
    <h4 style="margin: 0;">卡片 2</h4>
    <p style="margin: 10px 0 0 0;">自适应网格</p>
  </div>
  
  <div style="
    background: #2ecc71;
    color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  ">
    <h4 style="margin: 0;">卡片 3</h4>
    <p style="margin: 10px 0 0 0;">现代CSS</p>
  </div>
</div>
