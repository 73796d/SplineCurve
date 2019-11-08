import Global, { ControlMode } from "./global";
import Drag from "./drag";
const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {
    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    input: HTMLInputElement = null;

    onLoad() {
        this.setReferenceDraggable(false);
        this.createFileLoader();
    }

    createFileLoader() {
        if (cc.sys.isBrowser) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                let input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.setAttribute("style", "position:absolute;margin-left:0%;margin-top:0px;-webkit-user-select:file;display:none");
                document.getElementsByTagName("body")[0].appendChild(input);
                let onInput = (e: any) => {
                    let file = e.target.files[0];
                    if (!file.type.match("image.*")) {
                        return false;
                    }
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (e) => {
                        let img = document.createElement("img");
                        img.src = e.target.result;
                        let texture = new cc.Texture2D();
                        texture._nativeAsset = img;
                        texture.on("load", () => {
                            this.sprite.spriteFrame = new cc.SpriteFrame(texture);
                        });
                    };
                };
                input.addEventListener("change", onInput);
                this.input = input;
            } else {
                alert('不支持');
            }
        }
    }

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

    onFileLoader() {
        if (this.input) {
            this.input.click();
        }
    }

    onCheckReferenceEdit(toggle: cc.Toggle, customEventData) {
        this.setReferenceDraggable(toggle.isChecked);
    }

    setReferenceDraggable(flag: boolean) {
        if (this.sprite) {
            let com = this.sprite.getComponent(Drag);
            com.enabled = flag;
        }
    }

    onControlMode(toggle: cc.Toggle, customEventData) {
        let isChecked = toggle.isChecked;
        let name = toggle.name.substring(0, 7)
        if (name == "toggle1") {
            Global.controlMode = ControlMode.FREE;
        } else if (name== "toggle2") {
            Global.controlMode = ControlMode.ALIGNED;
        } else if (name == "toggle3") {
            Global.controlMode = ControlMode.MIRRORED;
        } else if (name == "toggle4") {
            Global.controlMode = ControlMode.CLOSE;
            Global.eventListener.fire("CONTROL_MODE_CLOSE");
        }      
        cc.log(Global.controlMode)  
    }
}
