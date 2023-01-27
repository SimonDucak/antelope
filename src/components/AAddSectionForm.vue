<template>
    <div class="d-flex justify-center align-center">
        <div class="w-100" style="max-width: 600px">
            <v-card class="px-6 py-6 w-100">
                <h3 class="text-h5 mb-6">Add new section</h3>

                <v-text-field class="mb-2" v-model="section.name" :rules="rules" size="x-small"
                    placeholder="Gym, Learning Spanish, Work..." label="Name of section*" variant="outlined" />

                <v-text-field v-model="section.icon" size="x-small" placeholder="mdi-star" label="Icon of section"
                    variant="outlined" />

                <p class="text-body-2 mb-2">
                    List of the all icons you can find <a href="https://pictogrammers.com/library/mdi/"
                        target="_blank"><u>here</u></a>. Please enter your icon in mdi-name-of-icon format.
                </p>

                <v-card-actions>
                    <v-btn @click="perform" :loading="isRunning" :disabled="invalid" color="success">Add section</v-btn>
                    <v-btn @click="$emit('update:visible', false)">Close</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { AntelopeSection } from '@/model/AntelopeSection';
import { computed, PropType, ref } from 'vue';
import { useSectionStore } from '@/store/section';
import { useTask } from '@/composable/use_task';

defineProps({
    visible: {
        required: false,
        type: Boolean as PropType<boolean>,
    }
});

const emit = defineEmits(['update:visible']);

const rules = [
    ((v: string) => !!v || 'Field is required'),
];

const invalid = computed<boolean>(() => {
    return !section.value.name;
});

const section = ref<AntelopeSection>(AntelopeSection.emptySection());

const sections = useSectionStore();

const { isRunning, perform } = useTask(async () => {
    try {
        await sections.addNewSection(section.value as AntelopeSection);
        emit('update:visible', false);
    } catch (error) {
        console.error(error);
    }
})
</script>