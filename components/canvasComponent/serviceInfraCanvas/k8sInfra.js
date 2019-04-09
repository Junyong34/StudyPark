import Utils from "./utils/topologyUtils";
import dataSet from "./data/topologyStore";
import MouseEvents from "./event/topologyMouseEvent";
import Nodes from "./node/topologyNodes";
import Edges from "./edge/topologyEdges";
import NodeLabels from "./label/topologyNodeLabels";
import EdgeLabels from "./label/topologyEdgeLabels";
import cUtil from "@/common/commonUtil";
import config from "./utils/topologyConfig";
import env from "@/env/config";

export default class k8sInfra {
    constructor(props) {
        this.initProperty();
        Object.keys(props).forEach(key => {
            this[key] = props[key];
        });
        this.init();
    }

    init() {
        // this.testData();
        this.initSizeProps();
        this.initDataProps();
        this.initCanvas();
        // Node 찾기 알고리즘
        // this.initCanvasEvent();
    }

    initCanvasEvent() {
        MouseEvents.createMouseEvents(this.topologyEvent, this);
    }

    // 토폴로지 그린다.
    topologyDraw() {
        this.ctxClear(this.ctxScene);
        this.edgeDraw();
        this.nodeDraw();
        this.callAnimate();
        // setTimeout(() => {
        //     Nodes.alertEffect.bind(this)(this.topologyData.nodes[0], this.ctxAnim, 0.9);
        // }, 1000);
        // setTimeout(() => {
        //     Nodes.alertEffect.bind(this)(this.topologyData.nodes[0], this.ctxAnim, 0);
        // }, 5000);
    }

    updateDraw() {
        this.ctxClear(this.ctxScene);
        this.edgeDraw();
        this.nodeDraw();
    }

    callAnimate() {
        this.alertEffect();

        setInterval(() => {
            const nodes = this.topologyData.nodes;

            for (let ix = 0, ixLen = nodes.length; ix < ixLen; ix++) {
                const node = nodes[ix];

                node.level = Math.random() * 1 + 0.2;
            }
        }, 5000);
    }

    cancelAnimate() {
        cancelAnimationFrame(this.alarmAnimateHandle);
    }

    randMinMax = function (min, max, round) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
    };


    nodeDraw() {
        const nodes = this.topologyData.nodes;

        for (let ix = 0, ixLen = nodes.length; ix < ixLen; ix++) {
            const node = nodes[ix];

            // 마우스 위로 올라가면 true 변경
            node.inPointer = false;
            Nodes.drawNode(node, this.ctxScene, this);
            // Nodes.loop(node, this.ctxAnim);
            NodeLabels.drawNodeLabel(node, this.ctxScene);
        }
        // treeBox 디버깅 용도
        // this.debuggerTreeBox(this.nodeSceneTree);
    }

    edgeDraw() {
        const edges = this.topologyData.edges;

        for (let ix = 0, ixLen = edges.length; ix < ixLen; ix++) {
            const edge = edges[ix];

            Edges.drawDashedEdge.call(this,
                edge,
                Utils.getNodes(edge.source || edge.fromId),
                Utils.getNodes(edge.target || edge.toId),
                this.ctxScene);
            // EdgeLabels.drawArrowEdgeLabel(edge,
            //     Utils.getNodes(edge.source),
            //     Utils.getNodes(edge.target),
            //     this.ctxScene);
        }
    }


    testData() {
        dataSet.randomData(Utils.getWidth(this.dom), Utils.getHeight(this.dom));
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

        // 디바이스 비율 부여리스트
        this.ratioAssignment = [this.ctxScene, this.ctxEvent, this.ctxAnim];


        this.initCanvasSize();
        this.ratioAssignment.forEach(ctx => this.devicePixelRatio(ctx));

        this.dom.appendChild(this.topologyScene);
        this.dom.appendChild(this.topologyAnim);
        this.dom.appendChild(this.topologyEvent);
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

    updateDraw(isResize) {
        if (isResize) {
            console.log("resize 발생");
        }
    }

    initScale(ctx) {
        ctx.scale(this.pixelRatio, this.pixelRatio);
    }

    initProperty() {
        this.isMouseOver = true;
        this.dom = null;
        this.selectNode = null;
        // 알람 발생 fps 시작
        this.fps = 15;
        this.fpsInterval = 1000 / this.fps;
        this.isDrawFrame = true; // 알람발생 애니메이션 발생 여부
        this.fpsThen = Date.now();
        this.alarmAnimateHandle = null;
        // 알람 발생 변수 끝
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


    ctxClear(ctx) {
        ctx.clearRect(0, 0, Utils.getWidth(this.dom),
            Utils.getHeight(this.dom));
    }

    alertEffect(radius = config.nodeSize) {
        let alarmColor = "#4D83AF";
        let alarmRadius = radius;

        this.fpsNow = Date.now();
        this.delta = this.fpsNow - this.fpsThen;
        if (this.delta > this.fpsInterval && this.isDrawFrame) {
            this.ctxClear(this.ctxAnim);


            alarmRadius += 0.8;

            for (let ix = 0; ix < this.topologyData.nodes.length; ix++) {
                const node = this.topologyData.nodes[ix];
                const scoreLevel = node.level;

                // 레벨 값이 없으면 패스
                if (scoreLevel == null) {
                    continue;
                }
                // 점수가 0이면 정상이니까 알람 패스
                if (scoreLevel === env.healthIndicaterStateInfo[3].over) {
                    continue;
                }

                const x = node.x;
                const y = node.y;

                if (scoreLevel >= env.healthIndicaterStateInfo[0].over) {
                    alarmColor = "#B0413D";
                } else if (scoreLevel >= env.healthIndicaterStateInfo[1].over) {
                    alarmColor = "#B08139";
                } else if (scoreLevel > env.healthIndicaterStateInfo[2].over) {
                    alarmColor = "#64B87D";
                } else if (scoreLevel === env.healthIndicaterStateInfo[3].over) {
                    alarmColor = "#4D83AF";
                }
                this.alarmGradient =
                    this.ctxAnim.createRadialGradient(x, y,
                        node.size + 2,
                        x, y,
                        node.size + 10);
                this.alarmGradient.addColorStop(0, `rgba(${cUtil.hexToRgb(alarmColor)},${0.7})`);
                this.alarmGradient.addColorStop(0.2, `rgba(${cUtil.hexToRgb(alarmColor)},${0.5})`);
                this.alarmGradient.addColorStop(0.4, `rgba(${cUtil.hexToRgb(alarmColor)},${0.3})`);
                this.alarmGradient.addColorStop(0.8, `rgba(${cUtil.hexToRgb(alarmColor)},${0.1})`);
                this.alarmGradient.addColorStop(1, "transparent");

                // draw the circle
                this.ctxAnim.beginPath();
                this.ctxAnim.arc(x, y, alarmRadius, 0, Math.PI * 2, false);
                this.ctxAnim.closePath();

                this.ctxAnim.strokeStyle = this.alarmGradient;
                this.ctxAnim.lineWidth = 6;
                this.ctxAnim.stroke();

                this.fpsThen = this.fpsNow - (this.delta % this.fpsInterval);
            }
        }
        if (alarmRadius >= config.nodeSize + 10) {
            this.ctxClear(this.ctxAnim);
            setTimeout(() => {
                const initRadius = config.nodeSize;

                this.alarmAnimateHandle = window.requestAnimationFrame(
                    this.alertEffect.bind(this, initRadius));
            }, 500)
            ;
        } else {
            this.alarmAnimateHandle =
                window.requestAnimationFrame(this.alertEffect.bind(this, alarmRadius));
        }
    }
}
