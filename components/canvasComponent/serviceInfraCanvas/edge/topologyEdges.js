import config from "../utils/topologyConfig";
import Utils from "../utils/topologyUtils";

const Nodes = {
        drawEdge(edge, source, target, ctx) {
            const color = edge.color || config.edgeColor;
            const size = (config.edgeSize || edge.size || 1);
            const edgeColor = config.edgeColor;

            ctx.save();
            ctx.strokeStyle = color || edgeColor;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(
                source.x,
                source.y,
            );
            ctx.lineTo(
                target.x,
                target.y,
            );
            ctx.stroke();
            ctx.restore();
        },
        drawArrowEdge(edge, source, target, ctx) {
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
            ctx.save();

            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(sX, sY);
            ctx.lineTo(
                aX,
                aY,
            );
            ctx.stroke();

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(aX + vX, aY + vY);
            ctx.lineTo(aX + vY * 0.6, aY - vX * 0.6);
            ctx.lineTo(aX - vY * 0.6, aY + vX * 0.6);
            ctx.lineTo(aX + vX, aY + vY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        drawDashedEdge(edge, source, target, ctx) {
            const color = edge.color || config.edgeColor;
            const size = (config.edgeSize || edge.size || 1);
            const edgeColor = config.edgeColor;

            ctx.save();
            ctx.setLineDash([8, 3]);
            ctx.strokeStyle = color || edgeColor;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(
                source.x,
                source.y,
            );
            ctx.lineTo(
                target.x,
                target.y,
            );
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        },
        drawTaperedEdge(edge, source, target, ctx) {
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

            ctx.save();
            // Draw the triangle:
            ctx.strokeStyle = color || edgeColor;
            ctx.fillStyle = color || edgeColor;
            ctx.lineWidth = size;
            ctx.globalAlpha = 0.65;
            ctx.beginPath();
            ctx.moveTo(tX, tY);
            ctx.lineTo(c.xi, c.yi);
            ctx.lineTo(c.xiPrime, c.yiPrime);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            ctx.restore();
        },

    }
;

export default Nodes;
