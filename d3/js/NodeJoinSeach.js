var NodeJoinSeach = (function () {
    function NodeJoinSeach(args) {
        if (!(this instanceof NodeJoinSeach)) {
            return new NodeJoinSeach(args);
        }
        this.initProperty();

        var list = Object.keys(args || {});
        for (var ix = 0, ixLen = list.length; ix < ixLen; ix++) {
            this[list[ix]] = args[list[ix]];
        }

        this.init();
    }

    NodeJoinSeach.prototype.init = function () {
        this.nodeOrder = [];


    };
    NodeJoinSeach.prototype.initProperty = function () {
        this.objects = {};
        // 관계 ID
        this.relations = {};
        this.size = {};
        this.lastId = 0;
    };
    NodeJoinSeach.prototype.add = function (val) {
        // isPrimitive Object 체크
        var id = this.isPrimitive(val) ? val : this.lastId;
        if (typeof val.disjointSetId === 'undefined') {
            val.disjointSetId = id;
            this.relations[id] = id;
            this.objects[id] = val;
            this.size[id] = 1;
            this.lastId++;
        }
        return this;
    };
    NodeJoinSeach.prototype.connected = function (val1, val2) {
        return this.find(val1) === this.find(val2) ? true : false;
    };
    NodeJoinSeach.prototype.find = function (val) {
        var id = this.isPrimitive(val) ? val : val.disjointSetId;
        return this.findById(id);
    };
    NodeJoinSeach.prototype.findById = function (id) {
        var rootId = id;
        while (this.relations[rootId] !== rootId) {
            rootId = this.relations[rootId];
        }
        return rootId;
    };
    NodeJoinSeach.prototype.unionConnet = function (targetObject) {
        /*
        this.objects 에서 0번째 부터 순회한다.
         */
        var targetInfo = targetObject;
        var tartgetID;
        var disParentId
        var disChildId = targetInfo.disjointSetId;
        if (targetInfo.itype === 'node') {
            // 양갈래로 되어있는 조건은 넣지않음 중복일시 마지막 값이 부모가 됨
            disParentId = _.findKey(this.objects, function (o) {
                if(o._to)return o._to === targetInfo.id;
                if(o.to)return o.to === targetInfo.id;

            });
        } else {
            // 양갈래로 되어있는 조건은 넣지않음 중복일시 마지막 값이 부모가 됨
            disParentId = _.findKey(this.objects, function (o) {
                if(o._from)return o.id === targetInfo._from;
                if(o.from)return o.id === targetInfo.from;

            });

        }
        // root 도달시 빠져나온다
        if (typeof disParentId === 'undefined') {
            return disChildId;
        }
        this.union(this.objects[disParentId], this.objects[disChildId]);
        // 타겟 아디값 변경
        this.nodeOrder.push(disParentId);

        this.unionConnet(this.objects[disChildId]);

    }
    NodeJoinSeach.prototype.union = function (val1, val2) {
        var val1RootId = this.find(val1),
            val2RootId = this.find(val2);

        if (val1RootId === val2RootId) {
            return this;
        }
        if (this.size[val1RootId] < this.size[val2RootId]) {
            this.relations[val1RootId] = val2RootId;
            this.size[val1RootId] += this.size[val2RootId];
        }
        else {
            this.relations[val2RootId] = val1RootId;
            this.size[val2RootId] += this.size[val1RootId];
        }

        return this;

    }
    NodeJoinSeach.prototype.extract = function () {
        var rootId,
            resObj = {},
            resArr = [];

        for (var id in this.relations) {
            rootId = this.findById(id);

            if (typeof resObj[rootId] === 'undefined') {
                resObj[rootId] = [];
            }
            resObj[rootId].push(this.objects[id]);
        }

        for (var key1 in resObj) {
            resArr.push(resObj[key1]);
        }

        return resArr;

    };
    NodeJoinSeach.prototype.destroy = function () {
        this.reset();
    };
    NodeJoinSeach.prototype._isNode = function (val) {
        // 값이 숫자 or 문자면 true
        if (Object.prototype.toString.call(val) === '[object String]' ||
            Object.prototype.toString.call(val) === '[object Number]') {
            return true;
        }
        else {
            return false;
        }
    };

    NodeJoinSeach.prototype.isPrimitive = function (val) {
        if (typeof this.isObject !== 'undefined') {
            return this.isObject;
        }

        this.isObject = this._isNode(val);
        return this.isObject;

    };
    NodeJoinSeach.prototype.reset = function () {
        // 전부 초기화
        for (var id in this._objects) {
            delete this.objects[id].disjointSetId;
        }
        // 전체 objects 값
        this.objects = {};
        // 관계 ID
        this.relations = {};
        this.size = {};
        this.lastId = 0;
    }

    return NodeJoinSeach;

})();


