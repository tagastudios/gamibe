<template>
    <main>
        <h1 class="sr-only m-auto text-5xl font-black">Calendar</h1>
        <div
            v-if="true"
            class="mx-auto flex w-full max-w-[600px] flex-col items-center justify-center gap-2"
        >
            <div
                class="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-md border border-blue-600 p-2 shadow-inner shadow-blue-500"
            >
                <p class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300">
                    Expense
                    <span class="block aspect-square w-2 rounded-full bg-red-500"></span>
                </p>
                <p class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300">
                    Income
                    <span class="block aspect-square w-2 rounded-full bg-green-500"></span>
                </p>
                <p class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300">
                    Saving
                    <span class="block aspect-square w-2 rounded-full bg-blue-500"></span>
                </p>
                <p class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300">
                    Transaction
                    <span class="block aspect-square w-2 rounded-full bg-yellow-500"></span>
                </p>
                <p class="flex items-center gap-1 text-center text-xs font-semibold text-gray-300">
                    Today
                    <span
                        class="block aspect-square w-4 rounded-full border border-blue-400"
                    ></span>
                </p>
            </div>
            <RadioBtnSlider
                v-model="profile.settings.filterCalendar"
                group="calendar-range-view"
                :options="calendarOptions"
            />
            <!-- <button
                class="w-full rounded-md bg-blue-600 p-2 font-bold text-white hover:bg-blue-700"
                @click="moveToday"
            >
                Today
            </button> -->
        </div>
        <div class="flex w-full justify-center px-0 py-4">
            <VCalendar
                ref="calendar"
                is-dark
                trim-weeks
                :first-day-of-week="2"
                :attributes="calendarData"
                :view="profile.settings.filterCalendar + 'ly'"
                class="main-calendar"
            />
        </div>
        <GridSystem
            v-if="listViewFromCalendar.length"
            type="list"
            class="mx-auto flex w-full max-w-[600px] justify-center px-0 pb-8"
        >
            <MultiPurposeCard
                v-for="item in listViewFromCalendar"
                exact-date
                :key="item.id + item.exactDate"
                :id="item.id"
                :name="item.name"
                :nickname="item.nickname"
                :website="item.website"
                :category="item.category"
                :amount="item.amount"
                :since="item.startAt"
                :date="item.exactDate"
                :frequency="item.frequency"
                :type="item.type"
                :paid="
                    item.paidDates?.some(
                        (paid: any) =>
                            paid.toDate().toDateString() === item.exactDate.toDateString()
                    )
                "
                :expand="selectedCard === item.id"
                @select-card="selectCard($event)"
                @paid="cardAction('paid', item)"
                @edit="cardAction('edit', item)"
                @delete-all="cardAction('delete-all', item)"
                @delete-this="cardAction('delete-this', item)"
            />
        </GridSystem>
        <p
            v-else
            class="mx-auto flex w-full max-w-[600px] justify-center px-0 pb-8 pt-2 text-center"
        >
            Didn't found a record in the calendar. <br />
            Try moving around the calendar...
        </p>
        <ConfettiExplosion
            v-if="showConfetti"
            :particleCount="200"
            :particleSize="10"
            :duration="3000"
            style="position: absolute; left: 0; top: 0"
        />
    </main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import { Timestamp } from 'firebase/firestore'
import { useUser } from '@/composables/useUser'
import { useCalendar } from '@/composables/useCalendar'
import { useWeek } from '@/composables/shared/useTime'
import { useFilteredData } from '@/composables/useFilteredData'

import ConfettiExplosion from 'vue-confetti-explosion'

import RadioBtnSlider from '@/components/UI/RadioBtnSlider.vue'
import GridSystem from '@/components/UI/GridSystem.vue'
import MultiPurposeCard from '@/components/cards/MultiPurposeCard.vue'

const {
    payBill,
    deleteBill,
    deleteBillDate,
    payEarning,
    deleteEarning,
    deleteEarningDate,
    profile
} = useUser()
const { getCalendarAttrs } = useCalendar()
const { getNextDateByFrequency } = useWeek()
const { calendarViewData, listViewFromCalendar, refreshListViewFromCalendar } = useFilteredData()

// Refresh Calendar
const calendar: any = ref(null)
const timer: any = ref(null)

onMounted(() => {
    moveToday()
    refreshListViewFromCalendar(calendar.value)
})

watch(
    () => profile.settings.filterCalendar,
    (val) => {
        if (timer.value) {
            clearTimeout(timer.value)
            timer.value = null
        }
        if (val === 'week')
            timer.value = setTimeout(() => {
                moveToday()
            }, 100)
    }
)

const moveToday = () => {
    calendar.value.move(new Date())
}

// Calendar Options
const calendarOptions = [
    {
        id: 'week',
        label: 'Week',
        altLabel: '',
        disabled: false
    },
    { id: 'month', label: 'Month', altLabel: '', disabled: false }
]

// Calendar View Data
const calendarData = computed(() => {
    const calendarData: any = []

    calendarViewData.value?.forEach((data: any) => {
        calendarData.push(getCalendarAttrs(data, { mode: 'page', type: data.type }))
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

// Calendar Card Actions
const selectedCard: any = ref(null)
const selectCard = (id: string) => {
    selectedCard.value = selectedCard.value === id ? null : id
}

const cardAction = (action: string, item: any) => {
    if (action === 'paid') {
        togglePaid(item)
    } else if (action === 'delete-all') {
        deleteAll(item)
    } else if (action === 'delete-this') {
        deleteThis(item)
    } else if (action === 'edit') {
        // console.log('edit')
    }
}

const togglePaid = (customData: any) => {
    const { id, exactDate: date, frequency, type, paidDates } = customData
    if (!id || !date || !frequency || !type) return

    const alreadyPaid = paidDates?.some((paid: any) => paid.toDate().getTime() === date.getTime())
    if (!alreadyPaid) explodeConfetti()

    const findNextAvailablePaymentDate: any = (_date: any) => {
        const nextDate: any = getNextDateByFrequency(_date, frequency)
        const isADeletedDate = customData.deletedDates?.some(
            (deleted: any) => deleted.toDate().getTime() === nextDate.getTime()
        )
        const isAPaidDate = paidDates?.some(
            (paid: any) => paid.toDate().getTime() === nextDate.getTime()
        )
        if (isADeletedDate) return findNextAvailablePaymentDate(nextDate)
        else if (isAPaidDate) return findNextAvailablePaymentDate(nextDate)
        else return nextDate
    }

    const nextPaymentDate = alreadyPaid
        ? date
        : findNextAvailablePaymentDate(JSON.parse(JSON.stringify(date)))

    if (type === 'bill')
        payBill(id, Timestamp.fromDate(date), customData, nextPaymentDate, alreadyPaid)
    else if (type === 'earning')
        payEarning(id, Timestamp.fromDate(date), customData, nextPaymentDate, alreadyPaid)
}

const deleteAll = (customData: any) => {
    const { id, exactDate: date, frequency, type } = customData
    if (!id || !date || !frequency || !type) return

    if (type === 'bill') deleteBill(id)
    else if (type === 'earning') deleteEarning(id)
}

const deleteThis = (customData: any) => {
    const { id, exactDate: date, frequency, type } = customData
    if (!id || !date || !frequency || !type) return

    if (type === 'bill') deleteBillDate(id, Timestamp.fromDate(date))
    else if (type === 'earning') deleteEarningDate(id, Timestamp.fromDate(date))
}

// Confetti
const showConfetti = ref(false)
const explodeConfetti = async () => {
    showConfetti.value = false
    await nextTick()
    showConfetti.value = true
}
</script>

<style>
.main-calendar {
    width: 100%;
    height: 100%;
    max-width: 600px;
}
</style>
