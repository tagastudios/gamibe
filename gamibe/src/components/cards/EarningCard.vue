<template>
    <div
        class="flex aspect-square w-48 flex-shrink-0 cursor-default flex-col items-center justify-around rounded-3xl bg-orange-950"
    >
        <p
            class="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 p-6 text-2xl font-semibold capitalize text-gray-900 sm:text-base md:text-lg"
        >
            {{ icon ?? '' }}
        </p>
        <div class="flex flex-col items-center justify-center">
            <p class="text-lg font-normal capitalize text-white">
                {{ name ?? '' }}
            </p>
            <p class="text-2xl font-semibold text-white sm:text-base md:text-lg">
                {{ formattedAmount }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '@/composables/shared/useHelpers'

const { formatCurrency } = useCurrency()

const props = defineProps({
    icon: {
        type: String
    },
    name: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    }
})

const formattedAmount = computed(() => formatCurrency(props.amount, { minimumFractionDigits: 0 }))
</script>
