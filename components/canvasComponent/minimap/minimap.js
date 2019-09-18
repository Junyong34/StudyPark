/*!
 * minimap 0.1(http://firejune.com/1704)
 * based on fracs(http://larsjung.de/fracs)
 *
 * provided under the terms of the MIT License
 */


var Minimap = (function(doc, win) {

    var $options = {
        crop: false
        , invert: false // invert viewport
        , width: 100
        , height: 400
        , duration: 0.2
        , focusWidth: 0.5
        , focusHeight: 0.5
        , transition: Effect.Transitions.flicker
        , styles: [
            {selector: "header,footer,section,article", fillStyle: "rgb(230,230,230)"}
            , {selector: "h1", fillStyle: "rgb(240,140,060)"}
            , {selector: "h2", fillStyle: "rgb(200,100,100)"}
            , {selector: "h3", fillStyle: "rgb(100,200,100)"}
            , {selector: "h4", fillStyle: "rgb(100,100,200)"}
        ]
        , viewport: {fillStyle: "rgba(228,77,38,0.3)"}
        , drag: {fillStyle: "rgba(228,77,38,0.6)"}
    }
        , $canvas
        , $context
        , $drag;


    /*
     * init
     */

    return function(options) {
        $options = $.extend($options, options);
        $canvas = new Element('canvas', {
            id: 'outline'
            , width: $options.width
            , height: $options.height
        });

        if (!($canvas instanceof HTMLElement)
            || $canvas.nodeName.toLowerCase() !== "canvas")
            return console.error('not supported');

        doc.body.insert($canvas);

        this.draw = draw;
        this.scroll = scroll;

        $context = $canvas.getContext("2d");
        $canvas.setStyle('cursor: pointer').observe('mousedown', function(event) {
            event.stop();
            $drag = true;
            $canvas.setStyle('cursor: crosshair');
            doc.body.setStyle('cursor: crosshair');
            Event.observe(win, "mousemove", scroll);
        });

        Event.observe(win, "mouseup", function(event) {
            event.stop();
            $canvas.setStyle('cursor: pointer');
            doc.body.setStyle('cursor: auto');
            Event.stopObserving(win, 'mousemove', scroll);
            $drag = false;
            draw();
            var el = event.element();
            el && el.id == 'outline' && scroll(event);
        });

        $canvas.onselectstart = function() {
            return false;
        };

        Event.observe(win, "load", draw);
        Event.observe(win, "resize", draw);
        Event.observe(win, "scroll", draw);

        draw();

        console.info('Minimap Initialized');
    };


    /*
     * minimap - core
     */

    function Rect(left, top, width, height) {
        this.left = Math.round(left);
        this.top = Math.round(top);
        this.width = Math.round(width);
        this.height = Math.round(height);
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    function viewport() {
        var size = Position.getPageSize()
            , left = Position.scrollX()
            , top = Position.scrollY();

        return {
            win: new Rect(left, top, size.window.width, size.window.height)
            , doc: new Rect(0, 0, size.page.width, size.page.height)
        };
    }

    function rect(element) {
        var dimensions = element.getDimensions()
            , offset = element.cumulativeOffset();
        return new Rect(offset.left, offset.top, dimensions.width, dimensions.height);
    }

    function scrollTo(left, top, duration) {
        duration = duration !== undefined ? duration : 1;
        scroll.ani && scroll.ani.state == 'running' && scroll.ani.cancel();
        scroll.ani = new Effect.Scroll(top, left, {
            fps: 100
            , duration: duration
            , transition: $options.transition
        });
    }


    /*
     * minimap - outline
     */

    function applyStyles(context) {
        for (idx in $options.styles) {
            var style = $.extend({
                strokeWidth: 'auto'
                , strokeStyle: 'auto'
                , fillStyle: 'auto'
            }, $options.styles[idx]);

            $$(style.selector).each(function(el) {
                el.visible() $$ drawElement(
                    context
                    , el
                    , style.strokeWidth
                    , style.strokeStyle
                    , style.fillStyle);
            });
        }
    }

    function drawElement(context, element, strokeWidth, strokeStyle, fillStyle) {
        var pos = rect(element);

        strokeWidth = strokeWidth == "auto" ?
            parseInt(element.getStyle("border-width")) || "" : strokeWidth;
        strokeStyle = strokeStyle == "auto" ?
            element.getStyle("border-color") : strokeStyle;
        fillStyle = fillStyle == "auto" ?
            element.getStyle("background-color") : fillStyle;

        drawRect(context, pos, strokeWidth, strokeStyle, fillStyle);
    }

    function drawRect(context, rect, lineWidth, strokeStyle, fillStyle, invert) {
        invert = invert || false;

        lineWidth = lineWidth > 0.2 / draw.scale ? lineWidth : 0.2 / draw.scale;

        if (invert === false) {
            context.beginPath();
            context.rect(rect.left, rect.top, rect.width, rect.height);
            context.fillStyle = fillStyle;
            context.fill();

            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.stroke();
        } else {
            context.beginPath();
            context.rect(0, 0, draw.doc.width, rect.top);
            context.rect(0, rect.top, rect.left, rect.height);
            context.rect(rect.right, rect.top, draw.doc.right - rect.right, rect.height);
            context.rect(0, rect.bottom, draw.doc.width, draw.doc.bottom - rect.bottom);
            context.fillStyle = fillStyle;
            context.fill();

            context.beginPath();
            context.rect(rect.left, rect.top, rect.width, rect.height);
            context.lineWidth = lineWidth;
            context.strokeStyle = strokeStyle;
            context.stroke();
        }
    }

    function drawViewport() {
        if ($drag === true && $options.drag !== undefined) {
            var storkeWidth = $options.drag.storkeWidth;
            var strokeStyle = $options.drag.strokeStyle;
            var fillStyle = $options.drag.fillStyle;
        } else {
            var storkeWidth = $options.viewport.storkeWidth;
            var strokeStyle = $options.viewport.strokeStyle;
            var fillStyle = $options.viewport.fillStyle;
        }

        drawRect(
            $context
            , draw.win
            , storkeWidth
            , strokeStyle
            , fillStyle
            , $options.invert);
    }

    function draw() {
        var vp = viewport();

        var scaleX = $options.width / vp.doc.width
            , scaleY = $options.height / vp.doc.height;

        if ($options.crop) {
            $canvas.width = vp.doc.width * draw.scale;
            $canvas.height = vp.doc.height * draw.scale;
        }

        $context.clearRect(0, 0, $canvas.width, $canvas.height);
        $context.scale(draw.scale, draw.scale);

        $.extend(draw, {
            scale: scaleX < scaleY ? scaleX : scaleY
            , doc: vp.doc
            , win: vp.win
        })

        applyStyles($context);
        drawViewport();

        $context.scale(1 / draw.scale, 1 / draw.scale);
    }

    function scroll(event) {
        var r = rect($canvas)
            , x = event.clientX - r.left
            , y = event.clientY - r.top;

        scrollTo(
            x / draw.scale - draw.win.width * $options.focusWidth
            , y / draw.scale - draw.win.height * $options.focusHeight
            , event.type == 'mousemove' ? 0 : $options.duration);
    }

})(document, window);
