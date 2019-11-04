import CubicBezier from "./cubicbezier";

export default class BezierNode {
    p0: cc.Node = null;
    p1: cc.Node = null;
    p2: cc.Node = null;
    p3: cc.Node = null;

    p0p:cc.Vec2 = cc.Vec2.ZERO;
    p1p:cc.Vec2 = cc.Vec2.ZERO;
    p2p:cc.Vec2 = cc.Vec2.ZERO;
    p3p:cc.Vec2 = cc.Vec2.ZERO;

    cubicBezier: CubicBezier = null;

    public constructor(p0: cc.Node, p1: cc.Node, p2: cc.Node, p3: cc.Node) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.cubicBezier = new CubicBezier();
    }

    updatePosition (dt) {
        this.p0p = this.p0.position;
        this.p1p = this.p1.position;
        this.p2p = this.p2.position;
        this.p3p = this.p3.position;
        this.cubicBezier.p0 = this.p0p;
        this.cubicBezier.p1 = this.p1p;
        this.cubicBezier.p2 = this.p2p;
        this.cubicBezier.p3 = this.p3p;

    }

    getLength(t){
        return this.cubicBezier.length(t);
    }
}
