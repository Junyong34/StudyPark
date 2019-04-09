import config from "../utils/topologyConfig";
import Utils from "../utils/topologyUtils";
import _ from "lodash-es";

const mouseEvents = {
    k8s: null,
    createMouseEvents(eventDom, k8s) {
        this.k8s = k8s;
        this.topologyEvent = eventDom;
        this.topologyEvent.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.topologyEvent.addEventListener("mousemove", this.handleMouseMove.bind(this));
        // eventDom.addEventListener("mousemove", this.handleMouseMove.bind(this));
        // eventDom.addEventListener("click", this.handleMouseClick.bind(this));
        this.topologyEvent.addEventListener("mouseout", this.handleMouseout.bind(this));
        this.topologyEvent.addEventListener("wheel", this.handleMouswheel.bind(this));
    },
    handleMouseMove(e) {
        this.k8s.isMouseOver = true;
        // 마우스 좌표
        this.mouseXY(e);

        // 노드를 선택하지 않을 때
        if (this.k8s.selectNode == null && this.mouseDown) {
            // if (this.mouseDown) {
            // console.log(this.k8s.mPointer.pos2dX, this.k8s.mouseLastX);
            const dx = (this.k8s.mPointer.pos2dX - this.k8s.mouseLastX) / 1.8;
            // this.k8s.domWidth * this.k8s.widthView;
            const dy = (this.k8s.mPointer.pos2dY - this.k8s.mouseLastY) / 1.8;
            // this.k8s.domWidth * this.k8s.heightView;


            this.k8s.xleftView -= dx;
            this.k8s.ytopView -= dy;

            // 좌표이동이 되어 trans된 만큼 마우스 좌표 변경
            // this.k8s.mPointer.pos2dX = e.offsetX;
            // this.k8s.mPointer.pos2dY = e.offsetY;
            // }
        } else if (this.k8s.selectNode != null && this.mouseDown) {
            this.k8s.selectNode.pos2dX = this.k8s.mPointer.pos2dX;
            this.k8s.selectNode.pos2dY = this.k8s.mPointer.pos2dY;
        }

        this.k8s.mouseLastX = this.k8s.mPointer.pos2dX;
        this.k8s.mouseLastY = this.k8s.mPointer.pos2dY;
        // node select or 바탕 클릭 일 때
        if (this.k8s.selectNode != null || this.mouseDown) {
            this.k8s.wheelPixelRatio();
            this.k8s.topologyReDraw();
        }

        // // mouseOver된 Node를 찾는다.
        // this.k8s.searchNode();
    },
    handleMouseDown(e) {
        e.preventDefault();

        if (e.which !== 1) {
            return;
        }
        // 마우스 좌표
        this.mouseXY(e);
        if (this.k8s.selectNode == null) {
            this.k8s.selectSearchNode();
        }

        // this.k8s.ctxScene.fillRect(this.k8s.mPointer.pos2dX, this.k8s.mPointer.pos2dY, 30, 30);

        // if (!this.k8s.isMouseOver) {
        //     return;
        // }
        // 노드를 선택하지 않으면 canvas area가 move된다.
        this.mouseDown = true;
        // console.log(this.k8s.selectNode.id);

        this.topologyEvent.addEventListener("mouseup", this.handleMouseUp.bind(this));
    },
    handleMouseUp(e) {
        e.stopPropagation();
        e.preventDefault();

        if (this.k8s.selectNode == null) {
            this.mouseDown = false;
            return;
        }

        this.topologyEvent.removeEventListener("mouseup", this.handleMouseUp, false);
        this.topologyEvent.removeEventListener("mousemove", this.handleMouseMove, false);
        // console.log(this.k8s.selectNode);


        // quadTree 다시 생성
        // this.k8s.nodeSceneTree.insert(this.k8s.selectNode);

        // 초기화
        // this.k8s.nodeSceneTreeClear();
        this.k8s.selectNode = null;
        this.mouseDown = false;
    },
    handleMouseout(e) {
        this.k8s.isMouseOver = false;
    },
    handleMouswheel(e) {
        const wheelDelta = Utils.getDelta(e);

        if (wheelDelta !== 0) {
            // const scale = 0.05;
            const setScale = wheelDelta > 0 ? 0.05 : -0.05;

            this.k8s.sceneScale = this.k8s.sceneScale + setScale;
            // console.log(scale);
            this.k8s.wheelPixelRatio();
            this.k8s.topologyReDraw();
            // 이벤트 전파 방지
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            e.stopPropagation();
        }
    },

    mouseXY(e) {
        if (!e.offsetX) {
            e.offsetX = e.layerX - e.target.offsetLeft;
            e.offsetY = e.layerY - e.target.offsetTop;
        }
        this.k8s.mPointer.pos2dX = (e.offsetX / this.k8s.sceneScale) + this.k8s.xleftView;
        this.k8s.mPointer.pos2dY = (e.offsetY / this.k8s.sceneScale) + this.k8s.ytopView;
    },
    killEvent() {
        this.topologyEvent.removeEventListener("mouseup", this.handleMouseUp);
        this.topologyEvent.removeEventListener("mousemove", this.handleMouseMove);
        this.topologyEvent.removeEventListener("mousedown", this.handleMouseDown);
        this.topologyEvent.removeEventListener("mouseout", this.handleMouseout);
        this.topologyEvent.removeEventListener("wheel", this.handleMouswheel);
    },

};

export default mouseEvents;
