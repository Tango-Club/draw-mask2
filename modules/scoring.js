const ScoringModule = {
    analyzeCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        let nonWhitePixels = 0;
        const colors = new Set();
        
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // 检查是否非白色（考虑模板的浅灰色）
            if (r < 245 || g < 245 || b < 245) {
                nonWhitePixels++;
                colors.add(`${r},${g},${b}`);
            }
        }
        
        // 计算覆盖率（排除模板的影响）
        const coverage = Math.min(nonWhitePixels / 10000, 1);
        
        // 计算使用的颜色数量
        const colorCount = Math.min(colors.size, 10);
        
        return {
            coverage,
            colorCount,
            hasDrawing: nonWhitePixels > 100
        };
    },
    
    calculateBaseScore(analysis) {
        if (!analysis.hasDrawing) {
            return 0;
        }
        
        // 基础分数：覆盖率占 60%，颜色数量占 40%
        let score = 0;
        score += analysis.coverage * 60;
        score += (analysis.colorCount / 10) * 40;
        
        return Math.min(Math.round(score), 100);
    },
    
    combineScores(aiScore, baseScore) {
        // 如果 AI 评分成功，主要使用 AI 评分，但结合基础分析
        // 如果 AI 评分失败（分数为 null），完全使用基础评分
        
        if (aiScore !== null && aiScore !== undefined) {
            // 80% AI 评分，20% 基础评分
            return Math.round(aiScore * 0.8 + baseScore * 0.2);
        } else {
            return baseScore;
        }
    }
};
