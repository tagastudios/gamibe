<template>
    <main class="flex h-full flex-col justify-between">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-blue-700">Confirmation</h2>
            <p class="mb-8 mt-4 text-base">
                Please make sure all your information is correct before it's saved!
            </p>
            <VCalendar
                is-dark
                :first-day-of-week="2"
                :attributes="calendarData"
                class="main-calendar"
            >
                <template #footer>
                    <ul class="w-full px-4 pb-3">
                        <li
                            v-if="billForDb.startAt"
                            class="flex w-full flex-col rounded-md bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-700"
                        >
                            <div v-if="billForDb.startAt">Start on: {{ formattedDate }}</div>
                            <div v-if="billForDb.name">
                                Bill: {{ billForDb.name }}
                                <span v-if="billForDb.nickname">({{ billForDb.nickname }})</span>
                            </div>
                            <div v-if="billForDb.website">Website: {{ billForDb.website }}</div>
                            <div v-if="billForDb.category">Category: {{ billForDb.category }}</div>
                            <div v-if="billForDb.frequency" class="capitalize">
                                Frequency: {{ billForDb.frequency }}
                            </div>
                            <div v-if="billForDb.amount" class="font-semibold text-red-700">
                                Amount: ${{ billForDb.amount }}
                            </div>
                        </li>
                    </ul>
                </template>
            </VCalendar>
        </div>
        <RouterLink @click="addToDb" to="/" class="mx-auto w-full max-w-lg">
            <button
                class="mb-12 h-16 w-full rounded-3xl bg-blue-700 text-xl text-white outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline lg:rounded-full"
            >
                Save Bill
            </button>
        </RouterLink>
    </main>
</template>

<script setup lang="ts">
import { useBillStore } from '@/stores/store'
import { useCalendar } from '@/composables/useCalendar'
import { useUser } from '@/composables/useUser'
import { useDateFormat } from '@vueuse/core'

const { billForDb, resetBill } = useBillStore()
const { getCalendarAttrs } = useCalendar()
const { addBill } = useUser()

const calendarData: any = getCalendarAttrs(billForDb, { mode: 'create' })
const formattedDate = useDateFormat(billForDb.startAt, 'dddd, MMMM Do, YYYY')

const addToDb = () => {
    addBill(billForDb)
    resetBill()
}
</script>

<style>
.main-calendar {
    width: 100%;
    /* height: 100%; */
    max-width: 600px;
}
</style>
