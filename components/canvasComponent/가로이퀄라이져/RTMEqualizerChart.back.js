var RTMEqualizerChart = (function () {
            function RTMEqualizerChart(args) {
                if (!(this instanceof RTMEqualizerChart)) {
                    return new RTMEqualizerChart(args);
                }

                this.width = 0; // 캔버스 넓이
                this.height = 0; // 캔버스 높이
                this.dom = args.dom; // 캔버스 만들어지는 Dom 위치
                this.ratioW = 0;
                this.ratioH = 0;
                this.textY = 4; // text 좌표 보정
                this.eqPos = 9; // 이퀄라이즈 차트 좌표 보정
                this.bizEntities = [];
                this.svgId = []
                this.init();
            }

            RTMEqualizerChart.prototype.init = function () {


                // 캔버스 생성
                this.initCanvas();
                // 초기 프로퍼티 값 셋팅
                this.initProperty();
                this.initComponent();
                // 정적 그림 그린다.
                this.drawBackground();
                this.initBizBox();
            };
            RTMEqualizerChart.prototype.draw = function (bizData) {

                this.canvasItemDraw(bizData)

            };
            RTMEqualizerChart.prototype.initResize = function (bizData) {
                var ix, ixLen;
                var domSize = this.dom.getBoundingClientRect();
                console.log("Window size: width=" + domSize.width + ", height=" + domSize.height);
                this.width = domSize.width; // 캔버스 넓이
                this.height = domSize.height; // 캔버스 높이
                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    this.canvasList[ix].setAttribute("width", this.width);
                    this.canvasList[ix].setAttribute("height", this.height);
                    this.canvasList[ix].setAttribute("style", "position:absolute; top:0px; left:0px;border:0px solid;");
                }

                this.initResizeProperty();
                this.canvasItemDraw(bizData)

            };

            RTMEqualizerChart.prototype.drawBackground = function () {
                this.ctxBG.rect(0, 0, this.width, this.height);
                this.ctxBG.fillStyle = '#393c43';
                this.ctxBG.fill();

            };
            RTMEqualizerChart.prototype.initResizeProperty = function () {
                this.ratioW = this.width * 0.08;
                this.ratioH = this.height * 0.03;
                this.Hspace = this.ratioW;
                this.Vspace = this.height > 250 ? this.ratioH : 5;
                this.sx = 30;
                this.sy = 20;
                this.alarmBox = {
                    lineLength: this.width - 35,
                    height: 24,//((this.height - this.sy) / this.taskLength) ,
                    edge: 20,
                };

            }
            RTMEqualizerChart.prototype.initProperty = function () {
                this.ratioW = this.width * 0.08;
                this.ratioH = this.height * 0.03;
                this.backgroundColor = "#424242";
                this.rectMaxCount = 15;
                this.isToolTip = true;
                this.sx = 30;
                this.sy = 20;
                this.alarmBox = {
                    lineLength: this.width - 35,
                    height: 24,//((this.height - this.sy) / this.taskLength) ,
                    edge: 20,
                };
                this.Hspace = this.ratioW;
                this.Vspace = this.ratioH;
                this.basicX = 0;
                this.basicY = 0;
                this.logo = {
                    radius: 8,
                    rectWH: 8,
                };
                this.activeSumTextWidth = 10; // 40px은 10000까지 길이 20폰트
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
            };
            RTMEqualizerChart.prototype.initCanvas = function () {
                var ix, ixLen;
                this.width = this.dom.getBoundingClientRect().width;
                this.height = this.dom.getBoundingClientRect().height;
                this.createCanvas();
                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    this.canvasList[ix].className = this.canvasCls[ix];
                    this.setCanvasConfig(this.canvasList[ix]);
                    this.dom.appendChild(this.canvasList[ix]);
                }
            };

            RTMEqualizerChart.prototype.createCanvas = function () {
                this.canvasBG = document.createElement("canvas");
                this.canvasEvent = document.createElement("canvas");

                this.ctxBG = this.canvasBG.getContext("2d");
                this.ctxEvent = this.canvasEvent.getContext('2d');

                this.canvasList = [this.canvasBG, this.canvasEvent];
                this.canvasCls = ["canvasBG", "canvasEvent"];
                this.ctxList = [this.ctxBG, this.ctxEvent];
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
            RTMEqualizerChart.prototype.initComponent = function (args) {
                var me = this;
                this.eqRect = {
                    x: 0,
                    y: 0,
                    w: 4,
                    h: 18,
                    color: me.colors.W,
                    draw: function () {
                        me.ctxBG.save();
                        // me.ctxBG.globalAlpha = 0.5;
                        me.ctxBG.beginPath();
                        me.ctxBG.fillStyle = this.color;
                        me.ctxBG.shadowColor = '#1d0b15';
                        me.ctxBG.shadowBlur = 5;
                        me.ctxBG.fillRect(this.x, this.y, this.w, this.h);
                        me.ctxBG.fill();
                        me.ctxBG.restore();
                    }

                };
                this.eqName = {
                    x: 0,
                    y: 0,
                    w: 50,
                    h: 50,
                    fontSize: 11,
                    fontColor: this.colors.fontColor,
                    font: 'px Droid Sans, Helvetica',
                    text: '',
                    textW: function () {
                        return me.ctxBG.measureText(this.text);
                    },
                    draw: function () {
                        me.ctxBG.save();
                        me.ctxBG.font = this.fontSize + this.font;
                        me.ctxBG.fillStyle = this.fontColor;
                        me.ctxBG.fillText(this.text, this.x, this.y);
                        me.ctxBG.restore();
                    }
                }

            };
            RTMEqualizerChart.prototype.MouseEventCall = function () {
                var self = this;
                this.canvasEvent.addEventListener('mousemove', function (evt) {

                    var rect = self.canvasEvent.getBoundingClientRect();
                    var x = evt.clientX - rect.left;
                    var y = evt.clientY - rect.top;
                    var serverId;
                    // 엔트리 정보 좌표 추출
                    var entity = self.findEntity(x, y);
                    // 서버목록 객체가아니면 마우스 무브 이벤트 걸지않는다.

                    if (entity) {
                        console.dir(entity.bizName);
                        self.dom.style.cursor = 'pointer';
                        // 툴팁 이벤트 건다.
                        // alarmLevel !== 0 일때만 실행(normal 이 아닐때만)
                        // if (entity.alarmLevel > 0) {
                        //     serverId = entity.serverId;
                        //
                        //     if (self.localData.alarmList[serverId]) {
                        //         self.showAlertDetail(entity.sx, entity.sy, self.localData.alarmList[serverId], entity.serverName);
                        //     }
                        // } else {
                        //     // normal
                        //     if (self.isToolTip) {
                        //         var contents = entity.serverName;
                        //         var wn = $(".rtmInsTaskAlarm");
                        //         var offset = wn.offset();
                        //
                        //         $('<div id="ins_tooltip">' + contents + '</div>').css({
                        //             position: 'absolute',
                        //             display: 'none',
                        //             left: offset.left + entity.sx - 5,
                        //             top: offset.top + entity.sy + 67,
                        //             border: '2px solid #1c1d1f ',
                        //             padding: '5',
                        //             // color: item.series.label === "오늘" ? '#01a9fc' : '#7ecd2a',
                        //             size: '10',
                        //             'border-radius': '6px 6px 6px 6px',
                        //             'background-color': '#212227 ',
                        //             opacity: 0.80
                        //         }).appendTo("body").fadeIn(20);
                        //
                        //         self.isToolTip = false;
                        //     }
                        // }


                    } else {
                        self.dom.style.cursor = 'default';
                        // self.hideAlertDetail();
                        //
                        // $("#ins_tooltip").remove();
                        // self.isToolTip = true;
                    }

                });
                // this.canvasRenderer.addEventListener('click', function (evt) {
                //
                //     var rect = self.canvasRenderer.getBoundingClientRect();
                //     var x = evt.clientX - rect.left;
                //     var y = evt.clientY - rect.top;
                //     // 엔트리 정보 좌표 추출
                //     var entity = self.findEntity(x, y);
                //     // 서버목록 객체가아니면 마우스 무브 이벤트 걸지않는다.
                //     if (entity) {
                //         if (entity.constructor === EEDAlarmStatusDotDot) {
                //             // 클릭 이벤트 건다.
                //             if (entity.type === 'ins') {
                //                 self.subPageChange(entity);
                //             } else {
                //                 self.mainPageChange(entity);
                //             }
                //
                //         }
                //
                //     } else {
                //     }
                //
                // });
            };
            RTMEqualizerChart.prototype.findEntity = function (x, y) {

                if (this.bizEntities.length === 0) return;

                for (var i = this.bizEntities.length - 1; i >= 0; i--) {
                    var entity = this.bizEntities[i];
                    entity.drawDetectionPath();
                    if (this.ctxEvent.isPointInPath(x, y)) {
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


            RTMEqualizerChart.prototype.getComma = function (v) {
                return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            };
            RTMEqualizerChart.prototype.getByteLength = function (s, b, i, c) {
                for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1) ;
                return b;
            };
            RTMEqualizerChart.prototype.taskNameLen = function (len) {
                var txt, txtByte;
                txt = this.eqName.text;
                txtByte = this.getByteLength(txt);
                // 바이트 계산
                if (txtByte > len) {
                    txt = txt.substr(0, 4) + '..';
                }
                return txt;
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
            RTMEqualizerChart.prototype.taskLogo = function (idx, alarmLevel) {

                var drawX, drawY;
                drawX = this.sx;
                drawY = this.sy + (this.alarmBox.height / 2);

                this.alarmDiv.setAttribute("style", "display:none;position: absolute; top:" +
                    (this.sy) + "px; left:" + (this.sx) + "px");

                this.ctxBG.beginPath();
                this.ctxBG.arc(drawX, drawY, this.logo.radius, 2 * Math.PI, false);
                this.ctxBG.lineWidth = 1;
                if (alarmLevel === 3) {
                    this.ctxBG.strokeStyle = this.serverDown.SERVER_DOWN_LIGHT
                } else {
                    this.ctxBG.strokeStyle = '#1d0b15';
                }

                this.ctxBG.stroke();
                this.ctxBG.beginPath();
                var circleX = this.getX(drawX, Math.PI * 1.25, this.logo.radius - 1);
                var circleY = this.getY(drawY, Math.PI * 1.25, this.logo.radius - 1);
                this.ctxBG.rect(circleX, circleY, this.logo.rectWH * 1.2, this.logo.rectWH * 1.2);
                if (alarmLevel === 3) {
                    this.ctxBG.strokeStyle = this.serverDown.SERVER_DOWN_LIGHT;
                } else {
                    this.ctxBG.strokeStyle = this.taskColorList[idx];
                }
                this.ctxBG.stroke();

            };
            RTMEqualizerChart.prototype.taskName = function (bizName, txtspace, alarmLevel) {

                if (alarmLevel === 3) {
                    this.eqName.fontColor = this.serverDown.SERVER_DOWN_LIGHT
                } else {
                    this.eqName.fontColor = this.colors.fontColor;
                }
                console.log(this.alarmBox.lineLength);
                this.eqName.text = bizName;
                if (this.alarmBox.lineLength > 195) {
                    txtspace = this.Hspace * 0.5;
                } else {
                    //165보다작으면 3글자만 보여준다.
                    this.eqName.text = this.taskNameLen(12);
                }
                this.eqName.x = (this.sx) + this.logo.radius + txtspace;
                this.eqName.y = (this.sy + this.textY) + (this.alarmBox.height / 2);
                this.eqName.fontSize = 12;
                this.eqName.draw();

            };
            RTMEqualizerChart.prototype.activeTotalValue = function (activeVal, txtspace, alarmLevel) {
                if (alarmLevel === 3) {
                    this.eqName.fontColor = this.serverDown.SERVER_DOWN_LIGHT
                } else {
                    this.eqName.fontColor = this.colors.fontColor;
                }

                if (this.alarmBox.lineLength > 165) {
                    txtspace = (this.Hspace * 2);
                }
                this.eqName.x = (this.sx) + this.logo.radius + txtspace + 20; // 2.4 간격 동일하게 맞추기 위해
                // console.log((this.sx), this.logo.radius, txtspace, this.eqName.textW().width);
                this.eqName.y = (this.sy + this.textY) + (this.alarmBox.height / 2);

                this.eqName.text = this.getComma(activeVal);
                this.eqName.draw();

            };
            RTMEqualizerChart.prototype.drawBizEntities = function (bizName, bizData) {
                // 툴팁 객체정보 저장

                this.toolTipInfo = new this.bizBox({
                    width: this.width,
                    height: this.height,
                    canvas: this.canvasEvent,
                    sx: this.sx,
                    sy: this.sy,
                    lineLength: this.alarmBox.lineLength,
                    edge: this.alarmBox.edge,
                    boxHeight: this.alarmBox.height,
                    bizName: bizName,
                    bizData: bizData,

                });
                this.bizEntities.push(this.toolTipInfo);
            }
            RTMEqualizerChart.prototype.alarmBorder = function (alarmLevel, idx) {
                var alarmDiv = document.getElementById(this.svgId[idx]);
                alarmDiv.style.display = 'none';
                alarmDiv.style.width = 16 + "px";
                alarmDiv.style.height = 16 + "px";
                if (alarmLevel === 0) {
                    return;
                }
                // 알람 레벨 3일 때 처리 필요 서버 다운
                if (alarmLevel === 3) {
                    return;
                }
                this.ctxBG.beginPath();
                this.ctxBG.lineWidth = 2;
                if (alarmLevel === 1) {
                    this.ctxBG.strokeStyle = this.alarmColor[1];
                } else {
                    alarmDiv.style.display = '';
                    this.ctxBG.strokeStyle = this.alarmColor[2];
                    alarmDiv.style.position = 'absolute';
                    alarmDiv.style.left = this.sx - 24 + 'px';
                    alarmDiv.style.top = this.sy + this.layoutPosY + 3 + 'px';

                }

                this.ctxBG.moveTo(this.sx, this.sy);
                this.ctxBG.lineTo(this.alarmBox.lineLength, this.sy);
                this.ctxBG.bezierCurveTo(this.alarmBox.lineLength + this.alarmBox.edge, this.sy, this.alarmBox.lineLength + this.alarmBox.edge, (this.alarmBox.height + this.sy), this.alarmBox.lineLength, (this.alarmBox.height + this.sy));
                this.ctxBG.lineTo(this.sx, (this.alarmBox.height + this.sy));
                this.ctxBG.bezierCurveTo(this.sx - this.alarmBox.edge, (this.alarmBox.height + this.sy), this.sx - this.alarmBox.edge, this.sy, this.sx, this.sy);
                // this.ctxBG.fill();
                this.ctxBG.stroke();

            };
            RTMEqualizerChart.prototype.activeBackground = function (txtspace, alarmLevel) {
                // 액티브트랜잭션 배경
                this.activeX = (this.eqName.x + txtspace * 1.5); //+ this.activeSumTextWidth);
                this.activeY = (this.eqName.y - this.textY);

                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.setLineDash([4, 1]);
                this.ctxBG.lineWidth = 18;
                if (alarmLevel === 3) {
                    this.ctxBG.strokeStyle = this.serverDown.SERVER_DOWN_LIGHT
                } else {
                    this.ctxBG.strokeStyle = '#1d0b15';
                }

                this.ctxBG.moveTo(this.activeX, (this.activeY));
                this.ctxBG.lineTo(this.alarmBox.lineLength, (this.activeY));
                this.ctxBG.stroke();
                this.ctxBG.restore();

            };
            RTMEqualizerChart.prototype.ratioCalu = function (data, totalActiveTxn) {
                var returData = {}
                var dataW = data.ACTIVE_WARNING;
                var dataN = data.ACTIVE_NORMAL;
                var dataC = data.ACTIVE_CRITICAL;
                var dataSum = totalActiveTxn || 1;
                this.rectMaxCount = (this.alarmBox.lineLength - this.activeX) / 5;
                // W N C 3개로 고정
                // console.log(dataN,dataW,dataC , dataSum , ' 1');
                var scale = d3.scale.linear().domain([0, totalActiveTxn]).range([0, this.rectMaxCount]);
                var nor = dataN ? Math.round(scale(dataN)) : 0;
                var war = dataW ? Math.round(scale(dataW)) : 0;
                var cri = dataC ? Math.round(scale(dataC)) : 0;
                // console.log(nor,war,cri ,this.rectMaxCount , ' 2');
                returData.ACTIVE_NORMAL = nor;
                returData.ACTIVE_WARNING = war;
                returData.ACTIVE_CRITICAL = cri;
                // returData.ACTIVE_NORMAL = Math.ceil((this.rectMaxCount / (dataSum)) * dataN);
                // returData.ACTIVE_WARNING = Math.ceil((this.rectMaxCount / (dataSum)) * dataW);
                // returData.ACTIVE_CRITICAL = Math.ceil((this.rectMaxCount / (dataSum)) * dataC);

                return returData;

            };
            RTMEqualizerChart.prototype.activeRect = function (data) {
                var posX = this.activeX;
                var ActiveData = Object.keys(data);

                for (let ix = 0; ix < ActiveData.length; ix++) {
                    var AcitveLevel = ActiveData[ix];
                    var rectLength = data[AcitveLevel];
                    for (let jy = 0; jy < rectLength; jy++) {
                        if (AcitveLevel === "ACTIVE_NORMAL") {

                            this.eqRect.color = this.colors.N;
                            this.eqRect.x = posX;
                            this.eqRect.y = this.activeY - (this.eqPos);
                            this.eqRect.draw();
                        } else if (AcitveLevel === "ACTIVE_WARNING") {
                            this.eqRect.color = this.colors.W;
                            this.eqRect.x = posX;
                            this.eqRect.y = this.activeY - (this.eqPos);
                            this.eqRect.draw();
                        } else {
                            this.eqRect.color = this.colors.C;
                            this.eqRect.x = posX;
                            this.eqRect.y = this.activeY - (this.eqPos);
                            this.eqRect.draw();
                        }

                        posX += this.rectMargin + this.eqRect.w;
                    }
                }

            };
            RTMEqualizerChart.prototype.alarmCreateDivSvg = function (divId) {
                this.alarmDiv = document.createElement("div");
                this.alarmDiv.id = divId;
                this.svgId.push(divId);
                this.alarmDiv.className = "alarmSVG";
                this.dom.appendChild(this.alarmDiv);

            }
            RTMEqualizerChart.prototype.initBizBox = function () {
                this.bizBox = (function () {

                    var bizBox = function (args) {
                        if (!(this instanceof bizBox)) {
                            return new bizBox(args);
                        }

                        this.sx = args.sx;
                        this.sy = args.sy;
                        this.canvas = args.canvas;
                        this.ctx = this.canvas.getContext("2d");
                        this.lineLength = args.lineLength;
                        this.edge = args.edge;
                        this.boxHeight = args.boxHeight;
                        this.width = args.width;
                        this.height = args.height;
                        this.bizName = args.bizName;
                        this.bizData = args.bizData;

                        this.init();
                    }

                    bizBox.prototype.clearAll = function () {
                        this.ctx.clearRect(0, 0, this.width, this.height);
                    };

                    bizBox.prototype.init = function () {
                        this.drawDetectionPath();
                    };

                    // 렌더러에 좌표를 찾기위에 그린다.
                    bizBox.prototype.drawDetectionPath = function () {
                        this.entityDraw();
                    };
                    bizBox.prototype.entityDraw = function () {

                        // this.clearAll();
                        this.ctx.beginPath();
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeStyle = '#5aff49';
                        this.ctx.moveTo(this.sx, this.sy);
                        this.ctx.lineTo(this.lineLength, this.sy);
                        this.ctx.bezierCurveTo(this.lineLength + this.edge, this.sy, this.lineLength + this.edge, (this.boxHeight + this.sy), this.lineLength, (this.boxHeight + this.sy));
                        this.ctx.lineTo(this.sx, (this.boxHeight + this.sy));
                        this.ctx.bezierCurveTo(this.sx - this.edge, (this.boxHeight + this.sy), this.sx - this.edge, this.sy, this.sx, this.sy);
                        // this.ctx.fill();
                        // this.ctx.stroke();
                    };

                    return bizBox;

                })();
            };

            RTMEqualizerChart.prototype.canvasItemDraw = function (bizData) {


                this.ctxBG.rect(0, 0, this.width, this.height);
                this.ctxBG.fillStyle = '#393c43';
                this.ctxBG.fill();
                // this.ctxBG.beginPath();


                // 레이아웃 위치 설정
                this.layoutPosY = this.height * 0.1;
                this.ctxBG.translate(10, this.layoutPosY);
                this.ctxEvent.translate(10, this.layoutPosY);
                //초기화처리
                this.clear(this.ctxEvent);
                this.bizEntities = [];

                for (var ix = 0; ix < bizData.length; ix++) {
                    var bizList = bizData[ix].biz_list;
                    var totalActiveTxn = bizData[ix].total_active_txn;
                    var bizkey = Object.keys(bizList);

                    // group Name
                    this.eqName.text = bizData[ix].group_name;
                    this.eqName.x = this.sx + this.Hspace;
                    this.eqName.y = this.sy + this.eqPos + this.Vspace - this.layoutPosY;
                    this.eqName.fontSize = 13;
                    this.eqName.fontColor = this.colors.fontColor;
                    this.eqName.draw();


                    for (var iy = 0; iy < bizkey.length; iy++) {
                        var bizName = bizkey[iy];
                        var divId = 'alarmSvg' + bizData[ix].group_id + this.dom.getAttribute('id') + iy;
                        // Dom이 존재하지않는 경우에만 Div생성
                        if (this.dom.querySelector('#' + divId) === null) {
                            this.alarmCreateDivSvg(divId);
                        }
                    }
                    for (var iy = 0; iy < bizkey.length; iy++) {
                        var bizData = bizList[bizkey[iy]];
                        var bizName = bizkey[iy];
                        var alarmLevel = bizData.ALARM_LEVEL;

                        // 업무 로고
                        this.taskLogo(iy, alarmLevel);


                        // 업무 명
                        var txtspace = 2;
                        this.taskName(bizName, txtspace, alarmLevel);


                        // 액티브트랜잭션 토탈값
                        txtspace = this.Hspace;
                        this.activeTotalValue(bizData.ACTIVE_TXN_COUNT, txtspace, alarmLevel);


                        // 알람 테두리
                        this.alarmBorder(alarmLevel, iy);
                        // event 좌표 정보저장
                        this.drawBizEntities(bizName, bizData);

                        if (this.alarmBox.lineLength > 180) {
                            txtspace = (this.Hspace * 1.4);
                        }

                        this.activeBackground(txtspace, alarmLevel);


                        // 전체에 대한 비율 값 정보 추출
                        if (alarmLevel !== 3) this.activeRect(this.ratioCalu(bizData, totalActiveTxn));

                        this.sy = (this.sy) + this.alarmBox.height + this.Vspace + 5;


                    }
                }

                this.MouseEventCall();


            }

            return RTMEqualizerChart;
        }


        ()
    )
;
