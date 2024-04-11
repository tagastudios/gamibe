<template>
    <main class="px-0">
        <div v-if="todayAndOverdue.data.length">
            <div class="flex items-center justify-between px-6 pb-2">
                <h2 class="text-2xl font-semibold">Today</h2>
                <p class="text-base">
                    <span class="font-bold text-blue-500" v-if="todayAndOverdue.total.add">{{
                        formatCurrency(todayAndOverdue.total.add)
                    }}</span>
                    <span v-if="todayAndOverdue.total.add && todayAndOverdue.total.sub"> | </span>
                    <span class="font-bold text-red-500" v-if="todayAndOverdue.total.sub">{{
                        formatCurrency(todayAndOverdue.total.sub)
                    }}</span>
                </p>
            </div>
            <GridSystem type="list" class="px-6 pb-10">
                <BillCard
                    v-for="item in todayAndOverdue.data"
                    :key="item.id"
                    :name="item.name"
                    :category="item.category"
                    :amount="item.amount"
                    :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
                />
            </GridSystem>
        </div>

        <div v-if="thisWeek.data.length">
            <div class="flex items-center justify-between px-6 pb-2">
                <h2 class="text-2xl font-semibold">This Week</h2>
                <p class="text-base">
                    <span class="font-bold text-blue-500" v-if="thisWeek.total.add">{{
                        formatCurrency(thisWeek.total.add)
                    }}</span>
                    <span v-if="thisWeek.total.add && thisWeek.total.sub"> | </span>
                    <span class="font-bold text-red-500" v-if="thisWeek.total.sub">{{
                        formatCurrency(thisWeek.total.sub)
                    }}</span>
                </p>
            </div>

            <GridSystem type="list" class="px-6 pb-10">
                <BillCard
                    v-for="item in thisWeek.data"
                    :key="item.id"
                    :name="item.name"
                    :category="item.category"
                    :amount="item.amount"
                    :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
                />
            </GridSystem>
        </div>

        <div v-if="nextWeek.data.length">
            <div class="flex items-center justify-between px-6 pb-2">
                <h2 class="text-2xl font-semibold">Next Week</h2>
                <p class="text-base">
                    <span class="font-bold text-blue-500" v-if="nextWeek.total.add">{{
                        formatCurrency(nextWeek.total.add)
                    }}</span>
                    <span v-if="nextWeek.total.add && nextWeek.total.sub"> | </span>
                    <span class="font-bold text-red-500" v-if="nextWeek.total.sub">{{
                        formatCurrency(nextWeek.total.sub)
                    }}</span>
                </p>
            </div>

            <GridSystem type="list" class="px-6 pb-10">
                <BillCard
                    v-for="item in nextWeek.data"
                    :key="item.id"
                    :name="item.name"
                    :category="item.category"
                    :amount="item.amount"
                    :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
                />
            </GridSystem>
        </div>

        <div v-if="upcoming.data.length">
            <div class="flex items-center justify-between px-6 pb-2">
                <h2 class="text-2xl font-semibold">10 Upcoming</h2>
                <p class="text-base">
                    <span class="font-bold text-blue-500" v-if="upcoming.total.add">{{
                        formatCurrency(upcoming.total.add)
                    }}</span>
                    <span v-if="upcoming.total.add && upcoming.total.sub"> | </span>
                    <span class="font-bold text-red-500" v-if="upcoming.total.sub">{{
                        formatCurrency(upcoming.total.sub)
                    }}</span>
                </p>
            </div>

            <GridSystem type="list" class="px-6 pb-10">
                <BillCard
                    v-for="item in upcoming.data"
                    :key="item.id"
                    :name="item.name"
                    :category="item.category"
                    :amount="item.amount"
                    :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
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

const { bills, earnings } = useUser()
const { formatCurrency } = useCurrency()

const allData = computed(() => {
    return {
        today: {
            total: {
                add: earnings.today.total,
                sub: bills.today.total
            },
            data: [...bills.today.data, ...earnings.today.data].sort(sortedList)
        },
        overdue: {
            total: {
                add: earnings.overdue.total,
                sub: bills.overdue.total
            },
            data: [...bills.overdue.data, ...earnings.overdue.data].sort(sortedList)
        },
        thisWeek: {
            total: {
                add: earnings.thisWeek.total,
                sub: bills.thisWeek.total
            },
            data: [...bills.thisWeek.data, ...earnings.thisWeek.data].sort(sortedList)
        },
        nextWeek: {
            total: {
                add: earnings.nextWeek.total,
                sub: bills.nextWeek.total
            },
            data: [...bills.nextWeek.data, ...earnings.nextWeek.data].sort(sortedList)
        },
        upcoming: {
            total: {
                add: earnings.upcoming.total,
                sub: bills.upcoming.total
            },
            data: [...bills.upcoming.data, ...earnings.upcoming.data].sort(sortedList)
        }
    }
})

const sortedList = (a: any, b: any) => a.nextPayment.toDate() - b.nextPayment.toDate()

const todayAndOverdue = computed(() => {
    const data = [...allData.value.overdue.data, ...allData.value.today.data].sort(sortedList)
    const total = {
        add: allData.value.today.total.add + allData.value.overdue.total.add,
        sub: allData.value.today.total.sub + allData.value.overdue.total.sub
    }
    return { data, total }
})

const thisWeek = computed(() => {
    const data = allData.value.thisWeek.data
    const total = allData.value.thisWeek.total
    return { data, total }
})

const nextWeek = computed(() => {
    const data = allData.value.nextWeek.data
    const total = allData.value.nextWeek.total
    return { data, total }
})

const upcoming = computed(() => {
    const data = allData.value.upcoming.data
    const total = allData.value.upcoming.total
    return { data, total }
})
</script>
