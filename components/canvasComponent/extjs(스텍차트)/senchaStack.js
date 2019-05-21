Ext.define('Exem.chart.CanvasBarWithNagativeChart',{
    extend: 'Ext.container.Container',
    layout: 'fit',
    width: '100%',
    height: '100%',
    firstInit: true,

    // 캔버스 내부의 패딩
    padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    },

    // 범례 표시여부, 위치, 영역너비
    legend: {
        show: true,
        sizeByPosition: { // 위치별 범례영역 너비/높이
            height: 60, // top, bottom
            width: 200 // right, left
        },
        position: ['left', 'right'],
        left: { // Active (db)
            show: true,
            labelInfo: {} // 활성화된 시리즈 라벨
        },
        right: { // Cell Server
            show: true,
            labelInfo: {} // 활성화된 시리즈 라벨
        },
        color: '#3E4248',
        invisibleColor: '#C0C5CA',
        paddingByLabel: 30,
        arcRadius: 5,
        arcPaddingLeft: 30,
        textPaddingLeft: 50
    },

    // 축
    axis: {
        // 상단 영역 (Active, Cell Server 글씨 영역)
        top: {
            size: 20, // 높이
            leftText: 'Active', // 왼쪽 라벨 텍스트
            rightText: 'Cell Server', // 오른쪽 라벨 텍스트
            bracketColor: '#C0C5CA', // 상단 괄호 색상
            color: '#3E4248', // 글자 색상
            font: '13px Arial'
        },
        // 중심 축 (가운데 세로 축)
        center: {
            size: 140, // 중심 축 너비
            padding: 15, // 중심 축과 바의 간격
            scaleDivider: 10, // 눈금선 너비
            bgColor: '#E6E6E6',
            color: '#3E4248',
            scaleColor: '#ABAEB1',
            font: '11px sans-serif'
        },
        // 주변 축 (하단 가로 축)
        bottom: {
            size: 20, // 하단 X축의 높이
            centerLabel: {
                text: 'sec',
                bgColor: '#C0C4CA',
                color: '#3E4248',
                font: '11px sans-serif'
            },
            // 하단 선 색
            horizonColor: '#838a95',
            // x축의 coordinate.barArea.left.maxValue 값에 보정을 넣어줌
            // 즉, 하나의 시리즈의 한 시점(시간)의 누적 값에 공백 값(누적값 * 0.3)을 추가하는데 사용하는 변수
            autoScaleRatio: 0.3,
            // 하단 X축의 라벨 최대개수
            maxLabelCnt: 5
        }
    },

    // 바
    bar: {
        // 비균등 옵션
        unequal: {
            show: true, // 비균등 여부
            period: 5, // 비균등 주기, 5개마다 비균등하게 큰 바차트 적용
            ratio: 2 // 비균등 시 큰 바차트와 작은 바차트의 길이 비율차이, 작은 바 * ratio = 큰 바
        },
        // 바의 개수 (1분 = 60초)
        count: 60,
        // 1개의 바(박스)에 대한 사이즈 설정
        size: {
            width: 0, // 너비
            height: 0, // 작은 바 높이
            bigHeight: 0 // 큰 바 높이
        },
        bgColor: '#F6F6F6',
        left: ['#198FFF', '#A4F59F', '#F8A30D'],
        right: ['#54C24E', '#4FB1FF', '#DF854A', '#CE5741', '#A04232', '#3CA0FF', '#DF854A']
    },

    // 툴팁 표시여부
    tooltip: {
        show: true,
        bgColor: '#FF0000', // 배경색
        color: '#3E4248' // 글씨색
    },

    // 최대값 팁
    maxValueTip: {
        show: true,
        bgColor: '#828A95',
        color: '#FFFFFF'
    },

    // 표시자(인디케이터) 표시여부
    indicator: {
        show: true,
        value: null,
        second: 0,
        text: '',
        size: 16,
        triangleSize: 5, // 지시자 양쪽 튀어나오는 부분의 width
        bgColor: 'rgb(62, 66, 72, 0.5)',
        color: '#FFFFFF',
        font: '11px sans-serif'
    },

    coordinate: {
        chartArea: {
            startX: 0,
            startY: 0,
            width: 0,
            height: 0
        },
        legendArea: {
            leftStartX: 0,
            leftStartY: 0,
            rightStartX: 0,
            rightStartY: 0,
            width: 0,
            height: 0,
            leftData: [], // 왼쪽 legend 좌표 { name: '', startX: 0, startY: 0, width: 0, height: 0 }
            rightData: [] // 오른쪽 legend 좌표
        },
        barArea: {
            leftStartX: 0,
            leftStartY: 0,
            rightStartX: 0,
            rightStartY: 0,
            width: 0,
            height: 0,
            left: {
                dataByTime: {}, // 시간이 key로 된 데이터로 수정된 값들
                series: [], // 전체 시리즈명
                maxValue: 0, // 바 차트의 최대값 (raw value)
                scaleMaxValue: 0, // autoScaleRatio 보정 적용된 바 차트의 최대값
                data: {} // 차트데이터와 좌표를 동시에 가짐 (group by time)
            },
            right: {
                dataByTime: {},
                series: [], // 전체 시리즈명
                maxValue: 0, // 바 차트의 최대값 (raw value)
                scaleMaxValue: 0, // autoScaleRatio 보정 적용된 바 차트의 최대값
                data: {}
            }
        },
        centerArea: { // center axis area
            startX: 0,
            startY: 0,
            width: 0,
            height: 0,
            data: [] // 초 단위의 바
        }
    },

    listeners: {
        resize: function(me, width, height) {
            if (this.firstInit) {
                this.initCanvasProperty();
                this.appendDom();
                this.initMouseEvent();
            }
            this.resizeCanvas(width, height, function() {
                this.initChartAreaCoordinate();
                this.initBarAreaCoordinate();
                this.initCenterAreaCoordinate();
                this.drawBgContents();
                if (this.indicator.show && this.indicator.value) {
                    this.drawIndicator();
                }
                if (!this.firstInit) {
                    if (this.legend.position.length > 0) {
                        var position = this.legend.position;
                        for (var ix = 0, ixLen = position.length; ix < ixLen; ix++) {
                            this.setMaxValue(position[ix]);
                            this.setAxisLabel(position[ix]);
                            this.drawChart(position[ix], false);
                            this.drawLegendArea(position[ix]);
                        }
                    }
                }
            }.bind(this));
            if (this.firstInit) {
                this.firstInit = false;
            }
        },
        beforedestroy: function() {
            this.removeMouseEvent();
            this.removeDom();
        }
    },

    initCanvasProperty: function() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = 0;
        this.canvas.style.left = 0;

        this.over = document.createElement('canvas');
        this.overCtx = this.over.getContext('2d');
        this.over.style.position = 'absolute';
        this.over.style.top = 0;
        this.over.style.left = 0;
    },
    appendDom: function() {
        this.el.dom.appendChild(this.canvas);
        this.el.dom.appendChild(this.over);
    },
    removeDom: function() {
        this.canvas = null;
        this.over = null;
    },

    resizeCanvas: function(width, height, callback) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.over.width = width;
        this.over.height = height;
        if (callback && typeof callback == 'function') {
            callback();
        }
    },
    initChartAreaCoordinate: function() {
        var widthExceptPadding = this.canvas.width - this.padding.left - this.padding.right;
        var heightExceptPadding = this.canvas.height - this.padding.top - this.padding.bottom;
        var chartAreaStartX, chartAreaStartY, chartAreaWidth, chartAreaHeight;
        if (this.legend.show) {
            chartAreaStartX = this.padding.left + this.legend.sizeByPosition.width;
            chartAreaStartY = this.padding.top;
            chartAreaWidth = widthExceptPadding - (this.legend.sizeByPosition.width * 2);
            chartAreaHeight = heightExceptPadding;
            this.coordinate.legendArea.leftStartX = this.padding.left;
            this.coordinate.legendArea.leftStartY = this.padding.top;
            this.coordinate.legendArea.rightStartX = this.canvas.width - this.padding.right - this.legend.sizeByPosition.width;
            this.coordinate.legendArea.rightStartY = this.padding.top;
            this.coordinate.legendArea.width = this.legend.sizeByPosition.width;
            this.coordinate.legendArea.height = heightExceptPadding;
        } else {
            chartAreaStartX = this.padding.left;
            chartAreaStartY = this.padding.top;
            chartAreaWidth = widthExceptPadding;
            chartAreaHeight = heightExceptPadding;
        }
        this.coordinate.chartArea = {
            startX: chartAreaStartX,
            startY: chartAreaStartY,
            width: Math.floor(chartAreaWidth / 10) * 10, // 일의자리 숫자 버림
            height: Math.floor(chartAreaHeight / 10) * 10 // 일의자리 숫자 버림
        };
    },
    initBarAreaCoordinate: function() {
        var chartArea = this.coordinate.chartArea;
        var axisTop = this.axis.top;
        var axisCenter = this.axis.center;
        var axisBottom = this.axis.bottom;
        var barSizeWidth = (chartArea.width - axisCenter.size - (axisCenter.padding * 4)) / 2;
        this.bar.size.width = barSizeWidth;
        this.coordinate.barArea.leftStartX = chartArea.startX + axisCenter.padding;
        this.coordinate.barArea.leftStartY = chartArea.startY + axisTop.size;
        this.coordinate.barArea.rightStartX = chartArea.startX + barSizeWidth + (axisCenter.padding * 3) + axisCenter.size;
        this.coordinate.barArea.rightStartY = chartArea.startY + axisTop.size;
        this.coordinate.barArea.width = barSizeWidth;
        this.coordinate.barArea.height = chartArea.height - axisTop.size - axisBottom.size;
        var barArea = this.coordinate.barArea;
        var barCount = this.bar.count;
        var barUnequal = this.bar.unequal;
        if (this.bar.unequal.show) {
            var bigBarCnt = Math.floor(barCount / barUnequal.period);
            var smallBarCnt = barCount - Math.floor(barCount / barUnequal.period);
            var paddingBetweenBarCnt = barCount;
            var regularRatio = paddingBetweenBarCnt + smallBarCnt + (barUnequal.ratio * bigBarCnt);
            var regularRatioSize = barArea.height / regularRatio; // 1개 작은 바 높이 또는 바 여백 (padding)
            this.bar.size.height = regularRatioSize;
            this.bar.size.bigHeight = (regularRatioSize * barUnequal.ratio);
        } else {
            var regularRatioSize = Math.floor(barArea.height / (barCount * 2));
            this.bar.size.height = regularRatioSize;
            this.bar.size.bigHeight = regularRatioSize;
        }
    },
    initCenterAreaCoordinate: function() {
        var chartArea = this.coordinate.chartArea;
        var axisTop = this.axis.top;
        var axisCenter = this.axis.center;
        var axisBottom = this.axis.bottom;
        this.coordinate.centerArea = {
            startX: chartArea.startX + this.bar.size.width + (axisCenter.padding * 2),
            startY: chartArea.startY + axisTop.size,
            width: axisCenter.size,
            height: chartArea.height - axisTop.size - axisBottom.size
        };
    },

    // draw logic
    drawBgContents: function() {
        this.drawStaticContents();
        this.drawBgBarArea();
    },
    drawBgBarArea: function() {
        var ctx = this.ctx;
        var barArea = this.coordinate.barArea;
        var centerArea = this.coordinate.centerArea;
        var textCenterX = this.coordinate.centerArea.startX + (this.coordinate.centerArea.width / 2);
        var barSize = this.bar.size;
        var barCount = this.bar.count;
        var axisCenter = this.axis.center;
        var currBarHeight;
        var appendedHeight = 0;
        this.coordinate.centerArea.data = [];
        for (var ix = 0, ixLen = (barCount * 2); ix < ixLen; ix++) {
            currBarHeight = barSize.height;
            if (ix % 2 == 0 && ix !== (barCount * 2)) {
                if (ix % 10 == 0) {
                    currBarHeight = barSize.bigHeight;
                }
                // draw background gray bar
                ctx.fillStyle = this.bar.bgColor;
                ctx.fillRect(
                    barArea.leftStartX,
                    barArea.leftStartY + appendedHeight,
                    barArea.width,
                    currBarHeight
                );
                ctx.fillRect(
                    barArea.rightStartX,
                    barArea.rightStartY + appendedHeight,
                    barArea.width,
                    currBarHeight
                );
                // set coordinate centerArea data (초단위 좌표값 저장)
                this.coordinate.centerArea.data.push({
                    seconds: ix / 2,
                    startX: centerArea.startX,
                    startY: centerArea.startY + appendedHeight,
                    width: centerArea.width,
                    height: currBarHeight
                });
            }
            appendedHeight += currBarHeight;
            if (ix % 10 == 0 || ix == ixLen - 2) {
                // draw Yaxis Label (seconds: 0, 5, 10, ..., 55, 59)
                ctx.save();
                ctx.fillStyle = axisCenter.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = axisCenter.font;
                ctx.fillText(
                    (ix / 2),
                    textCenterX,
                    barArea.leftStartY + appendedHeight
                );
                ctx.restore();

                // draw scale divider (양쪽 눈금선 그리기, 5단위)
                if (ix != ixLen - 2) {
                    ctx.beginPath();
                    ctx.moveTo(
                        centerArea.startX,
                        barArea.leftStartY + appendedHeight - (barSize.bigHeight / 2)
                    );
                    ctx.lineTo(
                        centerArea.startX + axisCenter.scaleDivider,
                        barArea.leftStartY + appendedHeight - (barSize.bigHeight / 2)
                    );
                    ctx.strokeStyle = axisCenter.scaleColor;
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();
                    ctx.moveTo(
                        centerArea.startX + centerArea.width,
                        barArea.leftStartY + appendedHeight - (barSize.bigHeight / 2)
                    );
                    ctx.lineTo(
                        centerArea.startX + centerArea.width - axisCenter.scaleDivider,
                        barArea.leftStartY + appendedHeight - (barSize.bigHeight / 2)
                    );
                    ctx.strokeStyle = axisCenter.scaleColor;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    },
    drawStaticContents: function() {
        var ctx = this.ctx;
        var barArea = this.coordinate.barArea;
        var centerArea = this.coordinate.centerArea;
        var barSize = this.bar.size;
        var axisTop = this.axis.top;
        var axisBottom = this.axis.bottom;

        // draw center axis box
        ctx.beginPath();
        ctx.moveTo(centerArea.startX, centerArea.startY);
        ctx.lineTo(centerArea.startX + centerArea.width, centerArea.startY);
        ctx.lineTo(centerArea.startX + centerArea.width, centerArea.startY + centerArea.height);
        ctx.lineTo(centerArea.startX, centerArea.startY + centerArea.height);
        ctx.lineTo(centerArea.startX, centerArea.startY);
        ctx.fillStyle = this.axis.center.bgColor;
        ctx.fill();
        ctx.closePath();

        // draw bottom horizon line
        ctx.beginPath();
        ctx.moveTo(
            barArea.leftStartX,
            centerArea.startY + centerArea.height + barSize.height
        );
        ctx.lineTo(
            barArea.rightStartX + barArea.width,
            centerArea.startY + centerArea.height + barSize.height
        );
        ctx.strokeStyle = this.axis.bottom.horizonColor;
        ctx.stroke();
        ctx.closePath();

        // draw bottom box
        ctx.beginPath();
        ctx.moveTo(
            centerArea.startX,
            centerArea.startY + centerArea.height + (barSize.height * 2)
        );
        ctx.lineTo(
            centerArea.startX + centerArea.width,
            centerArea.startY + centerArea.height + (barSize.height * 2)
        );
        ctx.lineTo(
            centerArea.startX + centerArea.width,
            centerArea.startY + centerArea.height + (barSize.height * 2) + axisBottom.size
        );
        ctx.lineTo(
            centerArea.startX,
            centerArea.startY + centerArea.height + (barSize.height * 2) + axisBottom.size
        );
        ctx.fillStyle = axisBottom.centerLabel.bgColor;
        ctx.fill();
        ctx.closePath();

        // draw Unit Text (UNIT: sec)
        ctx.save();
        ctx.fillStyle = axisBottom.centerLabel.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = axisBottom.centerLabel.font;
        ctx.fillText(
            axisBottom.centerLabel.text,
            centerArea.startX + (centerArea.width / 2),
            centerArea.startY + centerArea.height + (barSize.height * 2) + (axisBottom.size / 2)
        );
        ctx.restore();

        // draw Top Bracket Label
        ctx.beginPath();
        ctx.moveTo(
            barArea.leftStartX,
            barArea.leftStartY - barSize.height
        );
        ctx.lineTo(
            barArea.leftStartX,
            barArea.leftStartY - barSize.height - (axisTop.size / 2)
        );
        ctx.lineTo(
            barArea.leftStartX + barArea.width,
            barArea.leftStartY - barSize.height - (axisTop.size / 2)
        );
        ctx.lineTo(
            barArea.leftStartX + barArea.width,
            barArea.leftStartY - barSize.height
        );
        ctx.strokeStyle = axisTop.bracketColor;
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(
            barArea.rightStartX,
            barArea.rightStartY - barSize.height
        );
        ctx.lineTo(
            barArea.rightStartX,
            barArea.rightStartY - barSize.height - (axisTop.size / 2)
        );
        ctx.lineTo(
            barArea.rightStartX + barArea.width,
            barArea.rightStartY - barSize.height - (axisTop.size / 2)
        );
        ctx.lineTo(
            barArea.rightStartX + barArea.width,
            barArea.rightStartY - barSize.height
        );
        ctx.strokeStyle = axisTop.bracketColor;
        ctx.stroke();
        ctx.closePath();

        // draw Bracket Text
        this.drawTextWithBG(
            axisTop.leftText,
            barArea.leftStartX + (barArea.width / 2),
            barArea.leftStartY - barSize.height - (axisTop.size / 2)
        );
        this.drawTextWithBG(
            axisTop.rightText,
            barArea.rightStartX + (barArea.width / 2),
            barArea.rightStartY - barSize.height - (axisTop.size / 2)
        );
    },
    drawLegendArea: function(type) {
        var overCtx = this.overCtx;
        var legendArea = this.coordinate.legendArea;
        var labelInfo = this.legend[type].labelInfo;
        var paddingByLabel = this.legend.paddingByLabel;
        var arcPaddingLeft = this.legend.arcPaddingLeft;
        var arcRadius = this.legend.arcRadius;
        var textPaddingLeft = this.legend.textPaddingLeft;
        var legendColor = this.legend.color;
        var legendInvisibleColor = this.legend.invisibleColor;
        var labelInfoKeys = Object.keys(labelInfo);
        var legendInfo = {};
        var legendTextLength = 0;
        // legend area clear
        this.clearOver(
            legendArea[type+'StartX'],
            legendArea[type+'StartY'],
            legendArea.width,
            legendArea.height
        );
        // init legend coordinate
        this.coordinate.legendArea[type+'Data'] = [];
        // draw legend
        for (var ix = 0, ixLen = labelInfoKeys.length; ix < ixLen; ix++) {
            var labelName = labelInfoKeys[ix];
            var labelObj = labelInfo[labelInfoKeys[ix]];
            var iconColor = labelObj.color;
            var visible = labelObj.visible;
            overCtx.beginPath();
            overCtx.save();
            overCtx.fillStyle = iconColor;
            overCtx.arc(
                legendArea[type+'StartX'] + arcPaddingLeft,
                legendArea[type+'StartY'] + (paddingByLabel * (ix + 1)),
                arcRadius,
                0, Math.PI * 2, true
            );
            overCtx.fill();
            overCtx.fillStyle = legendColor;
            if (!visible) {
                overCtx.fillStyle = legendInvisibleColor;
            }
            overCtx.textBaseline = 'middle';
            overCtx.fillText(
                labelName,
                legendArea[type+'StartX'] + textPaddingLeft,
                legendArea[type+'StartY'] + (paddingByLabel * (ix + 1))
            );
            legendTextLength = overCtx.measureText(labelName).width;
            overCtx.restore();
            overCtx.closePath();
            // set legend coordinate
            legendInfo = {
                name: labelName,
                startX: legendArea[type+'StartX'] + arcPaddingLeft - arcRadius,
                startY: legendArea[type+'StartY'] + (paddingByLabel * (ix + 1)) - arcRadius,
                width: arcRadius - arcPaddingLeft + textPaddingLeft + legendTextLength,
                height: arcRadius * 2
            };
            this.coordinate.legendArea[type+'Data'].push(legendInfo);
        }
    },
    clearOver: function(x, y, w, h) {
        if (x && y && w && h) {
            this.overCtx.clearRect(x, y, w, h);
        } else {
            this.overCtx.clearRect(0, 0, this.over.width, this.over.height);
        }
    },
    drawTextWithBG: function(text, x, y) {
        var ctx = this.ctx;
        var axisTop = this.axis.top;
        var axisCenter = this.axis.center;
        var textPadding = 10;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = axisTop.font;
        var width = ctx.measureText(text).width;
        var height = parseInt(axisCenter.font, 10);
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(
            x - (width / 2) - textPadding,
            y - (height / 2),
            width + (textPadding * 2),
            height
        );
        ctx.fillStyle = axisTop.color;
        ctx.fillText(text, x, y);
        ctx.restore();
    },
    setIndicatorObj: function(value) {
        this.indicator.value = value;
        this.indicator.text = Ext.util.Format.date(value, 'i:s');
        this.indicator.second = +Ext.util.Format.date(value, 's');
        this.drawIndicator();
    },
    drawIndicator: function() {
        if (this.indicator.show) {
            var ctx = this.overCtx;
            var centerArea = this.coordinate.centerArea;
            var indicator = this.indicator;
            var sec = this.indicator.second;
            var barSize = this.bar.size;
            this.clearOver(
                centerArea.startX - indicator.triangleSize,
                this.padding.top,
                centerArea.width + (indicator.triangleSize * 2),
                this.canvas.height - this.padding.bottom
            );
            var totalBarCnt = (sec * 2) + 1;
            var bigBarCnt = Math.floor(sec / 5) + 1;
            var normalBarCnt = totalBarCnt - bigBarCnt;
            var computedHeight = (barSize.height * normalBarCnt) + (barSize.bigHeight * bigBarCnt);
            var currentBarHeight = sec % 5 == 0 ? barSize.bigHeight : barSize.height;

            // draw indicator box
            ctx.beginPath();
            ctx.moveTo(
                centerArea.startX,
                centerArea.startY + computedHeight - (currentBarHeight / 2) - (indicator.size / 2)
            );
            ctx.lineTo(
                centerArea.startX + centerArea.width,
                centerArea.startY + computedHeight - (currentBarHeight / 2) - (indicator.size / 2)
            );
            ctx.lineTo(
                centerArea.startX + centerArea.width + indicator.triangleSize,
                centerArea.startY + computedHeight - (currentBarHeight / 2)
            );
            ctx.lineTo(
                centerArea.startX + centerArea.width,
                centerArea.startY + computedHeight - (currentBarHeight / 2) + (indicator.size / 2)
            );
            ctx.lineTo(
                centerArea.startX,
                centerArea.startY + computedHeight - (currentBarHeight / 2) + (indicator.size / 2)
            );
            ctx.lineTo(
                centerArea.startX - indicator.triangleSize,
                centerArea.startY + computedHeight - (currentBarHeight / 2)
            );
            ctx.lineTo(
                centerArea.startX,
                centerArea.startY + computedHeight - (currentBarHeight / 2) - (indicator.size / 2)
            );
            ctx.fillStyle = indicator.bgColor;
            ctx.fill();
            ctx.closePath();

            // draw indicator text
            ctx.save();
            ctx.fillStyle = indicator.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = indicator.font;
            ctx.fillText(
                indicator.text,
                centerArea.startX + (centerArea.width / 2),
                centerArea.startY + computedHeight - (currentBarHeight / 2)
            );
            ctx.restore();
        }
    },
    initMouseEvent: function() {
        this.over.addEventListener('mousemove', this.initMousemove.bind(this));
        this.over.addEventListener('click', this.initMouseClick.bind(this));
        this.over.addEventListener('dblclick', this.initMouseDblclick.bind(this));
    },
    removeMouseEvent: function() {
        this.over.removeEventListener('mousemove', this.initMousemove.bind(this));
        this.over.removeEventListener('click', this.initMouseClick.bind(this));
        this.over.removeEventListener('dblclick', this.initMouseDblclick.bind(this));
    },
    initMousemove: function(e) {
        var centerArea = this.coordinate.centerArea;
        var centerBox = {
            startX: centerArea.startX,
            startY: centerArea.startY,
            endX: centerArea.startX + centerArea.width,
            endY: centerArea.startY + centerArea.height
        };
        var mouseoverX = e.offsetX;
        var mouseoverY = e.offsetY;
        var mouseoverFlag = false;
        if (mouseoverX > centerBox.startX && mouseoverX < centerBox.endX
            && mouseoverY > centerBox.startY && mouseoverY < centerBox.endY) {
            mouseoverFlag = true;
        }
        var breakUse = false;

        if (this.legend.show) {
            var legendArea = this.coordinate.legendArea;
            var legendPosition = this.legend.position;
            for (var ix = 0, ixLen = legendPosition.length; ix < ixLen; ix++) {
                var position = legendPosition[ix];
                if (this.legend[position].show) {
                    var legendCoordinateData = legendArea[position+'Data'];
                    for (var jx = 0, jxLen = legendCoordinateData.length; jx < jxLen; jx++) {
                        var legendInfo = legendCoordinateData[jx];
                        var legendBox = {
                            startX: legendInfo.startX,
                            startY: legendInfo.startY,
                            endX: legendInfo.startX + legendInfo.width,
                            endY: legendInfo.startY + legendInfo.height
                        };
                        if (mouseoverX > legendBox.startX && mouseoverX < legendBox.endX
                            && mouseoverY > legendBox.startY && mouseoverY < legendBox.endY) {
                            mouseoverFlag = true;
                            breakUse = true;
                            break;
                        }
                    }
                    if (breakUse) {
                        break;
                    }
                }
            }
        }

        if (mouseoverFlag) {
            this.over.style.cursor = 'pointer';
        } else {
            this.over.style.cursor = 'default';
        }
    },
    initMouseClick: function(e) {
        var mouseoverX = e.offsetX;
        var mouseoverY = e.offsetY;
        var breakUse = false;

        if (this.legend.show) {
            var legendArea = this.coordinate.legendArea;
            var legendPosition = this.legend.position;
            for (var ix = 0, ixLen = legendPosition.length; ix < ixLen; ix++) {
                var position = legendPosition[ix];
                if (this.legend[position].show) {
                    var labelInfo = this.legend[position].labelInfo;
                    var legendCoordinateData = legendArea[position+'Data'];
                    for (var jx = 0, jxLen = legendCoordinateData.length; jx < jxLen; jx++) {
                        var legendInfo = legendCoordinateData[jx];
                        var legendBox = {
                            startX: legendInfo.startX,
                            startY: legendInfo.startY,
                            endX: legendInfo.startX + legendInfo.width,
                            endY: legendInfo.startY + legendInfo.height
                        };
                        if (mouseoverX > legendBox.startX && mouseoverX < legendBox.endX
                            && mouseoverY > legendBox.startY && mouseoverY < legendBox.endY) {
                            var clickedLegendName = legendInfo.name;
                            var visible = labelInfo[clickedLegendName].visible;
                            this.changeSeriesVisible(position, clickedLegendName, !visible);
                            breakUse = true;
                            break;
                        }
                    }
                    if (breakUse) {
                        break;
                    }
                }
            }
        }
    },
    initMouseDblclick: function(e) {
        var centerArea = this.coordinate.centerArea;
        var centerBox = {
            startX: centerArea.startX,
            startY: centerArea.startY,
            endX: centerArea.startX + centerArea.width,
            endY: centerArea.startY + centerArea.height
        };
        var dblClickX = e.offsetX;
        var dblClickY = e.offsetY;
        if (dblClickX > centerBox.startX && dblClickX < centerBox.endX
            && dblClickY > centerBox.startY && dblClickY < centerBox.endY) {
            var selectedSeconds = 59;
            for (var ix = 1, ixLen = centerArea.data.length; ix < ixLen; ix++) {
                if (dblClickY < centerArea.data[ix].startY) {
                    selectedSeconds = ix - 1;
                    break;
                }
            }
            var dateTime = Ext.util.Format.date(this.indicator.value, 'Y-m-d H:i') + ':' + common.Util.lPad(selectedSeconds, '0', 2);
            this.setIndicatorObj(dateTime);
        }
    },
    setChartData: function(data, type) {
        // idx) 0: name, 1: time, 2: value
        this.setModifiedChartData(data, type);
        this.setSeriesName(data, type, function() {
            this.setMaxValue(type);
            this.setAxisLabel(type);
            this.drawChart(type, true);
            this.drawLegendArea(type);
        }.bind(this));
    },
    changeSeriesVisible: function(type, seriesName, visible) {
        this.setSeriesVisible(type, seriesName, visible, function() {
            this.setMaxValue(type);
            this.setAxisLabel(type);
            this.drawChart(type, false);
            this.drawLegendArea(type);
        }.bind(this));
    },
    setModifiedChartData: function(data, type) {
        // set modified chartData for stackedChart
        this.coordinate.barArea[type].dataByTime = {};
        var obj = this.coordinate.barArea[type].dataByTime;
        for (var ix = 0, ixLen = data.length; ix < ixLen; ix++) {
            if (!obj[data[ix][1]]) {
                obj[data[ix][1]] = {};
            }
            if (!obj[data[ix][1]].data) {
                obj[data[ix][1]].data = [];
            }
            if (!obj[data[ix][1]].sumValue) {
                obj[data[ix][1]].sumValue = 0;
            }
            // value 가 0 이상의 유효한 값
            if (data[ix][2] > 0) {
                obj[data[ix][1]].data.push({
                    name: data[ix][0],
                    value: data[ix][2]
                });
                obj[data[ix][1]].sumValue += data[ix][2];
            }
        }
    },
    setSeriesName: function(data, type, callback) {
        // set Series
        this.coordinate.barArea[type].series = [];
        this.legend[type].labelInfo = {};
        data.filter(function(v) {
            if (this.coordinate.barArea[type].series.indexOf(v[0]) == -1) {
                // 전체 시리즈
                this.coordinate.barArea[type].series.push(v[0]);
                // 활성화된 시리즈
                var idx = Object.keys(this.legend[type].labelInfo).length;
                this.legend[type].labelInfo[v[0]] = {};
                this.legend[type].labelInfo[v[0]].color = this.bar[type][idx];
                this.legend[type].labelInfo[v[0]].visible = true;
            }
        }.bind(this));

        if (callback && typeof callback == 'function') {
            callback();
        }
    },
    setSeriesVisible: function(type, seriesName, visible, callback) {
        if (this.legend[type].labelInfo
            && this.legend[type].labelInfo[seriesName]) {
            this.legend[type].labelInfo[seriesName].visible = visible;
            if (callback && typeof callback == 'function') {
                callback();
            }
        }
    },
    setMaxValue: function(type) {
        // set maxValue
        this.coordinate.barArea[type].maxValue = 0;
        this.coordinate.barArea[type].scaleMaxValue = 0;
        var maxNum = 0;
        var axisAutoScaleRatio = this.axis.bottom.autoScaleRatio;
        var dataByTime = this.coordinate.barArea[type].dataByTime;
        var labelInfo = this.legend[type].labelInfo;
        var allVisible = true; // 모든 시리즈의 visible 여부
        var labelInfoKeys = Object.values(labelInfo);
        for (var ix = 0, ixLen = labelInfoKeys.length; ix < ixLen; ix++) {
            if (!labelInfoKeys[ix].visible) {
                allVisible = false;
                break;
            }
        }
        if (allVisible) {
            Object.values(dataByTime).filter(function(v) {
                if (maxNum < v.sumValue) {
                    maxNum = v.sumValue;
                }
            });
        } else {
            var tempSum = 0;
            var data;
            Object.values(dataByTime).filter(function(v) {
                tempSum = 0;
                if (v.data && v.data.length > 0) {
                    for (var ix = 0, ixLen = v.data.length; ix < ixLen; ix++) {
                        if (labelInfo[v.data[ix].name].visible) {
                            tempSum += v.data[ix].value;
                        }
                    }
                }

                if (maxNum < tempSum) {
                    maxNum = tempSum;
                }
            });
        }

        this.coordinate.barArea[type].maxValue = maxNum;
        var maxLabelCnt = this.axis.bottom.maxLabelCnt;
        if (maxNum < (maxLabelCnt - 1)) {
            this.coordinate.barArea[type].scaleMaxValue = maxLabelCnt - 1;
        } else {
            this.coordinate.barArea[type].scaleMaxValue = (Math.ceil(maxNum * (1 + axisAutoScaleRatio) / (maxLabelCnt - 1))) * (maxLabelCnt - 1);
        }
    },
    setAxisLabel: function(type) {
        var maxLabelCnt = this.axis.bottom.maxLabelCnt;
        var barArea = this.coordinate.barArea;
        var centerArea = this.coordinate.centerArea;
        var scaleMaxValue = this.coordinate.barArea[type].scaleMaxValue;
        var overCtx = this.overCtx;
        var barSize = this.bar.size;
        var axisBottom = this.axis.bottom;
        var axisCenter = this.axis.center;
        this.clearOver(
            barArea[type+'StartX'] - axisCenter.padding,
            centerArea.startY + centerArea.height + (barSize.height * 2),
            barArea.width + (axisCenter.padding * 2),
            axisBottom.size
        );
        var labelValue = 0;
        var oneLabelUnit = 1;
        if (scaleMaxValue >= (maxLabelCnt - 1)) {
            oneLabelUnit = scaleMaxValue / (maxLabelCnt - 1); // 하나의 라벨의 단위 (소수)
        }
        for (var ix = 0, ixLen = maxLabelCnt; ix < ixLen; ix++) {
            labelValue = Math.floor(oneLabelUnit * ix); // 값을 버림함
            overCtx.save();
            overCtx.textAlign = 'center';
            overCtx.fillStyle = axisCenter.color;
            overCtx.font = axisCenter.font;
            var startX = type == 'left'
                ? barArea.leftStartX + barArea.width - (barArea.width / scaleMaxValue * labelValue)
                : barArea.rightStartX + (barArea.width / scaleMaxValue * labelValue);
            overCtx.fillText(
                labelValue,
                startX,
                centerArea.startY + centerArea.height + (barSize.height * 2) + (axisBottom.size / 2)
            );
            overCtx.restore();
        }
    },
    drawChart: function(type, initFlag) {
        if (initFlag) {
            this.coordinate.barArea[type].data = [];
        }
        var overCtx = this.overCtx;
        var barArea = this.coordinate.barArea;
        var dataByTime = this.coordinate.barArea[type].dataByTime;
        var centerAreaData = this.coordinate.centerArea.data;
        var labelInfo = this.legend[type].labelInfo;
        var dataByTimeKeys = Object.keys(dataByTime);
        var second = 0;
        // type이 left인 경우는 centerArea를 중심으로 좌표를 시계반대반향으로 돌리도록 함
        var startX = type == 'left'
            ? barArea[type+'StartX'] + barArea.width
            : barArea[type+'StartX'];
        var startY = 0;
        var height = 0;
        var fullWidth = barArea.width;
        var data;
        var scaleMaxValue = this.coordinate.barArea[type].scaleMaxValue;
        var accumulateStartX = 0;
        var obj = {};
        this.clearOver(barArea[type+'StartX'], barArea[type+'StartY'], barArea.width, barArea.height);
        for (var ix = 0, ixLen = dataByTimeKeys.length; ix < ixLen; ix++) {
            // 합계 데이터가 0 초과인 경우 (현재 시간(sec)에 데이터가 하나라도 있는 경우)
            if (dataByTime[dataByTimeKeys[ix]].sumValue > 0) {
                second = +Ext.util.Format.date(dataByTimeKeys[ix], 's');
                startY = centerAreaData[second].startY;
                height = centerAreaData[second].height;
                data = dataByTime[dataByTimeKeys[ix]].data;
                accumulateStartX = 0; // 누적 startX
                for (var jx = 0, jxLen = data.length; jx < jxLen; jx++) {
                    var name = data[jx].name;
                    obj = {};
                    // 데이터의 name legend label이 visible 상태인지 확인
                    // legend 영역에서 라벨을 클릭하여 비활성화 한경우에는 데이터가 있더라도 출력 X
                    // 데이터의 name이 visible인 경우
                    if (labelInfo[name] && labelInfo[name].visible) {
                        var value = data[jx].value; // 해당 시간대의 값 (cnt)
                        var valuePercent = value / scaleMaxValue; // 0 ~ 1
                        var percentWidth = fullWidth * valuePercent; // 퍼센트가 적용된 너비
                        var obj = {
                            startX: type == 'left'
                                ? startX - accumulateStartX
                                : startX + accumulateStartX,
                            startY: startY,
                            width: percentWidth,
                            height: height,
                            name: name,
                            value: value,
                            color: labelInfo[name].color
                        };
                        if (!this.coordinate.barArea[type].data[dataByTimeKeys[ix]]) {
                            this.coordinate.barArea[type].data[dataByTimeKeys[ix]] = [];
                        }

                        overCtx.save();
                        overCtx.beginPath();
                        overCtx.moveTo(obj.startX, obj.startY);
                        if (type == 'left') {
                            overCtx.lineTo(obj.startX - obj.width, obj.startY);
                            overCtx.lineTo(obj.startX - obj.width, obj.startY + obj.height);
                        } else if (type == 'right') {
                            overCtx.lineTo(obj.startX + obj.width, obj.startY);
                            overCtx.lineTo(obj.startX + obj.width, obj.startY + obj.height);
                        }
                        overCtx.lineTo(obj.startX, obj.startY + obj.height);
                        overCtx.lineTo(obj.startX, obj.startY);
                        overCtx.fillStyle = obj.color;
                        overCtx.fill();
                        overCtx.closePath();
                        overCtx.restore();

                        this.coordinate.barArea[type].data[dataByTimeKeys[ix]].push(obj);
                        accumulateStartX += percentWidth;
                    }
                }
            }
        }
    }
});
