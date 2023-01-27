<template>
    <div class="d-flex flex-column align-center">
        <ATimer @update:value="$emit('update:value', $event)" v-if="selectedMode === RangePickerMode.TIMER"
            class="mb-3" />
        <ARangeDatePicker @update:value="$emit('update:value', $event)" v-else class="mb-3" />
        <p class="text-body-2">
            <span v-if="selectedMode === RangePickerMode.TIMER">If you want to enter specific time</span>
            <span v-else>If you want to show timer</span>
            click
            <u @click="toggleMode" class="text-success" style="cursor: pointer">here</u>
        </p>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ATimer from "@/components/ATimer.vue";
import ARangeDatePicker from "@/components/ARangeDatePicker.vue";

defineEmits(['update:value']);

enum RangePickerMode {
    TIMER, DATE_PICKER
}

const selectedMode = ref<RangePickerMode>(RangePickerMode.TIMER);

const toggleMode = () => {
    selectedMode.value = selectedMode.value === RangePickerMode.TIMER ?
        RangePickerMode.DATE_PICKER :
        RangePickerMode.TIMER;
};
</script>