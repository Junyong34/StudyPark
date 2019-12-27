import Hexagon from "./Hexagon";
import MouseEvents from "./event/HexMouseEvent";
import BinaryHeap from "./binaryHeap/binaryHeap";
import SearchHex from "@/commonVue/common/Hex/SearchHex";

export default class HexGrid {
    static Orientation = {
        Normal: 0,
        Rotated: 1,
    };
    static expression = 1;
    static HexW = 40;
    static HexH = 40;
    static HexSide = 27.42918851774318; // 43.88670162838908;
    static DRAWSTATS = 0;

    constructor(props) {
        this.initProperty();
        this.mergeFn();
        Object.keys(props)
            .forEach(key => {
                this[key] = props[key];
            });
        this.initSizeProps();
        this.initCanvas();
        this.initCanvasEvent();
    }

    initProperty() {
        this.Static = {};
        HexGrid.expression = HexGrid.Orientation.Rotated;
        this.Static.Letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.dom = null;
        this.dataSet = null;
        this.filterType = "All";
        this.sortHexes = [];
        this.beforeSelectHexhexId = null;
        this.isBackground = false;
        this.layout = "box";
        this.timer = null;
        this.hexSize = 40;
        this.Hexes = [];
        this.selectHex = null;
        this.mPointer = {
            X: 0,
            Y: 0,
        };
        this.tPointer = {
            X: 0,
            Y: 0,
        };
        this.hexGridInfo = {
            rowCount: 0,
            columnCount: 0,
        };
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

    mergeFn() {
        Object.assign(this, MouseEvents);
    }

    initCanvasEvent() {
        this.killEvent();
        this.createMouseEvents();
    }

    // w 와 h로 z값 구하기
    hexWidthAndHeight(w, h) {
        const valW = w;
        const valH = h;

        // const y = valH / 2.0;

        // solve quadratic
        const a = -3.0;
        const b = (-2.0 * valW);
        const c = (Math.pow(valW, 2)) + (Math.pow(valH, 2));

        const z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);

        // const x = (valW - z) / 2.0;


        HexGrid.HexW = valW;
        HexGrid.HexH = valH;
        HexGrid.HexSide = z;
    }

    options(side, center, Orientation) {
        HexGrid.HexSide = side;
        HexGrid.expression = Orientation;
        this.center = center || {X: 0, Y: 0};

        if (HexGrid.expression === HexGrid.Orientation.Rotated) {
            HexGrid.HexW = side * 2;
            HexGrid.HexH = Math.sqrt(3) / 2 * HexGrid.HexW;
        } else {
            HexGrid.HexH = side * 2;
            HexGrid.HexW = Math.sqrt(3) / 2 * HexGrid.HexH;
        }
    }

    HexLayoutCreate(radius) {
        this.radius = radius || 0;
        this.Hexes = [];
        this.sortHexes = [];
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                for (let z = -radius; z <= radius; z++) {
                    if (x + y + z === 0) {
                        const HEX = new Hexagon({
                            hexId: `${x}x${y}`,
                            Axial: {X: x, Y: y},
                            center: this.center,
                            type: this.layout,
                            orientation: HexGrid.expression,
                            size: HexGrid.HexSide,
                            width: HexGrid.HexW,
                            height: HexGrid.HexH,
                            domWidth: this.domWidth,
                            domHeight: this.domHeight,
                        });

                        this.Hexes.push(HEX);
                        if (x === 0 && y === 0) this.sortHexes.push(HEX);
                    }
                }
            }
        }
        this.sortHex();
    }

    sortHex() {
        // for (let ix = 0; ix < this.radius; ix++) {
        const hexsList = this.getRange({x: 0, y: 0}, this.radius);

        hexsList.forEach(hex => {
            this.sortHexes.push(hex);
        });
        // }
        this.Hexes = this.sortHexes;
    }

    ctxClear(ctx) {
        ctx.clearRect(0, 0, this.domWidth, this.domHeight);
    }

    filterStatus(status) {
        this.filterType = status;
        this.HexagonGridDraw();
    }

    HexagonGridDraw() {
        this.ctxList.forEach(c => this.ctxClear(c));

        for (let ix = 0, ixLen = this.Hexes.length - 1; ix <= ixLen; ix++) {
            const hexObj = this.Hexes[ix];

            if (this.isBackground) {
                hexObj.backgroundDraw(this.ctxHex);
            } else {
                hexObj.draw(this.ctxHex, this.filterType);
            }
        }
    }

    onData(dataSet) {
        if (!dataSet || dataSet.length === 0) {
            this.HexGridCreate();
            this.HexagonGridDraw();
            return;
        }
        this.dataSet = dataSet;

        // 화면에 그려진 Hexes 개수 보다 데이터가 많은경우 체크
        // ㅅ ㅏ이즈를 줄여서 화면 Hex 개수를 늘린다.
        this.dataCompare();
    }

    hexDataBind() {
        for (let ix = 0, ixLen = this.dataSet.length - 1; ix <= ixLen; ix++) {
            const hexObj = this.Hexes[ix];
            const objData = this.dataSet[ix];

            hexObj.data = objData;
        }

        this.HexagonGridDraw();
    }

    layoutCreate() {
        if (this.layout === "box") {
            this.HexGridCreate();
        } else {
            this.HexLayoutCreate(this.radius);
        }
    }

    dataCompare() {
        const HexGridCount = this.Hexes.length;
        const dataCount = this.dataSet.length;

        if (HexGridCount < dataCount) {
            this.recursionGrid();
        } else {
            this.HexGridCreate();
            this.hexDataBind();
        }
    }

    recursionGrid() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        // 최소 넓이는 5px로 잡혀있음
        if (HexGrid.HexW === 5) {
            console.error("It cannot be smaller than the minimum size.");
            //  화면 에러 처리 필요.
        }
        HexGrid.HexW -= 5;
        HexGrid.HexH -= 5;

        this.hexWidthAndHeight(HexGrid.HexW, HexGrid.HexH);
        this.HexGridCreate();
        this.timer = setTimeout(this.dataCompare.bind(this), 10);
    }

    resize(dom) {
        this.ctxList.forEach(c => this.ctxClear(c));
        this.dom = dom;
        this.initSizeProps();
        this.initCanvasSize();
        this.initCanvasEvent();
        this.ctxList.forEach(ctx => this.devicePixelRatio(ctx));
        this.layoutCreate();
    }

    initCanvas() {
        this.HexGrids = document.createElement("canvas");
        this.ctxHex = this.HexGrids.getContext("2d");
        this.HexGrids.className = "HexGrids";

        this.HexToolTip = document.createElement("canvas");
        this.ctxTip = this.HexToolTip.getContext("2d");
        this.HexToolTip.className = "HexToolTip";

        this.ctxList = [this.ctxHex, this.ctxTip];

        this.initCanvasSize();
        this.ctxList.forEach(ctx => this.devicePixelRatio(ctx));
        this.dom.appendChild(this.HexGrids);
        this.dom.appendChild(this.HexToolTip);
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

        this.HexToolTip.setAttribute("width", initWidth);
        this.HexToolTip.setAttribute("height", initHeight);
        this.HexToolTip.setAttribute("style", "position: absolute; top:0px; left:0px;");

        // this.HexGridCreate();
    }

    HexGridCreate(startX = 0, startY = 0) {
        const HexagonsByXOrYCoOrd = {};

        this.Hexes = [];
        let row = 0; // row 갯수
        let y = startY; // Hex 그려지는 Y 좌표
        const interval = 5; // Hex 간격 값
        let colInterval = 0; // Hex rol 간격
        let columnCount = 0;

        while (y + HexGrid.HexH + colInterval < this.domHeight - 3) {
            let col = 0;
            let offset = 0.0;
            let index = 1; // hex index
            let rowInterval = 0; // Hex row 간격

            if (row % 2 === 1) {
                if (HexGrid.expression === HexGrid.Orientation.Normal) {
                    offset = (HexGrid.HexW - HexGrid.HexSide) / 2 +
                        HexGrid.HexSide + (interval / 2);
                    colInterval += interval - 1;
                } else {
                    offset = (HexGrid.HexW / 2) + (interval / 2);
                    colInterval += interval;
                }
                col = 1;
            } else if (HexGrid.expression === HexGrid.Orientation.Normal) {
                colInterval += interval - 1;
            } else {
                colInterval += interval;
            }
            let x = offset;

            while (x + HexGrid.HexW + startX + rowInterval <= this.domWidth) {
                const hexId = this.getHexId(row, col);

                rowInterval = ((interval) * index);
                const h = new Hexagon({
                    hexId,
                    x: x + startX + rowInterval,
                    y: y + colInterval,
                });

                index++;
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
                    x += HexGrid.HexW + HexGrid.HexSide + (interval / 2);
                } else {
                    x += HexGrid.HexW + (interval / 2);
                }
            }
            row++;
            if (HexGrid.expression === HexGrid.Orientation.Normal) {
                y += HexGrid.HexH / 2 + 1;
            } else {
                y += (HexGrid.HexH - HexGrid.HexSide) / 2 + HexGrid.HexSide + 1;
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
            columnCount = col;
        }
        this.hexGridInfo.columnCount = Math.floor(columnCount / 2);
        this.hexGridInfo.rowCount = row;
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
            if (!this.Hexes[h].data) return null; // data가 없으면 필요없는 hex로 본다
            if (this.Hexes[h].Contains(p)) {
                return this.Hexes[h];
            }
        }

        return null;
    }

    getHexDistance(/* Hexagon*/ h1, /* Hexagon*/ h2) {
        const deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
        const deltaY = h1.PathCoOrdY - h2.PathCoOrdY;

        return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
    }

    getHexById(id) {
        for (const i in this.Hexes) {
            if (this.Hexes[i].Id === id) {
                return this.Hexes[i];
            }
        }
        return null;
    }

    GetNearestHex(p) {
        let distance;
        let minDistance = Number.MAX_VALUE;
        let hx = null;

        // iterate through each hex in the grid
        for (const h in this.Hexes) {
            distance = this.Hexes[h].distanceFromMidPoint(p);
            if (distance < minDistance) {
                minDistance = distance;
                hx = this.Hexes[h];
            }
        }

        return hx;
    }

    showToolTip() {
        const title = this.selectHex.data.id;
        const midPoint = this.selectHex.MidPoint;
        const fontSize = 18;

        // ctx.globalAlpha = 0.6;
        this.ctxTip.beginPath();
        this.ctxTip.moveTo(this.selectHex.Points[0].X, this.selectHex.Points[0].Y);
        for (let i = 1; i < this.selectHex.Points.length; i++) {
            const p = this.selectHex.Points[i];

            this.ctxTip.lineTo(p.X, p.Y);
        }
        this.ctxTip.globalAlpha = 1;

        this.ctxTip.strokeStyle = "#e1e0e5";
        this.ctxTip.lineWidth = 3;
        this.ctxTip.stroke();
        // this.ctxTip.shadowColor = "gray";
        this.ctxTip.closePath();

        this.ctxTip.save();
        const titleW = this.ctxTip.measureText(title).width;

        this.ctxTip.font = `${fontSize}px arial`;
        this.ctxTip.fillStyle = "ffffff";
        this.ctxTip.textAlign = "center";
        this.ctxTip.textBaseline = "alphabetic";

        this.ctxTip.globalAlpha = 0.5;
        this.ctxTip.fillStyle = "#5e5e5e";
        this.ctxTip.fillRect(0 - (titleW / 2), -fontSize - 4, titleW, fontSize + 4);
        this.ctxTip.fillStyle = "#fff";
        this.ctxTip.globalAlpha = 1;
        this.ctxTip.fillText(
            title,
            midPoint.X, midPoint.Y,
        );
        this.ctxTip.restore();
    }

    getRange({x, y}, movement) {
        const openHeap = new BinaryHeap({
            scoreFunction: node => node.F,
        });
        const closedHexes = {};
        const visitedNodes = {};

        const HexTemp = new SearchHex();

        HexTemp.Node(new Hexagon({
            hexId: `${x}x${y}`,
            Axial: {X: x, Y: y},
            type: this.layout,
            orientation: HexGrid.expression,
        }), null, 0);
        openHeap.push(HexTemp);

        while (openHeap.size() > 0) {
            // Get the item with the lowest score (current + heuristic).
            const current = openHeap.pop();

            // Close the hex as processed.
            closedHexes[current.hex.getKey()] = current.hex;

            // Get and iterate the neighbors.
            const neighbors = this.getNeighbors(current.hex);

            neighbors.forEach(n => {
                // Make sure the neighbor is not blocked and that we haven't already processed it.
                if (n.blocked || closedHexes[n.getKey()]) return;

                // Get the total cost of going to this neighbor.
                const g = current.G + n.cost;

                const visited = visitedNodes[n.getKey()];

                // Is it cheaper the previously best path to get here?
                if (g <= movement && (!visited || g < visited.G)) {
                    const h = 0;

                    if (!visited) {
                        const nNode = new SearchHex();

                        nNode.Node(n, current, g, h);
                        // console.log(g, h);
                        visitedNodes[n.getKey()] = nNode;
                        openHeap.push(nNode);
                    } else {
                        // We've visited this path before, but found a better path. Rescore it.
                        visited.rescore(current, g, h);
                        openHeap.rescoreElement(visited);
                    }
                }
            });
        }

        const arr = [];

        for (const i in visitedNodes) {
            if (Object.prototype.hasOwnProperty.call(visitedNodes, i)) {
                arr.push(visitedNodes[i].hex);
            }
        }

        return arr;
    }

    getNeighbors = function (a) {
        const neighbors = [];

        const directions = [
            {x: a.Axial.X + 1, y: a.Axial.Y},
            {x: a.Axial.X + 1, y: a.Axial.Y - 1},
            {x: a.Axial.X, y: a.Axial.Y - 1},
            {x: a.Axial.X - 1, y: a.Axial.Y},
            {x: a.Axial.X - 1, y: a.Axial.Y + 1},
            {x: a.Axial.X, y: a.Axial.Y + 1},
        ];

        directions.forEach(d => {
            const h = this.getHexCompareTo(d);

            if (h) neighbors.push(h);
        });

        return neighbors;
    }

    getHexCompareTo(a) {
        let hex;

        this.Hexes.some(h => {
            if (h.compareTo(a)) {
                hex = h;
                return hex;
            }
            return false;
        });
        return hex;
    }
}
