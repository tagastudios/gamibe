<template>
    <a
        class="group relative aspect-video w-full cursor-pointer select-none overflow-hidden rounded-2xl text-slate-800"
    >
        <div
            :class="`absolute z-10 m-auto flex h-full w-full flex-col justify-between p-4 text-xl ${
                !imageSrc
                    ? 'bg-zinc-100 transition-colors duration-300 group-hover:bg-zinc-400'
                    : ''
            }`"
        >
            <div class="flex h-3/5 w-full flex-col justify-between lg:h-1/2">
                <p class="w-11/12 truncate text-base text-slate-600">
                    {{ title }}
                </p>
                <p class="text-2xl font-semibold">{{ formattedAmountSaved }}</p>
            </div>
            <Bar
                :height="28"
                :options="chartOptions"
                :data="chartData"
                style="border-radius: 9999px"
            />
        </div>

        <ChevronRightIcon
            class="absolute right-0 top-0 z-10 h-1/5 w-1/5 translate-y-1/2 text-slate-800"
        />

        <div
            class="absolute left-0 top-0 z-[5] m-auto h-full w-full bg-zinc-100 transition-colors duration-300 group-hover:bg-zinc-500"
        >
            <img
                v-if="imageSrc"
                :src="imageSrc"
                :alt="imageAlt || `Saving for ${title}`"
                class="h-full max-h-full w-full min-w-full bg-zinc-100 object-cover object-center opacity-25"
            />
        </div>
    </a>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import ChartjsPluginStacked100 from 'chartjs-plugin-stacked100'
import { Chart as ChartJS, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(ChartjsPluginStacked100, Tooltip, BarElement, CategoryScale, LinearScale)

import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import { computed } from 'vue'
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    amountSaved: {
        type: Number,
        required: true
    },
    amountGoal: {
        type: Number,
        required: true
    },
    imageSrc: {
        type: String
    },
    imageAlt: {
        type: String
    }
})

const formattedAmountSaved = computed(() => {
    if (!props.amountSaved) return '$0'
    else if (typeof props.amountSaved == 'number') {
        const currency = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(props.amountSaved)
        return currency
    }
})

const chartData = computed(() => {
    return {
        labels: [''],
        datasets: [
            {
                label: 'Saved',
                data: [props.amountSaved],
                backgroundColor: [`hsl(${randomNumberUpTo(props.amountGoal)},60%,40%)`]
            },
            {
                label: 'Remaining',
                data: [
                    props.amountSaved > props.amountGoal ? 0 : props.amountGoal - props.amountSaved
                ],
                backgroundColor: [`hsl(${randomNumberUpTo(props.amountGoal)},60%,85%)`]
            }
        ]
    }
})

const chartOptions = {
    responsive: true,
    indexAxis: 'y',
    scales: {
        x: {
            display: false
        },
        y: {
            display: false,
            stacked: true
        }
    },
    plugins: {
        stacked100: { enable: true, precision: 2 }
    }
}

function randomNumberUpTo(input: number, max: number = 360) {
    if (!input || typeof input !== 'number') return 0
    return input % max
}
</script>

<style scoped></style>
