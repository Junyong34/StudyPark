export default class Hexagon {
	constructor(props) {
		this.initProperty();
		Object.keys(props).forEach(key => {
			this[key] = props[key];
		});
		this.HexagonInfo();
		// this.getHexCorners();
	}
	initProperty() {
		this.data = null;
		this.x = 0;
		this.y = 0;
		this.Axial = { X: 0, Y: 0 };
		this.HexSide = 0;
		// this.HexW = 0;
		// this.HexH = 0;
		this.outerGap = 1;
		this.hexId = '';
		this.center = { X: 0, Y: 0 };
		this.TopLeftPoint = { X: 0, Y: 0 };
		this.BottomRightPoint = { X: 0, Y: 0 };
		this.P1 = { X: 0, Y: 0 };
		this.MidPoint = { X: 0, Y: 0 };
	}
	drawHex(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.Points[0].X, this.Points[0].Y);
		for (let i = 1; i < this.Points.length; i++) {
			const p = this.Points[i];

			ctx.lineTo(p.X, p.Y);
		}
		ctx.fillStyle = '#ff9f48';
		ctx.fill();
		ctx.stroke();
		// ctx.shadowColor = "gray";
		ctx.closePath();
		ctx.restore();
	}
	HexagonInfo() {
		// this.MidPoint = this.getCenter();
		this.getCorners();
		this.selected = false;
	}
	getCorners() {
		this.Points = []; // Polygon Base

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

		const offset = 90;
		const angleDeg = 60 * corner + offset;
		const angleRad = (Math.PI / 180) * angleDeg;
		const hX = Math.round(
			this.center.X + (this.HexSide - this.outerGap) * Math.cos(angleRad),
		);
		const hY = Math.round(
			this.center.Y + (this.HexSide - this.outerGap) * Math.sin(angleRad),
		);

		// 화면 밖으로~
		if (hY <= 0 || hX <= 0 || hX >= this.domWidth || hY >= this.domHeight) {
			this.isOverHex = true;
		}
		return new HexPointDrawPos(hX, hY);
	}
	// getCenter() {
	// 	let x = 0;
	//
	// 	let y = 0;
	// 	const c = this.toCube();
	//
	// 	function HexPointDrawPos(Hx, Hy) {
	// 		this.X = Hx;
	// 		this.Y = Hy;
	// 	}
	//
	// 	// if (this.orientation === this.Orientation.Rotated) {
	// 	if (HexGrid.expression === HexGrid.Orientation.Normal) {
	// 		x = (c.x * this.HexW * 3) / 4;
	// 		y = (c.z + c.x / 2) * this.HexH;
	// 	} else {
	// 		x = (c.x + c.z / 2) * this.HexW;
	// 		y = (c.z * this.HexH * 3) / 4;
	// 	}
	//
	// 	const centerX = Math.round(x + this.center.X);
	// 	const centerY = Math.round(y + this.center.Y);
	//
	// 	this.TopLeftPoint = new HexPointDrawPos(
	// 		centerX - this.HexSide + this.outerGap,
	// 		centerY - this.HexSide + this.outerGap,
	// 	);
	// 	this.BottomRightPoint = new HexPointDrawPos(
	// 		centerX + this.HexSide - this.outerGap,
	// 		centerY + this.HexSide - this.outerGap,
	// 	);
	//
	// 	return new HexPointDrawPos(centerX, centerY);
	// }
	toCube() {
		const x = this.Axial.X;
		const y = -this.Axial.X - this.Axial.Y;
		const z = this.Axial.Y;

		// eslint-disable-next-line no-return-assign
		return {
			x,
			y,
			z: (this.Axial.Z = z || -x - y),
		};
	}
	distanceFromMidPoint(p) {
		const deltaX = this.center.X - p.X;
		const deltaY = this.center.Y - p.Y;

		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}

	isInBounds(x, y) {
		return this.Contains({ X: x, Y: y });
	}
	ContainsRect(p) {
		let isIn = false;

		if (this.isInHexBounds(p)) {
			// var pRel = new HexPointDrawPos(p.X - this.x, p.Y - this.y);
			isIn = !isIn;
		}
		return isIn;
	}

	Contains(p) {
		let isIn = false;

		if (this.isInHexBounds(p)) {
			// var pRel = new HexPointDrawPos(p.X - this.x, p.Y - this.y);
			let i;
			let j = 0;

			for (i = 0, j = this.Points.length - 1; i < this.Points.length; j = i++) {
				const iP = this.Points[i];
				const jP = this.Points[j];

				if (
					((iP.Y <= p.Y && p.Y < jP.Y) ||
						(jP.Y <= p.Y && p.Y < iP.Y)) &&
					// ((iP.Y > p.Y) != (jP.Y > p.Y))
					p.X < ((jP.X - iP.X) * (p.Y - iP.Y)) / (jP.Y - iP.Y) + iP.X
				) {
					isIn = !isIn;
				}
			}
		}
		return isIn;
	}
	isInHexBounds(p) {
		if (
			this.TopLeftPoint.X < p.X &&
			this.TopLeftPoint.Y < p.Y &&
			p.X < this.BottomRightPoint.X &&
			p.Y < this.BottomRightPoint.Y
		) {
			return true;
		}
		return false;
	}

	// getKey() {
	// 	return this.hexId;
	// }

	compareTo(other) {
		return this.Axial.X === other.x && this.Axial.Y === other.y;
	}
}
