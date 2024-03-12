<template>
    <main>
        <h1 class="m-auto text-5xl font-black">Calendar</h1>
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
                            :key="key"
                            class="block px-3 text-gray-700 dark:text-gray-300"
                        >
                            <div class="">
                                Bill: {{ customData.name }} | Amount: ${{ customData.amount }}
                            </div>
                            <div
                                v-if="isBillPaid(day.date, customData.paidBills)"
                                class="mt-2 w-full py-1 text-center font-bold text-green-600"
                            >
                                Yoy already paid this bill!
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
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useUser } from '@/composables/useUser'
import { useCalendar } from '@/composables/useCalendar'
import { Timestamp } from 'firebase/firestore'
import { useWeek } from '@/composables/shared/useTime'

const calendar: any = ref(null)

const { bills, payBill } = useUser()
const { getCalendarAttrs } = useCalendar()
const { getNextDateByFrequency } = useWeek()

onMounted(() => {
    moveToday()
})

const moveToday = () => {
    calendar.value.move(new Date())
}

const calendarData: any = computed(() => {
    return [
        ...bills.allBills.data.map((bill: any) =>
            getCalendarAttrs(bill, { mode: 'page', customPopover: true })
        ),
        {
            highlight: {
                color: 'indigo',
                fillMode: 'outline'
            },
            dates: [new Date()]
        }
    ]
})

const isBillPaid = (date: Date, paidBills: Date[]) => {
    return paidBills?.some((paid: any) => paid.toDate().toDateString() === date.toDateString())
}

const markAsPaid = (id: string, date: Date, customData: any) => {
    payBill(
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
