<template>
    <div class="d-flex justify-center align-center">
        <div class="w-100" style="max-width: 600px">
            <v-card class="px-6 py-6 w-100">
                <h3 class="text-h5 mb-6">Add new section</h3>

                <v-text-field size="x-small" placeholder="Enter name" label="Name of section*" variant="outlined" />

                <v-text-field size="x-small" placeholder="mdi-star" label="Icon of section" variant="outlined" />

                <p class="text-body-2 mb-2">
                    List of the all icons you can find <a href="https://pictogrammers.com/library/mdi/"
                        target="_blank"><u>here</u></a>. Please enter your icon in mdi-name-of-icon format.
                </p>

                <v-card-actions>
                    <v-btn color="success">Add section</v-btn>
                    <v-btn @click="$emit('update:visible', false)">Close</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
    visible: {
        required: false,
        type: Boolean as PropType<boolean>,
    }
});

defineEmits(['update:visible']);
</script>