<template>
    <div
        class="flex w-full cursor-default select-none items-center justify-between gap-2 rounded-lg bg-zinc-100 p-2 text-slate-600 shadow-md"
    >
        <component
            :is="categoryMapper[category] ?? QuestionMarkCircleIcon"
            :class="`aspect-square min-w-[14%] rounded-full p-0`"
            :style="{
                backgroundColor: bgColor,
                color: textColor
            }"
        />
        <div class="flex w-full flex-col justify-center truncate pb-1">
            <h3 class="truncate text-lg font-semibold capitalize md:text-xl">
                {{ name }}
            </h3>
            <p class="truncate text-sm capitalize text-gray-500 md:text-base">
                Due {{ formattedDate }}
            </p>
        </div>
        <p class="min-w-max text-right text-base font-semibold md:text-lg lg:text-xl">
            {{ formattedBillAmount }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import {
    QuestionMarkCircleIcon,
    ComputerDesktopIcon,
    ShoppingBagIcon,
    BanknotesIcon
} from '@heroicons/vue/24/solid'
import { useCurrency } from '@/composables/shared/useHelpers'

const { formatCurrency } = useCurrency()

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: ''
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
})

const categoryMapper: { [key: string]: any } = {
    subscription: ComputerDesktopIcon,
    shopping: ShoppingBagIcon,
    salary: BanknotesIcon
}

const colorMapper: { [key: string]: any } = {
    subscription: {
        bg: '#ffedd5',
        color: '#fdba74'
    },
    shopping: {
        bg: '#fee2e2',
        color: '#fca5a5'
    },
    salary: {
        bg: '#d1fae5',
        color: '#6ee7b7'
    }
}

const textColor = computed(() => {
    if (categoryMapper[props.category]) {
        return colorMapper[props.category].color
    } else {
        return '#475569'
    }
})

const bgColor = computed(() => {
    if (categoryMapper[props.category]) {
        return colorMapper[props.category].bg
    } else {
        return '#d4d4d8'
    }
})

const formattedBillAmount = computed(() => formatCurrency(props.amount))

const formattedDate = useTimeAgo(props.date)
</script>
