// 外部JavaScript文件演示

console.log('外部JavaScript文件加载成功');

// 工具函数
const utils = {
    // 生成随机颜色
    randomColor: function() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 格式化数字
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

// 高级交互功能
class AdvancedInteraction {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.bindEvents();
        this.startParticleSystem();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 200;
        this.canvas.style.cssText = `
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.2);
            margin: 20px auto;
            display: block;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        
        // 将canvas添加到页面
        const demoSection = document.querySelector('.interactive-demo');
        if (demoSection) {
            const canvasContainer = document.createElement('div');
            canvasContainer.style.textAlign = 'center';
            canvasContainer.appendChild(this.canvas);
            
            const title = document.createElement('h4');
            title.textContent = '🎨 粒子系统演示';
            title.style.color = 'white';
            title.style.marginTop = '30px';
            
            demoSection.appendChild(title);
            demoSection.appendChild(canvasContainer);
        }
    }
    
    bindEvents() {
        // 鼠标移动事件
        if (this.canvas) {
            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 在鼠标位置创建新粒子
                for (let i = 0; i < 3; i++) {
                    this.createParticle(x, y);
                }
            });
        }
        
        // 窗口大小改变事件
        window.addEventListener('resize', utils.debounce(() => {
            console.log('窗口大小已改变');
        }, 300));
    }
    
    createParticle(x, y) {
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1.0,
            decay: 0.02,
            color: utils.randomColor()
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            return particle.life > 0;
        });
    }
    
    drawParticles() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    startParticleSystem() {
        const animate = () => {
            this.updateParticles();
            this.drawParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stopParticleSystem() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// 数据管理类
class DataManager {
    constructor() {
        this.data = {
            visits: 0,
            interactions: 0,
            lastUpdate: new Date()
        };
        
        this.loadData();
    }
    
    loadData() {
        const saved = localStorage.getItem('complex-html-demo-data');
        if (saved) {
            try {
                this.data = { ...this.data, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to load saved data:', e);
            }
        }
    }
    
    saveData() {
        try {
            localStorage.setItem('complex-html-demo-data', JSON.stringify(this.data));
        } catch (e) {
            console.warn('Failed to save data:', e);
        }
    }
    
    incrementVisits() {
        this.data.visits++;
        this.data.lastUpdate = new Date();
        this.saveData();
    }
    
    incrementInteractions() {
        this.data.interactions++;
        this.data.lastUpdate = new Date();
        this.saveData();
    }
    
    getData() {
        return { ...this.data };
    }
    
    resetData() {
        this.data = {
            visits: 0,
            interactions: 0,
            lastUpdate: new Date()
        };
        this.saveData();
    }
}

// 全局实例
let advancedInteraction;
let dataManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('外部脚本初始化开始');
    
    // 初始化高级交互
    advancedInteraction = new AdvancedInteraction();
    
    // 初始化数据管理
    dataManager = new DataManager();
    dataManager.incrementVisits();
    
    // 显示统计信息
    displayStats();
    
    // 为按钮添加额外的交互效果
    enhanceButtons();
    
    console.log('外部脚本初始化完成');
});

// 显示统计信息
function displayStats() {
    const data = dataManager.getData();
    
    // 创建统计面板
    const statsPanel = document.createElement('div');
    statsPanel.innerHTML = `
        <h4 style="color: white; text-align: center; margin-bottom: 15px;">📈 访问统计</h4>
        <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px; font-family: monospace;">
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>页面访问:</span>
                <span style="color: #4ecdc4;">${utils.formatNumber(data.visits)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>交互次数:</span>
                <span style="color: #4ecdc4;">${utils.formatNumber(data.interactions)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>最后更新:</span>
                <span style="color: #4ecdc4;">${new Date(data.lastUpdate).toLocaleTimeString()}</span>
            </div>
        </div>
    `;
    
    const demoSection = document.querySelector('.interactive-demo');
    if (demoSection) {
        demoSection.appendChild(statsPanel);
    }
}

// 增强按钮交互
function enhanceButtons() {
    document.querySelectorAll('.demo-button').forEach(button => {
        button.addEventListener('click', function() {
            dataManager.incrementInteractions();
            
            // 添加点击波纹效果
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加波纹动画CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 导出给全局使用
window.complexHtmlDemo = {
    utils,
    advancedInteraction,
    dataManager,
    displayStats,
    enhanceButtons
};
