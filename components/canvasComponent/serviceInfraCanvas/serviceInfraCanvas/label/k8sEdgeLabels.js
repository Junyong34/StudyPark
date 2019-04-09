import config from "../utils/topologyConfig";

const EdgeLabels = {
        drawEdgeLabel(edge, source, target) {
            if (typeof edge.label !== "string" || source === target) {
                return;
            }

            const size = edge.size || 1;

            if (config.edgeLabelSizePowRatio === 0) {
                throw new Error('"edgeLabelSizePowRatio must not be 0');
            }

            const x = (source.x + target.x) / 2;
            const y = (source.y + target.y) / 2;
            const dX = target.x - source.x;
            const dY = target.y - source.y;
            const sign = (source.x < target.x) ? 1 : -1;

            const angle = Math.atan2(dY * sign, dX * sign);

            // The font size is sublineraly proportional to the edge size, in order to
            // avoid very large labels on screen.
            // This is achieved by f(x) = x * x^(-1/ a), where 'x' is the size and 'a'
            // is the edgeLabelSizePowRatio. Notice that f(1) = 1.
            // The final form is:
            // f'(x) = b * x * x^(-1 / a), thus f'(1) = b. Application:
            // fontSize = defaultEdgeLabelSize if edgeLabelSizePowRatio = 1
            const fontSize = config.edgeFontSize *
                size *
                Math.pow(size, -1 / config.edgeLabelSizePowRatio);

            this.Scene.save();

            if (edge.active) {
                this.Scene.font = [config.activeFontStyle, `${fontSize}px`].join(" ");

                this.Scene.fillStyle = config.activeFontColor;
            } else {
                this.Scene.font = [config.fontStyle, `${fontSize}px`].join(" ");

                this.Scene.fillStyle = config.edgeLabelsColor;
            }

            this.Scene.textAlign = "center";
            this.Scene.textBaseline = "alphabetic";

            this.Scene.translate(x, y);
            this.Scene.rotate(angle);
            this.Scene.fillText(
                edge.label,
                0,
                (-size / 2) - 3,
            );

            this.Scene.restore();
        },
    }
;

export default EdgeLabels;
