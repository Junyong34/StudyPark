import config from "../utils/topologyConfig";

// ctx.drawImage(img, 10, 10);
const Nodes = {
        drawNode(node) {
            this.ctxScene.save();
            this.ctxScene.fillStyle = node.color || config.nodeColor;
            this.ctxScene.beginPath();
            // this.ctxScene.fillRect(node.x, node.y, node.width, node.height);
            // this.ctxScene.arc(
            //     node.x,
            //     node.y,
            //     node.size || config.nodeSize,
            //     0,
            //     Math.PI * 2,
            //     true,
            // );
            this.ctxScene.drawImage(this.iconImg, node.x - node.size, node.y - node.size,
                node.size * 2, node.size * 2);
            // this.ctxScene.drawImage(this.iconImg, 20, 40, 30, 30, node.x - node.size, node.y - node.size,
            //         node.size * 2, node.size * 2);


            this.ctxScene.fill();
            this.ctxScene.closePath();
            // this.ctxScene.fillStyle = "blue";
            // this.ctxScene.fillRect(
            //     node.x - node.size,
            //     node.y - node.size,
            //     node.width,
            //     node.height,
            // );
            this.ctxScene.restore();
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
        selectDrawNode(node) {
            this.ctxScene.save();
            this.ctxScene.fillStyle = "#637dff";
            this.ctxScene.beginPath();
            // this.ctxScene.fillRect(node.x, node.y, node.width, node.height);
            this.ctxScene.arc(
                node.x,
                node.y,
                node.size || config.nodeSize,
                0,
                Math.PI * 2,
                true,
            );

            this.ctxScene.closePath();
            this.ctxScene.fill();
            this.ctxScene.restore();
        },
        getRandomColor() {
            return Math.floor(Math.random() * 16777215).toString(16);
        }
        ,
    }

;

export default Nodes;
