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
                        <div class="text-center font-bold text-gray-700 dark:text-gray-300">
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
                    <div class="w-full px-4 pb-3">
                        <button
                            class="w-full rounded-md bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-700"
                            @click="moveToday"
                        >
                            Today
                        </button>
                    </div>
                </template>
            </VCalendar>
        </div>
        <div class="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 px-0">
            <p
                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
                Expense
                <span class="block aspect-square w-2 rounded-full bg-red-500"></span>
            </p>
            <p
                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
                Income
                <span class="block aspect-square w-2 rounded-full bg-green-500"></span>
            </p>
            <p
                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
                Saving
                <span class="block aspect-square w-2 rounded-full bg-blue-500"></span>
            </p>
            <p
                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
                Transaction
                <span class="block aspect-square w-2 rounded-full bg-yellow-500"></span>
            </p>
            <p
                class="flex items-center gap-1 text-center text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
                Today
                <span class="block aspect-square w-4 rounded-full border border-blue-400"></span>
            </p>
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUser } from '@/composables/useUser'
import { useCalendar } from '@/composables/useCalendar'
import { Timestamp } from 'firebase/firestore'
import { useWeek } from '@/composables/shared/useTime'

const calendar: any = ref(null)

const { bills, payBill, earnings, payEarning, profile } = useUser()
const { getCalendarAttrs } = useCalendar()
const { getNextDateByFrequency } = useWeek()

onMounted(() => {
    moveToday()
})

const moveToday = () => {
    calendar.value.move(new Date())
}

const calendarData = computed(() => {
    const data = new Map()
    const calendarData: any = []

    if (profile.settings.showBillsOnly)
        bills.allBills.data.forEach((bill: any) => data.set(bill.id, bill))
    else if (profile.settings.showBillsAndEarnings) {
        bills.allBills.data.forEach((bill: any) => data.set(bill.id, bill))
        earnings.allEarnings.data.forEach((earning: any) => data.set(earning.id, earning))
    } else if (profile.settings.showGeneralDashboard) {
        bills.allBills.data.forEach((bill: any) => data.set(bill.id, bill))
        earnings.allEarnings.data.forEach((earning: any) => data.set(earning.id, earning))
        // Add more data here
    }

    ;[...data].map(([id, data]) =>
        calendarData.push(
            getCalendarAttrs(data, { mode: 'page', customPopover: true, type: data.type })
        )
    )

    calendarData.push({
        highlight: {
            color: 'indigo',
            fillMode: 'outline'
        },
        dates: [new Date()]
    })

    return calendarData
})

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
</script>

<style>
.main-calendar {
    width: 100%;
    height: 100%;
    max-width: 600px;
}
</style>
