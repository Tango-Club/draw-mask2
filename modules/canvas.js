const CanvasModule = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentColor: '#000000',
    brushSize: 3,
    isEraser: false,
    lastX: 0,
    lastY: 0,
    
    templateCanvas: null,
    templateCtx: null,
    
    init() {
        this.canvas = document.getElementById('mask-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.templateCanvas = document.getElementById('template-canvas');
        this.templateCtx = this.templateCanvas.getContext('2d');
        
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
        // 清空主画布（背景色）
        this.ctx.fillStyle = '#f0e6d3';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 清空模板画布
        this.templateCtx.clearRect(0, 0, this.templateCanvas.width, this.templateCanvas.height);
        
        // 绘制面具轮廓（虚线）到模板画布
        this.templateCtx.strokeStyle = '#d4c4a8';
        this.templateCtx.lineWidth = 2;
        this.templateCtx.setLineDash([10, 10]);
        this.templateCtx.beginPath();
        this.templateCtx.ellipse(200, 180, 140, 160, 0, 0, Math.PI * 2);
        this.templateCtx.stroke();
        
        // 绘制眼睛位置提示到模板画布
        this.templateCtx.setLineDash([5, 5]);
        this.templateCtx.beginPath();
        this.templateCtx.arc(150, 160, 30, 0, Math.PI * 2);
        this.templateCtx.stroke();
        this.templateCtx.beginPath();
        this.templateCtx.arc(250, 160, 30, 0, Math.PI * 2);
        this.templateCtx.stroke();
        
        // 绘制嘴巴位置提示到模板画布
        this.templateCtx.beginPath();
        this.templateCtx.arc(200, 260, 40, 0, Math.PI, false);
        this.templateCtx.stroke();
        
        // 重置样式
        this.templateCtx.setLineDash([]);
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
        this.ctx.fillStyle = this.isEraser ? '#f0e6d3' : this.currentColor;
        this.ctx.fill();
    },
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoordinates(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.strokeStyle = this.isEraser ? '#f0e6d3' : this.currentColor;
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
        // 创建一个临时画布用于裁切
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 400;
        tempCanvas.height = 400;
        const tCtx = tempCanvas.getContext('2d');

        // 1. 在临时画布上绘制一个椭圆路径（与模板一致）
        tCtx.beginPath();
        tCtx.ellipse(200, 180, 140, 160, 0, 0, Math.PI * 2);
        
        // 2. 开启裁切
        tCtx.clip();

        // 3. 将原画布内容画到临时画布上（只有椭圆内会被留下，其余透明）
        tCtx.drawImage(this.canvas, 0, 0);

        // 4. 返回这个已经“抠好图”的 base64
        return tempCanvas.toDataURL('image/png');
    },
    
    isCanvasEmpty() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        
        // 背景色为 #f0e6d3 (240, 230, 211)
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // 如果像素颜色与背景色有显著差异
            if (Math.abs(r - 240) > 10 || Math.abs(g - 230) > 10 || Math.abs(b - 211) > 10) {
                return false;
            }
        }
        return true;
    }
};
