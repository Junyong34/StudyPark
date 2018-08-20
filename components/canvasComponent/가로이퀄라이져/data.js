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
        group_id: 1,
        group_name: "진행중인 업무1",
        biz_list: ["1", "2", "3", "4", "5"],
        biz_name   : ["기업회계 감사자료 발급중계", "일일일일일일일일일일", "일일일일일일일", "일일일일일"]
    },
];

var bizData = [];

function initBizData() {
    var ix, ixLen, jx, jxLen;
    var name;

    for (ix = 0, ixLen = dataFromIntermax.length; ix < ixLen; ix++) {
        bizData[ix] = {
            "group_id": dataFromIntermax[ix].group_id,
            "group_name": dataFromIntermax[ix].group_name,
            "biz_list": {}
        }

        for (jx = 0, jxLen = dataFromIntermax[ix].biz_name.length; jx < jxLen; jx++) {
            name = dataFromIntermax[ix].biz_name[jx];

            bizData[ix].biz_list[name] = {
                "ACTIVE_TXN_COUNT": 0,
                "ACTIVE_NORMAL": 0,
                "ACTIVE_WARNING": 0,
                "ACTIVE_CRITICAL": 0,
                "ALARM_LEVEL": 0,
                "TPS": 0
            }
        }

        bizData[ix].max_alarm = 0;
        bizData[ix].total_active_txn = 0;
        bizData[ix].total_tps = 0;
    }


}

function realtime() {
    if (this.setTimer) clearTimeout(this.setTimer);
    var ix, ixLen, jx, jxLen;
    var data, rand;
    var activeNor, activeWar, activeCri, activeTot, tps, alarm;
    var total_active_txn, total_tps;


    for (ix = 0, ixLen = bizData.length; ix < ixLen; ix++) {
        data = bizData[ix].biz_list;

        total_active_txn = total_tps = 0;
        for (jx in data) {
            ///// ACTIVE TRANSACTION /////
            activeNor = Math.floor(Math.random() * 500);
            activeWar = Math.floor(Math.random() * 500);
            activeCri = Math.floor(Math.random() * 500);
            activeTot = activeNor + activeWar + activeCri;
            alarm = data[jx].ALARM_LEVEL;
            tps = Math.floor(Math.random() * 300);

            data[jx].ACTIVE_TXN_COUNT = activeTot;
            data[jx].ACTIVE_NORMAL = activeNor;
            data[jx].ACTIVE_WARNING = activeWar;
            data[jx].ACTIVE_CRITICAL = activeCri;
            data[jx].ALARM_LEVEL = alarm;
            data[jx].TPS = tps;

            total_active_txn += activeTot;
            total_tps += tps;
        }

        bizData[ix].total_active_txn = total_active_txn;
        bizData[ix].total_tps = total_tps;
    }

    this.setTimer = setTimeout(realtime, 3000);

    ActiveStackView.initResize(bizData);
}

function alarmGen() {
    if (this.setTimer2) clearTimeout(this.setTimer2);
    var ix, ixLen, jx, jxLen;
    var data, rand;
    var activeNor, activeWar, activeCri, activeTot, tps, alarm;
    var total_active_txn, total_tps, max_alarm;


    for (ix = 0, ixLen = bizData.length; ix < ixLen; ix++) {
        data = bizData[ix].biz_list;

        total_active_txn = total_tps = max_alarm = 0;
        for (jx in data) {
            ///// ALARM /////
            rand = Math.random();

            if (rand > 0.8) {
                alarm = 3; // down
            } else if (rand > 0.4) {
                alarm = 2; // critical
            } else if (rand > 0.2) {
                alarm = 1; // warning
            } else {
                alarm = 0; // normal
            }

            ///// ACTIVE TRANSACTION /////
            // alarm = 3;
            if (alarm === 3) {
                activeNor = 0;
                activeWar = 0;
                activeCri = 0;
                activeTot = 0;
                tps = 0;

            } else {
                activeNor = data[jx].ACTIVE_NORMAL;
                activeWar = data[jx].ACTIVE_WARNING;
                activeCri = data[jx].ACTIVE_CRITICAL;
                activeTot = data[jx].ACTIVE_TXN_COUNT;
                tps = data[jx].TPS;

            }

            data[jx].ACTIVE_TXN_COUNT = activeTot;
            data[jx].ACTIVE_NORMAL = activeNor;
            data[jx].ACTIVE_WARNING = activeWar;
            data[jx].ACTIVE_CRITICAL = activeCri;
            data[jx].TPS = tps;
            data[jx].ALARM_LEVEL = alarm;

            total_active_txn += activeTot;
            total_tps += tps;
            max_alarm = Math.max(max_alarm, alarm);

        }


        bizData[ix].total_active_txn = total_active_txn;
        bizData[ix].total_tps = total_tps;
        bizData[ix].max_alarm = max_alarm;
    }

    this.setTimer2 = setTimeout(alarmGen, (Math.random() * (10 - 3 + 1) + 3) * 1000);


    ActiveStackView.initResize(bizData);

}
