import * as d3 from 'd3';
import baseScene from './baseScene';
import hexLayoutBase from './hex/hexLayoutBase';

export default class serviceMap extends baseScene {
	baseScene(data) {
		this.treeMapParser(data);
		this.layoutCore(this.serviceMapData);

		// this.hexDraw();
	}
	treeMapParser(data) {
		const rootNode = d3.hierarchy(data);
		const treemapLayout = d3
			.treemap()
			.tile(d3.treemapBinary)
			// .tile(d3.treemapSlice)
			.size([this.domWidth, this.domHeight])
			.paddingRight(4)
			.paddingLeft(4)
			.paddingInner(4)
			.paddingOuter(4)
			.paddingTop(this.boxTitleHeight);

		rootNode.sum(d => d.value).sort((a, b) => b.value - a.value);

		treemapLayout(rootNode);

		this.serviceMapData = rootNode.descendants();
	}

	layoutCore(treemapData) {
		for (let i = 0, len = treemapData.length; i < len; i++) {
			const dataSet = treemapData[i];
			this.drawTreeBox(dataSet);
		}
	}

	drawTreeBox(dataSet) {
		switch (dataSet.depth) {
			case 0:
				this.ctxPanel.fillStyle = '#292929';
				this.treeFillRect(dataSet);
				this.treeBoxTitle(dataSet, this.totalCount(dataSet));
				break;
			case 1:
				this.ctxPanel.fillStyle = '#313131';
				this.treeFillRect(dataSet);
				this.treeBoxTitle(dataSet, this.totalCount(dataSet));
				// const layoutBase = new hexLayoutBase({
				// 	ctx: this.ctxPanel,
				// });

				break;
			case 2:
				this.ctxPanel.fillStyle = '#393939';
				this.treeFillRect(dataSet);
				// this.treeBoxTitle(dataSet);
				this.hexLayoutDraw(dataSet);

				break;
			case 3:
				this.ctxPanel.fillStyle = 'green';
				this.treeFillRect(dataSet);
				// this.treeBoxTitle(dataSet);
				break;
		}
	}
	hexLayoutDraw(dataSet) {
		dataSet.hexBox = new hexLayoutBase({
			ctx: this.ctxPanel,
			canvasDom: this.basePanel,
			hexSide: 15,
			dataSet: dataSet,
			hexCount: 10,
			rectBox: { w: dataSet.x1 - dataSet.x0, h: dataSet.y1 - dataSet.y0 },
			rectPos: { x: dataSet.x0, y: dataSet.y0 },
			hexClickHandler: this.hexClickHandler,
			hexMoveHandler: this.hexMoveHandler,
		});
	}
	fittingString(str, maxWidth) {
		let width = this.ctxPanel.measureText(str).width;
		const ellipsis = '…';
		const ellipsisWidth = this.ctxPanel.measureText(ellipsis).width;
		if (width <= maxWidth || width <= ellipsisWidth) {
			return str;
		} else {
			let len = str.length;
			while (width >= maxWidth - ellipsisWidth && len-- > 0) {
				str = str.substring(0, len);
				width = this.ctxPanel.measureText(str).width;
			}
			return str + ellipsis;
		}
	}
	totalCount(dataSet) {
		const totalCount = dataSet.data.count;
		const titleFont = 'Roboto';
		const fontSize = 12;
		const fontColor = '#ffffff';
		const textValue = 'Pod ' + totalCount;
		const padding = 5;
		const margin = 5;
		const countTextWidth = this.ctxPanel.measureText(textValue).width;
		const countWidth = this.ctxPanel.measureText(totalCount).width;
		const boxWidth = dataSet.x1 - dataSet.x0;

		this.ctxPanel.save();
		this.ctxPanel.fillStyle = 'rgba(216, 216, 216, 0.2';
		// box를 그린다
		this.ctxPanel.fillRect(
			dataSet.x0 + boxWidth - margin * 2 - countTextWidth - padding * 3,
			dataSet.y0 + fontSize,
			countTextWidth + padding * 2 + margin * 2,
			fontSize + padding,
		);
		this.ctxPanel.font = `${fontSize}px ${titleFont} bold`;
		this.ctxPanel.fillStyle = 'rgba(255, 255, 255, 0.6)';
		this.ctxPanel.fillText(
			'Pod',
			dataSet.x0 + padding + boxWidth - margin * 2 - countTextWidth - padding * 3,
			dataSet.y0 + fontSize * 2,
		);
		this.ctxPanel.fillStyle = fontColor;
		this.ctxPanel.fillText(
			totalCount,
			dataSet.x0 + padding + boxWidth - margin * 2 - countWidth - padding * 2,
			dataSet.y0 + fontSize * 2,
		);

		this.ctxPanel.restore();

		return countTextWidth + padding * 2 + margin * 2;
	}
	treeBoxTitle(dataSet, boxCountWidth) {
		const titleFont = 'Roboto';
		const fontSize = 12;
		const fontColor = '#ffffff';
		const boxWidth = dataSet.x1 - dataSet.x0 - boxCountWidth * 1.3;

		this.ctxPanel.save();
		this.ctxPanel.font = `${fontSize}px ${titleFont} bold`;
		this.ctxPanel.fillStyle = fontColor;
		const titleText = this.fittingString(dataSet.data.name, boxWidth);
		this.ctxPanel.fillText(titleText, dataSet.x0 + fontSize, dataSet.y0 + fontSize * 2);
		this.ctxPanel.restore();
	}
	treeFillRect(dataSet) {
		this.ctxPanel.save();
		this.ctxPanel.shadowBlur = 4;
		this.ctxPanel.shadowColor = '#292929';
		this.ctxPanel.fillRect(
			dataSet.x0,
			dataSet.y0,
			dataSet.x1 - dataSet.x0,
			dataSet.y1 - dataSet.y0,
		);
		this.ctxPanel.restore();
	}
}
