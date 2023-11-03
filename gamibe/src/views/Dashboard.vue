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
                v-for="earning in earnings"
                :key="earning.id"
                :icon="earning.source?.charAt(0)"
                :title="earning.source"
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
                v-for="saving in savings"
                :key="saving.id"
                :title="saving.title"
                :amount-saved="saving.saved_amount"
                :amount-goal="saving.goal_amount"
                :image-src="saving.image_src"
                :image-alt="saving.image_alt"
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
                v-for="transaction in transactions"
                :key="transaction.id"
                :title="transaction.title"
                :category="transaction.category"
                :amount="transaction.amount"
                :date="transaction.date"
            />
        </GridSystem>

        <h1 class="mt-10 flex flex-col items-center justify-center text-xs">
            <div v-for="(todo, id) in test" :key="id" class="bg-rose-900">
                <span>Nombre: {{ todo.name }} {{ todo.last_name }}</span>
            </div>
            <ul>
                <li>{{ settings }}</li>
            </ul>
        </h1>
    </main>
</template>

<script setup lang="ts">
import DraggableSlider from '@/components/UI/DraggableSlider.vue'
import GridSystem from '@/components/UI/GridSystem.vue'
import EarningCard from '@/components/cards/EarningCard.vue'
import SavingCard from '@/components/cards/SavingCard.vue'
import TransactionCard from '@/components/cards/TransactionCard.vue'

import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, doc, query, where, orderBy, limit } from 'firebase/firestore'

import { earningsCollection, savingsCollection } from '@/configs/firebase'

// Database
const db = useFirestore()

// Queries
const earningQuery = query(earningsCollection, orderBy('createdAt', 'desc'), limit(9))
const savingQuery = query(savingsCollection, orderBy('completion_percentage', 'desc'), limit(4))
const testQuery = query(
    collection(db, 'test'),
    where('name', '>=', 'odar'),
    where('name', '<=', 'odar~'),
    orderBy('name'),
    limit(10)
)

// Data
const earnings = useCollection(earningQuery)
const savings = useCollection(savingQuery)
const test = useCollection(testQuery)
const settings = useDocument(doc(db, 'test', '7Nq3SHYGNUgDmRADQ02Z'))

const transactions = [
    {
        id: 1,
        title: 'Adobe Illustrator',
        category: 'Subscription Fee',
        amount: -32,
        date: new Date()
    },
    { id: 2, title: 'Dribble', category: 'Subscription Fee', amount: -15, date: new Date() },
    { id: 3, title: 'Sony Camera', category: 'Shopping Fee', amount: -200, date: new Date() },
    { id: 4, title: 'PayPal', category: 'Salary', amount: 32, date: new Date() }
]
</script>
