var Pie2 = (function() {

    function Pie(args) {
        if (!(this instanceof Pie)) {
            return new Pie(args);
        }

        this.init(args);
    }

    Pie.prototype.init = function(args) {
        this.initProperty(args);
        this.initCanvas();

        // this.startClockAnimation();
        // this.stopClockAnimation();
    };

    Pie.prototype.initProperty = function(args) {
        this.dom           = args.dom;

        this.initSizeProps();
        this.initDataProps();
    };

    Pie.prototype.initSizeProps = function() {
        this.domWidth      = this.getWidth();
        this.domHeight     = this.getHeight();

        // Canvas Property
        this.radius        = this.domWidth > this.domHeight ? this.domHeight / 2.65 : this.domWidth / 2.65;
        this.innerRad      = this.radius * 0.90;
        this.outerRad      = this.radius;
        this.cx            = this.domWidth / 2;
        this.cy            = this.domHeight / 2;
        this.pieDevidedBy  = 20;                 // 알람 표시
        this.legendX       = this.cx * 0.43333;  // 범례 박스의 x 좌표
        this.legendY       = this.cy * 1.83333;  // 범례 박스의 y 좌표
        this.legendW       = 360;  // 범례 박스의 width
        this.legendH       = 150;  // 범례 박스의 height
    };

    Pie.prototype.initDataProps = function() {
        // Color
        this.seriesColor   = [
            '#3ca0ff', '#90db3b', '#00c4c5', '#ffde00', '#ff7781',
            '#8470ff', '#75cd8e', '#48d1cc', '#fec64f', '#fe984f',
            '#0052ff', '#00a48c', '#83cfde', '#dfe32d', '#ff7d40',
            '#99c7ff', '#a5fee3', '#0379c9', '#eef093', '#ffa891',
            '#00c5cd', '#009bc7', '#cacaff', '#ffc125', '#df6264'
        ];
        this.alarmColor    = ["#109ff9", "#ffe045", "#f00e15", "#393c43"];

        // Data
        this.data          = null;
        this.txnTotal      = 0;
        this.tpsTotal      = 0;
        this.elapseTotal   = 0;
        this.maxAlarm      = 0;
        this.maxAlarmColor = this.maxAlarm === 0 ? "grey" : this.alarmColor[this.maxAlarm];

        // Event Timer
        this.innerClockTimer = null;
        this.isClockStopped  = false;
        this.timer           = {};
    };

    Pie.prototype.initCanvas = function() {
        this.canvasAnim = document.createElement("canvas");
        this.ctxAnim    = this.canvasAnim.getContext("2d");
        this.canvasAnim.className = "canvasAnim";

        this.alarmDiv = document.createElement("div");
        this.alarmDiv.className = "normalSVG";

        this.radarDiv = document.createElement("div");
        this.radarDiv.className = "normalRadar";

        this.canvasAlarm = document.createElement("canvas");
        this.ctxAlarm    = this.canvasAlarm.getContext("2d");
        this.canvasAlarm.className = "canvasAlarm";

        this.canvasBG = document.createElement("canvas");
        this.ctxBG    = this.canvasBG.getContext("2d");
        this.canvasBG.className = "canvasBG";

        this.initCanvasSize();

        this.dom.appendChild(this.alarmDiv);
        this.dom.appendChild(this.radarDiv);
        this.dom.appendChild(this.canvasAnim);
        this.dom.appendChild(this.canvasAlarm);
        this.dom.appendChild(this.canvasBG);
    };

    Pie.prototype.initCanvasSize = function() {
        this.canvasAnim.setAttribute("width", this.domWidth);
        this.canvasAnim.setAttribute("height", this.domHeight);
        this.canvasAnim.setAttribute("style", "position: absolute; top:0px; left:0px");

        this.alarmDiv.setAttribute("style", "position: absolute; top:" + (this.cy - this.innerRad) + "px; left:" + (this.cx - this.innerRad) + "px;");
        this.alarmDiv.style.width = this.innerRad * 2 + "px";
        this.alarmDiv.style.height = this.innerRad * 2 + "px";

        this.radarDiv.setAttribute("style", "position: absolute; top:" + (this.cy - this.innerRad * 0.74888) + "px; left:" + (this.cx - this.innerRad * 0.74888) + "px");
        this.radarDiv.style.width = this.innerRad * 1.5 + "px";
        this.radarDiv.style.height = this.innerRad * 1.5 + "px";

        this.canvasAlarm.setAttribute("width", this.domWidth);
        this.canvasAlarm.setAttribute("height", this.domHeight);
        this.canvasAlarm.setAttribute("style", "position: absolute; top:0px; left:0px");

        this.canvasBG.setAttribute("width", this.domWidth);
        this.canvasBG.setAttribute("height", this.domHeight);
        this.canvasBG.setAttribute("style", "position: absolute; top:0px; left:0px");
    };

    Pie.prototype.initData = function(data) {

    };

    Pie.prototype.clearAll = function() {
        this.ctxAlarm.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    Pie.prototype.clearAnim = function() {
        this.ctxAnim.clearRect(0, 0, this.canvasAnim.width, this.canvasAnim.height);
    };

    Pie.prototype.clearAlarm = function() {
        this.ctxAlarm.clearRect(0, 0, this.canvasAlarm.width, this.canvasAlarm.height);
    };

    Pie.prototype.clearBG = function() {
        this.ctxBG.clearRect(0, 0, this.canvasBG.width, this.canvasBG.height);
    };

    Pie.prototype.draw = function() {
        this.clearBG();
        this.clearAlarm();
        this.clearAnim();

        // Chart
        this.drawPieChart();
        this.drawInnerPieChart();
        // this.drawInnerCover();
        this.drawValue();
        // this.drawInnerClock();

        // Alarm
        this.drawAlarm();
        this.drawDotBorder();

        // Legend
        // this.drawBackgroundLegend();
        // this.drawLegendLabel();
        // this.drawEqualizer();
    };

    Pie.prototype.drawDotBorder = function() {
        var arcX, arcY, radius, sRad, theta, count, grad;

        radius  = this.radius * 0.01875;   // 점의 반지름
        count   = this.pieDevidedBy;  // 등분 횟수
        theta   = 360 / count;        // 각 점 사이의 각도(한 번에 얼만큼의 각도를 이동해야하는지)
        sRad    = (Math.PI * 1.5) - (Math.PI / 180) * theta;      // 시작 각도

        this.ctxAlarm.save();

        while (count--) {
            sRad += (Math.PI / 180) * theta;
            arcX  = this.getX(this.cx, sRad, this.outerRad);
            arcY  = this.getY(this.cy, sRad, this.outerRad);

            // Blur effect
            if (this.maxAlarm !== 3) {
                grad = this.ctxAlarm.createRadialGradient(arcX, arcY, 0, arcX, arcY, radius * 3.5);
                // grad.addColorStop(0, this.getRGBA(this.maxAlarmColor, 0.75));
                // grad.addColorStop(1, this.getRGBA(this.maxAlarmColor, 0));
                grad.addColorStop(0, this.getRGBA(this.maxAlarmColor, 0.75));
                grad.addColorStop(1, this.getRGBA("#D5D5D5", 0));

                this.ctxAlarm.fillStyle = grad;
                this.ctxAlarm.beginPath();
                this.ctxAlarm.arc(arcX, arcY, radius * 3.5, 0, Math.PI * 2);
                this.ctxAlarm.fill();
                this.ctxAlarm.closePath();
            }

            // Dot
            this.ctxAlarm.fillStyle = this.maxAlarmColor;
            this.ctxAlarm.beginPath();
            this.ctxAlarm.arc(arcX, arcY, radius, 0, Math.PI * 2);
            this.ctxAlarm.fill();
            this.ctxAlarm.closePath();
        }

        this.ctxAlarm.restore();
    };

    Pie.prototype.drawPieChart = function() {
        var i, id;
        var sRad, eRad, lineWidth, txnCount, theta, tickW, emptyW, borderMvto, borderLnTo;

        tickW      = this.radius * 0.009375;
        emptyW     = this.radius * 0.021;
        i          = 0;          // 데이터 변수 카운트
        sRad       = Math.PI * 1.5; // 시작 위치 각도
        eRad       = sRad; // 한 번 그릴 때 어디까지 그려야하는지를 나타내는 종료 위치 각도
        lineWidth  = this.radius * 0.09375;

        // txnTotal이 0인 경우는 대기상태(회색)로 처리하고 종료한다.
        if (this.txnTotal === 0) {
            this.ctxBG.save();
            this.ctxBG.strokeStyle = "grey";
            this.ctxBG.lineWidth   = lineWidth;
            this.ctxBG.globalAlpha = 1;
            this.ctxBG.setLineDash([tickW, emptyW]);
            this.ctxBG.beginPath();
            this.ctxBG.arc(this.cx, this.cy, this.innerRad * 0.8, 0, Math.PI * 2);
            this.ctxBG.stroke();
            this.ctxBG.closePath();
            this.ctxBG.restore();
            return;
        }

        theta      = (Math.PI * 2) / this.txnTotal; // 각 업무당 얼만큼의 영역을 그려야할 지에 대한 지분

        this.ctxBG.save();
        this.ctxBG.lineWidth   = lineWidth;
        this.ctxBG.globalAlpha = 1;
        this.ctxBG.setLineDash([tickW, emptyW]);

        // 데이터가 들어왔을 경우(txnTotal !== 0) 각 비율에 맞게 그려준다.
        for (id in this.data.biz_list) {
            txnCount = this.data.biz_list[id].ACTIVE_TXN_COUNT;
            eRad     = sRad + (theta * txnCount);

            // Donut chart
            this.ctxBG.strokeStyle = this.seriesColor[i];
            this.ctxBG.beginPath();
            this.ctxBG.arc(this.cx, this.cy, this.innerRad * 0.8, sRad, eRad);
            this.ctxBG.stroke();
            this.ctxBG.closePath();

            sRad = eRad;
            i++;
        }

        // 흰색 테두리
        lineWidth  = this.radius * 0.015;
        borderMvto = this.innerRad * 0.85;
        borderLnTo = this.innerRad * 0.665;

        this.ctxBG.lineWidth   = lineWidth;
        this.ctxBG.strokeStyle = "#e4e4e4";
        this.ctxBG.setLineDash([]);
        this.ctxBG.beginPath();
        this.ctxBG.arc(this.cx, this.cy, this.innerRad * 0.86, 0, Math.PI * 2);
        this.ctxBG.stroke();
        this.ctxBG.closePath();

        sRad       = Math.PI * 1.5; // 시작 위치 각도
        eRad       = sRad; // 한 번 그릴 때 어디까지 그려야하는지를 나타내는 종료 위치 각도
        for (id in this.data.biz_list) {
            txnCount = this.data.biz_list[id].ACTIVE_TXN_COUNT;
            eRad     = sRad + (theta * txnCount);

            this.ctxBG.moveTo( this.getX(this.cx, sRad, borderMvto), this.getY(this.cy, sRad, borderMvto) );
            this.ctxBG.lineTo( this.getX(this.cx, sRad, borderLnTo), this.getY(this.cy, sRad, borderLnTo) );

            sRad = eRad;
            i++;
        }
        this.ctxBG.stroke();

        this.ctxBG.restore();
    };

    Pie.prototype.drawInnerPieChart = function() {
        var i, j, id;
        var cirRad, arcX, arcY, sRad, eRad, tickW, emptyW, txnCount, theta;

        tickW      = this.radius * 0.009375;
        emptyW     = this.radius * 0.025;
        i          = 0;          // 데이터 변수 카운트
        sRad       = Math.PI * 1.5; // 시작 위치 각도
        eRad       = sRad; // 한 번 그릴 때 어디까지 그려야하는지를 나타내는 종료 위치 각도
        // cirRad     = this.radius * 0.015;
        cirRad     = this.radius * 0.01739;
        theta      = (Math.PI * 2) / this.txnTotal; // 각 업무당 얼만큼의 영역을 그려야할 지에 대한 지분

        this.ctxBG.save();

        // Border
        for (i = 0.8, j = 0; j < 3; i -= 0.13, j++) {
            this.ctxBG.save();
            this.ctxBG.strokeStyle = "grey";
            this.ctxBG.lineWidth = this.radius * 0.00469;
            this.ctxBG.globalAlpha = 1;
            this.ctxBG.setLineDash([tickW, emptyW]);
            this.ctxBG.beginPath();
            this.ctxBG.arc(this.cx, this.cy, (this.innerRad * 0.82787) * i, 0, Math.PI * 2);
            this.ctxBG.stroke();
            this.ctxBG.closePath();
            this.ctxBG.restore();
        }

        // txnTotal이 0인 경우엔 행성은 그리지 않고 고리만 그린다.
        if (this.txnTotal === 0) {
            return;
        }

        // Circle

        i = 0;
        this.ctxBG.globalAlpha = 1;
        for (id in this.data.biz_list) {
            txnCount = this.data.biz_list[id].ACTIVE_TXN_COUNT;
            eRad     = sRad + (theta * txnCount);

            arcX = this.getX(this.cx, sRad, this.innerRad * 0.665);
            arcY = this.getY(this.cy, sRad, this.innerRad * 0.665);

            this.ctxBG.fillStyle = this.seriesColor[i];
            this.ctxBG.beginPath();
            this.ctxBG.arc(arcX, arcY, cirRad, 0, Math.PI * 2);
            this.ctxBG.fill();
            this.ctxBG.closePath();

            sRad = eRad;
            i++;
        }

        this.ctxBG.restore();
    };

    Pie.prototype.drawInnerCover = function() {
        var grad;

        this.ctxBG.save();

        grad = this.ctxBG.createRadialGradient(this.cx, this.cy, this.innerRad * 0.54, this.cx, this.cy, 0);
        grad.addColorStop(0, "rgba(234, 234, 234, 0.1)");
        grad.addColorStop(1, "transparent");

        // this.ctxBG.fillStyle = grad;
        this.ctxBG.beginPath();
        this.ctxBG.arc(this.cx, this.cy, (this.innerRad * 0.81) * 0.54, 0, Math.PI * 2);
        this.ctxBG.fill();
        this.ctxBG.closePath();

        this.ctxBG.restore();
    };

    Pie.prototype.drawValue = function() {
        var data, activeTxn, tps, elapse;
        var fontSize, tx, ty;

        data      = this.data;
        activeTxn = this.txnTotal;
        tps       = this.getComma(this.tpsTotal);
        elapse    = this.elapseTotal.toFixed(3);

        this.ctxBG.save();
        this.ctxBG.fillStyle = "#ffffff";
        this.ctxBG.shadowColor = "#ffffff";
        this.ctxBG.shadowBlur = 10;

        // Active Transation Total
        if      (activeTxn >= 1000) { ty = this.cy + this.radius * 0.1;  fontSize = this.radius * 0.3; }
        else if (activeTxn >= 100)  { ty = this.cy + this.radius * 0.13; fontSize = this.radius * 0.4; }
        else                        { ty = this.cy + this.radius * 0.15; fontSize = this.radius * 0.5; }

        this.ctxBG.font = "bold " + fontSize + "px Droid Sans";
        activeTxn = this.getComma(activeTxn);
        tx = this.cx - this.ctxBG.measureText(activeTxn).width / 2;
        this.ctxBG.fillText(activeTxn, tx, ty);

        // TPS
        if      (tps >= 1000) { ty = this.cy + this.radius * 0.32;  fontSize = this.radius * 0.11; }
        else if (tps >= 100)  { ty = this.cy + this.radius * 0.32;  fontSize = this.radius * 0.12; }
        else                  { ty = this.cy + this.radius * 0.32;  fontSize = this.radius * 0.13; }

        this.ctxBG.font = "bold " + fontSize + "px Droid Sans";
        tps = "TPS " + this.getComma(tps);
        tx = this.cx - this.ctxBG.measureText(tps).width / 2;
        this.ctxBG.fillText(tps, tx, ty);

        // Elapse
        // this.ctxBG.font = this.radius * 0.15 + "px Droid Sans";
        // this.ctxBG.fillText("Elapse " + elapse, this.cx - this.ctxBG.measureText("Elapse " + elapse).width / 2, this.cy + this.radius * 0.615);

        this.ctxBG.restore();
    };

    Pie.prototype.drawAlarm = function() {
        var list, alarm;
        var sRad, eRad, lineWidth, txnCount, theta;

        if (this.txnTotal === 0) {
            return;
        }

        sRad       = Math.PI * 1.5; // 시작 위치 각도
        eRad       = sRad; // 한 번 그릴 때 어디까지 그려야하는지를 나타내는 종료 위치 각도
        lineWidth  = this.radius * 0.09375;
        theta      = (Math.PI * 2) / this.txnTotal; // 각 업무당 얼만큼의 영역을 그려야할 지에 대한 지분

        for (list in this.data.biz_list) {
            txnCount = this.data.biz_list[list].ACTIVE_TXN_COUNT;
            eRad     = sRad + (theta * txnCount);
            alarm    = this.data.biz_list[list].ALARM_LEVEL;

            if (alarm !== 0 && alarm !== 3) {
                if (!this.timer[list]) {
                    this.timer[list] = null;
                }
                this.startWaiveAnimation(sRad, eRad, this.alarmColor[alarm], list);
            }

            sRad = eRad;
        }
    };

    ////////////// ANIMATION //////////////
    Pie.prototype.drawInnerClock = function(rad) {
        var tickW, emptyW;

        rad = rad || 0;
        tickW = this.radius * 0.009375;
        emptyW = this.radius * 0.025;

        this.clearAnim();

        this.ctxAnim.save();

        this.ctxAnim.setLineDash([tickW, emptyW]);
        this.ctxAnim.strokeStyle = "grey";
        this.ctxAnim.lineWidth = this.radius * 0.09375;
        this.ctxAnim.beginPath();
        this.ctxAnim.arc(this.cx, this.cy, this.innerRad * 0.88, rad, Math.PI * 2 + rad);
        this.ctxAnim.stroke();
        this.ctxAnim.closePath();

        this.ctxAnim.restore();

        cancelAnimationFrame(this.innerClockTimer);

        if (this.isClockStopped) {
            return;
        }

        // console.log(this.innerClockTimer);

        this.innerClockTimer = requestAnimationFrame(this.drawInnerClock.bind(this, rad + (Math.PI / 180) / 7));
    };

    Pie.prototype.drawBackgroundLegend = function() {
        var sx, sy, dx, dy;

        sx = this.legendX;  // 시작 x 좌표
        sy = this.legendY;  // 시작 y 좌표
        dx = this.legendW; // x변 길이
        dy = this.legendH; // y변 길이

        this.ctxBG.save();

        this.ctxBG.fillStyle = "#1C1C1C";
        this.ctxBG.fillRect(sx, sy, dx, dy);

        this.ctxBG.restore();
    };

    Pie.prototype.stopClockAnimation = function() {
        this.isClockStopped = true;
        this.innerClockTimer = null;
        cancelAnimationFrame(this.innerClockTimer);
    };

    Pie.prototype.startClockAnimation = function() {
        this.isClockStopped = false;
        this.innerClockTimer = requestAnimationFrame(this.drawInnerClock.bind(this));
    };

    Pie.prototype.startWaiveAnimation = function(sRad, eRad, c, tagName, count, point) {
        var i, j, o, cnt, sPoint;

        cnt = typeof count === "undefined" ? 1 : count;
        sPoint = typeof point === "undefined" ? 0.61 : point;

        if (cnt >= 7) {
            clearTimeout(this.timer[tagName]);
            return;
        }

        this.ctxAlarm.save();
        this.ctxAlarm.lineWidth   = this.radius * 0.07948;

        // 검은 배경
        this.ctxAlarm.strokeStyle = "#000000";
        for (i = 0.87, j = 0; j < 3; i -= 0.13, j++) {
            if (i < 0.61) {
                break;
            }

            this.ctxAlarm.beginPath();
            this.ctxAlarm.arc(this.cx, this.cy, (this.innerRad * 0.82787) * i, sRad, eRad);
            this.ctxAlarm.stroke();
            this.ctxAlarm.closePath();
        }

        // 알람
        this.ctxAlarm.strokeStyle = c;
        for (i = sPoint, j = 0, o = 1; j < 3; i -= 0.13, j++, o -= 0.33) {
            if (i < 0.61) {
                break;
            } else if (i > 0.87) {
                continue;
            }

            this.ctxAlarm.globalAlpha = o;
            this.ctxAlarm.beginPath();
            this.ctxAlarm.arc(this.cx, this.cy, (this.innerRad * 0.82787) * i, sRad, eRad);
            this.ctxAlarm.stroke();
            this.ctxAlarm.closePath();
        }

        this.ctxAlarm.restore();

        cnt++;
        sPoint += 0.13;

        clearTimeout(this.timer[tagName]);
        this.timer[tagName] = setTimeout(this.startWaiveAnimation.bind(this, sRad, eRad, c, tagName, cnt, sPoint), 300);
    };

    /**
     * 파라미터 구조는 다음과 같아야 한다.
     * data = [
     *   { id: 1, maxAlarm: 0 }
     * ]
     *
     * maxAlarm: 0 | 1 | 2 | 3
     */
    // Pie.prototype.onAlarm = function(data, maxAlarm) {
    //     var ix, ixLen, id;
    //     var alarmColor;
    //
    //     for(ix = 0, ixLen = data.length; ix < ixLen; ix++) {
    //
    //     }
    //
    //     alarmColor = this.alarmColor[maxAlarm];
    //     this.maxAlarm = this.maxAlarm < maxAlarm ? maxAlarm : this.maxAlarm;
    //     this.maxAlarmColor = this.maxAlarm === 0 ? "grey" : this.alarmColor[this.maxAlarm];
    //
    //     this.clearAlarm();
    //     this.drawDotBorder(alarmColor);
    // };

    Pie.prototype.setData  = function(data) {
        this.data = data;

        if (data.max_alarm === "undefined") debugger;

        this.txnTotal = data.total_active_txn;
        this.tpsTotal = data.total_tps;
        this.maxAlarm = data.max_alarm;
        this.maxAlarmColor = this.alarmColor[this.maxAlarm];

        console.log(this.maxAlarm);

        switch (this.maxAlarm) {
            case 0:
                this.alarmDiv.className = "normalSVG";
                this.radarDiv.className = "normalRadar";
                break;

            case 1:
                this.alarmDiv.className = "warningSVG";
                this.radarDiv.className = "warningRadar";
                break;

            case 2:
            case 3:
                this.alarmDiv.className = "criticalSVG";
                this.radarDiv.className = "criticalRadar";
                break;

            // case 3:
            //     break;

            default :
        }
    };

    Pie.prototype.getX = function(x, radian, radius) {
        return x + Math.cos( radian ) * radius;
    };

    Pie.prototype.getY = function(y, radian, radius) {
        return y + Math.sin( radian ) * radius;
    };

    Pie.prototype.getRGBA = function(color, opacity) {
        if (color[0] === "#") {
            color = color.substr(1);
        }

        var r, g, b, a;

        r = parseInt(color.substr(0, 2), 16);
        g = parseInt(color.substr(2, 2), 16);
        b = parseInt(color.substr(4, 2), 16);
        a = opacity;

        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };

    Pie.prototype.getWidth = function() {
        return this.dom.clientWidth || this.dom.width;
    };

    Pie.prototype.getHeight = function() {
        return this.dom.clientHeight || this.dom.height;
    };

    Pie.prototype.getComma = function(v) {
        return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    Pie.prototype.resize = function() {
        // Canvas resize
        this.initSizeProps();
        this.initCanvasSize();
    };

    return Pie;

})();;