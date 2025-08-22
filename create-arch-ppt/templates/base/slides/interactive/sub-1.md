# 动画效果演示

---

## CSS 动画

<div class="animation-demo">
  <style>
    .animation-demo .pulse {
      width: 60px;
      height: 60px;
      background: #ff6b6b;
      border-radius: 50%;
      margin: 20px auto;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    .animation-demo .slide-in {
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
      animation: slideInFromLeft 1s ease-out;
    }
    
    @keyframes slideInFromLeft {
      0% { transform: translateX(-100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    
    .animation-demo .rotate {
      width: 80px;
      height: 80px;
      background: #4ecdc4;
      margin: 20px auto;
      animation: rotate 3s linear infinite;
    }
    
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>

  <div class="pulse"></div>
  
  <div class="slide-in">
    <h3 style="margin: 0;">从左滑入的文本</h3>
    <p style="margin: 10px 0 0 0;">带有渐变背景</p>
  </div>
  
  <div class="rotate"></div>
</div>

---

## JavaScript 动画

<div class="js-animation">
  <canvas id="particleCanvas" width="400" height="200" style="
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 20px auto;
    display: block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  "></canvas>
  
  <button id="startAnimation" style="
    background: #4CAF50;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
    margin: 10px;
  ">开始粒子动画</button>
  
  <button id="stopAnimation" style="
    background: #f44336;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 5px;
    margin: 10px;
  ">停止动画</button>

  <script>
    (function() {
      const canvas = document.getElementById('particleCanvas');
      const ctx = canvas ? canvas.getContext('2d') : null;
      let animationId;
      let particles = [];
      
      if (!canvas || !ctx) return;
      
      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.vx = (Math.random() - 0.5) * 2;
          this.vy = (Math.random() - 0.5) * 2;
          this.radius = Math.random() * 3 + 1;
          this.color = `hsl(${Math.random() * 60 + 300}, 70%, 70%)`;
        }
        
        update() {
          this.x += this.vx;
          this.y += this.vy;
          
          if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
          if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }
      
      function createParticles() {
        particles = [];
        for (let i = 0; i < 30; i++) {
          particles.push(new Particle());
        }
      }
      
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.update();
          particle.draw();
        });
        
        animationId = requestAnimationFrame(animate);
      }
      
      document.getElementById('startAnimation')?.addEventListener('click', () => {
        createParticles();
        animate();
      });
      
      document.getElementById('stopAnimation')?.addEventListener('click', () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    })();
  </script>
</div>
