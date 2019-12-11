import ItemMgr from "./itemmgr";
import Item from "./item";
import { FontUtil } from "./fontutil";
import { Rect } from "./rect";
import BaseDraw from "../basedraw";
import Global from "../global";

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
    zone: any  = null;

    @property(cc.ScrollView)
    fontScrollView: cc.ScrollView = null; // 字体滚动

    @property(cc.ScrollView)
    imageScrollView: cc.ScrollView = null; // 图像滚动
    itemMgr: ItemMgr = null; // item 管理器
    itemList: Array<Item> = new Array<Item>(); // item 数组

    onLoad() {
        this.itemMgr = cc.find("Canvas/ItemMgr").getComponent(ItemMgr);
        this.createDragZone(); // 创建拖拽区域
        Global.eventListener.on("REMOVE_ITEM", (id) => {
            let item = this.deleteItem(id);
            this.itemMgr.deleteItem(item.node);
            for (let i = 0; i < this.itemList.length; i++) {
                let tempItem = this.itemList[i];
                let tempId = tempItem.id;
                let tempNode = tempItem.node;
                let idNode = tempNode.getChildByName("id");
                let label = idNode.getComponent(cc.Label);
                label.string = tempId.toString();
            }
        });
        
        Global.eventListener.on("CHANGE_CHAR", (id, char) => {
            let item = this.getItemDataById(id);
            item.char = char;
        });
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

            let zone = document.createElement("div");
            zone.setAttribute("type", "file");
            zone.setAttribute("accept", "image/*");
            zone.setAttribute("style", DRAG_STYLE);
            zone.addEventListener('dragover', dragOver, false);
            zone.addEventListener('drop', fileSelect, false);
            document.getElementsByTagName("body")[0].appendChild(zone);
            this.zone = zone;
        } else {
            alert('不支持');
        }
    }
    /**
     * 读取文件
     * @param file 文件
     */
    readFile(file) {
        // 通过文件名查询是否存在item
        if (!this.hasItemByName(file.name)) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                let img = document.createElement("img");
                img.src = e.target.result;
                let texture = new cc.Texture2D();
                texture._nativeAsset = img;
                if (texture.loaded) { // 纹理已经加载
                    this.createItem(texture, file.name, file.size);
                    this.addFontScrollItem(texture);
                } else { // 纹理未加载
                    texture.on("load", () => {
                        this.createItem(texture, file.name, file.size);
                        this.addFontScrollItem(texture);
                    });
                }
            };
        }
    }
    /**
     * 文件选择器回调
     */
    onFileLoader() {
        if (this.input) {
            document.getElementsByTagName("body")[0].removeChild(this.input);
        }
        this.createFileLoader();
        if (this.input) {
            this.input.click();
        }
    }

    // 增
    createItem(texture, imgPath, size) {
        // id 从1开始
        let id = this.itemList.length + 1;
        let item = new Item();
        item.id = id;
        item.img = texture;
        item.imgPath = imgPath;
        item.char = item.imgPath.charAt(0);
        item.imgSize.width = texture.width;
        item.imgSize.height = texture.height;
        item.imgSize.id = id;
        item.size = size;
        this.itemList.push(item);
    }
    // 删
    deleteItem(id) {
        let item = this.getItemDataById(id);
        let index = this.itemList.indexOf(item)
        this.itemList.splice(index, 1);
        for (let i = 0; i < this.itemList.length; i++) {
            let tempItem = this.itemList[i];
            tempItem.id = i + 1;
        }
        return item;
    }
    // 改
    modifyItem() {

    }
    // 查
    searchItem() {

    }

    /**
     * 点击生成图片回调
     * 根据打包好的位置信息, 创建图片
     */
    onGenerateImage() {
        let rects: Array<cc.Rect> = new Array<cc.Rect>();
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            rects.push(new Rect(item.id, 0, 0, item.imgSize.width, item.imgSize.height));
        }
        let binBuilder = FontUtil.run(rects);
        this.imageScrollView.content.removeAllChildren();
        let width = binBuilder.atlasWidth; // 打包后宽度
        let height = binBuilder.atlasHeight; // 打包后高度
        let packs = binBuilder.packedRects;

        this.imageScrollView.content.width = width;
        this.imageScrollView.content.height = height;
        // let sp = new cc.Node();
        // let spc = sp.addComponent(BaseDraw);
        // sp.parent = this.imageScrollView.content;
        // sp.anchorX = 0;
        // sp.anchorY = 1;
        // sp.position = cc.v2(0, 0);
        // spc.drawRectPoint(cc.v2(0, -height), cc.Color.RED, width, height, false);
        for (let i = 0; i < packs.length; i++) {
            let rect = packs[i] as Rect;
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

        FontUtil.genFontFnt("12212", packs, 12, 12, 12, packs.length, 12);
    }

    /**
     * 生成bmf回调, 通过Camera制作
     */
    onGenerateBMF() {
        Global.eventListener.fire("GENERATE_IMAGE");
    }

    onBackMain() {
        Global.eventListener.off("REMOVE_ITEM");
        Global.eventListener.off("CHANGE_CHAR");
        document.getElementsByTagName("body")[0].removeChild(this.input);
        document.getElementsByTagName("body")[0].removeChild(this.zone);
        cc.director.loadScene("Menu");
    }

    /**
     * 添加一个显示的字体
     * @param texture 纹理
     */
    addFontScrollItem(texture: cc.Texture2D) {
        let itemData = this.itemList[this.itemList.length - 1];
        let item = this.itemMgr.createItem();
        itemData.node = item;
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
        let charText = item.getChildByName("char").getComponent(cc.EditBox);
        charText.string = "" + itemData.char;
    }


    getItemDataById(id: number) {
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            if (item.id === id) {
                return item;
            }
        }
    }

    hasItemByName(name: string) {
        let flag: boolean = false;
        for (let i = 0; i < this.itemList.length; i++) {
            let item = this.itemList[i];
            if (item.imgPath === name) {
                flag = true;
            }
        }
        return flag;
    }

}
