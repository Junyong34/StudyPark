import VueChart from 'vue-chartjs';
// import { Line } from 'vue-chartjs'
import Vue from 'vue';

const getRandomColor = useAlpha => {
    return "#" + Math.random().toString(16).slice(2, useAlpha ? 10 : 8);
};

const getCustomTimeString = (d) => {
    return d.toLocaleTimeString().match(/:(\d+:\d+)/)[1].padStart(5, '0');
};

const getRandomLabel = (() => {
    const alphabat = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return (n) => {
        let ret = '';
        const len = alphabat.length;
        for(let i = 0; i < n; i++){
            ret += alphabat[Math.random()*len|0];
        }
        return ret;
    }
})();

const optionMixin = (opt1, opt2) => {
    // TODO - mixin logic
    return opt1;
};


export default (name, type, data, option) => {
    const chart = {
        extends: VueChart[type],
        mounted() {
            option = optionMixin(option, this.option);
            this.renderChart(data || {
                labels: (() => {
                    let ret = [];
                    for (let i = 0; i < 24; i++) {
                        ret.push((i + '').padStart(2, '0') + ':00');
                    }
                    return ret;
                })(),
                datasets: (() => {
                    const ret = [];
                    for (let i = 0; i < 20; i++) {
                        let data = [];
                        let color = getRandomColor(false);
                        let label = getRandomLabel(7);
                        for (let d = 0; d < 24; d++) {
                            data.push(Math.random() * 100 | 0);
                        }
                        ret.push({
                            label: label,
                            borderColor: color,
                            backgroundColor: color + 'aa',
                            hoverBackgroundColor: color,
                            pointRadius: 2,
                            pointHoverRadius: 2,
                            // pointBorderColor : color,
                            pointBackgroundColor: color,
                            pointHoverBackgroundColor: color,
                            data: data,
                        });
                    }
                    return ret;
                })(),
            },
            option || {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: true
                        },
                        stacked: true,
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        stacked: true,
                        barPercentage: 1.25,
                    }]
                },
                legend: {
                    display: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
            });
        }
    };
    return Vue.component(name, chart);
}
