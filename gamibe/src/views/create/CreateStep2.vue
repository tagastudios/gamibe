<template>
    <main class="flex h-full flex-col justify-between">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-blue-700">{{ layoutMapper[createType]?.title }}</h2>
            <p class="mb-8 mt-4 text-base">
                {{ layoutMapper[createType]?.description }}
            </p>
            <div v-if="isEarning" class="mx-auto flex w-full max-w-lg flex-col gap-8">
                <BaseInput v-model="earning.name" placeholder="Income name" type="text" />
                <BaseInput
                    v-model="earning.nickname"
                    placeholder="Nickname (optional)"
                    type="text"
                />
                <BaseInput v-model="earning.website" placeholder="Website (optional)" type="text" />
                <BaseDropdown
                    v-model="earning.category"
                    v-model:options="categoryOptions"
                    placeholder="Select a category"
                />
                <BaseInput
                    v-model="earning.startAt"
                    placeholder="Date of the deposit"
                    type="date"
                />
                <BaseDropdown
                    v-model="earning.frequency"
                    v-model:options="frequencyOptions"
                    placeholder="Select a frequency"
                />
                <!-- <BaseDropdown v-model="earning.account" placeholder="Select an account" /> -->
                <BaseAmountSelector
                    v-model="earning.amount"
                    placeholder="Amount in $"
                    type="number"
                />
            </div>
            <div v-if="isBill" class="mx-auto flex w-full max-w-lg flex-col gap-8">
                <BaseInput v-model="bill.name" placeholder="Bill name" type="text" />
                <BaseInput v-model="bill.nickname" placeholder="Nickname (optional)" type="text" />
                <BaseInput v-model="bill.website" placeholder="Website (optional)" type="text" />
                <BaseDropdown
                    v-model="bill.category"
                    v-model:options="categoryOptions"
                    placeholder="Select a category"
                />
                <BaseInput v-model="bill.startAt" placeholder="Due Date" type="date" />
                <BaseDropdown
                    v-model="bill.frequency"
                    v-model:options="frequencyOptions"
                    placeholder="Select a frequency"
                />
                <BaseAmountSelector v-model="bill.amount" placeholder="Amount in $" type="number" />
            </div>
        </div>
        <RouterLink :to="`/create/${createType}/confirm`" class="mx-auto w-full max-w-lg">
            <button
                class="mb-12 h-16 w-full rounded-3xl bg-blue-700 text-xl text-white outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline lg:rounded-full"
            >
                Continue
            </button>
        </RouterLink>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import BaseInput from '@/components/UI/BaseInput.vue'
import BaseDropdown from '@/components/UI/BaseDropdown.vue'
import BaseAmountSelector from '@/components/UI/BaseAmountSelector.vue'

import { useBillStore, useEarningStore } from '@/stores/store'
import { useFrequency } from '@/composables/shared/useTime'

const { bill } = useBillStore()
const { earning } = useEarningStore()
const { options: frequencyOptions } = useFrequency()

const route = useRoute()

const createType: any = computed(() => route.params.type)
const isEarning = computed(() => createType.value === 'earning')
const isBill = computed(() => createType.value === 'bill')

const categoryOptions = computed(() => {
    return [
        {
            id: 'streaming',
            title: 'Streaming',
            description: 'Online movies and series',
            image: 'https://thecomputerwarriors.com/wp-content/uploads/2021/07/streaming-948x640-1.jpg'
        }
    ]
})

const layoutMapper: any = {
    bill: {
        title: 'Bill Management',
        description: `Never miss a due date. Track and manage your bills with ease.`
    },
    earning: {
        title: 'Money Bloom (Earning)',
        description: `Sow the seeds of financial growth with every deposit. Whether it's your monthly salary, freelance earnings, or investment returns, each contribution cultivates your money garden. Tap here to add income and witness your financial landscape flourish.`
    },
    expense: {
        title: 'Smart Spending (Expense)',
        description: `Whether it's your morning coffee, grocery shopping, or a dinner out, track your expenses here. Become the financial gardener, carefully pruning unnecessary spending, and nurturing a healthier financial ecosystem.`
    },
    goal: {
        title: 'Dream Pursuit (Goal)',
        description: `Dreaming of a vacation, a new gadget, or saving for a down payment on a house? Define your goals here and let your financial Tamagotchi guide you. As you contribute, see your dreams take shape, one financial milestone at a time.`
    }
}
</script>
