<template>
    <fieldset :id="id" class="space-y-4">
        <legend class="sr-only">{{ group }}</legend>
        <div v-for="item in options" :key="item.id">
            <label
                :for="item.id"
                class="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            >
                <p class="text-gray-700 dark:text-gray-200">{{ item.label }}</p>

                <p v-if="item.altLabel" class="text-gray-900 dark:text-white">
                    {{ item.altLabel }}
                </p>

                <input
                    type="radio"
                    class="sr-only"
                    :name="groupUUID"
                    :value="item.id"
                    :id="item.id"
                    :checked="modelValue === item.id"
                    v-model="modelValue"
                />
            </label>
        </div>
    </fieldset>
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
const groupUUID = computed(() => `radio-${props.group}-${Math.random().toString(36).substr(2, 9)}`)
</script>
