var barEqChart = (function () {
    function barEqChart(args) {
        if (!(this instanceof barEqChart)) {
            return new barEqChart(args);
        }

        this.initProperty();

        var list = Object.keys(args || {});
        for (var ix = 0, ixLen = list.length; ix < ixLen; ix++) {
            this[list[ix]] = args[list[ix]];
        }

        this.init();
    }

    barEqChart.prototype.init = function () {
        this.barsAreaDomCreate();
        this.Layoutdraw();

    };
    barEqChart.prototype.initProperty = function () {
        this.isBlock = false;
        this.colorBlock = ['#52040B', '#75060F', '#960814', '#C90A1B', '#FF0D22', '#ff2f39', '#BF112E'
            , '#bf2536'
            , '#bf2b43'
            , '#bf4c4f'
            , '#bf3727']

    }
    barEqChart.prototype.barsAreaDomCreate = function () {
        this.barsArea = document.createElement('div');
        this.barsArea.className = 'bar-area space'
        this.dom.appendChild(this.barsArea);
    };
    barEqChart.prototype.barsDomCreate = function () {
        this.barsDom = document.createElement('div');
        this.barsDom.className = 'bars';

        this.innerBarDom = document.createElement('div');
        this.innerBarDom.className = 'inner-bar';

        this.dancerBarDom = document.createElement('div');
        this.dancerBarDom.className = 'dancer-bar';

        this.barsValueDom = document.createElement('span');
        this.barsValueDom.className = 'bars-value';

        this.barsTitleDom = document.createElement('span');
        this.barsTitleDom.className = 'bars-title';
        // 데이터 개수 만큼 style width % 정의 한다.

        this.barsArea.appendChild(this.barsDom);
        this.barsDom.appendChild(this.innerBarDom);
        this.barsDom.appendChild(this.barsTitleDom);
        this.innerBarDom.appendChild(this.dancerBarDom);
        this.innerBarDom.appendChild(this.barsValueDom);
    };


    barEqChart.prototype.Layoutdraw = function () {
        if (this.data.length === 0) {
            return;
        }

        var barRatioWidth = 100 / (this.data.length);
        for (var ix = 0, ixLen = this.data.length; ix < ixLen; ix++) {
            this.barsDomCreate();
            // data 들어오는거에 따라 다름
            var barsValue = this.data[ix]['data']
            var barsName = this.data[ix]['serverName'];
            this.barsDom.style.width = `${barRatioWidth}%`;
            this.innerBarDom.style.height = `${barsValue - 7}%`;

            this.styleBlock(ix);

            this.barsValueDom.textContent = `${barsValue}`;
            this.barsTitleDom.textContent = barsName;

        }

    };
    barEqChart.prototype.styleBlock = function (index) {
        var ix = index;
        // 칼러코드는 MAX가 10개
        if (index > 11) {
            ix = 10;
        }

        if (this.isBlock) {
            this.innerBarDom.style.cssText += `
                background: linear-gradient(
                ${this.colorBlock[ix]},
                ${this.colorBlock[ix]} 80%,
                rgb(255, 255, 255) 80%,
                rgb(255, 255, 255)
                  ) 0% 0% / 100% 5px`;

        } else {
            this.innerBarDom.style.cssText += `background-color:${this.colorBlock[ix]};`;
        }

        this.dancerBarDom.style.background = `${this.colorBlock[ix]}`;

    }


    return barEqChart;







})();
