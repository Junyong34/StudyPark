import config from "../utils/topologyConfig";
import env from "@/env/config";
import cUtil from "@/common/commonUtil";

const Nodes = {

        drawNode(node, ctx, k8s) {
            ctx.save();
            ctx.fillStyle = node.color || config.nodeColor;
            ctx.beginPath();
            // ctx.fillRect(node.x, node.y, node.width, node.height);
            ctx.arc(
                node.x,
                node.y,
                node.size || config.nodeSize,
                0,
                Math.PI * 2,
                true,
            );


            ctx.fill();
            ctx.closePath();
            // ctx.fillStyle = "blue";
            // ctx.fillRect(
            //     node.x - node.size,
            //     node.y - node.size,
            //     node.width,
            //     node.height,
            // );
            ctx.restore();
            // const nodeLoop = (anniNode, Pk8s) => this.loop(anniNode, Pk8s);
            //
            // nodeLoop(node, k8s);
        },
        loop(node, ctx) {
            let circleLoop = null;
            let angle = 0;
            const velocity = 0.15;
            const animationNode = () => {
                if (circleLoop != null) {
                    cancelAnimationFrame(circleLoop);
                }

                const clearX = node.x; // + this.xleftView;
                const clearY = node.y; // + this.ytopView;
                const x = clearX + Math.cos(angle) * node.size;
                const y = clearY + Math.sin(angle) * node.size;

                //
                ctx.clearRect(clearX - node.size - 4, clearY - node.size - 4,
                    (node.size * 2) + 8,
                    (node.size * 2) + 8);

                ctx.save();
                ctx.fillStyle = "hotpink";
                ctx.beginPath();
                // ctx.fillRect(node.x, node.y, node.width, node.height);
                ctx.arc(
                    x,
                    y,
                    3,
                    0,
                    Math.PI * 2,
                    true,
                );


                ctx.fill();
                ctx.closePath();
                // ctx.fillStyle = "blue";
                // ctx.fillRect(
                //     node.x - nodes.size,
                //     nodes.y - nodes.size,
                //     nodes.width,
                //     nodes.height,
                // );
                ctx.restore();
                angle = angle >= 360 ? 0 : angle + velocity;

                circleLoop = requestAnimationFrame(animationNode);
            };

            return animationNode();


            // circleLoop= requestAnimationFrame(this.loop);
        },
        selectDrawNode(node, ctx) {
            ctx.save();
            ctx.fillStyle = "#637dff";
            ctx.beginPath();
            // ctx.fillRect(node.x, node.y, node.width, node.height);
            ctx.arc(
                node.x,
                node.y,
                node.size || config.nodeSize,
                0,
                Math.PI * 2,
                true,
            );

            ctx.closePath();
            ctx.fill();
            ctx.restore();
        },
        getRandomColor() {
            return Math.floor(Math.random() * 16777215).toString(16);
        }
        ,
    }

;

export default Nodes;
