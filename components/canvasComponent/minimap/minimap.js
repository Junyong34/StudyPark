function Minimap(args)
{
    /*
    arg is an objet that can contain:
    width
    height
    virtualWidth
    virtualHeight
    pace;
    elementTypes witch is a array that contains
        typeId	shape	color	blink
    for instance:
        block	square	green	false
    ctx
    */

    this.blinky = false; // bool that change from false to true every 0.5 second, for making things blinks
    this.x = args.x || 0;
    this.y = args.y || 0;
    this.width = args.width || 500;
    this.height = args.height || 500;
    this.virtualWidth = args.virtualWidth || args.width;
    this.virtualHeight = args.virtualHeight || args.height;
    this.backgroundColor = args.backgroundColor || "rgba(0,0,0,0.5)"
    this.elements = {};
    this.pace = args.pace || 20;
    this.timerPace = 0;
    //Making of a virtual canvas that will contain the minimap.
    this.canvas = document.createElement("canvas");
    this.canvas.width = args.virtualWidth || args.width;
    this.canvas.height = args.virtualHeight || args.height;
    this.mapCtx = this.canvas.getContext('2d');
    this.mainCtx = args.ctx || null;
    this.createType = function (id, shape, color, blink)
    {
        this.elements[id] = {shape: shape, color: color, blink: blink};
    }
    this.draw = function (args)
    {
        var translateDecalage = {x: 0, y:0}

        if (this.elements[args.type].blink == false || this.timerPace <= this.pace/2)
        {

            this.mapCtx.fillStyle = this.elements[args.type].color;
            switch(this.elements[args.type].shape)
            {
                case "square":
                    this.mapCtx.fillRect(args.x,args.y,args.w,args.h)
                    break;
                case "round":
                    this.mapCtx.beginPath();
                    this.mapCtx.arc(args.x,args.y,args.w/4,0,2*Math.PI);
                    this.mapCtx.closePath();
                    this.mapCtx.fill();
                    break;
            }
        }
        this.mapCtx.restore();
    }
    this.render = function()
    {
        this.timerPace++; if (this.timerPace == this.pace + 1) this.timerPace = 0;
        this.mainCtx.globalAlpha = 0.5;
        this.mainCtx.drawImage(this.canvas, this.x, this.y, this.width, this.height);
        this.mainCtx.globalAlpha = 1;

        // On reinit après vu que les draw se font tout au long de la loop de jeu.
        this.mapCtx.clearRect(0,0,this.virtualWidth, this.virtualHeight)
        this.mapCtx.fillStyle = this.backgroundColor;
        this.mapCtx.fillRect(0,0,this.virtualWidth, this.virtualHeight)
    }
}
