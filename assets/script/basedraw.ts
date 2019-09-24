const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseDraw extends cc.Component {
    private graphics_: cc.Graphics; // undefined
    
    /// getter, setter
    public get graphics(): cc.Graphics {
        return this.graphics_;
    }
    public set graphics(value: cc.Graphics) {
        this.graphics_ = value;
    }

    onLoad () {
        if (!this.graphics) {
            this.graphics = this.addComponent(cc.Graphics);
        } else {
            this.graphics = this.getComponent(cc.Graphics);
        }  
    }

    /**
     * 设置线条的结束端样式
     * @param lineCap 
     */
    setLineCap(lineCap: cc.Graphics.LineCap) {
        this.graphics.lineCap = lineCap;
    }

    /**
     * 设置两条线相交时的拐角类型
     * @param lineJoin 
     */
    setLineJoin(lineJoin: cc.Graphics.LineJoin) {
        this.graphics.lineJoin = lineJoin;
    }

    /**
     * 设置当前线条的宽度
     * @param width 
     */
    setLineWidth(width: number) {
        this.graphics.lineWidth = width;
    }

    // 笔触颜色
    setStrokeColor(color: cc.Color) {
        this.graphics.strokeColor = color;
    }

    // 设置填充颜色
    setFillColor(color: cc.Color) {
        this.graphics.fillColor = color;
    }

    // 画圆形点
    drawCirclePoint(p0: cc.Vec2, color: cc.Color, size: number, isFill: boolean) {
        this.setStrokeColor(color);
        this.graphics.circle(p0.x, p0.y, size);
        this.graphics.stroke();
        if ( isFill ) {
            this.setFillColor(color);
            this.graphics.fill();
        }
    }

    /**
     * 画矩形点
     */
    drawRectPoint(p0: cc.Vec2, color: cc.Color, size: number, isFill: boolean) {
        this.setStrokeColor(color);
        this.graphics.rect(p0.x, p0.y, size, size);
        this.graphics.stroke();
        if ( isFill ) {
            this.setFillColor(color);
            this.graphics.fill();
        }
    }

    drawLine(p0: cc.Vec2, p1: cc.Vec2, color: cc.Color, width: number) {
        this.setLineWidth(width);
        this.setStrokeColor(color);
        this.setLineCap(cc.Graphics.LineCap.BUTT);
        this.graphics.moveTo(p0.x, p0.y);
        this.graphics.lineTo(p1.x, p1.y);
        this.graphics.stroke();
    }

    /**
     * 绘制三次贝塞尔曲线
     * @param p0 起点
     * @param p1 控制点1
     * @param p2 控制点2
     * @param p3 终点
     */
    drawBezierCurve(p0: cc.Vec2, p1: cc.Vec2, p2:  cc.Vec2, p3:  cc.Vec2) {
        this.graphics.moveTo(p0.x, p0.y);
        this.graphics.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        this.graphics.stroke();
    }

    /**
     * 清除绘画内容
     */
    clearDraw() {
        this.graphics.clear();
    }
}
