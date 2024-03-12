<template>
    <main class="px-0">
        <div v-if="todayAndOverdueBills.data.length">
            <div class="flex items-center justify-between px-6 pb-6">
                <h2 class="text-3xl font-semibold">Today</h2>
                <p class="text-base font-bold text-blue-500">
                    {{ formatCurrency(todayAndOverdueBills.total) }}
                </p>
            </div>
            <GridSystem type="list" class="px-6 pb-6">
                <BillCard
                    v-for="bill in todayAndOverdueBills.data"
                    :key="bill.id"
                    :name="bill.name"
                    :category="bill.category"
                    :amount="bill.amount"
                    :date="bill.nextPayment ? bill.nextPayment.toDate() : bill.startAt.toDate()"
                />
            </GridSystem>
        </div>

        <div v-if="bills.thisWeek.data.length">
            <div class="flex items-center justify-between px-6 pb-6">
                <h2 class="text-3xl font-semibold">This Week</h2>
                <p class="text-base font-bold text-blue-500">
                    {{ formatCurrency(bills.thisWeek.total) }}
                </p>
            </div>

            <GridSystem type="list" class="px-6 pb-6">
                <BillCard
                    v-for="bill in bills.thisWeek.data"
                    :key="bill.id"
                    :name="bill.name"
                    :category="bill.category"
                    :amount="bill.amount"
                    :date="bill.nextPayment ? bill.nextPayment.toDate() : bill.startAt.toDate()"
                />
            </GridSystem>
        </div>

        <div v-if="bills.nextWeek.data.length">
            <div class="flex items-center justify-between px-6 pb-6">
                <h2 class="text-3xl font-semibold">Next Week</h2>
                <p class="text-base font-bold text-blue-500">
                    {{ formatCurrency(bills.nextWeek.total) }}
                </p>
            </div>

            <GridSystem type="list" class="px-6 pb-6">
                <BillCard
                    v-for="bill in bills.nextWeek.data"
                    :key="bill.id"
                    :name="bill.name"
                    :category="bill.category"
                    :amount="bill.amount"
                    :date="bill.nextPayment ? bill.nextPayment.toDate() : bill.startAt.toDate()"
                />
            </GridSystem>
        </div>

        <div v-if="bills.upcoming.data.length">
            <div class="flex items-center justify-between px-6 pb-6">
                <h2 class="text-3xl font-semibold">10 Upcoming</h2>
                <p class="text-base font-bold text-blue-500">
                    {{ formatCurrency(bills.upcoming.total) }}
                </p>
            </div>

            <GridSystem type="list" class="px-6 pb-6">
                <BillCard
                    v-for="bill in bills.upcoming.data"
                    :key="bill.id"
                    :name="bill.name"
                    :category="bill.category"
                    :amount="bill.amount"
                    :date="bill.nextPayment ? bill.nextPayment.toDate() : bill.startAt.toDate()"
                />
            </GridSystem>
        </div>
    </main>
</template>

<script setup lang="ts">
import GridSystem from '@/components/UI/GridSystem.vue'
import BillCard from '@/components/cards/BillCard.vue'
import { useUser } from '@/composables/useUser'
import { useCurrency } from '@/composables/shared/useHelpers'
import { computed } from 'vue'

const { bills } = useUser()
const { formatCurrency } = useCurrency()

const todayAndOverdueBills = computed(() => {
    const data = [...bills.overdue.data, ...bills.today.data]
    const total = bills.overdue.total + bills.today.total
    return { data, total }
})
</script>
