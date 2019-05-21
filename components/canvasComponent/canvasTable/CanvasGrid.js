/**
 * Created by Kang on 2017-12-06.
 */

Ext.define("Exem.CanvasGrid", {
    extend    : 'Exem.Container',
    layout    : 'vbox',
    posX      : 0,
    posY      : 0,
    padding   : 0,
    border    : false,

    listeners: {
        resize: function(me, width, height) {
            me.resizeCanvas( width, height );
        }
    },

    constructor: function() {
        this.isAppendedCanvas = false;
        this.columnList = [];
        this.dataRows = [];
        this.gridInfo = {
            rowHeight: 18,
            rowMaxCntByOnePage: 1,      // 한 페이지안에 그려질 수 있는 최대 Row 갯수
            columnHeaderInfo: {
                height: 30,
                beforeSortTriangle: {
                    itemId: '',
                    x     : 0,
                    y     : 0,
                    size  : 0
                }
            }
        };
        this.positionObjList = {        // Canvas 안에서 위치 및 정보들을 객체화하여 담아두는 리스트
            columnList: [],
            rowList   : []
        };

        this.callParent(arguments);

        this._initProperty();
        this._initLayout();
    },

    _initProperty: function() {
        this.posX += this.padding;
        this.posY += this.padding;
        this.preLeftScroll = 0;
        this.selectedRow = null;
    },

    _initLayout: function() {
        this.gridArea = Ext.create('Ext.container.Container', {
            width: '100%',
            flex: 1,
            layout: 'fit',
            cls: 'hidden-over-flow-y'
        });

        this.pagingToolBar = Ext.create('Exem.PagingBar', {
            pagingInfo: {
                currentPageNum: 1,
                lastPageNum: 1
            },
            btnClick: function( me, itemId ) {
                switch ( itemId ) {
                    case 'leftArrow':
                        if ( me.currentPageNum > me.pagingUnitCnt ) {
                            me.currentPageNum = me.pagingUnitCnt * (Math.ceil(me.currentPageNum/me.pagingUnitCnt)-1);
                        }
                        break;
                    case 'rightArrow':
                        me.currentPageNum = 1 + (me.pagingUnitCnt * Math.ceil(me.currentPageNum/me.pagingUnitCnt));

                        if ( me.currentPageNum > me.lastPageNum ) {
                            me.currentPageNum = me.lastPageNum;
                        }
                        break;
                    default:
                        me.currentPageNum = Number(itemId);
                        break;
                }

                this.drawGrid();
            }.bind(this)
        });

        this.add( this.gridArea, this.pagingToolBar );

        this.attachCanvas();
    },

    attachCanvas: function() {
        if ( !this.isAppendedCanvas && this.el ) {
            this.isAppendedCanvas = true;

            this._createCanvas();

            this.pagingToolBar.attachPagingBar();

            if ( this.gridArea && this.gridArea.el ) {
                this.gridArea.el.dom.addEventListener('scroll', function() {
                    this.preLeftScroll = this.gridArea.el.dom.scrollLeft;
                }.bind(this));
            }

            this.drawGrid();
        }
    },

    _createCanvas: function() {
        this.displayCanvas  = document.createElement('canvas');
        this.bufferCanvas   = document.createElement('canvas');
        this.displayContext = this._createCanvasContext(this.displayCanvas);
        this.bufferContext  = this._createCanvasContext(this.bufferCanvas);

        // Display Canvas Settings
        this.displayCanvas.style.position = 'absolute';

        // Buffer Canvas Settings
        this._setCanvasSize( this.getWidth(), this.getHeight() );

        this.displayContext.save();
        this.bufferContext.save();

        this.displayCanvas.addEventListener('mousemove', function(e) {
            this.displayCanvas.style.cursor = '';

            var ix, ixLen, column, row;
            var posX       = e.offsetX;
            var posY       = e.offsetY;
            var columnList = this.positionObjList.columnList;
            var rowList = this.positionObjList.rowList;

            for ( ix = 0, ixLen = columnList.length; ix < ixLen; ix++ ) {
                column = columnList[ix];

                if ( posX > column.x && posX < column.x + column.width &&
                    posY > column.y && posY < column.y + column.height ) {
                    this.displayCanvas.style.cursor = 'pointer';
                }
            }

            for ( ix = 0, ixLen = rowList.length; ix < ixLen; ix++ ) {
                row = rowList[ix].data[0];
                if ( posY > row.y && posY < row.y + this.gridInfo.rowHeight ) {
                    this.displayCanvas.style.cursor = 'pointer';
                }
            }
        }.bind(this), false);

        this.displayCanvas.addEventListener('click', function(e) {
            this.gridColumnHeaderClick( e, e.offsetX, e.offsetY, this.positionObjList );

            if(e.offsetY > this.gridInfo.columnHeaderInfo.height) {
                this.selectedRow = this.findGridRow(e, e.offsetX, e.offsetY, this.positionObjList, 0);
                this.gridClick(this, e, e.offsetX, e.offsetY, this.findGridRow(e, e.offsetX, e.offsetY, this.positionObjList, 0));
                this.gridCellClick(this, e, e.offsetX, e.offsetY, this.findGridRow(e, e.offsetX, e.offsetY, this.positionObjList, 1));
            }

        }.bind(this), false);

        this.gridArea.el.dom.appendChild(this.displayCanvas);
    },

    _createCanvasContext: function( canvas ) {
        if ( !canvas ) {
            return;
        }

        return canvas.getContext('2d');
    },

    drawGrid: function() {
        if ( !this.isAppendedCanvas || this.isLoading ) {
            return;
        }

        var ix, ixLen, jx, jxLen, column, row, currentX, txtStartPosX, txtStartPosY, txt, optimumTxt;
        var gridInfo = this.gridInfo;
        var ctx = this.bufferContext;
        var columnHeaderHeight = gridInfo.columnHeaderInfo.height;
        var accumulationDataCnt = gridInfo.rowMaxCntByOnePage * (this.pagingToolBar.currentPageNum-1);
        var currentY = this.posY + columnHeaderHeight;    // Exclude Column Header
        var rowDataInfoList = [];
        var rowsGap = 1;
        var isSelected = false;

        this.loadingMask.show();

        this.refreshStyleChange();

        this.clearPositionObjList();
        this.sort();
        this._calPaging();

        // Draw Data Rows
        ctx.save();
        ctx.clearRect(this.posX, this.posY, this.displayCanvas.width, this.displayCanvas.height);

        this._drawBaseGrid();
        this._drawHeaderColumns();
        this._drawSortTriangle();

        for (ix = accumulationDataCnt, ixLen = accumulationDataCnt + gridInfo.rowMaxCntByOnePage; ix < ixLen; ix++) {
            row = this.dataRows[ix];

            if ( !row ) {
                break;
            }

            currentX = this.posX;
            txtStartPosY = currentY + (gridInfo.rowHeight/2);
            rowDataInfoList = [];

            for (jx = 0, jxLen = this.columnList.length; jx < jxLen; jx++) {
                column = this.columnList[jx];
                txt = row[jx];

                switch (column.dataType) {
                    case Grid.Number:
                    case Grid.Float:
                    case Grid.StringNumber:
                        txtStartPosX = currentX + column.width - 5;
                        ctx.textAlign = 'right';
                        break;
                    case Grid.String:
                    case Grid.DateTime:
                        txtStartPosX = currentX + 5;
                        ctx.textAlign = 'left';
                        break;
                    default:
                        txtStartPosX = currentX + (column.width/2);
                        ctx.textAlign = 'center';
                        break;
                }

                rowDataInfoList.push({
                    itemId   : 'r'+ix+jx,
                    x        : currentX,
                    y        : currentY,
                    txt      : txt,
                    rowIdx   : ix,
                    columnIdx: jx
                });

                optimumTxt = this.getOptimumTextInColumnWidth(ctx, column, txt);

                if ( column.renderer ) {
                    ctx.save();

                    column.renderer({
                        itemId   : column.itemId,
                        column   : column,
                        row      : row,
                        context  : ctx,
                        rowIdx   : ix,
                        txt      : txt,
                        optimumTxt: optimumTxt,
                        gridInfo : gridInfo,
                        x        : currentX,
                        y        : currentY,
                        txtPosX  : txtStartPosX,
                        txtPosY  : txtStartPosY,
                        selectedColor : this.selectedColor,
                        selected : this.selectedRow
                    });

                    // Revert Context Property
                    ctx.restore();
                } else {
                    ctx.fillText(optimumTxt, txtStartPosX, txtStartPosY);
                }

                currentX += column.width;
            }

            this.positionObjList.rowList.push({
                isSelected: isSelected,
                data: rowDataInfoList
            });

            currentY += gridInfo.rowHeight + rowsGap;
        }

        ctx.restore();

        this.displayContext.clearRect(this.posX, this.posY, this.displayCanvas.width, this.displayCanvas.height);
        this.displayContext.drawImage(this.bufferCanvas, 0, 0);

        if ( this.pagingToolBar.getLastPageNum() > 1 ) {
            this.pagingToolBar.show();
            this.pagingToolBar.draw();
        } else {
            this.pagingToolBar.hide();
        }

        this.gridArea.el.dom.scrollLeft = this.preLeftScroll;
        this.loadingMask.hide();
    },

    _drawBaseGrid: function() {
        // 기본적인 그리드 틀 만듬 ( Background Shape )
        var ctx          = this.bufferContext;
        var canvasWidth  = this.displayCanvas.width;
        var canvasHeight = this.displayCanvas.height;
        var gridHeight   = this.pagingToolBar.getLastPageNum() > 1 ? canvasHeight - this.pagingToolBar.height : canvasHeight;

        ctx.save();
        ctx.beginPath();

        // Draw Grid Rectangle
        ctx.moveTo(this.posX, this.posY);
        ctx.lineTo(this.posX + canvasWidth, this.posY);
        ctx.lineTo(this.posX + canvasWidth, this.posY + gridHeight);
        ctx.lineTo(this.posX, this.posY + gridHeight);
        ctx.lineTo(this.posX, this.posY);

        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    },

    _drawHeaderColumns: function() {
        var ix, ixLen, column, txtStartPosX, txtStartPosY;
        var ctx              = this.bufferContext;
        var currentX         = this.posX;
        var currentY         = this.posY;
        var columnHeight     = this.gridInfo.columnHeaderInfo.height;
        var columnHeightHalf = columnHeight/2;

        ctx.save();
        ctx.beginPath();

        // Draw Column Header Bottom Line
        ctx.moveTo(this.posX, this.posY + columnHeight);
        ctx.lineTo(this.posX + this.displayCanvas.width, this.posY + columnHeight);

        this.positionObjList.columnList.length = 0;

        // Draw Column Header
        for ( ix = 0, ixLen = this.columnList.length; ix < ixLen; ix++ ) {
            column       = this.columnList[ix];
            txtStartPosX = currentX + (column.width / 2);
            txtStartPosY = currentY + columnHeightHalf;

            this.positionObjList.columnList.push({
                column : column,
                itemId : column.itemId,
                x      : currentX,
                y      : currentY,
                width  : column.width,
                height : columnHeight,
                text   : column.text,
                txtPosX: txtStartPosX,
                txtPosY: txtStartPosY
            });

            // Draw Column Right End Line
            ctx.moveTo(currentX + column.width, currentY);
            ctx.lineTo(currentX + column.width, currentY + columnHeight);

            // Draw Column Value
            ctx.fillText(column.text, txtStartPosX, txtStartPosY);

            currentX += column.width;
        }

        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },

    sort: function( columnItemId, orderBy ) {
        var ix, ixLen, column, tmpColumn;

        for ( ix = 0, ixLen = this.columnList.length; ix < ixLen; ix++ ) {
            tmpColumn = this.columnList[ix];

            if ( columnItemId ) {
                // 특정 Column 시, 나머지는 false 처리
                if ( columnItemId == tmpColumn.itemId ) {
                    column = tmpColumn;
                    column.isSort = true;
                    column.isAsc  = orderBy ? orderBy : !column.isAsc;
                } else {
                    tmpColumn.isSort = false;
                    tmpColumn.isAsc  = false;
                }
            } else {
                if ( tmpColumn.isSort ) {
                    column = tmpColumn;
                    break;
                }
            }
        }

        // Sort 될 Column Check
        if ( !column || column.constructor != Object ) {
            return;
        }

        this.dataRows.sort(function(first, second){
            var firstVal  = first[column.columnIdx];
            var secondVal = second[column.columnIdx];
            var returnVal = 0;

            if ( !isNaN(+firstVal) && !isNaN(+secondVal) ) {
                // 값이 String 일 경우, Number 혹은 Float 비교가 되면 그렇게 해주기 위해
                firstVal = +firstVal;
                secondVal = +secondVal;
            }

            if ( firstVal === secondVal ) {
                returnVal = 0;
            } else if ( firstVal < secondVal) {
                returnVal = column.isAsc ? -1 : 1;
            } else {
                returnVal = column.isAsc ? 1 : -1;
            }

            return returnVal;
        }.bind(this));
    },

    _drawSortTriangle: function() {
        var ix, ixLen, column;
        var columnList = this.positionObjList.columnList;

        for ( ix = 0, ixLen = columnList.length; ix < ixLen; ix++ ) {
            if ( columnList[ix].column.isSort ) {
                column = columnList[ix];
                break;
            }
        }

        if ( !column || column.constructor != Object ) {
            return;
        }

        var beforeSortTriangle = this.gridInfo.columnHeaderInfo.beforeSortTriangle;
        var ctx      = this.bufferContext;
        var size     = 4;
        var preGap   = 3;
        var type     = column.column.isAsc ? 'up' : 'down';
        var txtWidth = this.bufferContext.measureText(column.text).width;
        var triangleWidth = size*2;
        var posX     = column.txtPosX + (txtWidth/2) + preGap;
        var posY     = column.txtPosY;

        if ( beforeSortTriangle.itemId ) {
            // 딱 해당 크기만큼 지워지지 않기때문에 +1 씩 추가로 지워준다
            ctx.clearRect(beforeSortTriangle.x-1, beforeSortTriangle.y-beforeSortTriangle.size-1, (beforeSortTriangle.size*2)+2, (beforeSortTriangle.size*2)+2);
        }

        if ( (column.x+column.width) <= (posX+triangleWidth) ) {
            // Triangle 이 그려질만한 공간이 안되면 그리지 않는다
            beforeSortTriangle.itemId = null;
            return;
        }

        beforeSortTriangle.itemId = column.itemId;
        beforeSortTriangle.x      = posX;
        beforeSortTriangle.y      = posY;
        beforeSortTriangle.type   = type;
        beforeSortTriangle.size   = size;

        this._drawTriangle(ctx, posX, posY, type, size);
    },

    _drawTriangle: function( ctx, posX, posY, type, size, isStroke ) {
        if ( !ctx ) {
            return;
        }

        size = size ? size : 4;

        ctx.save();
        ctx.beginPath();

        if ( type == 'up' ) {
            ctx.moveTo(posX         , posY+size);
            ctx.lineTo(posX+size    , posY-size);
            ctx.lineTo(posX+(size*2), posY+size);
        } else if ( type == 'down' ) {
            ctx.moveTo(posX         , posY-size);
            ctx.lineTo(posX+size    , posY+size);
            ctx.lineTo(posX+(size*2), posY-size);
        }

        ctx.closePath();

        if ( isStroke ) {
            ctx.stroke();
        } else {
            ctx.fill();
        }

        ctx.restore();
    },

    /**
     * Paging 을 위한 계산
     * @private
     */
    _calPaging: function() {
        var ix, ixLen, isShowXAxisScroll;
        var gridInfo = this.gridInfo;
        var bottomExtraGapByCurrentPage = 10;  // 현재 페이지의 마지막 Row 와 Grid Bottom Line 사이의 여유 간격
        var xAxisScrollHeight = 7;
        var columnListTotalWidth = 0;
        var gridRowAreaHeight = this.getHeight() - gridInfo.columnHeaderInfo.height - bottomExtraGapByCurrentPage;
        var rowMaxCntByOnePage = Math.floor(gridRowAreaHeight / gridInfo.rowHeight); // pagingToolBar 없이 한 페이지안에 모두 들어갈 수 있는 Row Count
        var dataRowCnt = this.dataRows.length;

        for ( ix = 0, ixLen = this.columnList.length; ix < ixLen; ix++ ) {
            columnListTotalWidth += this.columnList[ix].width;
        }

        isShowXAxisScroll = this.displayCanvas.width <= columnListTotalWidth;

        if ( rowMaxCntByOnePage < dataRowCnt ) {
            // 전체 Height 에서 pagingToolBar 높이를 제외하고 Grid 안에 들어갈 Row Count
            rowMaxCntByOnePage = Math.floor((gridRowAreaHeight - this.pagingToolBar.getHeight()) / gridInfo.rowHeight);

            if ( isShowXAxisScroll && rowMaxCntByOnePage > 1 ) {
                // rowMaxCntByOnePage 가 다시 계산되었어도 1 보다 커서 pagingToolBar 가 필요한데 거기에 x축 스크롤까지 있을 경우, x축 스크롤의 높이도 빼서 계산 필요
                rowMaxCntByOnePage = Math.floor((gridRowAreaHeight - this.pagingToolBar.getHeight() - xAxisScrollHeight) / gridInfo.rowHeight);
            }
        }

        this.setRowMaxCntByOnePage(rowMaxCntByOnePage);
        this.pagingToolBar.setLastPageNum(Math.ceil(dataRowCnt / rowMaxCntByOnePage));
    },

    addColumn: function( paramObj ) {
        var ix, ixLen;
        var defaultObj = {
            text     : '',
            itemId   : '',
            width    : 10,
            height   : this.gridInfo.rowHeight,
            dataType : Grid.String,
            isSort   : false,
            isAsc    : false,
            columnIdx: this.columnList.length,
            renderer : null
        };

        if ( paramObj.constructor === Array ) {
            for ( ix = 0, ixLen = paramObj.length; ix < ixLen; ix++ ) {
                defaultObj.columnIdx = this.columnList.length;
                this.columnList.push(Object.assign({}, defaultObj, paramObj[ix]));
            }
        } else {
            this.columnList.push(Object.assign({}, defaultObj, paramObj));
        }
    },

    addRow: function( row ) {
        this.dataRows.push(row);
        this._calPaging();
    },

    clearRows: function() {
        this.dataRows.length = 0;
    },

    clearPositionObjList: function() {
        // Canvas 안에서 Row 들의 위치 및 정보들을 객체화하여 담아두는 리스트 > 그릴때마다 초기화
        this.positionObjList.rowList.length = 0;
        this.positionObjList.columnList.length = 0;
    },

    /**
     * 해당 컬럼 Customizing
     * @param columnItemId
     * @param customFn
     */
    addRenderer: function( columnItemId, customFn ) {
        var ix, ixLen, column;

        for ( ix = 0, ixLen = this.columnList.length; ix < ixLen; ix++ ) {
            column = this.columnList[ix];

            if ( column.itemId == columnItemId ) {
                column.renderer = customFn;
            }
        }
    },

    setRowMaxCntByOnePage: function(rowCount) {
        this.gridInfo.rowMaxCntByOnePage = rowCount;
    },

    _setCanvasSize: function( parentWidth, parentHeight ) {
        if ( !this.displayCanvas ) {
            return;
        }

        var ix, ixLen, canvasWidth, canvasHeight, isShowXAxisScroll;
        var columnHeight = this.gridInfo.rowHeight;
        var columnHeaderHeight = this.gridInfo.columnHeaderInfo.height;
        var columnListTotalWidth = 0;
        var columnListTotalHeight = 0;

        columnListTotalHeight += columnHeaderHeight;

        for ( ix = 0, ixLen = this.columnList.length; ix < ixLen; ix++ ) {
            columnListTotalWidth += this.columnList[ix].width;
            columnListTotalHeight += columnHeight;
        }

        isShowXAxisScroll = parentWidth < columnListTotalWidth;
        canvasWidth  = isShowXAxisScroll ? columnListTotalWidth : parentWidth;
        canvasHeight = parentHeight < columnListTotalHeight ? columnListTotalHeight : parentHeight || this.getHeight();

        if ( isShowXAxisScroll ) {
            canvasHeight -= 10;
        }

        this.displayCanvas.width  = canvasWidth;
        this.displayCanvas.height = canvasHeight;
        this.bufferCanvas.width   = canvasWidth;
        this.bufferCanvas.height  = canvasHeight;
    },

    getCanvas: function() {
        return this.displayCanvas;
    },

    getOptimumTextInColumnWidth: function(ctx, column, txt) {
        var ix, ixLen, reducedTxt;
        var resultTxt = '';

        for (ix = txt.length, ixLen = 0; ix > ixLen; ix--) {
            switch (ix) {
                case txt.length:
                    reducedTxt = txt;
                    break;
                case 1:
                case 2:
                    continue;
                default:
                    reducedTxt = txt.substr(0, ix) + '...';
                    break;
            }

            if (ctx.measureText(reducedTxt).width < column.width) {
                resultTxt = reducedTxt;
                break;
            }
        }

        return resultTxt;
    },

    /**
     * Grid Column Header Event
     */
    gridColumnHeaderClick: function( e, posX, posY, positionObjList ) {
        var ix, ixLen, column;
        var columnList = positionObjList.columnList;

        for ( ix = 0, ixLen = columnList.length; ix < ixLen; ix++ ) {
            column = columnList[ix];

            if ( posX > column.x && posX < column.x + column.width &&
                 posY > column.y && posY < column.y + column.height ) {
                this.sort( column.itemId );
                this.drawGrid();
            }
        }
    },

    /**
     * Grid Click Event
     * @param target
     * @param e - e of canvas click event
     * @param posX
     * @param posY
     * @param item - selected position object
     */
    gridClick: function(target, e, posX, posY, item ) {
    },
    gridCellClick: function(target, e, posX, posY, item ) {
    },

    refreshStyleChange: function() {
        var ctx = this.bufferContext;

        ctx.lineWidth    = 1;
        ctx.font         = '12px Roboto Condensed';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';

        switch ( Comm.themeType ) {
            // Set Init Canvas Context Default Property
            case ThemeType.Black:
                ctx.backgroundColor = '#212121';
                ctx.fontColor       = '#FFFFFF';
                ctx.fillStyle       = '#FFFFFF';
                ctx.strokeStyle     = '#464a54';
                this.selectedColor  = '#464A54';
                break;
            case ThemeType.Gray:
                ctx.backgroundColor = '#585c66';
                ctx.fontColor       = '#ABAEB5';
                ctx.fillStyle       = '#ABAEB5';
                ctx.strokeStyle     = '#464a54';
                this.selectedColor  = '#474B55';
                break;
            default:
                ctx.backgroundColor = '#E1E1E1';
                ctx.fontColor       = '#000000';
                ctx.fillStyle       = '#000000';
                ctx.strokeStyle     = '#E1E1E1';
                this.selectedColor  = '#E3E6EA';
                break;
        }
    },

    resizeCanvas: function( parentWidth, parentHeight ) {
        if ( !this.displayCanvas ) {
            return;
        }

        parentWidth  = parentWidth  || this.getWidth();
        parentHeight = parentHeight || this.getHeight();

        this._setCanvasSize( parentWidth, parentHeight );
        this.drawGrid();
    },

    // type 0 : find row
    // type 1 : find cell
    findGridRow: function( e, posX, posY, positionObjList, type ) {
        var item;
        var ix, ixLen;
        var rowIndex;
        var colIndex;
        var result = null;
        var gridInfo = this.gridInfo;
        var columnHeight = gridInfo.columnHeaderInfo.height;
        var rowHeight = gridInfo.rowHeight;
        var rowList = positionObjList.rowList;

        rowIndex = Math.ceil((posY - columnHeight) / rowHeight) -1;
        for(ix = 0, ixLen = positionObjList.columnList.length; ix < ixLen; ix++) {
            item = positionObjList.columnList[ix];
            if(posX >= item.x && posX <= item.x + item.width) {
                colIndex = ix;
                break;
            }
        }

        if (rowIndex > -1 && rowList[rowIndex]) {
            rowList[rowIndex].isSelected = true;
            if(type === 1 && colIndex) {
                result = rowList[rowIndex].data[colIndex];
            } else {
                result = rowList[rowIndex];
            }
        }

        return result;
    }

});