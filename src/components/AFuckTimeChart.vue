<template>
    <div class="d-flex justify-center align-center">
        <div class="w-100" style="max-width: 600px">
            <v-card class="px-6 py-6 w-100">
                <BarChart v-bind="barChartProps" />
                <v-card-actions>
                    <v-btn @click="$emit('update:visible', false)">Close</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Chart, registerables } from 'chart.js';
import { Time } from '@/composable/use_fuck_time';
import { PropType, computed } from 'vue';
import { BarChart, useBarChart } from 'vue-chart-3';
import randomcolor from "randomcolor";
import { formatSecondsToHhmmss } from '@/utils/number';

Chart.register(...registerables);

defineEmits(['update:visible']);

const props = defineProps({
    times: { required: true, type: Array as PropType<Array<Time>> }
});

const chartData = computed(() => {
    const labels = [
        ...props.times.map((time) => time.sectionName),
        'Prejebaný čas'
    ];
    const spendTime = props.times.reduce((acc, time) => acc + time.timeSpendInSeconds, 0);
    const data = [
        ...props.times.map((time) => time.timeSpendInSeconds),
        (24 * 60 * 60 - spendTime)
    ]
    const backgroundColor = [
        ...labels.map((_) => randomcolor({ luminosity: 'light' })),
        randomcolor({ luminosity: 'dark' }),
    ];
    return {
        labels,
        datasets: [
            {
                data, backgroundColor
            },
        ],
    }
});

const { barChartProps } = useBarChart({
    chartData,
    options: {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Dnešný prejebaný čas'
            },
            tooltip: {
                callbacks: {
                    label: (context: { raw: number }) => formatSecondsToHhmmss(context.raw as number),
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: number, _index: number) {
                        return formatSecondsToHhmmss(value);
                    }
                }
            }
        }
    },
});
</script>