export class Rect extends cc.Rect {
    id: number = 0;
    constructor(id: number = 0, x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        super(x, y, width, height);
        this.id = id;
    }
    
}