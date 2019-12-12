/**
 * 通过Renderer功能保存图片
 */
import Global from "../global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SaveImage extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;
    _texture: cc.RenderTexture;
    _canvas: HTMLCanvasElement;

    onLoad() {
        // 注册事件
        Global.eventListener.on("GENERATE_IMAGE", (fileName) => {
            this.init();
            this.downloadImg(fileName);
        });
    }

    onDestroy() {
        Global.eventListener.off("GENERATE_IMAGE");
    }

    /**
     * 初始化
     */
    init() {
        let texture =  new cc.RenderTexture();
        let gl = cc.game._renderContext;
        texture.initWithSize(this.node.width, this.node.height, gl.STENCIL_INDEX8);
        this.camera.targetTexture = texture;
        this.camera.node.position = cc.v2(this.node.width * 0.5, -this.node.height * 0.5);
        this._texture = texture;
    }

    initImage() {
        let dataURL = this._canvas.toDataURL("image/png");
        let img = document.createElement("img");
        img.src = dataURL;
        return img;
    }

    /**
     * 读取渲染的数据
     */
    createSprite() {
        let width = this._texture.width;
        let height = this._texture.height;
        if (!this._canvas) {
            this._canvas = document.createElement("canvas");
            this._canvas.width = width;
            this._canvas.height = height;
        } else {
            this.clearCanvas();
        }
        let ctx = this._canvas.getContext("2d");
        this.camera.render(this.node);
        let data = this._texture.readPixels();
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
 
            ctx.putImageData(imageData, 0, row);
        }
        return this._canvas;
    }

    /**
     * 下载打包好的图片
     */
    downloadImg(fileName) {
        this.createSprite();
        var dataURL = this._canvas.toDataURL("image/png")
        var a = document.createElement("a")
        a.href = dataURL;
        a.download = fileName + ".png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * 清除Canvas
     */
    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}
