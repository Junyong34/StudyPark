const setParentDisjt = (parent, child) => {
    if (!hasId(parent) || !hasChildren(parent)) {
        return;
    }

    if (!parentDisjoint[child]) {
        parentDisjoint[child] = parent;
    }

    gData[child].children.map(nextChild => setParentDisjt(child, nextChild));
};
// disjoint 이용
// id의 부모, 조상 노드 탐색
const getUpTreeById = (id, tree = []) => {
    let parent = getParent(id);

    if (id === parent) {
        return tree;
    }

    tree.push(gData[parent]);

    return getUpTreeById(parent, tree);
};

// wait_chart 지표 저장 로직 추가
var wait_chart = ns.instance.wait_view;
var wiatChart_statname = wait_chart.statname;
var groupName_wait_chart = wait_chart.groupName;
wiatChart_statname.each(function (name) {
    var stat = _.find(ns.STATS, function (d) {
        if (name === d.name) {
            return d;
        }
    });

    currStatList.ck.push('Y');
    currStatList.zone.push(zone_no);
    currStatList.position.push(7);
    currStatList.name.push(groupName_wait_chart || '');
    currStatList.statid.push(stat.id);
    currStatList.who.push(ns.USERID);
});

// elapse_chart 지표 저장 로직 추가
var elapse_chart = ns.instance.elapse_time_view;
var elapse_chart_statname = elapse_chart.statname;
var groupName_elapse_chart = elapse_chart.groupName;
elapse_chart_statname.each(function (name) {
    var stat = _.find(ns.STATS, function (d) {
        if (name === d.name) {
            return d;
        }
    });

    currStatList.ck.push('Y');
    currStatList.zone.push(zone_no);
    currStatList.position.push(8);
    currStatList.name.push(groupName_elapse_chart || '');
    currStatList.statid.push(stat.id);
    currStatList.who.push(ns.USERID);
});
