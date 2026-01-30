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
            ? `请评估这张面具图表达"${emotion}"情绪的程度。请给出一个0-100的分数，以及简短的评语（不超过20字）。请以JSON格式返回，格式：{"score": 分数, "feedback": "评语"}`
            : `Please evaluate how well this mask expresses the "${emotion}" emotion. Give a score from 0-100 and a brief comment (within 20 words). Return in JSON format: {"score": score, "feedback": "comment"}`;
        
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
