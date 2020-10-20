import Hexagon from './hexagon';
import MouseEvents from '../event/HexMouseEvent';

export default class hexLayoutBase {
	constructor(props) {
		this.initProperty();
		this.mergeFn();
		Object.keys(props).forEach(key => {
			this[key] = props[key];
		});
		this.init();
	}
	mergeFn() {
		Object.assign(this, MouseEvents);
	}
	initProperty() {
		this.rectBox = { w: 0, h: 0 };
		this.rectPos = { x: 0, y: 0 };
		this.startPos = { x: 0, y: 0 };
		this.ctx = null;
		this.canvasDom = null;
		this.hexSide = 15;
		this.spacingSize = { w: 0, h: 0 };
		this.hexSize = { w: 0, h: 0 };
		this.xLen = 0;
		this.yLen = 0;
		this.outerGap = 2;
		this.Hexes = [];
		this.hexCount = 20;
		this.padding = { top: 5, bottom: 5, right: 5, left: 5 };
		this.hexClickHandler = null;
		this.hexMoveHandler = null;
		this.selectHex = null;
		this.minHexSide = 6;
		this.dataSet = null;
		// event
		this.mouseDown = false;
		this.mPointer = {
			X: 0,
			Y: 0,
		};
		this.tPointer = {
			X: 0,
			Y: 0,
		};
	}
	setHexSide(side) {
		this.hexSide = side;
	}
	init() {
		this.initCanvasEvent();
		this.setHexSize();
		this.rectMaxCount();
		this.drawHex();
	}
	ctxClear(ctx) {
		ctx.clearRect(this.rectPos.x, this.rectPos.y, this.rectBox.w, this.rectBox.h);
	}
	initCanvasEvent() {
		// 이벤트 생성 및 bind
		this.createMouseEvents();
	}
	boxAreaCalc(hexagonSize) {
		return {
			width: this.spacingSize.w,
			height: this.spacingSize.h,
		};
		// if (this.rectBox.w > this.rectBox.h) {
		// 	return {
		// 		width: hexagonSize + this.padding.left + this.padding.right,
		// 		height: hexagonSize + this.padding.top + this.padding.bottom - 26,
		// 	};
		// } else {
		// 	return {
		// 		width:
		// 			hexagonSize +
		// 			this.padding.left +
		// 			this.padding.right +
		// 			this.hexSide / 2,
		// 		height: hexagonSize + this.padding.top + this.padding.bottom - 30,
		// 	};
		// }
	}
	rectMaxCount(hexSide = this.hexSide) {
		let index = 1;
		let isMaxCol = false;
		let isMaxRow = false;
		// let hasEven = false;
		this.xLen = 1;
		this.yLen = 1;
		// 반지름 --> x2 지름
		// const hexagonSize = hexSide * 2;
		let calcWidth = this.spacingSize.w * 2;
		// treemap topPadding 26 값
		let calcHeight = this.spacingSize.h * 2;
		while (index) {
			// col 수를 지정한다.
			if (calcWidth <= this.rectBox.w) {
				this.xLen++;
				calcWidth += this.spacingSize.w + this.outerGap;
			} else {
				isMaxCol = true;
			}

			if (calcHeight <= this.rectBox.h) {
				this.yLen++;
				// hasEven = false;
				calcHeight += this.spacingSize.h + this.outerGap;
			} else {
				isMaxRow = true;
			}

			if (isMaxCol && isMaxRow) {
				if (this.yLen * this.xLen < this.hexCount) {
					// 최소 hex 사이즈 보다 작아지면 화면에서 그려도 보이지 않아서 범위 넘겨서라도 그린다.
					if (hexSide < this.minHexSide) {
						break;
					} else {
						// 1px 씩 줄어든다
						const reduceHexSize = hexSide - 1;
						this.setHexSide(reduceHexSize);
						this.rectMaxCount(reduceHexSize);
					}
				}
				break;
			}
			index++;
		}
	}
	setHexSize(size) {
		// https://www.redblobgames.com/grids/hexagons/#map-storage
		// 헥사곤 넓이
		this.hexSize.w = Math.sqrt(3) * this.hexSide;
		// 헥사곤 높이
		this.hexSize.h = 2 * this.hexSide;
		this.spacingSize.w = this.hexSize.w;
		this.spacingSize.h = (this.hexSize.h * 3) / 4;
		// const hexGridSize = this.getHexGridInterval();
		// this.startX = (this.domWidth - hexGridSize.w) / 2 + this.hexW / 2;
		this.startPos.x = this.rectPos.x + this.spacingSize.w / 2;
		// this.startY = (this.domHeight - hexGridSize.h) / 2 + this.hexH / 2;
		this.startPos.y = this.rectPos.y + this.spacingSize.h;
	}
	// getHexGridInterval() {
	// 	// https://www.redblobgames.com/grids/hexagons/#map-storage
	// 	// 간격 구하는 공식
	// 	const w = this.hexW * this.xLen;
	// 	const h = (this.hexH * 3) / 4;
	// 	// console.log(w, h);
	// 	return { w, h };
	// }
	drawHex() {
		// console.log(this.size, this.xLen, this.yLen, this.startPos.x, this.startPos.y);
		// this.outerGap = 0;
		const Hexes = this.Hexes;
		const startX = this.startPos.x;
		const startY = this.startPos.y;
		const xLen = this.xLen;
		const yLen = this.yLen;
		let dataIndex = 0;
		for (let iy = 0; iy < yLen; iy++) {
			for (let ix = 0; ix < xLen; ix++) {
				const x =
					iy % 2 === 0
						? startX +
						  this.padding.left +
						  ix * this.spacingSize.w
						: startX +
						  this.padding.top +
						  ix * this.spacingSize.w +
						  this.spacingSize.w / 2;
				const y = startY + iy * this.spacingSize.h;

				const hex = new Hexagon({
					hexId: `${x}x${y}`,
					// Axial: { X: 100, Y: 100 },
					center: { X: x, Y: y },
					HexSide: this.hexSide,
					outerGap: this.outerGap,
					rectBox: {
						w: this.rectBox.w - this.padding.left,
						h: this.rectBox.h - this.padding.top,
					},
					rectPos: { x: this.rectPos.x, y: this.rectPos.y },
					domWidth: this.rectBox.w,
					domHeight: this.rectBox.h,
				});

				// rect를 벗어 나지 않은 hex만 데이터 넣는다
				if (!hex.isOverHex) {
					hex.data = this.dataSet.data?.list?.[dataIndex];
					dataIndex++;
				}

				// data가 있는 hex만 그린다s
				if (hex.data) {
					hex.drawHex(this.ctx);
					Hexes.push(hex);
				}
				// hex.drawHex(this.ctx);
				// Hexes.push(hex);

				// this.ctxPanel.beginPath();
				// this.ctxPanel.arc(x, y, size - outerGap - 2.5, 0, Math.PI * 2);
				// this.ctxPanel.lineWidth = 1;
				// this.ctxPanel.strokeStyle = 'black';
				//
				// this.ctxPanel.rect(x, y, this.hexW, this.hexH);
				// this.ctxPanel.stroke();
				// this.ctxPanel.closePath();
			}
		}
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

		return (Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2;
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
