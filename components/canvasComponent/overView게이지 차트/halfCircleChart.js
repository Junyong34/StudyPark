class halfCircleChart {
    constructor(props) {
        // 헤더정보
        this.initProperty();
        Object.keys(props).forEach(key => {
            this[key] = props[key];
        });
        this.init()
    }

    init() {
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
        this.seriesColor = [
            '#3ca0ff', '#90db3b', '#00c4c5', '#ffde00', '#ff7781',
            '#8470ff', '#75cd8e', '#48d1cc', '#fec64f', '#fe984f',
            '#0052ff', '#00a48c', '#83cfde', '#dfe32d', '#ff7d40',
            '#99c7ff', '#a5fee3', '#0379c9', '#eef093', '#ffa891',
            '#00c5cd', '#009bc7', '#cacaff', '#ffc125', '#df6264'
        ];
        this.topGaugeColor = "#a280ff";
        this.bottomGaugeColor = "#41e59e";

        // Data
        this.data = null;

        // Event Timer
        this.innerClockTimer = null;
        this.isClockStopped = false;
        this.timer = {};
    }

    getWidth() {
        return this.dom.clientWidth || this.dom.width;
    }

    getHeight() {
        return this.dom.clientHeight || this.dom.height;
    }

    draw() {
        this.clearBG();
        this.clearAnim();
        // 배경원
        this.backGroundCircle();
        // 배경 게이지
        this.drawbgGauge();
        // 글자 생성
        this.nameList({type: 'Pods'});
        this.nameList({type: 'Worker Nodes'});

        // 점 그리기
        this.darwDot({type: 'right', color: '#ff7781'});
        this.darwDot({type: 'left', color: '#24b6b8'});

        // 애니메이션 처리 로직
        this.drawPodsCount();
        this.drawNodesCount();
        this.animDrawGaugeTop();
        this.animDrawGaugeBottom();
    }

    drawPodsCount() {
        let totalCount = 30;
        let afterCount = 25;
        let beforeCount = 10;
        let topTextFontSize = 40;
        let textValue = afterCount;
        let tWidth;
        let tx;
        let ty;
        let arcX;
        let arcY;
        let lRad = Math.PI * 1.2;


        this.ctxAnim.save();
        // 실제 카운터 값
        this.ctxAnim.fillStyle = this.topGaugeColor;
        this.ctxAnim.font = "bold " + topTextFontSize + "px Droid Sans, Helvetica";

        arcX = this.getX(this.cx, lRad, this.innerRad);
        arcY = this.getY(this.cy, lRad, this.innerRad);

        tWidth = this.ctxAnim.measureText(textValue).width;
        tx = arcX + (this.radius * 0.4);
        ty = arcY + (this.radius * 0.2);
        this.ctxAnim.align = "center";
        this.ctxAnim.fillText(textValue, tx, ty);


        // 토탈 카운터 값
        topTextFontSize = 15;
        this.ctxAnim.font = topTextFontSize + "px Droid Sans, Helvetica";
        this.ctxAnim.align = "center";
        tx += tWidth;
        ty = ty
        // 텍스트 좌표
        this.ctxAnim.fillText("/" + totalCount, tx, ty);
        this.ctxAnim.restore();
    }

    drawNodesCount() {
        let totalCount = 5;
        let afterCount = 3;
        let beforeCount = 10;
        let topTextFontSize = 40;
        let textValue = afterCount;
        let tWidth;
        let tx;
        let ty;
        let arcX;
        let arcY;
        let lRad = Math.PI * 0.8;


        this.ctxAnim.save();
        // 실제 카운터 값
        this.ctxAnim.fillStyle = this.bottomGaugeColor;
        this.ctxAnim.font = "bold " + topTextFontSize + "px Droid Sans, Helvetica";

        arcX = this.getX(this.cx, lRad, this.innerRad);
        arcY = this.getY(this.cy, lRad, this.innerRad);

        tWidth = this.ctxAnim.measureText(textValue).width;
        tx = arcX + (this.radius * 0.65);  // 숫자가 한자리 0.65 숫자가 두자리 0.4 숫자 3자리 0.15
        ty = arcY + (this.radius * 0.15);
        this.ctxAnim.align = "center";
        this.ctxAnim.fillText(textValue, tx, ty);


        // 토탈 카운터 값
        topTextFontSize = 15;
        this.ctxAnim.font = topTextFontSize + "px Droid Sans, Helvetica";
        this.ctxAnim.align = "center";
        tx += tWidth;
        ty = ty
        // 텍스트 좌표
        this.ctxAnim.fillText("/" + totalCount, tx, ty);
        this.ctxAnim.restore();
    }

    animDrawGaugeTop() {

    }

    animDrawGaugeBottom() {

    }

    nameList({type}) {
        let topText = type;
        let topTextFontSize = 12;
        let tWidth;
        let tx;
        let ty;


        this.ctxBG.save();
        this.ctxBG.fillStyle = type === "Pods" ? this.topGaugeColor : this.bottomGaugeColor;
        this.ctxBG.font = topTextFontSize + "px Droid Sans, Helvetica";

        tWidth = this.ctxBG.measureText(topText).width;
        tx = (this.cx - (tWidth * 0.5));
        ty = type === "Pods" ? (this.cy - topTextFontSize * 0.4) : (this.cy + topTextFontSize);

        this.ctxBG.align = "center";
        // 텍스트 좌표
        this.ctxBG.fillText(topText, tx, ty);
        this.ctxBG.restore();

        // this.ctxBG.save();
        // this.ctxBG.fillStyle = this.bottomGaugeColor;
        // this.ctxBG.font = "15px Droid Sans, Helvetica";
        // this.ctxBG.align = "center";
        // // 텍스트 좌표
        // this.ctxBG.fillText(text, tx, ty)
        // this.ctxBG.restore();

    }

    backGroundCircle() {
        let backgroundCircleCount = 6;
        let globalAlpha = 1;
        let bgcircleRadius = this.innerRad * 1.2;

        for (let ix = 0; ix <= backgroundCircleCount; ix++) {
            globalAlpha -= 0.2;
            bgcircleRadius *= 1.3;
            this.ctxBG.save();
            this.ctxBG.strokeStyle = "#5a5b5b";
            this.ctxBG.globalAlpha = globalAlpha;
            this.ctxBG.beginPath();
            this.ctxBG.arc(this.cx, this.cy, bgcircleRadius, 0, Math.PI * 2);
            this.ctxBG.stroke();
            this.ctxBG.closePath();
            this.ctxBG.restore();
            this.ctxBG.closePath();
        }
    }

    dotCount() {
        let dotArea = (this.domWidth / 2) - this.innerRad;
        // 점 개수
        return dotArea / ((this.smallDotRad * 2) + this.dotSpace);

    }

    drawbgGauge() {
        this.ctxBG.save();
        this.ctxBG.strokeStyle = "grey";
        this.ctxBG.globalAlpha = 1;
        this.ctxBG.beginPath();
        this.ctxBG.lineWidth = 4;
        this.ctxBG.shadowBlur = 20;
        this.ctxBG.shadowColor = "black";
        this.ctxBG.arc(this.cx, this.cy, this.innerRad, 0, Math.PI * 2);
        this.ctxBG.stroke();
        this.ctxBG.closePath();
        this.ctxBG.restore();

        // this.ctxBG.beginPath();
        // this.ctxBG.arc(this.cx, this.cy, this.radius * 0.01739, 0, Math.PI * 2);
        // this.ctxBG.stroke();
        this.ctxBG.closePath();

    }

    darwDot({type, color}) {
        let arcX;
        let arcY;
        let lRad = type === 'left' ? Math.PI * 1 : Math.PI * 0;
        // 점 개수 구한다.
        let dotCount = this.dotCount();
        let datRad = this.smallDotRad;
        let dotMargin = (this.smallDotRad * 2) + this.dotSpace;
        arcX = this.getX(this.cx, lRad, this.innerRad);
        arcY = this.getY(this.cy, lRad, this.innerRad);
        console.log(dotCount);
        for (let ix = 0; ix <= dotCount; ix++) {

            if (type === 'left') {
                arcX -= dotMargin;
            } else {
                arcX += dotMargin;
            }
            this.ctxBG.save();
            this.ctxBG.fillStyle = color;
            this.ctxBG.beginPath();
            this.ctxBG.arc(arcX, arcY, datRad, 0, Math.PI * 2);
            this.ctxBG.fill();
            this.ctxBG.closePath();
            this.ctxBG.restore();
        }


    }
    drawDial(){

        if (this.setTimer) clearTimeout(this.setTimer);

        this.setTimer = setTimeout(function () {
            cancelAnimationFrame(this.dialTimer);
                this.dialTimer = requestAnimationFrame(this.drawDial);

        }.bind(this), 500);

        console.log(1);
        console.log(2);
    }

    getX(x, radian, radius) {
        return x + Math.cos(radian) * radius;
    }

    getY(y, radian, radius) {
        return y + Math.sin(radian) * radius;
    }

    clearBG() {
        this.ctxBG.clearRect(0, 0, this.canvasBG.width, this.canvasBG.height);
    }

    clearAnim() {
        this.ctxAnim.clearRect(0, 0, this.canvasAnim.width, this.canvasAnim.height);
    }

    resize() {
        this.initSizeProps();
        this.initCanvasSize();
    }
}

// export default ServiceCall;
