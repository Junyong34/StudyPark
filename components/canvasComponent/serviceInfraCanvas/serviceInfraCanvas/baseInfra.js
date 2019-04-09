// import config from "../utils/topologyConfig";
// import env from "@/env/config";
// import cUtil from "@/common/commonUtil";
import Utils from "./utils/topologyUtils";
import dataSet from "./data/topologyStore";
import k8sNodes from "./node/k8sNodes";
import k8sEdges from "./edge/k8sEdges";
import k8sNodeLabels from "./label/k8sNodeLabels";
import k8sEdgeLabels from "./label/k8sEdgeLabels";
import k8sEffect from "./effect/k8sEffect";
import MouseEvents from "./event/topologyMouseEvent";
// import podIm from "./images/pod.svg";

class baseInfra {
    constructor(props) {
        this.initProperty();
        Object.keys(props).forEach(key => {
            this[key] = props[key];
        });

        this.imageLoad();
        // this.init();
    }

    init() {
        // this.testData();

        this.initSizeProps();
        this.initDataProps();
        this.initCanvas();
        this.topologyDraw();
        // Node 찾기 알고리즘
        // this.initCanvasEvent();
    }

    initProperty() {
        this.isMouseOver = true;
        this.dom = null;
        this.selectNode = null;
        // 알람 발생 fps 시작
        this.fps = 14;
        this.fpsInterval = 1000 / this.fps;
        this.isDrawFrame = true; // 알람발생 애니메이션 발생 여부
        this.fpsThen = Date.now();
        this.alarmAnimateHandle = null;
        // 알람 발생 변수 끝
        this.tpsDrawAnimate = null;
        // tps 애니메이션
        this.ballZoomRate = 1;
        this.criticalBall = "#f53e43";
        this.warningBall = "#ffb91b";
        this.normalBall = "#63e61d";
        this.linePositionLength = 100;
        this.lineFPS = {
            fps: 25,
            now: null,
            then: Date.now(),
            interval: 1000 / 45,
        };

        // tps 끝끝

        // 모듈메서드 연결
        Object.assign(this, k8sNodes);
        Object.assign(this, k8sEdges);
        Object.assign(this, k8sNodeLabels);
        Object.assign(this, k8sEdgeLabels);
        Object.assign(this, k8sEffect);
    }

    // 화면에서 필요한 이미지 로드를 한다
    // 이미지 로드가 완료 되면 실제 draw 실시한다.
    imageLoad() {
        // 이미지 로드
        this.isImageLoad = false;
        if (!this.isImageLoad) {
            this.iconImg = new Image();
            this.iconImg.src = require("@/assets/svg/view/pod.svg");
            this.iconImg.onload = () => {
                this.isImageLoad = true;
                this.init();
            };
        }
    }


    initSizeProps() {
        this.domWidth = Utils.getWidth(this.dom);
        this.domHeight = Utils.getHeight(this.dom);

        // Canvas Property
        this.radius = this.domWidth > this.domHeight ? this.domHeight / 2.65 : this.domWidth / 2.65;
    }

    initDataProps() {
        // Color
        this.topologyData = dataSet.topologyData;
    }

    initCanvas() {
        this.topologyScene = document.createElement("canvas");
        this.ctxScene = this.topologyScene.getContext("2d");
        this.topologyScene.className = "topologyScene";

        this.topologyEvent = document.createElement("canvas");
        this.ctxEvent = this.topologyEvent.getContext("2d");
        this.topologyEvent.className = "topologyEvent";

        this.topologyAnim = document.createElement("canvas");
        this.ctxAnim = this.topologyAnim.getContext("2d");
        this.topologyAnim.className = "topologyAnim";

        this.tpsEffect = document.createElement("canvas");
        this.ctxTpsEffect = this.tpsEffect.getContext("2d");
        this.tpsEffect.className = "tpsEffect";

        // 디바이스 비율 부여리스트
        this.ratioAssignment = [this.ctxScene, this.ctxEvent, this.ctxAnim, this.ctxTpsEffect];


        this.initCanvasSize();
        this.ratioAssignment.forEach(ctx => this.devicePixelRatio(ctx));

        this.dom.appendChild(this.topologyScene);
        this.dom.appendChild(this.topologyAnim);
        this.dom.appendChild(this.topologyEvent);
        this.dom.appendChild(this.tpsEffect);
    }

    initCanvasSize() {
        this.topologyScene.setAttribute("width", this.domWidth);
        this.topologyScene.setAttribute("height", this.domHeight);
        this.topologyScene.setAttribute("style", "position: absolute; top:0px; left:0px;");

        this.topologyEvent.setAttribute("width", this.domWidth);
        this.topologyEvent.setAttribute("height", this.domHeight);
        this.topologyEvent.setAttribute("style", "position: absolute; top:0px; left:0px");

        this.topologyAnim.setAttribute("width", this.domWidth);
        this.topologyAnim.setAttribute("height", this.domHeight);
        this.topologyAnim.setAttribute("style", "position: absolute; top:0px; left:0px");

        this.tpsEffect.setAttribute("width", this.domWidth);
        this.tpsEffect.setAttribute("height", this.domHeight);
        this.tpsEffect.setAttribute("style", "position: absolute; top:0px; left:0px");
    }

    // 디바이스 비율
    devicePixelRatio(ctx) {
        const devicePixelRatio = window.devicePixelRatio || 1;

        this.backingStoreRatio =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        this.pixelRatio = devicePixelRatio / this.backingStoreRatio;
        if (this.oldPixelRatio !== this.pixelRatio) {
            this.oldPixelRatio = this.pixelRatio;
            this.resize();
        }
        if (devicePixelRatio !== this.backingStoreRatio) {
            this.initScale(ctx);
        }
    }

    initCanvasEvent() {
        MouseEvents.createMouseEvents(this.topologyEvent, this);
    }

    resize() {
        if (!this.dom) {
            return;
        }

        this.initSizeProps();
        this.initCanvasSize();
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        // 리사이즈로 인해 다시 그린다.
        this.resizeTimer = setTimeout(this.updateDraw.bind(this)(true), 50);
    }

    initScale(ctx) {
        ctx.scale(this.pixelRatio, this.pixelRatio);
    }

    ctxClear(ctx) {
        ctx.clearRect(0, 0, Utils.getWidth(this.dom),
            Utils.getHeight(this.dom));
    }
}

export default baseInfra;
