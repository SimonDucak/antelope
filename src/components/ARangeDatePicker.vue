<template>
    <div class="d-flex flex-column align-center">
        <div class="d-flex align-center mb-3">
            <v-text-field :value="startDateValue" @update:model-value="setStartDate" hide-details class="mr-2 mb-0"
                variant="solo" type="date"></v-text-field>
            <v-text-field v-model="startTime" hide-details class="mr-2 mb-0" placeholder="00:00" variant="solo"
                type="time"></v-text-field>
            <span class="mr-2">-</span>
            <v-text-field :value="endDateValue" @update:model-value="setEndDate" hide-details class="mr-2 mb-0"
                variant="solo" type="date"></v-text-field>
            <v-text-field v-model="endTime" hide-details class="mb-0" placeholder="00:00" variant="solo"
                type="time"></v-text-field>
        </div>
        <p class="body-text-2 mb-3">{{ hhmmss }}</p>
        <v-btn color="success" @click="save">Save Time</v-btn>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { formatSecondsToHhmmss, pad } from '@/utils/number';
import { useDateInput } from "@/composable/use_date_input";
import { getSecondsBetweenTwoDates } from "@/utils/date";
import { AntelopeRange } from "@/model/AntelopeRange";

const emit = defineEmits(['update:value']);

const today = new Date();

const { inputValue: startDateValue, setDate: setStartDate, date: startDate } = useDateInput(today);
const { inputValue: endDateValue, setDate: setEndDate, date: endDate } = useDateInput(today);
const startTime = ref<string>(`${pad(today.getHours())}:00`);
const endTime = ref<string>(`${pad(today.getHours())}:00`);

const getFinalDate = (d: Date, time: string): Date => {
    const date = new Date(d);
    date.setSeconds(0);
    const [hours, minutes] = time.split(':');
    date.setHours(+hours);
    date.setMinutes(+minutes)
    return date;
}

const finalStartDate = computed<Date>(() => getFinalDate(startDate.value, startTime.value));
const finalEndDate = computed<Date>(() => getFinalDate(endDate.value, endTime.value));

const hhmmss = computed<string>(() => {
    const seconds = getSecondsBetweenTwoDates(finalStartDate.value, finalEndDate.value);
    return formatSecondsToHhmmss(seconds);
})

const save = () => {
    const range = new AntelopeRange(finalStartDate.value, finalEndDate.value);
    emit('update:value', range);
    startDate.value = today;
    endDate.value = today;
    startTime.value = `${pad(today.getHours())}:00`;
    endTime.value = `${pad(today.getHours())}:00`;
}
</script>