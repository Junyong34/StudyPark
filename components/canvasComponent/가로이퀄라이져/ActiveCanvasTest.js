var ActiveSpeed = (function () {
            function ActiveSpeed(args) {
                if (!(this instanceof ActiveSpeed)) {
                    return new ActiveSpeed(args);
                }

                this.width = args.width; // 캔버스 넓이
                this.height = args.height; // 캔버스 높이
                this.dom = args.dom; // 캔버스 만들어지는 Dom 위치
                this.backgroundColor = "#424242";
                this.type = args.type || 'F"'; // TYPE  B면 뒤로 돌리고 F면 앞으로 돌린다.

                this.isToolTip = true;

                this.init();
            }

            ActiveSpeed.prototype.init = function () {

                // 초기 프로퍼티 값 셋팅
                this.initProperty();
                // 캔버스 생성
                this.initCanvas();
                // 정적 그림 그린다.
                this.drawBackground();


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
            ActiveSpeed.prototype.pageInfo = function () {
                this.mainPageList = this.getTotalItemsCountPerPage();
                this.subPageList = this.getItemsCountPerBiz();

            };
            ActiveSpeed.prototype.setImage = function (image) {
                this.image = image;
            };
            ActiveSpeed.prototype.getTotalItemsCountPerPage = function () {
                var totalHeight, itemHeight, itemsCountPerPage;

                totalHeight = this.getPageInfo().backgroundAreaH - this.getPageInfo().space - this.getPageInfo().botPageHeight;
                itemHeight = this.getPageInfo().boxAreaH + this.getPageInfo().space;

                itemsCountPerPage = Math.floor(totalHeight / itemHeight);

                return itemsCountPerPage;
            };

            ActiveSpeed.prototype.getItemsCountPerBiz = function () {
                var totalWidth, itemWidth, itemsCountPerBiz;

                totalWidth = this.getPageInfo().insBoxAreaW - this.getPageInfo().subPageWidth;
                itemWidth = this.getPageInfo().insImageW + this.getPageInfo().imageSpace;

                itemsCountPerBiz = Math.floor(totalWidth / itemWidth);

                return itemsCountPerBiz;
            };
            ActiveSpeed.prototype.initProperty = function () {
                this.colors = ["#FF9803", "#FF9803", "#D7000F", "#D7000F", "#42A5F6", "#42A5F6"];
                this.borderColors = ["#bdbdbd"];
                // this.colors = ["#D7000F"];
            };
            ActiveSpeed.prototype.initCanvas = function () {
                var ix, ixLen;

                this.createCanvas();
                for (ix = 0, ixLen = this.canvasList.length; ix < ixLen; ix++) {
                    this.canvasList[ix].className = this.canvasCls[ix];
                    this.setCanvasConfig(this.canvasList[ix]);
                    this.dom.appendChild(this.canvasList[ix]);
                }
            };

            ActiveSpeed.prototype.createCanvas = function () {
                this.canvasBG = document.createElement("canvas");
                this.canvasAinBG = document.createElement("canvas");
                this.canvasBall = document.createElement("canvas");
                this.canvasRenderer = document.createElement("canvas");

                this.ctxBG = this.canvasBG.getContext("2d");
                this.ctxAinBG = this.canvasAinBG.getContext('2d');
                this.ctxBall = this.canvasAinBG.getContext('2d');
                this.ctxRenderer = this.canvasRenderer.getContext("2d");

                this.canvasList = [this.canvasBG, this.canvasAinBG, this.canvasBall, this.canvasRenderer];
                this.canvasCls = ["canvasBG", "canvasAinBG", "canvasBall", "canvasRenderer"];
                this.ctxList = [this.ctxBG, this.ctxAinBG, this.ctxBall, this.ctxRenderer];
            };
            // 캔버스 초기화
            ActiveSpeed.prototype.clear = function (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            };
            // 캔버스 속성정보 셋팅
            ActiveSpeed.prototype.setCanvasConfig = function (cvs) {
                cvs.setAttribute("width", this.width);
                cvs.setAttribute("height", this.height);
                cvs.setAttribute("style", "position:absolute; top:0px; left:0px;border:1px solid;");
            };
            ActiveSpeed.prototype.clickEventCall = function () {
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
            ActiveSpeed.prototype.findEntity = function (x, y) {
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
            ActiveSpeed.prototype.mousePos = function (evt) {
                this.rect = this.canvasBG.getBoundingClientRect();
                return {
                    x: evt.clientX - this.rect.left,
                    y: evt.clientY - this.rect.top
                };

            };


            ActiveSpeed.prototype.initComponent = function (args) {


            };

            ActiveSpeed.prototype.drawEllipse = function (ix) {


                var x = 10 * (ix + 1);

                var y = 6 * (ix + 30);

                this.ctxBG.globalAlpha = 0.5;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.ellipse(100, y, 20, 5, 1 * Math.PI / 180, 0, 2 * Math.PI);
                this.ctxBG.fill();
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.stroke();
                this.ctxBG.restore();

            };

            ActiveSpeed.prototype.drawRect = function (ix) {

                var x = 10 * (ix + 1);
                var y = 6 * (ix + 30);

                this.ctxBG.globalAlpha = 0.3;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.fillRect(140, y, 50, 30);
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeRect(140, y, 50, 30);
                this.ctxBG.fill();
                this.ctxBG.stroke();
                this.ctxBG.restore();

            };
            ActiveSpeed.prototype.hdrawRect = function (ix) {

                var x = 5 * (ix + 10);
                var y = 6 * (ix + 30);

                this.ctxBG.globalAlpha = 0.3;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.fillRect(x, 80, 50, 30);
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeRect(x, 80, 50, 30);
                this.ctxBG.fill();
                this.ctxBG.stroke();
                this.ctxBG.restore();

            };
            ActiveSpeed.prototype.hDrawEllipse = function (ix) {

                var x = 6 * (ix + 10);
                var y = 6 * (ix + 30);

                this.ctxBG.globalAlpha = 0.5;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.ellipse(x, 40, 5, 20, 1 * Math.PI / 180, 0, 2 * Math.PI);
                // this.ctxBG.fillStyle = 'skyblue';
                this.ctxBG.fill();
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.stroke();
                this.ctxBG.restore();

            };
            ActiveSpeed.prototype.hHalfDrawEllipse = function (ix) {

                var x = 6 * (ix + 30);
                var y = 6 * (ix + 30);

                this.ctxBG.globalAlpha = 0.5;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.ellipse(x, 40, 5, 20, 1 * Math.PI / 180, 0, Math.PI);
                // this.ctxBG.fillStyle = 'skyblue';
                this.ctxBG.fill();
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.stroke();
                this.ctxBG.restore();

            };
            ActiveSpeed.prototype.drawTriangle = function (ix) {

                var x = 1 * (ix + 20);
                var y = 3 * (ix + 100);
                var sx = 100;
                var sy = 400

                this.ctxBG.globalAlpha = 0.5;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.moveTo(sx, y);      //시작위치 X,Y좌표
                this.ctxBG.lineTo(sx - 20, y + 15);      //선 그리기
                this.ctxBG.lineTo(sx + 20, y + 15);    //선 그리기
                this.ctxBG.fill();
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.stroke();
                this.ctxBG.restore();


            };
            ActiveSpeed.prototype.hDrawTriangle = function (ix) {

                var x = 3 * (ix + 55);
                var y = 1 * (ix + 350);
                var sx = 170;
                var sy = 340

                this.ctxBG.globalAlpha = 0.5;
                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.fillStyle = this.colors[ix % this.colors.length];
                this.ctxBG.moveTo(x, sy);      //시작위치 X,Y좌표
                this.ctxBG.lineTo(x - 20, sy - 15);      //선 그리기
                this.ctxBG.lineTo(x - 20, sy + 15);    //선 그리기
                this.ctxBG.fill();
                this.ctxBG.lineWidth = 0.5;
                this.ctxBG.strokeStyle = this.borderColors[0];
                this.ctxBG.stroke();
                this.ctxBG.restore();


            };

            ActiveSpeed.prototype.basicAniBackFrame = function () {
                var me = this;
                var startX = 370;
                var EndX = 381;


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
                            startX = 370;
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackM.bind(this));
                        }
                    }, 30);

                    startX++;
                    me.ctxAinBG.save();
                    me.ctxAinBG.clearRect(368, 32, 25, 35);
                    me.ctxAinBG.globalAlpha = 1;
                    me.ctxAinBG.beginPath();
                    // me.ctxAinBG.fillStyle = '#374b62';
                    // me.ctxAinBG.fillRect(370, 35, 20, 30);
                    me.ctxAinBG.fill();
                    me.ctxAinBG.strokeStyle = me.borderColors[0];
                    me.ctxAinBG.lineWidth = 0.5;
                    me.ctxAinBG.strokeRect(startX, 35, 10, 30);
                    me.ctxAinBG.stroke();
                    me.ctxAinBG.closePath();
                    me.ctxAinBG.restore();
                };
                // 애니메이션 동작
                var moveBackM = function () {

                    me.animationBackborderDraw = setTimeout(function () {
                        if (startX === EndX) {
                            EndX = 381;
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackP.bind(this));
                        } else {
                            me.requestAniBackborderDraw = requestAnimationFrame(moveBackM.bind(this));
                        }
                    }, 30);

                    EndX--;
                    me.ctxAinBG.save();
                    me.ctxAinBG.clearRect(368, 32, 25, 35);
                    me.ctxAinBG.globalAlpha = 1;
                    me.ctxAinBG.beginPath();
                    // me.ctxAinBG.fillStyle = '#374b62';
                    // me.ctxAinBG.fillRect(10, 35, 20, 30);
                    me.ctxAinBG.fill();
                    me.ctxAinBG.strokeStyle = me.borderColors[0];
                    me.ctxAinBG.lineWidth = 0.5;
                    me.ctxAinBG.strokeRect(EndX, 35, 10, 30);
                    me.ctxAinBG.stroke();
                    me.ctxAinBG.closePath();
                    me.ctxAinBG.restore();
                };
                moveBackP();


            };
            ActiveSpeed.prototype.basicAniFontFrame = function () {
                var me = this;
                var w = 25
                var startX = 10;
                var EndX = 21;


                if (this.animationFrontborderDraw || this.requestAniFrontborderDraw) {
                    clearTimeout(this.animationFrontborderDraw);
                    cancelAnimationFrame(this.requestAniFrontborderDraw);
                }
                // 애니메이션 동작
                var moveFrontP = function () {

                    me.animationFrontborderDraw = setTimeout(function () {
                        if (startX < EndX) {
                            me.requestAniFrontborderDraw = requestAnimationFrame(moveFrontP.bind(this));
                        } else {
                            startX = 10;
                            me.requestAniFrontborderDraw = requestAnimationFrame(moveFrontM.bind(this));
                        }
                    }, 30);

                    startX++;
                    me.ctxAinBG.save();
                    // me.ctxAinBG.strokeRect(8, 32, 25, 35);
                    me.ctxAinBG.clearRect(8, 32, 25, 35);
                    me.ctxAinBG.globalAlpha = 1;
                    me.ctxAinBG.beginPath();
                    // me.ctxAinBG.fillStyle = '#374b62';
                    // me.ctxAinBG.fillRect(10, 35, 20, 30);
                    me.ctxAinBG.fill();
                    me.ctxAinBG.strokeStyle = me.borderColors[0];
                    me.ctxAinBG.lineWidth = 0.5;
                    me.ctxAinBG.strokeRect(startX, 35, 10, 30);
                    me.ctxAinBG.stroke();
                    me.ctxAinBG.closePath();
                    me.ctxAinBG.restore();
                };
                // 애니메이션 동작
                var moveFrontM = function () {

                    me.animationFrontborderDraw = setTimeout(function () {
                        if (startX === EndX) {
                            EndX = 21;
                            me.requestAniFrontborderDraw = requestAnimationFrame(moveFrontP.bind(this));
                        } else {
                            me.requestAniFrontborderDraw = requestAnimationFrame(moveFrontM.bind(this));
                        }
                    }, 30);

                    EndX--;
                    me.ctxAinBG.save();
                    me.ctxAinBG.clearRect(8, 32, 25, 35);
                    me.ctxAinBG.globalAlpha = 1;
                    me.ctxAinBG.beginPath();
                    // me.ctxAinBG.fillStyle = '#374b62';
                    // me.ctxAinBG.fillRect(10, 35, 20, 30);
                    me.ctxAinBG.fill();
                    me.ctxAinBG.strokeStyle = me.borderColors[0];
                    me.ctxAinBG.lineWidth = 0.5;
                    me.ctxAinBG.strokeRect(EndX, 35, 10, 30);
                    me.ctxAinBG.stroke();
                    me.ctxAinBG.closePath();
                    me.ctxAinBG.restore();
                };
                moveFrontP();


            };
            ActiveSpeed.prototype.ballStraight = function () {
                var me = this;
                var ball = {
                    x: 0,
                    y: 45,
                    vx: 5,
                    vy: 2,
                    radius: 10,
                    color: 'blue',
                    draw: function () {
                        me.ctxBall.beginPath();
                        me.ctxBall.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                        me.ctxBall.closePath();
                        me.ctxBall.fillStyle =  'rgba(0, 216, 255, 0.3)';
                        me.ctxBall.fill();
                        var x = 1 * (1 + 20);
                        var y = 3 * (1 + 15);
                        var sx = 50;
                        var sy = 1;
                         me.ctxBall.globalAlpha = 0.5;
                         me.ctxBall.save();
                         me.ctxBall.beginPath();
                         me.ctxBall.fillStyle = me.colors[2 % me.colors.length];
                         me.ctxBall.moveTo(this.x + x, sy+this.y);      //시작위치 X,Y좌표
                         me.ctxBall.lineTo(this.x + x - 20, sy+this.y - 15);      //선 그리기
                         me.ctxBall.lineTo(this.x + x - 20, sy+this.y + 15);    //선 그리기
                         me.ctxBall.fill();
                         me.ctxBall.lineWidth = 0.5;
                         me.ctxBall.strokeStyle = me.borderColors[0];
                         me.ctxBall.stroke();
                         me.ctxBall.restore();
                    }
                };

                function draw() {

                    me.ctxBall.clearRect(10, 25, 380, 50);
                    // me.ctxBall.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    // me.ctxBall.fillRect(40, 25, 320, 50);
                    ball.draw();
                    ball.x += ball.vx;
                    ball.y += ball.vy;
                    ball.vy *= .09;
                    ball.vy += .15;

                    if (ball.y + ball.vy > 50 || ball.y + ball.vy < 0) {
                        ball.vy = -ball.vy;
                    }
                    if (ball.x + ball.vx > me.width ||
                        ball.x + ball.vx < 0) {
                        ball.vx = -ball.vx;
                    }

                    me.raf = requestAnimationFrame(draw);
                }

                draw();
                // ball.draw();
            };
            ActiveSpeed.prototype.drawBackground = function () {

                // grad = this.ctxBG.createRadialGradient(cx, cy, this.radius - 3, cx, cy, 20);
                // grad.addColorStop(0, common.Util.getColor("BLACK", 0));
                // grad.addColorStop(1, common.Util.getRGBA("#4C4C4C", 1));

                this.ctxBG.save();

                // 배경
                this.ctxBG.beginPath();
                this.ctxBG.rect(0, 0, this.width, this.height);
                this.ctxBG.fillStyle = '#282B32';
                this.ctxBG.fill();
                this.ctxBG.strokeStyle = 'black';
                this.ctxBG.stroke();
                this.ctxBG.restore();

                this.ctxBG.save();
                this.ctxBG.beginPath();
                this.ctxBG.globalAlpha = 1;
                this.ctxBG.fillStyle = '#374b62';
                this.ctxBG.fillRect(370, 35, 20, 30);
                this.ctxBG.fillRect(10, 35, 20, 30);
                this.ctxBG.fill();
                this.ctxBG.closePath();
                this.ctxBG.restore();


                this.basicAniFontFrame();
                this.basicAniBackFrame();
                this.ballStraight();
                // for (var i = 15; i > 0; i--) {
                //     this.drawEllipse(i);
                //     this.hDrawEllipse(i);
                //     this.hHalfDrawEllipse(i);
                //     this.drawRect(i);
                //     this.hdrawRect(i);
                //     this.drawTriangle(i);
                // }
                // if (this.type === 'F') {
                //     for (var i = 0; i < 15; i++) {
                //         this.drawEllipse(i);
                //         this.hDrawEllipse(i);
                //         this.hHalfDrawEllipse(i);
                //         this.drawRect(i);
                //         this.hdrawRect(i);
                //         this.drawTriangle(i);
                //         this.hDrawTriangle(i);
                //     }
                // } else {
                //     for (var i = 15; i > 0; i--) {
                //         this.drawEllipse(i);
                //         this.hDrawEllipse(i);
                //         this.hHalfDrawEllipse(i);
                //         this.drawRect(i);
                //         this.hdrawRect(i);
                //         this.drawTriangle(i);
                //         this.hDrawTriangle(i);
                //     }
                // }


            };


            ActiveSpeed.prototype.InsBoxLayout = function (workIndex, data, workKey) {

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

            ActiveSpeed.prototype.draw = function (data) {

            };

            return ActiveSpeed;
        }


        ()
    )
;
