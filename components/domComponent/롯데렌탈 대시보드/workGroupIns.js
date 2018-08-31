var URLInputTag = (function () {
    function URLInputTag(args) {
        if (!(this instanceof URLInputTag)) {
            return new URLInputTag(args);
        }

        this.initProperty();

        var list = Object.keys(args || {});
        for (var ix = 0, ixLen = list.length; ix < ixLen; ix++) {
            this[list[ix]] = args[list[ix]];
        }

        this.init();
    }

    URLInputTag.prototype.init = function () {
        this.barsAreaDomCreate();
        this.Layoutdraw();

    };
    URLInputTag.prototype.initProperty = function () {
        this.isBlock = false;
        this.colorBlock = ['#52040B', '#75060F', '#960814', '#C90A1B', '#FF0D22', '#ff2f39', '#BF112E'
            , '#bf2536'
            , '#bf2b43'
            , '#bf4c4f'
            , '#bf3727']

    }


})();
