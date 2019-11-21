function findHexWithSideLengthZAndRatio() {
    var z = parseFloat(document.getElementById("sideLength").value);
    var r = parseFloat(document.getElementById("whRatio").value);

    //solve quadratic
    var r2 = Math.pow(r, 2);
    var a = (1 + r2) / r2;
    var b = z / r2;
    var c = ((1 - 4.0 * r2) / (4.0 * r2)) * (Math.pow(z, 2));

    var x = (-b + Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

    var y = ((2.0 * x) + z) / (2.0 * r);

    var contentDiv = document.getElementById("hexStatus");

    var width = ((2.0 * x) + z);
    var height = (2.0 * y);
    contentDiv.innerHTML = "Values for Hex: <br /><b>Side Length, z:</b> " + z + "<br /><b>x:</b> " + x + "<br /><b>y:</b> " + y +
        "<br /><b>Width:</b> " + width + "<br /><b>Height: </b>" + height;
    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
}

function findHexWithWidthAndHeight() {
    var width = parseFloat(document.getElementById("hexWidth").value);
    var height = parseFloat(document.getElementById("hexHeight").value);


    var y = height / 2.0;

    //solve quadratic
    var a = -3.0;
    var b = (-2.0 * width);
    var c = (Math.pow(width, 2)) + (Math.pow(height, 2));

    var z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

    var x = (width - z) / 2.0;

    var contentDiv = document.getElementById("hexStatus");

    contentDiv.innerHTML = "Values for Hex: <br /><b>Width:</b> " + width + "<br /><b>Height: </b>" + height +
        "<br /><b>Side Length, z:</b> " + z + "<br /><b>x:</b> " + x + "<br /><b>y:</b> " + y;

    HT.Hexagon.Static.WIDTH = width;
    HT.Hexagon.Static.HEIGHT = height;
    HT.Hexagon.Static.SIDE = z;
}

var grid
var ctx

function drawHexGrid() {
    grid = new HT.Grid(800, 600);
    var canvas = document.getElementById("hexCanvas");
    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 800, 600);
    for (var h in grid.Hexes) {
        // 좌표 확인 하는 함수
        // posCheck(grid.Hexes[h], ctx);
        grid.Hexes[h].draw(ctx);
    }
}

function dotDraw(ctx, {X, Y}, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();

    ctx.arc(
        X,
        Y,
        2,
        0,
        Math.PI * 2,
        true,
    );
    // ctx.strokeStyle = "#e53f2b";
    // ctx.stroke();
    ctx.fill();

    ctx.closePath();
    ctx.restore();
}

function posCheck(Hex, ctx) {
    const bottomPos = Hex.BottomRightPoint;
    const midPos = Hex.MidPoint;
    const topPos = Hex.TopLeftPoint;
    const p1Pos = Hex.P1;

    dotDraw(ctx, bottomPos, "red");
    // dotDraw(ctx, midPos, "blue");
    dotDraw(ctx, topPos,  "orange");
    // dotDraw(ctx, p1Pos, "pink");

}

function getHexGridZR() {
    findHexWithSideLengthZAndRatio();
    drawHexGrid();
}

function getHexGridWH() {
    findHexWithWidthAndHeight();
    drawHexGrid();
}

function changeOrientation() {
    if (document.getElementById("hexOrientationNormal").checked) {
        HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Normal;
    } else {
        HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Orientation.Rotated;
    }
    drawHexGrid();
}

function debugHexZR() {
    findHexWithSideLengthZAndRatio();
    addHexToCanvasAndDraw(20, 20);
}

function debugHexWH() {
    findHexWithWidthAndHeight();

    addHexToCanvasAndDraw(20, 20);
}

function addHexToCanvasAndDraw(x, y) {
    HT.Hexagon.Static.DRAWSTATS = true;
    debugger;
    var hex = new HT.Hexagon(null, x, y);

    var canvas = document.getElementById("hexCanvas");
    var ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, 800, 600);
    hex.draw(ctx);
}
