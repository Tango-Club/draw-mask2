---
title: Faceless Mask Drawing Game
emoji: 🎭
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
---

# 无面人面具绘制游戏


一个简单的网页游戏。用户为一个孤独、神秘的“无面人”绘制表达特定情绪的面具。AI（NVIDIA Vision API）将扮演无面人，根据情绪契合度给出感性的评分与评语。

## 🌟 核心特色

- **感性 AI 评价**：集成 NVIDIA Vision API (Llama 3.2 Vision)，AI 以“无面人”的神秘口吻给出沉浸式评价。
- **动态面具佩戴**：玩家提交作品后，面具会通过 Canvas 实时裁切并完美贴合在角色脸上。
- **纯粹视觉体验**：无面人初始状态完全空白，所有的表情与灵魂都由玩家的画笔赋予。
- **丝滑绘图系统**：支持多色选择、笔触调节、橡皮擦，并具备移动端触摸优化。
- **双层画布架构**：绘图层与模板提示层分离，确保导出的面具图片不包含辅助虚线。

## 🛠 技术栈

- **前端**：Vanilla JavaScript (ES6+), CSS3 (Flexbox/Grid/Animations), HTML5 Canvas
- **后端**：Node.js + Express.js
- **模型**：[meta/llama-3.2-90b-vision-instruct](https://build.nvidia.com/meta/llama-3_2-90b-vision-instruct)
- **部署**：支持 Docker, Vercel, Hugging Face Spaces

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件（已包含在项目中）：

```
NVIDIA_API_KEY=your_api_key_here
PORT=3000
```

获取 NVIDIA API Key：https://build.nvidia.com/

### 启动服务器

```bash
npm start
```

访问 http://localhost:3000

### 静态开发服务器（无 API）

```bash
npm run dev
```

访问 http://localhost:8080

## 游戏玩法

1. 点击"开始游戏"按钮
2. 无面人会给出一个情绪需求（如"快乐"、"悲伤"等）
3. 在画布上绘制表达该情绪的面具
4. 使用颜色选择器、画笔粗细调整和橡皮擦
5. 点击"提交作品"
6. AI 评分你的作品并给出反馈
7. 根据分数，无面人会做出不同的反应：
   - 80分以上：戴上面具并跳舞
   - 60-79分：戴上面具并点头
   - 60分以下：摇头
8. 点击"再玩一次"继续游戏

## 项目结构

```
draw-mask/
├── index.html              # 主页面
├── style.css               # 样式文件
├── script.js               # 主游戏逻辑
├── server.js               # Express API 服务器
├── package.json            # NPM 配置
├── .env                    # 环境变量（不提交）
├── .env.example            # 环境变量模板
├── modules/
│   ├── i18n.js             # 国际化（中英文）
│   ├── canvas.js           # Canvas 绘图功能
│   ├── character.js        # 无面人角色动画
│   ├── ai.js               # AI/API 集成
│   └── scoring.js          # 备用评分算法
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 部署
```

## API 端点

| 端点 | 方法 | 用途 |
|------|------|------|
| `/api/demand` | POST | 获取回合的情绪需求 |
| `/api/vision-score` | POST | 使用 AI 评分绘制的面具 |

请求/响应格式：JSON，包含 `lang` 字段（'zh' 或 'en'）。

## 评分逻辑

游戏使用多层评分系统：

1. **AI 评分（首选）**：NVIDIA Vision API 分析面具图像和情绪匹配度
2. **备用算法**：当 API 不可用时，基于绘图特征分析
   - 绘制覆盖率
   - 使用的颜色数量
   - 笔画复杂度

## 开发说明

### Canvas 操作
使用 `CanvasModule` 进行所有绘图功能

### 角色动画
使用 `CharacterModule` 获取视觉反馈

### API 调用
使用 `AIModule` 作为后端 API 的接口

### 评分
AI 评分优先；备用时使用 `ScoringModule` 算法

### 状态管理
使用 `script.js` 中的简单布尔标志跟踪游戏状态

### DOM 选择
使用 `document.getElementById()` 访问元素

## 注意事项

- 这是一个游戏 jam 项目 - 优先考虑实用的代码而非完美的架构
- 触摸事件与鼠标事件一起支持移动端
- 面具画布为 400x400 像素
- 分数范围：0-100
- 角色反应：80+ = 跳舞，60-79 = 点头，<60 = 摇头

## License

ISC
