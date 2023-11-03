<template>
    <div
        class="flex items-center justify-between rounded-lg bg-zinc-100 p-4 text-slate-600 shadow-md"
    >
        <div class="flex h-full w-full items-center">
            <img src="" alt="" class="aspect-square h-full rounded-full bg-slate-900" />
            <div class="flex w-full flex-col justify-center px-4">
                <h3 class="w-full text-xl font-semibold">{{ title }}</h3>
                <p class="w-full text-base text-gray-500">{{ category }}</p>
            </div>
        </div>
        <p :class="`text-xl ${amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`">{{ amount }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
})
</script>

<style scoped></style>
