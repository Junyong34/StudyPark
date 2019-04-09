import Utils from "./utils/topologyUtils";
import NodeTreeSearch from "./utils/quadTreeSearch";
import dataSet from "./data/topologyStore";
import MouseEvents from "./event/topologyMouseEvent";
import Nodes from "./node/topologyNodes";
import Edges from "./edge/topologyEdges";
import NodeLabels from "./label/topologyNodeLabels";
import EdgeLabels from "./label/topologyEdgeLabels";

export default class k8sTopology {
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
        this.initQuadTree(0, 0);
        this.initCanvasEvent();
    }

    initCanvasEvent() {
        MouseEvents.createMouseEvents(this.topologyEvent, this);
    }

    // 토폴로지 그린다.
    topologyDraw() {
        this.sceneBackground();
        this.edgeDraw();
        this.nodeDraw();
    }

    topologyReDraw() {
        // this.ctxClear(this.ctxScene);
        this.sceneBackground();
        this.updateEdgeDraw();
        this.updateNodeDraw();
        // this.edgeDraw();
        // this.edgeDraw();
        // this.LabelDraw();
    }

    randMinMax = function (min, max, round) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
    };

    sceneBackground() {
        this.ctxScene.save();
        this.ctxScene.rect(this.xleftView, this.ytopView, this.domWidth, this.domHeight);
        this.ctxScene.fillStyle = "#1e1b1b";
        // this.ctxScene.fillStyle = "red";
        this.ctxScene.fill();
        this.ctxScene.restore();

        this.ctxEvent.clearRect(this.xleftView, this.ytopView, this.domWidth, this.domHeight);
    }

    nodeDraw() {
        const nodes = this.topologyData.nodes;

        for (let ix = 0, ixLen = nodes.length; ix < ixLen; ix++) {
            const node = nodes[ix];

            // 마우스 위로 올라가면 true 변경
            node.inPointer = false;
            Nodes.drawNode(node, this.ctxScene, this);
            Nodes.loop(node, this.ctxAnim);
            NodeLabels.drawNodeLabel(node, this.ctxScene);
            this.NodeTreeObject.push(node);
            this.nodeSceneTree.insert(node);
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

    updateNodeDraw() {
        const nodes = this.topologyData.nodes;

        this.nodeSceneTreeClear();
        this.initQuadTree(this.xleftView, this.ytopView);
        // console.time("start");
        for (let ix = 0, ixLen = nodes.length; ix < ixLen; ix++) {
            const node = nodes[ix];

            // 마우스 위로 올라가면 true 변경
            node.inPointer = false;
            Nodes.drawNode(node, this.ctxScene, this);

            NodeLabels.drawNodeLabel(node, this.ctxScene);
            this.NodeTreeObject.push(node);
            this.nodeSceneTree.insert(node);
        }
        // treeBox 디버깅 용도
        // this.debuggerTreeBox(this.nodeSceneTree);
    }

    updateEdgeDraw() {
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

    // SceneTree 초기화
    nodeSceneTreeClear() {
        this.NodeTreeObject = [];
        this.nodeSceneTree.clear();
        this.nodeSceneTree = null;
    }

    // SceneTree  생성
    initQuadTree(cx, cy) {
        this.nodeSceneTree = new NodeTreeSearch({
                x: 0 + cx,
                y: 0 + cy,
                width: (this.domWidth / this.sceneScale),
                height: (this.domHeight / this.sceneScale),
            },
            4);

        this.NodeTreeObject = [];
        this.mPointer = {
            pos2dX: 0,
            pos2dY: 0,
            width: 0.001,
            height: 0.001,
        };
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
        this.oldPixelRatio = this.pixelRatio;

        // if (devicePixelRatio !== this.backingStoreRatio) {
        this.initScale(ctx, this.pixelRatio);
        ctx.translate(-this.xleftView, -this.ytopView);
        // }
    }

    // 휠 비율
    wheelPixelRatio() {
        if (this.sceneScale < 0.34) {
            this.sceneScale = 0.35;
            return;
        }
        if (this.sceneScale > 2.000001) {
            this.sceneScale = 2;
            return;
        }
        this.ratioAssignment.forEach(ctx => {
            this.ctxClear(ctx);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            // console.log(this.widthView, this.heightView, "비율");
            ctx.scale(this.sceneScale, this.sceneScale);
            // ctx.scale(this.widthView, this.heightView);
            // console.log(-this.xleftView, -this.ytopView);
            ctx.translate(-this.xleftView, -this.ytopView);
        });
    }

    // 최소 스케일
    initScaleResize() {
        this.ratioAssignment.forEach(ctx => this.devicePixelRatio(ctx));

        if (this.oldPixelRatio !== this.pixelRatio) {
            this.oldPixelRatio = this.pixelRatio;
            // resize 이벤트 로직 넣기
        }
    }

    initScale(ctx, ratio) {
        ctx.scale(this.sceneScale / ratio, this.sceneScale / ratio);
    }

    initProperty() {
        this.isMouseOver = true;
        this.dom = null;
        this.selectNode = null;
        this.xleftView = 0; // 마우스 x좌표가 이동되는값 tran
        this.ytopView = 0; // 마우스 y좌표가 이동되는값
        this.mouseLastX = 0;
        this.mouseLastY = 0;
    }

    initSizeProps() {
        this.domWidth = Utils.getWidth(this.dom);
        this.domHeight = Utils.getHeight(this.dom);

        this.sceneScaleX = this.domWidth;
        this.sceneScaleY = this.domHeight;
        this.sceneScale = 1;

        // Canvas Property
        this.radius = this.domWidth > this.domHeight ? this.domHeight / 2.65 : this.domWidth / 2.65;
    }

    initDataProps() {
        // Color
        this.topologyData = dataSet.topologyData;
    }

    debuggerTreeBox(node) {
        const bounds = node.bounds;

        if (node.nodes.length === 0) {
            this.ctxEvent.save();
            this.ctxEvent.lineWidth = 1 / this.sceneScale;
            this.ctxEvent.strokeStyle = "green";
            // console.log(this.xleftView, this.ytopView, bounds.width, bounds.height);
            // this.ctxEvent.strokeRect(this.xleftView, this.ytopView
            //     , bounds.width, bounds.height);
            this.ctxEvent.strokeRect(bounds.x, bounds.y
                , bounds.width, bounds.height);
            this.ctxEvent.restore();
        } else {
            for (let i = 0; i < node.nodes.length; i += 1) {
                this.debuggerTreeBox(node.nodes[i]);
            }
        }
    }

    selectSearchNode() {
        const candidates = this.nodeSceneTree.retrieve(this.mPointer);

        for (let ix = 0; ix < candidates.length; ix += 1) {
            // 마우스 위에 올라간 노드
            const nodePosX = candidates[ix].pos2dX;
            const nodePosY = candidates[ix].pos2dY;
            const nodeSize = candidates[ix].size;

            if ((this.mPointer.pos2dX >= (nodePosX - nodeSize - 2) &&
                this.mPointer.pos2dX <= (nodeSize + nodePosX)) &&
                (this.mPointer.pos2dY >= (nodePosY - nodeSize) &&
                    this.mPointer.pos2dY <= (nodeSize + nodePosY - 2))) {
                // candidates[ix].inPointer = true;
                // 같은 좌표에 여러개 node가 있는 경우 하나만 선택된 노드는 하나만 처리
                // if (!isOneNode) {
                //     isOneNode = true;
                this.selectNode = candidates[ix];
                // console.log(this.selectNode.id);
                // candidates 너무 많은 양이 생기기때문에.. 퍼포먼스 테스트 확인해봐야함
                return;
                // }
            }
        }
        // this.updateNodeDraw();
        // }
    }

    ctxClear(ctx) {
        ctx.clearRect(this.xleftView, this.ytopView, Utils.getWidth(this.dom) / this.sceneScale,
            Utils.getHeight(this.dom) / this.sceneScale);
    }
}
