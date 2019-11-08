import EventListener from "./eventlistener";

export const enum ControlMode {
    FREE,
    ALIGNED,
    MIRRORED,
    CLOSE
};

export default class Global {
    private static instance_: Global = new Global();
    private static eventListenter_: EventListener = new EventListener();

    private constructor() { }

    public static getInstance(): Global {
        return Global.instance_;
    }

    public static set eventListener(v: EventListener) {
        this.eventListenter_ = v;
    }

    public static get eventListener(): EventListener {
        return this.eventListenter_;
    }

    public static controlMode = ControlMode.FREE;
}
