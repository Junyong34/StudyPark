const mouseEvents = {
        createMouseEvents() {
            this.HexToolTip.addEventListener("mousedown", this.handleMouseDown.bind(this));
            this.HexToolTip.addEventListener("mousemove", this.handleMouseMove.bind(this));
            this.HexToolTip.addEventListener("mouseup", this.handleMouseUp.bind(this), false);
        },
        handleMouseMove(e) {
            e.preventDefault();
            this.mouseXY(e);
            if (this.selectHex !== null) {
                if (!this.selectHex.data) return;
                // 과거에 selected 한적 있으면 제거 한다.
                // this.selectHex.selected = false;

                // console.log(this.selectHex.hexId);
                if (this.layout === "box") {
                    this.ctxClear(this.ctxTip);
                    this.showToolTip();
                }
            } else {
                this.ctxClear(this.ctxTip);
            }
            this.selectHex = this.GetHexAt(this.mPointer);
            // console.log(1);
            // if (e.buttons === 1) this.nodeMove(e);
            // if (this.timer) {
            //     clearTimeout(this.timer);
            // }
            // this.timer = setTimeout(function() {
            //     this.nodeMove(e);
            // }, 200);
        },
        handleMouseDown(e) {
            e.preventDefault();
            // 마우스 좌표
            this.mouseXY(e);
            if (e.button === 0) {
                if (this.selectHex !== null) {
                    if (!this.selectHex.data) return;
                    // this.selectHex.selected = true;
                    if (this.layout === "box") { // Pod 화면
                        if (this.beforeSelectHexId === this.selectHex.hexId) {
                            this.vm.statusEmit("All");
                            this.beforeSelectHexId = null;
                        } else {
                            this.vm.statusEmit(this.selectHex.data.status);
                            this.beforeSelectHexId = this.selectHex.hexId;
                        }
                    }
                }
                this.HexagonGridDraw();
            } else if (e.button === 2) {
                console.log(2);
            }


            // if (this.beforeSelectNode[0] === this.afterSelectNode[0] &&
            //     this.beforeSelectNode[1] === this.afterSelectNode[1]) {
            //     // this.vm.isShow = true;
            //     if (this.selectNode && this.selectNode.data.type === "node") {
            //         this.selectNode.emphasis = true;
            //     }
            //
            //     this.selectShowTooltip(e);
            // } else {
            //     this.selectNode.emphasis = false;
            // }

            this.mouseDown = true;
// console.log(this.selectNode.id);
        },
        handleMouseUp(e) {
            // e.stopPropagation();
            // e.preventDefault();

            // if (this.selectNode == null) {
            //     this.mouseDown = false;
            //     return;
            // }
            // this.HexToolTip.removeEventListener("mouseup", this.handleMouseUp.bind(this), false);
            // this.HexToolTip.removeEventListener("mousemove", this.handleMouseMove.bind(this), false);
            // console.log(this.selectNode);


            // quadTree 다시 생성
            // this.nodeSceneTree.insert(this.selectNode);

            // 초기화
            // this.nodeSceneTreeClear();

            // node 마우스 다운중
            // this.selectNode = null;
            this.mouseDown = false;
        },
        mouseXY(e) {
            //
            // if (!e.offsetX) {
            //     e.offsetX = e.layerX - e.target.offsetLeft;
            //     e.offsetY = e.layerY - e.target.offsetTop;
            // }
            this.mPointer.X = (e.offsetX);
            this.tPointer.X = (e.clientX);
            this.mPointer.Y = (e.offsetY);
            this.tPointer.Y = (e.clientY);
        },
        killEvent() {
            this.HexToolTip.removeEventListener("mouseup", this.handleMouseUp);
            // this.HexToolTip.removeEventListener("mousemove", this.handleMouseMove);
            this.HexToolTip.removeEventListener("mousedown", this.handleMouseDown);
            // this.HexToolTip.removeEventListener("mouseout", this.handleMouseout);
            // this.HexToolTip.removeEventListener("wheel", this.handleMouswheel);
        }
        ,

    }
;

export default mouseEvents;
