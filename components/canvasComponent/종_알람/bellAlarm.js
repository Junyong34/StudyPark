var bellAlarm = (function () {
            function bellAlarm(args) {
                if (!(this instanceof bellAlarm)) {
                    return new bellAlarm(args);
                }

                this.width = 0; // 캔버스 넓이
                this.height = 0; // 캔버스 높이
                this.dom = args.dom; // 캔버스 만들어지는 Dom 위치
                this.requestTimer = {};
                this.setTimeoutTimer = {};

                this.init();

            }

            bellAlarm.prototype.init = function () {

                this.targetW = this.dom.clientWidth;
                this.targetH = this.dom.clientHeight;
                // 캔버스 생성
                this.initCanvas();
                // 초기 프로퍼티 값 셋팅
                this.initProperty();
                this.ctxBG.translate(this.targetW / 2, this.targetH / 2);

                this.initTimer();

                // 정적 그림 그린다.
                this.drawBackground();
            };
            bellAlarm.prototype.initTimer = function () {
                var ix;
                var timerKey;


                for (ix = 0; ix < 3; ix++) {
                    timerKey = "timer-" + ix;
                    this.ctxAniList[ix].translate(this.targetW / 2, this.targetH / 2);
                    this.requestTimer[timerKey] = null;
                    this.setTimeoutTimer[timerKey] = null;
                }
            }
            bellAlarm.prototype.initResize = function () {
                var ix, ixLen;
                var domSize = this.dom.getBoundingClientRect();
                this.targetW = domSize.width; // 캔버스 넓이
                this.targetH = domSize.height; // 캔버스 높이

                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    var devicePixelRatio = window.devicePixelRatio || 1,
                        backingStoreRatio =
                            this.ctxList[ix].webkitBackingStorePixelRatio ||
                            this.ctxList[ix].mozBackingStorePixelRatio ||
                            this.ctxList[ix].msBackingStorePixelRatio ||
                            this.ctxList[ix].oBackingStorePixelRatio ||
                            this.ctxList[ix].backingStorePixelRatio || 1;

                    this.pixelRatio = devicePixelRatio / backingStoreRatio;


                    var context = this.ctxList[ix];
                    // Save the context, so we can reset in case we get replotted.  The
                    // restore ensure that we're really back at the initial state, and
                    // should be safe even if we haven't saved the initial state yet.
                    context.restore();
                    context.save();
                    // 캔버스에 넓이 높이 비율 계산
                    this.canvasList[ix].width = this.targetW * this.pixelRatio;
                    this.canvasList[ix].height = this.targetH * this.pixelRatio;
                    this.canvasList[ix].setAttribute("style", "position:absolute; top:0px; left:0px;border:0px solid;");

                    // css에 높이 넓이
                    this.canvasList[ix].style.width = this.targetW + 'px';
                    this.canvasList[ix].style.height = this.targetH + 'px';
                    // 해상도 높아지면 비율로 캔버스 사이즈 조정
                    context.scale(this.pixelRatio, this.pixelRatio);


                }

                this.initResizeProperty();
                this.canvasItemDraw();

            };

            bellAlarm.prototype.drawBackground = function () {

                // 알람 효과

                this.bellJingle(0);

            };

            bellAlarm.prototype.bellJingle = function (radian, cnt, index) {

                var stnRadian = (Math.PI * 2) * 4;
                var effectCount = (stnRadian - 0.1) / 2;
                var wideValue = cnt || 0;
                var me = this;
                var startX = 20;
                var radius = 50;
                var alpah = 1;
                var timerIndex = index || 0;

                if (this.timer || this.aniJingle) {
                    clearTimeout(this.timer);
                    cancelAnimationFrame(this.aniJingle);
                }

                if (radian >= stnRadian) {
                    return;
                }
                // console.log(radian + ' @' + wideValue  + ' @ ' + stnRadian);
                if (radian >= wideValue) {


                    this.alarmEffectR(startX,radius, alpah, timerIndex);

                    timerIndex++;
                    // this.alarmEffectL();
                    wideValue += effectCount;
                }

                // this.ctxBG.rotate(Math.sin(radian) * 0.2);
                this.ctxBG.rotate(Math.sin(radian) * 0.2);
                this.clear(this.ctxBG);
                this.ctxBG.save();
                this.ctxBG.rect(0, 0, this.targetW, this.targetH);
                this.ctxBG.fillStyle = '#393c43';
                // this.ctxBG.strokeStyle = "red";
                this.ctxBG.fill();
                // this.ctxBG.stroke();
                this.ctxBG.restore();

                this.bellDraw();
                // this.ctxBG.rotate(-Math.sin(radian) * 0.2);
                // this.ctxBG.rotate((Math.PI / 180) * 9);
                this.ctxBG.rotate(-Math.sin(radian) * 0.2);

                this.timer = setTimeout(function () {
                    me.aniJingle = requestAnimationFrame(me.bellJingle.bind(me, radian + (Math.PI / 180) * 40, wideValue,timerIndex));
                }, 0);

            }
            bellAlarm.prototype.alarmEffectR = function (sx,radius, alpah, timerIndex) {
                var startX = sx;
                var startY = 30;
                var radius = radius;
                var alpah = alpah;
                var isExit = false;


                // this.clear(this.ctxAni);
                clearTimeout(this.setTimeoutTimer["timer-" + timerIndex]);
                if (startX > 100) {
                    isExit = true;
                }
                if (alpah < 0) {
                    alpah = 0;
                    isExit = true;
                }

                this.clear(this.ctxAniList[timerIndex]);
                // this.ctxAniList[timerIndex].globalCompositeOperation = 'source-over';
                // this.ctxAniList[timerIndex].shadowBlur = 0;
                // this.ctxAniList[timerIndex].fillStyle = 'rgba(0,0,0,0.5)';
                // this.ctxAniList[timerIndex].fillRect( -200, -200, this.targetW, this.targetH );
                // this.ctxAniList[timerIndex].globalCompositeOperation = 'lighter';
                this.ctxAniList[timerIndex].save();
                this.ctxAniList[timerIndex].globalAlpha = alpah;
                this.ctxAniList[timerIndex].strokeStyle = '#d0d0d0';
                this.ctxAniList[timerIndex].lineWidth = 3;
                this.ctxAniList[timerIndex].beginPath();
                this.ctxAniList[timerIndex].arc(startX, startY, radius, Math.PI * 1.7, Math.PI * 0.3);
                this.ctxAniList[timerIndex].stroke();
                this.ctxAniList[timerIndex].closePath();

                this.ctxAniList[timerIndex].beginPath();
                this.ctxAniList[timerIndex].arc(-startX, startY, radius, Math.PI * 0.7, Math.PI * 1.3);
                this.ctxAniList[timerIndex].stroke();
                this.ctxAniList[timerIndex].closePath();

                this.ctxAniList[timerIndex].restore();


                radius += 3;
                alpah -= 0.1;
                startX += 3;
                if (!isExit) {
                    this.setTimeoutTimer["timer-" + timerIndex] = setTimeout(this.alarmEffectR.bind(this,startX, radius, alpah,timerIndex), 80);
                }


            };

            bellAlarm.prototype.getX = function (x, radian, radius) {
                return x + Math.cos(radian) * radius;
            };

            bellAlarm.prototype.getY = function (y, radian, radius) {
                return y + Math.sin(radian) * radius;
            };
            bellAlarm.prototype.bellDraw = function () {
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.arc(0, 0, 4, Math.PI * 2, false);
                this.ctxBG.strokeStyle = '#d0d0d0';
                this.ctxBG.fillStyle = '#d0d0d0';
                this.ctxBG.fill();
                this.ctxBG.stroke();
                this.ctxBG.closePath();
                this.ctxBG.restore();

                this.ctxBG.save();
                this.ctxBG.lineWidth = 1;
                this.ctxBG.strokeStyle = '#d0d0d0';
                this.ctxBG.fillStyle = '#d0d0d0';
                this.ctxBG.beginPath();
                this.ctxBG.moveTo(1, 0);
                this.ctxBG.quadraticCurveTo(-18, 0, -15, 25);
                this.ctxBG.quadraticCurveTo(-15, 45, -30, 45);
                this.ctxBG.lineTo(0, 45);

                this.ctxBG.stroke();
                this.ctxBG.fill();
                this.ctxBG.closePath();


                this.ctxBG.beginPath();
                this.ctxBG.moveTo(-1, 0);
                this.ctxBG.quadraticCurveTo(18, 0, 15, 25);
                this.ctxBG.quadraticCurveTo(15, 45, 30, 45);
                this.ctxBG.lineTo(0, 45);
                this.ctxBG.fill();
                this.ctxBG.stroke();
                this.ctxBG.closePath();

                this.ctxBG.arc(0, 45, 8, Math.PI * 2, false);
                this.ctxBG.fill();
                this.ctxBG.restore();

                this.ctxBG.beginPath();
                this.ctxBG.save();
                this.ctxBG.lineWidth = 1;
                this.ctxBG.strokeStyle = '#2f2f2f';
                this.ctxBG.arc(0, 45, 5, Math.PI * 0.5, Math.PI * 1, false);
                this.ctxBG.stroke();
                this.ctxBG.closePath();
                this.ctxBG.restore();

            }
            bellAlarm.prototype.initProperty = function () {
                this.colors = {
                    C: '#FD4136',
                    W: "#FFBB3C",
                    N: '#5E97FF',
                    M: "#E6FF00",
                    fontColor: "#DBDBDB",
                }
                this.taskColorList = [
                    '#3ca0ff', '#90db3b', '#00c4c5', '#ffde00', '#ff7781',
                    '#8470ff', '#75cd8e', '#48d1cc', '#fec64f', '#fe984f',
                    '#0052ff', '#00a48c', '#83cfde', '#dfe32d', '#ff7d40',
                    '#99c7ff', '#a5fee3', '#0379c9', '#eef093', '#ffa891',
                    '#00c5cd', '#009bc7', '#cacaff', '#ffc125', '#df6264'
                ];
                this.serverDown = {
                    SERVER_DOWN: "#393c43",
                    SERVER_DOWN_LIGHT: "#85878c",
                }
                this.alarmColor = ["#109ff9", "#ffe045", "#f00e15"];
                this.borderColors = ["#bdbdbd"];
                // this.colors = ["#D7000F"];

                // this.targetDom = document.createElement("div");
                // this.add(this.targetDom);

            };
            bellAlarm.prototype.initCanvas = function () {
                var ix, ixLen;

                this.createCanvas();
                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    this.canvasList[ix].className = this.canvasCls[ix];
                    this.setCanvasConfig(this.canvasList[ix]);
                    this.dom.appendChild(this.canvasList[ix]);
                }
            };

            bellAlarm.prototype.createCanvas = function () {
                this.canvasBG = document.createElement("canvas");
                this.canvasAni0 = document.createElement("canvas");
                this.canvasAni1 = document.createElement("canvas");
                this.canvasAni2 = document.createElement("canvas");

                this.ctxBG = this.canvasBG.getContext("2d");
                this.ctxAni0 = this.canvasAni0.getContext("2d");
                this.ctxAni1 = this.canvasAni1.getContext('2d');
                this.ctxAni2 = this.canvasAni2.getContext('2d');

                this.canvasList = [this.canvasBG, this.canvasAni0, this.canvasAni1, this.canvasAni2];
                this.canvasCls = ["canvasBG", "canvasAni0", "canvasAni1", "canvasAni2"];
                this.ctxList = [this.ctxBG, this.ctxAni0, this.ctxAni1, this.ctxAni2];
                this.ctxAniList = [this.ctxAni0, this.ctxAni1, this.ctxAni2];
            };
            // 캔버스 초기화
            bellAlarm.prototype.clear = function (ctx) {
                ctx.clearRect(-200, -200, ctx.canvas.width, ctx.canvas.height);

            };
            // 캔버스 속성정보 셋팅
            bellAlarm.prototype.setCanvasConfig = function (cvs) {
                cvs.setAttribute("width", this.targetW);
                cvs.setAttribute("height", this.targetH);
                cvs.setAttribute("style", "position:absolute; top:0px; left:0px;");
            };


            bellAlarm.prototype.draw = function () {

            };


            return bellAlarm;
        }


        ()
    )
;
