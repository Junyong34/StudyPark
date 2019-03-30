import dataSet from "./data/topologyStore";

class topologyBase {
    constructor(props) {
        this.initProperty();
        Object.keys(props).forEach(key => {
            this[key] = props[key];
        });
        this.init();
    }

    init() {
        console.log(dataSet);
        this.initSizeProps();
        this.initDataProps();
        this.initCanvas();
    }

    initCanvas() {
        this.canvasAnim = document.createElement("canvas");
        this.ctxAnim = this.canvasAnim.getContext("2d");
        this.canvasAnim.className = "canvasAnim";

        this.canvasBG = document.createElement("canvas");
        this.ctxBG = this.canvasBG.getContext("2d");
        this.canvasBG.className = "canvasBG";

        this.initCanvasSize();

        this.dom.appendChild(this.canvasAnim);
        this.dom.appendChild(this.canvasBG);
    }

    initCanvasSize() {
        this.canvasAnim.setAttribute("width", this.domWidth);
        this.canvasAnim.setAttribute("height", this.domHeight);
        this.canvasAnim.setAttribute("style", "position: absolute; top:0px; left:0px");

        this.canvasBG.setAttribute("width", this.domWidth);
        this.canvasBG.setAttribute("height", this.domHeight);
        this.canvasBG.setAttribute("style", "position: absolute; top:0px; left:0px");
    }

    initProperty() {
        this.dom = null;
    }

    initSizeProps() {
        this.domWidth = this.getWidth();
        this.domHeight = this.getHeight();

        // Canvas Property
        this.radius = this.domWidth > this.domHeight ? this.domHeight / 2.65 : this.domWidth / 2.65;
        this.innerRad = this.radius;
        this.smallDotRad = this.radius * 0.030;
        this.dotSpace = this.radius * 0.030;
        this.cx = this.domWidth / 2;
        this.cy = this.domHeight / 2;

    }

    initDataProps() {
        // Color

        this.topGaugeColor = "#a280ff";
        this.bottomGaugeColor = "#41e59e";

        // Data
        this.data = null;

    }

    getWidth() {
        return this.dom.clientWidth || this.dom.width;
    }

    getHeight() {
        return this.dom.clientHeight || this.dom.height;
    }

}
