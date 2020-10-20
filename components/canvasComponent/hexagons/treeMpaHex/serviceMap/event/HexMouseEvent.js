const mouseEvents = {
	createMouseEvents() {
		this.evMouseDown = this.handleMouseDown.bind(this);
		this.evMouseMove = this.handleMouseMove.bind(this);
		this.evMouseUp = this.handleMouseUp.bind(this);
		this.evMouseLeave = this.handleMouseLeave.bind(this);
		this.canvasDom.addEventListener('mousedown', this.evMouseDown);
		this.canvasDom.addEventListener('mousemove', this.evMouseMove);
		this.canvasDom.addEventListener('mouseup', this.evMouseUp, false);
		this.canvasDom.addEventListener('mouseleave', this.evMouseLeave);
	},
	selectHexSearch() {
		return this.GetHexAt(this.mPointer);
	},
	handleMouseMove(e) {
		e.preventDefault();
		this.mouseXY(e);

		// if (this.selectHex !== null) {
		//
		// }
		// this.selectHex = this.selectHexSearch();
		// console.log(this.selectHex);
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
		this.selectHex = this.selectHexSearch();
		if (e.button === 0) {
			if (this.selectHex) this.hexClickHandler.call(this, e, this.selectHex);
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
	handleMouseLeave(e) {
		if (this.isShow && !this.selectHex) this.tooltipHide();
		// this.ctxClear(this.ctx);
	},

	handleMouseUp(e) {
		// e.stopPropagation();
		// e.preventDefault();

		// if (this.selectNode == null) {
		//     this.mouseDown = false;
		//     return;
		// }
		// this.ctx.removeEventListener("mouseup", this.handleMouseUp.bind(this), false);
		// this.ctx.removeEventListener("mousemove", this.handleMouseMove.bind(this), false);
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
		this.mPointer.X = e.offsetX;
		this.tPointer.X = e.clientX;
		this.mPointer.Y = e.offsetY;
		this.tPointer.Y = e.clientY;
	},
	killEvent() {
		this.canvasDom.removeEventListener('mouseup', this.evMouseUp);
		this.canvasDom.addEventListener('mousemove', this.evMouseMove);
		this.canvasDom.removeEventListener('mousedown', this.evMouseDown);
		this.canvasDom.removeEventListener('mouseleave', this.evMouseLeave);
	},
};
export default mouseEvents;
