import dataSet from "../data/topologyStore";
import config from "../utils/topologyConfig";

const topologyUtils = {
        datas: dataSet.topologyData,
        // id 또는 배열에 당긴 id 반환
        getNodes(nodeValue) {
            if (arguments.length === 1 &&
                (typeof nodeValue === "string" || typeof nodeValue === "number")) {
                return this.datas.nodesIndex[nodeValue];
            }

            if (
                arguments.length === 1 &&
                Object.prototype.toString.call(nodeValue) === "[object Array]"
            ) {
                let ix;
                let ixLen;
                const nodeList = [];

                for (ix = 0, ixLen = nodeValue.length; ix < ixLen; ix++) {
                    if (typeof nodeValue[ix] === "string" || typeof nodeValue[ix] === "number") {
                        nodeList.push(this.datas.nodesIndex[nodeValue[ix]]);
                    } else {
                        throw new Error("No Node Type");
                    }
                }

                return nodeList;
            }

            throw new Error("No arguments Type");
        },
        /**
         * @param  {number} x1  The X coordinate of the start point.
         * @param  {number} y1  The Y coordinate of the start point.
         * @param  {number} x2  The X coordinate of the end point.
         * @param  {number} y2  The Y coordinate of the end point.
         * @param  {number} a   Modifier for the amplitude of the curve.
         * @return {x,y}        The control point coordinates.
         */
        getQuadraticControlPoint(x1, y1, x2, y2, a) {
            const point = a || 0;

            return {
                x: (x1 + x2) / 2 + (y2 - y1) / (60 / (15 + point)),
                y: (y1 + y2) / 2 + (x1 - x2) / (60 / (15 + point)),
            };
        },
        /**
         * @param  {number} x    The X coordinate of the node.
         * @param  {number} y    The Y coordinate of the node.
         * @param  {number} size The node size.
         * @param  {number} a    Modifier to the loop size.
         * @return {x1,y1,x2,y2} The coordinates of the two control points.
         */
        getSelfLoopControlPoints(x, y, size, a) {
            const point = a || 0;

            return {
                x1: x - (size + point) * 7,
                y1: y,
                x2: x,
                y2: y + (size + point) * 7,
            };
        },
        /**
         *
         * @param  {number} x1  The X coordinate of the first point.
         * @param  {number} y1  The Y coordinate of the first point.
         * @param  {number} x2  The X coordinate of the second point.
         * @param  {number} y2  The Y coordinate of the second point.
         * @return {number}     The euclidian distance.
         */
        getDistance(x0, y0, x1, y1) {
            return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        },
        /**
         * Return the coordinates of the intersection points of two circles.
         *
         * @param  {number} x0  The X coordinate of center location of the first
         *                      circle.
         * @param  {number} y0  The Y coordinate of center location of the first
         *                      circle.
         * @param  {number} r0  The radius of the first circle.
         * @param  {number} x1  The X coordinate of center location of the second
         *                      circle.
         * @param  {number} y1  The Y coordinate of center location of the second
         *                      circle.
         * @param  {number} r1  The radius of the second circle.
         * @return {xi,yi}      The coordinates of the intersection points.
         */
        getCircleIntersection(x0, y0, r0, x1, y1, r1) {
            // dx and dy are the vertical and horizontal distances between the circle
            // centers:
            const dx = x1 - x0;
            const dy = y1 - y0;

            // Determine the straight-line distance between the centers:
            const d = Math.sqrt((dy * dy) + (dx * dx));

            // Check for solvability:
            if (d > (r0 + r1)) {
                // No solution. circles do not intersect.
                return false;
            }
            if (d < Math.abs(r0 - r1)) {
                // No solution. one circle is contained in the other.
                return false;
            }

            // 'point 2' is the point where the line through the circle intersection
            // points crosses the line between the circle centers.

            // Determine the distance from point 0 to point 2:
            const a = ((r0 * r0) - (r1 * r1) + (d * d)) / (2.0 * d);

            // Determine the coordinates of point 2:
            const x2 = x0 + (dx * a / d);
            const y2 = y0 + (dy * a / d);

            // Determine the distance from point 2 to either of the intersection
            // points:
            const h = Math.sqrt((r0 * r0) - (a * a));

            // Determine the offsets of the intersection points from point 2:
            const rx = -dy * (h / d);
            const ry = dx * (h / d);

            // Determine the absolute intersection points:
            const xi = x2 + rx;
            const xiPrime = x2 - rx;
            const yi = y2 + ry;
            const yiPrime = y2 - ry;

            return {xi, xiPrime, yi, yiPrime};
        },
        getDelta(e) {
            return (
                (e.wheelDelta !== undefined && e.wheelDelta) ||
                (e.detail !== undefined && -e.detail)
            );
        },
        getX(e) {
            return (
                (e.offsetX !== undefined && e.offsetX) ||
                (e.layerX !== undefined && e.layerX) ||
                (e.clientX !== undefined && e.clientX)
            );
        },
        getY(e) {
            return (
                (e.offsetY !== undefined && e.offsetY) ||
                (e.layerY !== undefined && e.layerY) ||
                (e.clientY !== undefined && e.clientY)
            );
        },
        getWidth(dom) {
            return dom.clientWidth || dom.width;
        },

        getHeight(dom) {
            return dom.clientHeight || dom.height;
        }
        ,


    }
;

export default topologyUtils;
