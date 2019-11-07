import Global from "./global";
const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {
    onClickUp() {
        this.node.position = cc.v2(0, 40);
    }

    onClickDown() {
        this.node.position = cc.v2(0, -720);
    }

    onClickAddSpline() {
        Global.eventListener.fire("ADD_SPLINE");
    }

    onClickScaleSmall() {
        Global.eventListener.fire("EDITOR_SCALE_SMALL");
    }

    onClickScaleBig() {
        Global.eventListener.fire("EDITOR_SCALE_BIG");
    }

    onClickScaleRestore() {
        Global.eventListener.fire("EDITOR_SCALE_RESTORE");
    }

    onClickArrowL() {
        Global.eventListener.fire("ARROW_L");
    }

    onClickArrowU() {
        Global.eventListener.fire("ARROW_U");
    }

    onClickArrowR() {
        Global.eventListener.fire("ARROW_R");
    }

    onClickArrowD() {
        Global.eventListener.fire("ARROW_D");
    }

    onCheckEdit(toggle: cc.Toggle, customEventData) {
        cc.log(toggle.isChecked)
        Global.eventListener.fire("CHECK_EDIT");
    }
}
