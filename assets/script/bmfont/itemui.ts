import Global from "../global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemUI extends cc.Component {
    didEnded(editbox) {
        let id = this.getId();
        let charText = this.node.getChildByName("char").getComponent(cc.EditBox);
        if (charText.string === "") { // 为空设置默认值
            let pathNode = this.node.getChildByName("imgpath");
            let label = pathNode.getComponent(cc.Label);
            charText.string = label.string.charAt(0);
        }
        Global.eventListener.fire("CHANGE_CHAR", id, charText.string);
    }
    onOperator() {
        let id = this.getId();
        Global.eventListener.fire("REMOVE_ITEM", id);
    }

    getId() {
        let idNode = this.node.getChildByName("id");
        let label = idNode.getComponent(cc.Label);
        let id = parseInt(label.string);
        return id;
    }
}
