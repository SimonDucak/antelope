<template>
    <div class="d-flex justify-center align-center">
        <div class="w-100" style="max-width: 600px">
            <v-card class="px-6 py-6 w-100">
                <h3 class="text-h5 mb-6">
                    <template v-if="!updateSection">Add new section</template>
                    <template v-else>Edit {{ updateSection.name }}</template>
                </h3>

                <v-text-field class="mb-2" v-model="section.name" :rules="rules"
                    placeholder="Gym, Learning Spanish, Work..." label="Name of section*" variant="outlined" />

                <v-text-field v-model="section.icon" placeholder="mdi-star" label="Icon of section"
                    variant="outlined" />

                <p class="text-body-2 mb-2">
                    List of the all icons you can find <a href="https://pictogrammers.com/library/mdi/"
                        target="_blank"><u>here</u></a>. Please enter your icon in mdi-name-of-icon format.
                </p>

                <v-card-actions>
                    <v-btn @click="perform" :loading="isRunning" :disabled="invalid" color="success">
                        <template v-if="!updateSection">Add section</template>
                        <template v-else>Edit section</template>
                    </v-btn>
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

const props = defineProps({
    visible: {
        required: false,
        type: Boolean as PropType<boolean>,
    },
    updateSection: {
        required: false,
        type: Object as PropType<AntelopeSection>,
    }
});

const emit = defineEmits(['update:visible']);

const rules = [
    ((v: string) => !!v || 'Field is required'),
];

const invalid = computed<boolean>(() => {
    return !section.value.name;
});

const section = ref<AntelopeSection>(props.updateSection ?
    AntelopeSection.duplicateSection(props.updateSection) :
    AntelopeSection.emptySection());

const sections = useSectionStore();

const { isRunning, perform } = useTask(async () => {
    try {
        if (props.updateSection) {
            await sections.updateSection(section.value as AntelopeSection);
        } else {
            await sections.addNewSection(section.value as AntelopeSection);
        }
        emit('update:visible', false);
    } catch (error) {
        console.error(error);
    }
})
</script>