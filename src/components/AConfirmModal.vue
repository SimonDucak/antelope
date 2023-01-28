<template>
    <div class="d-flex justify-center align-center">
        <div class="w-100" style="max-width: 600px">
            <v-card class="px-6 py-6 w-100">
                <h3 class="text-h5 mb-6">
                    <slot name="title"></slot>
                </h3>

                <p class="text-body-2 mb-2">
                    <slot name="text"></slot>
                </p>

                <v-card-actions>
                    <v-btn @click="perform" :loading="isRunning" color="success">
                        Confirm
                    </v-btn>
                    <v-btn @click="$emit('update:visible', false)">Close</v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useTask } from '@/composable/use_task';
import { PropType } from 'vue';

const props = defineProps({
    visible: {
        required: false,
        type: Boolean as PropType<boolean>,
    },
    confirm: {
        required: true,
        type: Function as PropType<() => Promise<void>>,
    }
});

const { isRunning, perform } = useTask(async () => {
    try {
        await props.confirm();
    } catch (err) {
        console.error(err);
    }
})
</script>