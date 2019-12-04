import ItemMgr from "./itemmgr";
import Item from "./item";
import { FontUtil } from "./fontutil";
import { Rect } from "./rect";
import BaseDraw from "../basedraw";

const { ccclass, property } = cc._decorator;
const FILE_STYLE = `
    position:absolute;
    margin-left:0%;
    margin-top:0px;
    -webkit-user-select:file;
    display:none;`;

const DRAG_STYLE = `
    position:absolute;
    margin-left:0px;
    margin-top:0px;
    border:1px solid #aaa;
    width:100px;
    height:100px;
    -webkit-user-select:file;`;

@ccclass
export default class BMFontUI extends cc.Component {

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

        this.schedule(()=> {
            this.fiveUpdate();
        }, 15);

        // let ss =  FontUtil.genInfo("baiseshuzi", "0", "0", "0", "ANSI", "0", "0", "1", "1", "0,0,0,0", "0,0");
        // ss += FontUtil.genCommon("21", "0", "128", "64", "1", "2");
        // ss += FontUtil.genPage("21", "baiseshuzi.png");
        // ss += FontUtil.genChars("21");
        // ss += FontUtil.genChar("21", "0", "21", "21", "21", "21", "21", "21", "21", "21");
        // ss += FontUtil.genChar("21", "0", "21", "21", "21", "21", "21", "21", "21", "21");
        // ss += FontUtil.genChar("21", "0", "21", "21", "21", "21", "21", "21", "21", "21");
        // ss += FontUtil.genChar("21", "0", "21", "21", "21", "21", "21", "21", "21", "21");
        // console.log(ss);

        // // FontUtil.saveToFile(ss);

        // FontUtil.run();
    }
    fiveUpdate() {
        let rects: Array<cc.Rect> = new Array<cc.Rect>();
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            rects.push(new Rect(item.id, 0, 0, item.imgSize.width, item.imgSize.height));
        }
        let packs = FontUtil.run(rects);
        this.imageScrollView.content.removeAllChildren();

        let sp = new cc.Node();
        let spc = sp.addComponent(BaseDraw);
        sp.parent = this.imageScrollView.content;
        sp.anchorX = 0;
        sp.anchorY = 1;
        sp.position = cc.v2(0, 0);
        spc.drawRectPoint(cc.v2(0, -64), cc.Color.RED, 64, 64, false);


        for (let i = 0; i < packs.length; i++) {
            let rect = packs[i];
            let id = rect.id;
            let itemData = this.getItemDataById(id);
            let sp = new cc.Node();
            let spc = sp.addComponent(cc.Sprite);
            sp.parent = this.imageScrollView.content;
            sp.anchorX = 0;
            sp.anchorY = 1;
            sp.position = cc.v2(rect.x, -rect.y);
            spc.spriteFrame = new cc.SpriteFrame(itemData.img);

        }
    }

    start() {

    }

    update() {

    }

    /**
     * 是否可用功能
     */
    isCanUse(): boolean {
        let isCanUse = false;
        if (cc.sys.isBrowser) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                isCanUse = true;
            }
        }
        return isCanUse;
    }

    /**
     * 读取文件
     * @param file 文件
     */
    readFile(file) {
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
                item.imgSize.id = id;
                item.size = file.size;
                this.itemList.push(item);
                this.updateFontScrollView(texture);
            });
        };
    }

    /**
     * 创建文件选择器
     */
    createFileLoader() {
        if (this.isCanUse()) {
            let onInput = (e: any) => {
                let file = e.target.files[0];
                if (!file.type.match("image.*")) {
                    return;
                }
                this.readFile(file);
            };
            let input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.setAttribute("style", FILE_STYLE);
            document.getElementsByTagName("body")[0].appendChild(input);
            input.addEventListener("change", onInput);
            this.input = input;
        } else {
            alert('不支持');
        }
    }

    /**
     * 文件选择器回调
     */
    onFileLoader() {
        if (this.input) {
            this.input.click();
        }
    }

    /**
     * 更新字体显示
     * @param texture 纹理
     */
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

    getItemDataById(id) {
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            if (item.id === id) {
                return item;
            }
        }   
    }


    /**
     * 创建拖拽区域
     */
    createDragZone() {
        if (this.isCanUse()) {
            document.ondragover = (e) => {
                e.preventDefault();
            };
            document.ondrag = (e) => {
                e.preventDefault();
            };
            let fileSelect = (e) => {
                e.stopPropagation();
                e.preventDefault();
                let list = e.dataTransfer.files;
                for (let i = 0; i < list.length; i++) {
                    let file = list[i];
                    if (!file.type.match("image.*")) {
                        return;
                    }
                    this.readFile(file);
                }
            };
            let dragOver = (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            };

            let input = document.createElement("div");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.setAttribute("style", DRAG_STYLE);
            input.addEventListener('dragover', dragOver, false);
            input.addEventListener('drop', fileSelect, false);
            document.getElementsByTagName("body")[0].appendChild(input);
        } else {
            alert('不支持');
        }
    }
}
