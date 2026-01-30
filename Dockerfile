# 使用 Node.js 官方镜像
FROM node:20

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目所有文件
COPY . .

# 暴露端口（Hugging Face Spaces 默认使用 7860）
EXPOSE 7860

# 设置环境变量映射（Hugging Face 默认端口是 7860）
ENV PORT=7860

# 启动应用
CMD ["npm", "start"]
