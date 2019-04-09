import infraBase from "./baseInfra";
import Utils from "./utils/topologyUtils";
import dataSet from "./data/topologyStore";


export default class k8sInfra extends infraBase {
    // 토폴로지 그린다.
    topologyDraw() {
        // this.ctxClear(this.ctxScene);
        this.edgeDraw();
        this.nodeDraw();
        this.callAnimate();
    }

    updateDraw() {
        this.ctxClear(this.ctxScene);
        this.edgeDraw();
        this.nodeDraw();
    }

    callAnimate() {
        this.cancelAnimate();
        this.alertEffect();
        this.LineTpsEffect(0);
        setInterval(() => {
            const nodes = this.topologyData.nodes;
            const edges = this.topologyData.edges;

            for (let ix = 0, ixLen = nodes.length; ix < ixLen; ix++) {
                const node = nodes[ix];
                const randomChk = Math.round(Math.random() * 2);

                if (randomChk === 0 || randomChk === 1) {
                    node.level = 0;
                } else {
                    node.level = Math.random() * 1 + 0.2;
                }
            }
            for (let ix = 0, ixLen = edges.length; ix < ixLen; ix++) {
                const edge = edges[ix];
                const randomChk = Math.round(Math.random() * 4);

                if (randomChk !== 4 || randomChk !== 3) {
                    edge.tpsLevel = randomChk;
                } else {
                    edge.tpsLevel = null
                }
            }
        }, 5000);
    }

    // 애니메이션 종료
    cancelAnimate() {
        if (this.alarmAnimateHandle) {
            cancelAnimationFrame(this.alarmAnimateHandle);
        }
        if (this.tpsDrawAnimate) {
            cancelAnimationFrame(this.tpsDrawAnimate);
        }
    }

    randMinMax = function (min, max, round) {
        let val = min + (Math.random() * (max - min));

        if (round) val = Math.round(val);

        return val;
    };


    nodeDraw() {
        const nodes = this.topologyData.nodes;

        for (let ix = 0, ixLen = nodes.length; ix < ixLen; ix++) {
            const node = nodes[ix];

            // 마우스 위로 올라가면 true 변경
            node.inPointer = false;
            this.drawNode(node);
            // this.loop(node, this.ctxAnim);
            this.drawNodeLabel(node);
        }
        // treeBox 디버깅 용도
        // this.debuggerTreeBox(this.nodeSceneTree);
    }

    edgeDraw() {
        const edges = this.topologyData.edges;

        for (let ix = 0, ixLen = edges.length; ix < ixLen; ix++) {
            const edge = edges[ix];

            this.drawArrowEdge(
                edge,
                Utils.getNodes(edge.source || edge.fromId),
                Utils.getNodes(edge.target || edge.toId),
            );
            // EdgeLabels.drawArrowEdgeLabel(edge,
            //     Utils.getNodes(edge.source),
            //     Utils.getNodes(edge.target),
            //     this.ctxScene);
        }
    }


    testData() {
        dataSet.randomData(Utils.getWidth(this.dom), Utils.getHeight(this.dom));
    }


    updateDraw(isResize) {
        if (isResize) {
            console.log("resize 발생");
        }
    }

    // alertEffect(radius = config.nodeSize) {
    //     let alarmColor = "#4D83AF";
    //     let alarmRadius = radius;
    //
    //     this.fpsNow = Date.now();
    //     this.delta = this.fpsNow - this.fpsThen;
    //     if (this.delta > this.fpsInterval && this.isDrawFrame) {
    //         this.ctxClear(this.ctxAnim);
    //
    //
    //         alarmRadius += 0.8;
    //
    //         for (let ix = 0; ix < this.topologyData.nodes.length; ix++) {
    //             const node = this.topologyData.nodes[ix];
    //             const scoreLevel = node.level;
    //
    //             // 레벨 값이 없으면 패스
    //             if (scoreLevel == null) {
    //                 continue;
    //             }
    //             // 점수가 0이면 정상이니까 알람 패스
    //             if (scoreLevel === env.healthIndicaterStateInfo[3].over) {
    //                 continue;
    //             }
    //
    //             const x = node.x;
    //             const y = node.y;
    //
    //             if (scoreLevel >= env.healthIndicaterStateInfo[0].over) {
    //                 alarmColor = "#B0413D";
    //             } else if (scoreLevel >= env.healthIndicaterStateInfo[1].over) {
    //                 alarmColor = "#B08139";
    //             } else if (scoreLevel > env.healthIndicaterStateInfo[2].over) {
    //                 alarmColor = "#64B87D";
    //             } else if (scoreLevel === env.healthIndicaterStateInfo[3].over) {
    //                 alarmColor = "#4D83AF";
    //             }
    //             this.alarmGradient =
    //                 this.ctxAnim.createRadialGradient(x, y,
    //                     node.size + 2,
    //                     x, y,
    //                     node.size + 10);
    //             this.alarmGradient.addColorStop(0, `rgba(${cUtil.hexToRgb(alarmColor)},${0.7})`);
    //             this.alarmGradient.addColorStop(0.2, `rgba(${cUtil.hexToRgb(alarmColor)},${0.5})`);
    //             this.alarmGradient.addColorStop(0.4, `rgba(${cUtil.hexToRgb(alarmColor)},${0.3})`);
    //             this.alarmGradient.addColorStop(0.8, `rgba(${cUtil.hexToRgb(alarmColor)},${0.1})`);
    //             this.alarmGradient.addColorStop(1, "transparent");
    //
    //             // draw the circle
    //             this.ctxAnim.beginPath();
    //             this.ctxAnim.arc(x, y, alarmRadius, 0, Math.PI * 2, false);
    //             this.ctxAnim.closePath();
    //
    //             this.ctxAnim.strokeStyle = this.alarmGradient;
    //             this.ctxAnim.lineWidth = 6;
    //             this.ctxAnim.stroke();
    //
    //             this.fpsThen = this.fpsNow - (this.delta % this.fpsInterval);
    //         }
    //     }
    //     if (alarmRadius >= config.nodeSize + 10) {
    //         this.ctxClear(this.ctxAnim);
    //         setTimeout(() => {
    //             const initRadius = config.nodeSize;
    //
    //             this.alarmAnimateHandle = window.requestAnimationFrame(
    //                 this.alertEffect.bind(this, initRadius));
    //         }, 500)
    //         ;
    //     } else {
    //         this.alarmAnimateHandle =
    //             window.requestAnimationFrame(this.alertEffect.bind(this, alarmRadius));
    //     }
    // }
}
