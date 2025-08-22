# 多媒体展示

展示图片、视频和其他媒体内容的集成。

---

## 图片展示

### 基础图片

![示例图表](../../public/assets/diagram.svg)

### 带样式的图片

<div style="text-align: center; margin: 20px 0;">
  <img src="../../public/assets/diagram.svg" alt="架构图" style="
    max-width: 300px;
    border-radius: 15px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    transition: transform 0.3s ease;
  " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
  <p style="margin: 15px 0 0 0; color: #666; font-style: italic;">鼠标悬停查看缩放效果</p>
</div>

---

## 图片画廊

<div class="image-gallery" style="
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin: 20px 0;
">
  <div style="
    background: #ff6b6b;
    height: 100px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  " onclick="this.style.transform='scale(0.95)'; setTimeout(() => this.style.transform='scale(1)', 100)">
    图片 1
  </div>
  
  <div style="
    background: #4ecdc4;
    height: 100px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  " onclick="this.style.transform='scale(0.95)'; setTimeout(() => this.style.transform='scale(1)', 100)">
    图片 2
  </div>
  
  <div style="
    background: #45b7d1;
    height: 100px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s;
  " onclick="this.style.transform='scale(0.95)'; setTimeout(() => this.style.transform='scale(1)', 100)">
    图片 3
  </div>
</div>

---

## SVG 动画

<div style="text-align: center; margin: 30px 0;">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <style>
      .svg-demo circle {
        animation: svgPulse 2s ease-in-out infinite alternate;
      }
      
      @keyframes svgPulse {
        0% { r: 20; fill: #ff6b6b; }
        100% { r: 40; fill: #4ecdc4; }
      }
      
      .svg-demo path {
        stroke-dasharray: 300;
        stroke-dashoffset: 300;
        animation: svgDraw 3s ease-in-out infinite;
      }
      
      @keyframes svgDraw {
        0% { stroke-dashoffset: 300; }
        50% { stroke-dashoffset: 0; }
        100% { stroke-dashoffset: -300; }
      }
    </style>
    
    <g class="svg-demo">
      <circle cx="100" cy="100" r="30" fill="#ff6b6b"/>
      <path d="M 50 50 Q 100 20 150 50 Q 180 100 150 150 Q 100 180 50 150 Q 20 100 50 50" 
            stroke="#4ecdc4" stroke-width="3" fill="none"/>
    </g>
  </svg>
  
  <p style="margin: 15px 0 0 0; color: #666; font-style: italic;">SVG 动画演示</p>
</div>
