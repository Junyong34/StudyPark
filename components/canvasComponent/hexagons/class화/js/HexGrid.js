class Hexagon {
    constructor(props) {
        this.initProperty();
        Object.keys(props)
            .forEach(key => {
                this[key] = props[key];
            });
        this.HexagonInfo(this.hexId, this.x, this.y);
    }

    initProperty() {
        this.x = 0;
        this.y = 0;
        this.hexId = "";
        this.TopLeftPoint = {X: 0, Y: 0};
        this.BottomRightPoint = {X: 0, Y: 0};
        this.P1 = {X: 0, Y: 0};
        this.MidPoint = {X: 0, Y: 0};
        this.Hex = {X: 0, Y: 0};
    }

    HexagonInfo(id, x, y) {
        this.Points = [];// Polygon Base
        let x1 = null;
        let y1 = null;

        function HexPointDrawPos(x, y) {
            this.X = x;
            this.Y = y;
        }

        if (HexGrid.expression == HexGrid.Orientation.Normal) {
            x1 = (HexGrid.HexW - HexGrid.HexSide) / 2;
            y1 = (HexGrid.HexH / 2);
            this.Points.push(new HexPointDrawPos(x1 + x, y));
            this.Points.push(new HexPointDrawPos(x1 + HexGrid.HexSide + x, y));
            this.Points.push(new HexPointDrawPos(HexGrid.HexW + x, y1 + y));
            this.Points.push(new HexPointDrawPos(x1 + HexGrid.HexSide + x, HexGrid.HexH + y));
            this.Points.push(new HexPointDrawPos(x1 + x, HexGrid.HexH + y));
            this.Points.push(new HexPointDrawPos(x, y1 + y));
        } else {
            x1 = (HexGrid.HexW / 2);
            y1 = (HexGrid.HexH - HexGrid.HexSide) / 2;
            this.Points.push(new HexPointDrawPos(x1 + x, y));
            this.Points.push(new HexPointDrawPos(HexGrid.HexW + x, y1 + y));
            this.Points.push(new HexPointDrawPos(HexGrid.HexW + x, y1 + HexGrid.HexSide + y));
            this.Points.push(new HexPointDrawPos(x1 + x, HexGrid.HexH + y));
            this.Points.push(new HexPointDrawPos(x, y1 + HexGrid.HexSide + y));
            this.Points.push(new HexPointDrawPos(x, y1 + y));
        }

        // this.hexId = id;

        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;

        this.TopLeftPoint = new HexPointDrawPos(this.x, this.y);
        this.BottomRightPoint = new HexPointDrawPos(this.x + HexGrid.HexW,
            this.y + HexGrid.HexH);
        this.MidPoint = new HexPointDrawPos(this.x + (HexGrid.HexW / 2),
            this.y + (HexGrid.HexH / 2));

        this.P1 = new HexPointDrawPos(x + x1, y + y1);

        this.selected = false;
    }

    Contains(p) {
        let isIn = false;

        if (this.isInHexBounds(p)) {
            // turn our absolute point into a relative point for comparing with the polygon's points
            // var pRel = new HexPointDrawPos(p.X - this.x, p.Y - this.y);
            let i;

            let
                j = 0;

            for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++) {
                const iP = this.Points[i];
                const jP = this.Points[j];

                if (
                    (
                        ((iP.Y <= p.Y) && (p.Y < jP.Y)) ||
                        ((jP.Y <= p.Y) && (p.Y < iP.Y))
                        // ((iP.Y > p.Y) != (jP.Y > p.Y))
                    ) &&
                    (p.X < (jP.X - iP.X) * (p.Y - iP.Y) / (jP.Y - iP.Y) + iP.X)
                ) {
                    isIn = !isIn;
                }
            }
        }
        return isIn;
    }


    draw(ctx) {
        if (!this.selected) {
            ctx.strokeStyle = "#ffa955";
        } else {
            ctx.strokeStyle = "red";
        }
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.Points[0].X, this.Points[0].Y);
        for (let i = 1; i < this.Points.length; i++) {
            const p = this.Points[i];

            ctx.lineTo(p.X, p.Y);
        }
        ctx.closePath();
        ctx.stroke();

        // ID 존재하면 그린다.
        if (this.hexId) {
            // text  debugging
            ctx.fillStyle = "black";
            ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            ctx.fillText(this.hexId, this.MidPoint.X, this.MidPoint.Y);
        }

        if (this.PathCoOrdX !== null && this.PathCoOrdY !== null &&
            typeof (this.PathCoOrdX) !== "undefined" &&
            typeof (this.PathCoOrdY) !== "undefined") {
            // draw co-ordinates for debugging
            ctx.fillStyle = "black";
            ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            ctx.fillText(`(${this.PathCoOrdX},${this.PathCoOrdY})`, this.MidPoint.X, this.MidPoint.Y + 10);
        }
        // 피타고라스 디버깅
        if (HexGrid.DRAWSTATS) {
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            // draw our x1, y1, and z
            ctx.beginPath();
            ctx.moveTo(this.P1.X, this.y);
            ctx.lineTo(this.P1.X, this.P1.Y);
            ctx.lineTo(this.x, this.P1.Y);
            ctx.closePath();
            ctx.stroke();

            ctx.fillStyle = "red";
            ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            // var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            ctx.fillText("z", this.x + this.x1 / 2 - 8, this.y + this.y1 / 2);
            ctx.fillText("x", this.x + this.x1 / 2, this.P1.Y + 10);
            ctx.fillText("y", this.P1.X + 2, this.y + this.y1 / 2);
            ctx.fillText(`z = ${HexGrid.SIDE}`, this.P1.X, this.P1.Y + this.y1 + 10);
            ctx.fillText(`(${this.x1.toFixed(2)},${this.y1.toFixed(2)})`, this.P1.X, this.P1.Y + 10);
        }
    }

    isInHexBounds(p) {
        if (this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y &&
            p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y) {
            return true;
        }
        return false;
    }
}

class HexGrid {
    static Orientation = {
        Normal: 0,
        Rotated: 1,
    };
    static expression = 0;
    static HexW = 40;
    static HexH = 40;
    static HexSide = 21.94333;
    static DRAWSTATS = 0;

    constructor(props) {
        this.initProperty();
        Object.keys(props)
            .forEach(key => {
                this[key] = props[key];
            });
        this.initSizeProps();
        this.initCanvas();
    }

    initProperty() {
        this.Static = {};
        HexGrid.expression = HexGrid.Orientation.Rotated;
        this.Static.Letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.dom = null;
        // this.HexW = 40;
        // this.HexH = 40;
        // this.HexSide = 21.94333;
        this.Hexes = [];
    }

    initSizeProps() {
        this.domWidth = this.getWidth(this.dom);
        this.domHeight = this.getHeight(this.dom);
    }

    getWidth(dom) {
        return dom.clientWidth || dom.width;
    }

    getHeight(dom) {
        return dom.clientHeight || dom.height;
    }
    // w 와 h로 z값 구하기
    hexWidthAndHeight(w, h) {
        const valW = w;
        let valH = h;
        var y = valH / 2.0;

        //solve quadratic
        var a = -3.0;
        var b = (-2.0 * valW);
        var c = (Math.pow(valW, 2)) + (Math.pow(valH, 2));

        var z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

        var x = (valW - z) / 2.0;


        HexGrid.HexW = valW;
        HexGrid.HexH = valH;
        HexGrid.HexSide = z;
    }

    ctxClear(ctx) {
        ctx.clearRect(0, 0, this.domWidth, this.domHeight);
    }

    HexagonGridDraw() {
        this.ctxClear(this.ctxHex);
        for (let ix = 0, ixLen = this.Hexes.length - 1; ix <= ixLen; ix++) {
            const hexObj = this.Hexes[ix];

            hexObj.draw(this.ctxHex);
        }
    }

    initCanvas() {
        this.HexGrids = document.createElement("canvas");
        this.ctxHex = this.HexGrids.getContext("2d");
        this.HexGrids.className = "HexGrids";

        this.ctxList = [this.ctxHex];

        this.initCanvasSize();
        this.ctxList.forEach(ctx => this.devicePixelRatio(ctx));
        this.dom.appendChild(this.HexGrids);
    }

    devicePixelRatio(ctx) {
        const devicePixelRatio = window.devicePixelRatio || 1;

        this.backingStoreRatio =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

        this.pixelRatio = devicePixelRatio / this.backingStoreRatio;
        this.oldPixelRatio = this.pixelRatio;
        this.pixelRatio = 1; // 브라우저 스케일 확대축소 버그 때문에 무조건 1로 지정
    }

    initCanvasSize(initWidth = this.domWidth, initHeight = this.domHeight) {
        this.HexGrids.setAttribute("width", initWidth);
        this.HexGrids.setAttribute("height", initHeight);
        this.HexGrids.setAttribute("style", "position: absolute; top:0px; left:0px;");

        this.HexGridCreate();
    }

    HexGridCreate() {
        const HexagonsByXOrYCoOrd = {};
        this.Hexes = [];
        let row = 0;
        let y = 0.0;

        while (y + HexGrid.HexH <= this.domHeight) {
            let col = 0;
            let offset = 0.0;

            if (row % 2 === 1) {
                if (HexGrid.expression === HexGrid.Orientation.Normal) {
                    offset = (HexGrid.HexW - HexGrid.HexSide) / 2 + HexGrid.HexSide;
                } else {
                    offset = HexGrid.HexW / 2;
                }
                col = 1;
            }

            let x = offset;

            while (x + HexGrid.HexW <= this.domWidth) {
                const hexId = this.getHexId(row, col);
                const h = new Hexagon({
                    hexId,
                    x,
                    y,
                });

                let pathCoOrd = col;

                // 열은 16 진의 x 좌표입니다. y 좌표의 경우 더 화려해야합니다.
                if (HexGrid.expression === HexGrid.Orientation.Normal) {
                    h.PathCoOrdX = col;
                } else {
                    h.PathCoOrdY = row;
                    pathCoOrd = row;
                }

                this.Hexes.push(h);

                if (!HexagonsByXOrYCoOrd[pathCoOrd]) {
                    HexagonsByXOrYCoOrd[pathCoOrd] = [];
                }
                HexagonsByXOrYCoOrd[pathCoOrd].push(h);

                col += 2;
                if (HexGrid.expression === HexGrid.Orientation.Normal) {
                    x += HexGrid.HexW + HexGrid.HexSide;
                } else {
                    x += HexGrid.HexW;
                }
            }
            row++;
            if (HexGrid.expression === HexGrid.Orientation.Normal) {
                y += HexGrid.HexH / 2;
            } else {
                y += (HexGrid.HexH - HexGrid.HexSide) / 2 + HexGrid.HexSide;
            }

            // hex만의 좌표체계 생성
            for (const coOrd1 in HexagonsByXOrYCoOrd) {
                const hexagonsByXOrY = HexagonsByXOrYCoOrd[coOrd1];
                let coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);

                for (const i in hexagonsByXOrY) {
                    const h = hexagonsByXOrY[i];// Hexagon

                    if (HexGrid.expression === HexGrid.Orientation.Normal) {
                        h.PathCoOrdY = coOrd2++;
                    } else {
                        h.PathCoOrdX = coOrd2++;
                    }
                }
            }
        }
    }

    getHexId(row, col) {
        let letterIndex = row;
        let letters = "";

        while (letterIndex > 25) {
            letters = this.Static.Letters[letterIndex % 26] + letters;
            // ID 생성값이 25개 넘어가면 하나씩 더 추가 해주기
            letterIndex -= 26;
        }

        return this.Static.Letters[letterIndex] + letters + (col + 1);
    }

    GetHexAt(/* Point*/ p) {
        // Hex 존재 여부 판단
        // P 좌표 값
        for (const h in this.Hexes) {
            if (this.Hexes[h].Contains(p)) {
                return this.Hexes[h];
            }
        }

        return null;
    }
}
