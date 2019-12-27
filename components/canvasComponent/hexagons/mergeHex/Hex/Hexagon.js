import HexGrid from "./HexGrid";

export default class Hexagon {
    constructor(props) {
        this.initProperty();
        Object.keys(props)
            .forEach(key => {
                this[key] = props[key];
            });
        this.typeHex();
    }

    initProperty() {
        this.x = 0;
        this.y = 0;
        this.Axial = {X: 0, Y: 0};
        this.size = 0;
        this.width = 0;
        this.height = 0;
        this.space = 5;
        this.orientation = 0;
        this.hexId = "";
        this.center = {X: 0, Y: 0};
        this.TopLeftPoint = {X: 0, Y: 0};
        this.BottomRightPoint = {X: 0, Y: 0};
        this.P1 = {X: 0, Y: 0};
        this.MidPoint = {X: 0, Y: 0};
        this.isOverHex = false;
        this.type = "box";
        this.domWidth = 0;
        this.domHeight = 0;
        this.Orientation = {
            Normal: 0,
            Rotated: 1,
        };
        this.cost = 1;
    }

    typeHex() {
        if (this.type === "box") {
            this.HexagonBoxInfo(this.hexId, this.x, this.y);
        } else {
            this.HexagonInfo(this.hexId, this.x, this.y);
        }
    }

    HexagonInfo() {
        this.MidPoint = this.getCenter();
        this.getCorners();
        this.selected = false;
    }

    getCorners() {
        this.Points = [];// Polygon Base

        for (let i = 0; i < 6; i++) {
            this.Points.push(this.getCorner(i));
        }
        this.Points.push(this.getCorner(0));
    }

    getCorner(corner) {
        function HexPointDrawPos(Hx, Hy) {
            this.X = Hx;
            this.Y = Hy;
        }

        const offset = (this.orientation === this.Orientation.Normal) ? 90 : 90;
        const angleDeg = 60 * corner + offset;
        const angleRad = Math.PI / 180 * angleDeg;
        const hX = Math.round(
            this.MidPoint.X + (this.size - this.space) * Math.cos(angleRad));
        const hY = Math.round(this.MidPoint.Y + (this.size - this.space) * Math.sin(angleRad));

        // 화면 밖으로~
        if ((hY <= 0 || hX <= 0) ||
            (hX >= this.domWidth || hY >= this.domHeight)) {
            this.isOverHex = true;
        }
        return new HexPointDrawPos(hX, hY);
    }

    getCenter() {
        let x = 0;

        let y = 0;
        const c = this.toCube();

        function HexPointDrawPos(Hx, Hy) {
            this.X = Hx;
            this.Y = Hy;
        }

        if (this.orientation === this.Orientation.Rotated) {
            x = c.x * this.width * 3 / 4;
            y = (c.z + c.x / 2) * this.height;
        } else {
            x = (c.x + c.z / 2) * this.width;
            y = c.z * this.height * 3 / 4;
        }

        const centerX = Math.round(x + this.center.X);
        const centerY = Math.round(y + this.center.Y);

        this.TopLeftPoint = new HexPointDrawPos(centerX - this.size + this.space,
            centerY - this.size + this.space);
        this.BottomRightPoint = new HexPointDrawPos(centerX + this.size - this.space,
            centerY + this.size - this.space);

        return new HexPointDrawPos(centerX, centerY);
    }

    toCube() {
        const x = this.Axial.X;
        const y = -this.Axial.X - this.Axial.Y;
        const z = this.Axial.Y;

        // eslint-disable-next-line no-return-assign
        return {
            x,
            y,
            z: this.Axial.Z = z || -x - y,
        };
    }


    HexagonBoxInfo(id, x, y) {
        this.Points = [];// Polygon Base
        this.depPoints = [];// Polygon Base
        let x1 = null;
        let y1 = null;

        function HexPointDrawPos(Hx, Hy) {
            this.X = Hx;
            this.Y = Hy;
        }

        if (HexGrid.expression === HexGrid.Orientation.Normal) {
            x1 = (HexGrid.HexW - HexGrid.HexSide) / 2;
            y1 = (HexGrid.HexH / 2);
            this.Points.push(new HexPointDrawPos(x1 + x, y));
            this.Points.push(new HexPointDrawPos(x1 + HexGrid.HexSide + x, y));
            this.Points.push(new HexPointDrawPos(HexGrid.HexW + x, y1 + y));
            this.Points.push(new HexPointDrawPos(x1 + HexGrid.HexSide + x, HexGrid.HexH + y));
            this.Points.push(new HexPointDrawPos(x1 + x, HexGrid.HexH + y));
            this.Points.push(new HexPointDrawPos(x, y1 + y));
            this.Points.push(new HexPointDrawPos(x1 + x, y));
        } else {
            x1 = (HexGrid.HexW / 2);
            y1 = (HexGrid.HexH - HexGrid.HexSide) / 2;
            // console.log(this.HexIndex, "index");
            this.Points.push(new HexPointDrawPos(x1 + x, y));
            this.Points.push(new HexPointDrawPos(HexGrid.HexW + x, y1 + y));
            this.Points.push(new HexPointDrawPos(HexGrid.HexW + x, y1 + HexGrid.HexSide + y));
            this.Points.push(new HexPointDrawPos(x1 + x, HexGrid.HexH + y));
            this.Points.push(new HexPointDrawPos(x, y1 + HexGrid.HexSide + y));
            this.Points.push(new HexPointDrawPos(x, y1 + y));
            this.Points.push(new HexPointDrawPos(x1 + x + 1, y)); // + 1  라인이  두꺼워지면 깨지는 현상 보여서
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

    distanceFromMidPoint(p) {
        const deltaX = this.MidPoint.X - p.X;
        const deltaY = this.MidPoint.Y - p.Y;

        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }

    isInBounds(x, y) {
        return this.Contains({X: x, Y: y});
    }

    Contains(p) {
        let isIn = false;

        if (this.isInHexBounds(p)) {
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

    dotDraw(ctx, {X, Y}, color) {
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
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    drawHex(ctx) {
        ctx.moveTo(this.Points[0].X, this.Points[0].Y);
        for (let i = 1; i < this.Points.length; i++) {
            const p = this.Points[i];

            ctx.lineTo(p.X, p.Y);
        }
    }

    backgroundDraw(ctx) {
        if (this.isOverHex) return;
        ctx.save();
        ctx.beginPath();
        this.drawHex(ctx);
        if (!this.selected) {
            // ctx.strokeStyle = "#e1e0e5";
            ctx.lineWidth = 1;
        } else {
            // ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1;
        }
        // 데이터가 없으면 배경은 따로 그리지 않는다
        if (this.data) {
            // ctx.fillStyle = "rgba(48, 48, 55, 0.6)";
            const grade = this.data.grade;

            if (grade === "A") {
                ctx.fillStyle = "rgba(104, 255, 190, 0.6)";
            } else if (grade === "B") {
                ctx.fillStyle = "#fff66d";
            } else if (grade === "C") {
                ctx.fillStyle = "#ff9f48";
            } else {
                ctx.fillStyle = "#ff3868";
            }
        } else {
            ctx.fillStyle = "rgba(48, 48, 55, 0.6)";
            ctx.globalAlpha = 0.6;
        }
        ctx.fill();
        ctx.stroke();
        // ctx.shadowColor = "gray";
        ctx.closePath();
        if (this.data) {
            // text  debugging
            if (this.data.grade === "A") {
                ctx.fillStyle = "#68ffbe";
            } else {
                ctx.fillStyle = "black";
            }
            ctx.font = "bolder 10pt Roboto-Regular,Tahoma,Verdana,Arial,sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            // var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
            ctx.fillText(this.data.grade, this.MidPoint.X, this.MidPoint.Y);
        }
        ctx.restore();
        // this.dotDraw(ctx, this.TopLeftPoint, "#8effe7");
        // this.dotDraw(ctx, this.MidPoint, "#ff407a");
        // this.dotDraw(ctx, this.BottomRightPoint, "#c7ff37");
    }

    draw(ctx, filterType) {
        ctx.save();
        ctx.beginPath();
        this.drawHex(ctx);
        if (!this.selected) {
            ctx.strokeStyle = "#e1e0e5";
            ctx.lineWidth = 1;
        } else {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.globalAlpha = 1;
        }
        // 데이터가 없으면 배경은 따로 그리지 않는다
        if (!this.data) {
            // ctx.fillStyle = "rgba(48, 48, 55, 0.6)";
            ctx.fillStyle = "rgba(48, 48, 55, 0.6)";
            ctx.globalAlpha = 0.6;
        } else {
            const podStatus = this.data.status;

            ctx.fillStyle = this.hexStatusColor(podStatus);
            ctx.globalAlpha = this.filterAlpha(filterType, podStatus);
            ctx.fill();
            ctx.stroke();
        }

        // ctx.shadowColor = "gray";
        ctx.closePath();
        ctx.restore();
        //
        // this.dotDraw(ctx, this.TopLeftPoint, "#8effe7");
        // this.dotDraw(ctx, this.MidPoint, "#ff407a");
        // this.dotDraw(ctx, this.BottomRightPoint, "#c7ff37");
        // this.dotDraw(ctx, this.depPoints[3], "#c7ff37");
        // this.dotDraw(ctx, this.depPoints[4], "#c7ff37");
        // this.dotDraw(ctx, this.depPoints[5], "#c7ff37");
        // this.dotDraw(ctx, this.depPoints[6], "#c7ff37");
        // debugger;
        // ID 존재하면 그린다.
        // if (this.hexId) {
        //     // text  debugging
        //     ctx.fillStyle = "black";
        //     ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        //     ctx.textAlign = "center";
        //     ctx.textBaseline = "middle";
        //     // var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
        //     ctx.fillText(this.hexId, this.MidPoint.X, this.MidPoint.Y);
        // }
        //
        // if (this.PathCoOrdX !== null && this.PathCoOrdY !== null &&
        //     typeof (this.PathCoOrdX) !== "undefined" &&
        //     typeof (this.PathCoOrdY) !== "undefined") {
        //     // draw co-ordinates for debugging
        //     ctx.fillStyle = "black";
        //     ctx.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
        //     ctx.textAlign = "center";
        //     ctx.textBaseline = "middle";
        //     // var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
        //     ctx.fillText(`(${this.PathCoOrdX},${this.PathCoOrdY})`, this.MidPoint.X, this.MidPoint.Y + 10);
        // }
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

    filterAlpha(selectType, type) {
        if (selectType === "All") return 1;
        if (selectType === type) {
            return 1;
        } else {
            return 0.1;
        }
    }

    hexStatusColor(type) {
        switch (type) {
            case "Running":
                return "#1cbe85";
            case "Succeeded":
                return "#24b0ed";
            case "Failed":
                return "#ff4040";
            case "Pending":
                return "#ffa733";
            case "Completed":
                return "#24b0ed";
            case "Unknown":
                return "gray";
            case "CrashLoopBackOff":
                return "#ff4040";
            default:
                return "#fff";
        }
    }

    isInHexBounds(p) {
        if (this.TopLeftPoint.X < p.X && this.TopLeftPoint.Y < p.Y &&
            p.X < this.BottomRightPoint.X && p.Y < this.BottomRightPoint.Y) {
            return true;
        }
        return false;
    }

    getKey() {
        return this.hexId;
    }

    compareTo(other) {
        return (this.Axial.X === other.x && this.Axial.Y === other.y);
    }
}
