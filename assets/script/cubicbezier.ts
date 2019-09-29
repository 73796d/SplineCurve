export default class CubicBezier {
    constructor(p0?: cc.Vec2, p1?: cc.Vec2, p2?: cc.Vec2, p3?: cc.Vec2) {
        if (!p0) {
            this.p0 = p0;
        }
        if (!p1) {
            this.p1 = p1;
        }
        if (!p0) {
            this.p2 = p2;
        }
        if (!p0) {
            this.p3 = p3;
        }
    }

    private p0_: cc.Vec2 = cc.Vec2.ZERO;
    public get p0(): cc.Vec2 {
        return this.p0_;
    }
    public set p0(value: cc.Vec2) {
        this.p0_ = value;
    }
    private p1_: cc.Vec2 = cc.Vec2.ZERO;
    public get p1(): cc.Vec2 {
        return this.p1_;
    }
    public set p1(value: cc.Vec2) {
        this.p1_ = value;
    }
    private p2_: cc.Vec2 = cc.Vec2.ZERO;
    public get p2(): cc.Vec2 {
        return this.p2_;
    }
    public set p2(value: cc.Vec2) {
        this.p2_ = value;
    }
    private p3_: cc.Vec2 = cc.Vec2.ZERO;
    public get p3(): cc.Vec2 {
        return this.p3_;
    }
    public set p3(value: cc.Vec2) {
        this.p3_ = value;
    }
}
