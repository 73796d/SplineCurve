import {
    FontBinPacker,
    BestShortSideFit,
    BestLongSideFit,
    BestAreaFit,
    BottomLeftRule,
    ContactPointRule
} from "./fontbinpacker";

export default class BinPackBuilder {
    atlasWidth: number = 0;
    atlasHeight: number = 0;

    sourceRects: Array<cc.Rect> = null;
    packedRects: Array<cc.Rect> = null;

    public init(atlasWidth: number, atlasHeight: number, rects: Array<cc.Rect>): void {
        this.atlasWidth = atlasWidth;
        this.atlasHeight = atlasHeight;
        this.sourceRects = rects;
    }

    public build(): boolean {
        let packs = this.findBestBinPacker(this.atlasWidth, this.atlasHeight, this.sourceRects);
        if (packs === null) {
            return false
        } else {
            this.packedRects =  packs;
            return true;
        }
    }
    findBestBinPacker(width: number, height: number, currentRects: cc.Rect[]) {
        let binPackers = new Array<FontBinPacker>();
        let packedRects = new Array();
        let binPackerMethods = [
            BestShortSideFit,
            BestLongSideFit,
            BestAreaFit,
            BottomLeftRule,
            ContactPointRule
        ];

        for (let i = 0; i < binPackerMethods.length; i++) {
            let tempW = width;
            let tempH = height;
            let rects = JSON.parse(JSON.stringify(currentRects));
            let binPack = new FontBinPacker(tempW, tempH);
            let packs = binPack.insert2(rects, binPackerMethods[i]);
            while (!binPack.isBinPackSuccess()) {
                if (tempW > tempH) {
                    tempH *= 2;
                } else {
                    tempW *= 2;
                }
                rects = JSON.parse(JSON.stringify(currentRects));
                binPack = new FontBinPacker(tempW, tempW);
                packs = binPack.insert2(rects, binPackerMethods[i]);
            }
            packedRects.push(packs);
            binPackers.push(binPack);
        }

        let leastWastedArea = Infinity;
        let leastWastedIndex = -1;
        for (let i = 0; i < binPackers.length; i++) {
            let binPacker = binPackers[i];
            let wastedArea = binPacker.wastedBinArea();
            if (wastedArea < leastWastedArea) {
                leastWastedIndex = i;
            }
        }

        if (leastWastedIndex == -1) {
            return null;
        } else {
            this.atlasWidth = binPackers[leastWastedIndex].binWidth;
            this.atlasHeight = binPackers[leastWastedIndex].binHeight;
            return packedRects[leastWastedIndex];
        }
    }
}
