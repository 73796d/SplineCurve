const {ccclass, property} = cc._decorator;

@ccclass
export default class ShowPosition extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    update (dt) {
        this.label.string = "(" +  this.node.position.x.toFixed(1) + "," + this.node.position.y.toFixed(1) + ")";
    }
}
