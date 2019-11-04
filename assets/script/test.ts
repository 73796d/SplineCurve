import BaseDraw from "./basedraw";
import PointMgr from "./pointmgr";
import BezierNode from "./beziernode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends BaseDraw {
    pointMgr:PointMgr = null; // 点管理器
    bezierNodeList: Array<BezierNode> = new Array();

    onLoad() {
        super.onLoad();
        this.pointMgr = cc.find("Canvas/PointMgr").getComponent(PointMgr);
        // Global.eventListener.on("DRAG_MOVE", (pos: cc.Vec2) => {
        //     cc.log(pos);
        // })

        this.addBezeerNode();
        this.addBezeerNode();
    }

    addBezeerNode() {
        let len = this.bezierNodeList.length;
        if (len == 0) {
            let p0 = this.pointMgr.createPoint();
            let p1 = this.pointMgr.createPoint();
            let p2 = this.pointMgr.createPoint();
            let p3 = this.pointMgr.createPoint();
            let bezierNode = new BezierNode(p0, p1, p2, p3);
            this.bezierNodeList.push(bezierNode);

            this.node.addChild(p0);
            this.node.addChild(p1);
            this.node.addChild(p2);
            this.node.addChild(p3);
        } else {
            let lastBezierNode = this.bezierNodeList[len - 1];
            let p0 = lastBezierNode.p3;
            let p1 = this.pointMgr.createPoint();
            let p2 = this.pointMgr.createPoint();
            let p3 = this.pointMgr.createPoint();
            let bezierNode = new BezierNode(p0, p1, p2, p3);
            this.bezierNodeList.push(bezierNode);

            this.node.addChild(p1);
            this.node.addChild(p2);
            this.node.addChild(p3);
        }
    }

    update(dt) {
        this.clearDraw()
        for (const i in this.bezierNodeList) {
            if (this.bezierNodeList.hasOwnProperty(i)) {
                let bezierNode = this.bezierNodeList[i];
                bezierNode.updatePosition(dt);

                this.setStrokeColor(cc.Color.RED);
                this.setFillColor(cc.Color.RED);
                this.setLineWidth(2);
                this.drawBezierCurve(bezierNode.p0p, bezierNode.p1p, bezierNode.p2p, bezierNode.p3p);
                this.drawLine(bezierNode.p0p, bezierNode.p1p, cc.Color.GREEN, 2);
                this.drawLine(bezierNode.p2p, bezierNode.p3p, cc.Color.GREEN, 2);
            }
        }

    }

    //drawBezierCurve(p0: cc.Vec2, p1: cc.Vec2, p2: cc.Vec2, p3: cc.Vec2) {
        // let cubicbezier = new CubicBezier(p0, p1, p2, p3);
        // this.bezierList.push(cubicbezier);

        // let len = cubicbezier.length(1);

        // let t1 = cubicbezier.t2rt(0.2);
        // let t2 = cubicbezier.t2rt2(0.2);

        // this.graphics.moveTo(p0.x, p0.y);
        // this.graphics.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        // this.graphics.stroke();
        // this.drawLine(p0, p1, cc.Color.GREEN, 2);
        // this.drawLine(p2, p3, cc.Color.GREEN, 2);

        // let point = cc.instantiate(this.point);
        // point.position = p0;
        // point.parent = this.node;
        // point = cc.instantiate(this.point);
        // point.position = p3;
        // point.parent = this.node;
        // point = cc.instantiate(this.point);
        // point.position = p1;
        // point.parent = this.node;
        // point = cc.instantiate(this.point);
        // point.setPosition(p2);
        // point.parent = this.node;


        // let fd = cubicbezier.getFirstDerivative(0.5);
        // let d = cubicbezier.getVelocity(0.5);
        // let v = cubicbezier.getDirection(0.5);

        // len = Math.floor(cubicbezier.length(1));
        // for (let j = 0; j < 100; j += 1) {
        //     let t = j / 100;
        //     const l = t * len;
        //     t = cubicbezier.invert(t, l);

        //     let point = cubicbezier.getPoint(t);
        //     let color = cc.color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
        //     this.drawCirclePoint(point, color, 8, true);
        // }
    // }
}
