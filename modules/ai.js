const AIModule = {
    apiBaseUrl: '/api',
    
    async getDemand(lang = 'zh') {
        try {
            const response = await fetch(`${this.apiBaseUrl}/demand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lang })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.emotion;
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.log('API调用失败，使用随机情绪:', error);
            return this.getRandomDemand(lang);
        }
    },
    
    getRandomDemand(lang = 'zh') {
        const emotions = {
            zh: ['快乐', '悲伤', '愤怒', '惊讶', '恐惧', '厌恶', '平静', '兴奋', '疲惫', '神秘'],
            en: ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'calm', 'excited', 'tired', 'mysterious']
        };
        
        const emotionList = emotions[lang] || emotions.zh;
        return emotionList[Math.floor(Math.random() * emotionList.length)];
    },
    
    async scoreDrawing(imageData, emotion, lang = 'zh') {
        try {
            const response = await fetch(`${this.apiBaseUrl}/vision-score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: imageData,
                    emotion: emotion,
                    lang: lang
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Scoring API request failed');
            }
        } catch (error) {
            console.log('评分API调用失败，使用备用评分:', error);
            return this.getRandomScore(emotion, lang);
        }
    },
    
    getRandomScore(emotion, lang = 'zh') {
        const score = Math.floor(Math.random() * 40) + 40;
        
        const feedbacks = {
            zh: {
                verySatisfied: ['太棒了！这正是我想要的！', '完美的面具！', '我太喜欢了！'],
                satisfied: ['做得不错！', '我很喜欢这个面具！', '继续保持！'],
                dissatisfied: ['不太像，再试试吧', '也许换个颜色更好', '还可以做得更好']
            },
            en: {
                verySatisfied: ['Amazing! This is exactly what I wanted!', 'Perfect mask!', 'I love it so much!'],
                satisfied: ['Well done!', 'I really like this mask!', 'Keep it up!'],
                dissatisfied: ['Not quite, try again', 'Maybe different colors?', 'Could be better']
            }
        };
        
        let feedbackCategory;
        if (score >= 80) {
            feedbackCategory = 'verySatisfied';
        } else if (score >= 60) {
            feedbackCategory = 'satisfied';
        } else {
            feedbackCategory = 'dissatisfied';
        }
        
        const feedbackList = feedbacks[lang][feedbackCategory] || feedbacks.zh[feedbackCategory];
        const feedback = feedbackList[Math.floor(Math.random() * feedbackList.length)];
        
        return { score, feedback };
    }
};
