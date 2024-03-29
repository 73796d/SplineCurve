export default class CubicBezier {
    constructor(p0?: cc.Vec2, p1?: cc.Vec2, p2?: cc.Vec2, p3?: cc.Vec2) {
        if (!!p0) {
            this.p0 = p0;
        }
        if (!!p1) {
            this.p1 = p1;
        }
        if (!!p2) {
            this.p2 = p2;
        }
        if (!!p3) {
            this.p3 = p3;
        }
    }

    private p0_: cc.Vec2 = cc.Vec2.ZERO;
    private p1_: cc.Vec2 = cc.Vec2.ZERO;
    private p2_: cc.Vec2 = cc.Vec2.ZERO;
    private p3_: cc.Vec2 = cc.Vec2.ZERO;

    public get p0(): cc.Vec2 {
        return this.p0_;
    }
    public set p0(value: cc.Vec2) {
        this.p0_ = value;
    }
    public get p1(): cc.Vec2 {
        return this.p1_;
    }
    public set p1(value: cc.Vec2) {
        this.p1_ = value;
    }

    public get p2(): cc.Vec2 {
        return this.p2_;
    }
    public set p2(value: cc.Vec2) {
        this.p2_ = value;
    }
    public get p3(): cc.Vec2 {
        return this.p3_;
    }
    public set p3(value: cc.Vec2) {
        this.p3_ = value;
    }

    /**
     * 时间t的x坐标
     * @param t 时间
     * x坐标
     */
    b3X(t: number): number {
        let retn: number;
        let oneMinusT = 1 - t;
        let quadraticT = Math.pow(t, 2);
        let cubicT = Math.pow(t, 3);
        let quadraticOMT = Math.pow(oneMinusT, 2);
        let cubicOMT = Math.pow(oneMinusT, 3);

        retn = cubicOMT * this.p0.x + 3 * t * quadraticOMT * this.p1.x + 3 * quadraticT * oneMinusT * this.p2.x + cubicT * this.p3.x;
        return retn;
    }

    /**
     * 时间t的y坐标
     * @param t 时间
     * x坐标
     */
    b3Y(t: number): number {
        let retn: number;
        let oneMinusT = 1 - t;
        let quadraticT = Math.pow(t, 2);
        let cubicT = Math.pow(t, 3);
        let quadraticOMT = Math.pow(oneMinusT, 2);
        let cubicOMT = Math.pow(oneMinusT, 3);

        retn = cubicOMT * this.p0.y + 3 * t * quadraticOMT * this.p1.y + 3 * quadraticT * oneMinusT * this.p2.y + cubicT * this.p3.y;
        return retn;
    }

    getPoint(t: number): cc.Vec2 {
        let x: number, y: number;
        let oneMinusT = 1 - t;
        let quadraticT = Math.pow(t, 2);
        let cubicT = Math.pow(t, 3);
        let quadraticOMT = Math.pow(oneMinusT, 2);
        let cubicOMT = Math.pow(oneMinusT, 3);

        x = cubicOMT * this.p0.x + 3 * t * quadraticOMT * this.p1.x + 3 * quadraticT * oneMinusT * this.p2.x + cubicT * this.p3.x;
        y = cubicOMT * this.p0.y + 3 * t * quadraticOMT * this.p1.y + 3 * quadraticT * oneMinusT * this.p2.y + cubicT * this.p3.y;
        return cc.v2(x, y);
    }

    getFirstDerivative(t: number): cc.Vec2 {
        let x: number, y: number;
        let oneMinusT = 1 - t;
        let quadraticT = Math.pow(t, 2);
        let quadraticOMT = Math.pow(oneMinusT, 2);

        x = 3 * quadraticOMT * (this.p1.x - this.p0.x) + 6 * oneMinusT * t * (this.p2.x - this.p1.x) + 3 * quadraticT * (this.p3.x - this.p2.x);
        y = 3 * quadraticOMT * (this.p1.y - this.p0.y) + 6 * oneMinusT * t * (this.p2.y - this.p1.y) + 3 * quadraticT * (this.p3.y - this.p2.y);
        return cc.v2(x, y);
    }

    getVelocity(t: number): cc.Vec2 {
        return this.getFirstDerivative(t);
    }

    getDirection(t: number) {
        let vel = this.getVelocity(t);
        return vel.normalize();
    }

    /**
     * 求t时刻的真实时间
     * @param t 时间 
     * @returns 真实时间
     */
    t2rt(t: number) {
        let realTime: number, deltaTime: number;
        let bezierX: number;

        let x = this.p0.x + (this.p3.x - this.p0.x) * t;
        realTime = 1;
        deltaTime = 0.0;

        do {
            if (deltaTime > 0) {
                realTime -= realTime / 2;
            } else {
                realTime += realTime / 2;
            }

            bezierX = this.b3X(realTime);
            deltaTime = bezierX - x;
        } while (deltaTime > 0.0000001);
        return realTime;
    }

    t2rt2(t: number) {
        let totalLength = this.length(1);
        let len = t * totalLength;
        let t1 = t, t2: any;
        let dt: number;

        do {
            t2 = t1 - (this.length(t1) - len) / this.bezeSpeed(t1);
            dt = Math.abs(t1 - t2);
            if (dt < 0.00001) {
                break;
            }
            t1 = t2;
        } while (true);

        return t2;
    }

    invert(t: number, l: number) {
        let t1 = t, t2: number;
        do {
            t2 = t1 - (this.length(t1) - l) / this.bezeSpeed(t1);
            if (Math.abs(t1 - t2) < 0.00001) break;
            t1 = t2;
        } while (true);
        return t2;
    }

    /**
     * 求t时间的曲线长度
     * @param t 时间
     * @returns 曲线长度
     */
    length(t: number) {
        let TOTAL_SIMPSON_STEP: number = 100000;
        let stepCounts: number = TOTAL_SIMPSON_STEP * t;
        let halfCounts: number;
        let i = 0;
        let sum1 = 0, sum2 = 0, dStep: number;

        if (stepCounts === 0) {
            return 0;
        }
        if (stepCounts % 2 === 0) { // 偶数
            stepCounts++;
        }

        halfCounts = stepCounts / 2;
        dStep = t / stepCounts;

        while (i < halfCounts) {
            sum1 += this.bezeSpeed((2 * i + 1) * dStep);
            i++;
        }
        i = 1;
        while (i < halfCounts) {
            sum2 += this.bezeSpeed(2 * i * dStep);
            i++;
        }
        return ((this.bezeSpeed(0) + this.bezeSpeed(1) + 2 * sum2 + 4 * sum1) * dStep / 3);
    }

    /**
     * 求x方向速度分量
     * @param t 时间
     * @returns x方向速度分量
     */
    bezeSpeedX(t: number) {
        let oneMinusT = 1 - t;
        let quadraticT = Math.pow(t, 2);
        let quadraticOMT = Math.pow(oneMinusT, 2);
        return -3 * this.p0.x * quadraticOMT + 3 * this.p1.x * quadraticOMT - 6 * this.p1.x * oneMinusT * t + 6 * this.p2.x * oneMinusT * t - 3 * this.p2.x * quadraticT + 3 * this.p3.x * quadraticT;
    }

    /**
     * 求y方向速度分量
     * @param t 时间
     * @returns y方向速度分量 
     */
    bezeSpeedY(t: number) {
        let oneMinusT = 1 - t;
        let quadraticT = Math.pow(t, 2);
        let quadraticOMT = Math.pow(oneMinusT, 2);
        return -3 * this.p0.y * quadraticOMT + 3 * this.p1.y * quadraticOMT - 6 * this.p1.y * oneMinusT * t + 6 * this.p2.y * oneMinusT * t - 3 * this.p2.y * quadraticT + 3 * this.p3.y * quadraticT;
    }

    /**
     * 求速度
     * @param t 时间
     * @returns 速度
     */
    bezeSpeed(t: number) {
        let vx = this.bezeSpeedX(t);
        let vy = this.bezeSpeedY(t);
        return Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
    }
}
