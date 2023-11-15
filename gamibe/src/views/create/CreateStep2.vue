<template>
    <main class="h-full">
        <div class="h-full">
            <h2 class="text-3xl font-bold text-blue-700">{{ layoutMapper[createType]?.title }}</h2>
            <p class="mb-8 mt-4 text-base">
                {{ layoutMapper[createType]?.description }}
            </p>
            <div v-if="isIncome" class="mx-auto mt-16 flex w-full max-w-lg flex-col gap-8">
                <BaseInput v-model="data.name" placeholder="Income name" type="text" />
                <BaseInput v-model="data.date" placeholder="Date of the deposit" type="date" />
                <BaseDropdown v-model="data.account" placeholder="Select an account" />
                <p>
                    Based on your input, you would have $2,000 left out of $3,000 in your Chase Bank
                    - Account ending in 5543
                </p>
                <BaseAmountSelector v-model="data.amount" />
            </div>
        </div>
        <RouterLink :to="`/create/${createType}/confirm`" class="mx-auto w-full max-w-lg">
            <button
                @click="console.log(data)"
                class="h-16 w-full rounded-3xl bg-blue-700 text-xl text-white outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline lg:rounded-full"
            >
                Continue
            </button>
        </RouterLink>
    </main>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import BaseInput from '@/components/UI/BaseInput.vue'
import BaseDropdown from '@/components/UI/BaseDropdown.vue'
import BaseAmountSelector from '@/components/UI/BaseAmountSelector.vue'

const data = reactive({
    name: '',
    date: new Date(),
    account: {},
    amount: 0
})

const route = useRoute()

const createType: any = computed(() => route.params.type)
const isIncome = computed(() => createType.value === 'income')

const layoutMapper: any = {
    income: {
        title: 'Money Bloom (Income)',
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
