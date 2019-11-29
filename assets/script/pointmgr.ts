const {ccclass, property} = cc._decorator;

@ccclass
export default class PointMgr extends cc.Component {
    @property(cc.Prefab)
    readonly prefab: cc.Prefab = null;

    @property
    readonly size: number = 5;

    private pool_: cc.NodePool = null;
    public get pool(): cc.NodePool {
        return this.pool_;
    }
    public set pool(value: cc.NodePool) {
        this.pool_ = value;
    }

    onLoad() {
        if (this.size < 1) {
            throw Error("size < 1");
        }
        if (this.prefab === null) {
            throw Error("prefab null");
        }

        const pool = new cc.NodePool();
        for (let i = 0; i < this.size; i++) {
            pool.put(cc.instantiate(this.prefab));
        }
        this.pool = pool;
    }

    public createPoint(): cc.Node {
        let point = null;
        if (this.pool.size() > 0) {
            point = this.pool.get();
        } else {
            point = cc.instantiate(this.prefab);
        }

        return point;
    }

    public deletePoint(point: cc.Node) {
        this.pool.put(point);
    }

    public clearPool() {
        this.pool.clear();
    }

}
