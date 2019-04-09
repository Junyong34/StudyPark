import config from "../utils/topologyConfig";
import env from "@/env/config";
import cUtil from "@/common/commonUtil";

const k8sEffect = {

    alertEffect(radius = config.nodeSize) {
        let alarmColor = "#4D83AF";
        let alarmRadius = radius;

        this.fpsNow = Date.now();
        this.delta = this.fpsNow - this.fpsThen;
        if (this.delta > this.fpsInterval && this.isDrawFrame) {
            this.ctxClear(this.ctxAnim);


            alarmRadius += 0.8;

            for (let ix = 0; ix < this.topologyData.nodes.length; ix++) {
                const node = this.topologyData.nodes[ix];
                const scoreLevel = node.level;

                // 레벨 값이 없으면 패스
                if (scoreLevel == null) {
                    continue;
                }
                // 점수가 0이면 정상이니까 알람 패스
                if (scoreLevel === env.healthIndicaterStateInfo[3].over) {
                    continue;
                }

                const x = node.x;
                const y = node.y;

                if (scoreLevel >= env.healthIndicaterStateInfo[0].over) {
                    alarmColor = "#B0413D";
                } else if (scoreLevel >= env.healthIndicaterStateInfo[1].over) {
                    alarmColor = "#B08139";
                } else if (scoreLevel > env.healthIndicaterStateInfo[2].over) {
                    alarmColor = "#64B87D";
                } else if (scoreLevel === env.healthIndicaterStateInfo[3].over) {
                    alarmColor = "#4D83AF";
                }
                this.alarmGradient =
                    this.ctxAnim.createRadialGradient(x, y,
                        node.size + 2,
                        x, y,
                        node.size + 10);
                this.alarmGradient.addColorStop(0, `rgba(${cUtil.hexToRgb(alarmColor)},${0.7})`);
                this.alarmGradient.addColorStop(0.2, `rgba(${cUtil.hexToRgb(alarmColor)},${0.5})`);
                this.alarmGradient.addColorStop(0.4, `rgba(${cUtil.hexToRgb(alarmColor)},${0.3})`);
                this.alarmGradient.addColorStop(0.8, `rgba(${cUtil.hexToRgb(alarmColor)},${0.1})`);
                this.alarmGradient.addColorStop(1, "transparent");

                // draw the circle
                this.ctxAnim.beginPath();
                this.ctxAnim.arc(x, y, alarmRadius, 0, Math.PI * 2, false);
                this.ctxAnim.closePath();

                this.ctxAnim.strokeStyle = this.alarmGradient;
                this.ctxAnim.lineWidth = 6;
                this.ctxAnim.stroke();

                this.fpsThen = this.fpsNow - (this.delta % this.fpsInterval);
            }
        }
        if (alarmRadius >= config.nodeSize + 10) {
            this.ctxClear(this.ctxAnim);
            setTimeout(() => {
                const initRadius = config.nodeSize;

                this.alarmAnimateHandle = window.requestAnimationFrame(
                    this.alertEffect.bind(this, initRadius));
            }, 500)
            ;
        } else {
            this.alarmAnimateHandle =
                window.requestAnimationFrame(this.alertEffect.bind(this, alarmRadius));
        }
    },
    LineTpsEffect(startValue) {
        let index = startValue;

        this.ballColor = null;
        this.ballPos = null;


        this.lineFPS.now = Date.now();
        this.deltaLine = this.lineFPS.now - this.lineFPS.then;

        if (this.deltaLine > this.lineFPS.interval && this.isDrawFrame) {
            this.ctxClear(this.ctxTpsEffect);
            for (let ix = 0; ix < this.topologyData.edges.length; ix++) {
                const edge = this.topologyData.edges[ix];
                const tpsLevel = edge.tpsLevel;

                // 레벨 값이 없으면 패스
                if (tpsLevel == null) {
                    continue;
                }


                if (edge.isCurve) {
                    this.ballPos = this.getCurvedLinePosIndex(edge, index);
                } else {
                    this.ballPos = this.getRelationLinePosIndex(edge, index);
                }


                if (tpsLevel === 0) {
                    this.ballColor = this.normalBall;
                } else if (tpsLevel === 1) {
                    this.ballColor = this.warningBall;
                } else {
                    this.ballColor = this.criticalBall;
                }

                this.ctxTpsEffect.beginPath();
                this.ctxTpsEffect.arc(
                    this.ballPos[0],
                    this.ballPos[1],
                    3 * this.ballZoomRate,
                    0,
                    2 * Math.PI,
                );
                this.ctxTpsEffect.lineWidth = 3;
                this.ctxTpsEffect.strokeStyle = this.ballColor;
                this.ctxTpsEffect.globalAlpha = 0.4;
                this.ctxTpsEffect.stroke();
                this.ctxTpsEffect.closePath();

                // if (index % 20 > 10) {
                    this.ctxTpsEffect.fillStyle = this.ballColor;
                    this.ctxTpsEffect.globalAlpha = 1;
                // } else {
                //     this.ctxTpsEffect.fillStyle = "#FFFFFF";
                //     this.ctxTpsEffect.globalAlpha = 0.4;
                // }

                // this.ctxTpsEffect.fillStyle = (index % 20 > 10) ? this.ballColor : "#FFFFFF";
                // this.ctxTpsEffect.fillStyle = this.ballColor;

                this.ctxTpsEffect.fill();
            }

            this.lineFPS.then = this.lineFPS.now - (this.deltaLine % this.lineFPS.interval);
        }
        index++;

        if (index > this.linePositionLength) {
            index = 0;
            setTimeout(stValue => {
                this.tpsDrawAnimate = window.requestAnimationFrame(
                    this.LineTpsEffect.bind(this, stValue));
            }, 100, index);
        } else {
            this.tpsDrawAnimate = window.requestAnimationFrame(
                this.LineTpsEffect.bind(this, index));
        }
    },

    getRelationLinePosIndex(edge, index) {
        const sNode = this.topologyData.nodesIndex[edge.source];
        const eNode = this.topologyData.nodesIndex[edge.target];
        const dx = eNode.x - sNode.x; // 밑변길이
        const dy = eNode.y - sNode.y; // 높이길이
        const vAngle = Math.sqrt(dx * dx) + (dy * dy); // 빗변길이
        const percent = index / this.linePositionLength;

        const x = (dx / vAngle * (vAngle * percent)) + sNode.x;
        const y = (dy / vAngle * (vAngle * percent)) + sNode.y;

        return [x, y];
    },

    getCurvedLinePosIndex(line, index) {
        const cpx = line.sx + (line.ex - line.sx) / 2; // control point X
        const cpy = line.ey - 20 - (line.ey - line.sy) / 2 - 20; // control point Y
        const percent = index / this.linePositionLength;

        const x = (Math.pow(1 - percent, 2) * line.sx + 2 *
            (1 - percent) * percent * cpx + Math.pow(percent, 2) * line.ex);
        const y = (Math.pow(1 - percent, 2) * line.sy + 2 *
            (1 - percent) * percent * cpy + Math.pow(percent, 2) * line.ey);

        return [x, y];
    },


};

export default k8sEffect;
