<template>
    <div
        class="relative flex w-full items-center rounded-md border border-blue-600 text-center font-bold shadow-inner shadow-blue-500"
    >
        <label
            v-for="item in options"
            :for="item.id"
            :key="item.id"
            class="w-full rounded-md p-2 transition-all duration-300"
            :class="
                modelValue === item.id
                    ? 'bg-blue-600 font-semibold text-white'
                    : 'bg-transparent  text-gray-300 hover:bg-blue-700'
            "
        >
            {{ item.label }}
            <input
                v-model="modelValue"
                :name="groupUUID"
                :value="item.id"
                :id="item.id"
                type="radio"
                class="sr-only"
            />
        </label>
        <div class="absolute left-0 top-0 h-full w-1/2 rounded-md bg-blue-600" />
    </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

type OptionsType = {
    id: string
    label: string
    altLabel?: string
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

const id = computed(() => `radio-${props.group}`)
const groupUUID = computed(() => `${id.value}-${Math.random().toString(36).substr(2, 9)}`)
</script>
