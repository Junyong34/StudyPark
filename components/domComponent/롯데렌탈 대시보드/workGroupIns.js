var workGroupIns = (function () {
    function workGroupIns(args) {
        if (!(this instanceof workGroupIns)) {
            return new workGroupIns(args);
        }

        this.initProperty();
        var list = Object.keys(args || {});
        for (var ix = 0, ixLen = list.length; ix < ixLen; ix++) {
            this[list[ix]] = args[list[ix]];
        }

        this.init();
    }

    workGroupIns.prototype.init = function () {
        this.BasicDomCreate();
        // this.Layoutdraw();

    };
    workGroupIns.prototype.BasicDomCreate = function () {
        // root
        this.mainWorkArea = document.createElement('div');
        this.mainWorkArea.className = 'main-workArea';


        // 1 뎁스 > 마지막
        this.workBgCircle = document.createElement('div');
        this.workBgCircle.className = 'work-bg-circle';
        this.mainWorkArea.appendChild(this.workBgCircle);

        //root > 1 뎁스
        this.workBgCircleBorder = document.createElement('div');
        this.workBgCircleBorder.className = 'work-bg-circle border';
        this.workBgCircle.appendChild(this.workBgCircleBorder);

        // 1 뎁스 > 마지막
        this.workBgCircleInnerBorder = document.createElement('div');
        this.workBgCircleInnerBorder.className = 'work-bg-circle inner-border';
        this.workBgCircle.appendChild(this.workBgCircleInnerBorder);

        // 1 뎁스 > 마지막
        this.workTitle = document.createElement('div');
        this.workTitle.className = 'work-title work-bg-circle circle';
        this.workBgCircle.appendChild(this.workTitle);

        //root > this
        this.workBgBox = document.createElement('div');
        this.workBgBox.className = 'work-bg-box';
        this.mainWorkArea.appendChild(this.workBgBox);

        // 1뎁스 > 2뎁스
        this.workBox = document.createElement('div');
        this.workBox.className = 'work-box';
        this.workBgBox.appendChild(this.workBox);

        // 2뎁스 > 어제 ,오늘 영역
        this.workBoxDayArea = document.createElement('div');
        this.workBoxDayArea.className = 'work-box to-yes-day-area';
        this.workBox.appendChild(this.workBoxDayArea);

        // 오늘
        this.workBoxToDayArea = document.createElement('p');
        this.workBoxDayArea.appendChild(this.workBoxToDayArea);
        this.todayTxt = document.createElement('span');
        this.todayTxt.textContent = 'Today';
        this.workBoxToDayArea.appendChild(this.todayTxt);
        this.todayTxtValue = document.createElement('span');
        this.todayTxtValue.className = 'day-title';
        this.workBoxToDayArea.appendChild(this.todayTxtValue);

        // 어제
        this.workBoxYesterDayArea = document.createElement('p');
        this.workBoxDayArea.appendChild(this.workBoxYesterDayArea);
        this.yesterDayTxt = document.createElement('span');
        this.yesterDayTxt.textContent = 'Yesterday';
        this.workBoxYesterDayArea.appendChild(this.yesterDayTxt);
        this.yesterDayTxtValue = document.createElement('span');
        this.yesterDayTxtValue.className = 'day-title';
        this.workBoxYesterDayArea.appendChild(this.yesterDayTxtValue);

        // 2뎁스 > 버튼 영역
        this.workBoxInsArea = document.createElement('div');
        this.workBoxInsArea.className = 'work-box inst-area';
        this.workBox.appendChild(this.workBoxInsArea);

        // hr
        this.workBoxHr = document.createElement('hr');
        this.workBoxHr.className = 'btn-area';
        this.workBoxInsArea.appendChild(this.workBoxHr);

        // btn
        this.workBoxIns1 = document.createElement('button');
        this.workBoxIns1.className = 'inst-btn';
        this.workBoxInsArea.appendChild(this.workBoxIns1);

        this.workBoxIns2 = document.createElement('button');
        this.workBoxIns2.className = 'inst-btn w';
        this.workBoxInsArea.appendChild(this.workBoxIns2);

        this.workBoxIns3 = document.createElement('button');
        this.workBoxIns3.className = 'inst-btn n';
        this.workBoxInsArea.appendChild(this.workBoxIns3);

        this.workBoxIns4 = document.createElement('button');
        this.workBoxIns4.className = 'inst-btn';
        this.workBoxInsArea.appendChild(this.workBoxIns4);

        this.workBoxIns5 = document.createElement('button');
        this.workBoxIns5.className = 'inst-btn';
        this.workBoxInsArea.appendChild(this.workBoxIns5);


        this.dom.appendChild(this.mainWorkArea);

    };
    workGroupIns.prototype.initProperty = function () {
        this.isBlock = false;
        this.colorBlock = ['#52040B', '#75060F', '#960814', '#C90A1B', '#FF0D22', '#ff2f39', '#BF112E'
            , '#bf2536'
            , '#bf2b43'
            , '#bf4c4f'
            , '#bf3727']

    }

    return workGroupIns;
})();
