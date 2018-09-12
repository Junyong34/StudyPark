var RtChart = (function () {
	'use strict';

	var chartPrototype, chart;
	chart = function(id){

		// 아마 스텟(category) 저장용 나중에 스텟선택창에서 선택할때 변경?? -----------------------------------------
		//this.stat = stat.statname;
		//this.type = stat.statname + ' chart';
		//this.labelSelectedList = null;
		// -----------------------------------------

		// 일딴 안쓰고 있는 것들
		//this.timer = null;
		//this.previousPoint = null;
		//this.contentLayer = null;
		//this.chartLayer = null;
		//this.isTracking = false;

		this.id = id;
		this.index = null;
		this.contents = null; // this.contents
		this.data = null;
		this.title = '';
		this.minHeight = 0;
		this.maxHeight = 100;
		this.maxRate = 1.2;
		this.minRate = 0.8;
		this.theme = 'black';
		this.toolTip = null;
		this.colorSet = null;
		this.servertype = null;
		this.updateTime = 3000;
		this.template = '';

		this.chartOption = null;
	};

	chartPrototype = chart.prototype;

	chartPrototype.onData = function(data){
		this.updateContents(this.parseData(data));
	};

	chartPrototype.parseData = function (data) {
		// TODO : 받은 데이터 flot 차트에 맞게 parsing
		// var chartData = {};
		// return chartData;
		return data;
	};

	chartPrototype.changeTitle = function (servertype, title) {
		var targetNode = this.targetNode || $('#' + this.id);
		this.servertype = servertype;
		this.title = title;
		targetNode.find('.chart_title').children('.server_type').text(this.servertype);
		targetNode.find('.chart_title').children('.stat_name').text(this.title);
	};


	chartPrototype.getMaxPoint = function (target, stat) {
		var myData = target.getData();

		var fullData = [];
		var myDataLen = myData.length;

		while (myDataLen--) {
			var d = myData[myDataLen];
			var dd = d.data;

			//if (d.ref) { // 원본 데이터를 ref에 받아서 검사했었음 현재는 없으니 일딴 주석
				//var idx = 0;
				var my = _.max(dd, function (rr, i) {
					return rr[1];
				});

				// max point label
				if(my.length) {
					my[2] = d.label;
				}

				fullData.push(my);
			//}
		}

		var result = {
			value: [0, 0],
			point: {
				left: 0,
				right: 0
			}
		};

		if (fullData.length) {
			var nana = _.max(fullData, function (rr) {
				return rr[1];
			});

			var point = target.pointOffset({
				x: nana[0],
				y: nana[1]
			});

			result = {
				label: nana[2],
				value: nana,
				point: point,
				alias: 'NA'
			};
			return result;
		} else {

			result = {
				label: '',
				value: [0, 0],
				point: {
					left: 0,
					top: 0
				}
			};
			return result;
		}
	};

	chartPrototype.updateContents = function (data) {
		if (!this.contents) {
			window.alert('chart contents not created!');
			return;
		}

		var dataSize = data.length;
		var axis = this.contents.getAxes();

		var ybasket = [];
		_.each(data, function (d) {
			if(d.data !== undefined) {
				d.data.forEach(function (dd) {
					ybasket.push(dd[1]);
				});
			}
		});

		var ymax = _.max(ybasket);
		axis.xaxis.options.min = App.startTime - (dataSize * this.updateTime);
		axis.xaxis.options.max = App.startTime;

		if (ymax > this.maxHeight) {
			axis.yaxis.options.max = ymax;
		} else {
			axis.yaxis.options.max = this.maxHeight;
		}

		this.contents.setupGrid();
		this.contents.setData(data);
		this.contents.draw();

		var maxs = this.getMaxPoint(this.contents, this.stat);

		var ml = maxs.point.left;
		var mt = maxs.point.top;
		var innerHtmlStr = '';
		if (!isNaN(ml) && !isNaN(mt) && ml > 0 && mt > 0 && this.maxPoint) {
				var mpw = this.maxPoint.outerWidth();
				var maxR = maxs.point.left;
				var top = maxs.point.top;
				var left = maxR;
				var myleft = left - (mpw / 2);
				var fixed = 0;
				var dMax = this.maxPoint[0];
				var dMaxStyle = dMax.style;
				if (myleft < 0) {
					dMaxStyle.cssText += ';display:none;';
				} else {
					fixed = myleft;
					var lr = 'left:' + fixed + 'px;';

					// var ct = maxs.alias + '<br/>';
					var cv = accounting.formatMoney(maxs.value[1], '', 0);
					innerHtmlStr = '<div style="text-align:center">' + maxs.label + '</div>';
					innerHtmlStr += '<div style="text-align:center">' + cv + '</div>';
					dMax.innerHTML = innerHtmlStr;
					dMaxStyle.cssText += ';display:block;' + lr + ';top:' + top + 'px;';
				}
		} else if (this.maxPoint) {
			this.maxPoint.css('display', 'none');
		}
	};

	chartPrototype.init = function (properties) {
		var prop, targetNode;
		if(properties){
			for(prop in properties){
				this[prop] !== undefined && (this[prop] = properties[prop]);
			}
		}
		targetNode = this.targetNode;

		this.initTemplete();
		this.initChartOption();
		this.createContents(targetNode);
		this.initEvent(targetNode);
	};

	chartPrototype.initTemplete = function(){
		this.template = '<div class="chart_wrapper" data-startindex=' + this.index + '>' +
							// '<div class="chart_title" data-role="' + this.title + '">' +
								// '<span class="stat_name">' + this.title + '</span>' +
								// '<div class="server_type">' + this.servertype + '</div>' +
								// '<b class="caret"></b>' +
								// '<a href="" class="chart_pop" data-role="chart_expand">more</a>' +
							// '</div>' +
							'<div class="contents" id="' + this.id + '"></div>' +
							'<div class="max-point"></div>' +
						'</div>';
	}

	chartPrototype.initChartOption = function(){
		this.chartOption = {
			series: {
				shadowSize: 0
			},
			yaxis: {
				min: 0,
				color: '#e9e9e9',
				max: this.maxHeight,
				tickFormatter: function (d) {
					if (d > 0 && d < 1) {
						return d.toFixed(2, 10);
					} else if (d >= 1 && d < 1000) {
						return d;
					} else {
						return accounting.formatNumber(d);
					}
				}
			},
			xaxis: {
				min: App.startTime - (this.updateTime * 10),
				max: App.startTime,
				show: true,
				tickFormatter: function (d) {
					if (d < 1000) {
						return '';
					} else {
						return moment(d).format('mm:ss');
					}
				}
			},
			grid: {
				color: 'rgba(0,0,0,0)',
				borderWidth: 0,
				markingsLineWidth: 0.1,
				hoverable: true,
				clickable: false,
				autoHighlight: true
			},
			lines: {
				show: true,
				steps: false,
				fill: 0.1
			},
			legend: {
				show: false
			},
			series: {
				curvedLines: {active: true}
			},
			canvas: true
		};
	};

	chartPrototype.initEvent = function (targetNode) {
		// var previousPoint = null; // 이전 값 가지고 뭔가 했었나? 지금은 안 쓰는것 같은데
		var target = targetNode || $('#' + this.id);
		target.bind('plothover', function (e, p, i) {
			$('#ToolTip').remove();
			if (!i) {
				return false;
			} else if (i.datapoint[1] !== -1 && i.datapoint[1] !== -10) {
				var myStr = 'Name : ' + i.series.label + '<br/>';
				var time = '';

				time = moment(i.datapoint[0]).format('mm:ss');
				myStr += 'Time : ' + time + '<br/>';
				myStr += 'Value : ' + i.datapoint[1];

				var ss = 'position:absolute;';
				ss += 'left:' + i.pageX + 'px;';
				ss += 'top:' + i.pageY + 'px';
				var newDom = '<div id="ToolTip" style="' + ss + '" class="tooltip">';
				newDom += myStr;
				newDom += '</div>';
				$('body').append(newDom);
			}
		});

		// Chart stat change 이벤트 바인더
		target.find('.chart_title').on('click', function (e) {
			console.log('TO DO : statlist show');

			// ns.fn.changeStat(this.servertype, this.index, function (stat) {
			// 	this.stat = stat.statname;
			// 	this.servertype = stat.servertype;
			// 	this.type = stat.statname + ' chart';
			// 	this.changeTitle(this.servertype, ns.titleConvertor(stat.statname_display));
			// 	this.maxHeight = this.getYaxisMax(stat.statname);
			// });
		});
	};

	chartPrototype.createContents = function (targetNode) {
		var targetNode = targetNode || $('#' + this.id);
		var emptyData = [[]];
		targetNode.find('.chart_wrapper').remove();
		targetNode.append(this.template);

		this.chartOption.yaxis.max = this.maxHeight;
		this.contents = $.plot(targetNode.find('.contents'), emptyData, this.chartOption);
		this.updateContents(emptyData);
		this.maxPoint = targetNode.find('.chart_wrapper').find('.max-point');
	};

	chartPrototype.getYaxisMax = function (statname) {
		if(statnathis.indexOf('cpu') !== -1 || statnathis.indexOf('%') !== -1) {
			return 100;
		}

		return null;
	};

	return chart;
})();
