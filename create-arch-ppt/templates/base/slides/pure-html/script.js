// 纯HTML幻灯片交互脚本

// 状态管理
let state = {
    visitorCount: 0,
    animationCount: 0,
    interactionCount: 0,
    isAnimating: false
};

// DOM元素引用
const elements = {
    animateBtn: null,
    resetBtn: null,
    movingBox: null,
    progressFill: null,
    progressText: null,
    visitorCount: null,
    animationCount: null,
    interactionCount: null
};

// 初始化函数
function initializeSlide() {
    // 获取DOM元素
    elements.animateBtn = document.getElementById('animateBtn');
    elements.resetBtn = document.getElementById('resetBtn');
    elements.movingBox = document.getElementById('movingBox');
    elements.progressFill = document.getElementById('progressFill');
    elements.progressText = document.getElementById('progressText');
    elements.visitorCount = document.getElementById('visitorCount');
    elements.animationCount = document.getElementById('animationCount');
    elements.interactionCount = document.getElementById('interactionCount');

    // 检查元素是否存在
    if (!elements.animateBtn || !elements.movingBox) {
        console.warn('HTML slide elements not found');
        return;
    }

    // 绑定事件监听器
    elements.animateBtn.addEventListener('click', handleAnimateClick);
    elements.resetBtn.addEventListener('click', handleResetClick);

    // 初始化访问计数
    state.visitorCount = Math.floor(Math.random() * 100) + 1;
    updateStats();

    // 启动数字动画
    animateCounter(elements.visitorCount, state.visitorCount, 1500);

    // 添加特性卡片的交互效果
    addFeatureCardInteractions();

    console.log('HTML slide initialized successfully');
}

// 处理动画按钮点击
function handleAnimateClick() {
    if (state.isAnimating) return;

    state.isAnimating = true;
    state.animationCount++;
    state.interactionCount++;

    // 更新按钮状态
    elements.animateBtn.textContent = '动画中...';
    elements.animateBtn.disabled = true;

    // 启动移动动画
    elements.movingBox.classList.add('animated');

    // 启动进度条动画
    animateProgress();

    // 动画完成后重置状态
    setTimeout(() => {
        state.isAnimating = false;
        elements.animateBtn.textContent = '启动动画';
        elements.animateBtn.disabled = false;
        updateStats();
    }, 1000);

    updateStats();
}

// 处理重置按钮点击
function handleResetClick() {
    state.interactionCount++;

    // 重置移动框
    elements.movingBox.classList.remove('animated');

    // 重置进度条
    elements.progressFill.style.width = '0%';
    elements.progressText.textContent = '0%';

    // 添加重置动画效果
    elements.resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.resetBtn.style.transform = 'scale(1)';
    }, 150);

    updateStats();
}

// 进度条动画
function animateProgress() {
    let progress = 0;
    const duration = 800;
    const startTime = Date.now();

    function updateProgress() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const percentage = Math.floor(easeOut * 100);

        elements.progressFill.style.width = percentage + '%';
        elements.progressText.textContent = percentage + '%';

        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        }
    }

    updateProgress();
}

// 数字计数动画
function animateCounter(element, targetValue, duration = 1000) {
    if (!element) return;

    const startValue = 0;
    const startTime = Date.now();

    function updateCounter() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    updateCounter();
}

// 更新统计数据
function updateStats() {
    if (elements.visitorCount) elements.visitorCount.textContent = state.visitorCount;
    if (elements.animationCount) elements.animationCount.textContent = state.animationCount;
    if (elements.interactionCount) elements.interactionCount.textContent = state.interactionCount;
}

// 添加特性卡片交互效果
function addFeatureCardInteractions() {
    const featureCards = document.querySelectorAll('.feature-item');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.animationName = 'pulse';
            this.style.animationDuration = '0.6s';
            this.style.animationIterationCount = '1';
        });

        card.addEventListener('animationend', function() {
            this.style.animation = '';
        });

        card.addEventListener('click', function() {
            state.interactionCount++;
            updateStats();

            // 点击反馈动画
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// 监听Reveal.js事件（如果可用）
function setupRevealIntegration() {
    // 等待Reveal.js加载
    setTimeout(() => {
        if (window.Reveal) {
            // 监听幻灯片切换事件
            Reveal.on('slidechanged', function(event) {
                console.log('Slide changed to:', event.indexh, event.indexv);
                
                // 如果切换到当前幻灯片，重新初始化
                if (event.currentSlide && event.currentSlide.querySelector('.slide-container')) {
                    setTimeout(initializeSlide, 100);
                }
            });

            // 监听fragment事件
            Reveal.on('fragmentshown', function(event) {
                console.log('Fragment shown:', event.fragment);
                
                // 为fragment添加特殊效果
                if (event.fragment.classList.contains('stats-section')) {
                    // 重新运行计数器动画
                    setTimeout(() => {
                        animateCounter(elements.visitorCount, state.visitorCount, 800);
                        animateCounter(elements.animationCount, state.animationCount, 900);
                        animateCounter(elements.interactionCount, state.interactionCount, 1000);
                    }, 200);
                }
            });

            console.log('Reveal.js integration setup complete');
        }
    }, 500);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, initializing HTML slide...');
    initializeSlide();
    setupRevealIntegration();
});

// 导出API供其他脚本使用
window.HTMLSlideAPI = {
    getState: () => ({ ...state }),
    resetStats: () => {
        state.animationCount = 0;
        state.interactionCount = 0;
        updateStats();
    },
    triggerAnimation: handleAnimateClick
};
