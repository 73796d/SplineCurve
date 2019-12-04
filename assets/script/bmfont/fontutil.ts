import { FontBinPacker } from "./fontbinpacker";
import { Rect } from "./rect";
import BinPackBuilder from "./binpackbuilder";

export class FontUtil {

    public static run(rects: Array<cc.Rect>) {
        let packs = null;
        let font = {
            width: 0,
            height: 0
        };
        this.getImageRects(rects, font);
        let binBuilder = new BinPackBuilder();
        binBuilder.init(font.width, font.height, rects)
        if (binBuilder.build()) {
            let width = binBuilder.atlasHeight;
            let height = binBuilder.atlasWidth;
            packs = binBuilder.packedRects;
        }


        // 将矩形打包
        // 生成图片
        // 生成描述文件
        return packs;
    }


    public static genFontFnt(fontName): boolean {
		// 生成font描述信息
        // 默认生成第一行空格，空格的宽度为 10
		this.genChar(this.getCharId(" ").toString(), "0", "0", "0", "0", "0", "0", "" + 10, "0", "0");
		return true;
    }

    public static genFontImage(rects: Array<cc.Rect>) {
    }

    public static getImageRects(rects: Array<cc.Rect>, font) {
        let sourceRects: Array<cc.Rect> = new Array<cc.Rect>();
        let totalArea: number = 0;
        for (let i = 0; i < rects.length; i++) {
            let rect = rects[i];
            sourceRects.push(rect);
            totalArea += rect.width * rect.height;
        }

        let powerWidth = 1;
        let powerHeight = 1;
        while (true) {
            let area = Math.pow(2, powerWidth) * Math.pow(2, powerHeight);
            if (totalArea > area) {
                if (powerWidth <= powerHeight) {
					powerWidth++;
				} else {
					powerHeight++;
				}
            } else {
                break;
            }
        }
        let width = Math.pow(2, powerWidth);
        let height = Math.pow(2, powerHeight);
        font.width = width;
        font.height = height;
        return sourceRects;
    }

    public static getCharId(text: string) {
        let char: string = text.charAt(0);
        let id: number = char.charCodeAt(0);
        return id;
    }

    /**
     * 获取info字符串
     * @param face 字体名称
     * @param size 大小
     * @param bold 加粗
     * @param italic 斜体
     * @param charset 编码字符集
     * @param unicode Unicode
     * @param stretchH 纵向缩放百分比
     * @param smooth 开启平滑
     * @param aa 开启抗锯齿
     * @param padding 内边距
     * @param spacing 外边距
     */
    public static genInfo(face: string, size: string, bold: string,
        italic: string, charset: string, unicode: string, stretchH: string,
        smooth: string, aa: string, padding: string, spacing: string) {
        let str: string = `info face="{0}" size={1} bold={2} italic={3} charset="{4}" unicode={5} stretchH={6} smooth={7} aa={8} padding={9} spacing={10}\n`
        str = this.stringFormat(str, face, size, bold,italic, charset, unicode, stretchH, smooth, aa, padding, spacing);
        return str;
    }

    /**
     * common
     * @param lineHeight 行高
     * @param base 字的基本大小
     * @param scaleW 图片大小
     * @param scaleH 图片大小
     * @param pages 此种字体用到了几张图
     * @param packed 图片不压缩
     */
    public static genCommon(lineHeight: string, base: string, scaleW: string, scaleH: string, pages: string, packed: string) {
        let str: string = `common lineHeight={0} base={1} scaleW={2} scaleH={3} pages={4} packed={5}\n`
        str = this.stringFormat(str, lineHeight, base, scaleW, scaleW, pages, packed);
        return str;
    }

    /**
     * page
     * @param id 第一页
     * @param file 贴图名称
     */
    public static genPage(id: string, file: string) {
        let str: string = `page id={0} file="{1}"\n`;
        str = this.stringFormat(str, id, file);
        return str;
    }
    /**
     * chars
     * @param count 当前贴图中所容纳的字体数量
     */
    public static genChars(count: string) {
        let str: string  = `chars count={0}\n\n`;
        str = this.stringFormat(str, count);
        return str;
    }

    /**
     * 数据描述
     * @param id 第一个字符编码
     * @param x x位置
     * @param y y位置
     * @param width 宽度
     * @param height 高度
     * @param xoffset x像素偏移
     * @param yoffset y像素偏移
     * @param xadvance x往后移
     * @param page 字的图块在第一页上
     * @param chnl 
     */
    public static genChar(id: string, x: string, y: string, width: string, height: string,
        xoffset: string, yoffset: string, xadvance: string, page: string, chnl: string) {

        let str: string = `char  id={0}  x={1}  y={2}  width={3}  height={4}  xoffset={5}  yoffset={6}  xadvance={7}  page={8}  chnl={9}\n`;
        str = this.stringFormat(str, id, x, y, width, height, xoffset, yoffset, xadvance, page, chnl);
        return str;
    }

    public static stringFormat(...args: string[]) {
        let s = args[0];
        for (let i = 0; i < args.length - 1; i++) {
            if (args[i + 1] != undefined) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, args[i + 1]);
            }
        }
        return s;
    }

    public static saveToFile(text: string, fileName: string = "font.fnt") {
        if (cc.sys.isBrowser) {
            let textFileAsBlob = new Blob([text], {type: "text/plain"});
            let fileNameToSaveAs = "filename.fnt";
            let downloadLink = document.createElement("a");
            downloadLink.download = fileNameToSaveAs;
            downloadLink.innerHTML = "Download File";
            if (window.URL != null) {
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            } else {
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    }

}