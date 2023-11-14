<template>
    <div
        :class="`${
            type === 'list' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
        } grid gap-6  lg:grid-cols-4`"
    >
        <slot name="default"></slot>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    type: {
        type: String,
        default: 'grid'
    }
})
</script>
