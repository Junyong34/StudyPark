import config from "../utils/topologyConfig";

const NodeLabels = {
        drawNodeLabel(node, ctx) {
            const size = node.size;
            const fontSize = config.nodeFontSize;

            // if (!node.data.name || typeof node.data.name !== "string") {
            //     return;
            // }

            ctx.font = `${fontSize}px ${config.font}`;
            ctx.fillStyle = config.nodeLabelColor;
            ctx.fillText(
                node.data.name || node.id,
                node.pos2dX + (size + 3),
                node.pos2dY + (fontSize / 3),
            );
        },
        drawHoverNodeLabel(node, ctx) {
            const size = node.size;
            const fontSize = config.nodeFontSize;

            // if (!node.data.name || typeof node.data.name !== "string") {
            //     return;
            // }

            ctx.font = `${fontSize}px ${config.font}`;
            ctx.fillStyle = config.nodeLabelColor;
            ctx.fillText(
                node.data.name || node.id,
                node.pos2dX + (size + 3),
                node.pos2dY + (fontSize / 3),
            );
        },

    }
;

export default NodeLabels;
