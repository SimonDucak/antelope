<template>
    <th class="text-left">
        <span class="mr-1" style="cursor: pointer" @click="$emit('update:type', componentType)">
            <slot></slot>
        </span>
        <template v-if="componentType === type">
            <v-icon v-if="method === 0" size="x-small" @click="$emit('update:method', 1)" color="success"
                icon="mdi-sort-ascending"></v-icon>
            <v-icon v-if="method === 1" size="x-small" @click="$emit('update:method', 0)" color="success"
                icon="mdi-sort-descending"></v-icon>
        </template>
    </th>
</template>

<script lang="ts" setup>
defineProps({
    method: { required: true, type: Number },
    type: { required: true, type: Number },
    componentType: { required: true, type: Number },
})

defineEmits(['update:method', 'update:type']);
</script>