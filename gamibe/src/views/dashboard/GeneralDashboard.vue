<template>
    <main class="px-0">
        <div class="flex items-center justify-between px-6 pb-6">
            <h2 class="text-3xl font-semibold">Earnings</h2>
            <p class="cursor-pointer text-base font-bold text-blue-500 hover:text-blue-600">
                See All
            </p>
        </div>
        <DraggableSlider class="px-6 pb-6">
            <EarningCard
                v-for="earning in earningData"
                :key="earning.id"
                :icon="earning.source?.charAt(0)"
                :name="earning.source"
                :amount="earning.amount"
            />
        </DraggableSlider>

        <div class="flex items-center justify-between px-6 pb-6">
            <h2 class="text-3xl font-semibold">Savings</h2>
            <p class="cursor-pointer text-base font-bold text-blue-500 hover:text-blue-600">
                See All
            </p>
        </div>

        <GridSystem class="px-6 pb-6">
            <SavingCard
                v-for="saving in savingData"
                :key="saving.id"
                :name="saving.name"
                :amount-saved="saving.savedAmount"
                :amount-goal="saving.goalAmount"
                :image-src="saving.imageSrc"
                :image-alt="saving.imageAlt"
            />
        </GridSystem>

        <div class="flex items-center justify-between px-6 pb-6">
            <h2 class="text-3xl font-semibold">Transactions</h2>
            <p class="cursor-pointer text-base font-bold text-blue-500 hover:text-blue-600">
                See All
            </p>
        </div>

        <GridSystem type="list" class="px-6 pb-6">
            <TransactionCard
                v-for="transaction in transactionData"
                :key="transaction.id"
                :name="transaction.name"
                :category="transaction.category"
                :amount="transaction.amount"
                :date="new Date(transaction.datePosted?.toDate())"
            />
        </GridSystem>
    </main>
</template>

<script setup lang="ts">
import DraggableSlider from '@/components/UI/DraggableSlider.vue'
import GridSystem from '@/components/UI/GridSystem.vue'
import EarningCard from '@/components/cards/EarningCard.vue'
import SavingCard from '@/components/cards/SavingCard.vue'
import TransactionCard from '@/components/cards/TransactionCard.vue'
import { useDatabase } from '@/composables/db'

const { useEarnings, useSavings, useTransactions } = useDatabase()

const { earningData } = useEarnings()
const { savingData } = useSavings()
const { transactionData } = useTransactions()
</script>
