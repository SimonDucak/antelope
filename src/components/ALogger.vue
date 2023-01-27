<template>
    <div class="w-50 d-flex flex-column align-center h-screen overflow-auto border-r">
        <div v-if="isRunning" class="w-100 h-100 d-flex align-center justify-center">
            <v-progress-circular indeterminate color="success"></v-progress-circular>
        </div>

        <div v-if="!isRunning && !noSection" class="w-100 d-flex flex-column align-center">
            <!-- Section header -->
            <n-list-item v-if="foundSection" class="border-b w-100 px-2 py-2 d-flex justify-space-between align-center"
                :border="true">
                <h4 class="text-body-1">{{ foundSection.name }}</h4>

                <div class="d-flex">
                    <v-text-field :value="selectedDateValue" @update:model-value="setDate" class="mr-2" type="date"
                        :hide-details="true" density="compact" variant="solo" />

                    <v-select v-model="filterType" :hide-details="true" density="compact" item-title="label"
                        item-value="value" style="max-width: 180px;" :items="[
                            { label: 'Only day', value: FilterType.ONLY_DAY },
                            { label: 'Month', value: FilterType.MONTH },
                        ]" variant="solo"></v-select>
                </div>
            </n-list-item>

            <!-- Time Range Picker -->
            <div class="border-b w-100 py-10 px-10 d-flex flex-column align-center justify-center"
                style="min-height: 260px">
                <ATimeRangePicker @update:value="monthStore.addRange($event, sectionId)" />
            </div>

            <!-- Range table -->
            <ARangeTable @update:removed="monthStore.deleteRange($event, sectionId)"
                :ranges="((monthStore.month?.ranges ?? []) as AntelopeRange[])" />
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

const { currentRoute } = useRouter();
const monthStore = useMonthStore();
const sectionStore = useSectionStore();

enum FilterType { ONLY_DAY, MONTH };

const filterType = ref<FilterType>(FilterType.ONLY_DAY);
const { inputValue: selectedDateValue, setDate } = useDateInput(new Date());

const sectionId = computed<string>(() => {
    const sectionId = currentRoute.value?.query?.section
    if (!sectionId || typeof sectionId !== 'string') return '';
    return sectionId
});
const noSection = computed<boolean>(() => !sectionId.value.length);
const foundSection = computed<AntelopeSection | undefined>(() => sectionStore.sections
    .find(s => s.id === sectionId.value) as AntelopeSection | undefined);

const { perform, isRunning } = useTask(async () => {
    try {
        if (noSection.value) return;
        await monthStore.resolveMonth(AntelopeMonth.getMonthId(new Date()), sectionId.value)
    } catch (err) {
        console.log(err);
        alert(err);
    }
});

watch(() => currentRoute.value, () => {
    perform();
}, { deep: true, immediate: true })
</script>
