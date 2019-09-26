import BaseDraw from "./basedraw";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends BaseDraw {
    start () {
        this.clearDraw()
        this.drawRectPoint(cc.Vec2.ZERO, cc.Color.GREEN, 10, true);
        // this.drawRectPoint(this.node.position, cc.Color.GREEN, 10, false);
        
        this.node.width = 20;
        this.node.height = 20;
    }

    update() {
        this.clearDraw()
        this.drawRectPoint(cc.Vec2.ZERO, cc.Color.GREEN, 10, true);
        // this.drawRectPoint(this.node.position, cc.Color.GREEN, 10, false);
    }

}
