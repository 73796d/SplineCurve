import ItemMgr from "./itemmgr";
import Item from "./item";

const { ccclass, property } = cc._decorator;
const FILE_STYLE = `
    position:absolute;
    margin-left:0%;
    margin-top:0px;
    -webkit-user-select:file;
    display:none;`
const DRAG_STYLE = `
    position:absolute;
    margin-left:0px;
    margin-top:0px;
    border:1px solid #aaa;
    width:100px;
    height:100px;
    -webkit-user-select:file;`

@ccclass
export default class BMFontUI extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    input: HTMLInputElement = null; // 文件选择

    @property(cc.ScrollView)
    fontScrollView: cc.ScrollView = null; // 字体滚动

    @property(cc.ScrollView)
    imageScrollView: cc.ScrollView = null; // 图像滚动
    itemMgr: ItemMgr = null; // item 管理器

    itemList: Array<Item> = new Array<Item>(); // item 数组

    onLoad() {
        this.itemMgr = cc.find("Canvas/ItemMgr").getComponent(ItemMgr);
        this.createFileLoader(); // 创建文件选择器
        this.createDragZone(); // 创建拖拽区域
    }

    start() {

    }

    update() {

    }

    isCanUse(): boolean {
        let isCanUse = false;
        if (cc.sys.isBrowser) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                isCanUse = true;
            }
        }
        return isCanUse;
    }

    readFile(file){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            let img = document.createElement("img");
            img.src = e.target.result;
            let texture = new cc.Texture2D();
            texture._nativeAsset = img;
            texture.on("load", () => {
                let id = this.itemList.length + 1;
                let item = new Item();
                item.id = id;
                item.img = texture;
                item.imgPath = file.name;
                item.imgSize.width = texture.width;
                item.imgSize.height = texture.height;
                item.size = file.size;
                this.itemList.push(item);
                this.updateFontScrollView(texture);
            });
        };
    }

    createFileLoader() {
        if (this.isCanUse()) {
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.setAttribute("style", FILE_STYLE);
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
                        let id = this.itemList.length + 1;
                        let item = new Item();
                        item.id = id;
                        item.img = texture;
                        item.imgPath = file.name;
                        item.imgSize.width = texture.width;
                        item.imgSize.height = texture.height;
                        item.size = file.size;
                        this.itemList.push(item);
                        this.updateFontScrollView(texture);
                    });
                };
            };
            input.addEventListener("change", onInput);
            this.input = input;
        } else {
            alert('不支持');
        }
        
    }

    onFileLoader() {
        if (this.input) {
            this.input.click();
        }
    }

    updateFontScrollView(texture: cc.Texture2D) {
        let itemData = this.itemList[this.itemList.length - 1];
        let item = this.itemMgr.createItem();
        let scrollView = this.fontScrollView;
        scrollView.content.addChild(item);
        let id = item.getChildByName("id").getComponent(cc.Label);
        id.string = itemData.id.toString();
        let img = item.getChildByName("img").getComponent(cc.Sprite);
        img.spriteFrame = new cc.SpriteFrame(itemData.img);
        let name = item.getChildByName("imgpath").getComponent(cc.Label);
        name.string = itemData.imgPath.toString();
        let size = item.getChildByName("size").getComponent(cc.Label);
        size.string = Math.floor(itemData.size / 1024).toString();
        let contentSize = item.getChildByName("imgsize").getComponent(cc.Label);
        contentSize.string = "" + itemData.imgSize.width + "*" + itemData.imgSize.height;
    }

    createDragZone() {
        if (this.isCanUse()) {
            document.ondragover = (e) => {
                e.preventDefault();
            }
            document.ondrag = (e) => {
                e.preventDefault();
            }
            let input = document.createElement("div");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.setAttribute("style", DRAG_STYLE);
            document.getElementsByTagName("body")[0].appendChild(input);
            let fileSelect = (e) => {
                e.stopPropagation();
                e.preventDefault();
                let list = e.dataTransfer.files;
                for (let i = 0; i < list.length; i++) {
                    let f = list[i];
                    let reader = new FileReader();
                    reader.readAsDataURL(f);
                    reader.onload = (e) => {
                        let img = document.createElement("img");
                        img.src = e.target.result;
                        let texture = new cc.Texture2D();
                        texture._nativeAsset = img;
                        texture.on("load", () => {
                            let id = this.itemList.length + 1;
                            let item = new Item();
                            item.id = id;
                            item.img = texture;
                            item.imgPath = f.name;
                            item.imgSize.width = texture.width;
                            item.imgSize.height = texture.height;
                            item.size = f.size;
                            this.itemList.push(item);
                            this.updateFontScrollView(texture);
                        });
                    };
                }
            };
            let dragOver = (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            };

            input.addEventListener('dragover', dragOver, false);
            input.addEventListener('drop', fileSelect, false);
        } else {
            alert('不支持');
        }
        
    }


}
