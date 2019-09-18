/** pQuery! LOL **/
Object.extend($, Prototype);
Object.extend($, Object);


/**
 * Returns window dimensions and scroll positions
 * @author Firejune<to@firejune.com>
 * @license MIT
 */

Object.extend(Position, {
    getPageSize: function() {
        var doc = window.scrollMaxX ?
            {w: window.innerWidth  + window.scrollMaxX, h: window.innerHeight + window.scrollMaxY} :
            {w: document.body.scrollWidth, h: document.body.scrollHeight};

        var win = self.innerHeight ?
            {w: self.innerWidth, h: self.innerHeight} : // IE
            document.documentElement && document.documentElement.clientHeight ?
                {w: document.documentElement.clientWidth, h: document.documentElement.clientHeight} : {w: 0, h: 0};

        // for small pages with total size less then size of the viewport
        doc = {w: Math.max(win.w, doc.w), h: Math.max(win.h, doc.h)};

        return { page: { width: doc.w, height: doc.h }, window: { width: win.w, height: win.h } };
    },
    scrollX: function() {
        return (window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0);
    },
    scrollY: function() {
        return (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
    }
});


/**
 * Position based scrollTo effect
 * @author Firejune<to@firejune.com>
 * @license MIT
 */

Effect.Scroll = Class.create(Effect.Base, {
    initialize: function(top, left) {

        var args = $A(arguments)
            , options = typeof args.last() == "object" ? args.last() : {};

        this.scroll = {
            left: left || 0
            , top: top
        };

        this.start(options);
    },
    setup: function() {
        this.scrollX = Position.scrollX();
        this.scrollY = Position.scrollY();

        var getSize = Position.getPageSize();
        var max = getSize.page.height - getSize.window.height;
        if (this.options.offset) this.scrollY += this.options.offset;
        if (this.options.offset) this.scrollY += this.options.offset;

        this.delta = {
            x: (this.scroll.left > max ? max : this.scroll.left) - this.scrollX
            , y: (this.scroll.top > max ? max : this.scroll.top) - this.scrollY
        }
    },
    update: function(position) {
        scrollTo(
            (this.scrollX + position * this.delta.x).round()
            , (this.scrollY + position * this.delta.y).round());
    }
});
