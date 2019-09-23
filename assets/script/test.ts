const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {
    private graphics_: cc.Graphics;
    public get graphics(): cc.Graphics {
        return this.graphics_;
    }
    public set graphics(value: cc.Graphics) {
        this.graphics_ = value;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (!this.graphics) {
            this.graphics = this.addComponent(cc.Graphics);
        } else {
            this.graphics = this.getComponent(cc.Graphics);
        }  
    }

    start () {
        this.clearDraw()
        this.drawLine(cc.v2(0, 0), cc.v2(300, 300));
        this.drawPoint();
    }
    drawPoint() {
        this.graphics.fillColor.fromHEX("#ff0000");
        // = cc.Color.YELLOW;
        this.graphics.circle(300, 300, 6);
        this.graphics.stroke();
        this.graphics.fill();
    }

    drawLine(p0: cc.Vec2, p1: cc.Vec2) {
        this.graphics.lineWidth = 3;
        this.graphics.strokeColor = cc.Color.GREEN;
        this.graphics.fillColor = cc.Color.GREEN;
        this.graphics.lineCap = cc.Graphics.LineCap.BUTT;
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.graphics.moveTo(p0.x, p0.y);
        this.graphics.lineTo(p1.x, p1.y);
        this.graphics.stroke();
        this.graphics.fill();
    }


    clearDraw() {
        this.graphics.clear();
    }

    // update (dt) {}
}
