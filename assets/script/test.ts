import BaseDraw from "./basedraw";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends BaseDraw {
    start () {
        this.clearDraw()
        this.drawLine(cc.v2(0, 0), cc.v2(-300, -300), cc.Color.GREEN, 2);
        this.setLineCap(cc.Graphics.LineCap.BUTT);
        this.setLineJoin(cc.Graphics.LineJoin.MITER);
        this.drawCirclePoint(cc.v2(100, 10), cc.Color.RED, 6, true);
        this.drawCirclePoint(cc.v2(100, 40), cc.Color.GREEN, 6, false);
        this.drawRectPoint(cc.v2(100, 80), cc.Color.RED, 7, true);
        this.drawRectPoint(cc.v2(100, 120), cc.Color.RED, 7, false);
        this.drawBezierCurve(cc.v2(0, 0), cc.v2(100, 0), cc.v2(0,200), cc.v2(400, 100));
    }
}
