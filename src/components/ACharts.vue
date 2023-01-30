<template>
    <div class="w-50 px-2 py-2 d-flex align-center flex-column justify-end h-screen overflow-hidden">
        <div class="w-100 d-flex justify-end">
            <v-select v-model="rangeX" :hide-details="true" density="compact" item-title="label" item-value="value"
                style="max-width: 180px;" :items="[
                    { label: 'Current month', value: RangeX.CURRENT_MONTH },
                    { label: 'Current week', value: RangeX.CURRENT_WEEK },
                ]" variant="solo"></v-select>
        </div>

        <LineChart class="w-100" v-bind="lineChartProps" />
    </div>
</template>

<script lang="ts" setup>
import { Chart, registerables } from 'chart.js';
import { LineChart, useLineChart } from 'vue-chart-3';
import { computed, ref } from 'vue';
import { getFirstDayInMonth, getLastDayInMonth, getMonday, getSunday } from '@/utils/date';
import { useMonthStore } from '@/store/month';
import { useChart } from '@/composable/use_chart';
import { AntelopeRange } from '@/model/AntelopeRange';
import { formatSecondsToHhmmss } from '@/utils/number';

Chart.register(...registerables);

enum RangeX { CURRENT_MONTH, CURRENT_WEEK };

const monthStore = useMonthStore();

const today = new Date();

const rangeX = ref(RangeX.CURRENT_WEEK);

const firstDay = computed(() => {
    if (rangeX.value === RangeX.CURRENT_MONTH) return getFirstDayInMonth(today);
    return getMonday(today);
});

const lastDay = computed(() => {
    if (rangeX.value === RangeX.CURRENT_MONTH) return getLastDayInMonth(today);
    return getSunday(today);
});

const chartLines = computed(() => {
    if (!monthStore.month) return [];
    return [
        {
            label: 'Learning Spanish',
            data: monthStore.month.ranges as AntelopeRange[],
            borderColor: 'rgb(33, 150, 243)',
            tension: 0.4,
        }
    ];
})
const { chartData } = useChart(chartLines, firstDay, lastDay);

const { lineChartProps } = useLineChart({
    chartData,
    height: window.innerHeight - 60,
    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context: { raw: number }) => formatSecondsToHhmmss(context.raw as number),
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: number, _index: number) {
                        return formatSecondsToHhmmss(value);
                    }
                }
            }
        }
    }
});
</script>