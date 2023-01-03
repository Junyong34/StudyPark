import * as d3 from "d3";

const shape = (function () {
    function shape(args) {
        if (!(this instanceof shape)) {
            return new shape(args);
        }

        var list = Object.keys(args || {});
        for (var ix = 0, ixLen = list.length; ix < ixLen; ix++) {
            this[list[ix]] = args[list[ix]];
        }

        this.initProperty();
        this.init();
    }

    shape.prototype.init = function () {
        this.randomDataCreate();
        // 스캐터 차트
        this.drawScatter();

    };
    shape.prototype.randomDataCreate = function () {
        for (var i = 0; i < 5; i++) {
            this.chartData.push([Math.random(), Math.random()]);
        }
    };

    shape.prototype.initProperty = function () {

        this.chartData = [[0.5, 0.5], [0.7, 0.8], [0.4, 0.9], [0.11, 0.32], [0.88, 0.25],
            [0.75, 0.12], [0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]];

        this.chartWidth = 800;
        this.chartHeight = 800;
        this.chartSvg = d3.select('#main').append('svg')
            .attr('width', this.chartWidth).attr('height', this.chartHeight);
        this.padding = {top: 30, right: 30, bottom: 30, left: 30};
        this.xAxisWidth = 700;
        this.yAxisWidth = 700;
        this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.xAxisWidth]);
        this.yScale = d3.scaleLinear().domain([0, 1]).range([0, this.yAxisWidth]);
        this.timer = null
    };

    shape.prototype.drawScatter = function () {

        this.drawCircle();
        this.drawAxis();
        this.animationDot();

    };
    shape.prototype.animationDot = function () {
        if (this.timer) clearTimeout(this.timer);

        this.moveDot();
        this.timer = setTimeout(this.animationDot.bind(this), 500);


    };
    shape.prototype.moveDot = function () {
        let dataLen = this.chartData.length;
        for (var i = 0; i < dataLen; i++) {
            this.chartData[i][0] = Math.random();
            this.chartData[i][1] = Math.random();
        }
        this.drawCircle();
    };
    shape.prototype.drawCircle = function () {
        const that = this;
        this.circleUpdate = this.chartSvg.selectAll('circle').data(this.chartData);
        this.circleEnter = this.circleUpdate.enter();
        this.circleExit = this.circleUpdate.exit();

        this.circleUpdate.transition()
            .duration(200)
            .attr("cx", function (d) {
                return that.padding.left + that.xScale(d[0]);
            })
            .attr("cy", function (d) {
                return that.chartHeight - that.padding.bottom - that.yScale(d[1]);
            });

        this.circleEnter.append("circle")
            .attr("fill", "black")
            .attr("cx", that.padding.left)
            .attr("cy", that.chartHeight - that.padding.bottom)
            .attr("r", 3)
            .transition()
            .duration(200)
            .attr("cx", function (d) {
                return that.padding.left + that.xScale(d[0]);
            })
            .attr("cy", function (d) {
                // console.log(d[1] + " " + that.yScale(d[1]));
                return that.chartHeight - that.padding.bottom - that.yScale(d[1]);
            });

        this.circleExit.transition()
            .duration(200)
            .attr("fill", "white")
            .remove();

    };
    shape.prototype.drawAxis = function () {
        const that = this;
        this.xAxis = d3.axisBottom(this.xScale)
            .ticks(5);

        this.yScale.range([this.yAxisWidth, 0]);

        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(5);

        this.chartSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + this.padding.left + "," + (this.chartHeight - this.padding.bottom) + ")")
            .call(this.xAxis);

        this.chartSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + this.padding.left + "," + (this.chartHeight - this.padding.bottom - this.yAxisWidth) + ")")
            .call(this.yAxis);

        this.yScale.range([0, this.yAxisWidth]);
    };

    return shape

});

export default shape();
