import { AntelopeRange } from '@/model/AntelopeRange';
import { computed, ComputedRef, Ref } from 'vue';

export interface ChartLine {
    label: string;
    data: AntelopeRange[];
    borderColor: string;
    tension: number;
}

export type ChartDataset = Omit<ChartLine, 'data'> & { data: number[] }; 

export interface ChartProp {
    labels: string[];
    datasets: ChartDataset[];
}

export type reactive<T> = ComputedRef<T> | Ref<T>;

export const useChart = (
    lines: Ref<ChartLine[]>,
    pfirstDate?: reactive<Date>,
    pLastDate?: reactive<Date>,
) => {
    const getMonthXLabel = (date: Date): string => `${date.getDate()}. ${date.getMonth() + 1}.`;
    
    const flattenRanges = computed<AntelopeRange[]>(() => {
        const rangesChunks = lines.value.map((line) => line.data);
        return rangesChunks.flat();
    });

    const flattenTimes = computed<number[]>(() => flattenRanges.value
        .map((range) => range.startDate.getTime()));

    const firstDate = computed<Date>(() => pfirstDate?.value ?? new Date(Math.min(...flattenTimes.value)));

    const lastDate = computed<Date>(() => pLastDate?.value ?? new Date(Math.max(...flattenTimes.value)));

    const datesRange = computed<Date[]>(() => {
        const dates = [];
        const currentDate = new Date(firstDate.value);
        dates.push(new Date(currentDate));
        while (currentDate <= lastDate.value) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    });

    const chartLabels = computed<string[]>(() => datesRange.value.map((date) => getMonthXLabel(date)));

    const getDayTimeMap = (): Map<string, number> => {
        const map = new Map<string, number>();
        datesRange.value.forEach((date: Date) => {
            const label = getMonthXLabel(date);
            map.set(label, 0);
        });
        return map;
    };

    const getLineData = (line: ChartLine): number[] => {
        const map = getDayTimeMap();
        line.data.forEach((range) => {
            const key = getMonthXLabel(range.startDate);
            const value = (map.get(key) || 0) + range.secondsDiff;
            map.set(key, value);
        });
        return Array.from(map.values());
    };

    const mapLineToDataset = (line: ChartLine): ChartDataset => {
        return {
            label: line.label,
            data: getLineData(line),
            borderColor: line.borderColor,
            tension: line.tension || 0.4,
        };
    }

    const chartData = computed<ChartProp>(() => ({
        labels: chartLabels.value,
        datasets: lines.value.map(mapLineToDataset),
    }));

    return {
        chartData,
        flattenRanges,
        flattenTimes,
        firstDate,
        lastDate,
        datesRange,
        chartLabels,
        getMonthXLabel,
        getDayTimeMap,
        getLineData,
        mapLineToDataset,
    };
}