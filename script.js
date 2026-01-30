// 游戏状态
let currentDemand = '';
let isGameStarted = false;
// currentLang 已在 i18n.js 中定义

// DOM 元素
const startBtn = document.getElementById('start-game');
const submitBtn = document.getElementById('submit-drawing');
const restartBtn = document.getElementById('restart-game');
const drawingTools = document.getElementById('drawing-tools');

// 初始化游戏
function initGame() {
    CanvasModule.init();
    CharacterModule.init();
    
    // 绑定按钮事件
    startBtn.addEventListener('click', startGame);
    submitBtn.addEventListener('click', submitDrawing);
    restartBtn.addEventListener('click', restartGame);
}

// 开始游戏
async function startGame() {
    isGameStarted = true;
    
    // 获取情绪需求
    currentDemand = await AIModule.getDemand(currentLang);
    
    // 更新UI
    startBtn.style.display = 'none';
    submitBtn.style.display = 'block';
    drawingTools.style.display = 'block';
    
    // 清空画布
    CanvasModule.clearCanvas();
    
    // 更新无面人状态
    CharacterModule.showDemand(currentDemand);
    CharacterModule.hideMask();
    
    // 清空评分显示
    document.getElementById('score-display').textContent = '';
}

// 提交作品
async function submitDrawing() {
    // 检查画布是否为空
    if (CanvasModule.isCanvasEmpty()) {
        CharacterModule.updateSpeech(currentLang === 'zh' ? '画布是空的，请先画点什么！' : 'Canvas is empty, please draw something!');
        return;
    }
    
    // 显示分析中状态
    CharacterModule.showAnalyzing();
    submitBtn.disabled = true;
    
    try {
        // 获取画布图像数据
        const imageData = CanvasModule.getImageData();
        
        // 调用 AI 评分
        const aiResult = await AIModule.scoreDrawing(imageData, currentDemand, currentLang);
        
        // 显示结果
        CharacterModule.showFeedback(aiResult.score, aiResult.feedback);
        
        // 切换按钮
        submitBtn.style.display = 'none';
        drawingTools.style.display = 'none';
        restartBtn.style.display = 'block';
        
    } catch (error) {
        console.error('评分失败:', error);
        CharacterModule.updateSpeech(currentLang === 'zh' ? '评分失败，请重试' : 'Scoring failed, please try again');
        submitBtn.disabled = false;
    }
}

// 重新开始游戏
async function restartGame() {
    // 重置UI
    restartBtn.style.display = 'none';
    submitBtn.disabled = false;
    
    // 重新开始
    await startGame();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGame);
