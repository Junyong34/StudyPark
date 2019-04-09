import config from "../utils/topologyConfig";
import Utils from "../utils/topologyUtils";

const Nodes = {
        drawEdge(edge, source, target) {
            const color = edge.color || config.edgeColor;
            const size = (config.edgeSize || edge.size || 1);
            const edgeColor = config.edgeColor;

            this.ctxScene.save();
            this.ctxScene.strokeStyle = color || edgeColor;
            this.ctxScene.lineWidth = size;
            this.ctxScene.beginPath();
            this.ctxScene.moveTo(
                source.x,
                source.y,
            );
            this.ctxScene.lineTo(
                target.x,
                target.y,
            );
            this.ctxScene.stroke();
            this.ctxScene.restore();
        },
        drawArrowEdge(edge, source, target) {
            const color = edge.color || config.edgeColor;
            const size = (config.edgeSize || edge.size || 1);
            const tSize = (target.size || config.nodeSize);
            const sX = source.x;
            const sY = source.y;

            const tX = target.x;
            const tY = target.y;
            const aSize = (Math.max(size * 2.5, config.minArrowSize));


            const d = Math.sqrt(Math.pow(tX - sX, 2) + Math.pow(tY - sY, 2));


            const aX = sX + (tX - sX) * (d - aSize - (tSize)) / d;
            const aY = sY + (tY - sY) * (d - aSize - (tSize)) / d;
            const vX = (tX - sX) * aSize / d;
            const vY = (tY - sY) * aSize / d;


            // if (!color) {
            //     switch (edgeColor) {
            //         case "source":
            //             color = source.color || defaultNodeColor;
            //             break;
            //         case "target":
            //             color = target.color || defaultNodeColor;
            //             break;
            //         default:
            //             color = defaultEdgeColor;
            //             break;
            //     }
            // }
            this.ctxScene.save();

            this.ctxScene.strokeStyle = color;
            this.ctxScene.lineWidth = size;
            this.ctxScene.beginPath();
            this.ctxScene.moveTo(sX, sY);
            this.ctxScene.lineTo(
                aX,
                aY,
            );
            this.ctxScene.stroke();

            this.ctxScene.fillStyle = color;
            this.ctxScene.beginPath();
            this.ctxScene.moveTo(aX + vX, aY + vY);
            this.ctxScene.lineTo(aX + vY * 0.6, aY - vX * 0.6);
            this.ctxScene.lineTo(aX - vY * 0.6, aY + vX * 0.6);
            this.ctxScene.lineTo(aX + vX, aY + vY);
            this.ctxScene.closePath();
            this.ctxScene.fill();
            this.ctxScene.restore();
        },
        drawDashedEdge(edge, source, target) {
            const color = edge.color || config.edgeColor;
            const size = (config.edgeSize || edge.size || 1);
            const edgeColor = config.edgeColor;

            this.ctxScene.save();
            this.ctxScene.setLineDash([8, 3]);
            this.ctxScene.strokeStyle = color || edgeColor;
            this.ctxScene.lineWidth = size;
            this.ctxScene.beginPath();
            this.ctxScene.moveTo(
                source.x,
                source.y,
            );
            this.ctxScene.lineTo(
                target.x,
                target.y,
            );
            this.ctxScene.stroke();
            this.ctxScene.closePath();
            this.ctxScene.restore();
        },
        drawTaperedEdge(edge, source, target) {
            const color = edge.color || config.edgeColor;
            const size = (config.edgeSize || edge.size || 1);
            const edgeColor = config.edgeColor;
            const sX = source.x;
            const sY = source.y;
            const tX = target.x;
            const tY = target.y;
            const dist = Utils.getDistance(sX, sY, tX, tY);

            // Intersection points:
            const c = Utils.getCircleIntersection(sX, sY, size, tX, tY, dist);

            this.ctxScene.save();
            // Draw the triangle:
            this.ctxScene.strokeStyle = color || edgeColor;
            this.ctxScene.fillStyle = color || edgeColor;
            this.ctxScene.lineWidth = size;
            this.ctxScene.globalAlpha = 0.65;
            this.ctxScene.beginPath();
            this.ctxScene.moveTo(tX, tY);
            this.ctxScene.lineTo(c.xi, c.yi);
            this.ctxScene.lineTo(c.xiPrime, c.yiPrime);
            this.ctxScene.fill();
            this.ctxScene.stroke();
            this.ctxScene.closePath();

            this.ctxScene.restore();
        },

    }
;

export default Nodes;
