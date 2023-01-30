<template>
    <v-table class="w-100">
        <thead>
            <tr>
                <th class="text-left">#</th>
                <ATableHeadSort v-model:method="sortMethod" v-model:type="sortType"
                    :component-type="SortType.START_DATE">Start Date</ATableHeadSort>
                <ATableHeadSort v-model:method="sortMethod" v-model:type="sortType" :component-type="SortType.END_DATE">
                    End Date</ATableHeadSort>
                <ATableHeadSort v-model:method="sortMethod" v-model:type="sortType" :component-type="SortType.TIME">Time
                </ATableHeadSort>
                <th class="text-left"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(range, index) in sortedRanges" :key="index + 1">
                <td>#{{ index + 1 }}</td>
                <td>{{ getTheTrueFortmatOfDate(range.startDate) }}</td>
                <td>{{ getTheTrueFortmatOfDate(range.endDate) }}</td>
                <td>{{ range.hhmmss }}</td>
                <td>
                    <v-btn @click="removeRange(range)" icon="mdi-close" size="x-small" color="error"></v-btn>
                </td>
            </tr>

            <tr v-if="sortedRanges.length > 1">
                <td><strong>Total</strong></td>
                <td></td>
                <td></td>
                <td class="text-success">
                    <strong>{{ totalHhmmss }}</strong>
                </td>
                <td></td>
            </tr>
        </tbody>
    </v-table>
</template>

<script lang="ts" setup>
import { AntelopeRange } from "@/model/AntelopeRange";
import { getTheTrueFortmatOfDate } from "@/utils/date";
import { PropType, ref, computed } from "vue";
import ATableHeadSort from "@/components/ATableHeadSort.vue";
import { formatSecondsToHhmmss } from "@/utils/number";

const emit = defineEmits(['update:removed']);

const props = defineProps({
    ranges: {
        required: true,
        type: Array as PropType<AntelopeRange[]>
    }
});

enum SortType {
    START_DATE,
    END_DATE,
    TIME,
}

enum SortMethod {
    ASC,
    DSC
}

const sortType = ref<SortType>(SortType.START_DATE);
const sortMethod = ref<SortMethod>(SortMethod.DSC);

const removeRange = (range: AntelopeRange) => {
    emit('update:removed', range);
}

const sortAsc = (numberA: number, numberB: number): number => {
    if (numberA > numberB) return 1;
    if (numberA < numberB) return -1;
    return 0;
}

const sortDsc = (numberA: number, numberB: number): number => {
    if (numberA < numberB) return 1;
    if (numberA > numberB) return -1;
    return 0;
}

const resolveSort = (numberA: number, numberB: number): number => {
    return sortMethod.value === SortMethod.ASC ? sortAsc(numberA, numberB) : sortDsc(numberA, numberB);
}

const sortedRanges = computed<AntelopeRange[]>(() => {
    if (sortType.value === SortType.START_DATE) {
        return props.ranges
            .sort((rangeA, rangeB) => resolveSort(rangeA.startDate.getTime(), rangeB.startDate.getTime()))
    }
    if (sortType.value === SortType.END_DATE) {
        return props.ranges
            .sort((rangeA, rangeB) => resolveSort(rangeA.endDate.getTime(), rangeB.endDate.getTime()))
    }
    if (sortType.value === SortType.TIME) {
        return props.ranges
            .sort((rangeA, rangeB) => resolveSort(rangeA.secondsDiff, rangeB.secondsDiff))
    }
    return props.ranges;
});

const totalHhmmss = computed<string>(() => {
    const totalSeconds: number = sortedRanges.value
        .reduce((acc, nextRange) => {
            acc += nextRange.secondsDiff;
            return acc;
        }, 0);
    return formatSecondsToHhmmss(totalSeconds);
});
</script>