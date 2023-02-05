<template>
    <div class="w-50 d-flex flex-column align-center h-screen overflow-auto border-r">
        <div v-if="isRunning" class="w-100 h-100 d-flex align-center justify-center">
            <v-progress-circular indeterminate color="success"></v-progress-circular>
        </div>

        <div v-if="!isRunning && !noSection" class="w-100 d-flex flex-column align-center">
            <!-- Section header -->
            <div v-if="foundSection" class="border-b w-100 px-2 py-2 d-flex justify-space-between align-center"
                :border="true" style="height: 65px">
                <h4 v-if="foundSection" class="text-h6">{{ foundSection.name }}</h4>

                <div class="d-flex">
                    <v-text-field :value="selectedMonthInputValue" @update:model-value="setMonth" :hide-details="true"
                        density="compact" variant="solo" type="month" />
                </div>
            </div>

            <!-- Toolbar -->
            <div v-if="foundSection" class="border-b w-100 px-2 py-2 d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                    <v-btn size="x-small" color="warning" class="mr-2">
                        Edit section
                        <v-dialog transition="dialog-bottom-transition" v-model="editSectionModalVisible"
                            activator="parent">
                            <UpdateSectionForm v-model:visible="editSectionModalVisible"
                                :update-section="foundSection" />
                        </v-dialog>
                    </v-btn>
                    <v-btn @click="" class="mr-2" color="error" size="x-small">
                        Delete Section
                        <v-dialog activator="parent" transition="dialog-bottom-transition"
                            v-model="deleteConfirmModalVisible">
                            <AConfirmModal v-model:visible="deleteConfirmModalVisible" :confirm="deleteSection">
                                <template #title>
                                    Delete section
                                </template>
                                <template #text>
                                    Are you sure you want to delete this section?
                                    This action cannot be undone.
                                </template>
                            </AConfirmModal>
                        </v-dialog>
                    </v-btn>
                    <v-btn size="x-small" :color="foundSection.goals ? 'info' : 'success'" class="mr-2">
                        {{ foundSection.goals ? 'Edit goals' : 'Set goals' }}
                        <v-dialog transition="dialog-bottom-transition" v-model="setGoalsModalVisible"
                            activator="parent">
                            <ASetGoals v-model:visible="setGoalsModalVisible" :section="foundSection" />
                        </v-dialog>
                    </v-btn>
                </div>

                <div class="text-body-2">
                    <small>{{ goalLabel }}</small>
                </div>
            </div>

            <!-- Time Range Picker -->
            <div class="time-picker-wrapper border-b w-100 py-10 px-10 d-flex flex-column align-center justify-center"
                style="min-height: 280px">
                <ATimeRangePicker @update:value="addRange" />
            </div>

            <!-- Range table -->
            <ARangeTable @update:removed="monthStore.deleteRange($event, sectionId)"
                :ranges="(monthStore.month?.ranges as AntelopeRange[]) ?? []" />
        </div>

        <div v-if="!isRunning && noSection" class="w-100 h-100 d-flex align-center justify-center">
            <p class="text-body-1">
                Please select or create a section to view the logger.
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue"
import ATimeRangePicker from "@/components/ATimeRangePicker.vue";
import { AntelopeRange } from "@/model/AntelopeRange";
import ARangeTable from "@/components/ARangeTable.vue";
import { useRouter } from "vue-router";
import { useTask } from "@/composable/use_task";
import { useMonthStore } from "@/store/month";
import { AntelopeMonth } from '@/model/AntelopeMonth';
import { useSectionStore } from "@/store/section";
import { AntelopeSection } from "@/model/AntelopeSection";
import { useDateInput } from "@/composable/use_date_input";
import UpdateSectionForm from "@/components/AUpsertSectionForm.vue";
import ASetGoals from "@/components/ASetGoals.vue";
import { Day, dayOptions } from "@/model/Day";
import AConfirmModal from "./AConfirmModal.vue";
import { pad } from "@/utils/number";

const { currentRoute, push } = useRouter();
const monthStore = useMonthStore();
const sectionStore = useSectionStore();

const editSectionModalVisible = ref<boolean>(false);
const setGoalsModalVisible = ref<boolean>(false);
const deleteConfirmModalVisible = ref<boolean>(false);

const sectionId = computed<string>(() => {
    const sectionId = currentRoute.value?.query?.section
    if (!sectionId || typeof sectionId !== 'string') return '';
    return sectionId
});
const monthId = computed<string>(() => {
    const { month } = currentRoute.value.query;
    if (!month || typeof month !== 'string') return AntelopeMonth.getMonthId(new Date());
    return month;
});
const selectedMonthInputValue = computed<string>(() => {
    const date = AntelopeMonth.getDateFromMonthId(monthId.value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
})
const noSection = computed<boolean>(() => !sectionId.value.length);
const foundSection = computed<AntelopeSection | undefined>(() => sectionStore.sections
    .find(s => s.id === sectionId.value) as AntelopeSection | undefined);
const goalLabel = computed<string>(() => {
    if (!foundSection.value?.goals) return '';
    const { days, time } = foundSection.value.goals;
    if (days.length === 7) return `Daily - ${time}h`;
    if (days.length === 2 && days.includes(Day.SATURDAY) && days.includes(Day.SUNDAY)) return `Weekend - ${time}h`;
    if (days.length === 5 && !days.includes(Day.SATURDAY) && !days.includes(Day.SUNDAY)) return `Weekdays - ${time}h`;
    const daysLabels = days.map((day: Day) => {
        const dayLabel = dayOptions.find(d => d.value === day)?.label || '';
        return dayLabel.slice(0, 3).toUpperCase();
    });
    return `${daysLabels.join(', ')} - ${time}h`;
});

const { perform, isRunning } = useTask(async () => {
    try {
        if (noSection.value) return;
        await monthStore.resolveMonth(monthId.value, sectionId.value)
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

const deleteSection = async () => {
    try {
        if (!foundSection.value) return;
        await sectionStore.archiveSection(foundSection.value);
        push({ path: '/dashboard' });
    } catch (err) {
        console.log(err);
    }
}

const addRange = async (range: AntelopeRange) => {
    if (!foundSection.value) return;
    monthStore.addRange(range, foundSection.value.id)
}

const setMonth = (value: string) => {
    const reg = /[0-9]{4}-[0-9]{2}/;
    if (!reg.test(value)) return;
    const [year, month] = value.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    push({
        path: `/dashboard`,
        query: {
            section: sectionId.value,
            month: AntelopeMonth.getMonthId(date)
        }
    });
}

watch(() => currentRoute.value, () => {
    perform();
}, { deep: true, immediate: true });
</script>
