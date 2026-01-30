const i18n = {
    zh: {
        gameTitle: '无面人面具绘制游戏',
        startGame: '开始游戏',
        submitDrawing: '提交作品',
        playAgain: '再玩一次',
        eraser: '橡皮擦',
        clear: '清空画布',
        brushSize: '画笔大小：',
        welcome: '你好！我是一个无面人。请帮我画一个面具吧！',
        drawing: '请为我画一个{emotion}的面具...',
        waiting: '我正在等待你的作品...',
        analyzing: '让我看看你的作品...',
        scoreTitle: '评分：',
        verySatisfied: ['太棒了！这正是我想要的！', '完美的面具！', '我太喜欢了！'],
        satisfied: ['做得不错！', '我很喜欢这个面具！', '继续保持！'],
        dissatisfied: ['不太像，再试试吧', '也许换个颜色更好', '还可以做得更好'],
        emotions: ['快乐', '悲伤', '愤怒', '惊讶', '恐惧', '厌恶', '平静', '兴奋', '疲惫', '神秘']
    },
    en: {
        gameTitle: 'Faceless Mask Drawing Game',
        startGame: 'Start Game',
        submitDrawing: 'Submit Drawing',
        playAgain: 'Play Again',
        eraser: 'Eraser',
        clear: 'Clear Canvas',
        brushSize: 'Brush Size: ',
        welcome: 'Hello! I am a faceless being. Please draw a mask for me!',
        drawing: 'Please draw a {emotion} mask for me...',
        waiting: 'I am waiting for your artwork...',
        analyzing: 'Let me see your work...',
        scoreTitle: 'Score: ',
        verySatisfied: ['Amazing! This is exactly what I wanted!', 'Perfect mask!', 'I love it so much!'],
        satisfied: ['Well done!', 'I really like this mask!', 'Keep it up!'],
        dissatisfied: ['Not quite, try again', 'Maybe different colors?', 'Could be better'],
        emotions: ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'calm', 'excited', 'tired', 'mysterious']
    }
};

let currentLang = 'zh';

function t(key) {
    return i18n[currentLang][key] || key;
}

function setLang(lang) {
    if (i18n[lang]) {
        currentLang = lang;
        return true;
    }
    return false;
}

function getLang() {
    return currentLang;
}
