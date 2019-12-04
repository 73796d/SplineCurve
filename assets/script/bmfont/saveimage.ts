const {ccclass, property} = cc._decorator;

@ccclass
export default class SaveImage extends cc.Component {
    camera: cc.Camera;
    texture: cc.RenderTexture;
    _canvas: HTMLCanvasElement;
    targetNode: any;
    onLoad() {
        this.init();
    }
    init() {
        let texture =  new cc.RenderTexture();
        let gl = cc.game._renderContextl;
        texture.initWithSize(this.node.width, this.node.height, gl.STENCIL_INDEX8);
        this.camera = this.node.addComponent(cc.Camera);
        this.camera.targetTexture = texture;
        this.texture = texture;
    }

    initImage() {
        let dataURL = this._canvas.toDataURL("image/png");
        let img = document.createElement("img");
        img.src = dataURL;
        return img;
    }

    createSprite() {
        let width = this.texture.width;
        let height = this.texture.height;
        if (!this._canvas) {
            this._canvas = document.createElement("canvas");
            this._canvas.width = width;
            this._canvas.height = height;
        } else {
            this.clearCanvas();
        }
        let ctx = this._canvas.getContext("2d");
        this.camera.render();
        let data = this.texture.readPixels();
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
    getTargetArea() {
        let targetPos = this.targetNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let y = cc.winSize.height - targetPos.y - this.targetNode.height / 2;
        let x = cc.winSize.width - targetPos.x - this.targetNode.width / 2;
        return {
            x,
            y
        }
    }
    downloadImg() {
        this.createSprite();
        var img = this.initImage();
        this.showSprite(img)
        var dataURL = this._canvas.toDataURL("image/png")
        var a = document.createElement("a")
        a.href = dataURL;
        a.download = "image";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    showSprite(img: HTMLImageElement) {
        let y = this.getTargetArea().y;
        let x = this.getTargetArea().x;
        let rect = new cc.Rect(x, y, 770, 800)
        let texture = new cc.Texture2D();
        texture.initWithElement(img);
 
        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        spriteFrame.setRect(rect)
 
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;
 
        node.zIndex = cc.macro.MAX_ZINDEX;
        node.parent = cc.director.getScene();
        // set position
        let width = cc.winSize.width;
        let height = cc.winSize.height;
        node.x = width / 2;
        node.y = height / 2;
        node.on(cc.Node.EventType.TOUCH_START, () => {
            node.parent = null;
            node.destroy();
        });
        this.captureAction(node, width, height);
    }
    captureAction(capture, width, height) {
        let scaleAction = cc.scaleTo(1, 0.3);
        let targetPos = cc.v2(width - width / 6, height / 4);
        let moveAction = cc.moveTo(1, targetPos);
        let spawn = cc.spawn(scaleAction, moveAction);
 
        let finished = cc.callFunc(() => {
            capture.destroy();
        })
        let action = cc.sequence(spawn, finished);
        capture.runAction(action);
    }
    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}
