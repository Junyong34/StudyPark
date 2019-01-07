<style>
    .half-world{
        position: absolute;
        display: block;
        width: 50%;
        height: 100%;
    }
</style>
<template>
    <div>
        <div class="half-world">
            <StackLineChart0 />
            <HStackBarChart0 />
            <StackBarChart0 />
        </div>
        <div style="position:relative; left:50%; top:0px;" class="half-world">
            <HBarChart0 />
            <BarChart0 />
            <LineChart0 />
        </div>
    </div>
</template>
<script>
    import VueChart from './Chart.js';
    const nonStackOption = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                },
                gridLines: {
                    display: true
                },
                stacked: false,
            }],
                xAxes: [{
                gridLines: {
                    display: false
                },
                stacked: false,
                barPercentage: 1.25,
            }]
        },
        legend: {
            display: false,
        },
        responsive: true,
            maintainAspectRatio: false,
        animation: false,
    }

    const StackBarChart0 = VueChart('stackBar0', 'Bar');
    const BarChart0 = VueChart('bar0', 'Bar', null, nonStackOption);
    const StackLineChart0 = VueChart('stackLine0', 'Line');
    const LineChart0 = VueChart('line0', 'Line', null, nonStackOption);
    const HStackBarChart0 = VueChart('hStackBar0', 'HorizontalBar');
    const HBarChart0 = VueChart('hBar0', 'HorizontalBar', null, nonStackOption);

    export  default {
        name: 'Test',
        components:{
            StackBarChart0,
            BarChart0,
            StackLineChart0,
            LineChart0,
            HStackBarChart0,
            HBarChart0,
        },
        methods: {
        },
    }
</script>
