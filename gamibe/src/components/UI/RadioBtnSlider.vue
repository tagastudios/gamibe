<template>
    <div
        class="relative flex h-10 w-full items-center rounded-md border border-blue-600 text-center font-bold shadow-inner shadow-blue-500"
    >
        <label
            v-for="item in options"
            :for="item.id"
            :key="item.id"
            class="z-10 w-full rounded-md p-2 transition-all duration-300"
            :class="`
                ${modelValue === item.id ? 'font-semibold text-white' : ' text-gray-300'}
                    ${item.disabled ? 'cursor-not-allowed text-opacity-60' : 'cursor-pointer'}
            `"
            style="line-height: 0.75rem"
        >
            {{ item.label }}
            <span
                :class="`text-xs transition-all duration-500 ${
                    item.altLabel && item.id !== modelValue ? 'block' : 'hidden'
                }`"
            >
                {{ item.altLabel }}
            </span>
            <input
                v-model="modelValue"
                :name="groupUUID"
                :value="item.id"
                :id="item.id"
                :disabled="item.disabled"
                type="radio"
                class="sr-only"
            />
        </label>
        <div
            :class="`absolute left-0 top-0 flex h-full items-center justify-center rounded-md bg-blue-600 font-bold capitalize transition-transform duration-500`"
            :style="sliderStyle"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

type OptionsType = {
    id: string
    label: string
    altLabel?: string
    disabled?: boolean
}

const modelValue = defineModel({
    type: null,
    default: ''
})

const props = defineProps({
    group: {
        required: true,
        type: String as PropType<string>
    },
    options: {
        required: true,
        type: Array as PropType<OptionsType[]>
    }
})

const sliderStyle = computed(() => {
    const translateX = props.options.findIndex((item) => item.id === modelValue.value) * 100
    const width = 100 / props.options.length
    return {
        width: `${width}%`,
        transform: `translateX(${translateX}%)`
    }
})

const id = computed(() => `radio-${props.group}`)
const groupUUID = computed(() => `${id.value}-${Math.random().toString(36).substr(2, 9)}`)
</script>
