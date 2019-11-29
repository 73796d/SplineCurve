export class FontUtil {

    public static genFontFnt(): boolean {
        return true;
    }

    public static genFontImage() {

    }

    public static getImageRects() {

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

        let str: string = "info " +
            "face=\"" + face + "\" " +
            "size=" + size + " " +
            "bold=" + bold + " " +
            "italic=" + italic + " " +
            "charset=\"" + charset + "\" " +
            "unicode=" + unicode + " " +
            "stretchH=" + stretchH + " " +
            "smooth=" + smooth + " " +
            "aa=" + aa + " " +
            "padding=" + padding + " " +
            "spacing=" + spacing + "\n";
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

        let str: string = "common " +
            "lineHeight=" + lineHeight + " " +
            "base=" + base + " " +
            "scaleW=" + scaleW + " " +
            "scaleH=" + scaleH + " " +
            "pages=" + pages + " " +
            "packed=" + packed + "\n";
        return str;
    }

    /**
     * page
     * @param id 第一页
     * @param file 贴图名称
     */
    public static genPage(id: string, file: string) {

        let str = "page " +
            "id=" + id + " " +
            "file=\"" + file + "\"\n";
        return str;
    }
    /**
     * chars
     * @param count 当前贴图中所容纳的字体数量
     */
    public static genChars(count: string) {

        let str: string = "chars " +
            "count=" + count + "\n";
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

        let str = "char  " +
            "id=" + id + "  " +
            "x=" + x + "  " +
            "y=" + y + "  " +
            "width=" + width + "  " +
            "height=" + height + "  " +
            "xoffset=" + xoffset + "  " +
            "yoffset=" + yoffset + "  " +
            "xadvance=" + xadvance + "  " +
            "page=" + page + "  " +
            "chnl=" + chnl + "\n";
        return str;
    }

}