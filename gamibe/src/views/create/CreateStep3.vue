<template>
    <main class="m-0 mx-auto flex h-full max-w-lg flex-col items-center justify-between gap-28">
        <div class="mb-8 max-h-[430px]">
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
                            v-if="confirmationData?.startAt"
                            class="flex w-full flex-col rounded-md bg-blue-600 px-3 py-1 font-bold text-white hover:bg-blue-700"
                        >
                            <div v-if="confirmationData.startAt">Start on: {{ formattedDate }}</div>
                            <div v-if="confirmationData.name" class="capitalize">
                                Bill: {{ confirmationData.name }}
                                <span v-if="confirmationData.nickname" class="capitalize"
                                    >({{ confirmationData.nickname }})</span
                                >
                            </div>
                            <div v-if="confirmationData.website">
                                Website: {{ confirmationData.website }}
                            </div>
                            <div v-if="confirmationData.category" class="capitalize">
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
        <div v-if="isValidEntry" class="z-10 w-full">
            <h3
                class="mb-2 text-center text-2xl font-black text-blue-700 underline decoration-slate-400 decoration-wavy"
            >
                Save &
            </h3>
            <div class="flex gap-2">
                <RouterLink :to="'/create/' + createType" @click="addToDb" class="flex-1">
                    <button
                        class="h-16 w-full rounded-xl bg-blue-700 text-xl capitalize text-white outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline lg:rounded-full"
                    >
                        Add More
                    </button>
                </RouterLink>
                <RouterLink to="/" @click="addToDb" class="flex-1">
                    <button
                        class="h-16 w-full rounded-xl bg-blue-700 text-xl capitalize text-white outline-blue-600 hover:bg-blue-800 hover:text-slate-200 active:outline lg:rounded-full"
                    >
                        Finish
                    </button>
                </RouterLink>
            </div>
        </div>
        <div v-else class="z-10 w-full">
            <h3
                class="mb-2 text-center text-2xl font-black text-blue-900 underline decoration-slate-600 decoration-wavy"
            >
                Save &
            </h3>
            <div class="flex gap-2">
                <button
                    disabled
                    class="h-16 w-full rounded-xl bg-blue-950 text-xl capitalize text-slate-500 outline-blue-600 lg:rounded-full"
                >
                    Add More
                </button>
                <button
                    disabled
                    class="h-16 w-full rounded-xl bg-blue-950 text-xl capitalize text-slate-500 outline-blue-600 lg:rounded-full"
                >
                    Finish
                </button>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

import { useBillStore, useEarningStore } from '@/stores/store'
import { useCalendar } from '@/composables/useCalendar'
import { useUser } from '@/composables/useUser'
import { useDateFormat } from '@vueuse/core'

const { billForDb, resetBill, isValidBill } = useBillStore()
const { earningForDb, resetEarning, isValidEarning } = useEarningStore()
const { getCalendarAttrs } = useCalendar()
const { addBill, addEarning } = useUser()

const route = useRoute()
const createType: any = computed(() => route.params.type)

const confirmationData = computed(() => {
    if (createType.value === 'earning') return earningForDb
    else if (createType.value === 'bill') return billForDb // default
})

const isValidEntry: ComputedRef<boolean | ''> = computed(() => {
    if (createType.value === 'earning') return isValidEarning
    else if (createType.value === 'bill') return isValidBill // default
})

const formattedDate = computed(
    () => useDateFormat(confirmationData.value?.startAt, 'dddd, MMMM Do, YYYY').value
)

const calendarData: any = computed(() =>
    getCalendarAttrs(confirmationData.value, { mode: 'create', type: createType.value })
)

const addToDb = () => {
    if (createType.value === 'bill' && isValidBill) {
        addBill(billForDb)
        resetBill()
    } else if (createType.value === 'earning' && isValidEarning) {
        addEarning(earningForDb)
        resetEarning()
    }
}
</script>

<style>
.main-calendar {
    width: 100%;
    height: auto;
}
</style>
