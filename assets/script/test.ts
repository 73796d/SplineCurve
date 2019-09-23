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
        this.drawPoint();
        this.drawLine();
    }
    drawPoint() {
        this.graphics.circle(0, 0, 6);
        this.graphics.fillColor = cc.Color.YELLOW;
        this.graphics.fill();
        this.graphics.stroke();
    }

    drawLine() {
        this.graphics.lineWidth = 3;
        this.graphics.strokeColor = cc.Color.GREEN;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
        this.graphics.moveTo(100, 100);
        this.graphics.lineTo(300, 300);
        this.graphics.stroke();
    }


    clearDraw() {
        this.graphics.clear();
    }

    // update (dt) {}
}
