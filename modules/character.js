const CharacterModule = {
    character: null,
    speechBubble: null,
    characterMask: null,
    
    init() {
        this.character = document.getElementById('faceless-character');
        this.speechBubble = document.getElementById('speech-bubble');
        this.characterMask = document.getElementById('character-mask');
        
        // 初始状态
        this.updateSpeech(t('welcome'));
    },
    
    updateSpeech(text) {
        this.speechBubble.textContent = text;
    },
    
    showDemand(emotion) {
        this.updateSpeech(t('drawing').replace('{emotion}', emotion));
    },
    
    showWaiting() {
        this.updateSpeech(t('waiting'));
    },
    
    showAnalyzing() {
        this.updateSpeech(t('analyzing'));
    },
    
    showMask() {
        this.characterMask.style.opacity = '1';
    },
    
    hideMask() {
        this.characterMask.style.opacity = '0';
    },
    
    // 满意动画（点头）
    nod() {
        this.character.classList.remove('shaking', 'dancing');
        this.character.classList.add('nodding');
        
        // 动画结束后移除类
        setTimeout(() => {
            this.character.classList.remove('nodding');
        }, 1500);
    },
    
    // 不满意动画（摇头）
    shake() {
        this.character.classList.remove('nodding', 'dancing');
        this.character.classList.add('shaking');
        
        // 动画结束后移除类
        setTimeout(() => {
            this.character.classList.remove('shaking');
        }, 1500);
    },
    
    // 非常满意动画（跳舞）
    dance() {
        this.character.classList.remove('nodding', 'shaking');
        this.character.classList.add('dancing');
        
        // 动画结束后移除类
        setTimeout(() => {
            this.character.classList.remove('dancing');
        }, 2400);
    },
    
    // 根据分数显示反馈
    showFeedback(score, feedback) {
        this.hideMask();
        
        // 显示评分
        const scoreDisplay = document.getElementById('score-display');
        scoreDisplay.textContent = `${t('scoreTitle')}${score}`;
        
        // 显示评语
        this.updateSpeech(feedback);
        
        // 根据分数播放动画
        if (score >= 80) {
            this.showMask();
            this.dance();
        } else if (score >= 60) {
            this.showMask();
            this.nod();
        } else {
            this.shake();
        }
    }
};
