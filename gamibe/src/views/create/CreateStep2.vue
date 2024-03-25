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
                    v-model:options="categoryOptions[createType]"
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
                    v-model:options="categoryOptions[createType]"
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

const categoryOptions: any = {
    bill: [
        // Housing
        {
            id: 'housing',
            title: 'Housing',
            description: 'Mortgage, rent, property taxes, repairs, HOA fees.',
            image: ''
        },

        // Transportation
        {
            id: 'transportation',
            title: 'Transportation',
            description:
                'Car payment, car warranty, gas, tires, maintenance and oil changes, parking fees, repairs, registration and DMV fees.',
            image: ''
        },

        // Food
        {
            id: 'food',
            title: 'Food',
            description: 'Groceries, restaurants, pet food.',
            image: ''
        },

        // Utilities
        {
            id: 'utilities',
            title: 'Utilities',
            description: 'Electricity, water, garbage, phones, cable, internet.',
            image: ''
        },

        // Clothing
        {
            id: 'clothing',
            title: 'Clothing',
            description: 'Adults’ clothing, adults’ shoes, children’s clothing, children’s shoes.',
            image: ''
        },

        // Medical/Healthcare
        {
            id: 'medical',
            title: 'Medical/Healthcare',
            description:
                'Primary care, dental care, specialty care, urgent care, medications, medical devices.',
            image: ''
        },

        // Insurance
        {
            id: 'insurance',
            title: 'Insurance',
            description:
                'Health insurance, homeowner’s or renter’s insurance, home warranty or protection plan, auto insurance, life insurance, disability insurance.',
            image: ''
        },

        // Household Items/Supplies
        {
            id: 'household',
            title: 'Household Items/Supplies',
            description:
                'Toiletries, laundry detergent, dishwasher detergent, cleaning supplies, tools.',
            image: ''
        },

        // Personal
        {
            id: 'personal',
            title: 'Personal',
            description:
                'Gym memberships, haircuts, salon services, cosmetics, babysitter, subscriptions.',
            image: ''
        },

        // Debt
        {
            id: 'debt',
            title: 'Debt',
            description: 'Personal loans, student loans, credit cards.',
            image: ''
        },

        // Retirement
        {
            id: 'retirement',
            title: 'Retirement',
            description: 'Financial planning, investing.',
            image: ''
        },

        // Education
        {
            id: 'education',
            title: 'Education',
            description: 'Children’s college, your college, school supplies, books.',
            image: ''
        },

        // Savings
        {
            id: 'savings',
            title: 'Savings',
            description:
                'Emergency fund, big purchases like a new mattress or laptop, other savings.',
            image: ''
        },

        // Gifts/Donations
        {
            id: 'gifts',
            title: 'Gifts/Donations',
            description: 'Birthday, anniversary, wedding, Christmas, special occasion, charities.',
            image: ''
        },

        // Entertainment
        {
            id: 'entertainment',
            title: 'Entertainment',
            description:
                'Alcohol and/or bars, games, movies, concerts, vacations, subscriptions (Netflix, Amazon, Hulu, etc.).',
            image: ''
        }
    ],
    earning: [
        // Salary & Wages
        {
            id: 'salary',
            title: 'Salary & Wages',
            description: 'Regular income from employment or work.',
            image: ''
        },

        // Self-employed income
        {
            id: 'self-employed',
            title: 'Self-employed income',
            description: 'Income earned from self-employment or freelance work.',
            image: ''
        },

        // Bonus
        {
            id: 'bonus',
            title: 'Bonus',
            description:
                'Extra payment received in addition to regular income, often as a reward or incentive.',
            image: ''
        },

        // Tips
        {
            id: 'tips',
            title: 'Tips',
            description: 'Gratuities or additional payments received for services rendered.',
            image: ''
        },

        // Tax refund
        {
            id: 'tax-refund',
            title: 'Tax refund',
            description: 'Money returned by the government after overpaying taxes.',
            image: ''
        },

        // Gifts received
        {
            id: 'gifts-received',
            title: 'Gifts received',
            description: 'Money or items received as gifts from others.',
            image: ''
        },

        // Alimony received
        {
            id: 'alimony',
            title: 'Alimony received',
            description: 'Payment received from a former spouse as part of a divorce settlement.',
            image: ''
        },

        // Child support received
        {
            id: 'child-support',
            title: 'Child support received',
            description:
                'Payment received from a former spouse or parent for the support of a child.',
            image: ''
        },

        // Rental income
        {
            id: 'rental-income',
            title: 'Rental income',
            description: 'Income received from renting out property or real estate.',
            image: ''
        },

        // Dividend income
        {
            id: 'dividend-income',
            title: 'Dividend income',
            description:
                'Income earned from dividends paid on investments, such as stocks or mutual funds.',
            image: ''
        },

        // Interest earned
        {
            id: 'interest-earned',
            title: 'Interest earned',
            description:
                'Income earned from interest payments on savings accounts, bonds, or other investments.',
            image: ''
        }
    ]
}

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
