import config from "../utils/topologyConfig";

const NodeLabels = {
        drawNodeLabel(node) {
            const size = node.size;
            const fontSize = config.nodeFontSize;

            // if (!node.data.name || typeof node.data.name !== "string") {
            //     return;
            // }

            this.ctxScene.font = `${fontSize}px ${config.font}`;
            this.ctxScene.fillStyle = config.nodeLabelColor;
            this.ctxScene.fillText(
                node.data.name || node.id,
                node.x + (size + 3),
                node.y + (fontSize / 3),
            );
        },
        drawHoverNodeLabel(node) {
            const size = node.size;
            const fontSize = config.nodeFontSize;

            // if (!node.data.name || typeof node.data.name !== "string") {
            //     return;
            // }

            this.ctxScene.font = `${fontSize}px ${config.font}`;
            this.ctxScene.fillStyle = config.nodeLabelColor;
            this.ctxScene.fillText(
                node.data.name || node.id,
                node.x + (size + 3),
                node.y + (fontSize / 3),
            );
        },

    }
;

export default NodeLabels;
