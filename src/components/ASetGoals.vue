<template>
    <div class="d-flex justify-center align-center">
        <div class="w-100" style="max-width: 760px">
            <v-card class="px-6 py-6 w-100">
                <h3 class="text-h5 mb-6">
                    <template v-if="!section.goals">Set Goals</template>
                    <template v-else>Edit Goals</template>
                </h3>

                <v-alert v-if="validationsVisible && errorText" density="compact" class="mb-3" type="error">{{
                    errorText
                }}</v-alert>

                <p class="text-body-2 mb-2">
                    Please select the days you want to set goals for
                </p>

                <div class="d-flex">
                    <v-btn @click="selectWeekDays" variant="tonal" class="mr-2" size="small">Weekdays</v-btn>
                    <v-btn @click="selectWeekend" variant="tonal" class="mr-2" size="small">Weekend</v-btn>
                    <v-btn @click="toggleDays" variant="tonal" size="small">Toggle</v-btn>
                </div>

                <div class="d-flex justify-start align-start">
                    <v-checkbox v-for="option in dayOptions" :value="option.value" :key="option.value"
                        :label="option.label" v-model="goals.days" :hide-details="true"></v-checkbox>
                </div>

                <p class="text-body-2 mb-3">
                    Please enter a time how long you want to spend
                </p>

                <v-text-field v-model="goals.time" type="time" placeholder="1h 30m" label="Time" variant="outlined" />

                <v-card-actions>
                    <v-btn @click="perform" :loading="isRunning" :disabled="isRunning || isReseting" color="success">
                        <template v-if="!section.goals">Set Goals</template>
                        <template v-else>Edit Goals</template>
                    </v-btn>
                    <v-btn v-if="!!section.goals" @click="resetGoals" :disabled="isRunning || isReseting"
                        :loading="isReseting" color="error">
                        Reset Goals
                    </v-btn>
                    <v-btn @click="$emit('update:visible', false)">Close</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AntelopeSection } from '@/model/AntelopeSection';
import { PropType, ref } from 'vue';
import { dayOptions } from '@/model/Day';
import { computed } from '@vue/reactivity';
import { isTimeStringValid } from '@/utils/date';
import { useTask } from '@/composable/use_task';
import { useSectionStore } from '@/store/section';
import { useGoalStore } from '@/store/goal';
import { AntelopeGoal } from '@/model/AntelopeGoal';
import { compareNumberArrays } from '@/utils/compare';

const props = defineProps({
    visible: { required: false, type: Boolean as PropType<boolean> },
    section: { required: true, type: Object as PropType<AntelopeSection> }
});

const emit = defineEmits(['update:visible']);

const sectionStore = useSectionStore();
const goalStore = useGoalStore();

const goals = ref<AntelopeGoal>(new AntelopeGoal(
    props.section?.goals?.time ?? '00:00',
    props.section?.goals?.days ?? []
));
const validationsVisible = ref<boolean>(false);

const selectWeekDays = () => {
    goals.value.days = dayOptions.slice(0, 5)
        .map(option => option.value);
};

const selectWeekend = () => {
    goals.value.days = dayOptions.slice(5)
        .map(option => option.value);
};

const toggleDays = () => {
    if (goals.value.days.length) goals.value.days = [];
    else goals.value.days = dayOptions.map(option => option.value);
};

const errorText = computed<string>(() => {
    const time = goals.value.time;
    const days = goals.value.days;
    if (!days.length) return 'Please select at least one day';
    if (!time) return 'Please enter a time';
    if (!isTimeStringValid(time)) return 'Please enter a valid time';
    if (time === '00:00') return 'Please enter a time greater than 00:00';
    const currentGoals = props.section.goals;
    if (currentGoals) {
        const { days: currentDays, time: currentTime } = currentGoals;
        if (time === currentTime && compareNumberArrays(currentDays, days))
            return 'Current goal is same!';
    }
    return '';
});

const { isRunning: isReseting, perform: resetGoals } = useTask(async () => {
    try {
        const sectionCopy = AntelopeSection.duplicateSection(props.section);
        await sectionStore.resetGoals(sectionCopy);
        emit('update:visible', false);
    } catch (err) {
        console.log(err);
    }
})

const { isRunning, perform } = useTask(async () => {
    try {
        if (errorText.value.length) return validationsVisible.value = true;
        const sectionCopy = AntelopeSection.duplicateSection(props.section);
        sectionCopy.goals = goals.value as AntelopeGoal;
        if (props.section.goals) await goalStore
            .archiveGoal(props.section.goals as AntelopeGoal, props.section.id);
        await sectionStore.setGoals(sectionCopy);
        emit('update:visible', false);
    } catch (err) {
        console.log(err);
    }
})
</script>