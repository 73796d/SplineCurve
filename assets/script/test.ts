import BaseDraw from "./basedraw";
import CubicBezier from "./cubicbezier";
import Global from "./global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends BaseDraw {

    @property(cc.Prefab)
    point: cc.Prefab = null;

    bezierList: Array<CubicBezier> = new Array();

    start() {
        // this.clearDraw()
        // this.drawLine(cc.v2(0, 0), cc.v2(-300, -300), cc.Color.GREEN, 2);
        // this.drawCirclePoint(cc.v2(100, 10), cc.Color.RED, 6, true);
        // this.drawCirclePoint(cc.v2(100, 40), cc.Color.GREEN, 6, false);
        // this.drawRectPoint(cc.v2(100, 80), cc.Color.RED, 7, true);
        // this.drawRectPoint(cc.v2(100, 120), cc.Color.RED, 7, false);
        this.drawBezierCurve(cc.v2(-640, -300), cc.v2(-640, 300), cc.v2(640, 300), cc.v2(640, -300));
    }
    onLoad() {
        super.onLoad();
        Global.eventListener.on("DRAG_MOVE", (pos: cc.Vec2) => {
            cc.log(pos);
        })
    }

    drawBezierCurve(p0: cc.Vec2, p1: cc.Vec2, p2: cc.Vec2, p3: cc.Vec2) {
        let cubicbezier = new CubicBezier(p0, p1, p2, p3);
        this.bezierList.push(cubicbezier);

        let len = cubicbezier.length(1);

        let t1 = cubicbezier.t2rt(0.2);
        let t2 = cubicbezier.t2rt2(0.2);

        this.graphics.moveTo(p0.x, p0.y);
        this.graphics.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        this.graphics.stroke();
        this.drawLine(p0, p1, cc.Color.GREEN, 2);
        this.drawLine(p2, p3, cc.Color.GREEN, 2);

        let point = cc.instantiate(this.point);
        point.position = p0;
        point.parent = this.node;
        point = cc.instantiate(this.point);
        point.position = p3;
        point.parent = this.node;
        point = cc.instantiate(this.point);
        point.position = p1;
        point.parent = this.node;
        point = cc.instantiate(this.point);
        point.setPosition(p2);
        point.parent = this.node;


        let fd = cubicbezier.getFirstDerivative(0.5);
        let d = cubicbezier.getVelocity(0.5);
        let v = cubicbezier.getDirection(0.5);

        len = Math.floor(cubicbezier.length(1));
        for (let j = 0; j < 100; j += 1) {
            let t = j / 100;
            const l = t * len;
            t = cubicbezier.invert(t, l);

            let point = cubicbezier.getPoint(t);
            let color = cc.color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
            this.drawCirclePoint(point, color, 8, true);
        }
    }
}
