import BaseDraw from "./basedraw";
import PointMgr from "./pointmgr";
import BezierNode from "./beziernode";
import Global, { ControlMode } from "./global";
import CubicBezier from "./cubicbezier";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Test extends BaseDraw {
    @property(cc.Node)
    frame: cc.Node = null;

    pointMgr:PointMgr = null; // 点管理器
    bezierNodeList: Array<BezierNode> = new Array();
    time: number = 0;
    playTime: number = 20;
    isPlay: boolean = false;

    totalLength: number = 0;
    lineLengthList: Array<number> = new Array();

    pointList: Array<cc.Vec2> = new Array();
    isAddPoint: boolean = false;

    onLoad() {
        super.onLoad();
        this.pointMgr = cc.find("Canvas/PointMgr").getComponent(PointMgr);
        Global.eventListener.on("ADD_SPLINE", () => {
            this.isPlay = false;
            this.isAddPoint = false;
            this.pointList.length = 0;
            this.addBezierNode();
        });
        Global.eventListener.on("DELETE_SPLINE", () => {
            this.isPlay = false;
            this.isAddPoint = false;
            this.pointList.length = 0;
            this.removeBezierNode();
        });
        Global.eventListener.on("DELETE_ALL_SPLINE", () => {
            this.isPlay = false;
            this.isAddPoint = false;
            this.pointList.length = 0;
            while (this.bezierNodeList.length > 0) {
                this.removeBezierNode();
            }
        });
        Global.eventListener.on("EDITOR_SCALE_SMALL", () => {
            let scale = this.node.scale;
            this.node.scale = scale * 0.5;
            this.frame.scale = scale * 0.5;
        });
        Global.eventListener.on("EDITOR_SCALE_BIG", () => {
            let scale = this.node.scale;
            this.node.scale = scale * 2;
            this.frame.scale = scale * 2;
        });
        Global.eventListener.on("EDITOR_SCALE_RESTORE", () => {
            this.node.scale = 1;
            this.frame.scale = 1;
            this.node.position = cc.v2(0, 0);
            this.frame.position = cc.v2(0, 0);
        });
        Global.eventListener.on("ARROW_L", () => {
            let pos = this.node.position;
            this.node.position = pos.add(cc.v2(-1, 0));
            this.frame.position = pos.add(cc.v2(-1, 0));
        });
        Global.eventListener.on("ARROW_U", () => {
            let pos = this.node.position;
            this.node.position = pos.add(cc.v2(0, 1));
            this.frame.position = pos.add(cc.v2(0, 1));
        });
        Global.eventListener.on("ARROW_R", () => {
            let pos = this.node.position;
            this.node.position = pos.add(cc.v2(1, 0));
            this.frame.position = pos.add(cc.v2(1, 0));
        });
        Global.eventListener.on("ARROW_D", () => {
            let pos = this.node.position;
            this.node.position = pos.add(cc.v2(0, -1));
            this.frame.position = pos.add(cc.v2(0, -1));
        });
        Global.eventListener.on("PLAY", () => {
            if (this.bezierNodeList.length === 0) {return}
            this.isPlay = true;
            this.totalLength = 0;
            this.lineLengthList.splice(0, this.lineLengthList.length) ;
            for (let index = 0; index < this.bezierNodeList.length; index++) {
                let bezierNode = this.bezierNodeList[index];
                let len = bezierNode.getLength(1);
                this.totalLength += len;
                this.lineLengthList[index] = len;
            }
            this.isAddPoint = true;
            this.time = 0;
        });
        Global.eventListener.on("STOP", () => {
            this.isAddPoint = false;
            this.pointList.length = 0;
            this.isPlay = false;
        });
        Global.eventListener.on("CLICK_SAVE", (data) => {
            if (data === "path") {
                let pointList: Array<cc.Vec2> = new Array();
                for (let i = 0; i < this.pointList.length; i++) {
                    let point = this.pointList[i];
                    let newPoint = new cc.Vec2(parseFloat(point.x.toFixed(2)), parseFloat(point.y.toFixed(2)));
                    pointList.push(newPoint);
                }
                Global.eventListener.fire("SAVE", JSON.stringify(pointList));
            } else if (data === "ctrl") {
                let bezierList  = [];
                for (let i = 0; i < this.bezierNodeList.length; i++) {
                    let bezierNode = this.bezierNodeList[i];
                    let bezier = {
                        p0: bezierNode.p0p,
                        p1: bezierNode.p1p,
                        p2: bezierNode.p2p,
                        p3: bezierNode.p3p
                    };
                    bezierList.push(bezier);
                }
                Global.eventListener.fire("SAVE", JSON.stringify(bezierList));
            }
        });
        Global.eventListener.on("SET_CHANGE_PLAY_TIME", (time: number) => {
            this.playTime = time;
        });
        Global.eventListener.on("CONTROL_MODE_CHANGE", () => {
            this.isAddPoint = false;
            this.isPlay = false;
            this.pointList.length = 0;
            let len = this.bezierNodeList.length;
            if (len > 0) {
                let firstBezierNode = this.bezierNodeList[0];
                let lastBezierNode = this.bezierNodeList[len - 1];
                if (Global.controlMode === ControlMode.CLOSE) {
                    this.pointMgr.deletePoint(lastBezierNode.p3);
                    lastBezierNode.p3 = firstBezierNode.p0;
                } else {
                    if (lastBezierNode.p3.name === firstBezierNode.p0.name) {
                        let p3 = this.pointMgr.createPoint();
                        let index = len * 3;
                        p3.name = "Node" + index;
                        p3.position = firstBezierNode.p0.position;
                        this.node.addChild(p3);
                        lastBezierNode.p3 = p3;
                    }
                }
            }
        });
        Global.eventListener.on("DRAG_START", (name: string) => {
            cc.log("-----------DRAG_START-----------");
            // name: NodeXXX
            let index = Number(name.substring(4));
            let len = this.bezierNodeList.length;
            if (index === 0) { // 第一个端点
                cc.log(0);
            } else if (index > 0 && index % 3 === 0) { // 端点
                let bezierIndex1 = index / 3 - 1;
                let bezierIndex2 = index / 3;
                if (len === bezierIndex2) { // 最后的端点
                    cc.log(bezierIndex1);
                } else {
                    cc.log(bezierIndex1);
                    cc.log(bezierIndex2);
                }
            } else if (index > 0 && index % 3 != 0) { // 控制点
                let bezierIndex = Math.floor(index / 3);
                cc.log(bezierIndex);
            }
            
        });
        Global.eventListener.on("DRAG_MOVE", (name: string) => {
            this.isAddPoint = false;
            this.isPlay = false;
            this.pointList.length = 0;
            // name: NodeXXX
            let index = Number(name.substring(4));
            let len = this.bezierNodeList.length;
            if (index === 0) { // 第一个点
                cc.log(0);
            } else if (index > 0 && index % 3 === 0) { // 端点
                let bezierIndex1 = index / 3 - 1;
                let bezierIndex2 = index / 3;
                if (len === bezierIndex2) { // 最后的端点
                    cc.log(bezierIndex1);
                } else {
                    cc.log(bezierIndex1);
                    cc.log(bezierIndex2);
                }
            } else if (index > 0 && index % 3 != 0) { // 控制点
                let bezierIndex = Math.floor(index / 3);
                let indexOfBezier = index % 3;
                cc.log(bezierIndex);
                if (len > 1) {
                    if ( index > 1 && index < (len * 3 - 1)) {
                        let currBezierNode = this.bezierNodeList[bezierIndex];
                        let movePoint: cc.Node = null;
                        let middlePoint: cc.Node = null;
                        let currPoint: cc.Node = null;
                        if (indexOfBezier === 1) {
                            let lastBezierNode = this.bezierNodeList[bezierIndex - 1];
                            movePoint = lastBezierNode.p2;
                            middlePoint = currBezierNode.p0;
                            currPoint = currBezierNode.p1;
                        } else if (indexOfBezier === 2) {
                            let nextBezierNode = this.bezierNodeList[bezierIndex + 1];
                            movePoint = nextBezierNode.p1;
                            middlePoint = currBezierNode.p3;
                            currPoint = currBezierNode.p2;
                        }
                        if (movePoint && middlePoint) {
                            let currVec: cc.Vec2 = currPoint.position.sub(middlePoint.position);
                            if (Global.controlMode === ControlMode.ALIGNED) {
                                let moveLen = movePoint.position.sub(middlePoint.position).mag();
                                movePoint.position = middlePoint.position.add(currVec.neg().normalize().mul(moveLen));
                            } else if (Global.controlMode === ControlMode.MIRRORED) {
                                movePoint.position = middlePoint.position.add(currVec.neg());
                            }
                        }
     
                    }
                    
                }

            }
        });
        Global.eventListener.on("DRAG_END", (name: string) => {
            // name: NodeXXX
            let index = Number(name.substring(4));
            let len = this.bezierNodeList.length;
            if (index === 0) { // 第一个点
                cc.log(0);
            } else if (index > 0 && index % 3 === 0) { // 端点
                let bezierIndex1 = index / 3 - 1;
                let bezierIndex2 = index / 3;
                if (len === bezierIndex2) { // 最后的端点
                    cc.log(bezierIndex1);
                } else {
                    cc.log(bezierIndex1);
                    cc.log(bezierIndex2);
                }
            } else if (index > 0 && index % 3 != 0) { // 控制点
                let bezierIndex = Math.floor(index / 3);
                cc.log(bezierIndex);
            }
        });
    }
    onDestroy() {
        Global.eventListener.off("ADD_SPLINE");
        Global.eventListener.off("DELETE_SPLINE");
        Global.eventListener.off("DELETE_ALL_SPLINE");
        Global.eventListener.off("EDITOR_SCALE_SMALL");
        Global.eventListener.off("EDITOR_SCALE_BIG");
        Global.eventListener.off("EDITOR_SCALE_RESTORE");
        Global.eventListener.off("ARROW_L");
        Global.eventListener.off("ARROW_U");
        Global.eventListener.off("ARROW_R");
        Global.eventListener.off("ARROW_D");
        Global.eventListener.off("PLAY");
        Global.eventListener.off("STOP");
        Global.eventListener.off("CLICK_SAVE");
        Global.eventListener.off("SET_CHANGE_PLAY_TIME");
        Global.eventListener.off("CONTROL_MODE_CHANGE");
        Global.eventListener.off("DRAG_START");
        Global.eventListener.off("DRAG_MOVE");
        Global.eventListener.off("DRAG_END");
    }

    addBezierNode() {
        let len = this.bezierNodeList.length;
        if (len === 0) {
            let p0 = this.pointMgr.createPoint();
            let p1 = this.pointMgr.createPoint();
            let p2 = this.pointMgr.createPoint();
            let p3 = p0;
            p0.name = "Node0";
            p1.name = "Node1";
            p2.name = "Node2";
            p0.position = cc.v2(-640, 0);
            p1.position = cc.v2(-500, 140);
            p2.position = cc.v2(-500, -140);
            
            this.node.addChild(p0);
            this.node.addChild(p1);
            this.node.addChild(p2);
            
            if (Global.controlMode != ControlMode.CLOSE) {
                p3 = this.pointMgr.createPoint();
                p3.name = "Node3";
                p3.position = cc.v2(-360, 0);
                this.node.addChild(p3);
            }
            let bezierNode = new BezierNode(p0, p1, p2, p3);
            bezierNode.index = 0;
            this.bezierNodeList.push(bezierNode);
            
        } else {
            let lastBezierNode = this.bezierNodeList[len - 1];
            let lastP = lastBezierNode.p3;
            let tempP = this.pointMgr.createPoint();

            let p0 = lastP;
            let p1 = this.pointMgr.createPoint();
            let p2 = this.pointMgr.createPoint();
            let p3 = tempP;
            
            let index = len * 3;
            p1.name = "Node" + (index + 1);
            p2.name = "Node" + (index + 2);
            p3.name = "Node" + (index + 3);

            let p0x = lastP.position.x;
            let p0y = lastP.position.y
            p1.position = cc.v2(p0x + 140, p0y + 140);
            p2.position = cc.v2(p0x + 140, p0y - 140);
            p3.position = cc.v2(p0x + 280, p0y);
            if (Global.controlMode === ControlMode.CLOSE) {
                p0 = tempP
                p3 = lastP;
                p0.name = "Node" + index;
                p3.name = lastP.name;
                p0.position = lastP.position;
                p3.position = lastP.position;
                this.node.addChild(p0);
                this.node.addChild(p1);
                this.node.addChild(p2);
                
                lastBezierNode.p3 = p0;
            } else {
                this.node.addChild(p1);
                this.node.addChild(p2);
                this.node.addChild(p3);
            }
            
            let bezierNode = new BezierNode(p0, p1, p2, p3);
            bezierNode.index = len;
            this.bezierNodeList.push(bezierNode);
        }
    }

    removeBezierNode() {
        let len = this.bezierNodeList.length;
        if (len > 1) {
            let lastLastBezierNode = this.bezierNodeList[len - 2];
            let lastBezierNode = this.bezierNodeList[len - 1];
            this.pointMgr.deletePoint(lastBezierNode.p1);
            this.pointMgr.deletePoint(lastBezierNode.p2);
            if (Global.controlMode == ControlMode.CLOSE) {
                this.pointMgr.deletePoint(lastLastBezierNode.p3);
                lastLastBezierNode.p3 = lastBezierNode.p3;
            } else {
                this.pointMgr.deletePoint(lastBezierNode.p3);
            }

            this.bezierNodeList.pop();         
        } else if (len === 1) {
            let lastBezierNode = this.bezierNodeList[len - 1];
            this.pointMgr.deletePoint(lastBezierNode.p0);
            this.pointMgr.deletePoint(lastBezierNode.p1);
            this.pointMgr.deletePoint(lastBezierNode.p2);
            if (Global.controlMode != ControlMode.CLOSE) {
                this.pointMgr.deletePoint(lastBezierNode.p3);
            }
            this.bezierNodeList.pop();
        }
    }

    update(dt) {
        this.clearDraw()
        for (const i in this.bezierNodeList) {
            if (this.bezierNodeList.hasOwnProperty(i)) {
                let bezierNode = this.bezierNodeList[i];
                bezierNode.updatePosition(dt);

                this.setStrokeColor(cc.Color.BLUE);
                this.setLineWidth(2);
                this.drawBezierCurve(bezierNode.p0p, bezierNode.p1p, bezierNode.p2p, bezierNode.p3p);
                this.drawLine(bezierNode.p0p, bezierNode.p1p, new cc.Color(0, 255, 0, 50), 2);
                this.drawLine(bezierNode.p2p, bezierNode.p3p, new cc.Color(0, 255, 0, 50), 2);
            }
        }
        if (this.isPlay === true) {
            this.time += dt;
            this.updatePoint();
        }
    }

    updatePoint() {
        for (let i = 0; i < this.pointList.length; i++) {
            this.drawCirclePoint(this.pointList[i], cc.Color.RED, 3, true);
        }
        if (this.time < this.playTime) {
            // let len = cubicbezier.length(1);
            // let t1 = cubicbezier.t2rt(0.2);
            // let t2 = cubicbezier.t2rt2(0.2);
            // let fd = cubicbezier.getFirstDerivative(0.5);
            // let d = cubicbezier.getVelocity(0.5);
            // let v = cubicbezier.getDirection(0.5);
            // for (let j = 0; j < 100; j += 1) {
            //     let t = j / 100;
            //     const l = t * len;
            //     t = cubicbezier.invert(t, l);

            //     let point = cubicbezier.getPoint(t);
            //     let color = cc.color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
            //     this.drawCirclePoint(point, color, 8, true);
            // }

            let totalLength = this.totalLength;
            let percent = this.time / this.playTime;
            let perLen = totalLength * percent;
            let bezierNodeListLen = this.bezierNodeList.length;
            let currIndex = 0;
            for (let index = 0; index < bezierNodeListLen; index++) {
                perLen -= this.lineLengthList[index];
                if (perLen < 0) {
                    currIndex = index;
                    break;
                }
            }
            perLen += this.lineLengthList[currIndex];
            let len = this.lineLengthList[currIndex];
            percent = perLen / len;
            let rt = this.bezierNodeList[currIndex].cubicBezier.invert(percent, perLen);
            let point = this.bezierNodeList[currIndex].cubicBezier.getPoint(rt);
            let color = cc.color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
            // this.drawCirclePoint(point, color, 3, true);
            this.drawCirclePoint(point, cc.Color.GREEN, 3, true);

            if (this.isAddPoint) {
                this.pointList.push(point);
            }
        } else {
            this.time = 0;
            this.isAddPoint = false;
        }
    }

}
