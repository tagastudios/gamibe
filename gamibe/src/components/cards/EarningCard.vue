<template>
    <div
        class="flex aspect-square w-48 flex-shrink-0 flex-col items-center justify-around rounded-3xl bg-orange-950"
    >
        <p
            class="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 p-6 text-2xl font-semibold capitalize text-gray-900"
        >
            {{ icon ?? '' }}
        </p>
        <div class="flex flex-col items-center justify-center">
            <p class="text-lg font-normal capitalize text-white">
                {{ title ?? '' }}
            </p>
            <p class="text-2xl font-semibold text-white">{{ formattedAmount }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    icon: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
})

const formattedAmount = computed(() => {
    if (!props.amount) return '$0'
    else if (typeof props.amount == 'number') {
        const currency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(props.amount)
        return currency
    }
})
</script>
