const CanvasModule = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentColor: '#000000',
    brushSize: 3,
    isEraser: false,
    lastX: 0,
    lastY: 0,
    
    init() {
        this.canvas = document.getElementById('mask-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置初始样式
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // 绘制面具轮廓模板
        this.drawMaskTemplate();
        
        // 绑定事件
        this.bindEvents();
        this.setupTools();
    },
    
    drawMaskTemplate() {
        // 清空画布
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制面具轮廓（虚线）
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.ellipse(200, 180, 140, 160, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制眼睛位置提示
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(150, 160, 30, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(250, 160, 30, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 绘制嘴巴位置提示
        this.ctx.beginPath();
        this.ctx.arc(200, 260, 40, 0, Math.PI, false);
        this.ctx.stroke();
        
        // 重置样式
        this.ctx.setLineDash([]);
    },
    
    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // 触摸事件（移动端支持）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
    },
    
    setupTools() {
        // 颜色选择器
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setColor(btn.dataset.color);
                
                // 更新选中状态
                colorButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 关闭橡皮擦
                if (this.isEraser) {
                    this.toggleEraser();
                }
            });
        });
        
        // 默认选中第一个颜色
        colorButtons[0].classList.add('active');
        
        // 画笔大小
        const brushSizeInput = document.getElementById('brush-size');
        brushSizeInput.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
        });
        
        // 橡皮擦
        const eraserBtn = document.getElementById('eraser-btn');
        eraserBtn.addEventListener('click', () => this.toggleEraser());
        
        // 清空画布
        const clearBtn = document.getElementById('clear-btn');
        clearBtn.addEventListener('click', () => this.clearCanvas());
    },
    
    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },
    
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
        
        // 画一个点
        this.ctx.beginPath();
        this.ctx.arc(coords.x, coords.y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.isEraser ? 'white' : this.currentColor;
        this.ctx.fill();
    },
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoordinates(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.strokeStyle = this.isEraser ? 'white' : this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.stroke();
        
        this.lastX = coords.x;
        this.lastY = coords.y;
    },
    
    stopDrawing() {
        this.isDrawing = false;
    },
    
    setColor(color) {
        this.currentColor = color;
    },
    
    toggleEraser() {
        this.isEraser = !this.isEraser;
        const eraserBtn = document.getElementById('eraser-btn');
        eraserBtn.classList.toggle('active', this.isEraser);
    },
    
    clearCanvas() {
        this.drawMaskTemplate();
    },
    
    getImageData() {
        return this.canvas.toDataURL('image/png');
    },
    
    isCanvasEmpty() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        // 检查是否所有像素都是白色（背景色）
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i] < 250 || pixels[i + 1] < 250 || pixels[i + 2] < 250) {
                return false;
            }
        }
        return true;
    }
};
