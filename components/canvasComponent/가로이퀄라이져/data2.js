var bizGroupWasNamePairObj = {
    "CDTEST": [
        ["501", "C_Daemon_501"],
        ["502", "C_Daemon_502"]
    ],
    "단말": [
        ["94", "jeus94"]
    ],
    "대외": [
        ["92", "jeus92"],
        ["93", "jeus93"]
    ],
    "업무": [
        ["95", "jeus95"],
        ["96", "jeus96"]
    ],
    "채널": [
        ["190", "jeus190"],
        ["88", "jeus88_PPPPPPPPPPPPPPPP"],
        ["89", "jeus89"],
        ["90", "jeus90"]
    ]
};

// 최초 로드 데이터. web_env에 저장이 되어있을 것이라 예상되는 데이터
// 사용자가 옵션버튼으로 선택해서 저장하면 이 데이터가 다시 web_env에 들어가게 된다.
// 최초 로드시에는 이 데이터는 비어있을 것이다. => 최초 로드시에 web_env에 저장된 데이터가 없을 경우에 어떻게 할 것인지에 대한 처리 논의 필요
var dataFromIntermax = [
    {
        group_id   : 1,
        group_name : "진행중인 업무1",
        biz_list   : ["1", "2", "3", "4", "5"],
        biz_name   : ["CDTEST", "단말", "대외", "업무", "채널"]
    }
];

var bizData = [];

function initBizData() {
    var ix, ixLen, jx, jxLen;
    var name;

    for (ix = 0, ixLen = dataFromIntermax.length; ix < ixLen; ix++) {
        bizData[ix] = {
            "group_id"   : dataFromIntermax[ix].group_id,
            "group_name" : dataFromIntermax[ix].group_name,
            "biz_list"   : {

            }
        }

        for (jx = 0, jxLen = dataFromIntermax[ix].biz_name.length; jx < jxLen; jx++) {
            name = dataFromIntermax[ix].biz_name[jx];

            bizData[ix].biz_list[name] = {
                "ACTIVE_TXN_COUNT"  : 6,
                "ACTIVE_NORMAL"     : 2,
                "ACTIVE_WARNING"    : 2,
                "ACTIVE_CRITICAL"   : 2,
                "ALARM_LEVEL"       : 1,
                "TPS"               : 0
            }
        }

        bizData[ix].max_alarm        = 0;
        bizData[ix].total_active_txn = 0;
        bizData[ix].total_tps        = 0;

    }


}

function realtime(eqchart) {

    if (this.setTimer) clearTimeout(this.setTimer);
    var ix, ixLen, jx, jxLen;
    var data, rand;
    var activeNor, activeWar, activeCri, activeTot, tps, alarm , TotalActive;

    for (ix = 0, ixLen = bizData.length; ix < ixLen; ix++) {
        data = bizData[ix].biz_list;
        TotalActive = 0;
        for (jx in data) {
            ///// ALARM /////
            rand = Math.random();

            if (rand > 0.95) {
                alarm = 3; // down
            } else if (rand > 0.8) {
                alarm = 2; // critical
            } else if (rand > 0.6) {
                alarm = 1; // warning
            } else {
                alarm = 0; // normal
            }

            ///// ACTIVE TRANSACTION /////
            if (alarm !== 3) {
                activeNor = Math.floor(Math.random() * 500);
                activeWar = Math.floor(Math.random() * 500);
                activeCri = Math.floor(Math.random() * 500);
                activeTot = activeNor + activeWar + activeCri;
                TotalActive += activeTot;
                if(activeTot === 0 ) debugger;

                tps = Math.floor(Math.random() * 300);

            } else {
                activeNor = 0;
                activeWar = 0;
                activeCri = 0;
                activeTot = 0;
                tps = 0;

            }

            data[jx].ACTIVE_TXN_COUNT = activeTot;
            data[jx].ACTIVE_NORMAL = activeNor;
            data[jx].ACTIVE_WARNING = activeWar;
            data[jx].ACTIVE_CRITICAL = activeCri;
            data[jx].ALARM_LEVEL = alarm;
            data[jx].ACTIVE_TPS = tps;
        }

        bizData[ix].total_active_txn = TotalActive;

    }
    ActiveStackView.initResize(bizData);
    this.setTimer = setTimeout(realtime, 3000);
}
