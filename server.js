require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 中间件：记录所有请求
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Request body:', req.body);
    next();
});

// 获取情绪需求
app.post('/api/demand', async (req, res) => {
    console.log('\n========== 获取情绪需求 ==========');
    const { lang = 'zh' } = req.body;
    
    // 简单的情绪列表
    const emotions = {
        zh: ['快乐', '悲伤', '愤怒', '惊讶', '恐惧', '厌恶', '平静', '兴奋', '疲惫', '神秘'],
        en: ['happy', 'sad', 'angry', 'surprised', 'fearful', 'disgusted', 'calm', 'excited', 'tired', 'mysterious']
    };
    
    const emotionList = emotions[lang] || emotions.zh;
    const randomEmotion = emotionList[Math.floor(Math.random() * emotionList.length)];
    
    console.log('返回情绪:', randomEmotion);
    console.log('===================================\n');
    
    res.json({ emotion: randomEmotion });
});

// 使用 NVIDIA Vision API 评分
app.post('/api/vision-score', async (req, res) => {
    console.log('\n========== NVIDIA Vision API 评分 ==========');
    
    const { image, emotion, lang = 'zh' } = req.body;
    const apiKey = process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
        console.log('未配置 NVIDIA_API_KEY，使用随机评分');
        const randomScore = Math.floor(Math.random() * 60) + 40;
        res.json({ score: randomScore, feedback: '未配置API，使用随机评分' });
        return;
    }
    
    try {
        const prompt = lang === 'zh' 
            ? `你是一个神秘、温柔但略显孤独的“无面人”。玩家为你画了一张表达“${emotion}”情绪的面具。请评估这张面具，给出一个0-100的分数，并以无面人的口吻写一段简短的评语（不超过25字）。
               评语要求：
               1. 语气要符合神秘、优雅、略带忧郁的性格。
               2. 如果分数高（80+），表现出对自己终于拥有了表情的深深感激。
               3. 如果分数中等（60-79），表现出对面具的喜爱。
               4. 如果分数低（<60），表现出一种“虽然不太懂，但还是谢谢你”的委婉和困惑。
               请严格以JSON格式返回，格式：{"score": 分数, "feedback": "评语"}`
            : `You are a mysterious, gentle, and slightly lonely "Faceless Man". A player has drawn a mask for you that expresses "${emotion}". Evaluate the mask, give a score from 0-100, and write a short comment (within 25 words) in the persona of the Faceless Man.
               Requirements:
               1. The tone should be mysterious, elegant, and slightly melancholic.
               2. High score (80+): Show deep gratitude for finally having an expression.
               3. Medium score (60-79): Show appreciation for the gift.
               4. Low score (<60): Show a sense of "I don't quite understand, but thank you anyway" confusion.
               Return strictly in JSON format: {"score": score, "feedback": "comment"}`;
        
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta/llama-3.2-90b-vision-instruct',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            { type: 'image_url', image_url: { url: image } }
                        ]
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`NVIDIA API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('NVIDIA API 响应:', JSON.stringify(data, null, 2));
        
        const content = data.choices[0].message.content;
        console.log('解析内容:', content);
        
        // 尝试从响应中提取 JSON
        let result;
        try {
            const jsonMatch = content.match(/\{[^}]*\}/);
            if (jsonMatch) {
                result = JSON.parse(jsonMatch[0]);
            } else {
                // 如果没有找到 JSON，使用正则提取分数
                const scoreMatch = content.match(/\d{1,3}/);
                result = {
                    score: scoreMatch ? parseInt(scoreMatch[0]) : 50,
                    feedback: content.substring(0, 50)
                };
            }
        } catch (e) {
            console.log('JSON 解析失败，使用默认值');
            result = { score: 50, feedback: content.substring(0, 50) };
        }
        
        console.log('最终评分结果:', result);
        console.log('======================================\n');
        
        res.json(result);
        
    } catch (error) {
        console.error('NVIDIA API 调用失败:', error);
        
        // 失败时使用随机评分
        const randomScore = Math.floor(Math.random() * 40) + 30;
        const feedback = lang === 'zh' 
            ? 'API调用失败，使用备用评分' 
            : 'API call failed, using fallback score';
        
        console.log('使用备用评分:', randomScore);
        console.log('======================================\n');
        
        res.json({ score: randomScore, feedback });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`NVIDIA API Key configured: ${!!process.env.NVIDIA_API_KEY}`);
});
