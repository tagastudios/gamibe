<template>
    <div
        class="flex cursor-default select-none items-center justify-between rounded-lg bg-zinc-100 p-4 text-slate-600 shadow-md"
    >
        <div class="flex h-full w-10/12 items-center">
            <component
                :is="categoryMapper[category] ?? QuestionMarkCircleIcon"
                :class="` aspect-square w-1/12 rounded-full p-1 sm:w-1/12 sm:p-1 md:w-1/12 md:p-1 lg:w-2/12 xl:w-3/12 xl:p-1 2xl:p-4`"
                :style="{
                    backgroundColor: bgColor,
                    color: textColor
                }"
            />
            <div
                class="flex w-11/12 flex-col justify-center pl-2 sm:w-11/12 md:w-11/12 lg:w-10/12 xl:w-9/12"
            >
                <h3 class="w-full truncate text-lg font-semibold capitalize md:text-xl">
                    {{ name }}
                    <span class="w-full text-sm capitalize text-gray-500 md:text-base"
                        >({{ category }})</span
                    >
                </h3>
                <p class="w-full text-sm capitalize text-gray-500 md:text-base">
                    Due {{ formattedDate }}
                </p>
            </div>
        </div>
        <p class="w-2/12 min-w-fit text-right text-base font-semibold md:text-lg lg:text-xl">
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
