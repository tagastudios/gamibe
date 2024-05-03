<script setup lang="ts">
import { defineProps, computed } from 'vue'

const emits = defineEmits(['click'])

const props = defineProps({
    big: {
        type: Boolean,
        default: false
    },
    circle: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'blue',
        validator: (value: string) =>
            ['blue', 'blue-gradient-1', 'red', 'green', 'white'].includes(value)
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const isColor = computed(() => {
    switch (props.color) {
        case 'white':
            return 'from-gray-100 shadow-white ring-white'
        case 'red':
            return 'from-red-950 shadow-red-500 ring-red-500'
        case 'green':
            return 'from-green-950 shadow-green-500 ring-green-500'
        case 'blue-gradient-1':
            return 'from-blue-950 shadow-blue-700 ring-blue-700 to-blue-800'
        default:
            return 'from-blue-950 shadow-blue-500 ring-blue-500'
    }
})

const isBig = computed(() => {
    return props.big ? 'h-14 rounded-2xl' : ''
})

const isCircle = computed(() => {
    return props.circle ? 'aspect-square h-full rounded-full' : 'rounded-lgg w-full'
})
</script>

<template>
    <div
        @click="disabled ? null : emits('click')"
        class="flex cursor-pointer select-none flex-col gap-2 bg-gradient-to-br to-transparent p-2 text-zinc-200 shadow-inner ring-1"
        :class="isColor + ' ' + isCircle + ' ' + isBig"
        :style="disabled ? 'filter: opacity(0.3) grayscale(0.5); cursor: not-allowed' : ''"
    >
        <slot />
    </div>
</template>
