export default class baseScene {
	constructor(props) {
		this.initProperty();
		this.mergeFn();
		Object.keys(props).forEach(key => {
			this[key] = props[key];
		});

		this.init();
	}
	init() {
		this.initSizeProps();
		this.initCanvas();
		this.initCanvasEvent();
	}
	initCanvas() {
		this.basePanel = document.createElement('canvas');
		this.ctxPanel = this.basePanel.getContext('2d');
		this.basePanel.className = 'basePanel';

		this.ctxList = [this.ctxPanel];

		this.initCanvasSize();
		this.ctxList.forEach(ctx => this.devicePixelRatio(ctx));
		this.dom.appendChild(this.basePanel);
	}
	devicePixelRatio(ctx) {
		const devicePixelRatio = window.devicePixelRatio || 1;

		this.backingStoreRatio =
			ctx.webkitBackingStorePixelRatio ||
			ctx.mozBackingStorePixelRatio ||
			ctx.msBackingStorePixelRatio ||
			ctx.oBackingStorePixelRatio ||
			ctx.backingStorePixelRatio ||
			1;

		this.pixelRatio = devicePixelRatio / this.backingStoreRatio;
		this.oldPixelRatio = this.pixelRatio;
		this.pixelRatio = 1; // 브라우저 스케일 확대축소 버그 때문에 무조건 1로 지정
	}
	ctxClear(ctx) {
		ctx.clearRect(0, 0, this.domWidth, this.domHeight);
	}
	allCtxClear() {
		this.ctxList.forEach(c => this.ctxClear(c));
	}
	initCanvasSize(initWidth = this.domWidth, initHeight = this.domHeight) {
		this.basePanel.setAttribute('width', initWidth);
		this.basePanel.setAttribute('height', initHeight);
		this.basePanel.setAttribute('style', 'position: absolute; top:0px; left:0px;');

		// this.HexGridCreate();
	}
	initProperty() {
		this.dom = null;
		this.serviceMapData = null;
		this.hexClickHandler = null;
		this.hexMoveHandler = null;
		this.boxTitleHeight = 40;
	}
	initCanvasEvent() {
		// 이벤트 생성 및 bind
	}
	killEvent() {
		// 이벤트 제거
	}
	destroy() {
		this.killEvent();
		// dom 제거
		// document.body.removeChild(this.dom);
	}
	initSizeProps() {
		this.domWidth = this.getWidth(this.dom);
		this.domHeight = this.getHeight(this.dom);
	}
	getWidth(dom) {
		return dom.clientWidth || dom.width;
	}

	getHeight(dom) {
		return dom.clientHeight || dom.height;
	}

	mergeFn() {}
}
