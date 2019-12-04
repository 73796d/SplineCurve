import BaseDraw from "../basedraw";
import { Rect } from "./rect";
import { FontBinPacker } from "./fontbinpacker";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FontTest extends BaseDraw {
    onLoad () {
        super.onLoad();
    }

    start () {

        let rects: Array<cc.Rect> = new Array<cc.Rect>();
        rects.push(new Rect(1, 0, 0, 80, 80));
        rects.push(new Rect(2, 0, 0, 80, 80));
        rects.push(new Rect(3, 0, 0, 80, 80));
        rects.push(new Rect(4, 0, 0, 80, 80));
        rects.push(new Rect(5, 0, 0, 80, 80));
        rects.push(new Rect(6, 0, 0, 80, 80));
        rects.push(new Rect(7, 0, 0, 80, 80));
        rects.push(new Rect(8, 0, 0, 80, 80));

        let binPacker = new FontBinPacker(256, 512, false);
        let sss = binPacker.insert2(rects, 0);
        for (let i = 0; i < sss.length; i++) {
            this.drawRectPoint(cc.v2(sss[i].x, -(sss[i].y + sss[i].height)), cc.Color.RED, sss[i].width, sss[i].height, false);
        }
    }

    // update (dt) {}
}
