var RTMEqualizerChart = (function () {
            function RTMEqualizerChart(args) {
                if (!(this instanceof RTMEqualizerChart)) {
                    return new RTMEqualizerChart(args);
                }

                this.width = args.width; // 캔버스 넓이
                this.height = args.height; // 캔버스 높이
                this.dom = args.dom; // 캔버스 만들어지는 Dom 위치
                this.ratioW = 0;
                this.ratioH = 0;
                this.taskLength = 7.5; // 업무 개수
                this.titleH = 40;
                this.init();
            }

            RTMEqualizerChart.prototype.init = function () {

                // 초기 프로퍼티 값 셋팅
                this.initProperty();
                // 캔버스 생성
                this.initCanvas();
                this.initComponent();
                // 정적 그림 그린다.
                this.drawBackground();


                // this.draw();


                // 클릭 이벤트
                // this.clickEventCall();
                // 페이징 정보 추출
                // this.pageInfo();

                // 이미지 위치
                // this.ctxBG.translate(10, 10);
                // 객체 위치
                // this.ctxRenderer.translate(20, 20);
                // this.draw(this.sampleData);
            };
            RTMEqualizerChart.prototype.initResize = function () {
                var ix, ixLen;
                var domSize = this.dom.getBoundingClientRect();
                console.log("Window size: width=" + domSize.width + ", height=" + domSize.height);
                this.width = domSize.width; // 캔버스 넓이
                this.height = domSize.height; // 캔버스 높이
                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    this.canvasList[ix].setAttribute("width", this.width);
                    this.canvasList[ix].setAttribute("height", this.height);
                    this.canvasList[ix].setAttribute("style", "position:absolute; top:0px; left:0px;border:1px solid;");
                }
                this.initResizeProperty();
                this.drawBackground();

            };
            RTMEqualizerChart.prototype.initResizeProperty = function () {
                this.ratioW = this.width * 0.04;
                this.ratioH = this.height * 0.02;
                this.Hspace = this.ratioW;
                this.Vspace = this.ratioH;
                this.sx = 30;
                this.sy = 20;
                this.alarmBox = {
                    lineLength: this.width -35,
                    height: ((this.height - this.sy) / this.taskLength) ,
                    edge: 20 ,
                };

            }
            RTMEqualizerChart.prototype.initProperty = function () {
                this.ratioW = this.width * 0.04;
                this.ratioH = this.height * 0.02;
                this.backgroundColor = "#424242";
                this.rectMaxCount = 15;
                this.isToolTip = true;
                this.sx = 30;
                this.sy = 20;
                this.alarmBox = {
                    lineLength: this.width -35,
                    height: ((this.height - this.sy) / this.taskLength) ,
                    edge: 20 ,
                };
                this.Hspace = this.ratioW;
                this.Vspace = this.ratioH;
                this.basicX = 0;
                this.basicY = 0;
                this.logo = {
                    radius: 10,
                    rectWH: 10,
                };
                this.activeSumTextWidth = 40; // 40px은 10000까지 길이 20폰트
                this.rectMargin = 1;
                this.activeTotalCount = 0;
                this.activeX = 0;
                this.activeY = 0;
                this.activeLength = []; // ActiveTranscation 길이
                this.colors = {
                    C: "#D7000F",
                    W: "#FF9803",
                    N: "#42A5F6",
                    M: "#E6FF00",
                    fontColor: "#E7E7E7",
                }
                this.taskColorList = ['#D65BD7', '#D7C364', '#71d758', '#61d78a', '#6baed7']
                this.borderColors = ["#bdbdbd"];
                // this.colors = ["#D7000F"];
            };
            RTMEqualizerChart.prototype.initCanvas = function () {
                var ix, ixLen;

                this.createCanvas();
                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    this.canvasList[ix].className = this.canvasCls[ix];
                    this.setCanvasConfig(this.canvasList[ix]);
                    this.dom.appendChild(this.canvasList[ix]);
                }
            };

            RTMEqualizerChart.prototype.createCanvas = function () {
                this.canvasBG = document.createElement("canvas");
                this.canvasAni = document.createElement("canvas");

                this.ctxBG = this.canvasBG.getContext("2d");
                this.ctxAinBG = this.canvasAni.getContext('2d');

                this.canvasList = [this.canvasBG, this.canvasAni];
                this.canvasCls = ["canvasBG", "canvasAni"];
                this.ctxList = [this.ctxBG, this.ctxAinBG];
            };
            // 캔버스 초기화
            RTMEqualizerChart.prototype.clear = function (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            };
            // 캔버스 속성정보 셋팅
            RTMEqualizerChart.prototype.setCanvasConfig = function (cvs) {
                cvs.setAttribute("width", this.width);
                cvs.setAttribute("height", this.height);
                cvs.setAttribute("style", "position:absolute; top:0px; left:0px;border:1px solid;");
            };
            RTMEqualizerChart.prototype.clickEventCall = function () {
                var self = this;
                this.canvasRenderer.addEventListener('mousemove', function (evt) {

                    var rect = self.canvasRenderer.getBoundingClientRect();
                    var x = evt.clientX - rect.left;
                    var y = evt.clientY - rect.top;
                    var serverId;
                    // 엔트리 정보 좌표 추출
                    var entity = self.findEntity(x, y);
                    // 서버목록 객체가아니면 마우스 무브 이벤트 걸지않는다.

                    if (entity) {
                        self.dom.style.cursor = 'pointer';
                        if (entity.constructor === EEDAlarmStatus) {
                            // 툴팁 이벤트 건다.
                            // alarmLevel !== 0 일때만 실행(normal 이 아닐때만)
                            if (entity.alarmLevel > 0) {
                                serverId = entity.serverId;

                                if (self.localData.alarmList[serverId]) {
                                    self.showAlertDetail(entity.sx, entity.sy, self.localData.alarmList[serverId], entity.serverName);
                                }
                            } else {
                                // normal
                                if (self.isToolTip) {
                                    var contents = entity.serverName;
                                    var wn = $(".rtmInsTaskAlarm");
                                    var offset = wn.offset();

                                    $('<div id="ins_tooltip">' + contents + '</div>').css({
                                        position: 'absolute',
                                        display: 'none',
                                        left: offset.left + entity.sx - 5,
                                        top: offset.top + entity.sy + 67,
                                        border: '2px solid #1c1d1f ',
                                        padding: '5',
                                        // color: item.series.label === "오늘" ? '#01a9fc' : '#7ecd2a',
                                        size: '10',
                                        'border-radius': '6px 6px 6px 6px',
                                        'background-color': '#212227 ',
                                        opacity: 0.80
                                    }).appendTo("body").fadeIn(20);

                                    self.isToolTip = false;
                                }
                            }
                        }

                    } else {
                        self.dom.style.cursor = 'default';
                        self.hideAlertDetail();

                        $("#ins_tooltip").remove();
                        self.isToolTip = true;
                    }

                });
                this.canvasRenderer.addEventListener('click', function (evt) {

                    var rect = self.canvasRenderer.getBoundingClientRect();
                    var x = evt.clientX - rect.left;
                    var y = evt.clientY - rect.top;
                    // 엔트리 정보 좌표 추출
                    var entity = self.findEntity(x, y);
                    // 서버목록 객체가아니면 마우스 무브 이벤트 걸지않는다.
                    if (entity) {
                        if (entity.constructor === EEDAlarmStatusDotDot) {
                            // 클릭 이벤트 건다.
                            if (entity.type === 'ins') {
                                self.subPageChange(entity);
                            } else {
                                self.mainPageChange(entity);
                            }

                        }

                    } else {
                    }

                });
            };
            RTMEqualizerChart.prototype.findEntity = function (x, y) {
                this.clear(this.ctxRenderer);
                if (this.serverEntities.length === 0) return;

                for (var i = this.serverEntities.length - 1; i >= 0; i--) {
                    var entity = this.serverEntities[i];
                    entity.drawDetectionPath(this.ctxRenderer);
                    if (this.ctxRenderer.isPointInPath(x, y)) {
                        return entity;
                    }
                }
                return null;

            };
            // 마우스 좌표
            RTMEqualizerChart.prototype.mousePos = function (evt) {
                this.rect = this.canvasBG.getBoundingClientRect();
                return {
                    x: evt.clientX - this.rect.left,
                    y: evt.clientY - this.rect.top
                };

            };


            RTMEqualizerChart.prototype.initComponent = function (args) {
                var me = this;
                this.eqRect = {
                    x: 0,
                    y: 0,
                    w: 5,
                    h: 30,
                    color: me.colors.W,
                    draw: function () {
                        me.ctxAinBG.save();
                        // me.ctxAinBG.globalAlpha = 0.5;
                        me.ctxAinBG.beginPath();
                        me.ctxAinBG.fillStyle = this.color;
                        me.ctxAinBG.shadowColor = '#1d0b15';
                        me.ctxAinBG.shadowBlur = 5;
                        me.ctxAinBG.fillRect(this.x, this.y, this.w, this.h);
                        me.ctxAinBG.fill();
                        // me.ctxAinBG.strokeStyle = me.borderColors[0];
                        // me.ctxAinBG.lineWidth = 0.5;
                        // me.ctxAinBG.strokeRect(EndX, 35, 10, 30);
                        // me.ctxAinBG.stroke();
                        // me.ctxAinBG.closePath();
                        me.ctxAinBG.restore();
                    }

                };
                this.rectShot = {
                    x: 0,
                    y: 0,
                    w: 5,
                    h: 30,
                    vx: 0,
                    vy: 0,
                    gravity: .35,
                    color: me.colors.M,
                    draw: function () {
                        me.ctxAinBG.save();
                        me.ctxAinBG.globalAlpha = 0.8;
                        me.ctxAinBG.beginPath();
                        me.ctxAinBG.fillStyle = this.color;
                        me.ctxAinBG.fillRect(this.x, this.y, this.w, this.h);
                        // me.ctxAinBG.shadowColor = 'black';
                        // me.ctxAinBG.shadowBlur = 25;
                        me.ctxAinBG.fill();
                        // me.ctxAinBG.strokeStyle = me.borderColors[0];
                        // me.ctxAinBG.lineWidth = 0.5;
                        // me.ctxAinBG.strokeRect(EndX, 35, 10, 30);
                        // me.ctxAinBG.stroke();
                        // me.ctxAinBG.closePath();
                        me.ctxAinBG.restore();
                    }

                };
                this.eqName = {
                    x: 0,
                    y: 0,
                    w: 50,
                    h: 50,
                    fontSize: 15,
                    fontColor: this.colors.fontColor,
                    font: 'px Droid Sans, Helvetica',
                    text: '',
                    textW: 0,
                    draw: function () {
                        me.ctxBG.save();
                        me.ctxBG.font = this.fontSize + this.font;
                        me.ctxBG.fillStyle = this.fontColor;
                        me.ctxBG.fillText(this.text, this.x, this.y);
                        this.textW = me.ctxBG.measureText(this.text);
                        me.ctxBG.restore();
                    }
                }
                this.totalVal = {
                    x: 0,
                    y: 0,
                    w: 50,
                    h: 50,
                    fontSize: 10,
                    fontColor: this.colors.fontColor,
                    font: this.fontSize + 'px Droid Sans, Helvetica',
                    text: 0,
                    textW: 0,
                    draw: function () {
                        me.ctxAinBG.save();
                        me.ctxAinBG.font = this.font;
                        me.ctxAinBG.fillStyle = this.fontColor;
                        me.ctxAinBG.fillText(this.text, this.x, this.y);
                        this.textW = me.ctxAinBG.measureText(this.text);
                        me.ctxAinBG.restore();
                    }

                };

            };
            RTMEqualizerChart.prototype.getX = function (x, radian, radius) {
                return x + Math.cos(radian) * radius;
            };

            RTMEqualizerChart.prototype.getY = function (y, radian, radius) {
                return y + Math.sin(radian) * radius;
            };
            // RTMEqualizerChart.prototype.getX = function(x, radian, radius) {
            //     return x + Math.cos( (Math.PI / 180) * radian ) * radius;
            // };
            //
            // RTMEqualizerChart.prototype.getY = function(y, radian, radius) {
            //     return y + Math.sin( (Math.PI / 180) * radian) * radius;
            // };
            RTMEqualizerChart.prototype.taskLogo = function (idx) {

                var drawX, drawY;
                drawX = this.sx + this.Hspace;
                drawY = this.sy + (this.alarmBox.height / 2);
                this.ctxBG.beginPath();
                this.ctxBG.arc(drawX, drawY, this.logo.radius, 2 * Math.PI, false);
                this.ctxBG.lineWidth = 1;
                this.ctxBG.strokeStyle = '#1d0b15';
                this.ctxBG.stroke();
                this.ctxBG.beginPath();
                var circleX = this.getX(drawX, Math.PI * 1.25, this.logo.radius - 1);
                var circleY = this.getY(drawY, Math.PI * 1.25, this.logo.radius - 1);
                this.ctxBG.rect(circleX, circleY, this.logo.rectWH * 1.25, this.logo.rectWH * 1.25);
                this.ctxBG.strokeStyle = this.taskColorList[idx];
                this.ctxBG.stroke();

            }
            RTMEqualizerChart.prototype.drawBackground = function () {

                // grad = this.ctxBG.createRadialGradient(cx, cy, this.radius - 3, cx, cy, 20);
                // grad.addColorStop(0, common.Util.getColor("BLACK", 0));
                // grad.addColorStop(1, common.Util.getRGBA("#4C4C4C", 1));
                // this.ctxAinBG.translate(10, 10);

                // 배경


                this.ctxBG.beginPath();
                this.ctxBG.rect(0, 0, this.width, this.height);
                this.ctxBG.fillStyle = '#53575f';
                this.ctxBG.fill();

                this.ctxBG.translate(10, 10);
                    debugger;
                for (var ix = 0; ix < 6; ix++) {
                // this.taskLogo(ix);
                // 알람 테두리 그리기
                var lineLen = this.alarmBox.lineLength;
                var edge = this.alarmBox.edge;
                var alramBoxH = (this.alarmBox.height + this.sy);


                this.ctxBG.beginPath();
                this.ctxBG.lineWidth = 3;
                this.ctxBG.strokeStyle = '#1d0b15';
                this.ctxBG.moveTo(this.sx, this.sy);
                this.ctxBG.lineTo(lineLen, this.sy);
                // this.ctxBG.bezierCurveTo(1862.3999999999999, this.sy, 1882, this.sy + edge, 1862.3999999999999, alramBoxH);
                this.ctxBG.bezierCurveTo(lineLen + edge, this.sy, lineLen + edge, alramBoxH, lineLen, alramBoxH);
                this.ctxBG.lineTo(this.sx, alramBoxH);
                this.ctxBG.bezierCurveTo(this.sx - edge, alramBoxH, this.sx - edge, this.sy, this.sx, this.sy);
                this.ctxBG.stroke();


                // this.eqName.x = (this.sx * 2) + this.logo.radius + this.Vspace;
                // this.eqName.y = (this.sy) + this.Hspace + (this.alarmBox.height / 2);
                // this.eqName.text = '인터넷지로';
                // this.eqName.draw();
                //
                // this.eqName.x = (this.sx * 2) + this.logo.radius + (this.Vspace * 2) + this.eqName.textW.width;
                // this.eqName.y = (this.sy) + this.Hspace + (this.alarmBox.height / 2);
                // this.eqName.text = '10000';
                // this.eqName.draw();
                //
                // this.activeX = (this.eqName.x + this.Vspace + this.activeSumTextWidth);
                // this.activeY = (this.eqName.y - this.Hspace);
                //
                // this.ctxBG.save();
                // this.ctxBG.beginPath();
                // this.ctxBG.setLineDash([4, 1]);
                // this.ctxBG.lineWidth = 30;
                // this.ctxBG.strokeStyle = '#1d0b15';
                // this.ctxBG.moveTo(this.activeX, (this.activeY));
                // this.ctxBG.lineTo(lineLen, (this.activeY));
                // this.ctxBG.stroke();
                // this.ctxBG.restore();

                     this.sy = (this.sy) + this.alarmBox.height + this.Vspace;
                }


            };


            RTMEqualizerChart.prototype.InsBoxLayout = function (workIndex, data, workKey) {

                var cw, ch, index, py, space, px, insType, jx, dotX, dotY, insList;
                cw = this.boxInit.insBox.cw;
                ch = this.boxInit.insBox.ch;
                index = workIndex;
                space = (this.space * index);
                px = this.boxInit.workBox.cw;
                py = (ch * index) + space;

                dotX = px * 3.4;
                dotY = (ch * index) + space;

                this.ctxBG.save();

                // 배경
                // this.ctxBG.translate(10 + px, 10 + py);
                this.ctxBG.beginPath();
                this.ctxBG.rect(px, py, cw, ch);
                this.ctxBG.fillStyle = '#282B32';
                this.ctxBG.fill();
                this.ctxBG.lineWidth = 4;
                this.ctxBG.strokeStyle = '#50555C';
                this.ctxBG.stroke();
                // WAS 관련 인스턴스 리스트
                insList = Object.keys(data);
                var currentSubIndex = this.seletedSubPageIndex[workKey];
                // jx 간격 위치 인덱스
                jx = 0;
                for (let ix = this.subPageList * (currentSubIndex); ix < insList.length; ix++) {

                    if (this.subPageList * (currentSubIndex + 1) === ix) break; // subPaging 처리
                    // 인스턴스 수만큼만 loop
                    // subpaing 처리
                    // if ((this.subPageList * currentSubIndex) + ix < this.subPageList * (currentSubIndex + 1 )) {
                    // console.log(jx);


                    // 서버 다운처리
                    // insType = data[insList[ix]].maxAlarm === -1 ? 'DOWN' : 'WAS';
                    insType = 'WAS';

                    bizId = workKey;
                    bizName = this.localData.businessName[workKey];

                    this.serverImg = new EEDAlarmStatus({
                        x: px,
                        y: py,
                        canvas: this.canvasBG,
                        width: 50,
                        height: 50,
                        translateX: this.translateX, // 인스턴스 박스 10 여백 더 추가 함
                        translateY: this.translateY + this.space, // 인스턴스 박스 10 여백 더 추가 함
                        serverName: this.localData.serverName[insList[ix]],
                        serverId: insList[ix],
                        bizId: bizId,
                        bizName: bizName,
                        alarmLevel: data[insList[ix]].maxAlarm,
                        type: insType, // 구분 현재 쓰지 않고있음. WAS + WEBSERVER 데이타를 모델에서 합쳐서 보내주고있음
                        diameter: this.diameter,
                        index: (jx * (this.diameter + this.gapSpace)), // 이미지가 그려지는 간격
                        image: this.image
                    });
                    // 객체 정보를 모두모두모두모두 담아서 저장하고 있는다.
                    this.serverEntities.push(this.serverImg);
                    jx++;


                }
                // subPage 점 페이징 처리
                this.subPageTotal = Math.ceil((insList.length) / this.subPageList);
                var Ppos = this.pagePosY(ch) + dotY;
                for (let ix = 0; ix < this.subPageTotal; ix++) {
                    this.pageDot = new EEDAlarmStatusDotDot({
                        x: dotX,
                        y: Ppos + (this.pageSpace * ix),
                        canvas: this.canvasBG,
                        translateX: this.translateX, // 여백 더 추가 함
                        translateY: this.translateY, // 여백 더 추가 함
                        diameter: this.pageDiameter,
                        index: ix,
                        workKey: workKey,
                        selectedPageIndex: currentSubIndex,
                        type: 'ins',

                    });

                    this.serverEntities.push(this.pageDot);
                }

                this.ctxBG.restore();
            };
            RTMEqualizerChart.prototype.waterfallCanvas = function (data) {

            };

            RTMEqualizerChart.prototype.ratioCalu = function (data) {
                var returData = {}
                var dataW = data.W;
                var dataN = data.N;
                var dataC = data.C;
                var dataSum = dataW + dataN + dataC;
                this.activeTotalCount = dataSum;
                // W N C 3개로 고정
                returData.N = Math.ceil((this.rectMaxCount / dataSum) * dataN);
                returData.W = Math.ceil((this.rectMaxCount / dataSum) * dataW);
                returData.C = Math.ceil((this.rectMaxCount / dataSum) * dataC);

                return returData;

            }
            RTMEqualizerChart.prototype.draw = function (data) {
                // this.activeData = data;
                this.activeData = {
                    N: 3,
                    W: 3,
                    C: 4
                }
                this.eqName.y = this.sy + 5;
                // debugger;
                // this.eqName.draw();
                this.ratioData = this.ratioCalu(this.activeData);
                var objData = Object.keys(this.ratioData);
                var posX = 0;
                for (let ix = 0; ix < objData.length; ix++) {
                    var levelCount = objData[ix];
                    var rectLength = this.ratioData[levelCount];
                    for (let iy = 0; iy < rectLength; iy++) {

                        if (levelCount === "N") {

                            this.eqRect.color = this.colors.N;
                            this.eqRect.x = posX;
                            this.eqRect.y = this.sy / 2;
                            this.eqRect.draw();
                        } else if (levelCount === "W") {
                            this.eqRect.color = this.colors.W;
                            this.eqRect.x = posX;
                            this.eqRect.y = this.sy / 2;
                            this.eqRect.draw();
                        } else {
                            this.eqRect.color = this.colors.C;
                            this.eqRect.x = posX;
                            this.eqRect.y = this.sy / 2;
                            this.eqRect.draw();
                        }

                        posX += this.rectMargin + this.eqRect.w;
                    }


                }

                this.bounceRect(posX);
                // this.moveRect(posX);

            };
            RTMEqualizerChart.prototype.posUpdate = function () {
                this.rectShot.vy += this.rectShot.vy;
                this.rectShot.vx += this.rectShot.gravity;
                this.rectShot.x += this.rectShot.vx;
                this.rectShot.y += this.rectShot.vy;

            };
            RTMEqualizerChart.prototype.moveTotalCNT = function (posX) {
                this.textCountW = this.ctxAinBG.measureText(this.activeTotalCount).width;
                this.totalVal.text = this.activeTotalCount;
                this.totalVal.x = posX + this.rectShot.w + this.textCountW;
                this.totalVal.y = this.sy + 5;
                this.totalVal.draw();
            };
            RTMEqualizerChart.prototype.moveRect = function (posX) {
                this.rectShot.color = this.colors.M;
                this.rectShot.x = posX + this.rectShot.w;
                this.rectShot.y = this.sy / 2;
                this.rectShot.draw();
                this.moveTotalCNT(posX);
            };
            RTMEqualizerChart.prototype.clearRect = function (type) {
                this.ctxAinBG.beginPath();
                // this.ctxAinBG.rect(this.rectShot.x, this.rectShot.y  - this.rectMargin, this.rectShot.w + 10, this.rectShot.h + this.rectMargin + 5 );
                this.ctxAinBG.lineWidth = 1;
                this.ctxAinBG.strokeStyle = 'red';
                this.ctxAinBG.stroke();
                if (type === 'P') {
                    this.ctxAinBG.clearRect(this.rectShot.x - this.rectMargin, this.rectShot.y, this.rectShot.w + this.textCountW + 10, this.rectShot.h);
                } else {
                    this.ctxAinBG.clearRect(this.rectShot.x, this.rectShot.y, this.rectShot.w + this.textCountW + 10, this.rectShot.h);
                }

            };
            RTMEqualizerChart.prototype.bounceRect = function (posX) {
                var me = this;
                var startX, EndX;
                this.sBasicX = posX + this.rectMargin;
                this.eBasicX = this.sBasicX + ((this.rectShot.w));
                startX = this.sBasicX;
                EndX = this.eBasicX;

                if (this.animationBackborderDraw || this.requestAniBackborderDraw) {
                    clearTimeout(this.animationBackborderDraw);
                    cancelAnimationFrame(this.requestAniBackborderDraw);
                }
                // 애니메이션 동작
                var moveBackP = function () {
                    me.animationBackborderDraw = setTimeout(function () {
                        if (startX < EndX) {
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackP.bind(this));
                        } else {
                            startX = me.sBasicX;
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackM.bind(this));
                        }
                    }, 30);
                    me.clearRect('P');
                    me.moveRect(startX);

                    // this.posUpdate();
                    // console.log('StgartX' + startX);
                    startX += me.rectShot.gravity;
                };
                // // 애니메이션 동작
                var moveBackM = function () {

                    me.animationBackborderDraw = setTimeout(function () {
                        if (startX < EndX) {
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackM.bind(this));
                        } else {
                            EndX = me.eBasicX;
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackP.bind(this));
                        }
                    }, 30);
                    me.clearRect('M');
                    me.moveRect(EndX);

                    // console.log('EndX' + EndX);
                    EndX -= (me.rectShot.gravity + 0.1);
                };
                moveBackP();

            }

            return RTMEqualizerChart;
        }


        ()
    )
;

