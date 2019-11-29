const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    toBMFontScene() {
        cc.director.loadScene("BMFont");
    }

    toBSplineCurveScene() {
        cc.director.loadScene("Curve");
    }

}
