import Global from "./global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Drag extends cc.Component {

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
        this.node.on(cc.Node.EventType.TOUCH_START, (touchEvent: cc.Event.EventTouch) => {
            Global.eventListener.fire("DRAG_START", this.node.name);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touchEvent: cc.Event.EventTouch) => {
            // let location = touchEvent.getDelta();
            // this.node.position = cc.v2(this.node.x + location.x, this.node.y + location.y);
            this.setWorldPos(touchEvent.getLocation());
            Global.eventListener.fire("DRAG_MOVE", this.node.name);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, (touchEvent: cc.Event.EventTouch) => {
            Global.eventListener.fire("DRAG_END", this.node.name);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (touchEvent: cc.Event.EventTouch) => {

        }, this);
    }

}
