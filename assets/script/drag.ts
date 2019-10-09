const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    getWorldPos(): cc.Vec2 {
        let nodePos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let v2 = cc.v2(nodePos.x, nodePos.y);
        return v2;
    }

    setWorldPos(pos: cc.Vec2) {
        let nodePos = this.node.parent.convertToNodeSpaceAR(pos);
        let v2 = cc.v2(nodePos.x, nodePos.y);
        this.node.position = v2;
    }

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touchEvent: cc.Event.EventTouch) => {
            let location = touchEvent.getDelta();
            this.node.position = cc.v2(this.node.x + location.x, this.node.y + location.y);
        }, this);
    }

}
