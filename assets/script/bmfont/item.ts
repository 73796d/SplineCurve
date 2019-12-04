import { Rect } from "./rect";

export default class Item {
    public id: number = 0;
    public img: cc.Texture2D = null;
    public imgPath: string = "";
    public imgSize: Rect = new Rect(0, 0, 0, 0);
    public char: string = "";
    public size: number = 0;
}
