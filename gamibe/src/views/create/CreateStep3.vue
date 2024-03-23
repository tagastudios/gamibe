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
                            v-if="confirmationData.startAt"
                            class="flex w-full flex-col rounded-md bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-700"
                        >
                            <div v-if="confirmationData.startAt">Start on: {{ formattedDate }}</div>
                            <div v-if="confirmationData.name">
                                Bill: {{ confirmationData.name }}
                                <span v-if="confirmationData.nickname"
                                    >({{ confirmationData.nickname }})</span
                                >
                            </div>
                            <div v-if="confirmationData.website">
                                Website: {{ confirmationData.website }}
                            </div>
                            <div v-if="confirmationData.category">
                                Category: {{ confirmationData.category }}
                            </div>
                            <div v-if="confirmationData.frequency" class="capitalize">
                                Frequency: {{ confirmationData.frequency }}
                            </div>
                            <div v-if="confirmationData.amount">
                                Amount:
                                <span
                                    class="font-black underline decoration-red-700 decoration-wavy decoration-2 underline-offset-[3px] drop-shadow-lg"
                                >
                                    ${{ confirmationData.amount?.toLocaleString() }}
                                </span>
                            </div>
                        </li>
                    </ul>
                </template>
            </VCalendar>
        </div>
        <RouterLink @click="addToDb" to="/" class="mx-auto w-full max-w-lg">
            <button
                class="mb-12 h-16 w-full rounded-3xl bg-blue-700 text-xl capitalize text-white outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline lg:rounded-full"
            >
                Save {{ createType }}
            </button>
        </RouterLink>
    </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useBillStore, useEarningStore } from '@/stores/store'
import { useCalendar } from '@/composables/useCalendar'
import { useUser } from '@/composables/useUser'
import { useDateFormat } from '@vueuse/core'

const { billForDb, resetBill } = useBillStore()
const { earningForDb, resetEarning } = useEarningStore()
const { getCalendarAttrs } = useCalendar()
const { addBill, addEarning } = useUser()

const route = useRoute()
const createType: any = computed(() => route.params.type)

const confirmationData = computed(() => {
    if (createType.value === 'earning') return earningForDb
    else return billForDb // default
})

const formattedDate = computed(() =>
    useDateFormat(confirmationData.value?.startAt, 'dddd, MMMM Do, YYYY')
)

const calendarData: any = computed(() =>
    getCalendarAttrs(confirmationData.value, { mode: 'create' })
)

const addToDb = () => {
    if (createType.value === 'bill') {
        addBill(billForDb)
        resetBill()
    } else if (createType.value === 'earning') {
        addEarning(earningForDb)
        resetEarning()
    }
}
</script>

<style>
.main-calendar {
    width: 100%;
    /* height: 100%; */
    max-width: 600px;
}
</style>
