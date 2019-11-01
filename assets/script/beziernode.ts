import BaseDraw from "./basedraw";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BezierNode extends BaseDraw {

    @property(cc.Sprite)
    P0: cc.Sprite = null;

    @property(cc.Sprite)
    P1: cc.Sprite = null;

    @property(cc.Sprite)
    P2: cc.Sprite = null;

    @property(cc.Sprite)
    P3: cc.Sprite = null;

    update (dt) {
        let p0p = this.P0.node.position;
        let p1p = this.P1.node.position;
        let p2p = this.P2.node.position;
        let p3p = this.P3.node.position;

        this.clearDraw()
        this.setStrokeColor(cc.Color.RED);
        this.setFillColor(cc.Color.RED);
        this.setLineWidth(2);
        this.drawBezierCurve(p0p, p1p, p2p, p3p);
        this.drawLine(p0p, p1p, cc.Color.GREEN, 2);
        this.drawLine(p2p, p3p, cc.Color.GREEN, 2);
        

    }
}
