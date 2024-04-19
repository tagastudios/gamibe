<template>
    <main>
        <h1 class="sr-only m-auto text-5xl font-black">Calendar</h1>
        <div class="flex w-full justify-center px-0 py-4">
            <VCalendar
                ref="calendar"
                is-dark
                :first-day-of-week="2"
                :attributes="calendarData"
                class="main-calendar"
            >
                <template #day-popover="{ day, format, masks, attributes }">
                    <div class="pt-2">
                        <div class="text-center font-bold text-gray-300">
                            {{ format(day.date, masks.dayPopover) }}
                        </div>
                    </div>
                    <ul class="px-4 py-2">
                        <li
                            v-for="{ key, customData } in attributes"
                            :key="key + customData.modifiedAt"
                            class="block px-3 text-gray-700 dark:text-gray-300"
                        >
                            <div v-if="customData.type === 'bill'">
                                <div class="">
                                    Bill: {{ customData.name }} | Amount: ${{ customData.amount }}
                                </div>
                                <div
                                    v-if="isEntryPaid(day.date, customData.paidDates)"
                                    class="mt-2 w-full py-1 text-center font-bold text-green-600"
                                >
                                    You already paid this bill!
                                </div>
                                <div v-else class="py-2">
                                    <div
                                        class="text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Do you want to mark this bill as Paid?
                                    </div>
                                    <button
                                        class="w-full rounded-md bg-green-600 py-1 font-bold text-white hover:bg-green-700"
                                        @click="markAsPaid(key, day.date, customData)"
                                    >
                                        Mark as Paid!
                                    </button>
                                </div>
                            </div>
                            <div v-else-if="customData.type === 'earning'">
                                <div class="">
                                    Earning: {{ customData.name }} | Amount: ${{
                                        customData.amount
                                    }}
                                </div>
                                <div
                                    v-if="isEntryPaid(day.date, customData.paidDates)"
                                    class="mt-2 w-full py-1 text-center font-bold text-green-600"
                                >
                                    You received this earning already!
                                </div>
                                <div v-else class="py-2">
                                    <div
                                        class="text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
                                    >
                                        Did you already got this earning??
                                    </div>
                                    <button
                                        class="w-full rounded-md bg-green-600 py-1 font-bold text-white hover:bg-green-700"
                                        @click="markAsPaid(key, day.date, customData)"
                                    >
                                        Earning Cashed!
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </template>
                <template #footer>
                    <div class="flex w-full flex-col items-center gap-2 px-4 pb-3">
                        {{ profile.settings.filterCalendar }}
                        <RadioBtnSlider
                            v-model="profile.settings.filterCalendar"
                            group="calendar-range-view"
                            :options="calendarOptions"
                        />
                        <button
                            class="w-full rounded-md bg-blue-600 p-2 font-bold text-white hover:bg-blue-700"
                            @click="moveToday"
                        >
                            Today
                        </button>
                        <div
                            class="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-md border border-blue-600 p-2 shadow-inner shadow-blue-500"
                        >
                            <p
                                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300"
                            >
                                Expense
                                <span
                                    class="block aspect-square w-2 rounded-full bg-red-500"
                                ></span>
                            </p>
                            <p
                                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300"
                            >
                                Income
                                <span
                                    class="block aspect-square w-2 rounded-full bg-green-500"
                                ></span>
                            </p>
                            <p
                                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300"
                            >
                                Saving
                                <span
                                    class="block aspect-square w-2 rounded-full bg-blue-500"
                                ></span>
                            </p>
                            <p
                                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300"
                            >
                                Transaction
                                <span
                                    class="block aspect-square w-2 rounded-full bg-yellow-500"
                                ></span>
                            </p>
                            <p
                                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300"
                            >
                                Today
                                <span
                                    class="block aspect-square w-4 rounded-full border border-blue-400"
                                ></span>
                            </p>
                        </div>
                    </div>
                </template>
            </VCalendar>
        </div>

        <GridSystem
            v-if="todayAndOverdue.data.length"
            type="list"
            class="mx-auto flex w-full max-w-[600px] justify-center px-0 pb-8"
        >
            <BillCard
                v-for="item in todayAndOverdue.data"
                :key="item.id"
                :name="item.name"
                :category="item.category"
                :amount="item.amount"
                :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
            />
        </GridSystem>

        <GridSystem
            v-if="thisWeek.data.length"
            type="list"
            class="mx-auto flex w-full max-w-[600px] justify-center px-0 pb-8"
        >
            <BillCard
                v-for="item in thisWeek.data"
                :key="item.id"
                :name="item.name"
                :category="item.category"
                :amount="item.amount"
                :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
            />
        </GridSystem>

        <GridSystem
            v-if="nextWeek.data.length"
            type="list"
            class="mx-auto flex w-full max-w-[600px] justify-center px-0 pb-8"
        >
            <BillCard
                v-for="item in nextWeek.data"
                :key="item.id"
                :name="item.name"
                :category="item.category"
                :amount="item.amount"
                :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
            />
        </GridSystem>

        <GridSystem
            v-if="upcoming.data.length"
            type="list"
            class="mx-auto flex w-full max-w-[600px] justify-center px-0 pb-8"
        >
            <BillCard
                v-for="item in upcoming.data"
                :key="item.id"
                :name="item.name"
                :category="item.category"
                :amount="item.amount"
                :date="item.nextPayment ? item.nextPayment.toDate() : item.startAt.toDate()"
            />
        </GridSystem>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { useUser } from '@/composables/useUser'
import { useCalendar } from '@/composables/useCalendar'
import { useWeek } from '@/composables/shared/useTime'
import { useFilteredData } from '@/composables/useFilteredData'

import GridSystem from '@/components/UI/GridSystem.vue'
import BillCard from '@/components/cards/BillCard.vue'
import RadioBtnSlider from '@/components/UI/RadioBtnSlider.vue'

const { payBill, payEarning, profile } = useUser()
const { getCalendarAttrs } = useCalendar()
const { getNextDateByFrequency } = useWeek()
const { calendarViewData, listViewData } = useFilteredData()

onMounted(() => {
    moveToday()
})

// Calendar Options
const calendarOptions = [
    {
        id: 'week',
        label: 'Week',
        altLabel: ''
    },
    { id: 'month', label: 'Month', altLabel: '' }
]

// Calendar View Data
const calendar: any = ref(null)

const calendarData = computed(() => {
    const calendarData: any = []

    calendarViewData.value?.forEach((data: any) => {
        calendarData.push(
            getCalendarAttrs(data, { mode: 'page', customPopover: true, type: data.type })
        )
    })

    calendarData.push({
        highlight: {
            color: 'indigo',
            fillMode: 'outline'
        },
        dates: [new Date()]
    })

    return calendarData
})

const moveToday = () => {
    calendar.value.move(new Date())
}

const isEntryPaid = (date: Date, paidDates: Date[]) => {
    return paidDates?.some((paid: any) => paid.toDate().toDateString() === date.toDateString())
}

const markAsPaid = (id: string, date: Date, customData: any) => {
    if (customData.type === 'bill')
        payBill(
            id,
            Timestamp.fromDate(date),
            customData,
            getNextDateByFrequency(date, customData.frequency)
        )
    else if (customData.type === 'earning')
        payEarning(
            id,
            Timestamp.fromDate(date),
            customData,
            getNextDateByFrequency(date, customData.frequency)
        )
}

// List View Data
const allData = listViewData

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

<style>
.main-calendar {
    width: 100%;
    height: 100%;
    max-width: 600px;
}
</style>
