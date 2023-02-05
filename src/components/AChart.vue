<template>
    <div class="w-50 px-2 py-2 d-flex align-center flex-column justify-end h-screen overflow-hidden">
        <LineChart v-if="!hideChart" class="w-100" v-bind="lineChartProps" />
    </div>
</template>

<script lang="ts" setup>
import { Chart, registerables } from 'chart.js';
import { LineChart, useLineChart } from 'vue-chart-3';
import { computed, ComputedRef, ref, watch } from 'vue';
import { getFirstDayInMonth, getLastDayInMonth, getSecondsFromTimeString } from '@/utils/date';
import { useMonthStore } from '@/store/month';
import { useSectionStore } from '@/store/section';
import { AntelopeRange } from '@/model/AntelopeRange';
import { formatSecondsToHhmmss } from '@/utils/number';
import { useQuery } from '@/composable/use_query';
import { Day } from '@/model/Day';

Chart.register(...registerables);

const monthStore = useMonthStore();
const sectionStore = useSectionStore();
const { getStringQueryParam } = useQuery();

const ranges = computed<AntelopeRange[]>(() => (monthStore.month?.ranges as AntelopeRange[]) ?? []);

const sectionId: ComputedRef<string> = getStringQueryParam('section');
const monthParam: ComputedRef<string> = getStringQueryParam('month');

// Because the chart.js package has problem to rerender a component
// when one of the datasets is changed.
const hideChart = ref<boolean>(false);
const handleRerender = () => {
    hideChart.value = true;
    setTimeout(() => { hideChart.value = false }, 50);
}
watch(sectionId, handleRerender);

const month = computed<Date>(() => {
    if (!/[0-9]{6}/.test(monthParam.value)) return new Date();
    const m = monthParam.value.slice(0, 2);
    const y = monthParam.value.slice(2);
    return new Date(`${y}-${m}-01`);
});

const firstDay = computed(() => getFirstDayInMonth(month.value));

const lastDay = computed(() => getLastDayInMonth(month.value));

const currentSection = computed(() => sectionStore.sections.find((s) => s.id === sectionId.value));

const sectionName = computed<string>(() => currentSection.value?.name || 'Unknown')

const getMonthXLabel = (date: Date): string => `${date.getDate()}. ${date.getMonth() + 1}.`;

const datesInMonth = computed<Date[]>(() => {
    const dates = [];
    const currentDate = new Date(firstDay.value);
    while (currentDate <= lastDay.value) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
});

const chartLabels = computed<string[]>(() => datesInMonth.value
    .map((date) => getMonthXLabel(date)));

const getDayTimeMap = (): Map<string, number> => {
    const map = new Map<string, number>();
    datesInMonth.value.forEach((date: Date) => {
        const label = getMonthXLabel(date);
        map.set(label, 0);
    });
    return map;
};

const sectionData = computed<number[]>(() => {
    const map = getDayTimeMap();
    ranges.value.forEach((range) => {
        const key = getMonthXLabel(range.startDate);
        const value = (map.get(key) || 0) + range.secondsDiff;
        map.set(key, value);
    });
    return Array.from(map.values());
});

const sectionGoalData = computed<number[]>(() => {
    const map = getDayTimeMap();
    if (!currentSection.value?.goals) return [];
    const { days, time } = currentSection.value.goals;
    const timeInSeconds = getSecondsFromTimeString(time);
    datesInMonth.value.forEach((date: Date) => {
        const shouldApplyGoal = days
            .some((day: Day) => {
                const isSunday = day === Day.SUNDAY;
                if (isSunday) return date.getDay() === 0;
                return day === date.getDay()
            });
        const key = getMonthXLabel(date);
        const value = shouldApplyGoal ? timeInSeconds : 0;
        map.set(key, value);
    });
    return Array.from(map.values());
});

const chartData = computed(() => {
    const datasets = [
        {
            label: sectionName.value,
            data: sectionData.value,
            borderColor: 'rgb(33, 150, 243)',
            tension: 0.1,
        }
    ];
    if (sectionGoalData.value.length) datasets.push({
        label: `${sectionName.value} Goal`,
        data: sectionGoalData.value,
        borderColor: 'rgb(207, 102, 121)',
        tension: 0.1,
    });
    return {
        labels: chartLabels.value,
        datasets,
    }
});

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